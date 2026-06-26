// app/api/admin/products/[id]/publish/route.ts
import { NextRequest, NextResponse } from "next/server";
import { publishProduct } from "@/lib/repositories/admin/products-repository";

interface RouteParams {
	params: Promise<{ id: string }>;
}

export async function POST(_request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;
		const produto = await publishProduct(id);
		if (!produto) {
			return NextResponse.json(
				{ error: "Produto não encontrado." },
				{ status: 404 },
			);
		}
		return NextResponse.json({ produto });
	} catch (error: unknown) {
		console.error("[/api/admin/products/:id/publish] Erro ao publicar:", error);
		return NextResponse.json(
			{ error: "Falha ao publicar produto." },
			{ status: 500 },
		);
	}
}
