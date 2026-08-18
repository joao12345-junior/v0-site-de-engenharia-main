// app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
	updateProduct,
	deleteProduct,
} from "@/lib/repositories/admin/products-repository";

const tipoProdutoSchema = z.enum([
	"Kit",
	"Sistema",
	"Equipamento",
	"Componente",
]);
const statusProdutoSchema = z.enum([
	"Pesquisa",
	"Desenvolvimento",
	"Protótipo",
	"Aprovado",
]);

const atualizacaoSchema = z.object({
	nome: z.string().min(1).max(255).optional(),
	tipo: tipoProdutoSchema.optional(),
	sku: z.string().min(1).max(100).optional(),
	lancamento: z.string().optional(),
	preco: z.string().optional(),
	status: statusProdutoSchema.optional(),
	visible: z.boolean().optional(),
	capa: z.string().url().optional(),
});

interface RouteParams {
	params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;
		const body = await request.json();
		const validation = atualizacaoSchema.safeParse(body);
		if (!validation.success) {
			return NextResponse.json(
				{ error: "Dados inválidos.", details: validation.error.flatten() },
				{ status: 400 },
			);
		}

		const produto = await updateProduct(id, validation.data);
		if (!produto) {
			return NextResponse.json(
				{ error: "Produto não encontrado." },
				{ status: 404 },
			);
		}
		return NextResponse.json({ produto });
	} catch (error: unknown) {
		if ((error as { code?: string })?.code === "23514") {
			return NextResponse.json(
				{
					error:
						"Não é possível tornar visível: o produto precisa estar com status 'Aprovado'. Use a ação de publicar.",
				},
				{ status: 409 },
			);
		}
		if ((error as { code?: string })?.code === "23505") {
			return NextResponse.json(
				{ error: "Já existe um produto com esse SKU." },
				{ status: 409 },
			);
		}
		console.error("[/api/admin/products/:id] Erro ao atualizar:", error);
		return NextResponse.json(
			{ error: "Falha ao atualizar produto." },
			{ status: 500 },
		);
	}
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;
		const apagou = await deleteProduct(id);
		if (!apagou) {
			return NextResponse.json(
				{ error: "Produto não encontrado." },
				{ status: 404 },
			);
		}
		return NextResponse.json({ ok: true });
	} catch (error: unknown) {
		console.error("[/api/admin/products/:id] Erro ao apagar:", error);
		return NextResponse.json(
			{ error: "Falha ao apagar produto." },
			{ status: 500 },
		);
	}
}
