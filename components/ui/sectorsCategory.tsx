// components/ui/sectorsCategory.tsx
"use client";

import {
	categoryClients,
	categoryCounts,
	categoryIconsClient,
} from "@/lib/repositories/clients-repository";
import { useCountUp } from "@/hooks/use-count-up";
import type { LucideIcon } from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────

interface SectorCardProps {
	category: string;
	count: number;
	Icon: LucideIcon;
}

// ─── Sub-componente: SectorCard ───────────────────────────────────────────
// [CONCEITO] Componente filho para resolver a Regra dos Hooks em loops.
// Cada card tem seu próprio estado de animação — isolado e independente.
// O pai (SectorsCategory) não sabe nada sobre animação — só monta os cards.
// Isso é o Single Responsibility Principle aplicado:
//   SectorsCategory  → responsabilidade: iterar e montar cards
//   SectorCard       → responsabilidade: exibir e animar um setor

function SectorCard({ category, count, Icon }: SectorCardProps) {
	// Cada SectorCard instancia seu próprio useCountUp.
	// Como são componentes separados, o React rastreia os hooks de cada um
	// individualmente — sem violar a Regra dos Hooks.
	const { value, ref } = useCountUp({ end: count, duration: 6000 });

	return (
		<div className="bg-card p-4 md:p-6 rounded-lg border border-border text-center hover:border-primary/50 transition-colors">
			<div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-2 md:p-3 mb-3 md:mb-4">
				<Icon className="h-7 w-7 md:h-10 md:w-10 text-primary" />
			</div>

			<h3 className="text-sm md:text-base font-semibold text-foreground">
				{category}
			</h3>

			{/*
			 * ref está no <p> que exibe o número — é ele que o IntersectionObserver
			 * precisa "ver" entrando na viewport para disparar a animação.
			 * [MUDANÇA] Texto: text-primary (vermelho no fundo claro)
			 * vs StatsSection que usa text-primary-foreground (branco no fundo vermelho)
			 */}
			<p
				ref={ref as React.RefObject<HTMLParagraphElement>}
				className="text-xl md:text-2xl font-bold text-primary mt-1 md:mt-2"
			>
				{value}+
			</p>

			<p className="text-xs text-muted-foreground">clientes</p>
		</div>
	);
}

// ─── Componente principal: SectorsCategory ────────────────────────────────
// [MUDANÇA] Responsabilidade reduzida: só filtra e monta SectorCards.
// A lógica de animação e exibição ficou no SectorCard.
// StatCounter foi removido — não pertence a este arquivo.

export function SectorsCategory() {
	return (
		<>
			{Object.entries(categoryCounts).map(([category, count]) => {
				// Educação continua oculto — decisão de negócio existente
				if (category === "Educação") return null;

				const Icon = categoryIconsClient[category as categoryClients];

				return (
					<SectorCard
						key={category}
						category={category}
						count={count}
						Icon={Icon}
					/>
				);
			})}
		</>
	);
}
