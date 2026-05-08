import { PageContainer } from "../lib/shell";
import { SEED } from "../lib/data";
import { Ic } from "../lib/icons";
import React from "react";
import { Field } from "./page-projetos";

interface PageConteudoProps {
	accent: string;
}

interface PageClientesProps {
	accent: string;
}

interface PageUsuariosProps {
	accent: string;
}

interface PageLogsProps {
	accent: string;
}

interface PageAtividadeProps {
	accent: string;
}

interface PageConfigProps {
	accent: string;
}

interface ConfigRowProps {
	label: string;
	desc: string;
	enabled: boolean;
}

// Outras páginas: Conteúdo, Clientes, Usuários, Logs, Config, Atividade
export function PageConteudo({ accent }: PageConteudoProps) {
	return (
		<PageContainer>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: 20,
				}}
			>
				<div className="label-eyebrow">
					— Editor do site público optare.com.br
				</div>
				<button className="btn-primary">
					<Ic.Plus size={14} /> Nova seção
				</button>
			</div>
			<div className="card-pop table-scroll">
				<table
					style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
				>
					<thead>
						<tr
							style={{
								borderBottom: "1px solid var(--border)",
								background: "var(--bg-2)",
							}}
						>
							{["Seção", "Título", "Última atualização", "Autor", ""].map(
								(h) => (
									<th
										key={h}
										style={{
											padding: "12px 14px",
											textAlign: "left",
											fontSize: 10,
											textTransform: "uppercase",
											color: "var(--muted)",
											letterSpacing: ".08em",
										}}
									>
										{h}
									</th>
								),
							)}
						</tr>
					</thead>
					<tbody>
						{SEED.conteudo.map((c, i) => (
							<tr
								key={c.id}
								style={{
									borderBottom:
										i < SEED.conteudo.length - 1
											? "1px solid var(--border)"
											: "none",
								}}
							>
								<td style={{ padding: "14px" }}>
									<span className="chip red">{c.secao}</span>
								</td>
								<td style={{ padding: "14px", fontWeight: 600 }}>{c.titulo}</td>
								<td style={{ padding: "14px", color: "var(--muted)" }}>
									{c.atualizado}
								</td>
								<td style={{ padding: "14px", color: "var(--muted)" }}>
									{c.autor}
								</td>
								<td
									style={{
										padding: "14px",
										textAlign: "right",
										whiteSpace: "nowrap",
									}}
								>
									<div style={{ display: "inline-flex", gap: 4 }}>
										<button
											className="btn-ghost"
											style={{ padding: 6, border: "1px solid var(--border)" }}
										>
											<Ic.Eye size={12} />
										</button>
										<button
											className="btn-ghost"
											style={{ padding: 6, border: "1px solid var(--border)" }}
										>
											<Ic.Edit size={12} />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</PageContainer>
	);
}

export function PageClientes({ accent }: PageClientesProps) {
	return (
		<PageContainer>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: 20,
					gap: 12,
					flexWrap: "wrap",
					alignItems: "center",
				}}
			>
				<div className="label-eyebrow">
					— {SEED.clientes.length} clientes ativos · sincronizados com o site
				</div>
				<button
					className="btn-primary"
					style={{ whiteSpace: "nowrap", flexShrink: 0 }}
				>
					<Ic.Plus size={14} /> Adicionar cliente
				</button>
			</div>
			<div
				className="grid-cards-sm"
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
					gap: 14,
				}}
			>
				{SEED.clientes.map((c) => (
					<div key={c.id} className="card-pop" style={{ padding: 18 }}>
						<div
							style={{
								width: 40,
								height: 40,
								background: "var(--card-2)",
								display: "grid",
								placeItems: "center",
								color: "var(--primary)",
								border: "1px solid var(--border)",
								marginBottom: 12,
								fontSize: 13,
								fontWeight: 700,
							}}
						>
							{c.nome
								.split(" ")
								.map((s) => s[0])
								.slice(0, 2)
								.join("")}
						</div>
						<div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
							{c.nome}
						</div>
						<div
							style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12 }}
						>
							{c.setor}
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								fontSize: 10,
								color: "var(--muted)",
								borderTop: "1px solid var(--border)",
								paddingTop: 10,
							}}
						>
							<span>{c.projetos} projetos</span>
							<button
								className="btn-ghost"
								style={{ padding: "2px 6px", fontSize: 10 }}
							>
								Ver
							</button>
						</div>
					</div>
				))}
			</div>
		</PageContainer>
	);
}

