// lib/db/db.ts
import pkg from "pg";

const { Pool } = pkg;

export const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: false,
	max: 6, // máximo de conexões simultâneas no plano compartilhado
	connectionTimeoutMillis: 10000, // falha em 10s em vez de ficar pendurado 25s
	idleTimeoutMillis: 30000, // fecha conexões ociosas após 30s
});
