"use client";
// app/administrador/_components/page-clients.tsx
//
// [MUDANÇA] Reescrito para consumir /api/admin/clients em vez do SEED.
//
// [CONCEITO] Por que "use client" aqui?
// Este componente usa useState, useEffect e handlers de evento (onClick,
// onChange) — tudo isso só existe no browser. Server Components não têm
// estado nem interatividade. A marca "use client" instrui o Next.js a
// incluir este arquivo no bundle do browser e hidratar após SSR.
//
// [CONCEITO] Por que fetch() em vez de import do repositório?
// Repositórios usam o módulo `pg` (Node.js) — ele não existe no browser.
// Server Components chamam o repositório diretamente. Client Components
// sempre passam por uma API Route (HTTP) como intermediário.
// Essa é a fronteira Server/Client que não pode ser cruzada diretamente.

import { useState, useEffect, useCallback } from "react";
import { PageContainer } from "./lib/shell";
import { Ic } from "./lib/icons";
import type {
	Cliente,
	CategoriaCliente,
} from "@/lib/repositories/admin/admin-clients-repository";

// [CONCEITO] Ic.Loader não existe no projeto — usando Ic.Activity como
// indicador visual de carregamento. Futuramente pode ser substituído por
// um spinner CSS puro (@keyframes rotate) sem depender de um novo ícone.

interface PageClientesProps {
	accent: string;
}

// ─── Categorias válidas — espelha o CHECK constraint do banco ─────────────
const CATEGORIAS: CategoriaCliente[] = [
	"Construção",
	"Arquitetura",
	"Varejo",
	"Saúde",
	"Educação",
];

// ─── Estado inicial do formulário de criação ──────────────────────────────
const FORM_VAZIO = {
	nome: "",
	categoria: "Construção" as CategoriaCliente,
	contato: "",
	siteUrl: "",
};

