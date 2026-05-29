"use client";

// app/produtos/page.tsx
//
// [MUDANÇA] Adicionada faixa vermelha de credenciais após o Hero.
// [MUDANÇA] Animações de entrada com Framer Motion adicionadas.

import { CheckCircle2, ArrowRight, Shield, Cpu, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import servicesData2 from "@/public/JSON/produtos/products2.json";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
	fadeUpVariants,
	staggerContainerVariants,
	staggerContainerDelayedVariants,
	defaultViewport,
	shortSectionViewport,
} from "@/lib/animation-variants";

// ─── Tipos ────────────────────────────────────────────────────────────────

interface ServicoGrupo2 {
	titulo: string;
	categorias: Record<string, string[]>;
}

// ─── Variant local: itens do CredentialsBanner ────────────────────────────
//
// [DECISÃO] y: 16 em vez de y: 24 — fundo vermelho é visualmente denso,
// deslocamento menor evita competição com o peso visual do fundo.
// Variant aqui, não no arquivo central: contexto visual único.
const credentialItemVariants: Variants = {
	hidden: { opacity: 0, y: 16 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.45, ease: "easeOut" },
	},
};

// ─── Mapa de labels ───────────────────────────────────────────────────────
const LABELS_SUBCATEGORIA: Record<string, string> = {
	hidrossanitarios: "Hidrossanitários",
	eletricos: "Elétricos",
	gas: "Gás",
	seguranca_contra_incendio: "Segurança contra Incêndio",
	personalizacao_comercial_residencial: "Personalização Comercial/Residencial",
	aprovacoes_regularizacoes: "Aprovações e Regularizações",
	vistorias_atendimentos: "Vistorias e Atendimentos",
	sustentabilidade_reuso: "Sustentabilidade e Reúso",
	extensao_redes_publicas: "Extensão de Redes Públicas",
	automacao_protecao: "Automação e Proteção (SPDA)",
	estudos_tecnicos: "Estudos Técnicos",
	modelagem_bim_cad: "Modelagem BIM/CAD",
	analises_criticas: "Análises Críticas",
	laudos_levantamentos: "Laudos e Levantamentos",
	hidraulica: "Infraestrutura Hidráulica",
	eletrica: "Infraestrutura Elétrica",
};

// ─── Dados de credenciais ─────────────────────────────────────────────────
const credentials = [
	{
		icon: Shield,
		text: "Seguro de Responsabilidade Civil Profissional da AXA Seguros: garantindo cobertura ao cliente em caso de erros.",
	},
	{
		icon: Cpu,
		text: "Autodesk Revit: licenciado, original e atualizado.",
	},
	{
		icon: Layers,
		text: "Personalização Tecnológica: capacidade de adaptação a qualquer Plano de Execução BIM.",
	},
];

