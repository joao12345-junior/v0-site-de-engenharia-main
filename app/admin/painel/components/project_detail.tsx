// components/project_detail.tsx
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import type { ItemEditavel, Projeto, Produto } from "../lib/types";
import { PhotoSlot } from "./photo_slot";
import { Ic } from "../lib/icons";
import { ConfigRow } from "./config_role";
import type { Photo } from "@/lib/repositories/admin/photos-repository";
import { toast } from "sonner";
import type { Cliente } from "@/lib/repositories/admin/admin-clients-repository";
import { CitySelect } from "./city_select";
import estadosCidades from "@/public/JSON/outros/estados-cidades.json";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface ProjectDetailProps<T extends ItemEditavel> {
	project: T;
	clientes?: Cliente[];
	onClose: () => void;
	onUpdate: (updater: (p: T) => T) => void;
	onSave: (p: T) => Promise<void>;
	accent: string;
	isProd?: boolean;
}

// ─── Type guards ───────────────────────────────────────────────────────────
//
// [CONCEITO] Type guard em vez de `as unknown as X`.
//
// O duplo cast (as unknown as Projeto) silencia o TypeScript mas NÃO garante
// que o objeto seja realmente um Projeto em runtime — você está apenas
// convencendo o compilador a desistir de verificar. Se o tipo estiver errado,
// o erro aparece tarde, como "Cannot read property 'cidade' of undefined".
//
// Type guards com `in` fazem verificação real em runtime:
//   "cidade" in p → true se o objeto TEM a propriedade "cidade"
// O TypeScript usa isso como prova de que `p` é `Projeto` dentro do bloco.
// Erro de tipo vira erro de compilação, não de runtime.

function isProjeto(p: ItemEditavel): p is Projeto {
	return "cidade" in p;
}

function isProduto(p: ItemEditavel): p is Produto {
	return "sku" in p;
}

