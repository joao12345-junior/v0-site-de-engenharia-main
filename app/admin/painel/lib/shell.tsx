// shell.tsx
// MUDANÇAS NECESSÁRIAS em relação ao shell.jsx:
//
// ✅ ALTERAÇÃO 1: Importar React hooks no topo em vez de desestruturar de React
// ✅ ALTERAÇÃO 2: Importar Ic (icons) do módulo local
// ✅ ALTERAÇÃO 3: Adicionar "export" nas funções públicas
// ✅ ALTERAÇÃO 4: Remover window.Sidebar = Sidebar etc.
// ✅ ALTERAÇÃO 5: Adicionar tipos TypeScript nas props

// ─── Importações ──────────────────────────────────────────────────────────
import { useState, type ReactNode } from "react";
// ALTERAÇÃO: Ic vinha do escopo global (carregado via <script type="text/babel" src="icons.jsx">)
// Agora precisa ser importado do arquivo local (após adicionar export lá também)
import { Ic } from "./icons";
import type { Pagina } from "./types";
import type { IconComponente } from "./icons";

// ─── Tipos das Props ──────────────────────────────────────────────────────

// CONCEITO: Tipando as páginas de navegação
// Importamos o tipo Pagina do arquivo page.tsx (ou definimos em types.ts compartilhado)
// Por simplicidade, usamos string aqui — mas o ideal é importar o union type "Pagina"

interface ContagensBadge {
	projetos: number;
	produtos: number;
	emails: number;
}

interface SidebarProps {
	active: Pagina;
	onNav: (pagina: Pagina) => void;
	collapsed: boolean;
	badges: ContagensBadge;
	accent: string;
	mobileOpen: boolean;
	onMobileClose: () => void;
}

interface TopbarProps {
	title: string;
	subtitle?: string;
	breadcrumb?: string;
	theme: "dark" | "light";
	onTheme: () => void;
	onSearch?: (termo: string) => void;
	notifications?: number;
	onMobileMenu: () => void;
}

interface PageContainerProps {
	children: ReactNode;
	/** Se true, aplica o padding padrão da página. Default: true */
	pad?: boolean;
}

interface ItemNavegacao {
	id: Pagina;
	label: string;
	icon: IconComponente;
	badge?: keyof ContagensBadge; // "?" = presente em alguns, ausente em outros
}

// ─── Grupos de navegação da Sidebar ──────────────────────────────────────
// Extraído como constante fora do componente: não precisa ser re-criado
// a cada renderização (é um dado estático).
// CONCEITO: "Static data outside component" — padrão de performance em React
const GRUPOS_NAV: { title: string; items: ItemNavegacao[] }[] = [
	{
		title: "Visão Geral",
		items: [{ id: "dashboard", label: "Dashboard", icon: Ic.Dashboard }],
	},
	{
		title: "Gestão",
		items: [
			{
				id: "projetos",
				label: "Projetos",
				icon: Ic.Folder,
				badge: "projetos" as keyof ContagensBadge,
			},
			{
				id: "produtos",
				label: "Produtos",
				icon: Ic.Box,
				badge: "produtos" as keyof ContagensBadge,
			},
			{ id: "clientes", label: "Clientes", icon: Ic.Building },
		],
	},
	{
		title: "Site",
		items: [
			{ id: "conteudo", label: "Conteúdo", icon: Ic.Globe },
			{
				id: "emails",
				label: "E-mails",
				icon: Ic.Mail,
				badge: "emails" as keyof ContagensBadge,
			},
		],
	},
	{
		title: "Sistema",
		items: [
			{ id: "usuarios", label: "Usuários", icon: Ic.Users },
			{ id: "logs", label: "Logs", icon: Ic.Database },
			{ id: "config", label: "Configurações", icon: Ic.Cog },
		],
	},
];

