// lib/repositories/public-projects-repository.ts
//
// [CONCEITO] Server-only — importa `pool` (Node.js/pg).
// Mesmo papel de public-clients-repository.ts, mas para projetos.
//
// [SEPARAÇÃO]
// lib/repositories/admin/projects-repository.ts  → CRUD admin (autenticado)
// lib/repositories/public-projects-repository.ts → leitura pública (visible=true)

import { pool } from "@/lib/db/db";
import { TABLES } from "@/lib/db/tables";

export interface PublicProject {
	id: string;
	nome: string;
	categoria: string; // "Comercial" | "Residencial" | "Saúde"
	cidade: string;
	cliente: string; // nome resolvido via LEFT JOIN com clients
	coverUrl: string | null;
	photos: string[]; // URLs de project_photos ordenadas por position
}

/**
 * Busca todos os projetos publicados (visible=true) com fotos e cliente resolvido.
 * Subquery de photos inline — evita N+1 queries (uma por projeto).
 */
export async function getPublicProjects(): Promise<PublicProject[]> {
	const result = await pool.query(`
		SELECT
			p.id,
			p.name,
			p.category,
			p.city,
			COALESCE(c.name, '') AS client_name,
			p.cover_url,
			COALESCE(
				ARRAY(
					SELECT url
					FROM ${TABLES.projectPhotos}
					WHERE project_id = p.id
					ORDER BY position ASC
				),
				ARRAY[]::text[]
			) AS photos
		FROM ${TABLES.projects} p
		LEFT JOIN ${TABLES.clients} c ON c.id = p.client_id
		WHERE p.visible = true
		ORDER BY p.created_at DESC
	`);

	return result.rows.map((row) => ({
		id: row.id as string,
		nome: row.name as string,
		categoria: row.category as string,
		cidade: row.city as string,
		cliente: row.client_name as string,
		coverUrl: (row.cover_url as string | null) ?? null,
		photos: (row.photos as string[]) ?? [],
	}));
}
