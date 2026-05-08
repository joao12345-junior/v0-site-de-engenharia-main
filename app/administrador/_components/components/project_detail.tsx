import { useRef, useState } from "react";
import { ItemEditavel, Projeto } from "../lib/types";
import { PhotoSlot } from "./photo_slot";
import { Ic } from "../lib/icons";
import { Field } from "./field";

const maxSize = 10 * 1024 * 1024;

interface ProjectDetailProps<T extends ItemEditavel> {
	project: T;
	onClose: () => void;
	onUpdate: (updater: (p: T) => T) => void;
	onSave: (p: Projeto) => void;
	accent: string;
	isProd?: boolean;
}

export function ProjectDetail<T extends ItemEditavel>({
	project,
	onClose,
	onUpdate,
	onSave,
	accent,
	isProd = false,
}: ProjectDetailProps<T>) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [drag, setDrag] = useState(false);
	const [p, setP] = useState(project); // p => Project

	const handleFiles = (files: FileList | null) => {
		if (!files) return;
		const arr = Array.from(files);
		arr.filter((f) => f.type.startsWith("image/"));
		arr.forEach((f) => {
			if (f.size > maxSize)
				return alert("Arquivo muito grande. O tamnho máximo é 10MB");
			const reader = new FileReader();
			reader.onload = () => {
				if (typeof reader.result !== "string") return;
				const newPhoto: string = reader.result;
				onUpdate((prev) => {
					const photos = [...(prev.photos || []), newPhoto];
					return {
						...prev,
						photos,
						fotos: photos.length,
						capa: prev.capa || newPhoto,
					};
				});
			};
			reader.readAsDataURL(f);
		});
	};

	const photos = project.photos || [];

	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				background: "rgba(0,0,0,0.7)",
				backdropFilter: "blur(4px)",
				zIndex: 100,
				display: "flex",
				justifyContent: "flex-end",
			}}
			onClick={onClose}
		>
			<div
				className="detail-panel"
				onClick={(e) => e.stopPropagation()}
				style={{
					width: 720,
					maxWidth: "95vw",
					height: "100%",
					background: "var(--bg)",
					borderLeft: "1px solid var(--border)",
					boxShadow: "-8px 0 24px rgba(0,0,0,0.4)",
					overflow: "auto",
				}}
			>
				<div
					style={{
						padding: "20px 24px",
						borderBottom: "1px solid var(--border)",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						position: "sticky",
						top: 0,
						background: "var(--bg)",
						zIndex: 2,
					}}
				>
					<div>
						<div className="label-eyebrow">
							— {isProd ? "Produto" : "Projeto"}{" "}
							{isProd ? project.sku : String(project.id).toUpperCase()}
						</div>
						<h2
							style={{
								fontSize: 20,
								fontWeight: 700,
								marginTop: 6,
								letterSpacing: "-0.01em",
							}}
						>
							{project.nome}
						</h2>
						<div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
							{isProd
								? `${project.tipo} · lançamento ${project.lancamento}`
								: `${project.cliente} · ${project.cidade}`}
						</div>
					</div>
					<button
						className="btn-ghost"
						onClick={onClose}
						style={{ padding: 8, border: "1px solid var(--border)" }}
					>
						<Ic.X size={14} />
					</button>
				</div>

				<div style={{ padding: 24 }}>
					{/* Drop zone */}
					<div
						onDragOver={(e) => {
							e.preventDefault();
							setDrag(true);
						}}
						onDragLeave={() => setDrag(false)}
						onDrop={(e) => {
							e.preventDefault();
							setDrag(false);
							handleFiles(e.dataTransfer.files);
						}}
						onClick={() => fileInputRef.current?.click()}
						style={{
							border: `2px dashed ${drag ? accent : "var(--border-2)"}`,
							padding: 32,
							marginBottom: 20,
							textAlign: "center",
							cursor: "pointer",
							background: drag ? "var(--primary-soft)" : "var(--bg-2)",
							transition: "all .15s",
						}}
					>
						<Ic.Upload size={28} stroke={1.4} />
						<div style={{ fontWeight: 700, marginTop: 10, fontSize: 14 }}>
							Arraste fotos aqui ou clique para enviar
						</div>
						<div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
							JPG, PNG, WEBP · até 10MB cada · múltiplos arquivos
						</div>
						<input
							ref={fileInputRef}
							type="file"
							multiple
							accept="image/*"
							style={{ display: "none" }}
							onChange={(e) => handleFiles(e.target.files)}
						/>
					</div>

					{/* Photos grid */}
					<div className="label-eyebrow" style={{ marginBottom: 12 }}>
						— Galeria · {photos.length} {photos.length === 1 ? "foto" : "fotos"}
					</div>
					{photos.length === 0 ? (
						<div className="empty">
							Nenhuma foto enviada ainda. Arraste arquivos para a área acima.
						</div>
					) : (
						<div
							className="grid-cards-sm"
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(3, 1fr)",
								gap: 10,
								marginBottom: 24,
							}}
						>
							{photos.map((url, i) => (
								<PhotoSlot
									key={i}
									url={url}
									idx={i}
									onRemove={() => {
										onUpdate((prev) => {
											const newPhotos = (prev.photos ?? []).filter(
												(_, j) => j !== i,
											);
											return {
												...prev,
												photos: newPhotos,
												fotos: newPhotos.length,
												capa: i === 0 ? newPhotos[0] : prev.capa,
											};
										});
									}}
								/>
							))}
						</div>
					)}

					{/* Meta fields */}
					<div
						className="label-eyebrow"
						style={{ marginBottom: 12, marginTop: 16 }}
					>
						— Detalhes
					</div>
					<div
						className="grid-2col"
						style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
					>
						{isProd ? (
							<>
								<Field label="Nome do produto" value={project.nome} />
								<Field label="SKU" value={project.sku} />
								<Field label="Tipo" value={project.tipo} />
								<Field label="Lançamento" value={project.lancamento} />
								<Field label="Status" value={project.status} />
								<Field label="Preço estimado" value={project.preco} />
							</>
						) : (
							<>
								<Field label="Nome do projeto" value={project.nome} />
								<Field label="Cliente" value={project.cliente} />
								<Field label="Cidade / UF" value={project.cidade} />
								<Field label="Categoria" value={project.categoria} />
								<Field label="Status" value={project.status} />
							</>
						)}
					</div>

					<div
						style={{
							marginTop: 24,
							display: "flex",
							gap: 10,
							justifyContent: "flex-end",
							borderTop: "1px solid var(--border)",
							paddingTop: 18,
						}}
					>
						<button className="btn-primary" onClick={() => onSave(p)}>
							<Ic.Check size={14} /> Salvar alterações
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
