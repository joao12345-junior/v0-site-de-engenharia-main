"use client";
// app/administrador/_components/page-projetos.tsx

import { useState, useEffect, useCallback } from "react";
import { Ic } from "../lib/icons";
import { PageContainer } from "../lib/shell";
import type { Projeto, TipoCategoria } from "../lib/types";
import { ProjectDetail } from "../components/project_detail";
import { ProjectCard } from "../components/project_card";
import type { Cliente } from "@/lib/repositories/admin/admin-clients-repository";

interface PageProjetosProps {
	accent: string;
}

const CATEGORIAS: TipoCategoria[] = ["Comercial", "Residencial", "Saúde"];

const FORM_VAZIO = {
	nome: "",
	categoria: "Comercial" as TipoCategoria,
	cidade: "",
	clienteId: "",
};

export function PageProjetos({ accent }: PageProjetosProps) {
	const [projetos, setProjetos] = useState<Projeto[]>([]);
	const [clientes, setClientes] = useState<Cliente[]>([]);
	const [loading, setLoading] = useState(true);
	const [erro, setErro] = useState<string | null>(null);
	const [open, setOpen] = useState<string | null>(null);
	const [filter, setFilter] = useState("todos");
	const [modalAberto, setModalAberto] = useState(false);
	const [form, setForm] = useState(FORM_VAZIO);
	const [salvando, setSalvando] = useState(false);
	const [erroForm, setErroForm] = useState<string | null>(null);
	const [publicando, setPublicando] = useState<string | null>(null);
	const [deletando, setDeletando] = useState<string | null>(null);
	const [busca, setBusca] = useState<string>("");

	// [FIX] Um único fetch no mount — carrega projetos E clientes em paralelo.
	// Antes havia dois useEffect (carregarProjetos + carregarDados) ambos
	// disparando no mount, causando duplo fetch de projetos.
	const carregarDados = useCallback(async () => {
		setLoading(true);
		setErro(null);
		try {
			const [resP, resC] = await Promise.all([
				fetch("/admin/api/admin/projects/"),
				fetch("/admin/api/admin/clients/"),
			]);
			if (!resP.ok || !resC.ok) {
				throw new Error(`HTTP ${resP.ok ? resC.status : resP.status}`);
			}
			const [dataP, dataC] = await Promise.all([resP.json(), resC.json()]);
			setProjetos(dataP.projetos ?? []);
			setClientes(dataC.clientes ?? []);
		} catch (e) {
			setErro("Não foi possível carregar os dados.");
			console.error("[PageProjetos] Erro ao carregar:", e);
		} finally {
			setLoading(false);
		}
	}, []);

	// [FIX] Só uma chamada no mount
	useEffect(() => {
		carregarDados();
	}, [carregarDados]);

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
			const res = await fetch("/admin/api/admin/projects/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					nome: form.nome.trim(),
					categoria: form.categoria,
					cidade: form.cidade.trim(),
					clienteId: form.clienteId,
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

	const handleSave = async (projetoEditado: Projeto) => {
		try {
			const res = await fetch(
				`/admin/api/admin/projects/${projetoEditado.id}/`,
				{
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
						capa: projetoEditado.capa,
						visible: projetoEditado.visible,
					}),
				},
			);
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

	const handlePublicar = async (id: string) => {
		setPublicando(id);
		try {
			const res = await fetch(`/admin/api/admin/projects/${id}/publish/`, {
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
		} finally {
			setPublicando(null);
		}
	};

	const handleDespublicar = async (id: string) => {
		try {
			const res = await fetch(`/admin/api/admin/projects/${id}/`, {
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
		}
	};

	// const handleDeletar = async (id: string) => {
	// 	try {
	// 		const res = await fetch(`/api/admin/projects/${id}/`, {
	// 			method: "DELETE",
	// 		});
	// 		const data = await res.json();
	// 		if (!res.ok) {
	// 			alert(data.error ?? "Erro ao apagar.");
	// 			return;
	// 		}
	// 		setProjetos((prev) => prev.filter((p) => p.id !== id));
	// 		if (open === id) setOpen(null);
	// 	} catch (e: unknown) {
	// 		alert("Falha na conexão.");
	// 	} finally {
	// 		setDeletando(null);
	// 	}
	// };

	const updateOpen = (updater: (p: Projeto) => Projeto) =>
		setProjetos((prev) => prev.map((p) => (p.id === open ? updater(p) : p)));

	const list = projetos
		.filter((p) => filter === "todos" || p.categoria === filter)
		.filter((p) => {
			if (!busca.trim()) return true;
			const termo = busca.toLowerCase();
			return (
				p.nome.toLowerCase().includes(termo) ||
				p.cidade.toLowerCase().includes(termo) ||
				p.cliente.toLowerCase().includes(termo)
			);
		})
		// [CONCEITO] localeCompare em vez de < > para strings:
		// "localeCompare" respeita acentuação do português — "Ângela" vem antes
		// de "Bruno", não depois. Comparação simples com < > trata letras acentuadas
		// como caracteres especiais e quebra a ordem esperada.
		.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

	const openProject =
		list.find((p) => p.id === open) || projetos.find((p) => p.id === open);

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
					<button className="btn-ghost" onClick={carregarDados}>
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
				{/* Linha 1: filtros de categoria + contador + botão novo */}
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						gap: 14,
						flexWrap: "wrap",
					}}
				>
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
							{list.length}/{projetos.length}
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
							<Ic.Plus size={14} /> Novo Projeto
						</button>
					</div>
				</div>

				{/* Linha 2: campo de busca */}
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
						placeholder="Buscar por nome, cidade ou cliente..."
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
					{filter === "todos"
						? "Nenhum projeto cadastrado ainda."
						: `Nenhum projeto na categoria "${filter}".`}
				</div>
			) : (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
						gap: 16,
					}}
				>
					{list.map((p) => (
						// [FIX] Sem wrapper div com position:relative e botões externos.
						// As ações agora são passadas como props pro ProjectCard,
						// que as renderiza como hover overlay dentro da área de imagem.
						<ProjectCard
							key={p.id}
							p={p}
							onOpen={() => setOpen(p.id)}
							accent={accent}
							onPublish={
								p.status === "Aprovado" ? () => handlePublicar(p.id) : undefined
							}
							onUnpublish={
								p.visible ? () => handleDespublicar(p.id) : undefined
							}
							onDelete={() => setDeletando(deletando === p.id ? null : p.id)}
							deletando={deletando === p.id}
							onCancelDelete={() => setDeletando(null)}
							isPublishing={publicando === p.id}
						/>
					))}
				</div>
			)}

			{/* ProjectDetail */}
			{openProject && (
				<ProjectDetail
					project={openProject}
					clientes={clientes}
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
