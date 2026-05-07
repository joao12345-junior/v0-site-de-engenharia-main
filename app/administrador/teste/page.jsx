"use client";

import { useState, useEffect } from "react";

const PAGE_META = {
	dashboard: {
		title: "Dashboard",
		subtitle: "Visão geral do escritório · 7 de maio de 2026",
		breadcrumb: "Início",
	},
	atividade: {
		title: "Atividade em tempo real",
		subtitle: "Ações registradas hoje",
		breadcrumb: "Início › Atividade",
	},
	projetos: {
		title: "Projetos Futuros",
		subtitle: "Gerencie projetos em desenvolvimento e suas fotos",
		breadcrumb: "Gestão › Projetos",
	},
	produtos: {
		title: "Produtos Futuros",
		subtitle: "Catálogo de produtos em desenvolvimento",
		breadcrumb: "Gestão › Produtos",
	},
	emails: {
		title: "E-mails",
		subtitle: "Caixa de entrada da Optare · administrativo@optare.com.br",
		breadcrumb: "Gestão › E-mails",
	},
	propostas: {
		title: "Propostas",
		subtitle: "Crie, edite e acompanhe propostas comerciais",
		breadcrumb: "Gestão › Propostas",
	},
	conteudo: {
		title: "Conteúdo do Site",
		subtitle: "Edite seções publicadas em optare.com.br",
		breadcrumb: "Site › Conteúdo",
	},
	clientes: {
		title: "Clientes",
		subtitle: "Empresas que confiam na Optare",
		breadcrumb: "Site › Clientes",
	},
	usuarios: {
		title: "Usuários e permissões",
		subtitle: "Equipe com acesso ao painel",
		breadcrumb: "Sistema › Usuários",
	},
	logs: {
		title: "Logs do sistema",
		subtitle: "Histórico completo de ações",
		breadcrumb: "Sistema › Logs",
	},
	config: {
		title: "Configurações",
		subtitle: "Preferências da empresa e do sistema",
		breadcrumb: "Sistema › Configurações",
	},
};

export default function PageAdministrador() {
	const [tweaks, setTweak] = useTweaks(window.__TWEAKS__);
	const [page, setPage] = useState(
		() => location.hash.replace("#", "") || "dashboard",
	);
	const [collapsed, setCollapsed] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [toasts, setToasts] = useState([]);

	// App state
	const [projetos, setProjetos] = useState(SEED.projetosFuturos);
	const [produtos, setProdutos] = useState(SEED.produtosFuturos);
	const [emails, setEmails] = useState(SEED.emails);
	const [propostas, setPropostas] = useState(SEED.propostas);

	// Apply theme
	useEffect(() => {
		document.documentElement.classList.toggle(
			"light",
			tweaks.theme === "light",
		);
		document.documentElement.style.setProperty(
			"--primary",
			tweaks.accent || "#D40C24",
		);
	}, [tweaks]);

	// Hash sync
	useEffect(() => {
		const onHash = () => setPage(location.hash.replace("#", "") || "dashboard");
		window.addEventListener("hashchange", onHash);
		return () => window.removeEventListener("hashchange", onHash);
	}, []);
	useEffect(() => {
		location.hash = page;
	}, [page]);

	// Density
	useEffect(() => {
		document.documentElement.style.fontSize =
			tweaks.density === "compact"
				? "13px"
				: tweaks.density === "spacious"
					? "15px"
					: "14px";
	}, [tweaks.density]);

	// Sidebar style
	useEffect(() => {
		setCollapsed(tweaks.sidebarStyle === "collapsed");
	}, [tweaks.sidebarStyle]);

	// Toast helper exposed globally
	useEffect(() => {
		window.toast = (msg) => {
			const id = Date.now() + Math.random();
			setToasts((t) => [...t, { id, msg }]);
			setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
		};
	}, []);

	const meta = PAGE_META[page] || PAGE_META.dashboard;
	const accent = tweaks.accent || "#D40C24";

	const badges = {
		projetos: projetos.length,
		produtos: produtos.length,
		emails: emails.filter((e) => e.folder === "inbox" && !e.read).length,
		propostas: propostas.filter(
			(p) => p.status === "Em análise" || p.status === "Rascunho",
		).length,
	};

	let body;
	if (page === "dashboard")
		body = <PageDashboard accent={accent} onNav={setPage} />;
	else if (page === "atividade") body = <PageAtividade accent={accent} />;
	else if (page === "projetos")
		body = (
			<PageProjetos
				accent={accent}
				projetos={projetos}
				setProjetos={setProjetos}
			/>
		);
	else if (page === "produtos")
		body = (
			<PageProdutos
				accent={accent}
				produtos={produtos}
				setProdutos={setProdutos}
			/>
		);
	else if (page === "emails")
		body = <PageEmails accent={accent} emails={emails} setEmails={setEmails} />;
	else if (page === "propostas")
		body = (
			<PagePropostas
				accent={accent}
				propostas={propostas}
				setPropostas={setPropostas}
			/>
		);
	else if (page === "conteudo") body = <PageConteudo accent={accent} />;
	else if (page === "clientes") body = <PageClientes accent={accent} />;
	else if (page === "usuarios") body = <PageUsuarios accent={accent} />;
	else if (page === "logs") body = <PageLogs accent={accent} />;
	else if (page === "config") body = <PageConfig accent={accent} />;

	return (
		<>
			<div
				style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}
			>
				<Sidebar
					active={page}
					onNav={setPage}
					collapsed={collapsed}
					badges={badges}
					accent={accent}
					mobileOpen={mobileOpen}
					onMobileClose={() => setMobileOpen(false)}
				/>

				<main
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						minWidth: 0,
					}}
				>
					<Topbar
						title={meta.title}
						subtitle={meta.subtitle}
						breadcrumb={meta.breadcrumb}
						theme={tweaks.theme}
						onTheme={() =>
							setTweak("theme", tweaks.theme === "dark" ? "light" : "dark")
						}
						notifications={badges.emails}
						onMobileMenu={() => setMobileOpen(true)}
					/>
					{page === "emails" ? body : body}
				</main>

				<TweaksPanel title="Tweaks">
					<TweakSection label="Aparência" />
					<TweakRadio
						label="Tema"
						value={tweaks.theme}
						options={[
							{ value: "dark", label: "Escuro" },
							{ value: "light", label: "Claro" },
						]}
						onChange={(v) => setTweak("theme", v)}
					/>
					<TweakColor
						label="Accent"
						value={tweaks.accent}
						options={[
							"#D40C24",
							"#B91C1C",
							"#EF4444",
							"#FB923C",
							"#0EA5E9",
							"#10B981",
						]}
						onChange={(v) => setTweak("accent", v)}
					/>
					<TweakRadio
						label="Densidade"
						value={tweaks.density}
						options={[
							{ value: "compact", label: "Compacto" },
							{ value: "comfortable", label: "Normal" },
							{ value: "spacious", label: "Espaçado" },
						]}
						onChange={(v) => setTweak("density", v)}
					/>
					<TweakRadio
						label="Sidebar"
						value={tweaks.sidebarStyle}
						options={[
							{ value: "expanded", label: "Expandida" },
							{ value: "collapsed", label: "Recolhida" },
						]}
						onChange={(v) => setTweak("sidebarStyle", v)}
					/>
				</TweaksPanel>

				<div className="toast-stack">
					{toasts.map((t) => (
						<div key={t.id} className="toast">
							{t.msg}
						</div>
					))}
				</div>
			</div>
		</>
	);
}
