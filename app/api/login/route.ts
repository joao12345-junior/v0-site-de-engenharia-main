import { NextResponse } from "next/server";
import { pool } from "../../../lib/db";
import { cookies } from "next/headers";
import { createTokenAccess, createTokenRefresh } from "@/lib/token";
import { createHashToken, verifyHash } from "@/lib/hash";
import { NIVEL_ACESSO } from "@/lib/constants/access-level";
import { z } from "zod";

const LoginSchema = z.object({
	email: z.string().email().max(254),
	password: z.string().min(1).max(128),
});

export async function POST(req: Request) {
	const body = await req.json();

	const ip =
		req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
		req.headers.get("x-real-ip") ??
		"unknown";

	const validation = LoginSchema.safeParse(body);
	if (!validation.success)
		return NextResponse.json(
			{
				message: "Dados inválidos",
			},
			{ status: 400 },
		);

	const { email, password } = validation.data;

	async function InsertUserAttempt() {
		await pool.query(
			`INSERT INTO site_optare_user.attempts (email, ip_address) 
         VALUES ($1, $2)`,
			[email, ip],
		);
	}

	async function GetUserAttempts(
		email: string,
		ip_address: string,
	): Promise<number> {
		const result = await pool.query(
			`SELECT COUNT(*) FROM site_optare_user.attempts 
       WHERE ip_address = $1 AND email = $2 AND created_at > NOW() - INTERVAL '10 minutes'`,
			[ip_address, email],
		);
		return Number(result.rows[0].count);
	}

	// Numero de tentativas
	try {
		const attempts = await GetUserAttempts(email, ip);
		if (Number(attempts) >= 5)
			return NextResponse.json(
				{
					message:
						"Muitas tentativas, espere 10 minutos para tentar novamente!",
				},
				{ status: 429 },
			);
	} catch (err: unknown) {
		console.error("\n[/api/login] Erro ao verificar tentativas: ", err);
		return NextResponse.json(
			{
				message: "Erro interno",
				success: false,
			},
			{ status: 500 },
		);
	}

	try {
		const result = await pool.query(
			"SELECT * FROM site_optare_admin.admin WHERE email = $1",
			[email],
		);
		if (result.rowCount === 0) {
			await InsertUserAttempt();
			return NextResponse.json(
				{ message: "Credenciais inválidas" },
				{ status: 401 },
			);
		}

		if (!(await verifyHash(password, result.rows[0].password))) {
			await InsertUserAttempt();
			return NextResponse.json(
				{ message: "Credenciais inválidas" },
				{ status: 401 },
			);
		}

		const access_token = await createTokenAccess(email);
		const refresh_token = await createTokenRefresh(email);
		const hashed_refresh_token = createHashToken(refresh_token);

		const cookieStore = await cookies();
		cookieStore.set("access_token", access_token, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: 60 * 15,
			path: "/",
		});
		cookieStore.set("refresh_token", refresh_token, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: 60 * 60 * 24 * 7, // 7 dias
			path: "/",
		});
		console.log("[/api/login] Cookies criados!");

		await pool.query(
			`INSERT INTO site_optare_user."user" (email, ip_address, refresh_token, access_level) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email)
         DO UPDATE SET 
           refresh_token = EXCLUDED.refresh_token,
           ip_address = EXCLUDED.ip_address,
           access_level = EXCLUDED.access_level`,
			[email, ip, hashed_refresh_token, NIVEL_ACESSO.ADMIN],
		);

		await pool.query(
			`DELETE FROM site_optare_user.attempts 
         WHERE email = $1 OR ip_address = $2`,
			[email, ip],
		);

		return NextResponse.json(
			{
				message: "Login realizado com sucesso",
				success: true,
			},
			{ status: 200 },
		);
	} catch (err: unknown) {
		console.error("[/api/login] Erro interno: ", err);
		return NextResponse.json(
			{ user: null, message: "Erro interno. Tente novamente mais tarde." },
			{ status: 500 },
		);
	}
}
