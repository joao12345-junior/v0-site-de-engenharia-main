import { NextResponse } from "next/server";
import { Resend } from "resend";
import { pool } from "../../../lib/db";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";

// [CONCEITO] Lazy initialization — o cliente Resend é criado apenas
// quando a rota POST é chamada, não em tempo de build.
// Isso evita que o Next.js quebre o build quando a variável de ambiente
// não existe em determinados ambientes (ex: Preview sem RESEND_API_KEY).
//
// O padrão de lançar um erro explícito ("RESEND_API_KEY não configurada")
// é preferível a deixar o erro vir do construtor da biblioteca —
// mensagens de erro claras economizam horas de depuração.
function getResendClient(): Resend {
	const key = process.env.RESEND_API_KEY;
	if (!key) throw new Error("RESEND_API_KEY não configurada");
	return new Resend(key);
}

const sanitize = (str: string) =>
	String(str)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");

const contactSchema = z.object({
	name: z.string().min(1).max(255),
	email: z.string().email().max(254),
	phone: z.string().min(1).max(20),
	company: z.string().min(1).max(255),
	subject: z.string().min(1).max(255),
	message: z.string().min(1),
});

async function InsertEmailAttempt(
	email: string,
	ip_address: string,
): Promise<void> {
	await pool.query(
		`INSERT INTO site_optare_email.attempts (email, ip_address)
     VALUES ($1, $2)`,
		[email, ip_address],
	);
}

async function InsertEmailSuccess(
	data: z.infer<typeof contactSchema>,
	ip: string,
): Promise<void> {
	await pool.query(
		`INSERT INTO site_optare_email.mensagens (name, email, phone, company, subject, message, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		[
			data.name,
			data.email,
			data.phone,
			data.company,
			data.subject,
			data.message,
			ip,
		],
	);
}

async function GetEmailAttempts(
	email: string,
	ip_address: string,
): Promise<number> {
	const result = await pool.query(
		`SELECT COUNT(*) FROM site_optare_email.attempts
     WHERE ip_address = $1 AND email = $2 AND created_at > NOW() - INTERVAL '1 hour'`,
		[ip_address, email],
	);
	return Number(result.rows[0].count);
}

export async function POST(req: Request) {
	const ip_address =
		req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
		req.headers.get("x-real-ip") ??
		"unknown";

	const validation = contactSchema.safeParse(await req.json());
	if (!validation.success) {
		return NextResponse.json(
			{ message: "Dados inválidos", success: false },
			{ status: 400 },
		);
	}
	const body = validation.data;

	try {
		const attempts = await GetEmailAttempts(body.email, ip_address);
		if (attempts >= 5) {
			return NextResponse.json(
				{
					message: "Muitas tentativas, espere 1 hora para tentar novamente!",
					success: false,
				},
				{ status: 429 },
			);
		}
		await InsertEmailAttempt(body.email, ip_address);
	} catch (err: unknown) {
		Sentry.captureException(err);
		console.error("[/api/email] Erro ao verificar tentativas:", err);
		return NextResponse.json(
			{ message: "Erro interno", success: false },
			{ status: 500 },
		);
	}

	try {
		// [CONCEITO] O cliente é criado aqui — dentro da função, em runtime.
		// Se a variável não existir, o erro é capturado pelo catch abaixo
		// e retorna uma resposta 500 controlada, sem vazar detalhes internos.
		const resend = getResendClient();

		const { data, error } = await resend.emails.send({
			from: "onboarding@resend.dev",
			to: "joaovpfarias@gmail.com",
			subject: sanitize(body.subject),
			html: `
        <p>Prezado Administrador,</p>
        <ul>
          <li><strong>Nome:</strong> ${sanitize(body.name)}</li>
          <li><strong>Email:</strong> ${sanitize(body.email)}</li>
          <li><strong>Telefone:</strong> ${sanitize(body.phone)}</li>
          <li><strong>Empresa:</strong> ${sanitize(body.company)}</li>
          <li><strong>Mensagem:</strong> ${sanitize(body.message)}</li>
        </ul>
      `,
		});

		if (error) {
			Sentry.captureException(new Error(`Resend error: ${error.message}`));
			console.error("[/api/email] Erro Resend:", error);
			await InsertEmailAttempt(body.email, ip_address);
			return NextResponse.json(
				{ message: "Erro ao enviar email", success: false },
				{ status: 500 },
			);
		}

		await InsertEmailSuccess(body, ip_address);
		return NextResponse.json(
			{ message: "Email enviado com sucesso", success: true, id: data?.id },
			{ status: 200 },
		);
	} catch (err: unknown) {
		Sentry.captureException(err);
		console.error("[/api/email] Erro geral:", err);
		return NextResponse.json(
			{ message: "Erro interno", success: false },
			{ status: 500 },
		);
	}
}
