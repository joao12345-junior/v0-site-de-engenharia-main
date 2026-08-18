// app/administrador/_components/components/project_card.tsx
//
// [MUDANÇA] Redesenho completo do card pra resolver desalinhamento.
//
// [CAUSA RAIZ DO BUG ANTERIOR]
// O card usava useEffect + new Image() pra detectar quando a foto carregou,
// e só então aplicava aspectRatio: "16/9" via setState.
// Isso significava que no primeiro render o container de imagem tinha altura 0,
// causando cards com alturas completamente diferentes entre si.
//
// [SOLUÇÃO] background-image via CSS inline, sem JavaScript.
// O browser já sabe aplicar background-image — não precisa de um Image() em JS
// pra "pré-carregar" antes de definir o tamanho. aspectRatio é aplicado
// imediatamente no primeiro render, todos os cards têm a mesma estrutura.
//
// [MUDANÇA ARQUITETURAL] Botões de ação (publicar, deletar) integrados ao card
// como hover overlay em vez de serem posicionados externamente com bottom: 52px.
// O bottom: 52 era calculado manualmente e quebrava quando a altura do card variava.
// Agora os botões aparecem como overlay na área da imagem ao hover.

import { Projeto, TipoStatusProjetos } from "../lib/types";
import { Ic } from "../lib/icons";

interface ProjectCardProps {
	p: Projeto;
	onOpen: () => void;
	accent: string;
	// [MUDANÇA] Ações integradas ao card — não mais posicionadas externamente
	onPublish?: () => void;
	onUnpublish?: () => void;
	onDelete?: () => void;
	deletando?: boolean;
	onCancelDelete?: () => void;
	isPublishing?: boolean;
}

function StatusChip({ s }: { s: TipoStatusProjetos }) {
	const map: Record<TipoStatusProjetos, string> = {
		"Pré-projeto": "",
		"Em projeto": "red",
		Aprovação: "warn",
		Aprovado: "green",
	};
	return <span className={"chip " + (map[s] || "")}>{s}</span>;
}

