// app/administrador/_components/page-dashboard.tsx
//
// [MUDANÇA] Simplificado — removidos gráfico de atividade e feed "tempo real".
// Esses dados vinham do SEED (falso) e não refletem nada real do sistema.
// O painel é usado com pouca frequência pelos sócios — não faz sentido ter
// um dashboard com métricas de "atividade da semana" que nunca vão ser reais.
//
// O que ficou: acessos rápidos para as páginas mais usadas.
// Quando houver necessidade de métricas reais (projetos publicados, emails
// não lidos), podem ser adicionadas aqui com queries reais ao banco.

import { Ic, type IconComponente } from "../lib/icons";
import { PageContainer } from "../lib/shell";
import type { Pagina } from "../lib/types";

interface PageDashboardProps {
	accent: string;
	onNav: (pagina: Pagina) => void;
}

interface AcaoRapida {
	id: Pagina;
	label: string;
	desc: string;
	icon: IconComponente;
}

const ACOES: AcaoRapida[] = [
	{
		id: "projetos",
		label: "Projetos",
		desc: "Gerenciar portfólio e fotos",
		icon: Ic.Folder,
	},
	{
		id: "clientes",
		label: "Clientes",
		desc: "Empresas parceiras",
		icon: Ic.Building,
	},
	{
		id: "produtos",
		label: "Produtos",
		desc: "Catálogo de produtos",
		icon: Ic.Box,
	},
	{
		id: "emails",
		label: "E-mails",
		desc: "Mensagens recebidas",
		icon: Ic.Mail,
	},
	{
		id: "conteudo",
		label: "Conteúdo",
		desc: "Editar textos do site",
		icon: Ic.Globe,
	},
	{
		id: "config",
		label: "Configurações",
		desc: "Preferências do sistema",
		icon: Ic.Cog,
	},
];

export function PageDashboard({ accent, onNav }: PageDashboardProps) {
	return (
		<PageContainer>
			{/* Cabeçalho de boas-vindas */}
			<div style={{ marginBottom: 32 }}>
				<div
					style={{
						fontSize: 11,
						color: "var(--muted)",
						textTransform: "uppercase",
						letterSpacing: ".1em",
						marginBottom: 6,
					}}
				>
					— Painel Administrativo
				</div>
				<h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>
					Bem-vindo, Optare
				</h2>
				<p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
					Selecione uma seção para começar.
				</p>
			</div>

			{/* Grade de acessos rápidos */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
					gap: 14,
				}}
			>
				{ACOES.map((acao) => {
					const Icon = acao.icon;
					return (
						<button
							key={acao.id}
							onClick={() => onNav(acao.id)}
							className="card-pop btn-ghost"
							style={{
								padding: 20,
								display: "flex",
								flexDirection: "column",
								alignItems: "flex-start",
								gap: 12,
								textAlign: "left",
								cursor: "pointer",
								border: "1px solid var(--border)",
								transition: "border-color .15s",
							}}
							onMouseEnter={(e) => {
								(e.currentTarget as HTMLElement).style.borderColor = accent;
							}}
							onMouseLeave={(e) => {
								(e.currentTarget as HTMLElement).style.borderColor =
									"var(--border)";
							}}
						>
							<div
								style={{
									width: 36,
									height: 36,
									background: "var(--bg-2)",
									display: "grid",
									placeItems: "center",
									border: "1px solid var(--border)",
								}}
							>
								<Icon size={16} />
							</div>
							<div>
								<div style={{ fontSize: 14, fontWeight: 700 }}>
									{acao.label}
								</div>
								<div
									style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}
								>
									{acao.desc}
								</div>
							</div>
						</button>
					);
				})}
			</div>
		</PageContainer>
	);
}
