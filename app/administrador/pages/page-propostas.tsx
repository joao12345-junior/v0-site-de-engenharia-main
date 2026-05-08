import { PageContainer } from "../lib/shell";
import React from "react";
import { fmtBRL } from "./page-dashboard";
import { Ic } from "../lib/icons";

type TipoStatus = "Rascunho" | "Em análise" | "Aprovada" | "Recusada";

export interface Proposta {
	id: string | number;
	numero: string;
	cliente: string;
	projeto: string;
	valor: number;
	status: TipoStatus;
	data: string;
	vencimento: string;
	responsavel: string;
}

interface PagePropostasProps {
	accent: string;
	propostas: Proposta[];
	setPropostas: React.Dispatch<React.SetStateAction<Proposta[]>>;
}

interface ProposalEditorProps {
	proposta: Proposta;
	onClose: () => void;
	onSave: (p: Proposta) => void;
}

// Propostas — lista + editor
export function PagePropostas({
	accent,
	propostas,
	setPropostas,
}: PagePropostasProps) {
	const [edit, setEdit] = React.useState<Proposta | null>(null);
	const [filter, setFilter] = React.useState("Todas");
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
						window.toast && window.toast("Proposta " + p.numero + " salva.");
						setEdit(null);
					}}
				/>
			)}
		</PageContainer>
	);
}

