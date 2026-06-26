// lib/repositories/admin/products-repository.ts
//
// [CONCEITO] Mesmo padrão de admin/projects-repository.ts.
// Diferenças em relação a projects:
//   1. Sem JOIN — produto não tem FK pra outra tabela, mapRow é direto.
//   2. sku é UNIQUE no banco — createProduct e updateProduct podem lançar
//      erro 23505 (unique_violation), tratado nas rotas de API.
//   3. publishProduct() segue o mesmo padrão de publishProject() —
//      ação de negócio nomeada, não um PATCH genérico, mesmo sendo simples.
//      Consistência entre entidades vale mais que evitar uma função "pequena".

import { pool } from "@/lib/db/db";
import { TABLES } from "@/lib/db/tables";
import type {
	Produto,
	TipoProduto,
	StatusProduto,
} from "@/app/admin/painel/lib/types";

export interface NovoProduto {
	nome: string;
	tipo: TipoProduto;
	sku: string;
	lancamento?: string;
	preco?: string;
}

export type AtualizacaoProduto = Partial<
	Pick<
		Produto,
		| "nome"
		| "tipo"
		| "sku"
		| "lancamento"
		| "preco"
		| "status"
		| "visible"
		| "capa"
	>
>;

function mapRow(row: Record<string, unknown>): Produto {
	return {
		id: row.id as string,
		nome: row.name as string,
		tipo: row.type as TipoProduto,
		sku: row.sku as string,
		lancamento: (row.release as string) ?? "",
		preco: (row.price as string) ?? "",
		status: row.status as StatusProduto,
		visible: row.visible as boolean,
		capa: (row.cover_url as string | null) ?? undefined,
		photos: [], // galeria fica pra product_photos — mesmo escopo de projects
	};
}

export async function listAllProducts(): Promise<Produto[]> {
	const result = await pool.query(`
		SELECT * FROM ${TABLES.products}
		ORDER BY created_at DESC
	`);
	return result.rows.map(mapRow);
}

export async function getProductById(id: string): Promise<Produto | null> {
	const result = await pool.query(
		`SELECT * FROM ${TABLES.products} WHERE id = $1`,
		[id],
	);
	return result.rows[0] ? mapRow(result.rows[0]) : null;
}

export async function createProduct(data: NovoProduto): Promise<Produto> {
	const result = await pool.query(
		`INSERT INTO ${TABLES.products} (name, type, sku, release, price)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING id`,
		[
			data.nome,
			data.tipo,
			data.sku,
			data.lancamento ?? null,
			data.preco ?? null,
		],
	);
	return (await getProductById(result.rows[0].id))!;
}

export async function updateProduct(
	id: string,
	data: AtualizacaoProduto,
): Promise<Produto | null> {
	const fields: string[] = [];
	const values: unknown[] = [];
	let i = 1;

	if (data.nome !== undefined) {
		fields.push(`name = $${i++}`);
		values.push(data.nome);
	}
	if (data.tipo !== undefined) {
		fields.push(`type = $${i++}`);
		values.push(data.tipo);
	}
	if (data.sku !== undefined) {
		fields.push(`sku = $${i++}`);
		values.push(data.sku);
	}
	if (data.lancamento !== undefined) {
		fields.push(`release = $${i++}`);
		values.push(data.lancamento);
	}
	if (data.preco !== undefined) {
		fields.push(`price = $${i++}`);
		values.push(data.preco);
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

	if (fields.length === 0) return getProductById(id);

	fields.push(`updated_at = now()`);
	values.push(id);

	const result = await pool.query(
		`UPDATE ${TABLES.products} SET ${fields.join(", ")} WHERE id = $${i} RETURNING id`,
		values,
	);
	if (result.rowCount === 0) return null;
	return getProductById(id);
}

/**
 * Publica o produto: status='Aprovado' + visible=true, atomicamente.
 * Mesmo contrato de publishProject() — consistência entre entidades.
 */
export async function publishProduct(id: string): Promise<Produto | null> {
	const result = await pool.query(
		`UPDATE ${TABLES.products}
		 SET status = 'Aprovado', visible = true, updated_at = now()
		 WHERE id = $1
		 RETURNING id`,
		[id],
	);
	if (result.rowCount === 0) return null;
	return getProductById(id);
}

export async function deleteProduct(id: string): Promise<boolean> {
	const result = await pool.query(
		`DELETE FROM ${TABLES.products} WHERE id = $1`,
		[id],
	);
	return (result.rowCount ?? 0) > 0;
}
