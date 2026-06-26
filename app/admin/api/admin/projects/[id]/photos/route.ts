// app/api/admin/projects/[id]/photos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
	getPhotos,
	addPhoto,
} from "@/lib/repositories/admin/photos-repository";

interface RouteParams {
	params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;
		const photos = await getPhotos("project", id);
		return NextResponse.json({ photos });
	} catch (error: unknown) {
		console.error("[/api/admin/projects/:id/photos] Erro ao listar:", error);
		return NextResponse.json(
			{ error: "Falha ao buscar fotos." },
			{ status: 500 },
		);
	}
}

const addPhotoSchema = z.object({
	url: z.string().url(),
	position: z.number().int().min(0),
});

export async function POST(req: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;
		const body = await req.json();
		const validation = addPhotoSchema.safeParse(body);
		if (!validation.success) {
			return NextResponse.json(
				{ error: "Dados inválidos.", details: validation.error.flatten() },
				{ status: 400 },
			);
		}
		const photo = await addPhoto(
			"project",
			id,
			validation.data.url,
			validation.data.position,
		);
		return NextResponse.json({ photo }, { status: 201 });
	} catch (error: unknown) {
		console.error("[/api/admin/projects/:id/photos] Erro ao adicionar:", error);
		return NextResponse.json(
			{ error: "Falha ao salvar foto." },
			{ status: 500 },
		);
	}
}
