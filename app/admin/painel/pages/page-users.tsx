import { PageContainer } from "../lib/shell";
import { SEED } from "../lib/data";
import { Ic } from "../lib/icons";

interface PageUsuariosProps {
	accent: string;
}

export function PageUsuarios({ accent }: PageUsuariosProps) {
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
					— {SEED.usuarios.filter((u) => u.ativo).length} usuários ativos ·{" "}
					{SEED.usuarios.length} total
				</div>
				<button
					className="btn-primary"
					style={{ whiteSpace: "nowrap", flexShrink: 0 }}
				>
					<Ic.Plus size={14} /> Convidar usuário
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
							{[
								"Usuário",
								"E-mail",
								"Cargo",
								"Perfil",
								"Último acesso",
								"Status",
							].map((h) => (
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
							))}
						</tr>
					</thead>
					<tbody>
						{SEED.usuarios.map((u, i) => (
							<tr
								key={u.id}
								style={{
									borderBottom:
										i < SEED.usuarios.length - 1
											? "1px solid var(--border)"
											: "none",
								}}
							>
								<td
									style={{
										padding: "12px 14px",
										display: "flex",
										alignItems: "center",
										gap: 10,
									}}
								>
									<div
										style={{
											width: 28,
											height: 28,
											background: "var(--card-2)",
											border: "1px solid var(--border)",
											display: "grid",
											placeItems: "center",
											fontSize: 10,
											fontWeight: 700,
											color: "var(--primary)",
										}}
									>
										{u.nome
											.split(" ")
											.map((s) => s[0])
											.slice(0, 2)
											.join("")}
									</div>
									<span style={{ fontWeight: 600 }}>{u.nome}</span>
								</td>
								<td style={{ padding: "12px 14px", color: "var(--muted)" }}>
									{u.email}
								</td>
								<td style={{ padding: "12px 14px", color: "var(--muted)" }}>
									{u.cargo}
								</td>
								<td style={{ padding: "12px 14px" }}>
									<span
										className={
											"chip " +
											(u.perfil === "admin"
												? "red"
												: u.perfil === "editor"
													? "warn"
													: "")
										}
									>
										{u.perfil}
									</span>
								</td>
								<td style={{ padding: "12px 14px", color: "var(--muted)" }}>
									{u.ultimo}
								</td>
								<td style={{ padding: "12px 14px" }}>
									<span className={"chip " + (u.ativo ? "green" : "")}>
										{u.ativo ? "ativo" : "inativo"}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</PageContainer>
	);
}
