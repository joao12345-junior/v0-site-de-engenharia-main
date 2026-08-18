// components/ui/sectorsCategory.tsx
//
// [MUDANÇA] `counts` agora é uma prop obrigatória em vez de importar
// `categoryCounts` do repository estático (build-time/JSON).
// Isso permite que a página pública passe contagens reais do banco.
//
// [CONCEITO] Por que mover dados de módulo pra prop?
// Antes: `categoryCounts` era calculado na inicialização do módulo (build-time)
// com os dados do JSON. A contagem era sempre a mesma, independente de quantos
// clientes existiam no banco.
// Depois: a página faz a query, passa o resultado. A contagem reflete o estado
// real do banco no momento do request — Server Component re-executa a query
// a cada request (ou com cache do Next.js, se configurado).

import {
	categoryClients,
	categoryIconsClient,
} from "@/lib/repositories/clients-repository";

interface SectorsCategoryProps {
	counts: Record<categoryClients, number>;
}

export function SectorsCategory({ counts }: SectorsCategoryProps) {
	return (
		<>
			{(Object.entries(counts) as [categoryClients, number][]).map(
				([category, count]) => {
					const Icon = categoryIconsClient[category];

					// Educação continua oculto — decisão de negócio existente
					if (category === "Educação") {
						return (
							<div
								key={category}
								className="hidden bg-card p-4 md:p-6 rounded-lg border border-border text-center hover:border-primary/50 transition-colors"
							>
								<div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-2 md:p-3 mb-3 md:mb-4">
									<Icon className="h-7 w-7 md:h-10 md:w-10 text-primary" />
								</div>
								<h3 className="text-sm md:text-base font-semibold text-foreground">
									{category}
								</h3>
								<p className="text-xl md:text-2xl font-bold text-primary mt-1 md:mt-2">
									{count}+
								</p>
								<p className="text-xs text-muted-foreground">clientes</p>
							</div>
						);
					}

					return (
						<div
							key={category}
							className="bg-card p-4 md:p-6 rounded-lg border border-border text-center hover:border-primary/50 transition-colors"
						>
							<div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-2 md:p-3 mb-3 md:mb-4">
								<Icon className="h-7 w-7 md:h-10 md:w-10 text-primary" />
							</div>
							<h3 className="text-sm md:text-base font-semibold text-foreground">
								{category}
							</h3>
							<p className="text-xl md:text-2xl font-bold text-primary mt-1 md:mt-2">
								{count}+
							</p>
							<p className="text-xs text-muted-foreground">clientes</p>
						</div>
					);
				},
			)}
		</>
	);
}
