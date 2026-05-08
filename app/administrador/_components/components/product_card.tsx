import { Produto } from "../lib/types";
import { Ic } from "../lib/icons";

interface ProductCardProps {
	p: Produto;
	onOpen: () => void;
}

export function ProductCard({ p, onOpen }: ProductCardProps) {
	const tipoIcon = {
		Kit: Ic.Box,
		Sistema: Ic.Bolt,
		Equipamento: Ic.Cog,
		Componente: Ic.Tag,
	};
	const Icone = tipoIcon[p.tipo] || Ic.Box;
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
					aspectRatio: "4/3",
					background: p.capa ? `url(${p.capa}) center/cover` : "var(--bg-3)",
					position: "relative",
					borderBottom: "1px solid var(--border)",
					display: "grid",
					placeItems: "center",
				}}
			>
				{!p.capa && (
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: 8,
							color: "var(--muted-2)",
						}}
					>
						<Icone size={42} stroke={1.2} />
						<span style={{ fontSize: 10, letterSpacing: "0.1em" }}>
							{p.tipo.toUpperCase()}
						</span>
					</div>
				)}
				<span
					style={{
						position: "absolute",
						top: 8,
						left: 8,
						fontSize: 10,
						fontFamily: "var(--font)",
						fontWeight: 600,
						background: "rgba(0,0,0,0.7)",
						color: "#fff",
						padding: "3px 8px",
						border: "1px solid var(--border-2)",
					}}
				>
					{p.sku}
				</span>
			</div>
			<div style={{ padding: 14 }}>
				<div
					style={{
						fontSize: 13,
						fontWeight: 700,
						marginBottom: 6,
						lineHeight: 1.3,
					}}
				>
					{p.nome}
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						fontSize: 11,
						color: "var(--muted)",
					}}
				>
					<span>Lançamento {p.lancamento}</span>
					<span
						className={
							"chip " +
							(p.status === "Aprovado"
								? "green"
								: p.status === "Protótipo"
									? "warn"
									: "")
						}
					>
						{p.status}
					</span>
				</div>
			</div>
		</button>
	);
}
