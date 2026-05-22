// app/sobre/page.tsx
//
// [MUDANÇA] Seção "Missão, Visão e Valores" reestruturada:
//
// ANTES: grid de 3 cards iguais (md:grid-cols-2, com Valores sozinho na 2ª linha)
//
// DEPOIS:
//   Linha 1 → 2 colunas: Missão | Visão
//   Linha 2 → 1 coluna: card "Valores" que internamente lista 3 sub-itens
//             (Confiabilidade, Alinhamento com o Cliente, Excelência)
//
// [CONCEITO] Por que separar em dois níveis em vez de três cards iguais?
// Missão e Visão são declarações únicas — um parágrafo cada.
// Valores são uma COLEÇÃO — faz mais sentido como container com itens.
// Tratar todos igualmente achatou a hierarquia de informação.
// A nova estrutura comunica: "esses dois são irmãos, e esse terceiro é diferente".

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
	CheckCircle2,
	Users,
	Target,
	Award,
	Clock,
	Shield,
	Handshake,
	Star,
} from "lucide-react";
import Image from "next/image";

// ─── Dados estáticos ───────────────────────────────────────────────────────

const pillars = [
	{
		icon: Target,
		title: "Missão",
		description:
			"Realizar projetos e consultorias em engenharia de instalações para quem busca confiabilidade, segurança e eficiência em suas obras.",
	},
	{
		icon: Award,
		title: "Visão",
		description:
			"Ser referência em projetos complementares de engenharia no Rio Grande do Sul, reconhecidos pela qualidade e confiabilidade.",
	},
];

// [MUDANÇA] Valores deixaram de ser um único parágrafo genérico.
// Agora são 3 sub-itens com título + descrição próprios.
// Isso aumenta escaneabilidade e credibilidade — o leitor entende
// o que cada valor significa na prática.
const values = [
	{
		icon: Shield,
		title: "Confiabilidade",
		description:
			"Entregamos projetos tecnicamente precisos, dentro do prazo e em conformidade com as normas vigentes. Nossos clientes sabem que podem contar conosco em cada etapa da obra.",
	},
	{
		icon: Handshake,
		title: "Alinhamento com o Cliente",
		description:
			"Trabalhamos de forma colaborativa, adaptando processos e comunicação ao padrão de cada parceiro — seja uma construtora de grande porte ou um escritório de arquitetura.",
	},
	{
		icon: Star,
		title: "Excelência",
		description:
			"Buscamos continuamente a melhoria técnica, a atualização das equipes e a adoção de tecnologias como BIM para garantir a melhor qualidade nos projetos que elaboramos.",
	},
];

const timeline = [
	{
		year: "2010",
		title: "Fundação",
		description:
			"Criação da Optare pelos engenheiros Marcelo Berny e Márcio Trolli.",
	},
	{
		year: "2013",
		title: "Expansão",
		description: "Ampliação da carteira de clientes e novos serviços.",
	},
	{
		year: "2016",
		title: "Consolidação",
		description: "Reconhecimento como referência em projetos complementares.",
	},
	{
		year: "2020",
		title: "10 Anos",
		description: "Uma década de excelência em projetos de engenharia.",
	},
	{
		year: "2024",
		title: "Inovação",
		description: "Modernização dos processos e novas tecnologias.",
	},
];

const team = [
	{ name: "Marcelo Berny", role: "Sócio Fundador", initials: "MB" },
	{ name: "Márcio Trolli", role: "Sócio Fundador", initials: "MT" },
];

