// lib/persistence.ts
//
// [CONCEITO] Repository Pattern — embrião
//
// Esta camada tem uma única responsabilidade: saber COMO persistir dados.
// Os componentes React não sabem se os dados vão para JSON, PostgreSQL,
// ou uma API externa — eles só chamam as funções daqui.
//
// Quando o projeto migrar para banco de dados, você troca a implementação
// desta função. Os componentes que chamam `saveProjects` não mudam nada.
//
// Isso é o que Alistair Cockburn chamou de "Port" na Arquitetura Hexagonal:
// um contrato estável entre a lógica da aplicação e os detalhes de infraestrutura.

import type { Projeto } from "./types";

// [CONCEITO] O tipo de retorno `Promise<{ ok: boolean; error?: string }>`
// é um "Result type" — uma forma de retornar sucesso OU erro sem usar
// exceções. Componentes podem verificar `result.ok` e mostrar feedback.
// Isso é preferível a `throw` em operações de UI porque o componente
// pode tratar o erro de forma controlada.
type SaveResult = { ok: boolean; error?: string };

/**
 * Persiste a lista de projetos no arquivo JSON local.
 *
 * Chama a API Route `/api/admin/save-projects` via fetch.
 * O fetch corre no browser; a API Route roda no servidor e escreve no disco.
 *
 * Limitação conhecida: funciona apenas em desenvolvimento local.
 * Em produção (Vercel), o filesystem é somente leitura.
 * Para produção, substituir esta função por uma chamada ao banco de dados.
 */
export async function saveProjects(projetos: Projeto[]): Promise<SaveResult> {
	try {
		const response = await fetch("/admin/api/admin/save-projects", {
			method: "POST",
			// [CONCEITO] Content-Type: application/json informa ao servidor
			// que o corpo da requisição é JSON — sem isso, o servidor não
			// sabe como fazer o parse e pode rejeitar a requisição.
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ projetos }),
		});

		if (!response.ok) {
			const data = await response.json();
			return { ok: false, error: data.error ?? "Erro desconhecido." };
		}

		return { ok: true };
	} catch {
		// [CONCEITO] fetch lança exceção apenas em falhas de rede
		// (sem conexão, timeout). Erros HTTP (4xx, 5xx) NÃO lançam exceção —
		// por isso verificamos `response.ok` acima.
		return { ok: false, error: "Falha de rede ao salvar projetos." };
	}
}
