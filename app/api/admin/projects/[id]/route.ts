// app/api/admin/projects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
	updateProject,
	deleteProject,
} from "@/lib/repositories/admin/projects-repository";

const categoriaSchema = z.enum(["Comercial", "Residencial", "Saúde"]);
const statusSchema = z.enum([
	"Pré-projeto",
	"Em projeto",
	"Aprovação",
	"Aprovado",
]);

const atualizacaoSchema = z.object({
	nome: z.string().min(1).max(255).optional(),
	categoria: categoriaSchema.optional(),
	cidade: z.string().min(1).max(255).optional(),
	clienteId: z.string().uuid().optional(),
	prazo: z.string().optional(),
	area: z.string().optional(),
	status: statusSchema.optional(),
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
		console.log(body);
		const validation = atualizacaoSchema.safeParse(body);
		if (!validation.success) {
			return NextResponse.json(
				{ error: "Dados inválidos.", details: validation.error.flatten() },
				{ status: 400 },
			);
		}

		const projeto = await updateProject(id, validation.data);
		if (!projeto) {
			return NextResponse.json(
				{ error: "Projeto não encontrado." },
				{ status: 404 },
			);
		}
		return NextResponse.json({ projeto });
	} catch (error: unknown) {
		// [CONCEITO] Código 23514 = check_violation. Dispara se tentar
		// visible=true sem status='Aprovado' — a constraint
		// projects_visible_requires_approved recusa no banco. Mensagem
		// clara em vez de 500 genérico, apontando o caminho certo (/publish).
		if ((error as { code?: string })?.code === "23514") {
			return NextResponse.json(
				{
					error:
						"Não é possível tornar visível: o projeto precisa estar com status 'Aprovado'. Use a ação de publicar.",
				},
				{ status: 409 },
			);
		}
		if ((error as { code?: string })?.code === "23503") {
			return NextResponse.json(
				{ error: "Cliente informado não existe." },
				{ status: 400 },
			);
		}
		console.error("[/api/admin/projects/:id] Erro ao atualizar:", error);
		return NextResponse.json(
			{ error: "Falha ao atualizar projeto." },
			{ status: 500 },
		);
	}
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;
		const apagou = await deleteProject(id);
		if (!apagou) {
			return NextResponse.json(
				{ error: "Projeto não encontrado." },
				{ status: 404 },
			);
		}
		return NextResponse.json({ ok: true });
	} catch (error: unknown) {
		console.error("[/api/admin/projects/:id] Erro ao apagar:", error);
		return NextResponse.json(
			{ error: "Falha ao apagar projeto." },
			{ status: 500 },
		);
	}
}
