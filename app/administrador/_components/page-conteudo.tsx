import { PageContainer } from "./lib/shell";
import { SEED } from "./lib/data";
import { Ic } from "./lib/icons";

interface PageConteudoProps {
	accent: string;
}

export function PageConteudo({ accent }: PageConteudoProps) {
	return (
		<PageContainer>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: 20,
				}}
			>
				<div className="label-eyebrow">
					— Editor do site público optare.com.br
				</div>
				<button className="btn-primary">
					<Ic.Plus size={14} /> Nova seção
				</button>
			</div>
			<div className="card-pop table-scroll">
				<table
					style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
				>
					<thead>
						<tr
							style={{
								borderBottom: "1px solid var(--border)",
								background: "var(--bg-2)",
							}}
						>
							{["Seção", "Título", "Última atualização", "Autor", ""].map(
								(h) => (
									<th
										key={h}
										style={{
											padding: "12px 14px",
											textAlign: "left",
											fontSize: 10,
											textTransform: "uppercase",
											color: "var(--muted)",
											letterSpacing: ".08em",
										}}
									>
										{h}
									</th>
								),
							)}
						</tr>
					</thead>
					<tbody>
						{SEED.conteudo.map((c, i) => (
							<tr
								key={c.id}
								style={{
									borderBottom:
										i < SEED.conteudo.length - 1
											? "1px solid var(--border)"
											: "none",
								}}
							>
								<td style={{ padding: "14px" }}>
									<span className="chip red">{c.secao}</span>
								</td>
								<td style={{ padding: "14px", fontWeight: 600 }}>{c.titulo}</td>
								<td style={{ padding: "14px", color: "var(--muted)" }}>
									{c.atualizado}
								</td>
								<td style={{ padding: "14px", color: "var(--muted)" }}>
									{c.autor}
								</td>
								<td
									style={{
										padding: "14px",
										textAlign: "right",
										whiteSpace: "nowrap",
									}}
								>
									<div style={{ display: "inline-flex", gap: 4 }}>
										<button
											className="btn-ghost"
											style={{ padding: 6, border: "1px solid var(--border)" }}
										>
											<Ic.Eye size={12} />
										</button>
										<button
											className="btn-ghost"
											style={{ padding: 6, border: "1px solid var(--border)" }}
										>
											<Ic.Edit size={12} />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</PageContainer>
	);
}
