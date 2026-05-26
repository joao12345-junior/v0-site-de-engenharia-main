// lib/utils/logo-resolver.ts
// SEM "use client" — roda no servidor

import fs from "fs";
import path from "path";

// ─── Tipos ────────────────────────────────────────────────────────────────

export interface LogoEntry {
	light: string | null;
	dark: string | null;
}

// ─── Constantes ───────────────────────────────────────────────────────────

const LOGOS_DIR = path.join(process.cwd(), "public/images/logos/clients");

// ─── Função exportada ─────────────────────────────────────────────────────

/**
 * Lê o diretório de logos UMA vez e monta o mapa nome → { light, dark }.
 *
 * Convenção de nomenclatura:
 *   "Cliente black.svg" → variante light (logo escuro para fundo claro)
 *   "Cliente white.svg" → variante dark  (logo claro para fundo escuro)
 *   "Cliente.png"       → mesmo arquivo nos dois temas
 */
export function buildLogoMap(clientNames: string[]): Record<string, LogoEntry> {
	const files = fs.existsSync(LOGOS_DIR) ? fs.readdirSync(LOGOS_DIR) : [];

	return Object.fromEntries(
		clientNames.map((name) => {
			const nameLower = name.toLowerCase();

			const blackFile = files.find(
				(f) =>
					f.toLowerCase().startsWith(nameLower) &&
					f.toLowerCase().includes("black"),
			);

			const whiteFile = files.find(
				(f) =>
					f.toLowerCase().startsWith(nameLower) &&
					f.toLowerCase().includes("white"),
			);

			const defaultFile = files.find((f) => {
				// Ignora arquivos que já foram capturados como variantes de tema
				if (f === blackFile || f === whiteFile) return false;
				return f.toLowerCase().startsWith(nameLower);
			});

			const toUrl = (f: string | undefined) =>
				f ? `/images/logos/clients/${f}` : null;

			return [
				name,
				{
					light: toUrl(blackFile ?? defaultFile),
					dark: toUrl(whiteFile ?? defaultFile),
				},
			];
		}),
	);
}
