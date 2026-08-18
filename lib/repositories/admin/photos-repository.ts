//lib/repositories/admin/photos-repository.ts
//
// [CONCEITO] Repositório genérico para fotos de projetos E produtos.
// A tabela muda (`project_photos` vs `product_photos`), a coluna de FK muda
// (`project_id` vs `product_id`), mas o SQL é estruturalmente idêntico.
//
// [PADRÃO] Em vez de duplicar o mesmo código em dois repositórios separados,
// passamos `entityType` como parâmetro e derivamos tabela/coluna internamente.
// Isso é DRY (Don't Repeat Yourself) aplicado de verdade — não como dogma,
// mas porque a duplicação aqui traz zero benefício e dobra a superfície de bugs.
//
// [PORTS & ADAPTERS] Este arquivo é o "Adaptador" — implementação concreta
// que sabe falar com Postgres E com Vercel Blob. A "Porta" (contrato) é a
// interface Photo + as assinaturas das funções exportadas.
// Quem chama (as API routes) só sabe do contrato, não da implementação.

import { pool } from "@/lib/db/db";
import { TABLES } from "@/lib/db/tables";
import { del } from "@vercel/blob";

// ─── Tipo público ──────────────────────────────────────────────────────────

export interface Photo {
	id: number;
	url: string;
	position: number;
}

// ─── Helpers internos ─────────────────────────────────────────────────────
//
// [CONCEITO] Esses tipos e a função `getConfig` são privados ao módulo
// (sem export). Quem chama não precisa saber QUAL tabela está sendo usada —
// só precisa dizer se é projeto ou produto.
// Isso é encapsulamento: expor o mínimo necessário, esconder os detalhes.

type EntityType = "project" | "product";

interface TableConfig {
	table: string;
	column: "project_id" | "product_id";
}

function getConfig(entityType: EntityType): TableConfig {
	return entityType === "project"
		? { table: TABLES.projectPhotos, column: "project_id" }
		: { table: TABLES.productPhotos, column: "product_id" };
}

// ─── Funções exportadas ────────────────────────────────────────────────────

/** Lista todas as fotos de um projeto ou produto, ordenadas por posição. */
export async function getPhotos(
	entityType: EntityType,
	entityId: string,
): Promise<Photo[]> {
	const { table, column } = getConfig(entityType);
	const result = await pool.query(
		`SELECT id, url, position
		 FROM ${table}
		 WHERE ${column} = $1
		 ORDER BY position ASC`,
		[entityId],
	);
	return result.rows.map((row) => ({
		id: row.id as number,
		url: row.url as string,
		position: row.position as number,
	}));
}

/**
 * Lista as fotos de VÁRIOS projetos ou produtos numa única query.
 *
 * [CONCEITO] Isso existe pra evitar N+1: chamar getPhotos() dentro de um
 * loop/Promise.all dispara uma query por entidade — com 80+ projetos, isso
 * é 80+ round-trips concorrentes competindo pelas 3 conexões do pool
 * (lib/db/db.ts limita `max: 3`), o que enfileira a maior parte das
 * consultas e pode estourar o connectionTimeoutMillis (10s) sob carga.
 *
 * Uma única query com `WHERE column = ANY($1)` busca tudo de uma vez —
 * o Postgres resolve o IN internamente, sem disputar conexão do pool.
 * O agrupamento por entityId acontece em memória, depois que os dados
 * já chegaram.
 */
export async function getPhotosForEntities(
	entityType: EntityType,
	entityIds: string[],
): Promise<Map<string, Photo[]>> {
	const result = new Map<string, Photo[]>();
	if (entityIds.length === 0) return result;

	const { table, column } = getConfig(entityType);
	const { rows } = await pool.query(
		`SELECT id, url, position, ${column} AS entity_id
		 FROM ${table}
		 WHERE ${column} = ANY($1)
		 ORDER BY position ASC`,
		[entityIds],
	);

	for (const row of rows) {
		const entityId = String(row.entity_id);
		const photo: Photo = {
			id: row.id as number,
			url: row.url as string,
			position: row.position as number,
		};
		const existing = result.get(entityId);
		if (existing) existing.push(photo);
		else result.set(entityId, [photo]);
	}

	return result;
}

/**
 * Adiciona uma URL de foto ao banco.
 * [CONCEITO] Recebe a URL pronta — o upload pro Vercel Blob já aconteceu
 * antes de chamar esta função. Responsabilidade única: só grava o registro.
 */
export async function addPhoto(
	entityType: EntityType,
	entityId: string,
	url: string,
	position: number,
): Promise<Photo> {
	const { table, column } = getConfig(entityType);
	const result = await pool.query(
		`INSERT INTO ${table} (${column}, url, position)
		 VALUES ($1, $2, $3)
		 RETURNING id, url, position`,
		[entityId, url, position],
	);
	return {
		id: result.rows[0].id as number,
		url: result.rows[0].url as string,
		position: result.rows[0].position as number,
	};
}

/**
 * Remove uma foto do banco E do Vercel Blob.
 *
 * [CONCEITO] Ordem importa: deletamos o registro do banco ANTES do Blob.
 * Se invertermos e o banco falhar depois do Blob deletado, perdemos o arquivo
 * mas o banco ainda aponta pra uma URL que não existe mais — link quebrado
 * sem como detectar. Com a ordem atual, se o Blob falhar, o registro do banco
 * ainda aponta pra URL válida — re-tentável sem corrupção de dado.
 */
export async function deletePhoto(
	entityType: EntityType,
	photoId: number,
	blobUrl: string,
): Promise<boolean> {
	const { table } = getConfig(entityType);
	const result = await pool.query(`DELETE FROM ${table} WHERE id = $1`, [
		photoId,
	]);
	if ((result.rowCount ?? 0) === 0) return false;

	// [CONCEITO] del() só aceita URLs do Vercel Blob.
	// Fotos históricas do JSON têm URLs de terceiros (plaenge.com.br, etc.)
	// que o Blob não conhece. Tentar deletar causa erro 400 da API do Blob.
	if (blobUrl.includes("public.blob.vercel-storage.com")) {
		await del(blobUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
	}

	return true;
}
