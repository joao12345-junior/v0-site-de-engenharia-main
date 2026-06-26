// app/api/admin/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
	listAllProjects,
	createProject,
} from "@/lib/repositories/admin/projects-repository";

const categoriaSchema = z.enum(["Comercial", "Residencial", "Saúde"]);

const novoProjetoSchema = z.object({
	nome: z.string().min(1).max(255),
	categoria: categoriaSchema,
	cidade: z.string().min(1).max(255),
	clienteId: z.string().uuid(),
	prazo: z.string().optional(),
	area: z.string().optional(),
});

export async function GET() {
	try {
		const projetos = await listAllProjects();
		return NextResponse.json({ projetos });
	} catch (error: unknown) {
		console.error("[/api/admin/projects] Erro ao listar:", error);
		return NextResponse.json(
			{ error: "Falha ao buscar projetos." },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const validation = novoProjetoSchema.safeParse(body);
		if (!validation.success) {
			return NextResponse.json(
				{ error: "Dados inválidos.", details: validation.error.flatten() },
				{ status: 400 },
			);
		}

		const projeto = await createProject(validation.data);
		return NextResponse.json({ projeto }, { status: 201 });
	} catch (error: unknown) {
		// [CONCEITO] Código 23503 = foreign_key_violation. Acontece se
		// clienteId não existir na tabela clients — UUID bem formado mas
		// apontando pra ninguém.
		if ((error as { code?: string })?.code === "23503") {
			return NextResponse.json(
				{ error: "Cliente informado não existe." },
				{ status: 400 },
			);
		}
		console.error("[/api/admin/projects] Erro ao criar:", error);
		return NextResponse.json(
			{ error: "Falha ao criar projeto." },
			{ status: 500 },
		);
	}
}
