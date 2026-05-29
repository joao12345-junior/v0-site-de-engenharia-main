"use client";

// app/sobre/page.tsx
//
// [MUDANÇA] Seção "Missão, Visão e Valores" reestruturada:
// ...comentários originais preservados...

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
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
	fadeUpVariants,
	fadeLeftVariants,
	fadeRightVariants,
	staggerContainerVariants,
	staggerContainerDelayedVariants,
	defaultViewport,
} from "@/lib/animation-variants";

// ─── Variant local: timeline mobile ──────────────────────────────────────
//
// [DECISÃO] x: -20 reforça a leitura da esquerda para direita.
// No mobile, os cards ficam todos à direita da linha vertical —
// deslizar da esquerda reforça a relação com a linha.
const timelineItemVariants: Variants = {
	hidden: { opacity: 0, x: -20 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.45, ease: "easeOut" },
	},
};

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
			<main className="pt-20">
				{/* ── Hero ── */}
				<section className="py-24 bg-card">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						{/*
              [DECISÃO] whileInView aqui mesmo sendo próximo do topo da página.
              O hero de páginas internas (não a Home) entra depois da navegação
              — o usuário pode chegar via link direto com scroll já posicionado.
              whileInView + once: true é seguro: dispara uma vez ao entrar.
            */}
						<motion.div
							className="mx-auto max-w-3xl text-center"
							variants={fadeUpVariants}
							initial="hidden"
							whileInView="visible"
							viewport={defaultViewport}
						>
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
						</motion.div>
					</div>
				</section>

				{/* ── História ── */}
				<section className="py-24">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="grid lg:grid-cols-2 gap-12 items-center">
							{/* Coluna esquerda: texto + lista */}
							<motion.div
								variants={fadeLeftVariants}
								initial="hidden"
								whileInView="visible"
								viewport={defaultViewport}
							>
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

								{/*
                  [DECISÃO] stagger interno na lista, separado do fadeLeft
                  da coluna. A coluna inteira entra primeiro — depois os
                  itens fazem seu próprio stagger. Dois gatilhos whileInView
                  independentes, ambos com once: true.
                */}
								<motion.ul
									className="mt-8 space-y-3"
									variants={staggerContainerVariants}
									initial="hidden"
									whileInView="visible"
									viewport={defaultViewport}
								>
									{[
										"Projetos Hidrossanitários",
										"Prevenção e Combate à Incêndios",
										"Projetos Elétricos, Telefonia e SPDA",
										"Projetos de Gás",
									].map((item) => (
										<motion.li
											key={item}
											variants={fadeUpVariants}
											className="flex items-center gap-3 text-foreground"
										>
											<CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
											{item}
										</motion.li>
									))}
								</motion.ul>
							</motion.div>

							{/* Coluna direita: imagem */}
							<motion.div
								className="relative"
								variants={fadeRightVariants}
								initial="hidden"
								whileInView="visible"
								viewport={defaultViewport}
							>
								<div className="relative aspect-square rounded-lg bg-muted">
									<Image
										src="/images/optare_logo.png"
										alt="OPTARE Logo"
										fill
										className="object-contain p-1"
									/>
								</div>
							</motion.div>
						</div>
					</div>
				</section>

				{/* ── Pilares ── */}
				<section className="py-24 bg-card">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						{/* Heading */}
						<motion.div
							className="mx-auto max-w-2xl text-center mb-16"
							variants={fadeUpVariants}
							initial="hidden"
							whileInView="visible"
							viewport={defaultViewport}
						>
							<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								Nossos Pilares
							</h2>
							<p className="mt-4 text-muted-foreground">
								Os valores que guiam nossa atuação no mercado.
							</p>
						</motion.div>

						{/* Linha 1: Missão + Visão */}
						{/*
              [DECISÃO] staggerContainerDelayedVariants (delayChildren: 0.15)
              porque o heading acima já animou — os cards aguardam um momento.
            */}
						<motion.div
							className="grid md:grid-cols-2 gap-8 mb-8"
							variants={staggerContainerDelayedVariants}
							initial="hidden"
							whileInView="visible"
							viewport={defaultViewport}
						>
							{pillars.map((pillar) => (
								<motion.div
									key={pillar.title}
									variants={fadeUpVariants}
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
								</motion.div>
							))}
						</motion.div>

						{/* Linha 2: Valores */}
						{/*
              [DECISÃO] Card externo anima como bloco (fadeUpVariants).
              Grid interno dos valores tem seu próprio stagger depois que
              o card "pousou" — staggerContainerDelayedVariants com
              delayChildren: 0.15 para aguardar o card aparecer.
            */}
						<motion.div
							className="bg-background rounded-lg border border-border p-8"
							variants={fadeUpVariants}
							initial="hidden"
							whileInView="visible"
							viewport={defaultViewport}
						>
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

							<motion.div
								className="grid md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-border"
								variants={staggerContainerDelayedVariants}
								initial="hidden"
								whileInView="visible"
								viewport={defaultViewport}
							>
								{values.map((value) => (
									<motion.div key={value.title} variants={fadeUpVariants}>
										<div className="flex justify-center mb-4">
											<div className="inline-flex items-center justify-center rounded-full bg-primary/5 p-3">
												<value.icon className="h-5 w-5 text-primary" />
											</div>
										</div>
										<h4 className="text-base font-semibold text-foreground mb-2 text-center">
											{value.title}
										</h4>
										<p className="text-sm text-muted-foreground leading-relaxed text-left">
											{value.description}
										</p>
									</motion.div>
								))}
							</motion.div>
						</motion.div>
					</div>
				</section>

				{/* ── Timeline ── */}
				<section className="py-24">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						{/* Heading */}
						<motion.div
							className="mx-auto max-w-2xl text-center mb-16"
							variants={fadeUpVariants}
							initial="hidden"
							whileInView="visible"
							viewport={defaultViewport}
						>
							<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								Nossa Trajetória
							</h2>
							<p className="mt-4 text-muted-foreground">
								Marcos importantes da nossa história.
							</p>
						</motion.div>

						{/* Layout Mobile */}
						<div className="relative md:hidden">
							{/*
                [DECISÃO] Linha vertical fora do motion.div de stagger.
                Se estivesse dentro, herdaria initial="hidden" e
                desapareceria durante a animação — quebrando a estrutura visual.
                Elementos decorativos estruturais nunca devem animar.
              */}
							<div className="absolute left-3 top-2 bottom-2 w-px bg-border" />
							<motion.div
								className="space-y-8"
								variants={staggerContainerVariants}
								initial="hidden"
								whileInView="visible"
								viewport={defaultViewport}
							>
								{timeline.map((item) => (
									<motion.div
										key={item.year}
										variants={timelineItemVariants}
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
									</motion.div>
								))}
							</motion.div>
						</div>

						{/* Layout Desktop */}
						<div className="relative hidden md:block">
							{/* Linha vertical — fora do stagger pelo mesmo motivo do mobile */}
							<div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-px" />
							<motion.div
								className="space-y-12"
								variants={staggerContainerVariants}
								initial="hidden"
								whileInView="visible"
								viewport={defaultViewport}
							>
								{timeline.map((item, index) => (
									/*
                    [DECISÃO] fadeUpVariants no desktop — não timelineItemVariants.
                    No desktop os cards alternam esquerda/direita. Um slide
                    horizontal uniforme (x: -20) ficaria estranho nos cards
                    da direita. fadeUp é neutro e funciona para ambos os lados.
                    A lógica index % 2 nas classes internas: intocada.
                  */
									<motion.div
										key={item.year}
										variants={fadeUpVariants}
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
									</motion.div>
								))}
							</motion.div>
						</div>
					</div>
				</section>

				{/* ── Equipe ── */}
				<section className="py-24 bg-card">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<motion.div
							className="mx-auto max-w-2xl text-center mb-16"
							variants={fadeUpVariants}
							initial="hidden"
							whileInView="visible"
							viewport={defaultViewport}
						>
							<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								Nossa Equipe
							</h2>
						</motion.div>

						<motion.div
							className="flex justify-center gap-8 flex-wrap"
							variants={staggerContainerVariants}
							initial="hidden"
							whileInView="visible"
							viewport={defaultViewport}
						>
							{team.map((member) => (
								<motion.div
									key={member.name}
									variants={fadeUpVariants}
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
								</motion.div>
							))}
						</motion.div>
					</div>
				</section>
			</main>
		</>
	);
}
