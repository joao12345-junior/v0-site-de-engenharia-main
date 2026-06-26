import { PageContainer } from "../lib/shell";
import { SEED } from "../lib/data";
import { Ic } from "../lib/icons";

interface PageLogsProps {
	accent: string;
}

export function PageLogs({ accent }: PageLogsProps) {
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
					— Histórico completo · todas as ações registradas
				</div>
				<div style={{ display: "flex", gap: 8 }}>
					<button className="btn-ghost">
						<Ic.Filter size={13} /> Filtrar
					</button>
					<button className="btn-ghost">
						<Ic.Download size={13} /> Exportar
					</button>
				</div>
			</div>
			<div className="card-pop">
				{SEED.logs.map((l, i) => {
					const tcolor = {
						email: "var(--muted)",
						upload: "var(--info)",
						proposta: "var(--primary)",
						sistema: "var(--muted)",
						produto: "var(--warn)",
						conteudo: "var(--success)",
						auth: "var(--muted-2)",
					}[l.tipo];
					return (
						<div
							key={l.id}
							style={{
								padding: "14px 20px",
								display: "flex",
								alignItems: "center",
								gap: 16,
								borderBottom:
									i < SEED.logs.length - 1 ? "1px solid var(--border)" : "none",
							}}
						>
							<span
								style={{
									fontSize: 11,
									color: "var(--muted)",
									fontVariantNumeric: "tabular-nums",
									width: 60,
								}}
							>
								2026-05-07
							</span>
							<span
								style={{
									fontSize: 11,
									color: "var(--muted)",
									fontVariantNumeric: "tabular-nums",
									width: 50,
									fontWeight: 600,
								}}
							>
								{l.hora}
							</span>
							<span
								className="chip"
								style={{
									borderColor: tcolor ?? "var(--muted)",
									color: tcolor ?? "var(--muted)",
									textTransform: "uppercase",
									minWidth: 80,
									justifyContent: "center",
								}}
							>
								{l.tipo}
							</span>
							<span style={{ fontSize: 12, flex: 1 }}>{l.acao}</span>
							<span style={{ fontSize: 11, color: "var(--muted)" }}>
								{l.user}
							</span>
						</div>
					);
				})}
			</div>
		</PageContainer>
	);
}
