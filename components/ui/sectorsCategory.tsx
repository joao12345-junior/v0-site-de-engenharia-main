// components/ui/sectorsCategory.tsx
import {
	categoryClients,
	categoryCounts,
	categoryIconsClient,
} from "@/lib/repositories/clients-repository";

export function SectorsCategory() {
	return (
		<>
			{Object.entries(categoryCounts).map(([category, count]) => {
				const Icon = categoryIconsClient[category as categoryClients];

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
						{/*
						 * [MUDANÇA] Ícone reduzido no mobile: h-7 w-7 → h-10 w-10 em md+
						 * [MUDANÇA] Padding do círculo: p-2 mobile → p-3 desktop
						 * [MUDANÇA] Margem inferior: mb-3 mobile → mb-4 desktop
						 *
						 * Regra geral: elementos decorativos (ícones, espaçamentos)
						 * devem escalar proporcionalmente ao espaço disponível.
						 * No mobile, o espaço é escasso — cada pixel conta.
						 */}
						<div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-2 md:p-3 mb-3 md:mb-4">
							<Icon className="h-7 w-7 md:h-10 md:w-10 text-primary" />
						</div>

						{/*
						 * [MUDANÇA] Fonte do nome: text-sm mobile → text-base desktop
						 * Isso garante que "Arquitetura" (9 chars) caiba no card estreito
						 * sem quebrar linha ou apertar o layout.
						 */}
						<h3 className="text-sm md:text-base font-semibold text-foreground">
							{category}
						</h3>

						{/*
						 * [MUDANÇA] Número: text-xl mobile → text-2xl desktop
						 * [MUDANÇA] Margem: mt-1 mobile → mt-2 desktop
						 */}
						<p className="text-xl md:text-2xl font-bold text-primary mt-1 md:mt-2">
							{count}+
						</p>
						<p className="text-xs text-muted-foreground">clientes</p>
					</div>
				);
			})}
		</>
	);
}
