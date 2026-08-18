// lib/repositories/admin/clients-repository.ts
//
// [CONCEITO] Repository Pattern de verdade — consulta Postgres de fato.
// Diferente de lib/repositories/clients-repository.ts (que ainda faz import
// estático de JSON e alimenta o site público), este arquivo é o "Adapter"
// pro lado administrativo: lê E escreve no banco real. O site público ainda
// não usa este arquivo — rewire fica pro próximo passo já registrado na skill.

import { pool } from "@/lib/db/db";
import { TABLES } from "@/lib/db/tables";

export type CategoriaCliente =
	| "Construção"
	| "Arquitetura"
	| "Varejo"
	| "Saúde"
	| "Educação";

export interface Cliente {
	id: string;
	nome: string;
	siteUrl: string | null;
	categoria: CategoriaCliente;
	contato: string | null;
	visible: boolean;
	// [CONCEITO] Calculado via JOIN/COUNT no banco, nunca armazenado.
	// Mesma lição do `fotos: number` que corrigimos em ItemEditavel.
	totalProjetos: number;
}

// [CONCEITO] Tipo separado pra criação: sem id (o banco gera via
// gen_random_uuid()), sem totalProjetos (cliente novo não tem projeto
// nenhum ainda), sem visible (todo cliente nasce invisível — precisa
// ser publicado explicitamente depois).
export interface NovoCliente {
	nome: string;
	siteUrl?: string;
	categoria: CategoriaCliente;
	contato?: string;
}

// [CONCEITO] Partial<Pick<...>> = só os campos que fazem sentido editar.
// id nunca muda depois de criado; totalProjetos é sempre calculado,
// nunca editável diretamente por quem chama o repositório.
export type AtualizacaoCliente = Partial<
	Pick<Cliente, "nome" | "siteUrl" | "categoria" | "contato" | "visible">
>;

// [CONCEITO] Função de mapeamento isolada num lugar só.
// snake_case do Postgres (site_url, contact_email, total_projetos) vira
// camelCase do TypeScript aqui — o resto do código nunca lida com a
// diferença de convenção entre as duas linguagens.
function mapRow(row: Record<string, unknown>): Cliente {
	return {
		id: row.id as string,
		nome: row.name as string,
		siteUrl: (row.site_url as string | null) ?? null,
		categoria: row.category as CategoriaCliente,
		contato: (row.contact_email as string | null) ?? null,
		visible: row.visible as boolean,
		totalProjetos: Number(row.total_projetos ?? 0),
	};
}

/**
 * Lista todos os clientes (visíveis e não), com a contagem de projetos
 * vinculados a cada um. Uso: painel admin.
 */
export async function listAllClients(): Promise<Cliente[]> {
	const result = await pool.query(`
		SELECT c.*, COUNT(p.id) AS total_projetos
		FROM ${TABLES.clients} c
		LEFT JOIN ${TABLES.projects} p ON p.client_id = c.id
		GROUP BY c.id
		ORDER BY c.name ASC
	`);
	return result.rows.map(mapRow);
}

export async function getClientById(id: string): Promise<Cliente | null> {
	const result = await pool.query(
		`SELECT c.*, COUNT(p.id) AS total_projetos
		 FROM ${TABLES.clients} c
		 LEFT JOIN ${TABLES.projects} p ON p.client_id = c.id
		 WHERE c.id = $1
		 GROUP BY c.id`,
		[id],
	);
	return result.rows[0] ? mapRow(result.rows[0]) : null;
}

export async function createClient(data: NovoCliente): Promise<Cliente> {
	const result = await pool.query(
		`INSERT INTO ${TABLES.clients} (name, site_url, category, contact_email)
		 VALUES ($1, $2, $3, $4)
		 RETURNING *, 0 AS total_projetos`,
		[data.nome, data.siteUrl ?? null, data.categoria, data.contato ?? null],
	);
	return mapRow(result.rows[0]);
}

export async function updateClient(
	id: string,
	data: AtualizacaoCliente,
): Promise<Cliente | null> {
	// [CONCEITO] UPDATE parcial e dinâmico — monta o SET só com os campos
	// que realmente vieram em `data`. Sem isso, um PATCH que só manda
	// { visible: true } sobrescreveria nome/categoria com undefined,
	// apagando dado que ninguém pediu pra mudar.
	const fields: string[] = [];
	const values: unknown[] = [];
	let i = 1;

	if (data.nome !== undefined) {
		fields.push(`name = $${i++}`);
		values.push(data.nome);
	}
	if (data.siteUrl !== undefined) {
		fields.push(`site_url = $${i++}`);
		values.push(data.siteUrl);
	}
	if (data.categoria !== undefined) {
		fields.push(`category = $${i++}`);
		values.push(data.categoria);
	}
	if (data.contato !== undefined) {
		fields.push(`contact_email = $${i++}`);
		values.push(data.contato);
	}
	if (data.visible !== undefined) {
		fields.push(`visible = $${i++}`);
		values.push(data.visible);
	}

	if (fields.length === 0) return getClientById(id); // nada pra atualizar, evita query vazia

	fields.push(`updated_at = now()`);
	values.push(id);

	const result = await pool.query(
		`UPDATE ${TABLES.clients} SET ${fields.join(", ")} WHERE id = $${i} RETURNING id`,
		values,
	);
	if (result.rowCount === 0) return null;

	// total_projetos não vem do UPDATE em si — busca de novo com o JOIN
	return getClientById(id);
}

export async function deleteClient(id: string): Promise<boolean> {
	const result = await pool.query(
		`DELETE FROM ${TABLES.clients} WHERE id = $1`,
		[id],
	);
	return (result.rowCount ?? 0) > 0;
}
