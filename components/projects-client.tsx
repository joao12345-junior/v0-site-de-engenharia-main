"use client";
// components/projects-client.tsx
//
// [CONCEITO] Client Component por uma razão específica e só por ela:
// useState (filtro ativo) e as animações do Framer Motion (LayoutGroup,
// AnimatePresence). Tudo que é dado já chegou pronto via props — zero fetch aqui.
//
// [MUDANÇA] Filtro agora é por `categoria` (Comercial/Residencial/Saúde)
// em vez de por nome de cliente. Motivo: o campo anterior chamava "category"
// mas guardava o nome do cliente — uma mentira no código que confundia
// quem lia. Com o banco, `categoria` tem o shape correto e é mais escalável:
// 3 opções fixas em vez de N opções crescendo com cada cliente novo.

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	motion,
	AnimatePresence,
	LayoutGroup,
	type Variants,
} from "framer-motion";
import { ImageCarousel } from "@/components/ui/image-carousel";
import {
	fadeUpVariants,
	fadeInVariants,
	scaleInVariants,
	staggerContainerDelayedVariants,
	defaultViewport,
	shortSectionViewport,
} from "@/lib/animation-variants";
import type {
	PublicProject,
	CategoriaPublica,
} from "@/lib/repositories/public-projects-repository";
import type { Photo } from "@/lib/repositories/admin/photos-repository";

// ─── Tipos ────────────────────────────────────────────────────────────────

interface ProjectsClientProps {
	projects: PublicProject[];
}

// ─── Variantes de animação dos cards ─────────────────────────────────────
//
// [CONCEITO] `custom` no Framer Motion:
// Quando você usa `custom={index}` num motion.div, o Framer Motion passa
// esse valor pra função de variante. Isso permite delays diferentes
// por card sem criar um objeto de variante por índice.
// `Math.min(index, 8)` limita o delay máximo em ~320ms (8 × 40ms) —
// sem isso, o 30º card esperaria 1.2s pra aparecer.

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

// ─── Constante: categorias disponíveis ────────────────────────────────────
//
// [CONCEITO] Por que constante em vez de derivar dos dados?
// As categorias são um enum fixo do domínio — sempre serão essas três,
// independente de quantos projetos existam. Derivar dos dados seria
// correto se as categorias fossem abertas (como nomes de cliente), mas
// aqui o schema do banco já define o conjunto fechado via CHECK constraint.

const CATEGORIAS: CategoriaPublica[] = ["Comercial", "Residencial", "Saúde"];

// ─── Componente principal ─────────────────────────────────────────────────
export function ProjectsClient({ projects }: ProjectsClientProps) {
	const [activeCategory, setActiveCategory] = useState<
		"Todos" | CategoriaPublica
	>("Todos");
	// [CONCEITO] useMemo com dependência em [activeCategory, projects]:
	// Recalcula só quando o filtro ou os dados mudam.
	// Sem useMemo, filteredProjects seria recalculado a cada re-render
	// (ex: hover num botão causaria re-render e re-filtragem desnecessária).
	const filteredProjects = useMemo(
		() =>
			activeCategory === "Todos"
				? projects
				: projects.filter((p) => p.categoria === activeCategory),
		[activeCategory, projects],
	);

	return (
		<>
			{/* ── Hero ── */}
			{/*
			 * [CONCEITO] Por que o Hero animado pode ficar aqui em vez de num
			 * componente separado como em clientes-animated-sections.tsx?
			 * Porque esse componente já é "use client" — o Framer Motion funciona.
			 * Em clientes, o Hero ficou separado porque a page.tsx precisava
			 * manter o buildLogoMap (fs.readdir) no Server Component. Aqui não
			 * há essa restrição: o Server Component só faz a query e passa os dados.
			 */}
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
						<p className="mt-6 text-lg text-muted-foreground leading-relaxed">
							Projetos de engenharia complementar realizados em parceria com as
							maiores construtoras, redes de varejo e hospitais do Sul do
							Brasil.
						</p>
					</motion.div>
				</div>
			</section>

			{/* ── Filtros ── */}
			{/*
			  [DECISÃO] motion.section com fadeInVariants — sem slide.
			  Filtros são controles funcionais: animação de slide chamaria
			  atenção para o container em vez de para os botões.
			  Fade simples mantém a presença sem distrair.
			  shortSectionViewport: seção de baixa altura, margin menor.
			*/}
			<motion.section
				className="py-8 border-b border-border"
				variants={fadeInVariants}
				initial="hidden"
				whileInView="visible"
				viewport={shortSectionViewport}
			>
				<div className="mx-auto max-w-7xl lg:px-8">
					<div className="grid grid-cols-2 gap-2 px-6 md:flex md:flex-wrap md:justify-center md:px-0">
						{(["Todos", ...CATEGORIAS] as const).map((cat) => (
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

			{/* ── Lista de projetos ── */}
			<section className="py-24">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					{filteredProjects.length === 0 ? (
						<p className="text-center text-muted-foreground text-sm py-16">
							Nenhum projeto publicado nesta categoria ainda.
						</p>
					) : (
						<LayoutGroup>
							<motion.div
								layout
								className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
							>
								<AnimatePresence mode="popLayout">
									{filteredProjects.map((project, index) => {
										const images = [
											project.capa,
											...(project.photos
												?.filter((photo) => photo.url !== project.capa)
												.map((photo) => photo.url) ?? []),
										].filter(Boolean) as string[];
										return (
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
													{/*
													 * [CONCEITO — TODO galeria]
													 * Hoje passamos [project.capa] — um array de uma imagem só.
													 * Quando a galeria (project_photos) for implementada, substituir por:
													 *   images={[project.capa, ...project.photos].filter(Boolean)}
													 * O ImageCarousel já aceita múltiplas imagens, sem precisar mudar sua API.
													 */}
													<ImageCarousel
														title={project.nome}
														images={images}
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
														{project.cidade && (
															<span className="flex items-center gap-1.5 text-sm text-muted-foreground">
																<MapPin className="h-4 w-4 flex-shrink-0" />
																{project.cidade}
															</span>
														)}
													</div>
												</div>
											</motion.div>
										);
									})}
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
