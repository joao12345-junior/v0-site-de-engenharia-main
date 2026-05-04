import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Converte a string do secret para o formato que a Web Crypto API entende
// Feito fora do handler para não recriar a cada requisição
const secret = new TextEncoder().encode(process.env.JWT_SECRET_ACCESS!);

export async function middleware(req: NextRequest) {
	const token = req.cookies.get("access_token")?.value;
	console.log(
		`\n[/middleware.ts] Token (access) recebido no middleware:, ${token}\n`,
	);

	if (!token)
		return NextResponse.redirect(new URL("/administrador_login", req.url));

	try {
		// jwtVerify é genuinamente assíncrona — usa Web Crypto API
		await jwtVerify(token, secret);
		return NextResponse.next();
	} catch (err: unknown) {
		// Token inválido, expirado ou mal formado
		console.error("\n[/middleware.ts] Erro ao verificar token: ", err);
		return NextResponse.redirect(new URL("/administrador_login", req.url));
	}
}

export const config = {
	matcher: ["/administrador/:path*"],
};
