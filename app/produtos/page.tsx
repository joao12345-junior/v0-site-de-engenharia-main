"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	ArrowRight,
	Cog,
	Zap,
	Shield,
	Gauge,
	Wrench,
	Building2,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import imagesData from "@/public/images/produtos/images.json";

const products = [
	{
		icon: Cog,
		name: "Sistema de Automação Industrial",
		category: "Automação",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		features: [
			"Lorem ipsum dolor",
			"Consectetur adipiscing",
			"Sed do eiusmod",
			"Tempor incididunt",
		],
	},
	{
		icon: Zap,
		name: "Painéis Elétricos",
		category: "Elétrica",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		features: [
			"Lorem ipsum dolor",
			"Consectetur adipiscing",
			"Sed do eiusmod",
			"Tempor incididunt",
		],
	},
	{
		icon: Shield,
		name: "Sistemas de Segurança",
		category: "Segurança",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		features: [
			"Lorem ipsum dolor",
			"Consectetur adipiscing",
			"Sed do eiusmod",
			"Tempor incididunt",
		],
	},
	{
		icon: Gauge,
		name: "Equipamentos de Medição",
		category: "Instrumentação",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		features: [
			"Lorem ipsum dolor",
			"Consectetur adipiscing",
			"Sed do eiusmod",
			"Tempor incididunt",
		],
	},
	{
		icon: Wrench,
		name: "Ferramentas Especializadas",
		category: "Ferramentas",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		features: [
			"Lorem ipsum dolor",
			"Consectetur adipiscing",
			"Sed do eiusmod",
			"Tempor incididunt",
		],
	},
	{
		icon: Building2,
		name: "Estruturas Metálicas",
		category: "Estrutural",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		features: [
			"Lorem ipsum dolor",
			"Consectetur adipiscing",
			"Sed do eiusmod",
			"Tempor incididunt",
		],
	},
];

const categories = {
	Main: "Todos",
	Automação: "Automação",
	Elétrica: "Elétrica",
	Segurança: "Segurança",
	Instrumentação: "Instrumentação",
	Ferramentas: "Ferramentas",
	Estrutural: "Estrutural",
};

//Função para buscar no JSON as localizações dos projetos baseado no título
function getLocationImage(json: any, product: any) {
	for (const client of json) {
		for (const image of client.imagens) {
			if (image.subtitulo.toLowerCase().includes(product.title.toLowerCase())) {
				product.location = image.localization || null;
				return;
			}
		}
	}
}

//Define as categorias únicas dos projetos para os filtros
function setCategory(products: any) {
	const SetCategory = new Set<string>();
	SetCategory.add(categories.Main);
	for (const product of products) {
		if (product.category) {
			SetCategory.add(product.category);
		}
	}
	return SetCategory;
}

// Função para buscar imagens baseado no título do projeto
function getProductImages(productTitle: string): string[] {
	for (const client of imagesData) {
		for (const image of client.imagens) {
			// Comparação fuzzy - verifica se o título está contido no subtítulo ou vice-versa
			if (
				image.subtitulo.toLowerCase().includes(productTitle.toLowerCase()) ||
				productTitle
					.toLowerCase()
					.includes(image.subtitulo.split(" ")[0].toLowerCase())
			) {
				return image.urls_imagens || [];
			}
		}
	}
	return [];
}

// Componente do Carrossel de Imagens
function ProductImageCarousel({ productTitle }: { productTitle: string }) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const images = useMemo(() => getProductImages(productTitle), [productTitle]);

	if (!images || images.length === 0) {
		return (
			<div className="aspect-video bg-muted flex items-center justify-center">
				<Building2 className="h-16 w-16 text-primary/30" />
			</div>
		);
	}

	const handlePrev = () => {
		setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	};

	return (
		<div className="aspect-video relative overflow-hidden bg-muted">
			<Image
				src={images[currentImageIndex]}
				alt={`${productTitle} - Imagem ${currentImageIndex + 1}`}
				fill
				className="object-cover"
				priority={currentImageIndex === 0}
			/>

			{/* Navegação do Carrossel - Visível apenas se houver múltiplas imagens */}
			{images.length > 1 && (
				<>
					<button
						onClick={handlePrev}
						className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
						aria-label="Imagem anterior"
					>
						<ChevronLeft className="h-5 w-5" />
					</button>
					<button
						onClick={handleNext}
						className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
						aria-label="Próxima imagem"
					>
						<ChevronRight className="h-5 w-5" />
					</button>

					{/* Indicador de página */}
					<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
						{images.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentImageIndex(index)}
								className={`w-2 h-2 rounded-full transition-colors ${
									index === currentImageIndex ? "bg-white" : "bg-white/50"
								}`}
								aria-label={`Ir para imagem ${index + 1}`}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
}

export default function ProdutosPage() {
	const [activeCategory, setActiveCategory] = useState("Todos");
	const filteredProducts =
		activeCategory === "Todos"
			? products
			: products.filter((p) => p.category === activeCategory);

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
								Nossos Produtos
								<span className="h-px w-8 bg-primary" />
							</div>
							<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
								Soluções em Engenharia de Alta Qualidade
							</h1>
							<p className="mt-6 text-lg text-muted-foreground leading-relaxed">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
								eiusmod tempor incididunt ut labore et dolore magna aliqua.
							</p>
						</div>
					</div>
				</section>

				{/* Filtros */}
				<section className="py-8 border-b border-border">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="flex flex-wrap gap-2 justify-center">
							{Array.from(setCategory(products)).map((category) => (
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

				{/* Lista de Produtos */}
				<section className="py-24">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
							{filteredProducts.map((product) => (
								<div
									key={product.name}
									className="group bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors"
								>
									<div className="aspect-video bg-muted flex items-center justify-center">
										<ProductImageCarousel productTitle={product.name} />
									</div>
									<div className="p-6">
										<span className="text-xs font-medium text-primary">
											{product.category}
										</span>
										<h3 className="mt-2 text-lg font-semibold text-foreground">
											{product.name}
										</h3>
										<p className="mt-2 text-sm text-muted-foreground leading-relaxed">
											{product.description}
										</p>
										<ul className="mt-4 space-y-2">
											{product.features.slice(0, 3).map((feature) => (
												<li
													key={feature}
													className="flex items-center gap-2 text-sm text-muted-foreground"
												>
													<div className="h-1.5 w-1.5 rounded-full bg-primary" />
													{feature}
												</li>
											))}
										</ul>
										<Button variant="outline" className="w-full mt-6" asChild>
											<Link href="/contato">
												Solicitar Orçamento
												<ArrowRight className="ml-2 h-4 w-4" />
											</Link>
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA */}
				<section className="py-24 bg-primary">
					<div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
						<h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
							Não encontrou o que procura?
						</h2>
						<p className="mt-4 text-lg text-primary-foreground/80">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Entre em
							contato conosco.
						</p>
						<Button size="lg" variant="secondary" className="mt-8" asChild>
							<Link href="/contato">
								Fale Conosco
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
