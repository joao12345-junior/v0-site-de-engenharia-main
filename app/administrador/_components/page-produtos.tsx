"use client";
// app/administrador/_components/page-produtos.tsx
//
// [MUDANÇA] Reescrito para consumir /api/admin/products em vez do SEED.
// Mesmo padrão de page-projetos.tsx e page-clients.tsx.
//
// [ESCOPO DELIBERADO] ProjectDetail (foto/galeria) mantido intacto —
// mesma decisão de page-projetos.tsx. onSave agora chama PATCH real
// com campos de texto, sem tocar em fotos.
//
// [MUDANÇA ARQUITETURAL] Estado de produtos saiu de administrador/page.tsx
// e passou a ser local aqui, igual ao que foi feito com projetos.

import { useState, useEffect, useCallback } from "react";
import { Ic } from "./lib/icons";
import { PageContainer } from "./lib/shell";
import type { Produto, TipoProduto, StatusProduto } from "./lib/types";
import { ProductCard } from "./components/product_card";
import { ProjectDetail } from "./components/project_detail";

interface PageProdutosProps {
	accent: string;
}

const TIPOS: TipoProduto[] = ["Kit", "Sistema", "Equipamento", "Componente"];

const STATUS_OPCOES: StatusProduto[] = [
	"Pesquisa",
	"Desenvolvimento",
	"Protótipo",
	"Aprovado",
];

const FORM_VAZIO = {
	nome: "",
	tipo: "Kit" as TipoProduto,
	sku: "",
	lancamento: "",
	preco: "",
};

