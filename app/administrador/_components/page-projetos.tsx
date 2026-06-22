"use client";
// app/administrador/_components/page-projetos.tsx
//
// [MUDANÇA] Reescrito para consumir /api/admin/projects em vez do SEED.
//
// [ESCOPO DELIBERADO] ProjectDetail (painel lateral de edição) não foi
// modificado — ele ainda lida com upload de foto via FileReader/base64,
// que conflita com o Vercel Blob. Tudo relacionado a foto fica pra quando
// atacarmos a galeria, pra ter o mesmo contexto num passo só.
//
// [MUDANÇA ARQUITETURAL] Estado de projetos saiu do pai (administrador/page.tsx)
// e veio pra cá — o componente gerencia o próprio ciclo de dado, igual ao
// que page-clients.tsx já faz. Props `projetos` e `setProjetos` foram removidas.

import { useState, useEffect, useCallback } from "react";
import { Ic } from "./lib/icons";
import { PageContainer } from "./lib/shell";
import type { Projeto, TipoCategoria, TipoStatusProjetos } from "./lib/types";
import { ProjectDetail } from "./components/project_detail";
import { ProjectCard } from "./components/project_card";

// ─── Tipos locais ──────────────────────────────────────────────────────────
interface ClienteOpcao {
	id: string;
	nome: string;
}

interface PageProjetosProps {
	accent: string;
}

// ─── Constantes ────────────────────────────────────────────────────────────
const CATEGORIAS: TipoCategoria[] = ["Comercial", "Residencial", "Saúde"];

const STATUS_OPCOES: TipoStatusProjetos[] = [
	"Pré-projeto",
	"Em projeto",
	"Aprovação",
	"Aprovado",
];

const FORM_VAZIO = {
	nome: "",
	categoria: "Comercial" as TipoCategoria,
	cidade: "",
	clienteId: "",
	prazo: "",
	area: "",
};