export function ProjectDetail<T extends ItemEditavel>({
	project,
	clientes,
	onClose,
	onUpdate,
	onSave,
	accent,
	isProd = false,
}: ProjectDetailProps<T>) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [drag, setDrag] = useState(false);
	const [draft, setDraft] = useState<T>(project as T);

	// ─── Estado de fotos: carregado do banco, não do estado React ──────────
	//
	// [MUDANÇA CENTRAL] Antes: `photos` vinha de `draft.photos` — um array de
	// strings base64 gigantes no estado React.
	// Depois: fotos vivem no banco (project_photos/product_photos). O estado
	// local é apenas um cache temporário para exibição — a fonte da verdade é
	// o banco de dados.
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [loadingPhotos, setLoadingPhotos] = useState(true);
	const [uploading, setUploading] = useState(false);

	const updateDraft = (fields: Partial<T>) =>
		setDraft((prev) => ({ ...prev, ...fields }));

	// ─── Carregar fotos ao abrir o painel ─────────────────────────────────
	//
	// [CONCEITO] useEffect com array de dependências [project.id, isProd]:
	// Executa APÓS o primeiro render e novamente SE project.id ou isProd mudar.
	// Sem o array, executaria a cada render (loop infinito de fetch).
	// Com [] vazio, executaria só uma vez — mas aí não recarregaria se o
	// usuário fechar e abrir um projeto diferente sem desmontar o componente.
	useEffect(() => {
		const entityType = isProd ? "products" : "projects";
		setLoadingPhotos(true);
		fetch(`/admin/api/admin/${entityType}/${project.id}/photos/`)
			.then((r) => r.json())
			.then((data) => {
				const fotos: Photo[] = data.photos ?? [];
				setPhotos(fotos);

				// [FIX] Se o projeto não tem capa mas tem fotos,
				// usa a primeira foto como capa e persiste no banco.
				// Resolve projetos históricos onde cover_url foi limpo
				// pela migration 004 mas as fotos em project_photos existem.
				if (!draft.capa && fotos.length > 0) {
					const firstUrl = fotos[0].url;
					updateDraft({ capa: firstUrl } as Partial<T>);
					onUpdate((p) => ({ ...p, capa: firstUrl }));
					fetch(`/admin/api/admin/${entityType}/${project.id}/`, {
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ capa: firstUrl }),
					}).catch(console.error);
				}
			})
			.catch(() => setPhotos([]))
			.finally(() => setLoadingPhotos(false));
	}, [project.id, isProd]);

	// ─── Upload em dois passos ────────────────────────────────────────────
	//
	// [CONCEITO] Por que dois passos separados?
	// 1. POST /api/admin/upload-photo → Vercel Blob (armazenamento do arquivo)
	// 2. POST /api/admin/.../photos   → Postgres (registro da URL)
	//
	// São operações diferentes com backends diferentes (Blob vs banco).
	// Separar permite retry independente: se o banco cair, o arquivo já
	// está no Blob e pode ser registrado depois. Se fossem um passo só,
	// qualquer falha no banco exigiria re-upload do arquivo inteiro.
	//
	// [MUDANÇA] async/await em vez de FileReader + callback.
	// FileReader usa o padrão evento/callback (mais antigo). fetch é
	// Promise-based — com async/await o código é linear e fácil de ler,
	// sem callbacks aninhados ("callback hell").
	const handleFiles = (files: FileList | null) => {
		if (!files) return;

		const promise = (async () => {
			const images = Array.from(files).filter((f) =>
				f.type.startsWith("image/"),
			);

			if (images.length === 0) return;

			setUploading(true);

			const entityType = isProd ? "products" : "projects";

			let nextPosition = photos.length;
			for (const file of images) {
				if (file.size > MAX_FILE_SIZE) {
					throw new Error(`${file.name} é muito grande. Máx: 10MB.`);
				}

				// 1. upload blob
				const formData = new FormData();
				formData.append("file", file);

				const uploadRes = await fetch("/admin/api/admin/upload-photo/", {
					method: "POST",
					body: formData,
				});

				if (!uploadRes.ok) {
					const err = await uploadRes.json();
					throw new Error(err.error ?? `Falha ao subir ${file.name}`);
				}

				const { url } = await uploadRes.json();

				const saveRes = await fetch(
					`/admin/api/admin/${entityType}/${project.id}/photos/`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ url, position: nextPosition }),
					},
				);
				nextPosition++;

				if (!saveRes.ok) {
					const err = await saveRes.json();
					throw new Error(err.error ?? `Falha ao salvar ${file.name}`);
				}

				const { photo } = await saveRes.json();

				setPhotos((prev) => {
					const newPhotos = [...prev, photo];

					// capa automática se for primeira foto REAL
					if (prev.length === 0) {
						onUpdate((p) => ({ ...p, capa: url }));
						updateDraft({ capa: url } as Partial<T>);

						fetch(`/admin/api/admin/${entityType}/${project.id}/`, {
							method: "PATCH",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ capa: url }),
						}).catch(console.error);
					}

					return newPhotos;
				});
			}

			setUploading(false);
		})();

		toast.promise(promise, {
			position: "top-center",
			loading: "Enviando imagens...",
			success: "Imagens enviadas com sucesso!",
			error: (err) => err.message,
		});
	};

	// ─── Remoção de foto ──────────────────────────────────────────────────
	const handleRemove = (photo: Photo, idx: number) => {
		const entityType = isProd ? "products" : "projects";

		const promise = (async () => {
			const res = await fetch(
				`/admin/api/admin/${entityType}/${project.id}/photos/${photo.id}/`,
				{
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ blobUrl: photo.url }),
				},
			);

			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error ?? "Falha ao remover foto.");
			}

			const newPhotos = photos.filter((_, j) => j !== idx);
			setPhotos(newPhotos);

			// se removeu capa
			if (draft.capa === photo.url) {
				const newCapa = newPhotos[0]?.url ?? null;

				onUpdate((p) => ({
					...p,
					capa: newCapa,
				}));

				updateDraft({
					capa: newCapa,
				} as Partial<T>);

				await fetch(`/admin/api/admin/${entityType}/${project.id}/`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						capa: newCapa,
					}),
				});
			}
		})();

		return toast.promise(promise, {
			position: "top-center",
			loading: "Removendo foto...",
			success: "Foto removida com sucesso!",
			error: (err) => err.message,
		});
	};

	const handleSave = () => {
		const finalCapa =
			photos.length > 0
				? (photos.find((p) => p.url === draft.capa)?.url ?? photos[0].url)
				: null;

		const syncedDraft = {
			...draft,
			capa: finalCapa,
		};

		toast.promise(onSave(syncedDraft), {
			position: "top-center",
			loading: "Salvando projeto...",
			success: () => "Projeto salvo com sucesso!",
			error: (err) => err?.message ?? "Erro ao salvar o projeto.",
		});
	};
	// ─── Render ───────────────────────────────────────────────────────────

	// [CONCEITO] Narrowing para acessar campos específicos de Projeto/Produto
	// no cabeçalho sem duplo cast. isProjeto(draft) retorna `draft is Projeto`
	// — dentro do bloco true, TypeScript SABE que draft é Projeto.
	const headerSubtitle = isProjeto(draft)
		? `${draft.cliente} · ${draft.cidade}`
		: isProduto(draft)
			? `${draft.tipo} · lançamento ${draft.lancamento}`
			: "";

	const headerLabel = isProduto(draft)
		? draft.sku
		: String(draft.id).toUpperCase();

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
							— {isProd ? "Produto" : "Projeto"} {headerLabel}
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
							{headerSubtitle}
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
						onClick={() => !uploading && fileInputRef.current?.click()}
						style={{
							border: `2px dashed ${drag ? accent : "var(--border-2)"}`,
							padding: 32,
							marginBottom: 20,
							textAlign: "center",
							cursor: uploading ? "not-allowed" : "pointer",
							background: drag ? "var(--primary-soft)" : "var(--bg-2)",
							transition: "all .15s",
							opacity: uploading ? 0.6 : 1,
						}}
					>
						<Ic.Upload size={28} stroke={1.4} />
						<div style={{ fontWeight: 700, marginTop: 10, fontSize: 14 }}>
							{uploading
								? "Enviando fotos..."
								: "Arraste fotos aqui ou clique para enviar"}
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

					{/* Galeria */}
					<div className="label-eyebrow" style={{ marginBottom: 12 }}>
						— Galeria · {photos.length} {photos.length === 1 ? "foto" : "fotos"}
					</div>
					{loadingPhotos ? (
						<div className="empty">Carregando fotos...</div>
					) : photos.length === 0 ? (
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
							{photos.map((photo, i) => (
								<PhotoSlot
									key={photo.id}
									url={photo.url}
									idx={i}
									onRemove={() => handleRemove(photo, i)}
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
						style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
					>
						{isProd ? (
							<FieldsProduto
								draft={draft as unknown as Produto}
								onChange={(fields) => updateDraft(fields as Partial<T>)}
							/>
						) : (
							<FieldsProjeto
								clientes={clientes ?? []}
								draft={draft as unknown as Projeto}
								onChange={(fields) => updateDraft(fields as Partial<T>)}
							/>
						)}
					</div>

					{/* Salvar */}
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
						<button className="btn-primary" onClick={handleSave}>
							<Ic.Check size={14} /> Salvar alterações
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

// ─── Sub-componentes de campos ────────────────────────────────────────────
const todosEstados = estadosCidades.estados;

interface FieldsProjetoProps {
	draft: Projeto;
	onChange: (fields: Partial<Projeto>) => void;
	clientes: Cliente[];
}

function FieldsProjeto({ draft, onChange, clientes }: FieldsProjetoProps) {
	// [CONCEITO] Estado e cidade como estado LOCAL separado do draft.
	// O draft guarda "Porto Alegre, RS" como string única.
	// O componente precisa de duas peças separadas pra funcionar:
	//   - `estado` (sigla) → filtra as cidades no CitySelect
	//   - `cidade` → o que o usuário está digitando/selecionando
	//
	// Inicialização: se draft.cidade já existe ("Porto Alegre, RS"),
	// extrai as duas partes. Se for formato antigo sem sigla, usa como cidade.
	const [estado, setEstado] = useState(() => {
		const parts = (draft.cidade ?? "").split(", ");
		return parts.length === 2 ? parts[1] : "";
	});
	const [cidade, setCidade] = useState(() => {
		const parts = (draft.cidade ?? "").split(", ");
		return parts.length >= 1 ? parts[0] : "";
	});

	// [CONCEITO] Derivado de `estado` — recalcula só quando estado muda.
	// O CitySelect recebe a lista pronta, não o JSON inteiro.
	// Separação de responsabilidades: FieldsProjeto sabe onde buscar os dados,
	// CitySelect sabe como exibir e filtrar — nenhum dos dois faz as duas coisas.
	const cidadesDoEstado = useMemo(
		() => todosEstados.find((e) => e.sigla === estado)?.cidades ?? [],
		[estado],
	);

	const handleEstadoChange = (sigla: string) => {
		setEstado(sigla);
		setCidade("");
		onChange({ cidade: "" });
	};

	const handleCidadeChange = (novaCidade: string) => {
		setCidade(novaCidade);
		const cidadeCompleta = estado ? `${novaCidade}, ${estado}` : novaCidade;
		onChange({ cidade: cidadeCompleta });
	};

	const podePublicar = draft.status === "Aprovado";

	return (
		<>
			<EditField
				label="Nome do projeto"
				value={draft.nome}
				onChange={(v) => onChange({ nome: v })}
			/>
			<EditField
				label="Cliente"
				value={draft.clienteId}
				type="select"
				options={clientes.map((c) => ({ label: c.nome, value: c.id }))}
				onChange={(v) => {
					// Atualiza os dois campos juntos: o id (FK real) e o nome (exibição)
					const clienteSelecionado = clientes.find((c) => c.id === v);
					onChange({
						clienteId: v,
						cliente: clienteSelecionado?.nome ?? "",
					});
				}}
			/>
			{/* Estado primeiro — habilita o CitySelect */}
			<EditField
				label="Estado"
				value={estado}
				type="select"
				options={[
					{ label: "Selecione...", value: "" },
					...todosEstados.map((e) => ({
						label: `${e.sigla} — ${e.nome}`,
						value: e.sigla,
					})),
				]}
				onChange={handleEstadoChange}
			/>
			{/* CitySelect recebe estado como sigla pra filtrar as cidades */}
			<EditField
				label="Cidade"
				type="city"
				value={cidade}
				onChange={handleCidadeChange}
				cidades={cidadesDoEstado}
			/>
			<EditField
				label="Status"
				value={draft.status}
				type="select"
				options={[
					{ label: "Pré-projeto", value: "Pré-projeto" },
					{ label: "Em projeto", value: "Em projeto" },
					{ label: "Aprovação", value: "Aprovação" },
					{ label: "Aprovado", value: "Aprovado" },
				]}
				disabled={draft.status === "Aprovado"}
				onChange={(v) => onChange({ status: v as Projeto["status"] })}
			/>
			<div style={{ gridColumn: "1 / -1" }}>
				<ConfigRow
					label="Mostrar no site"
					desc={
						podePublicar
							? "Visibilidade na página de projetos"
							: "Defina o status como 'Aprovado' antes de publicar"
					}
					enabled={draft.visible}
					onToggle={podePublicar ? (v) => onChange({ visible: v }) : () => {}}
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

type SelectOption = {
	label: string;
	value: string;
};

interface EditFieldProps {
	label: string;
	value: string | number | null;
	onChange: (value: string) => void;

	type?: "text" | "select" | "city";
	options?: SelectOption[];
	disabled?: boolean;

	cidades?: string[];
}

function EditField({
	label,
	value,
	onChange,
	type = "text",
	options = [],
	disabled = false,
	cidades,
}: EditFieldProps) {
	const isDisabled = disabled;

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

			{type === "city" ? (
				<CitySelect
					value={value as string}
					onChange={onChange}
					cidades={cidades ?? []}
					disabled={disabled}
				/>
			) : type === "select" ? (
				<select
					className="input"
					value={value ?? ""}
					onChange={(e) => onChange(e.target.value)}
					disabled={isDisabled}
					style={{
						width: "100%",
						padding: "7px 10px",
						background: "var(--bg-2)",
						border: "1px solid var(--border)",
						color: "var(--fg)",
						fontSize: 13,
					}}
				>
					{options.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			) : (
				<input
					className="input"
					value={value ?? ""}
					onChange={(e) => onChange(e.target.value)}
					disabled={isDisabled}
					style={{
						width: "100%",
						padding: "7px 10px",
						background: "var(--bg-2)",
						border: "1px solid var(--border)",
						color: "var(--fg)",
						fontSize: 13,
						opacity: isDisabled ? 0.6 : 1,
						cursor: isDisabled ? "not-allowed" : "text",
					}}
				/>
			)}
		</div>
	);
}
