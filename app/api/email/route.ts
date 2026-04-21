import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
	const body = await req.json();

	try {
		const resend = new Resend(process.env.RESEND_API_KEY);

		const { data, error } = await resend.emails.send({
			from: "onboarding@resend.dev",
			to: "joaovpfarias@gmail.com",
			subject: `${body.subject}`,
			html: `<p>Prezado Administrador,</p>
                <ul>
                <li><strong>Nome:</strong> ${body.name}</li>
                <li><strong>Email:</strong> ${body.email}</li>
                <li><strong>Telefone:</strong> ${body.phone}</li>
                <li><strong>Empresa:</strong> ${body.company}</li>
                <li><strong>Mensagem:</strong> ${body.message}</li>
                </ul>`,
		});

		if (error) {
			console.error("Erro Resend:", error);
			return NextResponse.json(
				{ message: "Erro ao enviar email", success: false },
				{ status: 500 },
			);
		}

		console.log("Email enviado, ID:", data?.id);

		return NextResponse.json(
			{
				message: "Email enviado com sucesso",
				success: true,
				id: data?.id, // útil pra debug
			},
			{ status: 200 },
		);
	} catch (err: any) {
		console.error("Erro geral:", err);

		return NextResponse.json(
			{
				message: "Erro interno",
				success: false,
			},
			{ status: 500 },
		);
	}
}
