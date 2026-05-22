// components/clients-grid.tsx
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

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toTitleCase } from "@/lib/utils";
import {
	categoryIconsClient,
	type categoryClients,
} from "@/lib/repositories/clients-repository";
import clientsData from "@/public/JSON/clientes/clients.json";

// ─── Tipos ────────────────────────────────────────────────────────────────

interface ClientItem {
	key: string;
	category: categoryClients;
}

interface ClientsGridProps {
	clients: ClientItem[];
}

// ─── Mapa de URL de site por nome de cliente ──────────────────────────────
//
// [CONCEITO] Por que um Map e não um array com .find()?
// Map tem lookup O(1) — acesso instantâneo por chave.
// Array com .find() é O(n) — percorre até encontrar.
// Para 40+ clientes chamados a cada render de card, Map é a escolha certa.
// Isso é o que suas preferências de estudo mencionam: HashSet/HashMap em vez de arrays para lookups.
//
// Normalizamos para lowercase porque o `key` do ClientItem pode vir em
// formatos diferentes dependendo de como o repository transforma o JSON.

const clientSiteMap = new Map<string, string>(
	(clientsData as { CLIENTE: string; Site: string }[]).map((c) => [
		c.CLIENTE.toLowerCase(),
		c.Site,
	]),
);

// ─── Helpers de logo ──────────────────────────────────────────────────────

function getDomain(url: string): string {
	try {
		return new URL(url).hostname.replace("www.", "");
	} catch {
		return "";
	}
}

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

interface ClientLogoProps {
	clientName: string;
}

function ClientLogo({ clientName }: ClientLogoProps) {
	const siteUrl = clientSiteMap.get(clientName.toLowerCase()) ?? "";
	const domain = getDomain(siteUrl);
	const initials = getInitials(clientName);

	const [state, setState] = useState<"clearbit" | "favicon" | "initials">(
		domain ? "clearbit" : "initials",
	);

	const onClearbitError = useCallback(() => setState("favicon"), []);
	const onFaviconError = useCallback(() => setState("initials"), []);

	// Estado: iniciais (CSS puro, sempre funciona)
	if (state === "initials" || !domain) {
		return (
			<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
				<span className="text-xs font-bold text-primary">{initials}</span>
			</div>
		);
	}

	// Estado: Google Favicon (baixa resolução, mas cobre quase todos os domínios)
	if (state === "favicon") {
		return (
			<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
					alt={clientName}
					className="w-8 h-8 object-contain"
					onError={onFaviconError}
				/>
			</div>
		);
	}

	// Estado: Clearbit (alta qualidade, fonte primária)
	return (
		<div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border border-border/50">
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={`https://logo.clearbit.com/${domain}`}
				alt={clientName}
				className="w-10 h-10 object-contain"
				onError={onClearbitError}
			/>
		</div>
	);
}

// ─── Componente principal: ClientsGrid ───────────────────────────────────

export function ClientsGrid({ clients }: ClientsGridProps) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			{clients.map((client, index) => {
				const Icon = categoryIconsClient[client.category];

				return (
					<motion.div
						key={client.key}
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
						<ClientLogo clientName={client.key} />

						{/* Nome do cliente */}
						<h3 className="font-semibold text-foreground mt-3 text-sm leading-tight">
							{toTitleCase(client.key)}
						</h3>

						{/* Categoria com ícone — metadado secundário */}
						<div className="flex items-center gap-1.5 mt-2">
							<Icon className="h-3.5 w-3.5 text-primary/50 flex-shrink-0" />
							<p className="text-xs text-muted-foreground">{client.category}</p>
						</div>
					</motion.div>
				);
			})}
		</div>
	);
}
