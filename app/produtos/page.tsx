// app/produtos/page.tsx
//
// [MUDANÇA] Adicionada faixa vermelha de credenciais após o Hero.
//
// [CONCEITO] Por que a faixa fica ANTES da lista de serviços e não depois?
// É uma técnica de copywriting chamada "credibility first":
// antes de mostrar o que você faz, você mostra POR QUE pode ser confiado.
// O leitor chega à lista de serviços já com a âncora de confiança estabelecida.

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CheckCircle2, ArrowRight, Shield, Cpu, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import servicesData1 from "@/public/JSON/produtos/products1.json";
import servicesData2 from "@/public/JSON/produtos/products2.json";

// ─── Tipos ────────────────────────────────────────────────────────────────

interface ServicoGrupo1 {
	[key: string]: string[];
}

interface ServicoGrupo2 {
	titulo: string;
	categorias: Record<string, string[]>;
}

// ─── Mapa de labels legíveis para as chaves do JSON ───────────────────────
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

// ─── Dados de credenciais para a faixa ───────────────────────────────────
//
// [CONCEITO] Dados estáticos de UI como constante fora do componente.
// Isso evita que o array seja recriado a cada render — sem custo em React.
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

// ─── Componente: ServicoCard ──────────────────────────────────────────────

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
//
// [CONCEITO] Componente extraído em vez de inline no JSX principal.
// Regra prática: se um bloco de JSX tem mais de ~15 linhas e uma
// responsabilidade clara, vale extrair. Facilita leitura e futura manutenção.
//
// [DECISÃO DE DESIGN] A faixa usa bg-primary (vermelho da marca) com texto
// branco — mesmo padrão visual da StatsSection na Home. Isso cria consistência
// visual entre as páginas sem precisar de um novo design system.

function CredentialsBanner() {
	return (
		<section className="py-12 bg-primary">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				{/* Grid de credenciais: empilhado no mobile, 3 colunas no desktop */}
				<div className="grid md:grid-cols-3 gap-8 md:gap-12">
					{credentials.map((credential) => {
						// [CONCEITO] Mesmo padrão de ícone que a página de Clientes:
						// renomear para maiúscula antes de usar como componente JSX.
						const Icon = credential.icon;
						return (
							<div
								key={credential.text}
								className="flex items-start gap-4 text-primary-foreground"
							>
								<div className="flex-shrink-0 mt-0.5">
									<Icon className="h-6 w-6 opacity-90" />
								</div>
								<p className="text-sm leading-relaxed opacity-90">
									{credential.text}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

// ─── Página principal ─────────────────────────────────────────────────────

const servicos = servicesData2 as unknown as ServicoGrupo2[]; // Type assertion para o formato esperado

export default function ProdutosPage() {
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
						</div>
					</div>
				</section>

				{/* Faixa de credenciais — credibility first */}
				<CredentialsBanner />

				{/* Lista de serviços */}
				<section className="py-24">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="space-y-8">
							{servicos.map((servico) => (
								<ServicoCard key={servico.titulo} servico={servico} />
							))}
						</div>
					</div>
				</section>

				{/* CTA */}
				<section className="py-24 bg-primary">
					<div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
						<h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
							Seu projeto precisa de engenharia complementar?
						</h2>
						<p className="mt-4 text-lg text-primary-foreground/80">
							Cada empreendimento tem suas particularidades. Nossa equipe está
							disponível para analisar suas necessidades e apresentar a solução
							mais adequada para o seu projeto.
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
