import { Projeto, TipoStatusProjetos } from "../lib/types";
import { Ic } from "../lib/icons";

interface ProjectCardProps {
	p: Projeto;
	onOpen: () => void;
	accent: string;
}

interface StatusChipProps {
	s: TipoStatusProjetos;
}

function StatusChip({ s }: StatusChipProps) {
	const map = { "Em projeto": "red", Aprovação: "warn", "Pré-projeto": "" };
	return <span className={"chip " + (map[s] || "")}>{s}</span>;
}

export function ProjectCard({ p, onOpen, accent }: ProjectCardProps) {
	return (
		<button
			onClick={onOpen}
			className="card-pop"
			style={{
				padding: 0,
				display: "flex",
				flexDirection: "column",
				textAlign: "left",
				cursor: "pointer",
				transition: "transform .1s, box-shadow .1s",
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.transform = "translate(-1px,-1px)";
				e.currentTarget.style.boxShadow = "4px 4px 0 0 #000";
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.transform = "";
				e.currentTarget.style.boxShadow = "";
			}}
		>
			<div
				style={{
					aspectRatio: "16/9",
					background: p.capa ? `url(${p.capa}) center/cover` : "var(--bg-3)",
					position: "relative",
					borderBottom: "1px solid var(--border)",
				}}
			>
				{!p.capa && (
					<div
						style={{
							position: "absolute",
							inset: 0,
							display: "grid",
							placeItems: "center",
							color: "var(--muted-2)",
							flexDirection: "column",
							gap: 6,
						}}
					>
						<Ic.Image size={28} stroke={1.4} />
						<span style={{ fontSize: 10, letterSpacing: "0.1em" }}>
							SEM CAPA · CLIQUE PARA ENVIAR
						</span>
					</div>
				)}
				<span
					style={{
						position: "absolute",
						top: 8,
						left: 8,
						fontSize: 10,
						fontWeight: 600,
						background: "var(--primary)",
						color: "#fff",
						padding: "3px 8px",
					}}
				>
					{p.categoria.toUpperCase()}
				</span>
				<span
					style={{
						position: "absolute",
						top: 8,
						right: 8,
						fontSize: 10,
						background: "rgba(0,0,0,0.7)",
						color: "#fff",
						padding: "3px 8px",
						display: "flex",
						alignItems: "center",
						gap: 4,
					}}
				>
					<Ic.Image size={10} /> {p.fotos}
				</span>
			</div>
			<div style={{ padding: 14 }}>
				<div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
					{p.nome}
				</div>
				<div
					style={{
						fontSize: 11,
						color: "var(--muted)",
						marginBottom: 10,
						display: "flex",
						alignItems: "center",
						gap: 6,
					}}
				>
					<Ic.MapPin size={11} /> {p.cidade}
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<StatusChip s={p.status} />
					<span style={{ fontSize: 10, color: "var(--muted)" }}>{p.area}</span>
				</div>
			</div>
		</button>
	);
}
