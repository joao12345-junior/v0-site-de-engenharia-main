// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
	listAllProducts,
	createProduct,
} from "@/lib/repositories/admin/products-repository";

const tipoProdutoSchema = z.enum([
	"Kit",
	"Sistema",
	"Equipamento",
	"Componente",
]);

const novoProdutoSchema = z.object({
	nome: z.string().min(1).max(255),
	tipo: tipoProdutoSchema,
	sku: z.string().min(1).max(100),
	lancamento: z.string().optional(),
	preco: z.string().optional(),
});

export async function GET() {
	try {
		const produtos = await listAllProducts();
		return NextResponse.json({ produtos });
	} catch (error: unknown) {
		console.error("[/api/admin/products] Erro ao listar:", error);
		return NextResponse.json(
			{ error: "Falha ao buscar produtos." },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const validation = novoProdutoSchema.safeParse(body);
		if (!validation.success) {
			return NextResponse.json(
				{ error: "Dados inválidos.", details: validation.error.flatten() },
				{ status: 400 },
			);
		}

		const produto = await createProduct(validation.data);
		return NextResponse.json({ produto }, { status: 201 });
	} catch (error: unknown) {
		// [CONCEITO] 23505 = unique_violation. SKU duplicado — único erro
		// esperado aqui além de problema de conexão. Mensagem específica
		// em vez de 500 genérico deixa claro o que o usuário precisa corrigir.
		if ((error as { code?: string })?.code === "23505") {
			return NextResponse.json(
				{ error: "Já existe um produto com esse SKU." },
				{ status: 409 },
			);
		}
		console.error("[/api/admin/products] Erro ao criar:", error);
		return NextResponse.json(
			{ error: "Falha ao criar produto." },
			{ status: 500 },
		);
	}
}
