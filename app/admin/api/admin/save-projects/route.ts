// app/api/admin/save-projects/route.ts
//
// [CONCEITO] API Route no Next.js App Router
// Este arquivo cria automaticamente o endpoint:
//   POST /api/admin/save-projects
//
// Regra do Next.js: qualquer `route.ts` dentro de `app/` é um endpoint.
// As funções exportadas correspondem aos métodos HTTP:
//   export async function GET(...)  → responde a GET
//   export async function POST(...) → responde a POST
//
// [POR QUE ISSO EXISTE]
// O componente React roda no browser — não tem acesso ao sistema de arquivos.
// O `fs` só existe no servidor (Node.js).
// Esta rota é a "ponte": o componente envia os dados via HTTP,
// e esta rota os recebe e escreve no disco.

import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import type { Projeto } from "@/app/admin/painel/lib/types";

export async function POST(request: NextRequest) {
	try {
		// [CONCEITO] request.json() lê o corpo da requisição HTTP como JSON.
		// É async porque o body chega como stream — precisamos esperar todos
		// os bytes chegarem antes de fazer o parse.
		const body = await request.json();
		const projetos: Projeto[] = body.projetos;

		// Validação básica: se não vier um array, rejeitamos imediatamente.
		// [CONCEITO] "Fail fast" — melhor rejeitar cedo com mensagem clara
		// do que deixar o erro acontecer mais tarde em lugar inesperado.
		if (!Array.isArray(projetos)) {
			return NextResponse.json(
				{ error: "O campo 'projetos' deve ser um array." },
				{ status: 400 },
			);
		}

		// [CONCEITO] process.cwd() retorna o diretório raiz do projeto.
		// join() monta o caminho de forma segura em qualquer SO
		// (Windows usa \, Linux/Mac usam /).
		// Nunca concatene caminhos com string — use path.join().
		const caminho = join(
			process.cwd(),
			"public",
			"JSON",
			"projetos",
			"projects.json",
		);

		// [CONCEITO] JSON.stringify com indentação (terceiro argumento = 2)
		// produz JSON legível por humanos — útil para debugar no arquivo.
		// Em produção com banco de dados isso não importa, mas enquanto
		// usamos arquivo JSON é muito melhor poder abrir e ler.
		const conteudo = JSON.stringify(projetos, null, 2);

		// [CONCEITO] writeFile é async — escreve no disco sem bloquear o servidor.
		// Sempre use as funções de `fs/promises` em vez de `fs` com callbacks.
		// O await garante que a escrita terminou antes de retornar a resposta.
		await writeFile(caminho, conteudo, "utf-8");

		return NextResponse.json({ ok: true });
	} catch (error) {
		// [CONCEITO] Em API Routes, SEMPRE envolva em try/catch.
		// Se writeFile falhar (permissão, disco cheio etc.), sem o catch
		// o Next.js retornaria um erro 500 genérico sem informação útil.
		console.error("[save-projects] Erro ao salvar:", error);
		return NextResponse.json(
			{ error: "Falha ao salvar o arquivo JSON." },
			{ status: 500 },
		);
	}
}