// ─── Componente: ServicoCard (intocado) ───────────────────────────────────
//
// [DECISÃO] ServicoCard não recebe animação interna.
// A animação de entrada é responsabilidade de quem usa o componente —
// não do componente em si. Princípio de responsabilidade única.
// O wrapper motion.div fica no .map() da página.
function ServicoCard({ servico }: { servico: ServicoGrupo2 }) {
	const subcategorias = Object.entries(servico.categorias);

	return (
		<div className="bg-card rounded-lg border border-border overflow-hidden">
			<div className="px-6 pt-6 pb-4 border-b border-border">
				<h2 className="text-xl font-bold text-foreground">{servico.titulo}</h2>
			</div>

			<div className="p-6">
				<div className="grid sm:grid-cols-2 gap-6">
					{subcategorias.map(([chave, itens]) => (
						<div key={chave}>
							<h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
								{LABELS_SUBCATEGORIA[chave] ?? chave}
							</h3>
							<ul className="space-y-1.5">
								{itens.map((item) => (
									<li
										key={item}
										className="flex items-start gap-2 text-sm text-muted-foreground"
									>
										<CheckCircle2 className="h-4 w-4 text-primary/60 flex-shrink-0 mt-0.5" />
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>

			<div className="px-6 pb-6">
				<Button variant="outline" className="w-full" asChild>
					<Link href="/contato">
						Solicitar Orçamento
						<ArrowRight className="ml-2 h-4 w-4" />
					</Link>
				</Button>
			</div>
		</div>
	);
}

// ─── Componente: CredentialsBanner ───────────────────────────────────────
function CredentialsBanner() {
	return (
		<section className="py-12 bg-primary">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				{/*
          [DECISÃO] Apenas o grid interno anima — não a <section>.
          Animar a <section> moveria o fundo vermelho inteiro,
          criando efeito de "fundo piscando". Mesmo padrão da StatsSection.
        */}
				<motion.div
					className="grid md:grid-cols-3 gap-8 md:gap-12"
					variants={staggerContainerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={defaultViewport}
				>
					{credentials.map((credential) => {
						const Icon = credential.icon;
						return (
							<motion.div
								key={credential.text}
								variants={credentialItemVariants}
								className="flex items-start gap-4 text-primary-foreground"
							>
								<div className="flex-shrink-0 mt-0.5">
									<Icon className="h-6 w-6 opacity-90" />
								</div>
								<p className="text-sm leading-relaxed opacity-90">
									{credential.text}
								</p>
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
}

// ─── Página principal ─────────────────────────────────────────────────────

const servicos = servicesData2 as unknown as ServicoGrupo2[];

export default function ProdutosPage() {
	return (
		<>
			<main className="pt-20">
				{/* ── Hero ── */}
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
								Nossos Serviços
								<span className="h-px w-8 bg-primary" />
							</div>
							<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
								Projetos Complementares de Engenharia
							</h1>
							<p className="mt-6 text-lg text-muted-foreground leading-relaxed">
								A Optare desenvolve projetos de engenharia complementares com
								precisão técnica e compromisso com as normas vigentes. Cada
								solução é elaborada por engenheiros especializados, garantindo
								compatibilidade entre sistemas e segurança em todas as etapas da
								obra.
							</p>
						</motion.div>
					</div>
				</section>

				{/* ── Faixa de credenciais ── */}
				<CredentialsBanner />

				{/* ── Lista de serviços ── */}
				<section className="py-24">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="space-y-8">
							{servicos.map((servico) => (
								/*
                  [DECISÃO] Wrapper motion.div por fora do ServicoCard.
                  whileInView individual — não stagger no container.
                  Motivo: cards são grandes, apenas 1-2 visíveis por vez.
                  Stagger num container dispararia animações de cards
                  que o usuário ainda não viu.
                */
								<motion.div
									key={servico.titulo}
									variants={fadeUpVariants}
									initial="hidden"
									whileInView="visible"
									viewport={defaultViewport}
								>
									<ServicoCard servico={servico} />
								</motion.div>
							))}
						</div>
					</div>
				</section>

				{/* ── CTA ── */}
				{/*
          [DECISÃO] <section> não anima — fundo vermelho.
          Apenas o conteúdo interno recebe stagger.
          Mesmo padrão do CredentialsBanner e StatsSection.
        */}
				<section className="py-24 bg-primary">
					<div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
						<motion.div
							variants={staggerContainerDelayedVariants}
							initial="hidden"
							whileInView="visible"
							viewport={shortSectionViewport}
						>
							<motion.h2
								variants={fadeUpVariants}
								className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl"
							>
								Seu projeto precisa de engenharia complementar?
							</motion.h2>
							<motion.p
								variants={fadeUpVariants}
								className="mt-4 text-lg text-primary-foreground/80"
							>
								Cada empreendimento tem suas particularidades. Nossa equipe está
								disponível para analisar suas necessidades e apresentar a
								solução mais adequada para o seu projeto.
							</motion.p>
							<motion.div variants={fadeUpVariants} className="mt-8">
								<Button size="lg" variant="secondary" asChild>
									<Link href="/contato">
										Solicitar Orçamento
										<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</motion.div>
						</motion.div>
					</div>
				</section>
			</main>
		</>
	);
}