export function PageProjetos({ accent }: PageProjetosProps) {
	// ─── Estado principal ──────────────────────────────────────────────────
	const [projetos, setProjetos] = useState<Projeto[]>([]);
	const [loading, setLoading] = useState(true);
	const [erro, setErro] = useState<string | null>(null);

	// ─── Projeto aberto no ProjectDetail ──────────────────────────────────
	const [open, setOpen] = useState<string | null>(null);

	// ─── Filtro de categoria ───────────────────────────────────────────────
	const [filter, setFilter] = useState("todos");

	// ─── Estado do modal de criação ───────────────────────────────────────
	const [modalAberto, setModalAberto] = useState(false);
	const [form, setForm] = useState(FORM_VAZIO);
	const [salvando, setSalvando] = useState(false);
	const [erroForm, setErroForm] = useState<string | null>(null);
	const [clientes, setClientes] = useState<ClienteOpcao[]>([]);

	// ─── Estado de publicação inline ──────────────────────────────────────
	const [publicando, setPublicando] = useState<string | null>(null);
	const [deletando, setDeletando] = useState<string | null>(null);

	// ─── Busca projetos ────────────────────────────────────────────────────
	const carregarProjetos = useCallback(async () => {
		setLoading(true);
		setErro(null);
		try {
			const res = await fetch("/api/admin/projects/");
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			setProjetos(data.projetos);
		} catch (e: unknown) {
			setErro("Não foi possível carregar os projetos.");
			console.error("[PageProjetos] Erro ao carregar:", e);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		carregarProjetos();
	}, [carregarProjetos]);

	// ─── Busca clientes para o dropdown do modal ───────────────────────────
	// [CONCEITO] Dois fetches independentes no mesmo componente — cada um
	// tem seu próprio estado de loading/erro porque são recursos diferentes.
	// Clientes só são buscados quando o modal abre, não no mount inicial —
	// evita uma chamada de rede desnecessária se o usuário nunca clicar em
	// "Novo Projeto".
	const abrirModal = useCallback(async () => {
		setForm(FORM_VAZIO);
		setErroForm(null);
		setModalAberto(true);
		try {
			const res = await fetch("/api/admin/clients/");
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			setClientes(
				data.clientes.map((c: { id: string; nome: string }) => ({
					id: c.id,
					nome: c.nome,
				})),
			);
		} catch (e: unknown) {
			console.error("[PageProjetos] Erro ao carregar clientes:", e);
		}
	}, []);

	// ─── Criar projeto ─────────────────────────────────────────────────────
	const handleCriar = async () => {
		if (!form.nome.trim()) {
			setErroForm("Nome é obrigatório.");
			return;
		}
		if (!form.clienteId) {
			setErroForm("Selecione um cliente.");
			return;
		}
		if (!form.cidade.trim()) {
			setErroForm("Cidade é obrigatória.");
			return;
		}

		setSalvando(true);
		setErroForm(null);
		try {
			const res = await fetch("/api/admin/projects/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					nome: form.nome.trim(),
					categoria: form.categoria,
					cidade: form.cidade.trim(),
					clienteId: form.clienteId,
					prazo: form.prazo.trim() || undefined,
					area: form.area.trim() || undefined,
				}),
			});
			const data = await res.json();
			if (!res.ok) {
				setErroForm(data.error ?? "Erro ao criar projeto.");
				return;
			}
			setProjetos((prev) => [data.projeto, ...prev]);
			setModalAberto(false);
			setForm(FORM_VAZIO);
		} catch (e: unknown) {
			setErroForm("Falha na conexão.");
			console.error("[PageProjetos] Erro ao criar:", e);
		} finally {
			setSalvando(false);
		}
	};

	// ─── Salvar edições de campos (chamado pelo ProjectDetail) ─────────────
	// [ESCOPO] Persiste só campos de texto via PATCH. Foto/capa ficam pra
	// quando reescrevermos ProjectDetail junto com a galeria.
	const handleSave = async (projetoEditado: Projeto) => {
		try {
			const res = await fetch(`/api/admin/projects/${projetoEditado.id}/`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					nome: projetoEditado.nome,
					categoria: projetoEditado.categoria,
					cidade: projetoEditado.cidade,
					clienteId: projetoEditado.clienteId,
					prazo: projetoEditado.prazo,
					area: projetoEditado.area,
					status: projetoEditado.status,
				}),
			});
			const data = await res.json();
			if (!res.ok) {
				alert(data.error ?? "Erro ao salvar projeto.");
				return;
			}
			setProjetos((prev) =>
				prev.map((p) => (p.id === data.projeto.id ? data.projeto : p)),
			);
		} catch (e: unknown) {
			alert("Falha na conexão.");
			console.error("[PageProjetos] Erro ao salvar:", e);
		}
	};

	// ─── Publicar ──────────────────────────────────────────────────────────
	const handlePublicar = async (id: string) => {
		setPublicando(id);
		try {
			const res = await fetch(`/api/admin/projects/${id}/publish/`, {
				method: "POST",
			});
			const data = await res.json();
			if (!res.ok) {
				alert(data.error ?? "Erro ao publicar.");
				return;
			}
			setProjetos((prev) => prev.map((p) => (p.id === id ? data.projeto : p)));
		} catch (e: unknown) {
			alert("Falha na conexão.");
			console.error("[PageProjetos] Erro ao publicar:", e);
		} finally {
			setPublicando(null);
		}
	};

	// ─── Despublicar ───────────────────────────────────────────────────────
	const handleDespublicar = async (id: string) => {
		try {
			const res = await fetch(`/api/admin/projects/${id}/`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ visible: false }),
			});
			const data = await res.json();
			if (!res.ok) {
				alert(data.error ?? "Erro ao despublicar.");
				return;
			}
			setProjetos((prev) => prev.map((p) => (p.id === id ? data.projeto : p)));
		} catch (e: unknown) {
			alert("Falha na conexão.");
			console.error("[PageProjetos] Erro ao despublicar:", e);
		}
	};

	// ─── Deletar ───────────────────────────────────────────────────────────
	const handleDeletar = async (id: string) => {
		try {
			const res = await fetch(`/api/admin/projects/${id}/`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (!res.ok) {
				alert(data.error ?? "Erro ao apagar.");
				return;
			}
			setProjetos((prev) => prev.filter((p) => p.id !== id));
			if (open === id) setOpen(null);
		} catch (e: unknown) {
			alert("Falha na conexão.");
			console.error("[PageProjetos] Erro ao deletar:", e);
		} finally {
			setDeletando(null);
		}
	};

	// ─── updateOpen — mantém ProjectDetail atualizado após edição ─────────
	// [CONCEITO] O ProjectDetail chama onUpdate com um updater function
	// (Projeto) => Projeto, não com o projeto direto. Isso preserva o
	// padrão funcional: quem chama não precisa saber o estado atual —
	// só diz "dado o que tinha, retorna isso".
	const updateOpen = (updater: (p: Projeto) => Projeto) =>
		setProjetos((prev) => prev.map((p) => (p.id === open ? updater(p) : p)));

	const list = projetos.filter(
		(p) => filter === "todos" || p.categoria === filter,
	);

	const openProject =
		list.find((p) => p.id === open) || projetos.find((p) => p.id === open);

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
					<Ic.Activity size={14} /> Carregando projetos...
				</div>
			</PageContainer>
		);
	}

	if (erro) {
		return (
			<PageContainer>
				<div style={{ color: "var(--muted)", fontSize: 13 }}>
					{erro}{" "}
					<button className="btn-ghost" onClick={carregarProjetos}>
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
				{/* Filtros de categoria */}
				<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
					{["todos", ...CATEGORIAS].map((c) => (
						<button
							key={c}
							onClick={() => setFilter(c)}
							className={filter === c ? "" : "btn-ghost"}
							style={{
								padding: "7px 14px",
								background: filter === c ? accent : "transparent",
								color: filter === c ? "#fff" : "var(--fg-2)",
								border: `1px solid ${filter === c ? accent : "var(--border)"}`,
								fontSize: 12,
								fontWeight: 500,
								textTransform: "capitalize",
							}}
						>
							{c}
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
						{projetos.filter((p) => p.visible).length} publicados ·{" "}
						{projetos.length} total
					</span>
					<button
						className="btn-primary"
						style={{ whiteSpace: "nowrap" }}
						onClick={abrirModal}
					>
						<Ic.Plus size={14} /> Novo Projeto
					</button>
				</div>
			</div>

			{/* Grid de cards */}
			{list.length === 0 ? (
				<div style={{ color: "var(--muted)", fontSize: 13 }}>
					{filter === "todos"
						? "Nenhum projeto cadastrado ainda."
						: `Nenhum projeto na categoria "${filter}".`}
				</div>
			) : (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
						gap: 16,
					}}
				>
					{list.map((p) => (
						<div key={p.id} style={{ position: "relative" }}>
							<ProjectCard p={p} onOpen={() => setOpen(p.id)} accent={accent} />

							{/* Ações rápidas sobrepostas no card */}
							<div
								style={{
									position: "absolute",
									bottom: 52,
									right: 8,
									display: "flex",
									gap: 4,
								}}
							>
								{/* Publicar / Despublicar */}
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

								{/* Deletar com confirmação inline */}
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
										title="Apagar projeto"
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

			{/* ProjectDetail — mantido intacto, onSave agora chama PATCH real */}
			{openProject && (
				<ProjectDetail
					project={openProject}
					onClose={() => setOpen(null)}
					onUpdate={updateOpen}
					onSave={handleSave}
					accent={accent}
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
							width: 480,
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
							Novo projeto
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
									placeholder="Ex: Torre Belvedere"
									style={{ width: "100%", boxSizing: "border-box" }}
								/>
							</div>

							{/* Cliente */}
							<div>
								<label
									style={{
										fontSize: 11,
										color: "var(--muted)",
										display: "block",
										marginBottom: 4,
									}}
								>
									Cliente *
								</label>
								<select
									className="input"
									value={form.clienteId}
									onChange={(e) =>
										setForm((f) => ({ ...f, clienteId: e.target.value }))
									}
									style={{ width: "100%", boxSizing: "border-box" }}
								>
									<option value="">Selecione...</option>
									{clientes.map((c) => (
										<option key={c.id} value={c.id}>
											{c.nome}
										</option>
									))}
								</select>
							</div>

							{/* Categoria + Cidade */}
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
										Categoria *
									</label>
									<select
										className="input"
										value={form.categoria}
										onChange={(e) =>
											setForm((f) => ({
												...f,
												categoria: e.target.value as TipoCategoria,
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
										Cidade *
									</label>
									<input
										className="input"
										value={form.cidade}
										onChange={(e) =>
											setForm((f) => ({ ...f, cidade: e.target.value }))
										}
										placeholder="Ex: Porto Alegre"
										style={{ width: "100%", boxSizing: "border-box" }}
									/>
								</div>
							</div>

							{/* Prazo + Área */}
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
										Prazo
									</label>
									<input
										className="input"
										value={form.prazo}
										onChange={(e) =>
											setForm((f) => ({ ...f, prazo: e.target.value }))
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
										Área
									</label>
									<input
										className="input"
										value={form.area}
										onChange={(e) =>
											setForm((f) => ({ ...f, area: e.target.value }))
										}
										placeholder="Ex: 4.200 m²"
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
											<Ic.Plus size={13} /> Criar projeto
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
