import { PageContainer } from "../lib/shell";
import { SEED } from "../lib/data";

interface PageAtividadeProps {
	accent: string;
}

export function PageAtividade({ accent }: PageAtividadeProps) {
	return (
		<PageContainer>
			<div className="label-eyebrow" style={{ marginBottom: 14 }}>
				— Tempo real · todas as ações de hoje
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
									width: 50,
									fontWeight: 600,
								}}
							>
								{l.hora}
							</span>
							<span
								style={{
									width: 8,
									height: 8,
									background: tcolor ?? "var(--muted)",
									flexShrink: 0,
								}}
							></span>
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
