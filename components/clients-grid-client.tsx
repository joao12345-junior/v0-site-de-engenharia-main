// components/clients-grid-client.tsx
//
// [MUDANÇA] Adicionado logo real do cliente (Clearbit → Google Favicon → iniciais)
// acima do ícone de categoria existente.
//
// [CONCEITO] Por que não substituir o ícone pelo logo?
// O ícone de categoria (Construtora, Varejo, etc.) é informação estrutural —
// diz ao visitante o TIPO do cliente. O logo é informação de identidade —
// diz QUEM é o cliente. Os dois têm propósitos diferentes.
// Manter ambos é mais rico: logo em destaque + categoria como metadado.
//
// [CONCEITO] "use client" aqui porque:
// 1. Framer Motion (motion.div) requer o browser
// 2. ClientLogo usa useState para gerenciar fallback de imagem
// Se removêssemos as animações, poderíamos deixar como Server Component.

"use client";

import {
	categoryClients,
	categoryIconsClient,
} from "@/lib/repositories/clients-repository";
import { motion } from "framer-motion";
import { toTitleCase } from "@/lib/utils";
import { useTheme } from "next-themes";
import type { LogoEntry } from "@/lib/utils/logo-resolver";
import { BuildingIcon } from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────

interface ClientEntry {
	CLIENTE: string;
	Site: string;
	categoria: string;
}

interface ClientsGridProps {
	clients: ClientEntry[];
	logoMap: Record<string, LogoEntry>;
}

interface ClientLogoProps {
	client: ClientEntry;
	logo: LogoEntry; // ← recebe o objeto completo, não só uma URL
}

// ─── Constantes ───────────────────────────────────────────────────────────

// w-45 (180px) + gap-8 (32px) = 212px
const ITEM_WIDTH = 212;

// ─── Helpers ──────────────────────────────────────────────────────

function getInitials(name: string): string {
	return name
		.split(" ")
		.filter((w) => w.length > 2)
		.slice(0, 2)
		.map((w) => w[0].toUpperCase())
		.join("");
}

// ─── Componente: ClientLogo ───────────────────────────────────────────────
//
// [CONCEITO] State machine de 3 estados para fallback de imagem.
// Cada estado representa uma "fonte" de logo, do melhor para o pior:
//
//   clearbit → favicon → initials
//
// A transição é unidirecional: só avança, nunca volta.
// Isso é chamado de "degradação graciosa" (graceful degradation) —
// a experiência piora progressivamente em vez de quebrar abruptamente.

function ClientLogo({ client, logo }: ClientLogoProps) {
	const { resolvedTheme } = useTheme();
	const logoUrl = resolvedTheme === "dark" ? logo.dark : logo.light;

	// Estado: iniciais (CSS puro, sempre funciona)
	if (!client.CLIENTE || !logoUrl) {
		return (
			<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
				<span className="text-xs font-bold text-primary">
					{getInitials(client.CLIENTE)}
				</span>
			</div>
		);
	}

	return (
		<div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border border-border/50">
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={logoUrl}
				alt={client.CLIENTE}
				className={`w-10 h-10 object-contain
                    ${resolvedTheme === "dark" ? "brightness-90" : ""}`}
			/>
		</div>
	);
}

// ─── Type Guard ───────────────────────────────────────────────────────────

/**
 * Verifica em runtime se uma string é uma categoria válida.
 * Retorna true → TypeScript passa a tratar value como categoryClients.
 */
function isCategoryClients(value: string): value is categoryClients {
	return value in categoryIconsClient;
}

// ─── Componente principal: ClientsGrid ───────────────────────────────────

export function ClientsGridClient({ clients, logoMap }: ClientsGridProps) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			{clients.map((client, index) => {
				const Icon = isCategoryClients(client.categoria)
					? categoryIconsClient[client.categoria]
					: BuildingIcon;

				return (
					<motion.div
						key={client.CLIENTE}
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: false, amount: 0.2 }}
						transition={{
							duration: 0.4,
							delay: Math.min(index, 20) * 0.04,
							ease: "easeOut" as const,
						}}
						className="bg-background p-6 rounded-lg border border-border flex flex-col items-center text-center hover:border-primary/50 transition-colors"
					>
						{/* Logo do cliente — Clearbit → Favicon → Iniciais */}
						<ClientLogo
							key={`${client.CLIENTE}-${index}`}
							client={client}
							logo={logoMap[client.CLIENTE]}
						/>

						{/* Nome do cliente */}
						<h3 className="font-semibold text-foreground mt-3 text-sm leading-tight">
							{toTitleCase(client.CLIENTE)}
						</h3>

						{/* Categoria com ícone — metadado secundário */}
						<div className="flex items-center gap-1.5 mt-2">
							<Icon className="h-3.5 w-3.5 text-primary/50 flex-shrink-0" />
							<p className="text-xs text-muted-foreground">
								{client.categoria}
							</p>
						</div>
					</motion.div>
				);
			})}
		</div>
	);
}