// ─── Componente: Sidebar ──────────────────────────────────────────────────
// ALTERAÇÃO: Adicionado "export"
// ANTES: function Sidebar({ ... }) { ... }
//        window.Sidebar = Sidebar;     ← REMOVIDO
export function Sidebar({
	active,
	onNav,
	collapsed,
	badges,
	accent,
	mobileOpen,
	onMobileClose,
}: SidebarProps) {
	return (
		<>
			<aside
				className={"app-sidebar" + (mobileOpen ? " open" : "")}
				style={{
					width: collapsed ? 64 : 248,
					borderRight: "1px solid var(--border)",
					background: "var(--bg-2)",
					display: "flex",
					flexDirection: "column",
					transition: "width .2s, transform .25s",
					flexShrink: 0,
					position: "sticky",
					top: 0,
					height: "100vh",
				}}
			>
				{/* Cabeçalho da sidebar com logo */}
				<div
					style={{
						padding: collapsed ? "20px 0" : "20px 20px",
						borderBottom: "1px solid var(--border)",
						display: "flex",
						alignItems: "center",
						gap: 10,
						justifyContent: collapsed ? "center" : "flex-start",
					}}
				>
					<div
						style={{
							width: 28,
							height: 28,
							background: accent,
							display: "grid",
							placeItems: "center",
							flexShrink: 0,
						}}
					>
						<Ic.Bolt size={14} color="#fff" />
					</div>
					{!collapsed && (
						<span
							style={{
								fontWeight: 800,
								fontSize: 14,
								letterSpacing: "-0.02em",
								color: "var(--fg)",
							}}
						>
							OPTARE
						</span>
					)}
				</div>

				{/* Grupos de navegação */}
				<nav
					style={{
						flex: 1,
						overflowY: "auto",
						padding: collapsed ? "12px 0" : "12px 12px",
					}}
				>
					{GRUPOS_NAV.map((grupo) => (
						<div key={grupo.title} style={{ marginBottom: 20 }}>
							{!collapsed && (
								<div
									style={{
										fontSize: 10,
										fontWeight: 700,
										color: "var(--muted)",
										letterSpacing: ".1em",
										textTransform: "uppercase",
										padding: "0 8px",
										marginBottom: 4,
									}}
								>
									{grupo.title}
								</div>
							)}
							{grupo.items.map((item) => {
								const Icon = item.icon;
								const badgeCount =
									item.badge !== undefined ? badges[item.badge] : 0;
								const isActive = active === item.id;

								return (
									<button
										key={item.id}
										onClick={() => onNav(item.id)}
										style={{
											width: "100%",
											display: "flex",
											alignItems: "center",
											gap: 10,
											padding: collapsed ? "10px 0" : "8px 10px",
											justifyContent: collapsed ? "center" : "flex-start",
											background: isActive ? "var(--card)" : "transparent",
											border: isActive
												? `1px solid var(--border)`
												: "1px solid transparent",
											color: isActive ? "var(--fg)" : "var(--muted)",
											cursor: "pointer",
											fontSize: 13,
											fontWeight: isActive ? 600 : 400,
											borderRadius: 6,
											marginBottom: 2,
											position: "relative",
										}}
									>
										{Icon && <Icon size={15} />}
										{!collapsed && (
											<span style={{ flex: 1, textAlign: "left" }}>
												{item.label}
											</span>
										)}
										{!collapsed && badgeCount > 0 && (
											<span
												style={{
													background: accent,
													color: "#fff",
													fontSize: 9,
													fontWeight: 700,
													padding: "1px 5px",
													minWidth: 16,
													textAlign: "center",
												}}
											>
												{badgeCount}
											</span>
										)}
									</button>
								);
							})}
						</div>
					))}
				</nav>
			</aside>

			{/* Overlay para mobile */}
			<div
				className={"mobile-overlay" + (mobileOpen ? " open" : "")}
				onClick={onMobileClose}
			/>
		</>
	);
}

// ─── Componente: Topbar ───────────────────────────────────────────────────
// ALTERAÇÃO: Adicionado "export"
// REMOVIDO: window.Topbar = Topbar
export function Topbar({
	title,
	subtitle,
	breadcrumb,
	theme,
	onTheme,
	onSearch,
	notifications = 3,
	onMobileMenu,
}: TopbarProps) {
	return (
		<header
			className="app-topbar"
			style={{
				borderBottom: "1px solid var(--border)",
				background: "var(--bg)",
				padding: "14px 28px",
				display: "flex",
				alignItems: "center",
				gap: 20,
				position: "sticky",
				top: 0,
				zIndex: 10,
				backdropFilter: "blur(6px)",
			}}
		>
			<button
				onClick={onMobileMenu}
				className="btn-ghost mobile-menu-btn"
				style={{ padding: 8, border: "1px solid var(--border)", flexShrink: 0 }}
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<path d="M3 6h18M3 12h18M3 18h18" />
				</svg>
			</button>

			<div style={{ flex: 1, minWidth: 0 }}>
				{breadcrumb && (
					<div
						style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}
						className="hide-mobile"
					>
						{breadcrumb}
					</div>
				)}
				<h1
					style={{
						fontSize: 18,
						fontWeight: 700,
						letterSpacing: "-0.02em",
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
					}}
				>
					{title}
				</h1>
				{subtitle && (
					<div
						style={{
							fontSize: 12,
							color: "var(--muted)",
							marginTop: 2,
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
						className="hide-mobile"
					>
						{subtitle}
					</div>
				)}
			</div>

			<div className="topbar-actions" style={{ display: "flex", gap: 10 }}>
				<button
					className="btn-ghost btn-icon-only"
					style={{
						padding: 8,
						border: "1px solid var(--border)",
						position: "relative",
					}}
					title="Notificações"
				>
					<Ic.Bell size={16} />
					{notifications > 0 && (
						<span
							style={{
								position: "absolute",
								top: -4,
								right: -4,
								background: "var(--primary)",
								color: "#fff",
								fontSize: 9,
								padding: "1px 4px",
								minWidth: 16,
								textAlign: "center",
								fontWeight: 700,
							}}
						>
							{notifications}
						</span>
					)}
				</button>

				<button
					className="btn-ghost btn-icon-only"
					style={{ padding: 8, border: "1px solid var(--border)" }}
					onClick={onTheme}
					title="Alternar tema"
				>
					{theme === "dark" ? <Ic.Sun size={16} /> : <Ic.Moon size={16} />}
				</button>
			</div>
		</header>
	);
}

// ─── Componente: PageContainer ────────────────────────────────────────────
// ALTERAÇÃO: Adicionado "export"
// REMOVIDO: window.PageContainer = PageContainer
export function PageContainer({ children, pad = true }: PageContainerProps) {
	return (
		<div
			className={pad ? "page-pad" : ""}
			style={{ padding: pad ? "24px 28px" : 0, flex: 1, overflowY: "auto" }}
		>
			{children}
		</div>
	);
}
