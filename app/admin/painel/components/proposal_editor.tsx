import { ItemProposta, Proposta } from "../lib/types";
import { useEffect, useState } from "react";
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

	function adicionarItem(): void {
		const novoItem: ItemProposta = {
			id: crypto.randomUUID(),
			desc: "Novo serviço",
			un: "projeto",
			q: 1,
			val: 0,
		};
		setP((anterior) => ({
			...anterior,
			itens: [...anterior.itens, novoItem],
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
									<th
										style={{
											padding: "10px 10px",
											textAlign: "left",
											fontSize: 10,
											color: "var(--muted)",
											textTransform: "uppercase",
										}}
									>
										Descrição
									</th>
									<th
										style={{
											padding: "10px 10px",
											width: 80,
											fontSize: 10,
											color: "var(--muted)",
											textTransform: "uppercase",
										}}
									>
										Un
									</th>
									<th
										style={{
											padding: "10px 10px",
											width: 60,
											fontSize: 10,
											color: "var(--muted)",
											textTransform: "uppercase",
										}}
									>
										Qtd
									</th>
									<th
										style={{
											padding: "10px 10px",
											width: 120,
											fontSize: 10,
											color: "var(--muted)",
											textTransform: "uppercase",
										}}
									>
										Valor un.
									</th>
									<th style={{ width: 40 }} />
								</tr>
							</thead>
							<tbody>
								{p.itens.map((item) => (
									<tr
										key={item.id}
										style={{ borderBottom: "1px solid var(--border)" }}
									>
										<td style={{ padding: "14px 6px" }}>
											<input
												className="input"
												value={item.desc}
												onChange={(e) =>
													atualizarItem(item.id, "desc", e.target.value)
												}
											/>
										</td>
										<td
											style={{
												padding: "8px 6px",
												width: 110,
												color: "var(--muted)",
											}}
										>
											<input
												className="input"
												value={item.un}
												onChange={(e) =>
													atualizarItem(item.id, "un", e.target.value)
												}
											/>
										</td>
										<td
											style={{
												padding: "8px 6px",
												width: 50,
												fontVariantNumeric: "tabular-nums",
											}}
										>
											<input
												className="input"
												type="number"
												value={item.q}
												min={1}
												style={{
													MozAppearance: "textfield",
													textAlign: "center",
												}}
												onChange={(e) =>
													atualizarItem(item.id, "q", +e.target.value)
												}
											/>
										</td>
										<td
											style={{
												padding: "10px 14px",
												fontVariantNumeric: "tabular-nums",
											}}
										>
											<input
												className="input"
												type="number"
												min={0}
												value={item.val}
												onChange={(e) =>
													atualizarItem(item.id, "val", +e.target.value)
												}
											/>
										</td>
										<td style={{ padding: "8px 10px", textAlign: "center" }}>
											<button
												className="btn-ghost"
												onClick={() => removerItem(item.id)}
												style={{
													padding: 4,
													border: "1px solid var(--border)",
												}}
											>
												<Ic.Trash size={12} />
											</button>
										</td>
									</tr>
								))}
							</tbody>
							<tfoot>
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
							</tfoot>
						</table>
					</div>
					<button
						className="btn-ghost"
						style={{ marginTop: 10 }}
						onClick={() => adicionarItem()}
					>
						<Ic.Plus size={13} /> Adicionar item
					</button>
				</div>
			</div>
		</div>
	);
}
