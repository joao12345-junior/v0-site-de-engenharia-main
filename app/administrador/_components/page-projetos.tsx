// Projetos Futuros — listagem + upload de fotos
import { useState } from "react";
import { Ic } from "./lib/icons";
import { PageContainer } from "./lib/shell";
import type { Projeto } from "./lib/types";
import { ProjectDetail } from "./components/project_detail";
import { ProjectCard } from "./components/project_card";
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
	const cats = ["todos", "Comercial", "Residencial", "Saúde"];
	const list = projetos.filter(
		(p) => filter === "todos" || p.categoria === filter,
	);

	const updateOpen = (updater: (p: Projeto) => Projeto) =>
		setProjetos((prev) => prev.map((p) => (p.id === open ? updater(p) : p)));
	const openProject =
		list.find((p) => p.id === open) || projetos.find((p) => p.id === open);

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
				<div className="filter-row" style={{ display: "flex", gap: 8 }}>
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
				<div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
					<button className="btn-ghost" style={{ whiteSpace: "nowrap" }}>
						<Ic.Filter size={14} /> Filtros
					</button>
					<button className="btn-primary" style={{ whiteSpace: "nowrap" }}>
						<Ic.Plus size={14} /> Novo Projeto
					</button>
				</div>
			</div>

			<div
				className="grid-cards"
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
					accent={accent}
				/>
			)}
		</PageContainer>
	);
}
