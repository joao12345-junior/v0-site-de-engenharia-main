import { NextResponse } from "next/server";
import { Resend } from "resend";
import { pool } from "../../../../lib/db/db";
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

// ─── Template do e-mail interno ─────────────────────────────────────────────
//
// [CONCEITO] E-mail HTML não é página web. Clientes de e-mail (principalmente
// Outlook desktop, que renderiza com o motor do Word) não confiam em
// flexbox/grid nem em cores oklch(). Por isso o layout usa <table> — chato
// de escrever, mas é o que renderiza igual em qualquer cliente — e as cores
// vêm convertidas pra hex a partir dos tokens de app/globals.css
// (--primary, --foreground, --muted-foreground, --border).
//
// O logo é referenciado pela URL pública do site (e-mail não pode embutir
// um arquivo local) — se o domínio mudar, esse link quebra.
const BRAND = {
	primary: "#800020",
	primaryDark: "#5C0017",
	foreground: "#1A1A1A",
	mutedForeground: "#71717A",
	border: "#E4E4E7",
	background: "#FFFFFF",
};

function buildContactEmailHtml(data: {
	name: string;
	email: string;
	phone: string;
	company: string;
	subject: string;
	message: string;
}): string {
	const FONT =
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

	const row = (label: string, value: string) => `
		<tr>
			<td style="padding: 14px 0; border-bottom: 1px solid ${BRAND.border}; font-family: ${FONT}; font-size: 11px; font-weight: 600; color: ${BRAND.mutedForeground}; text-transform: uppercase; letter-spacing: .06em; width: 110px; vertical-align: top;">
				${label}
			</td>
			<td style="padding: 14px 0; border-bottom: 1px solid ${BRAND.border}; font-family: ${FONT}; font-size: 15px; color: ${BRAND.foreground};">
				${value}
			</td>
		</tr>`;

	return `
<!DOCTYPE html>
<html lang="pt-BR">
<body style="margin:0; padding:0; background:#EEEEF0;">
	<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEEEF0; padding: 40px 16px;">
		<tr>
			<td align="center">
				<table role="presentation" width="580" cellpadding="0" cellspacing="0" style="max-width:580px; width:100%; background:${BRAND.background}; border-radius: 12px; overflow: hidden; border: 1px solid ${BRAND.border}; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
					<!-- Header: wordmark em texto, sem imagem -->
					<tr>
						<td style="background:${BRAND.primary}; padding: 28px 36px;">
							<span style="font-family: ${FONT}; font-size: 19px; font-weight: 700; letter-spacing: .12em; color: #FFFFFF;">OPTARE</span><br />
							<span style="font-family: ${FONT}; font-size: 10px; font-weight: 500; letter-spacing: .22em; color: rgba(255,255,255,0.75); text-transform: uppercase;">Engenharia</span>
						</td>
					</tr>
					<tr>
						<td style="height: 3px; background: linear-gradient(90deg, ${BRAND.primary}, ${BRAND.primaryDark});"></td>
					</tr>
 
					<tr>
						<td style="padding: 36px 36px 8px;">
							<p style="margin:0 0 6px; font-family: ${FONT}; font-size: 11px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: ${BRAND.primary};">
								Novo contato pelo site
							</p>
							<h1 style="margin:0 0 4px; padding-left: 14px; border-left: 4px solid ${BRAND.primary}; font-family: ${FONT}; font-size: 20px; font-weight: 700; line-height: 1.3; color: ${BRAND.foreground};">
								${sanitize(data.subject)}
							</h1>
						</td>
					</tr>
 
					<tr>
						<td style="padding: 20px 36px 0;">
							<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
								${row("Nome", sanitize(data.name))}
								${row("E-mail", `<a href="mailto:${sanitize(data.email)}" style="color:${BRAND.primary}; text-decoration:none; font-weight: 600;">${sanitize(data.email)}</a>`)}
								${row("Telefone", sanitize(data.phone))}
								${row("Empresa", sanitize(data.company))}
							</table>
						</td>
					</tr>
 
					<tr>
						<td style="padding: 24px 36px 36px;">
							<p style="margin: 0 0 10px; font-family: ${FONT}; font-size: 11px; font-weight: 600; color: ${BRAND.mutedForeground}; text-transform: uppercase; letter-spacing: .06em;">
								Mensagem
							</p>
							<p style="margin:0; text-align: start; padding: 18px 20px; background: #FAFAFA; border: 1px solid ${BRAND.border}; border-radius: 8px; font-family: ${FONT}; font-size: 15px; line-height: 1.65; color: ${BRAND.foreground};">
								${sanitize(data.message)}
							</p>
						</td>
					</tr>
 
					<tr>
						<td style="padding: 18px 36px; background:#FAFAFA; border-top: 1px solid ${BRAND.border};">
							<p style="margin:0; font-family: ${FONT}; font-size: 11px; line-height: 1.6; color: ${BRAND.mutedForeground};">
								Enviado automaticamente pelo formulário de contato de <a href="https://www.optare.com.br" style="color:${BRAND.mutedForeground};">optare.com.br</a>. Responda direto pra este e-mail pra falar com quem preencheu.
							</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>`;
}

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
			// [ATENÇÃO] Domínio de sandbox do Resend (onboarding@resend.dev).
			// Ele só entrega para o e-mail cadastrado na conta Resend — não
			// serve pra mandar e-mail pra clientes/terceiros. Está OK aqui
			// porque este e-mail é a notificação INTERNA (destinatário fixo
			// abaixo), não algo que vai pro cliente que preencheu o formulário.
			// Quando o domínio optare.com.br for verificado em Resend → Domains,
			// troca esse `from` por algo tipo "OPTARE Engenharia <naoresponda@optare.com.br>".
			from: "OPTARE Engenharia <onboarding@resend.dev>",
			to: "joaovpfarias@gmail.com",
			replyTo: body.email,
			subject: `[Contato site] ${sanitize(body.subject)}`,
			html: buildContactEmailHtml(body),
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
