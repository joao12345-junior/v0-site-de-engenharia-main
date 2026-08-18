// lib/db/tables.ts
//
// [CONCEITO] Registro central de nomes de tabela.
//
// Resolve o problema real que motivou a discussão de consolidar schemas:
// visibilidade de quais tabelas existem, e o TypeScript ajudando a escolher
// a certa em vez de confiar em string solta espalhada pelo código.
//
// Isso entrega a mesma visibilidade que juntar tudo num schema único daria —
// sem o custo de migrar dado em produção/preview e reescrever queries que já
// funcionam (login, refresh, contato). Decisão registrada em optare-deploy/SKILL.md.
//
// Uso:
//   import { TABLES } from "@/lib/db/tables";
//   pool.query(`SELECT * FROM ${TABLES.users} WHERE email = $1`, [email]);
//
// [ATENÇÃO] Isso NÃO substitui parametrização de valores ($1, $2...) — nomes
// de tabela aqui são constantes do próprio código, nunca vêm de input do
// usuário. Misturar isso com SQL injection seria um erro de categoria
// diferente: nunca interpole valor de formulário/request direto numa query,
// só nomes fixos como estes.

export const TABLES = {
	// ─── site_optare_user — sessões e tentativas de login ──────────────────
	users: "site_optare_user.user",
	userLoginAttempts: "site_optare_user.attempts",

	// ─── site_optare_admin — credenciais do painel ──────────────────────────
	admins: "site_optare_admin.admin",

	// ─── site_optare_email — formulário de contato ──────────────────────────
	contactMessages: "site_optare_email.mensagens",
	contactAttempts: "site_optare_email.attempts",

	// ─── site_optare_content — conteúdo publicável (admin → site público) ──
	clients: "site_optare_content.clients",
	projects: "site_optare_content.projects",
	projectPhotos: "site_optare_content.project_photos",
	products: "site_optare_content.products",
	productPhotos: "site_optare_content.product_photos",
} as const;

// [CONCEITO] `typeof TABLES` pega o tipo do objeto inteiro.
// `keyof` extrai as chaves como union type: "users" | "userLoginAttempts" | ...
// Resultado: um tipo que só aceita os nomes que realmente existem no registro —
// digitar TableName errado vira erro de compilação, não erro de runtime.
export type TableName = keyof typeof TABLES;
