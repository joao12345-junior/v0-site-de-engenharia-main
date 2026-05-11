import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Quote, Star } from "lucide-react";
import clientsMap from "@/lib/repositories/clients-repository";
import { SectorsCategory } from "@/components/ui/sectorsCategory";
import { toTitleCase } from "@/lib/utils";

const testimonials = [
	{
		quote:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
		author: "Carlos Mendes",
		role: "Diretor de Operações",
		company: "Empresa Alpha",
		rating: 5,
	},
	{
		quote:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
		author: "Fernanda Lima",
		role: "Gerente de Projetos",
		company: "Construtora Beta",
		rating: 5,
	},
	{
		quote:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
		author: "Roberto Silva",
		role: "Superintendente",
		company: "Hospital Gamma",
		rating: 5,
	},
];

export default function ClientesPage() {
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
								Nossos Clientes
								<span className="h-px w-8 bg-primary" />
							</div>
							<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
								Parceiros de Confiança
							</h1>
							<p className="mt-6 text-lg text-muted-foreground leading-relaxed">
								Temos orgulho de trabalhar com uma variedade de clientes, desde
								grandes corporações até pequenas empresas, em diversos setores.
								Nossa dedicação à excelência e à inovação nos permite oferecer
								soluções personalizadas que atendem às necessidades específicas
								de cada cliente.
							</p>
						</div>
					</div>
				</section>

				{/* Setores */}
				<section className="py-24">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								Setores que Atendemos
							</h2>
							<p className="mt-4 text-muted-foreground">
								Atualmente, atendemos clientes de diversos setores, com destaque
								para construção, saúde e varejo.
							</p>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-20">
							<SectorsCategory></SectorsCategory>
						</div>
					</div>
				</section>

				{/* Grid de Clientes */}
				<section className="py-24 bg-card">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								Empresas que Confiam em Nós
							</h2>
							<p className="mt-4 text-muted-foreground">
								Essas são algumas das empresas que já confiaram em nossos
								serviços e se beneficiaram de nossas soluções em engenharia.
							</p>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{Array.from(clientsMap.entries()).map(([key, client]) => {
								console.log(key);
								return (
									<div
										key={key}
										className="bg-background p-6 rounded-lg border border-border flex flex-col items-center text-center hover:border-primary/50 transition-colors"
									>
										<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
											<client.icon className="h-8 w-8 text-primary/50" />
										</div>
										<h3 className="font-semibold text-foreground">
											{toTitleCase(key)}
										</h3>
										<p className="text-sm text-muted-foreground mt-1">
											{client.category}
										</p>
									</div>
								);
							})}
						</div>
					</div>
				</section>

				{/* Depoimentos */}
				<section className="py-24">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								O Que Nossos Clientes Dizem
							</h2>
							<p className="mt-4 text-muted-foreground">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
							</p>
						</div>
						<div className="grid md:grid-cols-3 gap-8">
							{testimonials.map((testimonial) => (
								<div
									key={testimonial.author}
									className="bg-card p-8 rounded-lg border border-border"
								>
									<Quote className="h-8 w-8 text-primary/30 mb-4" />
									<div className="flex gap-1 mb-4">
										{[...Array(testimonial.rating)].map((_, i) => (
											<Star
												key={i}
												className="h-4 w-4 fill-primary text-primary"
											/>
										))}
									</div>
									<p className="text-muted-foreground leading-relaxed">
										{testimonial.quote}
									</p>
									<div className="mt-6 pt-6 border-t border-border">
										<p className="font-semibold text-foreground">
											{testimonial.author}
										</p>
										<p className="text-sm text-muted-foreground">
											{testimonial.role}
										</p>
										<p className="text-sm text-primary">
											{testimonial.company}
										</p>
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
							Faça Parte da Nossa Lista de Clientes
						</h2>
						<p className="mt-4 text-lg text-primary-foreground/80">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Junte-se
							a centenas de empresas satisfeitas.
						</p>
						<Button size="lg" variant="secondary" className="mt-8" asChild>
							<Link href="/contato">
								Entrar em Contato
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
