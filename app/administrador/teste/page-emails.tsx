import { Ic, type IconComponente } from "./icons";
import React from "react";

interface DadosEmail {
	id: string;
	folder: string;
	read: boolean;
	starred: boolean;
	from: string;
	email: string;
	subject: string;
	preview: string;
	body: string;
	date: string;
	dateFull: string;
	labels: string[];
}

interface PageEmailsProps {
	accent: string;
	emails: DadosEmail[];
	setEmails: React.Dispatch<React.SetStateAction<DadosEmail[]>>;
}

interface ComposerProps {
	onClose: () => void;
	reply?: DadosEmail;
}

// E-mails: 3-pane (folders / list / reader) + composer
export function PageEmails({ accent, emails, setEmails }: PageEmailsProps) {
	type EstadoComposing = false | { reply?: DadosEmail };

	const [folder, setFolder] = React.useState("inbox");
	const [selected, setSelected] = React.useState<string | null>(null);
	const [composing, setComposing] = React.useState<EstadoComposing>(false);
	const [search, setSearch] = React.useState("");

	const folders = [
		{
			id: "inbox",
			label: "Caixa de entrada",
			icon: Ic.Inbox,
			count: emails.filter((e) => e.folder === "inbox" && !e.read).length,
		},
		{
			id: "starred",
			label: "Marcados",
			icon: Ic.Star,
			count: emails.filter((e) => e.starred).length,
		},
		{ id: "enviados", label: "Enviados", icon: Ic.Send, count: 0 },
		{
			id: "rascunhos",
			label: "Rascunhos",
			icon: Ic.Edit,
			count: emails.filter((e) => e.folder === "rascunhos").length,
		},
		{ id: "lixeira", label: "Lixeira", icon: Ic.Trash, count: 0 },
	];

	const labels = [
		{ name: "Cyrela", color: "#dc2626" },
		{ name: "Plaenge", color: "#2563eb" },
		{ name: "Renner", color: "#d97706" },
		{ name: "Saúde", color: "#16a34a" },
		{ name: "Urgente", color: "var(--primary)" },
	];

	let list = emails;
	if (folder === "starred") list = emails.filter((e) => e.starred);
	else list = emails.filter((e) => e.folder === folder);
	if (search)
		list = list.filter((e) =>
			(e.subject + e.from + e.preview)
				.toLowerCase()
				.includes(search.toLowerCase()),
		);

	const sel = emails.find((e) => e.id === selected);
	React.useEffect(() => {
		if (sel && !sel.read) {
			setEmails((prev) =>
				prev.map((e) => (e.id === sel.id ? { ...e, read: true } : e)),
			);
		}
	}, [sel, setEmails]);

	const toggleStar = (id: string) =>
		setEmails((prev) =>
			prev.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e)),
		);

	return (
		<div
			className={"email-shell" + (sel ? " has-selected" : "")}
			style={{ display: "flex", height: "calc(100vh - 73px)" }}
		>
			{/* Folders pane */}
			<div
				className="email-folders"
				style={{
					width: 220,
					borderRight: "1px solid var(--border)",
					background: "var(--bg-2)",
					padding: 16,
					display: "flex",
					flexDirection: "column",
					gap: 4,
				}}
			>
				<button
					className="btn-primary compose-btn"
					onClick={() => setComposing({})}
					style={{ justifyContent: "center", marginBottom: 10 }}
				>
					<Ic.Edit size={14} /> Novo e-mail
				</button>
				{folders.map((f) => {
					const FolderIcon = f.icon;
					const ativo = folder === f.id;
					return (
						<button
							key={f.id}
							onClick={() => {
								setFolder(f.id);
								setSelected(null);
							}}
							style={{
								display: "flex",
								alignItems: "center",
								gap: 10,
								padding: "8px 10px",
								textAlign: "left",
								background: ativo ? "var(--primary-soft)" : "transparent",
								color: ativo ? "var(--primary)" : "var(--fg-2)",
								borderLeft: ativo
									? `3px solid var(--primary)`
									: "3px solid transparent",
								fontSize: 12,
							}}
						>
							<FolderIcon size={14} />
							<span style={{ flex: 1 }}>{f.label}</span>
							{f.count > 0 && (
								<span
									style={{
										fontSize: 10,
										color: ativo ? "var(--primary)" : "var(--muted)",
									}}
								>
									{f.count}
								</span>
							)}
						</button>
					);
				})}
				<div
					className="folder-labels-section"
					style={{ height: 1, background: "var(--border)", margin: "14px 0" }}
				></div>
				<div
					className="label-eyebrow folder-labels-section"
					style={{ padding: "0 10px" }}
				>
					— Etiquetas
				</div>
				{labels.map((l) => (
					<button
						key={l.name}
						className="folder-labels-section"
						style={{
							display: "flex",
							alignItems: "center",
							gap: 10,
							padding: "6px 10px",
							textAlign: "left",
							fontSize: 11,
							color: "var(--fg-2)",
						}}
					>
						<span style={{ width: 10, height: 10, background: l.color }}></span>
						<span>{l.name}</span>
					</button>
				))}
			</div>

			{/* List pane */}
			<div
				className="email-list"
				style={{
					width: 360,
					borderRight: "1px solid var(--border)",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<div
					style={{
						padding: "12px 14px",
						borderBottom: "1px solid var(--border)",
						display: "flex",
						flexDirection: "column",
						gap: 8,
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "baseline",
						}}
					>
						<div style={{ fontSize: 13, fontWeight: 700 }}>
							{folders.find((f) => f.id === folder)?.label}
						</div>
						<div style={{ fontSize: 11, color: "var(--muted)" }}>
							{list.length}
						</div>
					</div>
					<input
						className="input"
						placeholder="Buscar nesta pasta..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						style={{ fontSize: 12, padding: "6px 10px" }}
					/>
				</div>
				<div style={{ flex: 1, overflowY: "auto" }}>
					{list.length === 0 && (
						<div
							className="empty"
							style={{ padding: "40px 16px", border: "none" }}
						>
							Sem e-mails aqui.
						</div>
					)}
					{list.map((e) => (
						<button
							key={e.id}
							onClick={() => setSelected(e.id)}
							style={{
								width: "100%",
								textAlign: "left",
								padding: "12px 14px",
								borderBottom: "1px solid var(--border)",
								background:
									selected === e.id ? "var(--primary-soft)" : "transparent",
								borderLeft:
									selected === e.id
										? `3px solid var(--primary)`
										: !e.read
											? "3px solid var(--primary)"
											: "3px solid transparent",
								position: "relative",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									marginBottom: 4,
									alignItems: "baseline",
								}}
							>
								<span style={{ fontSize: 12, fontWeight: e.read ? 500 : 700 }}>
									{e.from}
								</span>
								<span style={{ fontSize: 10, color: "var(--muted)" }}>
									{e.date}
								</span>
							</div>
							<div
								style={{
									fontSize: 12,
									fontWeight: e.read ? 400 : 600,
									marginBottom: 4,
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
								}}
							>
								{e.subject}
							</div>
							<div
								style={{
									fontSize: 11,
									color: "var(--muted)",
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
								}}
							>
								{e.preview}
							</div>
							<div
								style={{
									display: "flex",
									gap: 4,
									marginTop: 6,
									alignItems: "center",
								}}
							>
								{e.starred && (
									<Ic.Star
										size={11}
										stroke={2}
										style={{ color: "var(--warn)", fill: "var(--warn)" }}
									/>
								)}
								{e.labels.map((l) => (
									<span
										key={l}
										className="chip"
										style={{ fontSize: 9, padding: "1px 5px" }}
									>
										{l}
									</span>
								))}
							</div>
						</button>
					))}
				</div>
			</div>

			{/* Reader pane */}
			<div
				className="email-reader"
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					overflow: "hidden",
				}}
			>
				<button
					className="email-back-btn btn-ghost"
					onClick={() => setSelected(null)}
					style={{
						padding: "10px 14px",
						borderBottom: "1px solid var(--border)",
						alignItems: "center",
						gap: 8,
						fontSize: 12,
						justifyContent: "flex-start",
					}}
				>
					← Voltar à lista
				</button>
				{!sel ? (
					<div
						style={{
							flex: 1,
							display: "grid",
							placeItems: "center",
							color: "var(--muted-2)",
						}}
					>
						<div style={{ textAlign: "center" }}>
							<Ic.Mail size={48} stroke={1} />
							<div
								style={{ marginTop: 12, fontSize: 12, letterSpacing: "0.1em" }}
							>
								SELECIONE UM E-MAIL
							</div>
						</div>
					</div>
				) : (
					<>
						<div
							style={{
								padding: "18px 24px",
								borderBottom: "1px solid var(--border)",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									gap: 14,
									alignItems: "flex-start",
									marginBottom: 14,
								}}
							>
								<div style={{ flex: 1 }}>
									<h2
										style={{
											fontSize: 18,
											fontWeight: 700,
											marginBottom: 8,
											letterSpacing: "-0.01em",
										}}
									>
										{sel.subject}
									</h2>
									<div
										style={{
											display: "flex",
											gap: 6,
											alignItems: "center",
											marginBottom: 4,
										}}
									>
										{sel.labels.map((l) => (
											<span key={l} className="chip red">
												{l}
											</span>
										))}
									</div>
								</div>
								<div style={{ display: "flex", gap: 6 }}>
									<button
										onClick={() => toggleStar(sel.id)}
										className="btn-ghost"
										style={{
											padding: 8,
											border: "1px solid var(--border)",
											color: sel.starred ? "var(--warn)" : "",
										}}
									>
										<Ic.Star size={14} stroke={sel.starred ? 2 : 1.6} />
									</button>
									<button
										className="btn-ghost"
										style={{ padding: 8, border: "1px solid var(--border)" }}
									>
										<Ic.Trash size={14} />
									</button>
									<button
										className="btn-ghost"
										style={{ padding: 8, border: "1px solid var(--border)" }}
									>
										<Ic.More size={14} />
									</button>
								</div>
							</div>
							<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
								<div
									style={{
										width: 36,
										height: 36,
										background: "var(--card-2)",
										border: "1px solid var(--border)",
										display: "grid",
										placeItems: "center",
										fontSize: 12,
										fontWeight: 700,
										color: "var(--primary)",
									}}
								>
									{sel.from
										.split(" ")
										.map((s) => s[0])
										.slice(0, 2)
										.join("")}
								</div>
								<div style={{ flex: 1 }}>
									<div style={{ fontSize: 13, fontWeight: 600 }}>
										{sel.from}{" "}
										<span style={{ fontWeight: 400, color: "var(--muted)" }}>
											&lt;{sel.email}&gt;
										</span>
									</div>
									<div style={{ fontSize: 11, color: "var(--muted)" }}>
										para mim · {sel.dateFull}
									</div>
								</div>
							</div>
						</div>
						<div
							style={{
								flex: 1,
								overflowY: "auto",
								padding: "24px 28px",
								whiteSpace: "pre-wrap",
								fontSize: 13,
								lineHeight: 1.7,
							}}
						>
							{sel.body}
						</div>
						<div
							style={{
								borderTop: "1px solid var(--border)",
								padding: 18,
								display: "flex",
								gap: 10,
							}}
						>
							<button
								className="btn-primary"
								onClick={() => setComposing({ reply: sel })}
							>
								<Ic.Reply size={14} /> Responder
							</button>
							<button className="btn-ghost">
								<Ic.Send size={14} /> Encaminhar
							</button>
						</div>
					</>
				)}
			</div>

			{composing && (
				<Composer onClose={() => setComposing(false)} reply={composing.reply} />
			)}
		</div>
	);
}

