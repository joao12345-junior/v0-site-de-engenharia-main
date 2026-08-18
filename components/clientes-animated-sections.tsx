"use client";

// components/clientes-animated-sections.tsx
//
// [CONCEITO] Componente wrapper "use client" criado para isolar animações.
// A página app/clientes/page.tsx precisa permanecer Server Component porque
// importa clients-grid-server.tsx → logo-resolver.ts → fs (Node.js).
// "fs" não existe no browser — se a página vira "use client", o build quebra.
//
// Solução: extrair as seções que usam Framer Motion para este componente.
// A página permanece no servidor. Apenas este componente vai para o cliente.

import { motion } from "framer-motion";
import { Quote, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	fadeUpVariants,
	staggerContainerVariants,
	staggerContainerDelayedVariants,
	defaultViewport,
	shortSectionViewport,
} from "@/lib/animation-variants";

// ─── Tipos ────────────────────────────────────────────────────────────────

interface Testimonial {
	quote: string;
	author: string;
	role: string;
	company: string;
	rating: number;
}

interface Props {
	testimonials: Testimonial[];
}

// ─── Hero animado ─────────────────────────────────────────────────────────

export function HeroAnimated() {
	return (
		<motion.div
			className="mx-auto max-w-3xl text-center"
			variants={fadeUpVariants}
			initial="hidden"
			whileInView="visible"
			viewport={defaultViewport}
		>
			<div className="flex items-center justify-center gap-2 text-sm text-primary mb-4">
				<span className="h-px w-8 bg-primary" />
				Nossos Clientes
				<span className="h-px w-8 bg-primary" />
			</div>
			<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
				Parceiros de Confiança
			</h1>
			<p className="mt-6 text-lg text-muted-foreground leading-relaxed">
				Desde 2010, trabalhamos com construtoras, incorporadoras, redes de
				varejo e hospitais que exigem precisão técnica e cumprimento de normas.
				São mais de 40 parceiros que confiam na Optare para os projetos
				complementares dos seus empreendimentos.
			</p>
		</motion.div>
	);
}

// ─── Heading de seção animado ─────────────────────────────────────────────

export function SectionHeadingAnimated({
	title,
	subtitle,
}: {
	title: string;
	subtitle: string;
}) {
	return (
		<motion.div
			className="text-center mb-16"
			variants={fadeUpVariants}
			initial="hidden"
			whileInView="visible"
			viewport={defaultViewport}
		>
			<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
				{title}
			</h2>
			<p className="mt-4 text-muted-foreground">{subtitle}</p>
		</motion.div>
	);
}

// ─── Grid de depoimentos animado ──────────────────────────────────────────

export function TestimonialsAnimated({ testimonials }: Props) {
	return (
		<motion.div
			className="grid md:grid-cols-3 gap-8"
			variants={staggerContainerDelayedVariants}
			initial="hidden"
			whileInView="visible"
			viewport={defaultViewport}
		>
			{testimonials.map((t) => (
				<motion.div
					key={t.author}
					variants={fadeUpVariants}
					className="bg-card p-8 rounded-lg border border-border"
				>
					<Quote className="h-8 w-8 text-primary/30 mb-4" />
					<p className="text-muted-foreground leading-relaxed">"{t.quote}"</p>
					<div className="flex gap-1 mt-4">
						{Array.from({ length: t.rating }).map((_, j) => (
							<Star key={j} className="h-4 w-4 fill-primary text-primary" />
						))}
					</div>
					<div className="mt-4 pt-4 border-t border-border">
						<div className="font-semibold text-foreground">{t.author}</div>
						<div className="text-sm text-muted-foreground">{t.role}</div>
						<div className="text-sm text-primary mt-0.5">{t.company}</div>
					</div>
				</motion.div>
			))}
		</motion.div>
	);
}

// ─── CTA animado ──────────────────────────────────────────────────────────

export function CTAAnimated() {
	return (
		<motion.div
			variants={staggerContainerDelayedVariants}
			initial="hidden"
			whileInView="visible"
			viewport={shortSectionViewport}
		>
			<motion.h2
				variants={fadeUpVariants}
				className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl"
			>
				Seu empreendimento merece projetos de excelência
			</motion.h2>
			<motion.p
				variants={fadeUpVariants}
				className="mt-4 text-lg text-primary-foreground/80"
			>
				Junte-se às construtoras, incorporadoras e empresas que já confiam na
				Optare para os projetos complementares dos seus empreendimentos no Rio
				Grande do Sul.
			</motion.p>
			<motion.div variants={fadeUpVariants} className="mt-8">
				<Button size="lg" variant="secondary" asChild>
					<Link href="/contato">
						Solicitar Orçamento
						<ArrowRight className="ml-2 h-4 w-4" />
					</Link>
				</Button>
			</motion.div>
		</motion.div>
	);
}