export function PageUsuarios({ accent }: PageUsuariosProps) {
	return (
		<PageContainer>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: 20,
					gap: 12,
					flexWrap: "wrap",
					alignItems: "center",
				}}
			>
				<div className="label-eyebrow">
					— {SEED.usuarios.filter((u) => u.ativo).length} usuários ativos ·{" "}
					{SEED.usuarios.length} total
				</div>
				<button
					className="btn-primary"
					style={{ whiteSpace: "nowrap", flexShrink: 0 }}
				>
					<Ic.Plus size={14} /> Convidar usuário
				</button>
			</div>
			<div className="card-pop table-scroll">
				<table
					style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
				>
					<thead>
						<tr
							style={{
								borderBottom: "1px solid var(--border)",
								background: "var(--bg-2)",
							}}
						>
							{[
								"Usuário",
								"E-mail",
								"Cargo",
								"Perfil",
								"Último acesso",
								"Status",
							].map((h) => (
								<th
									key={h}
									style={{
										padding: "12px 14px",
										textAlign: "left",
										fontSize: 10,
										textTransform: "uppercase",
										color: "var(--muted)",
										letterSpacing: ".08em",
									}}
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{SEED.usuarios.map((u, i) => (
							<tr
								key={u.id}
								style={{
									borderBottom:
										i < SEED.usuarios.length - 1
											? "1px solid var(--border)"
											: "none",
								}}
							>
								<td
									style={{
										padding: "12px 14px",
										display: "flex",
										alignItems: "center",
										gap: 10,
									}}
								>
									<div
										style={{
											width: 28,
											height: 28,
											background: "var(--card-2)",
											border: "1px solid var(--border)",
											display: "grid",
											placeItems: "center",
											fontSize: 10,
											fontWeight: 700,
											color: "var(--primary)",
										}}
									>
										{u.nome
											.split(" ")
											.map((s) => s[0])
											.slice(0, 2)
											.join("")}
									</div>
									<span style={{ fontWeight: 600 }}>{u.nome}</span>
								</td>
								<td style={{ padding: "12px 14px", color: "var(--muted)" }}>
									{u.email}
								</td>
								<td style={{ padding: "12px 14px", color: "var(--muted)" }}>
									{u.cargo}
								</td>
								<td style={{ padding: "12px 14px" }}>
									<span
										className={
											"chip " +
											(u.perfil === "admin"
												? "red"
												: u.perfil === "editor"
													? "warn"
													: "")
										}
									>
										{u.perfil}
									</span>
								</td>
								<td style={{ padding: "12px 14px", color: "var(--muted)" }}>
									{u.ultimo}
								</td>
								<td style={{ padding: "12px 14px" }}>
									<span className={"chip " + (u.ativo ? "green" : "")}>
										{u.ativo ? "ativo" : "inativo"}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</PageContainer>
	);
}

export function PageLogs({ accent }: PageLogsProps) {
	return (
		<PageContainer>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: 20,
				}}
			>
				<div className="label-eyebrow">
					— Histórico completo · todas as ações registradas
				</div>
				<div style={{ display: "flex", gap: 8 }}>
					<button className="btn-ghost">
						<Ic.Filter size={13} /> Filtrar
					</button>
					<button className="btn-ghost">
						<Ic.Download size={13} /> Exportar
					</button>
				</div>
			</div>
			<div className="card-pop">
				{SEED.logs.map((l, i) => {
					const tcolor = {
						email: "var(--muted)",
						upload: "var(--info)",
						proposta: "var(--primary)",
						sistema: "var(--muted)",
						produto: "var(--warn)",
						conteudo: "var(--success)",
						auth: "var(--muted-2)",
					}[l.tipo];
					return (
						<div
							key={l.id}
							style={{
								padding: "14px 20px",
								display: "flex",
								alignItems: "center",
								gap: 16,
								borderBottom:
									i < SEED.logs.length - 1 ? "1px solid var(--border)" : "none",
							}}
						>
							<span
								style={{
									fontSize: 11,
									color: "var(--muted)",
									fontVariantNumeric: "tabular-nums",
									width: 60,
								}}
							>
								2026-05-07
							</span>
							<span
								style={{
									fontSize: 11,
									color: "var(--muted)",
									fontVariantNumeric: "tabular-nums",
									width: 50,
									fontWeight: 600,
								}}
							>
								{l.hora}
							</span>
							<span
								className="chip"
								style={{
									borderColor: tcolor ?? "var(--muted)",
									color: tcolor ?? "var(--muted)",
									textTransform: "uppercase",
									minWidth: 80,
									justifyContent: "center",
								}}
							>
								{l.tipo}
							</span>
							<span style={{ fontSize: 12, flex: 1 }}>{l.acao}</span>
							<span style={{ fontSize: 11, color: "var(--muted)" }}>
								{l.user}
							</span>
						</div>
					);
				})}
			</div>
		</PageContainer>
	);
}

export function PageConfig({ accent }: PageConfigProps) {
	return (
		<PageContainer>
			<div
				className="grid-2col"
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: 16,
					maxWidth: 1100,
				}}
			>
				<div className="card-pop" style={{ padding: 22 }}>
					<div className="label-eyebrow">— Empresa</div>
					<h3
						style={{
							fontSize: 15,
							fontWeight: 700,
							marginTop: 6,
							marginBottom: 14,
						}}
					>
						Dados da Optare
					</h3>
					<div style={{ display: "grid", gap: 12 }}>
						<Field label="Razão social" value="Optare Engenharia LTDA" />
						<Field label="CNPJ" value="11.222.333/0001-44" />
						<Field
							label="Endereço"
							value="Praça Osvaldo Cruz, nº 15 - Sala 213, Porto Alegre/RS"
						/>
						<Field
							label="E-mail principal"
							value="administrativo@optare.com.br"
						/>
						<Field label="WhatsApp" value="+55 51 99865-5612" />
					</div>
				</div>
				<div className="card-pop" style={{ padding: 22 }}>
					<div className="label-eyebrow">— Sistema</div>
					<h3
						style={{
							fontSize: 15,
							fontWeight: 700,
							marginTop: 6,
							marginBottom: 14,
						}}
					>
						Preferências e segurança
					</h3>
					<div style={{ display: "grid", gap: 12 }}>
						<ConfigRow
							label="Backup automático"
							desc="Diário às 03:00"
							enabled
						/>
						<ConfigRow
							label="Autenticação 2FA"
							desc="Obrigatória para admins"
							enabled
						/>
						<ConfigRow
							label="Notificações por e-mail"
							desc="Resumo diário às 8h"
							enabled
						/>
						<ConfigRow
							label="Modo manutenção do site"
							desc="Esconde o site público"
							enabled={false}
						/>
						<ConfigRow
							label="Sincronizar Google Calendar"
							desc="Visitas técnicas e reuniões"
							enabled
						/>
					</div>
				</div>
			</div>
		</PageContainer>
	);
}