export function ProposalEditor({
	proposta,
	onClose,
	onSave,
}: ProposalEditorProps) {
	const [p, setP] = React.useState(proposta);
	const items = [
		{
			desc: "Projeto Hidrossanitário completo",
			un: "projeto",
			q: 1,
			val: 48000,
		},
		{
			desc: "Projeto Elétrico de baixa e média tensão",
			un: "projeto",
			q: 1,
			val: 62000,
		},
		{ desc: "Projeto SPDA conforme NBR 5419", un: "projeto", q: 1, val: 18500 },
		{
			desc: "Projeto Prevenção e Combate a Incêndios",
			un: "projeto",
			q: 1,
			val: 56000,
		},
	];
	const total = items.reduce((s, i) => s + i.val * i.q, 0);
	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				background: "rgba(0,0,0,0.7)",
				backdropFilter: "blur(4px)",
				zIndex: 100,
				display: "flex",
				justifyContent: "flex-end",
			}}
			onClick={onClose}
		>
			<div
				className="detail-panel"
				onClick={(e) => e.stopPropagation()}
				style={{
					width: 880,
					maxWidth: "95vw",
					height: "100%",
					background: "var(--bg)",
					borderLeft: "1px solid var(--border)",
					overflow: "auto",
				}}
			>
				<div
					style={{
						padding: "20px 24px",
						borderBottom: "1px solid var(--border)",
						display: "flex",
						justifyContent: "space-between",
						position: "sticky",
						top: 0,
						background: "var(--bg)",
						zIndex: 2,
					}}
				>
					<div>
						<div className="label-eyebrow">— Editor de proposta</div>
						<h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>
							{p.numero}
						</h2>
					</div>
					<div style={{ display: "flex", gap: 8 }}>
						<button className="btn-ghost">
							<Ic.Eye size={13} /> Pré-visualizar
						</button>
						<button className="btn-ghost">
							<Ic.Download size={13} /> PDF
						</button>
						<button className="btn-primary" onClick={() => onSave(p)}>
							<Ic.Check size={13} /> Salvar
						</button>
						<button
							className="btn-ghost"
							onClick={onClose}
							style={{ padding: 8, border: "1px solid var(--border)" }}
						>
							<Ic.X size={13} />
						</button>
					</div>
				</div>
				<div
					className="grid-2col"
					style={{
						padding: 24,
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						gap: 14,
					}}
				>
					<div>
						<div
							style={{
								fontSize: 10,
								color: "var(--muted)",
								textTransform: "uppercase",
								letterSpacing: ".08em",
								marginBottom: 4,
							}}
						>
							Cliente
						</div>
						<input
							className="input"
							value={p.cliente}
							onChange={(e) => setP({ ...p, cliente: e.target.value })}
						/>
					</div>
					<div>
						<div
							style={{
								fontSize: 10,
								color: "var(--muted)",
								textTransform: "uppercase",
								letterSpacing: ".08em",
								marginBottom: 4,
							}}
						>
							Projeto
						</div>
						<input
							className="input"
							value={p.projeto}
							onChange={(e) => setP({ ...p, projeto: e.target.value })}
						/>
					</div>
					<div>
						<div
							style={{
								fontSize: 10,
								color: "var(--muted)",
								textTransform: "uppercase",
								letterSpacing: ".08em",
								marginBottom: 4,
							}}
						>
							Responsável
						</div>
						<input
							className="input"
							value={p.responsavel}
							onChange={(e) => setP({ ...p, responsavel: e.target.value })}
						/>
					</div>
					<div>
						<div
							style={{
								fontSize: 10,
								color: "var(--muted)",
								textTransform: "uppercase",
								letterSpacing: ".08em",
								marginBottom: 4,
							}}
						>
							Vencimento
						</div>
						<input
							className="input"
							type="date"
							value={p.vencimento}
							onChange={(e) => setP({ ...p, vencimento: e.target.value })}
						/>
					</div>
					<div>
						<div
							style={{
								fontSize: 10,
								color: "var(--muted)",
								textTransform: "uppercase",
								letterSpacing: ".08em",
								marginBottom: 4,
							}}
						>
							Status
						</div>
						<select
							className="input"
							value={p.status}
							onChange={(e) =>
								setP({ ...p, status: e.target.value as TipoStatus })
							}
						>
							{["Rascunho", "Em análise", "Aprovada", "Recusada"].map((s) => (
								<option key={s}>{s}</option>
							))}
						</select>
					</div>
					<div>
						<div
							style={{
								fontSize: 10,
								color: "var(--muted)",
								textTransform: "uppercase",
								letterSpacing: ".08em",
								marginBottom: 4,
							}}
						>
							Valor (R$)
						</div>
						<input
							className="input"
							type="number"
							value={p.valor}
							onChange={(e) => setP({ ...p, valor: +e.target.value })}
						/>
					</div>
				</div>
				<div style={{ padding: "0 24px 24px" }}>
					<div className="label-eyebrow" style={{ marginBottom: 10 }}>
						— Itens da proposta
					</div>
					<div
						className="card table-scroll"
						style={{ borderLeft: "3px solid var(--primary)" }}
					>
						<table
							style={{
								width: "100%",
								borderCollapse: "collapse",
								fontSize: 12,
							}}
						>
							<thead>
								<tr
									style={{
										borderBottom: "1px solid var(--border)",
										background: "var(--bg-2)",
									}}
								>
									{["Descrição", "Un", "Qtd", "Valor un.", "Total"].map((h) => (
										<th
											key={h}
											style={{
												padding: "10px 14px",
												textAlign: "left",
												fontSize: 10,
												color: "var(--muted)",
												textTransform: "uppercase",
											}}
										>
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{items.map((it, i) => (
									<tr
										key={i}
										style={{ borderBottom: "1px solid var(--border)" }}
									>
										<td style={{ padding: "10px 14px" }}>{it.desc}</td>
										<td style={{ padding: "10px 14px", color: "var(--muted)" }}>
											{it.un}
										</td>
										<td
											style={{
												padding: "10px 14px",
												fontVariantNumeric: "tabular-nums",
											}}
										>
											{it.q}
										</td>
										<td
											style={{
												padding: "10px 14px",
												fontVariantNumeric: "tabular-nums",
											}}
										>
											{fmtBRL(it.val)}
										</td>
										<td
											style={{
												padding: "10px 14px",
												fontWeight: 700,
												fontVariantNumeric: "tabular-nums",
											}}
										>
											{fmtBRL(it.val * it.q)}
										</td>
									</tr>
								))}
								<tr>
									<td
										colSpan={4}
										style={{
											padding: "14px",
											textAlign: "right",
											fontWeight: 600,
											color: "var(--muted)",
										}}
									>
										TOTAL
									</td>
									<td
										style={{
											padding: "14px",
											fontWeight: 800,
											fontSize: 16,
											color: "var(--primary)",
											fontVariantNumeric: "tabular-nums",
										}}
									>
										{fmtBRL(total)}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<button className="btn-ghost" style={{ marginTop: 10 }}>
						<Ic.Plus size={13} /> Adicionar item
					</button>
				</div>
			</div>
		</div>
	);
}
