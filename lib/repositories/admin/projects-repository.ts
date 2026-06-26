// lib/repositories/admin/projects-repository.ts
//
// [CONCEITO] Mesmo padrão de admin/clients-repository.ts, com duas
// diferenças exigidas pela complexidade real de Projeto:
//   1. JOIN com clients pra resolver o nome (clienteId é FK, cliente é
//      o nome resolvido — exatamente como documentado em types.ts).
//   2. publishProject() como ação de negócio nomeada, não só um PATCH:
//      garante status='Aprovado' + visible=true juntos, sempre.
//
// [ESCOPO] Gestão de project_photos (galeria) fica de fora deste arquivo
// de propósito — é tabela relacionada com posição/reordenação, merece
// endpoints próprios depois. Por enquanto, capa (cover_url) é editável
// como campo simples via updateProject.

import { pool } from "@/lib/db/db";
import { TABLES } from "@/lib/db/tables";
import type {
	Projeto,
	TipoStatusProjetos,
	TipoCategoria,
} from "@/app/admin/painel/lib/types";

export interface NovoProjeto {
	nome: string;
	categoria: TipoCategoria;
	cidade: string;
	clienteId: string;
	prazo?: string;
	area?: string;
}

export type AtualizacaoProjeto = Partial<
	Pick<
		Projeto,
		| "nome"
		| "categoria"
		| "cidade"
		| "prazo"
		| "area"
		| "status"
		| "visible"
		| "capa"
	> & { clienteId: string }
>;

// [CONCEITO] LEFT JOIN, não INNER JOIN — client_id pode ser NULL na tabela
// (válvula de segurança a nível de banco, mesmo a API sempre exigindo
// cliente na criação). Com INNER JOIN, um projeto sem cliente sumiria
// silenciosamente da listagem inteira — bug sutil, difícil de notar.
function mapRow(row: Record<string, unknown>): Projeto {
	return {
		id: row.id as string,
		nome: row.name as string,
		categoria: row.category as TipoCategoria,
		cidade: row.city as string,
		clienteId: (row.client_id as string) ?? "",
		cliente: (row.client_name as string) ?? "",
		prazo: (row.deadline as string) ?? "",
		area: (row.area as string) ?? "",
		status: row.status as TipoStatusProjetos,
		visible: row.visible as boolean,
		capa: (row.cover_url as string | null) ?? undefined,
		photos: Array(Number(row.photos_count ?? 0)).fill(null),
	};
}

export async function listAllProjects(): Promise<Projeto[]> {
	const result = await pool.query(`
		SELECT 
			p.*,
    		c.name AS client_name,
    		(SELECT COUNT(*) FROM site_optare_content.project_photos ph 
     		WHERE ph.project_id = p.id) AS photos_count
		FROM site_optare_content.projects p
		LEFT JOIN site_optare_content.clients c ON c.id = p.client_id
		ORDER BY p.created_at DESC
	`);
	return result.rows.map(mapRow);
}

export async function getProjectById(id: string): Promise<Projeto | null> {
	const result = await pool.query(
		`SELECT 
			p.*,
			c.name AS client_name,
			(SELECT COUNT(*) FROM site_optare_content.project_photos ph
			 WHERE ph.project_id = p.id) AS photos_count
		 FROM ${TABLES.projects} p
		 LEFT JOIN ${TABLES.clients} c ON c.id = p.client_id
		 WHERE p.id = $1`,
		[id],
	);
	return result.rows[0] ? mapRow(result.rows[0]) : null;
}

export async function createProject(data: NovoProjeto): Promise<Projeto> {
	const result = await pool.query(
		`INSERT INTO ${TABLES.projects} (name, category, city, client_id, deadline, area)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING id`,
		[
			data.nome,
			data.categoria,
			data.cidade,
			data.clienteId,
			data.prazo ?? null,
			data.area ?? null,
		],
	);
	// [CONCEITO] RETURNING * não traz client_name (não é coluna desta tabela,
	// vem do JOIN). Busca de novo com getProjectById pra devolver o objeto
	// completo e consistente com o resto do repositório, em vez de devolver
	// um Projeto incompleto (sem o nome do cliente) só desta vez.
	return (await getProjectById(result.rows[0].id))!;
}

export async function updateProject(
	id: string,
	data: AtualizacaoProjeto,
): Promise<Projeto | null> {
	const fields: string[] = [];
	const values: unknown[] = [];
	let i = 1;

	if (data.nome !== undefined) {
		fields.push(`name = $${i++}`);
		values.push(data.nome);
	}
	if (data.categoria !== undefined) {
		fields.push(`category = $${i++}`);
		values.push(data.categoria);
	}
	if (data.cidade !== undefined) {
		fields.push(`city = $${i++}`);
		values.push(data.cidade);
	}
	if (data.clienteId !== undefined) {
		fields.push(`client_id = $${i++}`);
		values.push(data.clienteId);
	}
	if (data.prazo !== undefined) {
		fields.push(`deadline = $${i++}`);
		values.push(data.prazo);
	}
	if (data.area !== undefined) {
		fields.push(`area = $${i++}`);
		values.push(data.area);
	}
	if (data.status !== undefined) {
		fields.push(`status = $${i++}`);
		values.push(data.status);
	}
	if (data.visible !== undefined) {
		fields.push(`visible = $${i++}`);
		values.push(data.visible);
	}
	if (data.capa !== undefined) {
		fields.push(`cover_url = $${i++}`);
		values.push(data.capa);
	}

	if (fields.length === 0) return getProjectById(id);

	fields.push(`updated_at = now()`);
	values.push(id);

	// [CONCEITO] Esta query pode falhar com check_violation (código 23514)
	// se data.visible=true e o status atual (ou o novo, se vier junto) não
	// for 'Aprovado' — a constraint projects_visible_requires_approved do
	// banco recusa. Isso é intencional: ver tratamento na rota da API.
	const result = await pool.query(
		`UPDATE ${TABLES.projects} SET ${fields.join(", ")} WHERE id = $${i} RETURNING id`,
		values,
	);
	if (result.rowCount === 0) return null;
	return getProjectById(id);
}

/**
 * Publica o projeto: status='Aprovado' + visible=true, atomicamente.
 *
 * Ação de negócio nomeada, não um PATCH genérico — garante que os dois
 * campos mudam juntos e corretos, sem depender de quem chama lembrar de
 * mandar os dois. Despublicar (visible=false mantendo status) continua
 * sendo um PATCH comum, porque não viola a constraint do banco.
 */
export async function publishProject(id: string): Promise<Projeto | null> {
	const result = await pool.query(
		`UPDATE ${TABLES.projects}
		 SET status = 'Aprovado', visible = true, updated_at = now()
		 WHERE id = $1
		 RETURNING id`,
		[id],
	);
	if (result.rowCount === 0) return null;
	return getProjectById(id);
}

export async function deleteProject(id: string): Promise<boolean> {
	const result = await pool.query(
		`DELETE FROM ${TABLES.projects} WHERE id = $1`,
		[id],
	);
	return (result.rowCount ?? 0) > 0;
}