export function ConfigRow({
	label,
	desc,
	enabled: initEnabled,
}: ConfigRowProps) {
	const [on, setOn] = React.useState(initEnabled);
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				gap: 14,
				padding: "8px 0",
				borderBottom: "1px dashed var(--border)",
			}}
		>
			<div>
				<div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>
				<div style={{ fontSize: 11, color: "var(--muted)" }}>{desc}</div>
			</div>
			<button
				onClick={() => setOn(!on)}
				style={{
					width: 38,
					height: 22,
					minHeight: 22,
					flexShrink: 0,
					background: on ? "var(--primary)" : "var(--bg-3)",
					border: "1px solid var(--border-2)",
					position: "relative",
					cursor: "pointer",
					padding: 0,
				}}
			>
				<span
					style={{
						position: "absolute",
						top: 2,
						left: on ? 18 : 2,
						width: 14,
						height: 14,
						background: "#fff",
						transition: "left .15s",
					}}
				></span>
			</button>
		</div>
	);
}

export function PageAtividade({ accent }: PageAtividadeProps) {
	return (
		<PageContainer>
			<div className="label-eyebrow" style={{ marginBottom: 14 }}>
				— Tempo real · todas as ações de hoje
			</div>
			<div className="card-pop">
				{SEED.logs.map((l, i) => {
					const tcolor = {
						email: "var(--muted)",
						upload: "var(--info)",
						proposta: "var(--primary)",
						sistema: "var(--muted)",
						produto: "var(--warn)",
						conteudo: "var(--success)",
						auth: "var(--muted-2)",
					}[l.tipo];
					return (
						<div
							key={l.id}
							style={{
								padding: "14px 20px",
								display: "flex",
								alignItems: "center",
								gap: 16,
								borderBottom:
									i < SEED.logs.length - 1 ? "1px solid var(--border)" : "none",
							}}
						>
							<span
								style={{
									fontSize: 11,
									color: "var(--muted)",
									fontVariantNumeric: "tabular-nums",
									width: 50,
									fontWeight: 600,
								}}
							>
								{l.hora}
							</span>
							<span
								style={{
									width: 8,
									height: 8,
									background: tcolor ?? "var(--muted)",
									flexShrink: 0,
								}}
							></span>
							<span style={{ fontSize: 12, flex: 1 }}>{l.acao}</span>
							<span style={{ fontSize: 11, color: "var(--muted)" }}>
								{l.user}
							</span>
						</div>
					);
				})}
			</div>
		</PageContainer>
	);
}
