"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { useState, useMemo } from "react";
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
		description: "",
	},
	{
		title: "Rodin",
		category: categories.Residencial,
		location: "",
		description: "",
	},
	{
		title: "BIG Torres",
		category: categories.Comercial,
		location: "",
		description: "",
	},
	{
		title: "Botanique Residences",
		category: categories.Residencial,
		location: "",
		description: "",
	},
	{
		title: "Petz Taguatinga",
		category: categories.Comercial,
		location: "",
		description: "",
	},
	{
		title: "MedPlex Eixo Norte",
		category: categories.Saúde,
		location: "",
		description: "",
	},
	{
		title: "Complexo Hospitalar Moinhos de Vento",
		category: categories.Saúde,
		location: "",
		description: "",
	},
	{
		title: "Barra Shopping Sul",
		category: categories.Comercial,
		location: "",
		description: "",
	},
	{
		title: "Atlântida Lagos Park",
		category: categories.Residencial,
		location: "",
		description: "",
	},
	{
		title: "Anita Residences",
		category: categories.Residencial,
		location: "",
		description: "",
	},
	{
		title: "Magno Três Figueiras",
		category: categories.Residencial,
		location: "",
		description: "",
	},
	{
		title: "Hola Sunset Lofts",
		category: categories.Residencial,
		location: "",
		description: "",
	},
	{
		title: "Studio CB",
		category: categories.Residencial,
		location: "",
		description: "",
	},
	{
		title: "Verdan",
		category: categories.Residencial,
		location: "",
		description: "",
	},
	{
		title: "Master Hotel Holiday Inn",
		category: categories.Residencial,
		location: "",
		description: "",
	},
];

//Define as categorias únicas dos projetos para os filtros
function setCategory(projects: typeof json_projects): Set<string> {
	const SetCategory = new Set<string>();
	SetCategory.add(categories.Main);
	for (const project of projects) {
		if (project.category) {
			SetCategory.add(project.category);
		}
	}
	return SetCategory;
}

export default function ProjetosPage() {
	const [activeCategory, setActiveCategory] = useState("Todos");
	const filteredProjects =
		activeCategory === "Todos"
			? json_projects.map((project) => ({
					...project,
					location: findLocationByTitle(project.title),
				}))
			: json_projects
					.filter((p) => p.category === activeCategory)
					.map((project) => ({
						...project,
						location: findLocationByTitle(project.title),
					}));
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
								Nossos Projetos
								<span className="h-px w-8 bg-primary" />
							</div>
							<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
								Projetos que Transformam
							</h1>
							<p className="mt-6 text-lg text-muted-foreground leading-relaxed">
								Desde edifícios icônicos até infraestruturas essenciais, nossos
								projetos refletem nosso compromisso com a excelência e a
								inovação. Explore nossa coleção de projetos e veja como estamos
								moldando o futuro da construção.
							</p>
						</div>

						{/* Stats */}
						<div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-12">
							{[
								{ value: "500+", label: "Projetos Concluídos" },
								{ value: "20+", label: "Cidades Atendidas" },
								{ value: "100%", label: "Entrega no Prazo" },
							].map((stat) => (
								<div key={stat.label} className="text-center">
									<p className="text-3xl font-bold text-primary sm:text-4xl">
										{stat.value}
									</p>
									<p className="mt-2 text-sm text-muted-foreground">
										{stat.label}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Filtros */}
				<section className="py-8 border-b border-border">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="flex flex-wrap gap-2 justify-center">
							{Array.from(setCategory(json_projects)).map((category) => (
								<button
									key={category}
									onClick={() => setActiveCategory(category)}
									className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
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
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
							{filteredProjects.map((project) => (
								<div
									key={project.title}
									className="group bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors"
									id={project.title}
								>
									<div className="relative">
										<ImageCarousel
											title={project.title}
											images={findImagesByTitle(project.title)}
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
												{project.location}
											</span>
										</div>
										<p className="mt-4 text-sm text-muted-foreground leading-relaxed">
											{project.description}
										</p>
									</div>
								</div>
							))}
						</div>
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
								sua visão em realidade. Nossa equipe de especialistas está
								pronta para ajudar a criar soluções de engenharia inovadoras e
								eficientes para o seu próximo projeto.
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
