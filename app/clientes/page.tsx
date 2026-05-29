// app/clientes/page.tsx
// Server Component — sem "use client".

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SectorsCategory } from "@/components/ui/sectorsCategory";
import { ClientsGridClient } from "@/components/clients-grid-client";
import { buildLogoMap } from "@/lib/utils/logo-resolver";
import clientsData from "@/public/JSON/clientes/clients.json";
import {
	HeroAnimated,
	SectionHeadingAnimated,
	TestimonialsAnimated,
	CTAAnimated,
} from "@/components/clientes-animated-sections";

interface ClientEntry {
	CLIENTE: string;
	Site: string;
	categoria: string;
}

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
	// [DECISÃO] Dados resolvidos aqui, no servidor garantido.
	// buildLogoMap usa fs — só pode rodar neste contexto.
	// O resultado (JSON serializável) é passado como prop para o cliente.
	const clients = clientsData as ClientEntry[];
	const logoMap = buildLogoMap(clients.map((c) => c.CLIENTE));

	return (
		<>
			<main className="pt-20">
				<section className="py-24 bg-card">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<HeroAnimated />
					</div>
				</section>

				<section className="py-24">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<SectionHeadingAnimated
							title="Setores que Atendemos"
							subtitle="Nossa experiência abrange desde grandes construtoras e incorporadoras até hospitais e redes de varejo no Rio Grande do Sul."
						/>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
							<SectorsCategory />
						</div>
					</div>
				</section>

				<section className="py-24 bg-card">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<SectionHeadingAnimated
							title="Empresas que Confiam em Nós"
							subtitle="Empresas de diferentes portes e segmentos que escolheram a Optare como parceira de engenharia em seus empreendimentos."
						/>
						{/*
              [DECISÃO] ClientsGridClient recebe dados já resolvidos.
              Sem imports de fs aqui — apenas JSON serializável.
              A fronteira servidor/cliente fica limpa.
            */}
						<ClientsGridClient clients={clients} logoMap={logoMap} />
					</div>
				</section>

				<section className="py-24">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<SectionHeadingAnimated
							title="O Que Nossos Clientes Dizem"
							subtitle="A qualidade dos nossos projetos é medida pela satisfação de quem confia no nosso trabalho."
						/>
						<TestimonialsAnimated testimonials={testimonials} />
					</div>
				</section>

				<section className="py-24 bg-primary">
					<div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
						<CTAAnimated />
					</div>
				</section>
			</main>
		</>
	);
}
