import { PageContainer } from "./lib/shell";
import { fmtBRL } from "./lib/utils";
import { Ic } from "./lib/icons";
import type { Proposta } from "./lib/types";
import { useState } from "react";
import { ProposalEditor } from "./components/proposal_editor";

interface PagePropostasProps {
	accent: string;
	propostas: Proposta[];
	setPropostas: React.Dispatch<React.SetStateAction<Proposta[]>>;
}

// Propostas — lista + editor
export function PagePropostas({
	accent,
	propostas,
	setPropostas,
}: PagePropostasProps) {
	const [edit, setEdit] = useState<Proposta | null>(null);
	const [filter, setFilter] = useState("Todas");
	const statusList = [
		"Todas",
		"Rascunho",
		"Em análise",
		"Aprovada",
		"Recusada",
	];
	const list = propostas.filter(
		(p) => filter === "Todas" || p.status === filter,
	);

	const tot = propostas.reduce(
		(acc, p) => {
			acc.total += p.valor;
			if (p.status === "Aprovada") acc.aprov += p.valor;
			return acc;
		},
		{ total: 0, aprov: 0 },
	);

	return (
		<PageContainer>
			<div
				className="grid-stat-4"
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr 1fr 1fr",
					gap: 14,
					marginBottom: 22,
				}}
			>
				<div className="card-pop" style={{ padding: 16 }}>
					<div className="label-eyebrow">— Total emitido</div>
					<div style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>
						{fmtBRL(tot.total)}
					</div>
				</div>
				<div className="card-pop" style={{ padding: 16 }}>
					<div className="label-eyebrow">— Aprovado</div>
					<div
						style={{
							fontSize: 24,
							fontWeight: 700,
							marginTop: 8,
							color: "var(--success)",
						}}
					>
						{fmtBRL(tot.aprov)}
					</div>
				</div>
				<div className="card-pop" style={{ padding: 16 }}>
					<div className="label-eyebrow">— Conversão</div>
					<div style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>
						{Math.round((tot.aprov / tot.total) * 100)}%
					</div>
				</div>
				<div className="card-pop" style={{ padding: 16 }}>
					<div className="label-eyebrow">— Pendentes</div>
					<div
						style={{
							fontSize: 24,
							fontWeight: 700,
							marginTop: 8,
							color: "var(--warn)",
						}}
					>
						{propostas.filter((p) => p.status === "Em análise").length}
					</div>
				</div>
			</div>

			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: 14,
					gap: 12,
					flexWrap: "wrap",
				}}
			>
				<div className="filter-row" style={{ display: "flex", gap: 6 }}>
					{statusList.map((s) => (
						<button
							key={s}
							onClick={() => setFilter(s)}
							style={{
								padding: "7px 13px",
								fontSize: 12,
								background: filter === s ? accent : "transparent",
								color: filter === s ? "#fff" : "var(--fg-2)",
								border: `1px solid ${filter === s ? accent : "var(--border)"}`,
							}}
						>
							{s}
						</button>
					))}
				</div>
				<div style={{ display: "flex", gap: 8 }}>
					<button className="btn-ghost">
						<Ic.Download size={13} /> Exportar CSV
					</button>
					<button
						className="btn-primary"
						onClick={() =>
							setEdit({
								id: "new",
								numero: "#NOVA",
								cliente: "",
								projeto: "",
								valor: 0,
								status: "Rascunho",
								data: "2026-05-07",
								vencimento: "",
								responsavel: "Marcelo Berny",
								itens: [],
							})
						}
					>
						<Ic.Plus size={14} /> Nova Proposta
					</button>
				</div>
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
								"Nº",
								"Cliente",
								"Projeto",
								"Responsável",
								"Data",
								"Valor",
								"Status",
								"",
							].map((h) => (
								<th
									key={h}
									style={{
										padding: "12px 14px",
										textAlign: "left",
										fontSize: 10,
										color: "var(--muted)",
										textTransform: "uppercase",
										letterSpacing: "0.08em",
										fontWeight: 600,
									}}
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{list.map((p, i) => (
							<tr
								key={p.id}
								style={{
									borderBottom:
										i < list.length - 1 ? "1px solid var(--border)" : "none",
								}}
							>
								<td
									style={{
										padding: "12px 14px",
										fontWeight: 700,
										fontVariantNumeric: "tabular-nums",
									}}
								>
									{p.numero}
								</td>
								<td style={{ padding: "12px 14px" }}>{p.cliente}</td>
								<td style={{ padding: "12px 14px", color: "var(--muted)" }}>
									{p.projeto}
								</td>
								<td style={{ padding: "12px 14px", color: "var(--muted)" }}>
									{p.responsavel}
								</td>
								<td
									style={{
										padding: "12px 14px",
										color: "var(--muted)",
										fontVariantNumeric: "tabular-nums",
									}}
								>
									{p.data}
								</td>
								<td
									style={{
										padding: "12px 14px",
										fontWeight: 600,
										fontVariantNumeric: "tabular-nums",
									}}
								>
									{fmtBRL(p.valor)}
								</td>
								<td style={{ padding: "12px 14px" }}>
									<span
										className={
											"chip " +
											(p.status === "Aprovada"
												? "green"
												: p.status === "Em análise"
													? "warn"
													: p.status === "Recusada"
														? "red"
														: "")
										}
									>
										{p.status}
									</span>
								</td>
								<td style={{ padding: "12px 14px", textAlign: "right" }}>
									<button
										onClick={() => setEdit(p)}
										className="btn-ghost"
										style={{ padding: 6, border: "1px solid var(--border)" }}
									>
										<Ic.Edit size={12} />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{edit && (
				<ProposalEditor
					proposta={edit}
					onClose={() => setEdit(null)}
					onSave={(p) => {
						if (p.id === "new") {
							setPropostas((prev) => [
								...prev,
								{
									...p,
									id: "p" + Date.now(),
									numero: "#" + (2320 + prev.length),
								},
							]);
						} else {
							setPropostas((prev) => prev.map((x) => (x.id === p.id ? p : x)));
						}
						setEdit(null);
					}}
				/>
			)}
		</PageContainer>
	);
}
