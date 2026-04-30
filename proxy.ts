import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
	const token = req.cookies.get("access_token")?.value;

	if (!token)
		return NextResponse.redirect(new URL("/administrador_login", req.url));

	// Chamada para vereficar o token via API interna
	const verifyResponse = await fetch(new URL("/api/verify-token", req.url), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ token }),
	});

	const { valid } = await verifyResponse.json();
	console.log("Token válido:", valid);
	if (!valid)
		return NextResponse.redirect(new URL("/administrador_login", req.url));

	return NextResponse.next();
}

export const config = {
	matcher: ["/administrador/:path*"],
};
