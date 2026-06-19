import { Projeto, TipoStatusProjetos } from "../lib/types";
import { Ic } from "../lib/icons";
import { useEffect, useState } from "react";

interface ProjectCardProps {
	p: Projeto;
	onOpen: () => void;
	accent: string;
}

interface StatusChipProps {
	s: TipoStatusProjetos;
}

function StatusChip({ s }: StatusChipProps) {
	const map = {
		"Pré-projeto": "",
		"Em projeto": "red",
		Aprovação: "warn",
		Aprovado: "green", // mesma convenção já usada em product_card.tsx e page-propostas.tsx
	};
	return <span className={"chip " + (map[s] || "")}>{s}</span>;
}

export function ProjectCard({ p, onOpen, accent }: ProjectCardProps) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [backgroundStyle, setBackgroundStyle] = useState({});

	useEffect(() => {
		// 1. Cria uma nova imagem na memória
		const img = new Image();
		img.src = p.capa as string;

		// 2. Espera o carregamento da URL
		img.onload = () => {
			setBackgroundStyle({
				aspectRatio: "16/9",
				background: `url(${p.capa}) center/cover`,
				position: "relative",
				borderBottom: "1px solid var(--border)",
			});
		};
		setIsLoaded(true);
	}, [p.capa]);

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
			{isLoaded && (
				<div
					style={{
						...backgroundStyle,
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
						<Ic.Image size={10} /> {p.photos?.length ?? 0}
					</span>
				</div>
			)}
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
