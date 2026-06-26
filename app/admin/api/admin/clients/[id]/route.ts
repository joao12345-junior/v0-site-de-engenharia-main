// app/api/admin/clients/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
	updateClient,
	deleteClient,
} from "@/lib/repositories/admin/admin-clients-repository";

const categoriaSchema = z.enum([
	"Construção",
	"Arquitetura",
	"Varejo",
	"Saúde",
	"Educação",
]);

const atualizacaoSchema = z.object({
	nome: z.string().min(1).max(255).optional(),
	siteUrl: z.string().url().optional(),
	categoria: categoriaSchema.optional(),
	contato: z.string().email().optional(),
	visible: z.boolean().optional(),
});

// [CONCEITO] No Next.js 15+/16, params de rota dinâmica são uma Promise —
// precisa de await antes de usar. Mudança de versões anteriores, onde
// params vinha pronto, síncrono.
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

		const cliente = await updateClient(id, validation.data);
		if (!cliente) {
			return NextResponse.json(
				{ error: "Cliente não encontrado." },
				{ status: 404 },
			);
		}
		return NextResponse.json({ cliente });
	} catch (error: unknown) {
		console.error("[/api/admin/clients/:id] Erro ao atualizar:", error);
		return NextResponse.json(
			{ error: "Falha ao atualizar cliente." },
			{ status: 500 },
		);
	}
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;
		const apagou = await deleteClient(id);
		if (!apagou) {
			return NextResponse.json(
				{ error: "Cliente não encontrado." },
				{ status: 404 },
			);
		}
		return NextResponse.json({ ok: true });
	} catch (error: unknown) {
		// [CONCEITO] Código 23503 = foreign_key_violation no Postgres.
		// Acontece quando o cliente tem projetos vinculados (client_id
		// aponta pra ele) — o banco recusa o DELETE pra não deixar projeto
		// órfão. Isso é a constraint fazendo o trabalho dela, não um bug —
		// por isso tratamos com mensagem clara em vez de deixar virar 500 genérico.
		if ((error as { code?: string })?.code === "23503") {
			return NextResponse.json(
				{
					error: "Não é possível apagar: este cliente tem projetos vinculados.",
				},
				{ status: 409 },
			);
		}
		console.error("[/api/admin/clients/:id] Erro ao apagar:", error);
		return NextResponse.json(
			{ error: "Falha ao apagar cliente." },
			{ status: 500 },
		);
	}
}
