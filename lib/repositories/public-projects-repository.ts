// lib/repositories/public-projects-repository.ts
//
// [CONCEITO] Server-only — importa pool (Node.js/pg).
// Mesmo padrão de public-clients-repository.ts.
// NUNCA importar em Client Components.

import { pool } from "@/lib/db/db";
import { TABLES } from "@/lib/db/tables";
import { Photo } from "./admin/photos-repository";

export type CategoriaPublica = "Comercial" | "Residencial" | "Saúde";

export interface PublicProject {
	id: string;
	nome: string;
	categoria: CategoriaPublica;
	cidade: string;
	cliente: string; // nome resolvido via LEFT JOIN com clients
	capa: string | null; // URL do Vercel Blob — null se ainda não tiver foto
	photos: Photo[] | null;
}

/**
 * Retorna todos os projetos publicados (visible=true), com nome do cliente
 * resolvido via JOIN.
 *
 * [CONCEITO] LEFT JOIN em vez de INNER JOIN:
 * Um projeto pode ter client_id NULL (válvula de segurança do schema).
 * Com INNER JOIN, esses projetos sumiriam da listagem silenciosamente.
 * Com LEFT JOIN, cliente fica "" e o projeto aparece — comportamento
 * previsível e fácil de detectar.
 *
 * [CONCEITO] COALESCE(c.name, ''):
 * Se client_id for NULL, o LEFT JOIN devolve NULL para todos os campos de c.
 * COALESCE substitui NULL por '' — o componente recebe string vazia em vez
 * de null, e não precisa fazer null-check pra renderizar o nome do cliente.
 */
export async function getPublicProjects(): Promise<PublicProject[]> {
	const result = await pool.query(`
		SELECT
			p.id,
			p.name,
			p.category,
			p.city,
			p.cover_url,
			COALESCE(c.name, '') AS client_name
		FROM ${TABLES.projects} p
		LEFT JOIN ${TABLES.clients} c ON c.id = p.client_id
		WHERE p.visible = true
		ORDER BY p.created_at DESC
	`);

	return result.rows.map((row) => ({
		id: row.id as string,
		nome: row.name as string,
		categoria: row.category as CategoriaPublica,
		cidade: row.city as string,
		cliente: row.client_name as string,
		capa:
			row.cover_url && !row.cover_url.includes("google.com")
				? row.cover_url
				: null,
		photos: null,
	}));
}
