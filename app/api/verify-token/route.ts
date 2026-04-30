import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyTokenAccess } from "@/lib/token";

export async function POST(req: NextRequest) {
	// No Server (API Route), podemos usar cookies() do next/headers
	const token =
		(await req.json().then((data) => data.token)) ||
		(await cookies()).get("access_token")?.value;
	console.log("Token recebido no API Route:", token);
	console.log(
		"Cookies disponíveis no cookieStore: ",
		(await cookies()).getAll(),
	);

	if (!token) {
		return NextResponse.json(
			{ valid: false, error: "sem_token" },
			{ status: 401 },
		);
	}

	const valid = await verifyTokenAccess(token);
	return NextResponse.json({ valid: valid });
}
