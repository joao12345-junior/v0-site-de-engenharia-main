// lib/animation-variants.ts
//
// Fonte central de variants reutilizáveis do Framer Motion.
//
// [CONCEITO] Por que este arquivo existe?
// Variants repetidos em múltiplos componentes criam múltiplas fontes
// de verdade. Se o timing de animação do site precisar mudar (ex: de
// 0.5s para 0.4s), a mudança precisa acontecer em um único lugar.
// Este arquivo é esse lugar.
//
// [REGRA DE USO]
// - Variants AQUI: padrões reutilizáveis sem contexto visual específico
// - Variants NO COMPONENTE: animações com razão visual única (ex: slide
//   da direita porque o layout tem algo à direita)
//
// [CONVENÇÃO DE NOMENCLATURA]
// Sufixo "Variants" em todos os exports para facilitar autocomplete:
//   fadeUpVariants, fadeInVariants, staggerContainerVariants...

import type { Variants } from "framer-motion";

// ─── Fade + slide para cima ───────────────────────────────────────────────
//
// O padrão mais comum do site. Usado em headings, parágrafos, CTAs.
// y: 24 é sutil — perceptível sem ser distrativo.
export const fadeUpVariants: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: "easeOut" },
	},
};

// ─── Fade simples (sem deslocamento) ─────────────────────────────────────
//
// Para elementos que já têm posição definida pelo layout e não devem
// se mover — apenas aparecer. Ex: overlays, fundos, badges.
export const fadeInVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: 0.4, ease: "easeOut" },
	},
};

// ─── Container orquestrador de stagger ───────────────────────────────────
//
// Não tem animação visual própria — serve para coordenar os filhos.
// [CONCEITO] O "maestro" da orquestra: define o timing, não o som.
//
// Uso: envolve uma lista de elementos que devem aparecer em cascata.
// Os filhos devem usar fadeUpVariants (ou outro variant compatível).
export const staggerContainerVariants: Variants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.05,
		},
	},
};

// ─── Container com delay maior (para seções com heading próprio) ──────────
//
// Quando a seção já tem um heading que anima separadamente,
// os cards devem esperar um pouco mais para não sobrepor.
export const staggerContainerDelayedVariants: Variants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.15,
		},
	},
};

// ─── Fade + slide horizontal — da esquerda ────────────────────────────────
//
// Para colunas à esquerda em layouts de 2 colunas (convergência).
export const fadeLeftVariants: Variants = {
	hidden: { opacity: 0, x: -40 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.6, ease: "easeOut" },
	},
};

// ─── Fade + slide horizontal — da direita ────────────────────────────────
//
// Para colunas à direita em layouts de 2 colunas (convergência).
// delay: 0.15 garante que a coluna direita aparece DEPOIS da esquerda.
export const fadeRightVariants: Variants = {
	hidden: { opacity: 0, x: 40 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.6, ease: "easeOut", delay: 0.15 },
	},
};

// ─── Scale + fade (para cards e containers com "peso") ───────────────────
//
// Leve crescimento de 97%→100% dá sensação de "pouso".
// Usar com moderação — apenas para elementos de destaque (CTA, modal).
export const scaleInVariants: Variants = {
	hidden: { opacity: 0, scale: 0.97, y: 16 },
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: { duration: 0.45, ease: "easeOut" },
	},
};

// ─── Configurações padrão de viewport ────────────────────────────────────
//
// [CONCEITO] Por que exportar isso separado?
// viewport={{ once: true, margin: "-80px" }} se repete em todo whileInView.
// Extrair como constante garante que todos os componentes usam o mesmo
// threshold — consistência de comportamento em toda a aplicação.
//
// Uso: <motion.div whileInView="visible" viewport={defaultViewport}>
export const defaultViewport = {
	once: true,
	amount: 0.15,
} as const;

// Viewport para seções de baixa altura (ex: StatsSection, banners)
export const shortSectionViewport = {
	once: true,
	amount: 0.2,
} as const;
