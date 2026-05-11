// app/produtos/page.tsx
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

// [PASSO 1] Importar do repository com named exports.
// Desestruturamos exatamente o que precisamos com {}.
// ServicoOptare é importado como tipo — só existe em tempo de compilação.
import {
	servicos,
	LABELS_SUBCATEGORIA,
	type ServicoOptare,
} from "@/lib/repositories/products-repository";

// ─── Componente auxiliar: card de um grupo de serviços ────────────────────
// [CONCEITO] Extrair um componente com responsabilidade única.
// A página não precisa saber como um card é renderizado — só que ele existe.
// Isso segue o Single Responsibility Principle: ServicoCard cuida da
// apresentação de UM serviço. A página cuida da lista de serviços.
interface ServicoCardProps {
	servico: ServicoOptare;
}

function ServicoCard({ servico }: ServicoCardProps) {
	// [PASSO 2] Object.entries() transforma o objeto de categorias em array iterável.
	// { hidrossanitarios: ["..."] } → [["hidrossanitarios", ["..."]]]
	// Sem isso, não é possível usar .map() diretamente sobre um objeto.
	const subcategorias = Object.entries(servico.categorias);

	return (
		<div className="bg-card rounded-lg border border-border overflow-hidden">
			{/* Cabeçalho do card — destaca o grupo principal */}
			<div className="bg-primary/5 border-b border-border px-6 py-5">
				<div className="flex items-center gap-3">
					<div className="h-1 w-6 bg-primary rounded-full flex-shrink-0" />
					<h2 className="text-lg font-bold text-foreground leading-tight">
						{servico.titulo}
					</h2>
				</div>
			</div>

			{/* Corpo do card — lista de subcategorias */}
			<div className="p-6">
				{/*
				 * [PASSO 3] Iterar sobre as subcategorias.
				 * `chave` é a chave snake_case do JSON (ex: "hidrossanitarios").
				 * `itens` é o array de strings (ex: ["Instalações Hidrossanitárias"]).
				 *
				 * LABELS_SUBCATEGORIA[chave] busca o label legível.
				 * O operador ?? (nullish coalescing) é o fallback:
				 * se a chave não existir no mapa, usa a própria chave como texto.
				 * Isso evita erros silenciosos se uma nova chave for adicionada ao JSON.
				 */}
				<div className="grid sm:grid-cols-2 gap-6">
					{subcategorias.map(([chave, itens]) => (
						<div key={chave}>
							{/* Label humanizado da subcategoria */}
							<h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
								{LABELS_SUBCATEGORIA[chave] ?? chave}
							</h3>

							{/* Lista de serviços dentro da subcategoria */}
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

			{/* Rodapé com CTA */}
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

// ─── Página principal ─────────────────────────────────────────────────────
// Server Component — sem "use client" porque não há interatividade.
// [CONCEITO] Quando não há useState ou eventos, mantenha como Server Component.
// O Next.js renderiza no servidor → HTML pronto → melhor para SEO e performance.
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

				{/* Lista de serviços */}
				<section className="py-24">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						{/*
						 * [PASSO 4] Iterar sobre os grupos principais.
						 * `servicos` vem diretamente do repository — sem transformação.
						 * A `key` usa o `titulo` porque é único entre os 3 grupos.
						 *
						 * [CONCEITO] Por que não há filtro aqui (ao contrário de Projetos)?
						 * A página de Projetos tem 15 itens — filtro faz sentido.
						 * Aqui temos 3 grupos — mostrar todos de uma vez é mais claro
						 * do que esconder 2 para mostrar 1. Menos não é sempre mais,
						 * mas mais não é sempre melhor.
						 */}
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
