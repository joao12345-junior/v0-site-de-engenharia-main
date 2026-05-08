import { useState } from "react";
import { PageContainer } from "./lib/shell";
import { Field } from "./components/field";

interface PageConfigProps {
	accent: string;
}

interface ConfigRowProps {
	label: string;
	desc: string;
	enabled: boolean;
}

function ConfigRow({ label, desc, enabled: initEnabled }: ConfigRowProps) {
	const [on, setOn] = useState(initEnabled);
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
