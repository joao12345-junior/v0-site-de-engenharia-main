// app/admin/api/admin/maintenance/route.ts
import { NextResponse } from "next/server";
import {
	getMaintenanceMode,
	setMaintenanceMode,
} from "@/lib/repositories/admin/settings-repository";

/** Retorna o estado atual do modo manutenção. */
export async function GET() {
	try {
		const maintenance = await getMaintenanceMode();
		return NextResponse.json({ maintenance });
	} catch (error) {
		console.error("[/api/admin/maintenance] Erro ao ler:", error);
		return NextResponse.json(
			{ error: "Falha ao ler configuração." },
			{ status: 500 },
		);
	}
}

/** Liga ou desliga o modo manutenção. Recebe { enabled: boolean }. */
export async function POST(req: Request) {
	try {
		const { enabled } = await req.json();
		if (typeof enabled !== "boolean") {
			return NextResponse.json(
				{ error: "Campo 'enabled' deve ser boolean." },
				{ status: 400 },
			);
		}
		await setMaintenanceMode(enabled);
		return NextResponse.json({ maintenance: enabled });
	} catch (error) {
		console.error("[/api/admin/maintenance] Erro ao salvar:", error);
		return NextResponse.json(
			{ error: "Falha ao salvar configuração." },
			{ status: 500 },
		);
	}
}
