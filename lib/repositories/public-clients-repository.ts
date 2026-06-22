// lib/repositories/public-clients-repository.ts
//
// [CONCEITO] Server-only — importa `pool` (Node.js/pg), nunca deve ser
// importado por Client Components. O TypeScript/bundler não previne isso
// automaticamente, mas o Next.js vai dar erro de build se acontecer.
// A convenção de pasta (lib/repositories/) já sinaliza isso pra quem lê.
//
// [SEPARAÇÃO DE RESPONSABILIDADES]
// lib/repositories/clients-repository.ts   → lê JSON estático (build-time), usado por ClientCarousel etc.
// lib/repositories/admin/clients-repository.ts → CRUD admin (autenticado, lê/escreve no banco)
// lib/repositories/public-clients-repository.ts → leitura pública do banco (visible=true)
//
// Três arquivos, três papéis distintos — nenhum faz o trabalho do outro.

import { pool } from "@/lib/db/db";
import { TABLES } from "@/lib/db/tables";
import type { categoryClients } from "@/lib/repositories/clients-repository";

export interface PublicClient {
	id: string;
	nome: string;
	categoria: categoryClients;
	siteUrl: string | null;
}

export interface CategoryCount {
	categoria: categoryClients;
	total: number;
}

/**
 * Busca todos os clientes publicados (visible=true), com contagem por categoria.
 * Usado pela página pública /clientes — Server Component, sem autenticação.
 *
 * [CONCEITO] Uma query com GROUP BY em vez de duas queries separadas.
 * Poderíamos buscar clientes em uma query e contagens em outra, mas isso
 * são duas viagens de rede ao banco pra resolver uma coisa só.
 * GROUP BY resolve direto no Postgres, que é especialista nisso.
 */
export async function getPublicClients(): Promise<{
	clients: PublicClient[];
	counts: Record<categoryClients, number>;
}> {
	// [MUDANÇA] Duas queries ainda: uma pro dado individual (clientes),
	// outra pra agregação (contagem por categoria). Não é possível fazer
	// GROUP BY e SELECT individual numa única query de forma limpa —
	// misturar os dois produz SQL mais complexo que não compensa aqui.
	const [clientsResult, countsResult] = await Promise.all([
		pool.query(
			`SELECT id, name, category, site_url
			 FROM ${TABLES.clients}
			 WHERE visible = true
			 ORDER BY name ASC`,
		),
		pool.query(
			`SELECT category, COUNT(*) AS total
			 FROM ${TABLES.clients}
			 WHERE visible = true
			 GROUP BY category`,
		),
	]);

	const clients: PublicClient[] = clientsResult.rows.map((row) => ({
		id: row.id as string,
		nome: row.name as string,
		categoria: row.category as categoryClients,
		siteUrl: (row.site_url as string | null) ?? null,
	}));

	// [CONCEITO] Reduzir array de { categoria, total } num Record<categoria, number>
	// é mais ergonômico pro componente — acessa counts["Construção"] em vez de
	// ter que dar .find() no array toda vez que renderizar um card de setor.
	const defaultCounts: Record<categoryClients, number> = {
		Construção: 0,
		Arquitetura: 0,
		Varejo: 0,
		Saúde: 0,
		Educação: 0,
	};

	const counts = countsResult.rows.reduce((acc, row) => {
		acc[row.category as categoryClients] = Number(row.total);
		return acc;
	}, defaultCounts);

	return { clients, counts };
}
