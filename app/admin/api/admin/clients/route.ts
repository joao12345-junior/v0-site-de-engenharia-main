import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
	listAllClients,
	createClient,
} from "@/lib/repositories/admin/admin-clients-repository";
import { buildLogoMap } from "@/lib/utils/logo-resolver";

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

		// [CONCEITO] buildLogoMap usa fs.readdirSync — só funciona no servidor.
		// Por isso está aqui na API Route e não no Client Component.
		// O resultado (objeto JSON simples) é serializado e enviado junto
		// com a lista de clientes numa única resposta.
		const logoMap = buildLogoMap(clientes.map((c) => c.nome));

		return NextResponse.json({ clientes, logoMap });
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
