"use client";

import { ConfigRow } from "../components/config_role";
import { PageContainer } from "../lib/shell";
import { Field } from "../components/field";
import { useState } from "react";

interface PageConfigProps {
	accent: string;
}

export let isMaintenanceMode = false;

export function PageConfig({ accent }: PageConfigProps) {
	const [enabled, setEnabled] = useState<boolean>(isMaintenanceMode);

	const handlerToggle = async () => {
		try {
			if (enabled) setEnabled(false);
			setEnabled(true);
		} catch (e) {
			console.error(e);
		} finally {
			isMaintenanceMode = enabled;
		}
	};

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
							label="Modo manutenção do site"
							desc="Esconde o site público"
							enabled={enabled}
							onToggle={enabled ? handlerToggle : () => {}}
						/>
					</div>
				</div>
			</div>
		</PageContainer>
	);
}
