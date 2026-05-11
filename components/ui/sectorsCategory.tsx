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
				if (category == "Educação") {
					return (
						<div
							key={category}
							className=" hidden bg-card p-6 rounded-lg border border-border text-center hover:border-primary/50 transition-colors"
						>
							<div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4">
								<Icon className="h-10 w-10 text-primary" />
							</div>
							<h3 className="font-semibold text-foreground">{category}</h3>
							<p className="text-2xl font-bold text-primary mt-2">{count}+</p>
							<p className="text-xs text-muted-foreground">clientes</p>
						</div>
					);
				}
				return (
					<div
						key={category}
						className="bg-card p-6 rounded-lg border border-border text-center hover:border-primary/50 transition-colors"
					>
						<div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4">
							<Icon className="h-10 w-10 text-primary" />
						</div>
						<h3 className="font-semibold text-foreground">{category}</h3>
						<p className="text-2xl font-bold text-primary mt-2">{count}+</p>
						<p className="text-xs text-muted-foreground">clientes</p>
					</div>
				);
			})}
		</>
	);
}