export default function SobrePage() {
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
								Sobre Nós
								<span className="h-px w-8 bg-primary" />
							</div>
							<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
								Uma Nova Opção em Projetos Complementares
							</h1>
							<p className="mt-6 text-lg text-muted-foreground leading-relaxed">
								A Optare é uma empresa especializada na elaboração de projetos
								de engenharia para o setor da construção civil, trabalhando em
								parceria com as maiores construtoras do Rio Grande do Sul.
							</p>
						</div>
					</div>
				</section>

				{/* História */}
				<section className="py-24">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="grid lg:grid-cols-2 gap-12 items-center">
							<div>
								<div className="flex items-center gap-2 text-sm text-primary mb-4">
									<span className="h-px w-8 bg-primary" />
									Nossa História
								</div>
								<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
									Desde 2010 no Mercado
								</h2>
								<p className="mt-6 text-muted-foreground leading-relaxed">
									A Optare foi fundada em 2010 pelos experientes engenheiros
									civis Marcelo Berny e Márcio Trolli. Desde então, crescemos e
									nos consolidamos como um dos principais agentes do mercado de
									projetos complementares.
								</p>
								<p className="mt-4 text-muted-foreground leading-relaxed">
									Trabalhamos em parceria com algumas das maiores construtoras,
									redes de varejo, hospitais, e condomínios que atuam no Rio
									Grande do Sul, trazendo sempre uma nova opção em projetos
									complementares.
								</p>
								<ul className="mt-8 space-y-3">
									{[
										"Projetos Hidrossanitários",
										"Prevenção e Combate à Incêndios",
										"Projetos Elétricos, Telefonia e SPDA",
										"Projetos de Gás",
									].map((item) => (
										<li
											key={item}
											className="flex items-center gap-3 text-foreground"
										>
											<CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
											{item}
										</li>
									))}
								</ul>
							</div>
							<div className="relative">
								<div className="relative aspect-square rounded-lg bg-muted">
									<Image
										src="/images/optare_logo.png"
										alt="OPTARE Logo"
										fill
										className="object-contain p-1"
									/>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* ─── Missão, Visão e Valores ──────────────────────────────────────────
				 *
				 * [CONCEITO] Hierarquia visual intencional:
				 *
				 * Missão e Visão são declarações curtas e independentes entre si —
				 * grid de 2 colunas funciona bem para elas.
				 *
				 * Valores é uma categoria que CONTÉM múltiplos itens — precisa de
				 * um container próprio com estrutura interna.
				 *
				 * Usar o mesmo card para os três seria como colocar um parágrafo e
				 * uma lista numerada no mesmo formato visual. A forma deve seguir
				 * o conteúdo.
				 * ──────────────────────────────────────────────────────────────────── */}
				<section className="py-24 bg-card">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mx-auto max-w-2xl text-center mb-16">
							<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								Nossos Pilares
							</h2>
							<p className="mt-4 text-muted-foreground">
								Os valores que guiam nossa atuação no mercado.
							</p>
						</div>

						{/* Linha 1: Missão + Visão — 2 colunas */}
						<div className="grid md:grid-cols-2 gap-8 mb-8">
							{pillars.map((pillar) => (
								<div
									key={pillar.title}
									className="bg-background p-8 rounded-lg border border-border text-center"
								>
									<div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-4 mb-6">
										<pillar.icon className="h-8 w-8 text-primary" />
									</div>
									<h3 className="text-xl font-semibold text-foreground">
										{pillar.title}
									</h3>
									<p className="mt-4 text-muted-foreground leading-relaxed">
										{pillar.description}
									</p>
								</div>
							))}
						</div>

						{/* Linha 2: Valores — 1 coluna larga, sub-itens em grid interno
						 *
						 * [CONCEITO] Por que um card externo com grid interno?
						 * O card externo sinaliza visualmente que "Valores" é do mesmo
						 * nível hierárquico que Missão e Visão.
						 * O grid interno permite exibir os 3 valores lado a lado sem
						 * criar 3 cards independentes que pareceriam itens de nível 1.
						 * É uma hierarquia de dois níveis num único elemento visual.
						 */}
						<div className="bg-background rounded-lg border border-border p-8">
							<div className="text-center mb-8">
								<div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-4 mb-6">
									<Users className="h-8 w-8 text-primary" />
								</div>
								<h3 className="text-xl font-semibold text-foreground">
									Valores
								</h3>
								<p className="mt-2 text-muted-foreground text-sm">
									Os princípios que orientam cada decisão e cada projeto.
								</p>
							</div>

							{/* Sub-itens dos Valores
							 *
							 * [CONCEITO] Regra tipográfica: texto corrido sempre à esquerda.
							 *
							 * text-center funciona para elementos curtos: ícones, títulos de
							 * uma linha, números de estatísticas. Para parágrafos com 2+ linhas,
							 * centralizar força o olho a procurar o início de cada linha em
							 * posição diferente — cansativo e difícil de ler.
							 *
							 * Solução: ícone e título ficam centralizados com classes próprias.
							 * O parágrafo usa text-left explicitamente.
							 */}
							<div className="grid md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-border">
								{values.map((value) => (
									<div key={value.title}>
										{/* Ícone centralizado — elemento pontual, funciona bem no centro */}
										<div className="flex justify-center mb-4">
											<div className="inline-flex items-center justify-center rounded-full bg-primary/5 p-3">
												<value.icon className="h-5 w-5 text-primary" />
											</div>
										</div>
										{/* Título centralizado — texto curto, uma linha */}
										<h4 className="text-base font-semibold text-foreground mb-2 text-center">
											{value.title}
										</h4>
										{/* Descrição à esquerda — texto corrido de múltiplas linhas */}
										<p className="text-sm text-muted-foreground leading-relaxed text-left">
											{value.description}
										</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Timeline */}
				<section className="py-24">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mx-auto max-w-2xl text-center mb-16">
							<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								Nossa Trajetória
							</h2>
							<p className="mt-4 text-muted-foreground">
								Marcos importantes da nossa história.
							</p>
						</div>

						{/* Layout Mobile */}
						<div className="relative md:hidden">
							<div className="absolute left-3 top-2 bottom-2 w-px bg-border" />
							<div className="space-y-8">
								{timeline.map((item) => (
									<div
										key={item.year}
										className="relative flex items-start gap-6 pl-10"
									>
										<div className="absolute left-[7px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary flex-shrink-0 ring-2 ring-background" />
										<div className="bg-card p-5 rounded-lg border border-border w-full">
											<div className="flex items-center gap-2 mb-2">
												<Clock className="h-4 w-4 text-primary flex-shrink-0" />
												<span className="text-sm font-bold text-primary">
													{item.year}
												</span>
											</div>
											<h3 className="text-base font-semibold text-foreground">
												{item.title}
											</h3>
											<p className="mt-1 text-sm text-muted-foreground leading-relaxed">
												{item.description}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Layout Desktop */}
						<div className="relative hidden md:block">
							<div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-px" />
							<div className="space-y-12">
								{timeline.map((item, index) => (
									<div
										key={item.year}
										className={`flex items-center gap-8 ${
											index % 2 === 0 ? "flex-row" : "flex-row-reverse"
										}`}
									>
										<div
											className={`flex-1 ${index % 2 === 0 ? "text-right" : "text-left"}`}
										>
											<div className="bg-card p-6 rounded-lg border border-border inline-block max-w-sm">
												<div
													className={`flex items-center gap-3 mb-2 ${
														index % 2 === 0
															? "justify-end flex-row-reverse"
															: "justify-start"
													}`}
												>
													<Clock className="h-4 w-4 text-primary flex-shrink-0" />
													<span className="text-sm font-bold text-primary">
														{item.year}
													</span>
												</div>
												<h3 className="text-base font-semibold text-foreground">
													{item.title}
												</h3>
												<p className="mt-1 text-sm text-muted-foreground">
													{item.description}
												</p>
											</div>
										</div>
										<div className="relative z-10 w-4 h-4 rounded-full bg-primary ring-4 ring-background flex-shrink-0" />
										<div className="flex-1" />
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Equipe */}
				<section className="py-24 bg-card">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mx-auto max-w-2xl text-center mb-16">
							<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								Nossa Equipe
							</h2>
						</div>
						<div className="flex justify-center gap-8 flex-wrap">
							{team.map((member) => (
								<div
									key={member.name}
									className="bg-background p-8 rounded-lg border border-border text-center w-64"
								>
									<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
										<span className="text-xl font-bold text-primary">
											{member.initials}
										</span>
									</div>
									<h3 className="text-lg font-semibold text-foreground">
										{member.name}
									</h3>
									<p className="text-sm text-muted-foreground mt-1">
										{member.role}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
