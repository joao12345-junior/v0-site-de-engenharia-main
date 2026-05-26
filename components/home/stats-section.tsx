"use client";

import { useCountUp } from "@/hooks/use-count-up";

// ─── Tipos ────────────────────────────────────────────────────────────────

interface StatItem {
	// Valor numérico para animar
	value: number;

	// Sufixo exibido após o número animado. Ex: "M", "+"
	suffix: string;

	// Prefixo exibido antes do número. Ex: "+"
	prefix: string;
	label: string;
}

const stats: StatItem[] = [
	{ value: 15, prefix: "+", suffix: "", label: "Anos de Experiência" },
	{ value: 1000, prefix: "+", suffix: "", label: "Projetos Realizados" },
	{ value: 50, prefix: "+", suffix: "", label: "Clientes Satisfeitos" },
	{ value: 5, prefix: "+", suffix: "M", label: "Metros Quadrados Projetados" },
];

// ─── Sub-componente: StatCounter ─────────────────────────────────────────

function StatCounter({ stat }: { stat: StatItem }) {
	const { value, ref } = useCountUp({ end: stat.value, duration: 2000 });

	return (
		<div className="text-center">
			<p
				ref={ref as React.RefObject<HTMLParagraphElement>}
				className="text-4xl font-bold text-primary-foreground sm:text-5xl"
			>
				{stat.prefix}
				{value}
				{stat.suffix}
			</p>
			<p className="mt-2 text-sm text-primary-foreground/80">{stat.label}</p>
		</div>
	);
}

// ─── Componente principal ─────────────────────────────────────────────────

export function StatsSection() {
	return (
		<section className="py-16 bg-primary">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
					{stats.map((stat) => (
						<StatCounter key={stat.label} stat={stat} />
					))}
				</div>
			</div>
		</section>
	);
}