export function Composer({ onClose, reply }: ComposerProps) {
	const [to, setTo] = React.useState(reply ? reply.email : "");
	const [subj, setSubj] = React.useState(reply ? "Re: " + reply.subject : "");
	const [body, setBody] = React.useState(
		reply
			? `\n\n--- Em ${reply.dateFull}, ${reply.from} escreveu:\n${(
					reply.body || ""
				)
					.split("\n")
					.map((l) => "> " + l)
					.join("\n")}`
			: "",
	);
	return (
		<div
			className="composer"
			style={{
				position: "fixed",
				bottom: 0,
				right: 24,
				width: 580,
				maxWidth: "90vw",
				background: "var(--bg)",
				border: "1px solid var(--border)",
				borderBottom: "none",
				boxShadow: "0 -8px 24px rgba(0,0,0,0.4)",
				zIndex: 50,
				display: "flex",
				flexDirection: "column",
				height: 520,
				maxHeight: "80vh",
			}}
		>
			<div
				style={{
					padding: "12px 16px",
					background: "var(--bg-2)",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					borderBottom: "1px solid var(--border)",
				}}
			>
				<span
					style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.05em" }}
				>
					NOVA MENSAGEM
				</span>
				<div style={{ display: "flex", gap: 4 }}>
					<button
						onClick={onClose}
						className="btn-ghost"
						style={{ padding: 5, border: "1px solid var(--border)" }}
					>
						<Ic.X size={12} />
					</button>
				</div>
			</div>
			<div
				style={{
					padding: 14,
					display: "flex",
					flexDirection: "column",
					gap: 8,
					flex: 1,
					minHeight: 0,
				}}
			>
				<input
					className="input"
					placeholder="Para"
					value={to}
					onChange={(e) => setTo(e.target.value)}
				/>
				<input
					className="input"
					placeholder="Assunto"
					value={subj}
					onChange={(e) => setSubj(e.target.value)}
				/>
				<textarea
					className="input"
					placeholder="Escreva sua mensagem..."
					value={body}
					onChange={(e) => setBody(e.target.value)}
					style={{
						flex: 1,
						resize: "none",
						fontFamily: "var(--font)",
						minHeight: 200,
					}}
				/>
			</div>
			<div
				style={{
					padding: 12,
					borderTop: "1px solid var(--border)",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<div style={{ display: "flex", gap: 4 }}>
					<button
						className="btn-ghost"
						style={{ padding: 7, border: "1px solid var(--border)" }}
					>
						<Ic.Bold size={13} />
					</button>
					<button
						className="btn-ghost"
						style={{ padding: 7, border: "1px solid var(--border)" }}
					>
						<Ic.Italic size={13} />
					</button>
					<button
						className="btn-ghost"
						style={{ padding: 7, border: "1px solid var(--border)" }}
					>
						<Ic.Link size={13} />
					</button>
					<button
						className="btn-ghost"
						style={{ padding: 7, border: "1px solid var(--border)" }}
					>
						<Ic.Paperclip size={13} />
					</button>
				</div>
				<button
					className="btn-primary"
					onClick={() => {
						window.toast && window.toast("E-mail enviado para " + to);
						onClose();
					}}
				>
					<Ic.Send size={13} /> Enviar
				</button>
			</div>
		</div>
	);
}
