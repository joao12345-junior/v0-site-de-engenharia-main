// app/api/admin/products/[id]/photos/[photoId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { deletePhoto } from "@/lib/repositories/admin/photos-repository";

interface RouteParams {
	params: Promise<{ id: string; photoId: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
	try {
		const { photoId } = await params;
		const { blobUrl } = await req.json();
		if (!blobUrl) {
			return NextResponse.json(
				{ error: "blobUrl é obrigatório." },
				{ status: 400 },
			);
		}
		const deleted = await deletePhoto("product", Number(photoId), blobUrl);
		if (!deleted) {
			return NextResponse.json(
				{ error: "Foto não encontrada." },
				{ status: 404 },
			);
		}
		return NextResponse.json({ ok: true });
	} catch (error: unknown) {
		console.error(
			"[/api/admin/products/:id/photos/:photoId] Erro ao deletar:",
			error,
		);
		return NextResponse.json(
			{ error: "Falha ao deletar foto." },
			{ status: 500 },
		);
	}
}
