// page-projetos.tsx
import { useState } from "react";
import { Ic } from "./lib/icons";
import { PageContainer } from "./lib/shell";
import type { Projeto } from "./lib/types";
import { ProjectDetail } from "./components/project_detail";
import { ProjectCard } from "./components/project_card";
// [MUDANÇA] Import da camada de persistência.
// O componente não sabe COMO os dados são salvos — só chama a função.
// Isso é o Repository Pattern: o contrato é estável, a implementação pode mudar.
import { saveProjects } from "./lib/persistence";

interface PageProjetosProps {
	accent: string;
	projetos: Projeto[];
	setProjetos: React.Dispatch<React.SetStateAction<Projeto[]>>;
}

export function PageProjetos({
	accent,
	projetos,
	setProjetos,
}: PageProjetosProps) {
	const [filter, setFilter] = useState("todos");
	const [open, setOpen] = useState<string | null>(null);
	// [MUDANÇA] Estado para feedback de salvamento — "idle" | "saving" | "saved" | "error"
	// Isso é chamado de "state machine" simples: o componente só pode estar
	// em um desses estados por vez.
	const [saveState, setSaveState] = useState<
		"idle" | "saving" | "saved" | "error"
	>("idle");

	const cats = ["todos", "Comercial", "Residencial", "Saúde"];
	const list = projetos.filter(
		(p) => filter === "todos" || p.categoria === filter,
	);

	const updateOpen = (updater: (p: Projeto) => Projeto) =>
		setProjetos((prev) => prev.map((p) => (p.id === open ? updater(p) : p)));

	const openProject =
		list.find((p) => p.id === open) || projetos.find((p) => p.id === open);

	// [MUDANÇA] Implementação de onSave.
	// Quando o usuário clica "Salvar alterações" no painel:
	// 1. Atualiza o estado React local (os cards refletem imediatamente)
	// 2. Persiste a lista inteira no arquivo JSON via API Route
	//
	// Por que salvar a lista inteira e não só o projeto editado?
	// Porque o arquivo JSON é uma snapshot completa. Salvar só um projeto
	// exigiria ler o arquivo, encontrar o item, atualizar, e regravar —
	// mais complexo e propenso a race conditions. Substituir tudo é mais simples
	// e seguro enquanto o volume de dados for pequeno.
	const handleSave = async (projetoEditado: Projeto) => {
		setSaveState("saving");

		// Cria a nova lista substituindo o projeto editado pelo atualizado.
		// `map` cria um novo array — nunca mutamos o array existente em React.
		const projetosAtualizados = projetos.map((p) =>
			p.id === projetoEditado.id ? projetoEditado : p,
		);

		// Atualiza o estado React — UI reflete a mudança imediatamente
		setProjetos(projetosAtualizados);

		// Persiste no arquivo JSON
		const result = await saveProjects(projetosAtualizados);

		if (result.ok) {
			setSaveState("saved");
			// Volta para idle após 2 segundos para o feedback desaparecer
			setTimeout(() => setSaveState("idle"), 2000);
		} else {
			setSaveState("error");
			console.error("[PageProjetos] Falha ao salvar:", result.error);
		}
	};

	return (
		<PageContainer>
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
				<div style={{ display: "flex", gap: 8 }}>
					{cats.map((c) => (
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
					{/* Feedback de salvamento */}
					{saveState === "saving" && (
						<span style={{ fontSize: 12, color: "var(--muted)" }}>
							Salvando...
						</span>
					)}
					{saveState === "saved" && (
						<span style={{ fontSize: 12, color: "var(--success)" }}>
							✓ Salvo
						</span>
					)}
					{saveState === "error" && (
						<span style={{ fontSize: 12, color: "var(--danger, red)" }}>
							Erro ao salvar
						</span>
					)}
					<button className="btn-ghost" style={{ whiteSpace: "nowrap" }}>
						<Ic.Filter size={14} /> Filtros
					</button>
					<button className="btn-primary" style={{ whiteSpace: "nowrap" }}>
						<Ic.Plus size={14} /> Novo Projeto
					</button>
				</div>
			</div>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
					gap: 16,
				}}
			>
				{list.map((p) => (
					<ProjectCard
						key={p.id}
						p={p}
						onOpen={() => setOpen(p.id)}
						accent={accent}
					/>
				))}
			</div>

			{openProject && (
				<ProjectDetail
					project={openProject}
					onClose={() => setOpen(null)}
					onUpdate={updateOpen}
					// [MUDANÇA] onSave agora está conectado — antes estava faltando.
					// handleSave recebe o projeto editado, atualiza o estado React
					// e persiste no JSON via API Route.
					onSave={handleSave}
					accent={accent}
				/>
			)}
		</PageContainer>
	);
}
