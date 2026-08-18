"use client";
// app/administrador/_components/page-config.tsx

import { ConfigRow } from "../components/config_role";
import { PageContainer } from "../lib/shell";
import { Field } from "../components/field";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface PageConfigProps {
	accent: string;
}

export function PageConfig({ accent }: PageConfigProps) {
	const [maintenance, setMaintenance] = useState(false);
	const [loading, setLoading] = useState(true);
	const [salvando, setSalvando] = useState(false);

	// Carrega o estado atual do banco ao abrir a página
	useEffect(() => {
		fetch("/admin/api/admin/maintenance/")
			.then((r) => r.json())
			.then((data) => setMaintenance(data.maintenance ?? false))
			.catch(console.error)
			.finally(() => setLoading(false));
	}, []);

	const handleToggle = async (novoValor: boolean) => {
		const anterior = maintenance;
		setMaintenance(novoValor); // optimistic update

		const promise = fetch("/admin/api/admin/maintenance/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ enabled: novoValor }),
		})
			.then(async (res) => {
				if (!res.ok) throw new Error("Falha ao salvar configuração.");
			})
			.catch((e) => {
				setMaintenance(anterior); // reverte se falhou
				throw e;
			});

		toast.promise(promise, {
			position: "top-center",
			loading: novoValor
				? "Ativando modo manutenção..."
				: "Desativando modo manutenção...",
			success: novoValor ? "Site em manutenção." : "Site público visível.",
			error: "Erro ao salvar configuração.",
		});
	};

	return (
		<PageContainer>
			<div
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
						{loading ? (
							<div style={{ fontSize: 12, color: "var(--muted)" }}>
								Carregando configurações...
							</div>
						) : (
							<ConfigRow
								label="Modo manutenção do site"
								desc={
									maintenance
										? "Site público oculto — apenas o painel admin está acessível"
										: "Site público visível para todos"
								}
								enabled={maintenance}
								onToggle={salvando ? () => {} : handleToggle}
							/>
						)}
					</div>
				</div>
			</div>
		</PageContainer>
	);
}
