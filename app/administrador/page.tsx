"use client";

// ─── EXPLICAÇÃO: Por que "use client"? ─────────────────────────────────────
// Next.js 13+ (App Router) renderiza componentes no SERVIDOR por padrão.
// Isso significa que window, location, localStorage NÃO existem durante o render.
// "use client" marca este arquivo como um Client Component: ele ainda tem SSR,
// mas o Next.js sabe que precisa hidratar (ativar) no browser.
// ──────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";

// ─── Importações locais ────────────────────────────────────────────────────
// Estas importações só funcionam APÓS adicionar "export" nos outros arquivos.
// Veja o guia MIGRACAO.md para saber exatamente o que alterar em cada arquivo.
import {
	useTweaks,
	TweaksPanel,
	TweakSection,
	TweakRadio,
	TweakColor,
} from "./_components/lib/tweaks-panel";
import { SEED } from "./_components/lib/data";
import { Sidebar, Topbar } from "./_components/lib/shell";
import { PageDashboard } from "./_components/page-dashboard";
import { PageProjetos } from "./_components/page-projetos";
import { PageProdutos } from "./_components/page-produtos";
import { PageEmails } from "./_components/page-emails";
import { PagePropostas } from "./_components/page-propostas";
import {
	PageConteudo,
	PageClientes,
	PageUsuarios,
	PageLogs,
	PageConfig,
	PageAtividade,
} from "./_components/page-outras";
import type { Pagina } from "./_components/lib/types";
import type { Projeto } from "./_components/page-projetos";
import type { Produto } from "./_components/page-produtos";
import type { Proposta } from "./_components/page-propostas";

// ─── Tipos TypeScript ──────────────────────────────────────────────────────
// CONCEITO: Union Types
// Em vez de usar "string" genérico (que aceitaria qualquer coisa),
// definimos exatamente quais valores são válidos para "Pagina".
// O TypeScript vai te avisar se tentar usar "configuracao" (errado)
// em vez de "config" (correto) — antes de rodar o código!
// CONCEITO: Interface vs Type
// Use "interface" quando descrever a "forma" de um objeto (extendable, legível).
// Use "type" para union types, primitivos e aliases.
interface Tweaks {
	theme: "dark" | "light";
	accent: string;
	density: "compact" | "comfortable" | "spacious";
	sidebarStyle: "expanded" | "collapsed";
}

interface MetaPagina {
	title: string;
	subtitle: string;
	breadcrumb: string;
}

interface ContagensBadge {
	projetos: number;
	produtos: number;
	emails: number;
	propostas: number;
}

interface Toast {
	id: number;
	msg: string;
}

// ─── Constante: valores padrão dos tweaks ─────────────────────────────────
// Extraímos os valores padrão para uma constante separada por dois motivos:
// 1. Legibilidade: fica óbvio quais são os valores iniciais
// 2. SSR-safe: não dependemos de window.__TWEAKS__ que não existe no servidor
const TWEAKS_PADRAO: Tweaks = {
	theme: "dark",
	accent: "#D40C24",
	density: "spacious",
	sidebarStyle: "collapsed",
};

