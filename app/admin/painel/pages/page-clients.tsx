"use client";
// app/administrador/_components/page-clients.tsx

import { useState, useEffect, useCallback } from "react";
import { PageContainer } from "../lib/shell";
import { Ic } from "../lib/icons";
import type {
	Cliente,
	CategoriaCliente,
} from "@/lib/repositories/admin/admin-clients-repository";
import type { LogoEntry } from "@/lib/utils/logo-resolver";
import Image from "next/image";
import { useTheme } from "next-themes";

interface PageClientesProps {
	accent: string;
}

const CATEGORIAS: CategoriaCliente[] = [
	"Construção",
	"Arquitetura",
	"Varejo",
	"Saúde",
	"Educação",
];

const FORM_VAZIO = {
	nome: "",
	categoria: "Construção" as CategoriaCliente,
	contato: "",
	siteUrl: "",
};

// ─── Logo do cliente ──────────────────────────────────────────────────────
// Mesmo padrão de clients-grid.tsx na página pública:
// logoMap vem do servidor (API route), useTheme escolhe light/dark.
function ClienteLogo({
	nome,
	logoMap,
}: {
	nome: string;
	logoMap: Record<string, LogoEntry>;
}) {
	const { resolvedTheme } = useTheme();
	const isDark = resolvedTheme === "dark";
	const entry = logoMap[nome];
	const src = entry
		? isDark
			? (entry.dark ?? entry.light)
			: (entry.light ?? entry.dark)
		: null;

	const initials = nome
		.split(" ")
		.filter((w) => w.length > 1)
		.slice(0, 2)
		.map((w) => w[0].toUpperCase())
		.join("");

	if (!src) {
		return (
			<div
				style={{
					width: 48,
					height: 48,
					background: "var(--bg-2)",
					border: "1px solid var(--border)",
					display: "grid",
					placeItems: "center",
					fontSize: 13,
					fontWeight: 700,
					color: "var(--primary)",
					flexShrink: 0,
				}}
			>
				{initials}
			</div>
		);
	}

	return (
		<div
			style={{
				width: 48,
				height: 48,
				background: "var(--bg-2)",
				border: "1px solid var(--border)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexShrink: 0,
				padding: 6,
			}}
		>
			<Image
				src={src}
				alt={`Logo ${nome}`}
				width={40}
				height={40}
				style={{ objectFit: "contain", maxWidth: 40, maxHeight: 40 }}
			/>
		</div>
	);
}

