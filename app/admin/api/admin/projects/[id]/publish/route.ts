// app/api/admin/projects/[id]/publish/route.ts
import { NextRequest, NextResponse } from "next/server";
import { publishProject } from "@/lib/repositories/admin/projects-repository";

interface RouteParams {
	params: Promise<{ id: string }>;
}

export async function POST(_request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;
		const projeto = await publishProject(id);
		if (!projeto) {
			return NextResponse.json(
				{ error: "Projeto não encontrado." },
				{ status: 404 },
			);
		}
		return NextResponse.json({ projeto });
	} catch (error: unknown) {
		console.error("[/api/admin/projects/:id/publish] Erro ao publicar:", error);
		return NextResponse.json(
			{ error: "Falha ao publicar projeto." },
			{ status: 500 },
		);
	}
}