// ─── CONCEITO: Record<K, V> ────────────────────────────────────────────────
// Record<Pagina, MetaPagina> significa: "um objeto onde cada chave é do tipo
// Pagina e cada valor é do tipo MetaPagina". É mais seguro que um objeto
// literal porque o TypeScript verifica se TODAS as páginas estão presentes.
const META_PAGINAS: Record<Pagina, MetaPagina> = {
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

// ─── Declaração global de tipos para window ────────────────────────────────
// CONCEITO: Declaration Merging (avançado)
// O TypeScript não sabe que "window.toast" existe — nós adicionamos.
// Isso é chamado de "augmentation" (aumento) do tipo global Window.
// Sem isso, TypeScript reclama: "Property 'toast' does not exist on type Window"
declare global {
	interface Window {
		toast: (msg: string) => void;
	}
}

// ─── Componente principal ──────────────────────────────────────────────────
export default function PaginaAdministrador() {
	// ── Estado dos tweaks ──────────────────────────────────────────────────
	// CORREÇÃO: Antes usava useTweaks(window.__TWEAKS__)
	// PROBLEMA: window não existe no SSR (servidor Node.js)
	// SOLUÇÃO: Passamos TWEAKS_PADRAO como valor inicial seguro.
	// Se quiser ler window.__TWEAKS__ (valores salvos pelo editor), faça isso
	// em um useEffect — que SÓ roda no cliente.
	const [tweaks, setTweak] = useTweaks(TWEAKS_PADRAO);

	// ── Sincronização de tweaks com window.__TWEAKS__ (opcional) ──────────
	// Se o host (editor) definiu window.__TWEAKS__, aplicamos após montar.
	useEffect(() => {
		if (typeof window !== "undefined" && (window as any).__TWEAKS__) {
			const tweaksSalvos = (window as any).__TWEAKS__ as Partial<Tweaks>;
			// Mescla os valores salvos com os padrões
			Object.entries(tweaksSalvos).forEach(([key, value]) => {
				setTweak(key as keyof Tweaks, value as Tweaks[keyof Tweaks]);
			});
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
	// ↑ [] = roda uma única vez ao montar o componente no cliente

	// ── Página ativa ──────────────────────────────────────────────────────
	// CORREÇÃO: Antes usava location.hash diretamente no useState
	// PROBLEMA: location não existe no SSR
	// SOLUÇÃO: Inicializamos com "dashboard" e sincronizamos no useEffect
	const [pagina, setPagina] = useState<Pagina>("dashboard");
	const [collapsed, setCollapsed] = useState(false);
	const [mobileAberto, setMobileAberto] = useState(false);
	const [toasts, setToasts] = useState<Toast[]>([]);

	// ── Estado da aplicação (dados) ────────────────────────────────────────
	const [emails, setEmails] = useState(SEED.emails);
	const [projetos, setProjetos] = useState<Projeto[]>(SEED.projetosFuturos);
	const [produtos, setProdutos] = useState<Produto[]>(SEED.produtosFuturos);
	const [propostas, setPropostas] = useState<Proposta[]>(SEED.propostas);

	// ── Efeito: sincronizar hash da URL ───────────────────────────────────
	// useEffect roda APENAS no cliente, então é 100% seguro usar location aqui.
	useEffect(() => {
		// Lê o hash inicial ao carregar a página
		const paginaHash = location.hash.replace("#", "") as Pagina;
		if (paginaHash) setPagina(paginaHash);

		// Escuta mudanças futuras no hash (navegação pelo browser)
		const aoMudarHash = () => {
			const p = (location.hash.replace("#", "") as Pagina) || "dashboard";
			setPagina(p);
		};
		window.addEventListener("hashchange", aoMudarHash);

		// CONCEITO: Cleanup function
		// Retornar uma função do useEffect registra uma "limpeza" que roda
		// quando o componente é desmontado. Sem isso, o event listener
		// ficaria "pendurado" na memória — memory leak!
		return () => window.removeEventListener("hashchange", aoMudarHash);
	}, []); // [] = roda uma vez ao montar

	// ── Efeito: atualizar URL quando a página muda ────────────────────────
	useEffect(() => {
		location.hash = pagina;
	}, [pagina]);

	// ── Efeito: aplicar tema e cor accent ─────────────────────────────────
	useEffect(() => {
		document.documentElement.classList.toggle(
			"light",
			tweaks.theme === "light",
		);
		document.documentElement.style.setProperty(
			"--primary",
			tweaks.accent || "#D40C24",
		);
	}, [tweaks.theme, tweaks.accent]);
	// ↑ Boa prática: seja específico nas dependências. Antes era [tweaks]
	//   (re-executava para QUALQUER mudança). Agora só roda para theme e accent.

	// ── Efeito: aplicar densidade de layout ───────────────────────────────
	useEffect(() => {
		const tamanhoFonte =
			tweaks.density === "compact"
				? "13px"
				: tweaks.density === "spacious"
					? "15px"
					: "14px";
		document.documentElement.style.fontSize = tamanhoFonte;
	}, [tweaks.density]);

	// ── Efeito: sincronizar sidebar com tweaks ────────────────────────────
	useEffect(() => {
		setCollapsed(tweaks.sidebarStyle === "collapsed");
	}, [tweaks.sidebarStyle]);

	// ── Efeito: expor função toast globalmente ────────────────────────────
	// CONCEITO: Por que expor no window?
	// Permite que outros componentes (que não têm acesso ao estado deste)
	// disparem toasts com window.toast("mensagem"). É uma solução pragmática
	// para comunicação entre componentes distantes na árvore.
	// Em projetos maiores, prefira Zustand, Context API ou um sistema de eventos.
	useEffect(() => {
		window.toast = (msg: string) => {
			const id = Date.now() + Math.random();
			setToasts((t) => [...t, { id, msg }]);
			setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
		};
	}, []); // [] = registra uma vez, pois setToasts (de useState) é estável

	// ── Valores derivados ─────────────────────────────────────────────────
	const meta = META_PAGINAS[pagina] ?? META_PAGINAS.dashboard;
	const accentAtual = tweaks.accent || "#D40C24";

	const badges: ContagensBadge = {
		projetos: projetos.length,
		produtos: produtos.length,
		emails: emails.filter((e) => e.folder === "inbox" && !e.read).length,
		propostas: propostas.filter(
			(p) => p.status === "Em análise" || p.status === "Rascunho",
		).length,
	};

	// ── Renderização da página ativa ───────────────────────────────────────
	// MELHORIA: Antes era uma cadeia de if/else if aninhados.
	// switch/case é mais legível para seleção múltipla.
	// Extraímos em função separada para manter o JSX principal limpo.
	function renderizarPaginaAtiva(): React.ReactNode {
		switch (pagina) {
			case "dashboard":
				return <PageDashboard accent={accentAtual} onNav={setPagina} />;
			case "atividade":
				return <PageAtividade accent={accentAtual} />;
			case "projetos":
				return (
					<PageProjetos
						accent={accentAtual}
						projetos={projetos}
						setProjetos={setProjetos}
					/>
				);
			case "produtos":
				return (
					<PageProdutos
						accent={accentAtual}
						produtos={produtos}
						setProdutos={setProdutos}
					/>
				);
			case "emails":
				return (
					<PageEmails
						accent={accentAtual}
						emails={emails}
						setEmails={setEmails}
					/>
				);
			case "propostas":
				return (
					<PagePropostas
						accent={accentAtual}
						propostas={propostas}
						setPropostas={setPropostas}
					/>
				);
			case "conteudo":
				return <PageConteudo accent={accentAtual} />;
			case "clientes":
				return <PageClientes accent={accentAtual} />;
			case "usuarios":
				return <PageUsuarios accent={accentAtual} />;
			case "logs":
				return <PageLogs accent={accentAtual} />;
			case "config":
				return <PageConfig accent={accentAtual} />;
			default:
				// CONCEITO: Exhaustive check
				// Com union types, o TypeScript garante que tratamos todos os casos.
				// Se adicionar uma nova página em "Pagina" mas esquecer no switch,
				// o TypeScript vai te avisar.
				return <PageDashboard accent={accentAtual} onNav={setPagina} />;
		}
	}

	return (
		<div
			style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}
		>
			{/* Sidebar de navegação */}
			<Sidebar
				active={pagina}
				onNav={setPagina}
				collapsed={collapsed}
				badges={badges}
				accent={accentAtual}
				mobileOpen={mobileAberto}
				onMobileClose={() => setMobileAberto(false)}
			/>

			{/* Área de conteúdo principal */}
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
					onMobileMenu={() => setMobileAberto(true)}
				/>
				{renderizarPaginaAtiva()}
			</main>

			{/* Painel de ajustes visuais (editor mode) */}
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

			{/* Sistema de toasts (notificações temporárias) */}
			<div className="toast-stack">
				{toasts.map((t) => (
					<div key={t.id} className="toast">
						{t.msg}
					</div>
				))}
			</div>
		</div>
	);
}