export function PageClientes({ accent }: PageClientesProps) {
	const [clientes, setClientes] = useState<Cliente[]>([]);
	const [logoMap, setLogoMap] = useState<Record<string, LogoEntry>>({});
	const [loading, setLoading] = useState(true);
	const [erro, setErro] = useState<string | null>(null);
	const [busca, setBusca] = useState("");
	const [modalAberto, setModalAberto] = useState(false);
	const [form, setForm] = useState(FORM_VAZIO);
	const [salvando, setSalvando] = useState(false);
	const [erroForm, setErroForm] = useState<string | null>(null);
	const [deletando, setDeletando] = useState<string | null>(null);

	const carregarClientes = useCallback(async () => {
		setLoading(true);
		setErro(null);
		try {
			const res = await fetch("/admin/api/admin/clients/");
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			setClientes(data.clientes ?? []);
			setLogoMap(data.logoMap ?? {});
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

	const handleCriar = async () => {
		if (!form.nome.trim()) {
			setErroForm("Nome é obrigatório.");
			return;
		}
		setSalvando(true);
		setErroForm(null);
		try {
			const res = await fetch("/admin/api/admin/clients/", {
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
			setClientes((prev) => [data.cliente, ...prev]);
			setModalAberto(false);
			setForm(FORM_VAZIO);
		} catch (e: unknown) {
			setErroForm("Falha na conexão.");
		} finally {
			setSalvando(false);
		}
	};

	const handleToggleVisible = async (cliente: Cliente) => {
		try {
			const res = await fetch(`/admin/api/admin/clients/${cliente.id}/`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ visible: !cliente.visible }),
			});
			const data = await res.json();
			if (!res.ok) {
				alert(data.error ?? "Erro ao atualizar.");
				return;
			}
			setClientes((prev) =>
				prev.map((c) => (c.id === cliente.id ? data.cliente : c)),
			);
		} catch {
			alert("Falha na conexão.");
		}
	};

	const handleDeletar = async (id: string) => {
		try {
			const res = await fetch(`/admin/api/admin/clients/${id}/`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (!res.ok) {
				alert(data.error ?? "Erro ao apagar.");
				return;
			}
			setClientes((prev) => prev.filter((c) => c.id !== id));
		} catch {
			alert("Falha na conexão.");
		} finally {
			setDeletando(null);
		}
	};

	// Filtro por busca + ordem alfabética
	const list = clientes
		.filter((c) => {
			if (!busca.trim()) return true;
			const t = busca.toLowerCase();
			return (
				c.nome.toLowerCase().includes(t) ||
				c.categoria.toLowerCase().includes(t)
			);
		})
		.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

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
					<Ic.Activity size={14} /> Carregando clientes...
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

	return (
		<PageContainer>
			{/* Cabeçalho */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 12,
					marginBottom: 18,
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						gap: 14,
						flexWrap: "wrap",
					}}
				>
					<span style={{ fontSize: 12, color: "var(--muted)" }}>
						{clientes.filter((c) => c.visible).length} publicados ·{" "}
						{list.length}/{clientes.length}
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
						<Ic.Plus size={14} /> Adicionar cliente
					</button>
				</div>

				{/* Campo de busca */}
				<div style={{ position: "relative", maxWidth: 380 }}>
					<Ic.Search
						size={13}
						style={{
							position: "absolute",
							left: 10,
							top: "50%",
							transform: "translateY(-50%)",
							color: "var(--muted)",
							pointerEvents: "none",
						}}
					/>
					<input
						className="input input-with-icon"
						placeholder="Buscar por nome ou categoria..."
						value={busca}
						onChange={(e) => setBusca(e.target.value)}
						style={{ width: "100%", boxSizing: "border-box", fontSize: 12 }}
					/>
					{busca && (
						<button
							onClick={() => setBusca("")}
							style={{
								position: "absolute",
								right: 8,
								top: "50%",
								transform: "translateY(-50%)",
								background: "none",
								border: "none",
								cursor: "pointer",
								color: "var(--muted)",
								padding: 2,
							}}
						>
							<Ic.X size={12} />
						</button>
					)}
				</div>
			</div>

			{/* Grid de cards */}
			{list.length === 0 ? (
				<div style={{ color: "var(--muted)", fontSize: 13 }}>
					{busca
						? `Nenhum cliente encontrado para "${busca}".`
						: "Nenhum cliente cadastrado ainda."}
				</div>
			) : (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
						gap: 14,
					}}
				>
					{list.map((c) => (
						<div
							key={c.id}
							className="card-pop"
							style={{ padding: 0, overflow: "hidden" }}
						>
							{/* Corpo do card */}
							<div style={{ padding: "16px 16px 12px" }}>
								{/* Logo + nome */}
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: 12,
										marginBottom: 10,
									}}
								>
									<ClienteLogo nome={c.nome} logoMap={logoMap} />
									<div style={{ minWidth: 0 }}>
										<div
											style={{
												fontSize: 13,
												fontWeight: 700,
												lineHeight: 1.3,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
												color: "var(--fg)",
											}}
										>
											{c.nome}
										</div>
										<div
											style={{
												fontSize: 11,
												color: "var(--muted)",
												marginTop: 1,
											}}
										>
											{c.categoria}
										</div>
									</div>
								</div>

								{/* Status */}
								<span
									className={"chip " + (c.visible ? "green" : "")}
									style={{ fontSize: 10 }}
								>
									{c.visible ? "Publicado" : "Não publicado"}
								</span>
							</div>

							{/* Rodapé */}
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									padding: "8px 14px",
									borderTop: "1px solid var(--border)",
									fontSize: 11,
									color: "var(--muted)",
								}}
							>
								<span>{c.totalProjetos} projetos</span>
								<div style={{ display: "flex", gap: 4 }}>
									{/* Publicar / Despublicar */}
									<button
										className="btn-ghost"
										style={{ padding: "3px 7px" }}
										title={c.visible ? "Despublicar" : "Publicar no site"}
										onClick={() => handleToggleVisible(c)}
									>
										{c.visible ? (
											<span style={{ fontSize: 10, fontWeight: 600 }}>✕</span>
										) : (
											<Ic.Eye size={11} />
										)}
									</button>

									{/* Deletar com confirmação */}
									{deletando === c.id ? (
										<>
											<button
												className="btn-ghost"
												style={{
													padding: "3px 7px",
													fontSize: 10,
													color: "var(--destructive, #c00)",
												}}
												onClick={() => handleDeletar(c.id)}
											>
												Confirmar
											</button>
											<button
												className="btn-ghost"
												style={{ padding: "3px 7px", fontSize: 10 }}
												onClick={() => setDeletando(null)}
											>
												Cancelar
											</button>
										</>
									) : (
										<button
											className="btn-ghost"
											style={{ padding: "3px 7px" }}
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

						<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
