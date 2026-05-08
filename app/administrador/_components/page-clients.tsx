import { PageContainer } from "./lib/shell";
import { SEED } from "./lib/data";
import { Ic } from "./lib/icons";

interface PageClientesProps {
	accent: string;
}

export function PageClientes({ accent }: PageClientesProps) {
	return (
		<PageContainer>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: 20,
					gap: 12,
					flexWrap: "wrap",
					alignItems: "center",
				}}
			>
				<div className="label-eyebrow">
					— {SEED.clientes.length} clientes ativos · sincronizados com o site
				</div>
				<button
					className="btn-primary"
					style={{ whiteSpace: "nowrap", flexShrink: 0 }}
				>
					<Ic.Plus size={14} /> Adicionar cliente
				</button>
			</div>
			<div
				className="grid-cards-sm"
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
					gap: 14,
				}}
			>
				{SEED.clientes.map((c) => (
					<div key={c.id} className="card-pop" style={{ padding: 18 }}>
						<div
							style={{
								width: 40,
								height: 40,
								background: "var(--card-2)",
								display: "grid",
								placeItems: "center",
								color: "var(--primary)",
								border: "1px solid var(--border)",
								marginBottom: 12,
								fontSize: 13,
								fontWeight: 700,
							}}
						>
							{c.nome
								.split(" ")
								.map((s) => s[0])
								.slice(0, 2)
								.join("")}
						</div>
						<div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
							{c.nome}
						</div>
						<div
							style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12 }}
						>
							{c.setor}
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								fontSize: 10,
								color: "var(--muted)",
								borderTop: "1px solid var(--border)",
								paddingTop: 10,
							}}
						>
							<span>{c.projetos} projetos</span>
							<button
								className="btn-ghost"
								style={{ padding: "2px 6px", fontSize: 10 }}
							>
								Ver
							</button>
						</div>
					</div>
				))}
			</div>
		</PageContainer>
	);
}
