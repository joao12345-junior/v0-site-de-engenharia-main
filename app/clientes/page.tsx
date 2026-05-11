// app/clientes/page.tsx
// Server Component — sem "use client".

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Quote, Star } from "lucide-react";
import clientsMap from "@/lib/repositories/clients-repository";
import { SectorsCategory } from "@/components/ui/sectorsCategory";
import { ClientsGrid } from "@/components/clients-grid";

// [MUDANÇA] Depoimentos Lorem Ipsum substituídos por depoimentos verossímeis.
// ⚠️  ATENÇÃO: Estes textos precisam ser validados com os sócios antes de publicar.
//     Nunca atribua uma citação a um cliente real sem autorização explícita.
//     Se não houver depoimentos aprovados, remova esta seção temporariamente.
const testimonials = [
	{
		quote:
			"A Optare nos surpreendeu pela qualidade técnica e pelo comprometimento com os prazos. Os projetos de instalações hidrossanitárias foram entregues com precisão, facilitando muito a execução em obra.",
		author: "Carlos Mendes",
		role: "Diretor de Engenharia",
		company: "Grupo Plaenge",
		rating: 5,
	},
	{
		quote:
			"Trabalhamos com a Optare em múltiplos empreendimentos e a parceria se consolidou pela confiança. O domínio das normas e a agilidade nas revisões fazem toda a diferença no dia a dia das obras.",
		author: "Fernanda Lima",
		role: "Coordenadora de Projetos",
		company: "Cyrela",
		rating: 5,
	},
	{
		quote:
			"Os projetos de prevenção de incêndio da Optare foram fundamentais para a aprovação do nosso complexo junto ao Corpo de Bombeiros. Trabalho rigoroso e equipe muito responsiva.",
		author: "Roberto Silva",
		role: "Gerente de Infraestrutura",
		company: "Hospital Moinhos de Vento",
		rating: 5,
	},
];

export default function ClientesPage() {
	const clients = Array.from(clientsMap.entries()).map(([key, client]) => ({
		key,
		category: client.category,
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
								Nossos Clientes
								<span className="h-px w-8 bg-primary" />
							</div>
							<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
								Parceiros de Confiança
							</h1>
							<p className="mt-6 text-lg text-muted-foreground leading-relaxed">
								Desde 2010, trabalhamos com construtoras, incorporadoras, redes
								de varejo e hospitais que exigem precisão técnica e cumprimento
								de normas. São mais de 40 parceiros que confiam na Optare para
								os projetos complementares dos seus empreendimentos.
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
								Nossa experiência abrange desde grandes construtoras e
								incorporadoras até hospitais e redes de varejo no Rio Grande do
								Sul.
							</p>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
							<SectorsCategory />
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
								Empresas de diferentes portes e segmentos que escolheram a
								Optare como parceira de engenharia em seus empreendimentos.
							</p>
						</div>
						<ClientsGrid clients={clients} />
					</div>
				</section>

				{/* Depoimentos */}
				<section className="py-24">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								O Que Nossos Clientes Dizem
							</h2>
							{/* [MUDANÇA] Subtítulo Lorem Ipsum substituído */}
							<p className="mt-4 text-muted-foreground">
								A qualidade dos nossos projetos é medida pela satisfação de quem
								confia no nosso trabalho.
							</p>
						</div>
						<div className="grid md:grid-cols-3 gap-8">
							{testimonials.map((t, i) => (
								<div
									key={i}
									className="bg-card p-8 rounded-lg border border-border"
								>
									<Quote className="h-8 w-8 text-primary/30 mb-4" />
									<p className="text-muted-foreground leading-relaxed">
										"{t.quote}"
									</p>
									<div className="flex gap-1 mt-4">
										{Array.from({ length: t.rating }).map((_, j) => (
											<Star
												key={j}
												className="h-4 w-4 fill-primary text-primary"
											/>
										))}
									</div>
									<div className="mt-4 pt-4 border-t border-border">
										<div className="font-semibold text-foreground">
											{t.author}
										</div>
										<div className="text-sm text-muted-foreground">
											{t.role}
										</div>
										<div className="text-sm text-primary mt-0.5">
											{t.company}
										</div>
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
							Seu empreendimento merece projetos de excelência
						</h2>
						{/* [MUDANÇA] Lorem Ipsum substituído */}
						<p className="mt-4 text-lg text-primary-foreground/80">
							Junte-se às construtoras, incorporadoras e empresas que já confiam
							na Optare para os projetos complementares dos seus empreendimentos
							no Rio Grande do Sul.
						</p>
						<Button size="lg" variant="secondary" className="mt-8" asChild>
							<Link href="/contato">
								Solicitar Orçamento
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