export function PageProdutos({ accent }: PageProdutosProps) {
	// ─── Estado principal ──────────────────────────────────────────────────
	const [produtos, setProdutos] = useState<Produto[]>([]);
	const [loading, setLoading] = useState(true);
	const [erro, setErro] = useState<string | null>(null);

	// ─── Produto aberto no ProjectDetail ──────────────────────────────────
	const [open, setOpen] = useState<string | null>(null);

	// ─── Filtro por tipo ───────────────────────────────────────────────────
	const [filter, setFilter] = useState<"todos" | TipoProduto>("todos");

	// ─── Modal de criação ──────────────────────────────────────────────────
	const [modalAberto, setModalAberto] = useState(false);
	const [form, setForm] = useState(FORM_VAZIO);
	const [salvando, setSalvando] = useState(false);
	const [erroForm, setErroForm] = useState<string | null>(null);

	// ─── Ações inline ─────────────────────────────────────────────────────
	const [publicando, setPublicando] = useState<string | null>(null);
	const [deletando, setDeletando] = useState<string | null>(null);

	// ─── Busca produtos ────────────────────────────────────────────────────
	const carregarProdutos = useCallback(async () => {
		setLoading(true);
		setErro(null);
		try {
			const res = await fetch("/api/admin/products/");
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			setProdutos(data.produtos);
		} catch (e: unknown) {
			setErro("Não foi possível carregar os produtos.");
			console.error("[PageProdutos] Erro ao carregar:", e);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		carregarProdutos();
	}, [carregarProdutos]);

	// ─── Criar produto ─────────────────────────────────────────────────────
	const handleCriar = async () => {
		if (!form.nome.trim()) {
			setErroForm("Nome é obrigatório.");
			return;
		}
		if (!form.sku.trim()) {
			setErroForm("SKU é obrigatório.");
			return;
		}

		setSalvando(true);
		setErroForm(null);
		try {
			const res = await fetch("/api/admin/products/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					nome: form.nome.trim(),
					tipo: form.tipo,
					sku: form.sku.trim(),
					lancamento: form.lancamento.trim() || undefined,
					preco: form.preco.trim() || undefined,
				}),
			});
			const data = await res.json();
			if (!res.ok) {
				setErroForm(data.error ?? "Erro ao criar produto.");
				return;
			}
			setProdutos((prev) => [data.produto, ...prev]);
			setModalAberto(false);
			setForm(FORM_VAZIO);
		} catch (e: unknown) {
			setErroForm("Falha na conexão.");
			console.error("[PageProdutos] Erro ao criar:", e);
		} finally {
			setSalvando(false);
		}
	};

	// ─── Salvar campos de texto via ProjectDetail ──────────────────────────
	const handleSave = async (produtoEditado: Produto) => {
		try {
			const res = await fetch(`/api/admin/products/${produtoEditado.id}/`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					nome: produtoEditado.nome,
					tipo: produtoEditado.tipo,
					sku: produtoEditado.sku,
					lancamento: produtoEditado.lancamento,
					preco: produtoEditado.preco,
					status: produtoEditado.status,
				}),
			});
			const data = await res.json();
			if (!res.ok) {
				alert(data.error ?? "Erro ao salvar produto.");
				return;
			}
			setProdutos((prev) =>
				prev.map((p) => (p.id === data.produto.id ? data.produto : p)),
			);
		} catch (e: unknown) {
			alert("Falha na conexão.");
			console.error("[PageProdutos] Erro ao salvar:", e);
		}
	};

	// ─── Publicar ──────────────────────────────────────────────────────────
	const handlePublicar = async (id: string) => {
		setPublicando(id);
		try {
			const res = await fetch(`/api/admin/products/${id}/publish/`, {
				method: "POST",
			});
			const data = await res.json();
			if (!res.ok) {
				alert(data.error ?? "Erro ao publicar.");
				return;
			}
			setProdutos((prev) => prev.map((p) => (p.id === id ? data.produto : p)));
		} catch (e: unknown) {
			alert("Falha na conexão.");
			console.error("[PageProdutos] Erro ao publicar:", e);
		} finally {
			setPublicando(null);
		}
	};

	// ─── Despublicar ───────────────────────────────────────────────────────
	const handleDespublicar = async (id: string) => {
		try {
			const res = await fetch(`/api/admin/products/${id}/`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ visible: false }),
			});
			const data = await res.json();
			if (!res.ok) {
				alert(data.error ?? "Erro ao despublicar.");
				return;
			}
			setProdutos((prev) => prev.map((p) => (p.id === id ? data.produto : p)));
		} catch (e: unknown) {
			alert("Falha na conexão.");
			console.error("[PageProdutos] Erro ao despublicar:", e);
		}
	};

	// ─── Deletar ───────────────────────────────────────────────────────────
	const handleDeletar = async (id: string) => {
		try {
			const res = await fetch(`/api/admin/products/${id}/`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (!res.ok) {
				alert(data.error ?? "Erro ao apagar.");
				return;
			}
			setProdutos((prev) => prev.filter((p) => p.id !== id));
			if (open === id) setOpen(null);
		} catch (e: unknown) {
			alert("Falha na conexão.");
			console.error("[PageProdutos] Erro ao deletar:", e);
		} finally {
			setDeletando(null);
		}
	};

	const updateOpen = (updater: (p: Produto) => Produto) =>
		setProdutos((prev) => prev.map((p) => (p.id === open ? updater(p) : p)));

	const list = produtos.filter((p) => filter === "todos" || p.tipo === filter);

	const openProd = produtos.find((p) => p.id === open);

	// ─── Loading / erro ────────────────────────────────────────────────────
	if (loading) {
		return (
			<PageContainer>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 8,
						color: "var(--muted)",
						fontSize: 13,
					}}
				>
					<Ic.Activity size={14} /> Carregando produtos...
				</div>
			</PageContainer>
		);
	}

	if (erro) {
		return (
			<PageContainer>
				<div style={{ color: "var(--muted)", fontSize: 13 }}>
					{erro}{" "}
					<button className="btn-ghost" onClick={carregarProdutos}>
						Tentar novamente
					</button>
				</div>
			</PageContainer>
		);
	}

	// ─── Render principal ──────────────────────────────────────────────────
	return (
		<PageContainer>
			{/* Cabeçalho */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: 18,
					gap: 14,
					flexWrap: "wrap",
				}}
			>
				{/* Filtro por tipo */}
				<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
					{(["todos", ...TIPOS] as const).map((t) => (
						<button
							key={t}
							onClick={() => setFilter(t)}
							className={filter === t ? "" : "btn-ghost"}
							style={{
								padding: "7px 14px",
								background: filter === t ? accent : "transparent",
								color: filter === t ? "#fff" : "var(--fg-2)",
								border: `1px solid ${filter === t ? accent : "var(--border)"}`,
								fontSize: 12,
								fontWeight: 500,
							}}
						>
							{t}
						</button>
					))}
				</div>

				<div
					style={{
						display: "flex",
						gap: 10,
						alignItems: "center",
						flexShrink: 0,
					}}
				>
					<span style={{ fontSize: 12, color: "var(--muted)" }}>
						{produtos.filter((p) => p.visible).length} publicados ·{" "}
						{produtos.length} total
					</span>
					<button
						className="btn-primary"
						style={{ whiteSpace: "nowrap" }}
						onClick={() => {
							setForm(FORM_VAZIO);
							setErroForm(null);
							setModalAberto(true);
						}}
					>
						<Ic.Plus size={14} /> Novo Produto
					</button>
				</div>
			</div>

			{/* Grid de cards */}
			{list.length === 0 ? (
				<div style={{ color: "var(--muted)", fontSize: 13 }}>
					{filter === "todos"
						? "Nenhum produto cadastrado ainda."
						: `Nenhum produto do tipo "${filter}".`}
				</div>
			) : (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
						gap: 16,
					}}
				>
					{list.map((p) => (
						<div key={p.id} style={{ position: "relative" }}>
							<ProductCard p={p} onOpen={() => setOpen(p.id)} />

							{/* Ações rápidas */}
							<div
								style={{
									position: "absolute",
									bottom: 52,
									right: 8,
									display: "flex",
									gap: 4,
								}}
							>
								{p.visible ? (
									<button
										className="btn-ghost"
										style={{ padding: "3px 7px", fontSize: 10 }}
										title="Despublicar"
										onClick={(e) => {
											e.stopPropagation();
											handleDespublicar(p.id);
										}}
									>
										<span style={{ fontSize: 10, fontWeight: 600 }}>✕</span>
									</button>
								) : (
									<button
										className="btn-ghost"
										style={{ padding: "3px 7px", fontSize: 10 }}
										title={
											p.status === "Aprovado"
												? "Publicar"
												: "Precisa estar Aprovado"
										}
										disabled={p.status !== "Aprovado" || publicando === p.id}
										onClick={(e) => {
											e.stopPropagation();
											handlePublicar(p.id);
										}}
									>
										<Ic.Eye size={11} />
									</button>
								)}

								{deletando === p.id ? (
									<>
										<button
											className="btn-ghost"
											style={{
												padding: "3px 7px",
												fontSize: 10,
												color: "var(--destructive, #c00)",
											}}
											onClick={(e) => {
												e.stopPropagation();
												handleDeletar(p.id);
											}}
										>
											Confirmar
										</button>
										<button
											className="btn-ghost"
											style={{ padding: "3px 7px", fontSize: 10 }}
											onClick={(e) => {
												e.stopPropagation();
												setDeletando(null);
											}}
										>
											Cancelar
										</button>
									</>
								) : (
									<button
										className="btn-ghost"
										style={{ padding: "3px 7px", fontSize: 10 }}
										title="Apagar produto"
										onClick={(e) => {
											e.stopPropagation();
											setDeletando(p.id);
										}}
									>
										<Ic.Trash size={11} />
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			)}

			{/* ProjectDetail reutilizado com isProd={true} */}
			{openProd && (
				<ProjectDetail
					project={openProd}
					onClose={() => setOpen(null)}
					onUpdate={updateOpen}
					onSave={handleSave}
					accent={accent}
					isProd={true}
				/>
			)}

			{/* Modal de criação */}
			{modalAberto && (
				<div
					style={{
						position: "fixed",
						inset: 0,
						background: "rgba(0,0,0,0.6)",
						backdropFilter: "blur(4px)",
						zIndex: 200,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
					onClick={() => setModalAberto(false)}
				>
					<div
						className="card-pop"
						style={{
							width: 440,
							maxWidth: "95vw",
							padding: 28,
							background: "var(--bg)",
						}}
						onClick={(e) => e.stopPropagation()}
					>
						<div
							style={{
								fontSize: 15,
								fontWeight: 700,
								marginBottom: 20,
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							Novo produto
							<button
								className="btn-ghost"
								style={{ padding: "4px 8px" }}
								onClick={() => setModalAberto(false)}
							>
								<Ic.X size={14} />
							</button>
						</div>

						<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
							{/* Nome */}
							<div>
								<label
									style={{
										fontSize: 11,
										color: "var(--muted)",
										display: "block",
										marginBottom: 4,
									}}
								>
									Nome *
								</label>
								<input
									className="input"
									value={form.nome}
									onChange={(e) =>
										setForm((f) => ({ ...f, nome: e.target.value }))
									}
									placeholder="Ex: OPT-HID Kit Modular"
									style={{ width: "100%", boxSizing: "border-box" }}
								/>
							</div>

							{/* Tipo + SKU */}
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									gap: 12,
								}}
							>
								<div>
									<label
										style={{
											fontSize: 11,
											color: "var(--muted)",
											display: "block",
											marginBottom: 4,
										}}
									>
										Tipo *
									</label>
									<select
										className="input"
										value={form.tipo}
										onChange={(e) =>
											setForm((f) => ({
												...f,
												tipo: e.target.value as TipoProduto,
											}))
										}
										style={{ width: "100%", boxSizing: "border-box" }}
									>
										{TIPOS.map((t) => (
											<option key={t} value={t}>
												{t}
											</option>
										))}
									</select>
								</div>
								<div>
									<label
										style={{
											fontSize: 11,
											color: "var(--muted)",
											display: "block",
											marginBottom: 4,
										}}
									>
										SKU *
									</label>
									<input
										className="input"
										value={form.sku}
										onChange={(e) =>
											setForm((f) => ({ ...f, sku: e.target.value }))
										}
										placeholder="Ex: OPT-HID-02"
										style={{ width: "100%", boxSizing: "border-box" }}
									/>
								</div>
							</div>

							{/* Lançamento + Preço */}
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									gap: 12,
								}}
							>
								<div>
									<label
										style={{
											fontSize: 11,
											color: "var(--muted)",
											display: "block",
											marginBottom: 4,
										}}
									>
										Lançamento
									</label>
									<input
										className="input"
										value={form.lancamento}
										onChange={(e) =>
											setForm((f) => ({ ...f, lancamento: e.target.value }))
										}
										placeholder="Ex: 2026-12"
										style={{ width: "100%", boxSizing: "border-box" }}
									/>
								</div>
								<div>
									<label
										style={{
											fontSize: 11,
											color: "var(--muted)",
											display: "block",
											marginBottom: 4,
										}}
									>
										Preço
									</label>
									<input
										className="input"
										value={form.preco}
										onChange={(e) =>
											setForm((f) => ({ ...f, preco: e.target.value }))
										}
										placeholder="Ex: R$ 12.900"
										style={{ width: "100%", boxSizing: "border-box" }}
									/>
								</div>
							</div>

							{erroForm && (
								<div
									style={{
										fontSize: 11,
										color: "var(--destructive, #c00)",
										padding: "8px 12px",
										background: "rgba(200,0,0,0.06)",
										border: "1px solid rgba(200,0,0,0.2)",
									}}
								>
									{erroForm}
								</div>
							)}

							<div
								style={{
									display: "flex",
									justifyContent: "flex-end",
									gap: 8,
									marginTop: 4,
								}}
							>
								<button
									className="btn-ghost"
									onClick={() => setModalAberto(false)}
									disabled={salvando}
								>
									Cancelar
								</button>
								<button
									className="btn-primary"
									onClick={handleCriar}
									disabled={salvando}
								>
									{salvando ? (
										<>
											<Ic.Activity size={13} /> Salvando...
										</>
									) : (
										<>
											<Ic.Plus size={13} /> Criar produto
										</>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</PageContainer>
	);
}
