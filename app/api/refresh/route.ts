// app/api/refresh/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { createTokenAccess } from "@/lib/token";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretRefresh = new TextEncoder().encode(process.env.JWT_SECRET_REFRESH!);

export async function POST(req: Request) {
	// Leia o refresh_token que deveria estar num cookie httpOnly
	const cookieStore = await cookies();
	const refresh_token = cookieStore.get("refresh_token")?.value;

	// Se não há refresh_token, a sessão não existe
	if (!refresh_token) {
		return NextResponse.json(
			{
				valid: false,
				message: "Sessão não encontrada",
			},
			{ status: 401 },
		);
	}

	try {
		// 1. Valida a assinatura e expiração do token
		await jwtVerify(refresh_token, secretRefresh);

		// 2. Busca a sessão pelo token
		const result = await pool.query(
			"SELECT * FROM site_optare_user.user WHERE refresh_token = $1",
			[refresh_token],
		);

		if (result.rowCount === 0) {
			return NextResponse.json(
				{ valid: false, message: "Sessão inválida." },
				{ status: 404 },
			);
		}

		const session = result.rows[0];

		// 3. Gera novo access_token
		const new_access_token = createTokenAccess(session.email);

		// 4. Define o novo access_token como cookie
		const response = NextResponse.json(
			{
				valid: true,
			},
			{ status: 200 },
		) as any;
		response.cookies.set("access_token", new_access_token, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: 60 * 15, // 15 minutos
			path: "/",
		});

		return response;
	} catch {
		// Token expirado ou mal formado - limpa a sessão
		await pool.query(
			`DELETE FROM site_optare_user.user WHERE refresh_token = $1`,
			[refresh_token],
		);
		return NextResponse.json(
			{ valid: false, message: "Sessão expirada" },
			{ status: 401 },
		);
	}
}
