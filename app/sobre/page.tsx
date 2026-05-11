// app/sobre/page.tsx
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CheckCircle2, Users, Target, Award, Clock } from "lucide-react";
import Image from "next/image";

const values = [
	{
		icon: Target,
		title: "Missão",
		description:
			"Desenvolver projetos de engenharia com excelência técnica, contribuindo para a qualidade e segurança das edificações de nossos clientes.",
	},
	{
		icon: Award,
		title: "Visão",
		description:
			"Ser referência em projetos complementares de engenharia no Rio Grande do Sul, reconhecidos pela qualidade e confiabilidade.",
	},
	{
		icon: Users,
		title: "Valores",
		description:
			"Compromisso com a qualidade, ética profissional, parceria com clientes e inovação constante em nossas soluções.",
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

				{/* Missão, Visão, Valores */}
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
						<div className="grid md:grid-cols-3 gap-8">
							{values.map((value) => (
								<div
									key={value.title}
									className="bg-background p-8 rounded-lg border border-border text-center"
								>
									<div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-4 mb-6">
										<value.icon className="h-8 w-8 text-primary" />
									</div>
									<h3 className="text-xl font-semibold text-foreground">
										{value.title}
									</h3>
									<p className="mt-4 text-muted-foreground leading-relaxed">
										{value.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* ─── Timeline ──────────────────────────────────────────────────────────
				 *
				 * [CONCEITO] Duas estruturas separadas em vez de uma adaptada com CSS.
				 *
				 * A tentação inicial é usar `flex-col md:flex-row` numa estrutura só.
				 * Isso funciona quando a diferença é apenas de direção ou tamanho.
				 *
				 * Mas mobile e desktop precisam de hierarquias visuais diferentes:
				 * - Mobile: linha à esquerda, itens empilhados verticalmente
				 * - Desktop: linha no centro, itens alternando esquerda/direita
				 *
				 * Forçar ambos no mesmo HTML cria: pontos soltos sem linha conectora,
				 * divs vazias com espaçamento sem sentido, e CSS cada vez mais complexo.
				 *
				 * A solução honesta: dois componentes, cada um otimizado para seu contexto.
				 * `md:hidden` esconde o mobile no desktop. `hidden md:block` faz o oposto.
				 * ──────────────────────────────────────────────────────────────────── */}
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

						{/* ── Layout Mobile (visível só abaixo de md) ───────────────────────
						 * Linha vertical à esquerda + ponto + conteúdo à direita.
						 * Cada item tem padding-left suficiente para não colidir com a linha.
						 *
						 * Estrutura visual:
						 *   │ ●  2010  Fundação
						 *   │          Descrição...
						 *   │
						 *   │ ●  2013  Expansão
						 * ──────────────────────────────────────────────────────────────── */}
						<div className="relative md:hidden">
							{/* Linha vertical à esquerda */}
							<div className="absolute left-3 top-2 bottom-2 w-px bg-border" />

							<div className="space-y-8">
								{timeline.map((item) => (
									<div
										key={item.year}
										className="relative flex items-start gap-6 pl-10"
									>
										{/* Ponto — posicionado sobre a linha.
										    `left-[7px]` centraliza o ponto de 6px sobre a linha de 1px
										    que está em `left-3` (12px). (12 - 3) = 9px. */}
										<div className="absolute left-[7px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary flex-shrink-0 ring-2 ring-background" />

										{/* Card de conteúdo */}
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

						{/* ── Layout Desktop (visível só em md e acima) ─────────────────────
						 * Linha vertical no centro + itens alternando esquerda/direita.
						 * Índice par → card à esquerda, espaço à direita.
						 * Índice ímpar → espaço à esquerda, card à direita.
						 * ──────────────────────────────────────────────────────────────── */}
						<div className="relative hidden md:block">
							{/* Linha vertical centralizada */}
							<div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-px" />

							<div className="space-y-12">
								{timeline.map((item, index) => (
									<div
										key={item.year}
										className={`flex items-center gap-8 ${
											index % 2 === 0 ? "flex-row" : "flex-row-reverse"
										}`}
									>
										{/* Card */}
										<div
											className={`flex-1 ${index % 2 === 0 ? "text-right" : "text-left"}`}
										>
											<div className="bg-card p-6 rounded-lg border border-border inline-block max-w-sm">
												<div
													className={`flex items-center gap-3 mb-2 ${
														index % 2 === 0 ? "justify-end" : "justify-start"
													}`}
												>
													<Clock className="h-5 w-5 text-primary" />
													<span className="text-sm font-medium text-primary">
														{item.year}
													</span>
												</div>
												<h3 className="text-lg font-semibold text-foreground">
													{item.title}
												</h3>
												<p className="mt-2 text-muted-foreground text-sm leading-relaxed">
													{item.description}
												</p>
											</div>
										</div>

										{/* Ponto central */}
										<div className="relative z-10 w-4 h-4 rounded-full bg-primary flex-shrink-0 ring-2 ring-background" />

										{/* Espaço vazio no lado oposto */}
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
								Fundadores
							</h2>
							<p className="mt-4 text-muted-foreground">
								Engenheiros civis com vasta experiência no mercado.
							</p>
						</div>
						<div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
							{team.map((member) => (
								<div
									key={member.name}
									className="bg-background p-8 rounded-lg border border-border text-center"
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
