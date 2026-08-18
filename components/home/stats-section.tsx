"use client";

import { useCountUp } from "@/hooks/use-count-up";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
	staggerContainerVariants,
	defaultViewport,
} from "@/lib/animation-variants";

// ─── Variant local: razão visual específica desta seção ──────────────────
//
// [DECISÃO] y: -16 (slide de cima para baixo) — o fundo vermelho cria
// uma âncora visual pesada na parte inferior. O conteúdo "descendo"
// reforça esse peso. Variant aqui, não no arquivo central: contexto único.
const statItemVariants: Variants = {
	hidden: { opacity: 0, y: -16 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.45, ease: "easeOut" },
	},
};

interface StatItem {
	value: number;
	suffix: string;
	prefix: string;
	label: string;
}

const stats: StatItem[] = [
	{ value: 15, prefix: "+", suffix: "", label: "Anos de Experiência" },
	{ value: 1000, prefix: "+", suffix: "", label: "Projetos Realizados" },
	{ value: 50, prefix: "+", suffix: "", label: "Clientes Satisfeitos" },
	{ value: 5, prefix: "+", suffix: "M", label: "Metros Quadrados Projetados" },
];

// ─── Sub-componente: StatCounter (intocado) ───────────────────────────────
function StatCounter({ stat }: { stat: StatItem }) {
	const { value, ref } = useCountUp({ end: stat.value, duration: 3000 });

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
				{/*
          [DECISÃO] motion.div envolve o grid — não o <section>.
          Animar o <section> moveria o fundo vermelho junto, criando
          um efeito de "fundo piscando" indesejado. Apenas o conteúdo
          interno deve animar.
        */}
				<motion.div
					className="grid grid-cols-2 gap-8 md:grid-cols-4"
					variants={staggerContainerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={defaultViewport}
				>
					{stats.map((stat) => (
						/*
              [DECISÃO] motion.div envolve StatCounter sem tocá-lo.
              StatCounter é uma caixa preta — não sabemos se tem
              efeitos colaterais internos. Envolver por fora é o
              padrão seguro para animar componentes de terceiros
              (ou componentes com lógica própria).
            */
						<motion.div key={stat.label} variants={statItemVariants}>
							<StatCounter stat={stat} />
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
