"use client";
// components/clients-grid.tsx
//
// [MUDANÇA] Três mudanças coordenadas:
//
// 1. ClientItem agora recebe { nome, categoria, siteUrl } em vez de { key, category }.
//
// 2. logoMap recebido como prop (construído no Server Component via buildLogoMap/fs).
//    Client Components não podem usar fs — por isso o mapa vem pronto do servidor.
//    Mesmo padrão já usado em ClientCarouselClient (client-carousel-client.tsx).
//
// 3. ClientLogo usa logoMap + useTheme() pra escolher variante light/dark.
//    Sem Clearbit, sem favicon, sem requests externos — só arquivos locais.

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import Image from "next/image";
import {
	categoryIconsClient,
	type categoryClients,
} from "@/lib/repositories/clients-repository";
import type { LogoEntry } from "@/lib/utils/logo-resolver";

// ─── Tipos ────────────────────────────────────────────────────────────────

export interface ClientItem {
	nome: string;
	categoria: categoryClients;
	siteUrl: string | null;
}

interface ClientsGridProps {
	clients: ClientItem[];
	logoMap: Record<string, LogoEntry>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

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
// [CONCEITO] useTheme().resolvedTheme em vez de theme porque `theme` pode ser
// "system", que não é diretamente mapeável pra light/dark. resolvedTheme já
// resolve "system" com base na preferência do SO do usuário.
// No primeiro render (antes de hidratação), resolvedTheme é undefined —
// fallback pra "light" evita flash de logo errado.

interface ClientLogoProps {
	nome: string;
	logoMap: Record<string, LogoEntry>;
}

function ClientLogo({ nome, logoMap }: ClientLogoProps) {
	const { resolvedTheme } = useTheme();
	const isDark = resolvedTheme === "dark";

	const entry = logoMap[nome];
	const logoPath = entry
		? isDark
			? (entry.dark ?? entry.light)
			: (entry.light ?? entry.dark)
		: null;

	if (!logoPath) {
		return (
			<div
				style={{
					width: 56,
					height: 56,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: 16,
					fontWeight: 700,
					color: "hsl(var(--primary))",
					background: "hsl(var(--primary) / 0.08)",
					borderRadius: 8,
					flexShrink: 0,
				}}
			>
				{getInitials(nome)}
			</div>
		);
	}

	return (
		<div
			style={{
				width: 56,
				height: 56,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexShrink: 0,
				position: "relative",
			}}
		>
			<Image
				src={logoPath}
				alt={`Logo ${nome}`}
				width={56}
				height={56}
				style={{ objectFit: "contain" }}
			/>
		</div>
	);
}

// ─── Componente principal: ClientsGrid ────────────────────────────────────

export function ClientsGrid({ clients, logoMap }: ClientsGridProps) {
	if (clients.length === 0) {
		return (
			<p className="text-center text-muted-foreground text-sm py-8">
				Nenhum cliente publicado ainda.
			</p>
		);
	}

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
			{clients.map((client, i) => {
				const Icon = categoryIconsClient[client.categoria];
				const inner = (
					<>
						<ClientLogo nome={client.nome} logoMap={logoMap} />
						<div>
							<p className="text-xs font-semibold text-foreground leading-tight">
								{client.nome}
							</p>
							<div className="flex items-center justify-center gap-1 mt-1">
								<Icon className="h-3 w-3 text-muted-foreground" />
								<p className="text-xs text-muted-foreground">
									{client.categoria}
								</p>
							</div>
						</div>
					</>
				);

				return (
					<motion.div
						key={client.nome}
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3, delay: i * 0.03 }}
					>
						{client.siteUrl ? (
							<a
								href={client.siteUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 bg-card transition-colors text-center"
							>
								{inner}
							</a>
						) : (
							<div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border bg-card text-center">
								{inner}
							</div>
						)}
					</motion.div>
				);
			})}
		</div>
	);
}
