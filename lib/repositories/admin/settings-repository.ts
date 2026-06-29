// lib/repositories/admin/settings-repository.ts
//
// [CONCEITO] Repositório de configurações globais do sistema.
// Segue o mesmo padrão dos outros repositórios: isola o SQL,
// expõe funções com nomes de domínio (getMaintenanceMode, não "SELECT value").

import { pool } from "@/lib/db/db";

const SETTINGS_TABLE = "site_optare_admin.settings";

/** Retorna se o site público está em modo manutenção. */
export async function getMaintenanceMode(): Promise<boolean> {
	const result = await pool.query(
		`SELECT value FROM ${SETTINGS_TABLE} WHERE key = 'maintenance_mode'`,
	);
	return result.rows[0]?.value === "true";
}

/** Liga ou desliga o modo manutenção. */
export async function setMaintenanceMode(enabled: boolean): Promise<void> {
	await pool.query(
		`INSERT INTO ${SETTINGS_TABLE} (key, value, updated_at)
         VALUES ('maintenance_mode', $1, NOW())
         ON CONFLICT (key) DO UPDATE
         SET value = $1, updated_at = NOW()`,
		[enabled ? "true" : "false"],
	);
}