export function PageClientes({ accent }: PageClientesProps) {
	// ─── Estado principal ──────────────────────────────────────────────────
	const [clientes, setClientes] = useState<Cliente[]>([]);
	const [loading, setLoading] = useState(true);
	const [erro, setErro] = useState<string | null>(null);

	// ─── Estado do modal de criação ───────────────────────────────────────
	const [modalAberto, setModalAberto] = useState(false);
	const [form, setForm] = useState(FORM_VAZIO);
	const [salvando, setSalvando] = useState(false);
	const [erroForm, setErroForm] = useState<string | null>(null);

	// ─── Estado de confirmação de deleção ─────────────────────────────────
	const [deletando, setDeletando] = useState<string | null>(null); // id do cliente sendo deletado

	// ─── Busca a lista do banco ───────────────────────────────────────────
	// [CONCEITO] useCallback memoriza a função entre renders.
	// Sem useCallback, a função seria recriada a cada render, o que causaria
	// um loop infinito se estivesse no array de dependências de um useEffect.
	const carregarClientes = useCallback(async () => {
		setLoading(true);
		setErro(null);
		try {
			const res = await fetch("/api/admin/clients/");
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			setClientes(data.clientes);
		} catch (e: unknown) {
			setErro("Não foi possível carregar os clientes.");
			console.error("[PageClientes] Erro ao carregar:", e);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		carregarClientes();
	}, [carregarClientes]);

	// ─── Criar cliente ─────────────────────────────────────────────────────
	const handleCriar = async () => {
		if (!form.nome.trim()) {
			setErroForm("Nome é obrigatório.");
			return;
		}
		setSalvando(true);
		setErroForm(null);
		try {
			const res = await fetch("/api/admin/clients/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					nome: form.nome.trim(),
					categoria: form.categoria,
					contato: form.contato.trim() || undefined,
					siteUrl: form.siteUrl.trim() || undefined,
				}),
			});
			const data = await res.json();
			if (!res.ok) {
				setErroForm(data.error ?? "Erro ao criar cliente.");
				return;
			}
			// Adiciona o novo cliente no topo sem recarregar tudo
			setClientes((prev) => [data.cliente, ...prev]);
			setModalAberto(false);
			setForm(FORM_VAZIO);
		} catch (e: unknown) {
			setErroForm("Falha na conexão.");
			console.error("[PageClientes] Erro ao criar:", e);
		} finally {
			setSalvando(false);
		}
	};

	// ─── Publicar / despublicar ────────────────────────────────────────────
	const handleToggleVisible = async (cliente: Cliente) => {
		try {
			const res = await fetch(`/api/admin/clients/${cliente.id}/`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ visible: !cliente.visible }),
			});
			const data = await res.json();
			if (!res.ok) {
				alert(data.error ?? "Erro ao atualizar cliente.");
				return;
			}
			setClientes((prev) =>
				prev.map((c) => (c.id === cliente.id ? data.cliente : c)),
			);
		} catch (e: unknown) {
			alert("Falha na conexão.");
			console.error("[PageClientes] Erro ao atualizar:", e);
		}
	};

	// ─── Deletar ───────────────────────────────────────────────────────────
	const handleDeletar = async (id: string) => {
		try {
			const res = await fetch(`/api/admin/clients/${id}/`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (!res.ok) {
				alert(data.error ?? "Erro ao apagar cliente.");
				return;
			}
			setClientes((prev) => prev.filter((c) => c.id !== id));
		} catch (e: unknown) {
			alert("Falha na conexão.");
			console.error("[PageClientes] Erro ao deletar:", e);
		} finally {
			setDeletando(null);
		}
	};

	// ─── Render: estados de loading e erro ────────────────────────────────
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
					<Ic.Activity size={14} />
					Carregando clientes...
				</div>
			</PageContainer>
		);
	}

	if (erro) {
		return (
			<PageContainer>
				<div style={{ color: "var(--muted)", fontSize: 13 }}>
					{erro}{" "}
					<button className="btn-ghost" onClick={carregarClientes}>
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
					marginBottom: 20,
					gap: 12,
					flexWrap: "wrap",
					alignItems: "center",
				}}
			>
				<div className="label-eyebrow">
					— {clientes.filter((c) => c.visible).length} publicados ·{" "}
					{clientes.length} total
				</div>
				<button
					className="btn-primary"
					style={{ whiteSpace: "nowrap", flexShrink: 0 }}
					onClick={() => {
						setForm(FORM_VAZIO);
						setErroForm(null);
						setModalAberto(true);
					}}
				>
					<Ic.Plus size={14} /> Adicionar cliente
				</button>
			</div>

			{/* Grid de cards */}
			{clientes.length === 0 ? (
				<div style={{ color: "var(--muted)", fontSize: 13 }}>
					Nenhum cliente cadastrado ainda.
				</div>
			) : (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
						gap: 14,
					}}
				>
					{clientes.map((c) => (
						<div key={c.id} className="card-pop" style={{ padding: 18 }}>
							{/* Avatar com iniciais */}
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
								style={{
									fontSize: 11,
									color: "var(--muted)",
									marginBottom: 4,
								}}
							>
								{c.categoria}
							</div>

							{/* Badge de visibilidade */}
							<div style={{ marginBottom: 12 }}>
								<span
									className={"chip " + (c.visible ? "green" : "")}
									style={{ fontSize: 10 }}
								>
									{c.visible ? "Publicado" : "Não publicado"}
								</span>
							</div>

							{/* Rodapé do card */}
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									fontSize: 10,
									color: "var(--muted)",
									borderTop: "1px solid var(--border)",
									paddingTop: 10,
									gap: 6,
								}}
							>
								<span>{c.totalProjetos} projetos</span>
								<div style={{ display: "flex", gap: 4 }}>
									{/* Publicar / Despublicar */}
									<button
										className="btn-ghost"
										style={{ padding: "2px 6px", fontSize: 10 }}
										title={c.visible ? "Despublicar" : "Publicar no site"}
										onClick={() => handleToggleVisible(c)}
									>
										{c.visible ? (
											<span style={{ fontSize: 10, fontWeight: 600 }}>✕</span>
										) : (
											<Ic.Eye size={11} />
										)}
									</button>

									{/* Deletar — com confirmação inline */}
									{deletando === c.id ? (
										<>
											<button
												className="btn-ghost"
												style={{
													padding: "2px 6px",
													fontSize: 10,
													color: "var(--destructive, #c00)",
												}}
												onClick={() => handleDeletar(c.id)}
											>
												Confirmar
											</button>
											<button
												className="btn-ghost"
												style={{ padding: "2px 6px", fontSize: 10 }}
												onClick={() => setDeletando(null)}
											>
												Cancelar
											</button>
										</>
									) : (
										<button
											className="btn-ghost"
											style={{ padding: "2px 6px", fontSize: 10 }}
											title="Apagar cliente"
											onClick={() => setDeletando(c.id)}
										>
											<Ic.Trash size={11} />
										</button>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
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
							width: 420,
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
							Novo cliente
							<button
								className="btn-ghost"
								style={{ padding: "4px 8px" }}
								onClick={() => setModalAberto(false)}
							>
								<Ic.X size={14} />
							</button>
						</div>

						{/* Campos do formulário */}
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
									placeholder="Ex: Grupo Plaenge"
									style={{ width: "100%", boxSizing: "border-box" }}
								/>
							</div>

							{/* Categoria */}
							<div>
								<label
									style={{
										fontSize: 11,
										color: "var(--muted)",
										display: "block",
										marginBottom: 4,
									}}
								>
									Categoria *
								</label>
								<select
									className="input"
									value={form.categoria}
									onChange={(e) =>
										setForm((f) => ({
											...f,
											categoria: e.target.value as CategoriaCliente,
										}))
									}
									style={{ width: "100%", boxSizing: "border-box" }}
								>
									{CATEGORIAS.map((cat) => (
										<option key={cat} value={cat}>
											{cat}
										</option>
									))}
								</select>
							</div>

							{/* Email de contato */}
							<div>
								<label
									style={{
										fontSize: 11,
										color: "var(--muted)",
										display: "block",
										marginBottom: 4,
									}}
								>
									E-mail de contato
								</label>
								<input
									className="input"
									type="email"
									value={form.contato}
									onChange={(e) =>
										setForm((f) => ({ ...f, contato: e.target.value }))
									}
									placeholder="contato@empresa.com.br"
									style={{ width: "100%", boxSizing: "border-box" }}
								/>
							</div>

							{/* Site */}
							<div>
								<label
									style={{
										fontSize: 11,
										color: "var(--muted)",
										display: "block",
										marginBottom: 4,
									}}
								>
									Site
								</label>
								<input
									className="input"
									type="url"
									value={form.siteUrl}
									onChange={(e) =>
										setForm((f) => ({ ...f, siteUrl: e.target.value }))
									}
									placeholder="https://..."
									style={{ width: "100%", boxSizing: "border-box" }}
								/>
							</div>

							{/* Erro do formulário */}
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

							{/* Botões */}
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
											<Ic.Plus size={13} /> Criar cliente
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
