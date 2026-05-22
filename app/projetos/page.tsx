"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { useState, useMemo } from "react";
import {
	motion,
	AnimatePresence,
	LayoutGroup,
	type Variants,
} from "framer-motion";
import { ImageCarousel } from "@/components/ui/image-carousel";
import {
	findImagesByTitle,
	findLocationByTitle,
} from "@/lib/repositories/images-repository";

const categories = {
	Main: "Todos",
	Comercial: "Comercial",
	Industrial: "Industrial",
	Residencial: "Residencial",
	Saúde: "Saúde",
	Educação: "Educação",
};

const json_projects = [
	{
		title: "RENNER Shopping Iguatemi",
		category: categories.Comercial,
		location: "",
	},
	{ title: "Rodin", category: categories.Residencial, location: "" },
	{ title: "BIG Torres", category: categories.Comercial, location: "" },
	{
		title: "Botanique Residences",
		category: categories.Residencial,
		location: "",
	},
	{ title: "Petz Taguatinga", category: categories.Comercial, location: "" },
	{ title: "MedPlex Eixo Norte", category: categories.Saúde, location: "" },
	{
		title: "Complexo Hospitalar Moinhos de Vento",
		category: categories.Saúde,
		location: "",
	},
	{ title: "Barra Shopping Sul", category: categories.Comercial, location: "" },
	{
		title: "Atlântida Lagos Park",
		category: categories.Residencial,
		location: "",
	},
	{ title: "Anita Residences", category: categories.Residencial, location: "" },
	{
		title: "Magno Três Figueiras",
		category: categories.Residencial,
		location: "",
	},
	{
		title: "Hola Sunset Lofts",
		category: categories.Residencial,
		location: "",
	},
	{ title: "Studio CB", category: categories.Residencial, location: "" },
	{
		title: "Master Hotel Holiday Inn",
		category: categories.Residencial,
		location: "",
	},
	{
		title: "Grand Park Lindóia",
		category: categories.Residencial,
		location: "",
	},
];

function setCategory(projects: typeof json_projects): Set<string> {
	const SetCategory = new Set<string>();
	SetCategory.add(categories.Main);
	for (const project of projects) {
		if (project.category) SetCategory.add(project.category);
	}
	return SetCategory;
}

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

export default function ProjetosPage() {
	const [activeCategory, setActiveCategory] = useState("Todos");

	const filteredProjects = useMemo(() => {
		return activeCategory === "Todos"
			? json_projects
			: json_projects.filter((p) => p.category === activeCategory);
	}, [activeCategory]);

	return (
		<>
			<Header />
			<main className="pt-20">
				{/* Hero */}
				<section className="py-24 bg-card">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mx-auto max-w-3xl text-center">
							<div className="flex items-center justify-center gap-2 text-sm text-primary mb-4">
								<span className="h-px w-8 bg-primary" />
								Projetos
								<span className="h-px w-8 bg-primary" />
							</div>
							<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
								Nossos Projetos
							</h1>
						</div>
					</div>
				</section>

				{/* Filtros */}
				<section className="py-8 border-b border-border">
					<div className="mx-auto max-w-7xl lg:px-8">
						{/*
						 * Mobile: grid de 2 colunas — layout previsível e uniforme.
						 * Desktop: flex centralizado — comportamento original.
						 *
						 * `w-full` no botão: necessário para ocupar a célula inteira do grid.
						 * `md:w-auto`: reverte em desktop, tamanho baseado no conteúdo.
						 */}
						<div className="grid grid-cols-2 gap-2 px-6 md:flex md:flex-wrap md:justify-center md:px-0">
							{Array.from(setCategory(json_projects)).map((category) => (
								<button
									key={category}
									onClick={() => setActiveCategory(category)}
									className={`w-full md:w-auto px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
										activeCategory === category
											? "bg-primary text-primary-foreground scale-105"
											: "bg-muted text-muted-foreground hover:bg-muted/80"
									}`}
								>
									{category}
								</button>
							))}
						</div>
					</div>
				</section>

				{/* Lista de Projetos */}
				<section className="py-24">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<LayoutGroup>
							<motion.div
								layout
								className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
							>
								<AnimatePresence mode="popLayout">
									{filteredProjects.map((project, index) => (
										<motion.div
											key={project.title}
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
													title={project.title}
													images={findImagesByTitle(project.title)}
													// [ESTRATÉGIA DE CARREGAMENTO]
													// index 0        → priority: candidato ao LCP, preload máximo
													// index 1 a 5    → loading eager: visíveis, sem preload desnecessário
													// index 6+       → loading lazy: abaixo da dobra, carrega ao rolar
													priority={index === 0}
													loading={index > 0 && index < 6 ? "eager" : "lazy"}
												/>
												<div className="absolute top-4 left-4">
													<span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
														{project.category}
													</span>
												</div>
											</div>
											<div className="p-6">
												<h3 className="text-lg font-semibold text-foreground">
													{project.title}
												</h3>
												<div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
													<span className="flex items-center gap-1">
														<MapPin className="h-4 w-4" />
														{findLocationByTitle(project.title) ||
															"Localização desconhecida"}
													</span>
												</div>
											</div>
										</motion.div>
									))}
								</AnimatePresence>
							</motion.div>
						</LayoutGroup>
					</div>
				</section>

				{/* CTA */}
				<section className="py-24 bg-card">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="text-center max-w-2xl mx-auto">
							<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								Quer ver seu projeto aqui?
							</h2>
							<p className="mt-4 text-lg text-muted-foreground">
								Entre em contato conosco para discutir como podemos transformar
								sua visão em realidade.
							</p>
							<Button size="lg" className="mt-8" asChild>
								<Link href="/contato">
									Iniciar Projeto
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
