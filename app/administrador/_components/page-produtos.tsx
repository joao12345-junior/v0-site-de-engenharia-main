import React from "react";
import { Ic } from "./lib/icons";
import { PageContainer } from "./lib/shell";
import { ProjectDetail } from "./components/project_detail";
import type { Produto } from "./lib/types";
import { ProductCard } from "./components/product_card";
interface PageProdutosProps {
	accent: string;
	produtos: Produto[];
	setProdutos: React.Dispatch<React.SetStateAction<Produto[]>>;
}

export function PageProdutos({
	accent,
	produtos,
	setProdutos,
}: PageProdutosProps) {
	const [open, setOpen] = React.useState<string | null>(null);
	const updateOpen = (updater: (p: Produto) => Produto) =>
		setProdutos((prev) => prev.map((p) => (p.id === open ? updater(p) : p)));
	const openProd = produtos.find((p) => p.id === open);
	return (
		<PageContainer>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: 18,
				}}
			>
				<div className="label-eyebrow">
					— Catálogo · {produtos.length} produtos em desenvolvimento
				</div>
				<div style={{ display: "flex", gap: 10 }}>
					<button className="btn-ghost">
						<Ic.Filter size={14} /> Tipo
					</button>
					<button className="btn-primary">
						<Ic.Plus size={14} /> Novo Produto
					</button>
				</div>
			</div>
			<div
				className="grid-cards-sm"
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
					gap: 16,
				}}
			>
				{produtos.map((p) => (
					<ProductCard key={p.id} p={p} onOpen={() => setOpen(p.id)} />
				))}
			</div>
			{openProd && (
				<ProjectDetail
					project={openProd}
					onClose={() => setOpen(null)}
					onUpdate={updateOpen}
					accent={accent}
					isProd={true}
				/>
			)}
		</PageContainer>
	);
}
