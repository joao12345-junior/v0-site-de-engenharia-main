// app/api/admin/clients/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
	listAllClients,
	createClient,
} from "@/lib/repositories/admin/admin-clients-repository";

const categoriaSchema = z.enum([
	"Construção",
	"Arquitetura",
	"Varejo",
	"Saúde",
	"Educação",
]);

const novoClienteSchema = z.object({
	nome: z.string().min(1).max(255),
	siteUrl: z.string().url().optional(),
	categoria: categoriaSchema,
	contato: z.string().email().optional(),
});

export async function GET() {
	try {
		const clientes = await listAllClients();
		return NextResponse.json({ clientes });
	} catch (error: unknown) {
		console.error("[/api/admin/clients] Erro ao listar:", error);
		return NextResponse.json(
			{ error: "Falha ao buscar clientes." },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const validation = novoClienteSchema.safeParse(body);
		if (!validation.success) {
			return NextResponse.json(
				{ error: "Dados inválidos.", details: validation.error.flatten() },
				{ status: 400 },
			);
		}

		const cliente = await createClient(validation.data);
		return NextResponse.json({ cliente }, { status: 201 });
	} catch (error: unknown) {
		console.error("[/api/admin/clients] Erro ao criar:", error);
		return NextResponse.json(
			{ error: "Falha ao criar cliente." },
			{ status: 500 },
		);
	}
}
