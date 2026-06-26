// app/api/admin/projects/[id]/photos/[photoId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { deletePhoto } from "@/lib/repositories/admin/photos-repository";

interface RouteParams {
	params: Promise<{ id: string; photoId: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
	try {
		const { photoId } = await params;
		// [CONCEITO] blobUrl vem no body porque a URL não está codificada no path
		// (contém "/" e caracteres especiais). Podia ir como query param, mas
		// body é mais semântico para dados que acompanham a ação de deleção.
		const { blobUrl } = await req.json();
		if (!blobUrl) {
			return NextResponse.json(
				{ error: "blobUrl é obrigatório." },
				{ status: 400 },
			);
		}
		const deleted = await deletePhoto("project", Number(photoId), blobUrl);
		if (!deleted) {
			return NextResponse.json(
				{ error: "Foto não encontrada." },
				{ status: 404 },
			);
		}
		return NextResponse.json({ ok: true });
	} catch (error: unknown) {
		console.error(
			"[/api/admin/projects/:id/photos/:photoId] Erro ao deletar:",
			error,
		);
		return NextResponse.json(
			{ error: "Falha ao deletar foto." },
			{ status: 500 },
		);
	}
}
