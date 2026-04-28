import { NextResponse } from "next/server";
import { pool } from "../../../lib/db";
import { verifyUserPassword } from "../../../lib/hash";
import * as jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
	const body = await req.json();

	const ip =
		req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
		req.headers.get("x-real-ip") ??
		"unknown";

	// senha inválida
	async function attemptsDB() {
		await pool.query(
			`INSERT INTO site_optare_user.attempts (email, ip_address) 
         VALUES ($1, $2)`,
			[body.email, ip],
		);
	}

	// Verificação de credenciais (igual antes)
	try {
		const attempts = await pool.query(
			`SELECT COUNT(*) FROM site_optare_user.attempts 
       WHERE ip_address = $1 AND email = $2 AND created_at > NOW() - INTERVAL '10 minutes'`,
			[ip, body.email],
		);

		if (Number(attempts.rows[0].count) > 5) {
			return NextResponse.json(
				{
					message:
						"Muitas tentativas, espere 10 minutos para tentar novamente!",
				},
				{ status: 429 },
			);
		}
		const result = await pool.query(
			"SELECT * FROM site_optare_admin.admin WHERE email = $1",
			[body.email],
		);

		if (result.rowCount === 0) {
			await attemptsDB();
			return NextResponse.json(
				{ message: "Credenciais inválidas" },
				{ status: 401 },
			);
		}

		if (await verifyUserPassword(body.password, result.rows[0].password)) {
			const access_token = jwt.sign(
				{ email: body.email },
				process.env.JWT_SECRET_ACCESS!,
				{ expiresIn: process.env.JWT_EXPIRES_IN_ACCESS as any },
			);

			const refresh_token = jwt.sign(
				{ email: body.email },
				process.env.JWT_SECRET_REFRESH!,
				{ expiresIn: process.env.JWT_EXPIRES_IN_REFRESH as any },
			);

			const cookieStore = await cookies();
			cookieStore.set("access_token", access_token, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 60 * 15,
				path: "/",
			});

			await pool.query(
				`INSERT INTO site_optare_user."user" (email, ip_address, refresh_token, access_level) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email)
         DO UPDATE SET 
           refresh_token = EXCLUDED.refresh_token,
           ip_address = EXCLUDED.ip_address,
           access_level = EXCLUDED.access_level`,
				[body.email, ip, refresh_token, "3"],
			);

			await pool.query(
				`DELETE FROM site_optare_user.attempts 
         WHERE email = $1 OR ip_address = $2`,
				[body.email, ip],
			);

			return NextResponse.json(
				{
					message: "Login realizado com sucesso",
					success: true,
				},
				{ status: 200 },
			);
		}

		await attemptsDB();
		return NextResponse.json(
			{ message: "Credenciais inválidas" },
			{ status: 401 },
		);
	} catch (error: any) {
		return NextResponse.json(
			{ user: null, message: error.message },
			{ status: 500 },
		);
	}
}