export function ProjectCard({
	p,
	onOpen,
	accent,
	onPublish,
	onUnpublish,
	onDelete,
	deletando,
	onCancelDelete,
	isPublishing,
}: ProjectCardProps) {
	return (
		<div
			className="card-pop"
			style={{
				padding: 0,
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
				// [CONCEITO] Sem position: relative aqui — o wrapper externo em
				// page-projetos.tsx não precisa mais existir. O card é autossuficiente.
			}}
		>
			{/* ── Área de imagem — sempre aspectRatio: 16/9 ── */}
			<div
				style={{
					position: "relative",
					aspectRatio: "16 / 9",
					background: p.capa
						? `url(${p.capa}) center/cover no-repeat`
						: "var(--bg-2)",
					borderBottom: "1px solid var(--border)",
					flexShrink: 0,
					cursor: "pointer",
				}}
				onClick={onOpen}
				// [CONCEITO] onMouseEnter/Leave no container de imagem em vez do card inteiro
				// Isso evita que o hover overlay apareça quando o mouse está no texto abaixo
			>
				{/* Placeholder quando sem capa */}
				{!p.capa && (
					<div
						style={{
							position: "absolute",
							inset: 0,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							gap: 6,
							color: "var(--muted)",
						}}
					>
						<Ic.Image size={24} stroke={1.4} />
						<span
							style={{ fontSize: 10, letterSpacing: "0.08em", opacity: 0.6 }}
						>
							SEM CAPA
						</span>
					</div>
				)}

				{/* Badge de categoria */}
				<span
					style={{
						position: "absolute",
						top: 8,
						left: 8,
						fontSize: 10,
						fontWeight: 700,
						background: accent,
						color: "#fff",
						padding: "2px 8px",
						letterSpacing: "0.04em",
					}}
				>
					{p.categoria.toUpperCase()}
				</span>

				{/* Contador de fotos */}
				<span
					style={{
						position: "absolute",
						top: 8,
						right: 8,
						fontSize: 10,
						background: "rgba(0,0,0,0.65)",
						color: "#fff",
						padding: "2px 6px",
						display: "flex",
						alignItems: "center",
						gap: 4,
					}}
				>
					<Ic.Image size={10} /> {p.photos?.length ?? 0}
				</span>

				{/* ── Overlay de ações — aparece no hover da área de imagem ── */}
				{/*
				 * [CONCEITO] CSS group hover sem Tailwind:
				 * Usamos onMouseEnter/Leave no container pai pra controlar
				 * a visibilidade do overlay filho via state — ou simplesmente
				 * CSS :hover via className. Aqui optei por opacity via CSS
				 * pra não adicionar mais useState no componente.
				 *
				 * A classe "card-actions-overlay" está definida em style.css.
				 */}
				{(onPublish || onUnpublish || onDelete) && (
					<div className="card-actions-overlay">
						<div
							style={{
								display: "flex",
								gap: 4,
								background: "rgba(0,0,0,0.6)",
								backdropFilter: "blur(4px)",
								padding: "4px 6px",
								borderRadius: 4,
							}}
						>
							{deletando ? (
								<>
									<button
										className="btn-ghost"
										style={{
											padding: "4px 10px",
											fontSize: 11,
											color: "#ff6b6b",
										}}
										onClick={(e) => {
											e.stopPropagation();
											onDelete?.();
										}}
									>
										Confirmar
									</button>
									<button
										className="btn-ghost"
										style={{ padding: "4px 10px", fontSize: 11 }}
										onClick={(e) => {
											e.stopPropagation();
											onCancelDelete?.();
										}}
									>
										Cancelar
									</button>
								</>
							) : (
								<>
									{p.visible ? (
										<button
											className="btn-ghost"
											style={{ padding: "4px 8px", fontSize: 11 }}
											title="Despublicar"
											onClick={(e) => {
												e.stopPropagation();
												onUnpublish?.();
											}}
										>
											<span style={{ fontSize: 11, fontWeight: 600 }}>✕</span>
										</button>
									) : (
										<button
											className="btn-ghost"
											style={{ padding: "4px 8px", fontSize: 11 }}
											title={
												p.status === "Aprovado"
													? "Publicar no site"
													: "Precisa estar Aprovado"
											}
											disabled={p.status !== "Aprovado" || isPublishing}
											onClick={(e) => {
												e.stopPropagation();
												onPublish?.();
											}}
										>
											<Ic.Eye size={12} />
										</button>
									)}
									<button
										className="btn-ghost"
										style={{ padding: "4px 8px", fontSize: 11 }}
										title="Apagar projeto"
										onClick={(e) => {
											e.stopPropagation();
											onDelete?.();
										}}
									>
										<Ic.Trash size={12} />
									</button>
								</>
							)}
						</div>
					</div>
				)}
			</div>

			{/* ── Corpo do card ── */}
			<button
				onClick={onOpen}
				style={{
					padding: "12px 14px",
					textAlign: "left",
					cursor: "pointer",
					background: "transparent",
					border: "none",
					flex: 1,
					width: "100%",
				}}
			>
				<div
					style={{
						fontSize: 13,
						fontWeight: 700,
						marginBottom: 3,
						lineHeight: 1.3,
						// Trunca nomes longos com reticências
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
						color: "var(--fg)",
					}}
				>
					{p.nome}
				</div>

				{p.cidade && (
					<div
						style={{
							fontSize: 11,
							color: "var(--muted)",
							marginBottom: 8,
							display: "flex",
							alignItems: "center",
							gap: 4,
						}}
					>
						<Ic.MapPin size={10} /> {p.cidade}
					</div>
				)}

				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<StatusChip s={p.status} />
					{p.visible && (
						<span
							style={{
								fontSize: 10,
								color: "var(--success, #16a34a)",
								fontWeight: 600,
							}}
						>
							● publicado
						</span>
					)}
				</div>
			</button>
		</div>
	);
}
