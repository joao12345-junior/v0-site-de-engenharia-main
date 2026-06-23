// project_detail.tsx
import { useRef, useState } from "react";
import type { ItemEditavel, Projeto, Produto } from "../lib/types";
import { PhotoSlot } from "./photo_slot";
import { Ic } from "../lib/icons";
import { ConfigRow } from "./config_role";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB em bytes

// [MUDANÇA] onSave era `(p: Projeto) => void`.
// O componente é genérico (T extends ItemEditavel), então quando isProd=true
// ele recebe e devolve um Produto. Salvar um Produto com tipo Projeto é
// incorreto e TypeScript deveria pegar isso — agora pega.
interface ProjectDetailProps<T extends ItemEditavel> {
	project: T;
	onClose: () => void;
	onUpdate: (updater: (p: T) => T) => void;
	onSave: (p: T) => void; // [MUDANÇA] era `(p: Projeto)` — agora genérico
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

	// [MUDANÇA] `p` foi renomeado para `draft` (rascunho em edição) e
	// a lógica foi corrigida para que ele seja a fonte da verdade dos campos editáveis.
	//
	// ANTES: `const [p, setP] = useState(project)` — declarado mas nunca atualizado.
	//        O botão "Salvar" chamava `onSave(p)` enviando sempre o estado INICIAL.
	//
	// DEPOIS: `draft` começa com os valores de `project` e é atualizado pelos
	//         inputs via onChange. Quando o usuário clica "Salvar", `draft` contém
	//         todas as edições.
	//
	// [CONCEITO] Por que `project as T`?
	// useState<T> precisa do tipo explícito porque TypeScript não consegue
	// inferir T apenas do valor inicial — o genérico vem de fora do componente.
	const [draft, setDraft] = useState<T>(project as T);
	console.log(draft);

	// [CONCEITO] Função auxiliar para atualizar um campo do draft.
	// O spread `{ ...prev, ...fields }` copia todos os campos de `prev`
	// e sobrescreve apenas os campos presentes em `fields`.
	// Sem o spread, setDraft({ nome: "novo" }) apagaria todos os outros campos.
	const updateDraft = (fields: Partial<T>) =>
		setDraft((prev) => ({ ...prev, ...fields }));

	const handleFiles = (files: FileList | null) => {
		if (!files) return;

		// [MUDANÇA — Bug 1] `arr.filter(...)` retornava um novo array mas o
		// resultado era jogado fora. O `forEach` abaixo iterava sobre `arr`
		// original, sem filtro. PDFs e outros arquivos passavam sem verificação.
		// Agora o resultado do filter é capturado em `images`.
		const images = Array.from(files).filter((f) => f.type.startsWith("image/"));

		images.forEach((f) => {
			if (f.size > MAX_FILE_SIZE) {
				alert("Arquivo muito grande. O tamanho máximo é 10MB.");
				// [CONCEITO] `return` dentro de forEach sai apenas desta iteração
				// (equivale a `continue` num for). Não sai da função inteira.
				return;
			}

			const reader = new FileReader();
			reader.onload = () => {
				if (typeof reader.result !== "string") return;
				const newPhoto = reader.result;

				// onUpdate atualiza o estado no componente pai (PageProjetos/PageProdutos)
				// para que os cards reflitam as fotos adicionadas.
				onUpdate((prev) => {
					const photos = [...(prev.photos || []), newPhoto];
					return {
						...prev,
						photos,
						fotos: photos.length,
						capa: prev.capa || newPhoto,
					};
				});

				// Também atualiza o draft local para manter consistência visual
				// no painel aberto sem precisar fechar e reabrir.
				setDraft((prev) => {
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

	// [MUDANÇA] Usa `draft.photos` em vez de `project.photos`.
	// `project` é a prop — imutável, valor original.
	// `draft` é o estado local — mutável, valor atual em edição.
	const photos = draft.photos || [];

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
				{/* Cabeçalho fixo */}
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
							{isProd
								? (draft as unknown as Produto).sku
								: String(draft.id).toUpperCase()}
						</div>
						<h2
							style={{
								fontSize: 20,
								fontWeight: 700,
								marginTop: 6,
								letterSpacing: "-0.01em",
							}}
						>
							{draft.nome}
						</h2>
						<div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
							{isProd
								? `${(draft as unknown as Produto).tipo} · lançamento ${(draft as unknown as Produto).lancamento}`
								: `${(draft as unknown as Projeto).cliente} · ${(draft as unknown as Projeto).cidade}`}
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
					{/* Área de drag & drop */}
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

					{/* Galeria de fotos */}
					<div className="label-eyebrow" style={{ marginBottom: 12 }}>
						— Galeria · {photos.length} {photos.length === 1 ? "foto" : "fotos"}
					</div>
					{photos.length === 0 ? (
						<div className="empty">
							Nenhuma foto enviada ainda. Arraste arquivos para a área acima.
						</div>
					) : (
						<div
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
										// Remove a foto do índice `i` e atualiza tanto
										// o estado pai quanto o draft local.
										const handler = (prev: T): T => {
											const newPhotos = (prev.photos ?? []).filter(
												(_, j) => j !== i,
											);
											return {
												...prev,
												photos: newPhotos,
												fotos: newPhotos.length,
												capa: i === 0 ? newPhotos[0] : prev.capa,
											};
										};
										onUpdate(handler);
										setDraft(handler);
									}}
								/>
							))}
						</div>
					)}

					{/* Campos de detalhes */}
					<div
						className="label-eyebrow"
						style={{ marginBottom: 12, marginTop: 16 }}
					>
						— Detalhes
					</div>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: 14,
						}}
					>
						{isProd ? (
							<FieldsProduto
								draft={draft as unknown as Produto}
								onChange={(fields) => updateDraft(fields as Partial<T>)}
							/>
						) : (
							<FieldsProjeto
								draft={draft as unknown as Projeto}
								onChange={(fields) => updateDraft(fields as Partial<T>)}
							/>
						)}
					</div>

					{/* Botão salvar */}
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
						<button
							className="btn-primary"
							// [MUDANÇA — Bug 2 + 3] Antes: `onClick={() => onSave(p)}`
							// onde `p` era o estado INICIAL (nunca atualizado).
							// Agora: `draft` contém todas as edições do usuário.
							// E onSave recebe T (genérico) em vez de Projeto fixo.
							onClick={() => onSave(draft)}
						>
							<Ic.Check size={14} /> Salvar alterações
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

