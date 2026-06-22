"use client";
// components/projetos-client.tsx
//
// [CONCEITO] Mesma separação de clientes-animated-sections.tsx e ClientCarouselClient:
// o Server Component (page.tsx) busca dados e os passa como prop.
// Este Client Component cuida de tudo que precisa do browser:
// - useState (filtro ativo)
// - useMemo (lista filtrada)
// - Framer Motion (animações)
// - ImageCarousel (usa estado de imagem atual)

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Building2 } from "lucide-react";
import {
	motion,
	AnimatePresence,
	LayoutGroup,
	type Variants,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { ImageCarousel } from "@/components/ui/image-carousel";
import {
	fadeUpVariants,
	fadeInVariants,
	scaleInVariants,
	staggerContainerDelayedVariants,
	defaultViewport,
	shortSectionViewport,
} from "@/lib/animation-variants";
import type { PublicProject } from "@/lib/repositories/public-projects-repository";

// ─── Variantes de card ────────────────────────────────────────────────────
// Mantidas iguais à versão original — não mexer sem necessidade.

const cardVariants: Variants = {
	initial: { opacity: 0, y: 16, scale: 0.97 },
	animate: (index: number) => ({
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.3,
			delay: Math.min(index, 8) * 0.04,
			ease: "easeOut" as const,
		},
	}),
	exit: {
		opacity: 0,
		scale: 0.95,
		transition: { duration: 0.15, ease: "easeIn" as const },
	},
};

// ─── Tipos de categoria disponíveis ───────────────────────────────────────
// [MUDANÇA] Antes: filtro por nome de cliente (equívoco herdado do JSON).
// Agora: filtro por categoria real do banco (Comercial/Residencial/Saúde).

const CATEGORIAS_FIXAS = [
	"Todos",
	"Comercial",
	"Residencial",
	"Saúde",
] as const;

// ─── Props ────────────────────────────────────────────────────────────────

interface ProjetosClientProps {
	projects: PublicProject[];
}

// ─── Componente principal ─────────────────────────────────────────────────

export function ProjetosClient({ projects }: ProjetosClientProps) {
	const [activeCategory, setActiveCategory] = useState("Todos");

	const filtered = useMemo(
		() =>
			activeCategory === "Todos"
				? projects
				: projects.filter((p) => p.categoria === activeCategory),
		[activeCategory, projects],
	);

	// Imagens pra cada projeto: project_photos primeiro, cover_url como fallback
	function resolveImages(p: PublicProject): string[] {
		if (p.photos.length > 0) return p.photos;
		if (p.coverUrl) return [p.coverUrl];
		return [];
	}

	return (
		<>
			{/* ── Hero ── */}
			<section className="py-24 bg-card">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<motion.div
						className="mx-auto max-w-3xl text-center"
						variants={fadeUpVariants}
						initial="hidden"
						whileInView="visible"
						viewport={defaultViewport}
					>
						<div className="flex items-center justify-center gap-2 text-sm text-primary mb-4">
							<span className="h-px w-8 bg-primary" />
							Projetos
							<span className="h-px w-8 bg-primary" />
						</div>
						<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
							Nossos Projetos
						</h1>
					</motion.div>
				</div>
			</section>

			{/* ── Filtros ── */}
			<motion.section
				className="py-8 border-b border-border"
				variants={fadeInVariants}
				initial="hidden"
				whileInView="visible"
				viewport={shortSectionViewport}
			>
				<div className="mx-auto max-w-7xl lg:px-8">
					<div className="grid grid-cols-2 gap-2 px-6 md:flex md:flex-wrap md:justify-center md:px-0">
						{CATEGORIAS_FIXAS.map((cat) => (
							<button
								key={cat}
								onClick={() => setActiveCategory(cat)}
								className={`w-full md:w-auto px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
									activeCategory === cat
										? "bg-primary text-primary-foreground scale-105"
										: "bg-muted text-muted-foreground hover:bg-muted/80"
								}`}
							>
								{cat}
							</button>
						))}
					</div>
				</div>
			</motion.section>

			{/* ── Grid de Projetos ── */}
			<section className="py-24">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					{filtered.length === 0 ? (
						<motion.p
							variants={fadeUpVariants}
							initial="hidden"
							animate="visible"
							className="text-center text-muted-foreground"
						>
							{activeCategory === "Todos"
								? "Nenhum projeto publicado ainda."
								: `Nenhum projeto na categoria "${activeCategory}".`}
						</motion.p>
					) : (
						<LayoutGroup>
							<motion.div
								layout
								className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
							>
								<AnimatePresence mode="popLayout">
									{filtered.map((project, index) => (
										<motion.div
											key={project.id}
											custom={index}
											variants={cardVariants}
											initial="initial"
											animate="animate"
											exit="exit"
											layout="position"
											className="group bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors"
										>
											<div className="relative">
												<ImageCarousel
													title={project.nome}
													images={resolveImages(project)}
													priority={index === 0}
													loading={index > 0 && index < 6 ? "eager" : "lazy"}
												/>
												<div className="absolute top-4 left-4">
													<span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
														{project.categoria}
													</span>
												</div>
											</div>

											<div className="p-6">
												<h3 className="text-lg font-semibold text-foreground">
													{project.nome}
												</h3>
												<div className="flex flex-col gap-1.5 mt-2">
													{project.cliente && (
														<span className="flex items-center gap-1.5 text-sm text-muted-foreground">
															<Building2 className="h-4 w-4 flex-shrink-0 text-primary/60" />
															{project.cliente}
														</span>
													)}
													<span className="flex items-center gap-1.5 text-sm text-muted-foreground">
														<MapPin className="h-4 w-4 flex-shrink-0" />
														{project.cidade || "Localização desconhecida"}
													</span>
												</div>
											</div>
										</motion.div>
									))}
								</AnimatePresence>
							</motion.div>
						</LayoutGroup>
					)}
				</div>
			</section>

			{/* ── CTA ── */}
			<section className="py-24 bg-card">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<motion.div
						className="text-center max-w-2xl mx-auto"
						variants={scaleInVariants}
						initial="hidden"
						whileInView="visible"
						viewport={shortSectionViewport}
					>
						<motion.div
							variants={staggerContainerDelayedVariants}
							initial="hidden"
							whileInView="visible"
							viewport={shortSectionViewport}
						>
							<motion.h2
								variants={fadeUpVariants}
								className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
							>
								Quer ver seu projeto aqui?
							</motion.h2>
							<motion.p
								variants={fadeUpVariants}
								className="mt-4 text-lg text-muted-foreground"
							>
								Entre em contato conosco para discutir como podemos transformar
								sua visão em realidade.
							</motion.p>
							<motion.div variants={fadeUpVariants} className="mt-8">
								<Button size="lg" asChild>
									<Link href="/contato">
										Iniciar Projeto
										<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</motion.div>
						</motion.div>
					</motion.div>
				</div>
			</section>
		</>
	);
}
