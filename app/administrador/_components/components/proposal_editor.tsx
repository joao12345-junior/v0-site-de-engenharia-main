import { ItemProposta, Proposta } from "../lib/types";
import { useState } from "react";
import { Ic } from "../lib/icons";
import { TipoStatusProposta } from "../lib/types";
import { fmtBRL } from "../lib/utils";

interface ProposalEditorProps {
	proposta: Proposta;
	onClose: () => void;
	onSave: (p: Proposta) => void;
}

export function ProposalEditor({
	proposta,
	onClose,
	onSave,
}: ProposalEditorProps) {
	const [p, setP] = useState(proposta);

	const total = p.itens.reduce((soma, item) => soma + item.val * item.q, 0);
	const items = p.itens;

	function atualizarItem(
		id: string,
		campo: keyof ItemProposta,
		valor: string | number,
	): undefined {
		setP((anterior) => ({
			...anterior,
			itens: anterior.itens.map((item) =>
				item.id === id ? { ...item, [campo]: valor } : item,
			),
		}));
	}

	function adicionarItem(): undefined {
		const newItem: ItemProposta = {
			id: crypto.randomUUID(),
			desc: "",
			un: "projeto",
			q: 1,
			val: 0,
		};
		setP((anterior) => ({
			...anterior,
			itens: [...anterior.itens, newItem],
		}));
	}

	function removerItem(id: string): undefined {
		setP((anterior) => ({
			...anterior,
			itens: anterior.itens.filter((item) => item.id !== id),
		}));
	}

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
								setP({ ...p, status: e.target.value as TipoStatusProposta })
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
										<td>
											<button onClick={removerItem(it.id)}></button>
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
					<button
						className="btn-ghost"
						style={{ marginTop: 10 }}
						onClick={adicionarItem()}
					>
						<Ic.Plus size={13} /> Adicionar item
					</button>
				</div>
			</div>
		</div>
	);
}