// ─── Sub-componentes de campos ────────────────────────────────────────────
// [CONCEITO] Separamos os campos em dois componentes pequenos em vez de
// usar `isProd` inline com um bloco grande de JSX.
// Isso é o Single Responsibility Principle: cada componente tem uma razão
// para existir e uma razão para mudar.
//
// FieldsProjeto muda quando os campos de Projeto mudam.
// FieldsProduto muda quando os campos de Produto mudam.
// ProjectDetail não muda por causa disso.

interface FieldsProjetoProps {
	draft: Projeto;
	onChange: (fields: Partial<Projeto>) => void;
}

function FieldsProjeto({ draft, onChange }: FieldsProjetoProps) {
	return (
		<>
			<EditField
				label="Nome do projeto"
				value={draft.nome}
				onChange={(v) => onChange({ nome: v })}
			/>
			<EditField
				label="Cliente"
				value={draft.cliente}
				onChange={(v) => onChange({ cliente: v })}
			/>
			<EditField
				label="Cidade / UF"
				value={draft.cidade}
				onChange={(v) => onChange({ cidade: v })}
			/>
			<EditField
				label="Status"
				value={draft.status}
				onChange={(v) => onChange({ status: v as Projeto["status"] })}
			/>
			{/* ConfigRow já tem seu próprio estado interno de toggle */}
			<div style={{ gridColumn: "1 / -1" }}>
				<ConfigRow
					label="Mostrar no site"
					desc="Visibilidade na página de projetos"
					enabled={draft.visible}
					onToggle={(v) => onChange({ visible: v })}
				/>
			</div>
		</>
	);
}

interface FieldsProdutoProps {
	draft: Produto;
	onChange: (fields: Partial<Produto>) => void;
}

function FieldsProduto({ draft, onChange }: FieldsProdutoProps) {
	return (
		<>
			<EditField
				label="Nome do produto"
				value={draft.nome}
				onChange={(v) => onChange({ nome: v })}
			/>
			<EditField
				label="SKU"
				value={draft.sku}
				onChange={(v) => onChange({ sku: v })}
			/>
			<EditField
				label="Tipo"
				value={draft.tipo}
				onChange={(v) => onChange({ tipo: v as Produto["tipo"] })}
			/>
			<EditField
				label="Lançamento"
				value={draft.lancamento}
				onChange={(v) => onChange({ lancamento: v })}
			/>
			<EditField
				label="Status"
				value={draft.status}
				onChange={(v) => onChange({ status: v as Produto["status"] })}
			/>
			<EditField
				label="Preço estimado"
				value={draft.preco}
				onChange={(v) => onChange({ preco: v })}
			/>
		</>
	);
}

// ─── Campo de input reutilizável ──────────────────────────────────────────
// [CONCEITO] Componente controlado (controlled component):
// o valor do input SEMPRE vem de props (`value`), não do DOM.
// React é a fonte da verdade — não o input.
// Isso garante que o estado e a UI estejam sempre sincronizados.
interface EditFieldProps {
	label: string;
	value: string | undefined;
	onChange: (value: string) => void;
}

function EditField({ label, value, onChange }: EditFieldProps) {
	return (
		<div>
			<div
				style={{
					fontSize: 10,
					color: "var(--muted)",
					textTransform: "uppercase",
					letterSpacing: ".08em",
					marginBottom: 4,
				}}
			>
				{label}
			</div>
			<input
				className="input"
				value={value ?? ""}
				// [MUDANÇA — Bug 2 corrigido]
				// `onChange` recebe um evento do DOM: `e: React.ChangeEvent<HTMLInputElement>`
				// `e.target.value` é o texto atual do input.
				// Passamos esse texto para o callback `onChange` da prop.
				// O callback atualiza o `draft` no componente pai.
				onChange={(e) => onChange(e.target.value)}
				style={{
					width: "100%",
					padding: "7px 10px",
					background: "var(--bg-2)",
					border: "1px solid var(--border)",
					color: "var(--fg)",
					fontSize: 13,
				}}
			/>
		</div>
	);
}
