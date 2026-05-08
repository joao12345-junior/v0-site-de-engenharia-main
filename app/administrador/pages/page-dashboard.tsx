// page-dashboard.tsx
// Arquivo convertido de page-dashboard.jsx com todos os erros TypeScript corrigidos.
//
// ERROS CORRIGIDOS:
//   ✅ Componente Stat: parâmetros posicionais → objeto de props com interface
//   ✅ 'I' not defined: icon: I → icon: Icon (nome legível + válido)
//   ✅ Implicit any nos callbacks: tipagem explícita com interfaces
//   ✅ Index signature: series sem tipo → as const + Record<Serie, string>
//   ✅ fmtBRL: definida localmente como função utilitária tipada
//   ✅ ActivityChart com tipo próprio (não reusa PageDashboardProps)
//   ✅ window.PageDashboard = PageDashboard → REMOVIDO

import { useMemo } from "react";
import { Ic, type IconComponente } from "../lib/icons";
import { SEED } from "../lib/data";
import { PageContainer } from "../lib/shell";
import type { Pagina } from "../lib/types";
// ─── Função utilitária: formatar moeda BRL ────────────────────────────────
// CONCEITO: Intl.NumberFormat
// A API Intl (Internationalisation) do JavaScript formata números, datas e
// textos de acordo com o locale do usuário. Usar Intl é sempre melhor que
// fazer formatação manual ("R$ " + valor.toFixed(2)), porque trata
// corretamente separadores de milhar, decimais, símbolos de moeda etc.
//
// Exemplos:
//   fmtBRL(1234.5)  → "R$ 1.234,50"
//   fmtBRL(0)       → "R$ 0,00"
const formatadorBRL = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});

// Criamos o formatador UMA VEZ fora da função para não recriar a cada chamada.
// Isso é uma micro-otimização de performance — padrão comum no mercado.
export const fmtBRL = (valor: number): string => formatadorBRL.format(valor);

// ─── Tipos e Interfaces ───────────────────────────────────────────────────

// Dados de atividade semanal (para o gráfico ActivityChart)
interface DadoAtividade {
	semana: string;
	emails: number;
	propostas: number;
	projetos: number;
}

// CONCEITO: Props de componentes React em TypeScript
// Toda interface de props deve ser específica para o componente.
// Evite reusar props de um componente para outro — cada um tem sua "forma".
interface StatProps {
	label: string;
	// CONCEITO: Union type para aceitar number OU string
	// O valor pode ser "R$ 45k" (string) ou 7 (number)
	value: number | string;
	sub: string;
	accent?: string; // "?" = opcional
	icon?: IconComponente;
}

interface MiniSparkProps {
	data: number[];
	accent: string;
}

interface ActivityChartProps {
	// CONCEITO: Por que criar uma interface separada?
	// Antes, alguém tipou ActivityChart com PageDashboardProps, que tem 'onNav'.
	// ActivityChart não recebe 'onNav' — logo, TypeScript reclamava que 'onNav'
	// estava faltando sempre que ActivityChart era usado.
	// Cada componente = sua própria interface de props.
	data: DadoAtividade[];
	accent: string;
}

interface PageDashboardProps {
	accent: string;
	onNav: (pagina: Pagina) => void;
}

// Tipo para o mapeamento de ações rápidas
interface AcaoRapida {
	id: Pagina;
	label: string;
	icon: IconComponente;
}

// ─── Componente: Stat ─────────────────────────────────────────────────────
// CORREÇÃO 1: Parâmetros posicionais → objeto de props desestruturado
//
// ANTES (errado):
//   function Stat(label: any, value: number, sub: string, accent: string, icon: typeof Ic)
//   React chama: Stat({ label, value, ... }) → label recebe o objeto INTEIRO
//
// DEPOIS (correto):
//   function Stat({ label, value, sub, accent, icon }: StatProps)
//   React chama: Stat({ label, value, ... }) → cada variável recebe seu valor
//
// CORREÇÃO 2: Renomear icon: I → icon: Icon
// O TypeScript/JSX exige que variáveis usadas como componentes (<Variavel/>)
// comecem com MAIÚSCULA. "I" funciona tecnicamente, mas "Icon" é mais legível.
// A sintaxe "icon: Icon" na desestruturação significa:
//   "pegue a prop 'icon' e chame-a de 'Icon' localmente nesta função"
function Stat({ label, value, sub, accent, icon: Icon }: StatProps) {
	return (
		<div
			className="card-pop"
			style={{ padding: 18, position: "relative", overflow: "hidden" }}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-start",
					marginBottom: 10,
				}}
			>
				<div
					className="label-eyebrow"
					style={{ color: accent || "var(--primary)" }}
				>
					{label}
				</div>
				{/* Icon existe? Renderiza. Não existe? Nada. Isso é "short-circuit evaluation" */}
				{Icon && <Icon size={16} stroke={1.6} />}
			</div>
			<div
				style={{
					fontSize: 32,
					fontWeight: 700,
					lineHeight: 1,
					marginBottom: 8,
					letterSpacing: "-0.02em",
				}}
			>
				{value}
			</div>
			<div style={{ fontSize: 11, color: "var(--muted)" }}>{sub}</div>
		</div>
	);
}

// ─── Componente: MiniSpark ────────────────────────────────────────────────
function MiniSpark({ data, accent }: MiniSparkProps) {
	const max = Math.max(...data);
	const w = 200,
		h = 50;
	const step = w / (data.length - 1);

	// CORREÇÃO: Tipagem explícita nos callbacks de .map()
	// Antes: data.map((v, i) => ...) → v e i eram 'any' (implicit any)
	// Depois: data.map((v: number, i: number) => ...) → TypeScript sabe os tipos
	const points = data
		.map((v: number, i: number) => `${i * step},${h - (v / max) * h}`)
		.join(" ");
	const areaPoints = `0,${h} ${points} ${w},${h}`;

	return (
		<svg
			width="100%"
			height={h}
			viewBox={`0 0 ${w} ${h}`}
			preserveAspectRatio="none"
			style={{ display: "block" }}
		>
			<polyline points={areaPoints} fill={accent} opacity="0.12" />
			<polyline points={points} fill="none" stroke={accent} strokeWidth="2" />
			{data.map((v: number, i: number) => (
				<circle
					key={i}
					cx={i * step}
					cy={h - (v / max) * h}
					r="1.5"
					fill={accent}
				/>
			))}
		</svg>
	);
}

// ─── Componente: ActivityChart ────────────────────────────────────────────
function ActivityChart({ data, accent }: ActivityChartProps) {
	const w = 760,
		h = 220,
		pad = { l: 32, r: 12, t: 12, b: 28 };
	const cw = w - pad.l - pad.r,
		ch = h - pad.t - pad.b;

	// CORREÇÃO: "as const" para arrays de string
	//
	// SEM as const: const series = ['emails', 'propostas', 'projetos']
	//               TypeScript infere: string[]
	//               Quando você faz colors[s], TypeScript reclama porque
	//               um 'string' genérico pode ser QUALQUER string, incluindo
	//               'banana', que não existe em colors.
	//
	// COM as const: const series = ['emails', 'propostas', 'projetos'] as const
	//               TypeScript infere: readonly ['emails', 'propostas', 'projetos']
	//               Agora s só pode ser 'emails' | 'propostas' | 'projetos'
	//               e TypeScript sabe que todos existem em colors. ✅
	const series = ["emails", "propostas", "projetos"] as const;

	// CONCEITO: typeof + keyof para criar tipos derivados
	// Serie = 'emails' | 'propostas' | 'projetos'
	// Extraído AUTOMATICAMENTE do array — sem duplicar a informação!
	type Serie = (typeof series)[number];

	// CONCEITO: Record<K, V>
	// Record<Serie, string> significa: um objeto que tem EXATAMENTE as chaves
	// definidas em Serie, e cada valor é string.
	// TypeScript verifica se você colocou todas as chaves — segurança total.
	const colors: Record<Serie, string> = {
		emails: "var(--muted)",
		propostas: accent,
		projetos: "var(--info)",
	};

	// CORREÇÃO: data.flatMap com tipos explícitos
	// d: DadoAtividade → TypeScript sabe que d.emails, d.propostas, d.projetos existem
	// s: Serie → TypeScript sabe que d[s] é válido (todos os campos são number)
	const max = Math.max(
		...data.flatMap((d: DadoAtividade) => series.map((s) => d[s])),
	);
	const step = cw / (data.length - 1);

	return (
		<div className="card-pop" style={{ padding: 20 }}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: 16,
				}}
			>
				<div>
					<div className="label-eyebrow">— Últimas 12 semanas</div>
					<h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 6 }}>
						Atividade do escritório
					</h3>
				</div>
				<div style={{ display: "flex", gap: 14, fontSize: 11 }}>
					{series.map((s) => (
						<div
							key={s}
							style={{ display: "flex", alignItems: "center", gap: 6 }}
						>
							<span style={{ width: 10, height: 2, background: colors[s] }} />
							<span
								style={{ textTransform: "capitalize", color: "var(--muted)" }}
							>
								{s}
							</span>
						</div>
					))}
				</div>
			</div>
			<svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
				{[0, 0.25, 0.5, 0.75, 1].map((t) => (
					<g key={t}>
						<line
							x1={pad.l}
							y1={pad.t + ch * t}
							x2={pad.l + cw}
							y2={pad.t + ch * t}
							stroke="var(--border)"
							strokeDasharray="2 4"
						/>
						<text
							x={pad.l - 6}
							y={pad.t + ch * t + 4}
							fontSize="9"
							fill="var(--muted)"
							textAnchor="end"
						>
							{Math.round(max * (1 - t))}
						</text>
					</g>
				))}
				{series.map((s) => {
					const pts = data
						.map(
							(d: DadoAtividade, i: number) =>
								`${pad.l + i * step},${pad.t + ch - (d[s] / max) * ch}`,
						)
						.join(" ");
					return (
						<polyline
							key={s}
							points={pts}
							fill="none"
							stroke={colors[s]}
							strokeWidth="1.8"
						/>
					);
				})}
				{data.map((d: DadoAtividade, i: number) =>
					series.map((s) => (
						<circle
							key={s + i}
							cx={pad.l + i * step}
							cy={pad.t + ch - (d[s] / max) * ch}
							r="2"
							fill={colors[s]}
						/>
					)),
				)}
				{data.map((d: DadoAtividade, i: number) => (
					<text
						key={i}
						x={pad.l + i * step}
						y={h - 8}
						fontSize="9"
						fill="var(--muted)"
						textAnchor="middle"
					>
						{d.semana}
					</text>
				))}
			</svg>
		</div>
	);
}

// ─── Componente principal: PageDashboard ──────────────────────────────────
// CONCEITO: export nomeado vs export default
// "export function" (nomeado) → quem importa usa: import { PageDashboard } from "./page-dashboard"
// "export default" → quem importa usa: import PageDashboard from "./page-dashboard"
//
// Para componentes de página em sub-arquivos, export nomeado é preferível
// porque é mais explícito e o IDE autocompleta melhor.
export function PageDashboard({ accent, onNav }: PageDashboardProps) {
	const tot = SEED;

	// CONCEITO: useMemo
	// useMemo memoriza o resultado de um cálculo pesado entre renderizações.
	// Só recalcula quando as dependências ([tot.emails, tot.propostas]) mudam.
	// Aqui o benefício é pequeno (filtros simples), mas é boa prática para
	// cálculos que dependem de arrays grandes.
	const estatisticas = useMemo(() => {
		const inboxNovos = tot.emails.filter(
			(e) => e.folder === "inbox" && !e.read,
		).length;
		const propostasPendentes = tot.propostas.filter(
			(p) => p.status === "Em análise",
		).length;
		const receitaAprovada = tot.propostas
			.filter((p) => p.status === "Aprovada")
			.reduce((soma, p) => soma + p.valor, 0);

		return { inboxNovos, propostasPendentes, receitaAprovada };
	}, [tot.emails, tot.propostas]);

	// Ações rápidas tipadas
	const acoesRapidas: AcaoRapida[] = [
		{ id: "projetos", label: "Subir foto", icon: Ic.Upload },
		{ id: "emails", label: "Novo e-mail", icon: Ic.Send },
		{ id: "propostas", label: "Nova proposta", icon: Ic.Doc },
		{ id: "produtos", label: "Novo produto", icon: Ic.Box },
		{ id: "conteudo", label: "Editar site", icon: Ic.Globe },
		{ id: "usuarios", label: "Convidar", icon: Ic.User },
	];

	// Mapa de cores por tipo de log
	// CONCEITO: Record para lookup rápido
	// Em vez de um if/else ou switch, usamos um objeto como "dicionário".
	// Isso é O(1) — acesso instantâneo independente do tamanho.
	// Preferível a arrays para lookups. Lembre-se: HashSet/HashMap em vez de arrays!
	const corPorTipoLog: Record<string, string> = {
		email: "var(--muted)",
		upload: "var(--info)",
		proposta: "var(--primary)",
		sistema: "var(--muted)",
		produto: "var(--warn)",
		conteudo: "var(--success)",
		auth: "var(--muted-2)",
	};

	return (
		<PageContainer>
			{/* Grade de estatísticas */}
			<div
				className="grid-stat-4"
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(4, 1fr)",
					gap: 16,
					marginBottom: 20,
				}}
			>
				<Stat
					label="Projetos Ativos"
					value={tot.projetosFuturos.length}
					sub={`+2 este mês · ${tot.projetosFuturos.filter((p) => p.status === "Aprovação").length} em aprovação`}
					accent={accent}
					icon={Ic.Folder}
				/>
				<Stat
					label="Propostas Pendentes"
					value={estatisticas.propostasPendentes}
					sub={`${tot.propostas.filter((p) => p.status === "Aprovada").length} aprovadas no trimestre`}
					accent={accent}
					icon={Ic.Doc}
				/>
				<Stat
					label="Inbox"
					value={estatisticas.inboxNovos}
					sub={`não lidos · ${tot.emails.filter((e) => e.folder === "inbox").length} no total`}
					accent={accent}
					icon={Ic.Mail}
				/>
				<Stat
					label="Receita Aprovada"
					value={"R$ " + (estatisticas.receitaAprovada / 1000).toFixed(0) + "k"}
					sub="propostas aprovadas · 90d"
					accent={accent}
					icon={Ic.Activity}
				/>
			</div>

			{/* Gráfico + ações rápidas */}
			<div
				className="grid-2-1"
				style={{
					display: "grid",
					gridTemplateColumns: "2fr 1fr",
					gap: 16,
					marginBottom: 20,
				}}
			>
				<ActivityChart data={tot.atividade} accent={accent} />

				<div className="card-pop" style={{ padding: 20 }}>
					<div className="label-eyebrow">— Acessos rápidos</div>
					<h3
						style={{
							fontSize: 16,
							fontWeight: 700,
							marginTop: 6,
							marginBottom: 14,
						}}
					>
						Ações
					</h3>
					<div
						style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
					>
						{acoesRapidas.map((acao) => {
							// CORREÇÃO: Antes era "const I = a.icon" e usava <I size={16}/>
							// que causava "Cannot find name 'I'" quando a tipagem mudava.
							// Agora: "const Icon = acao.icon" — nome descritivo e em maiúscula.
							// Em TSX, componentes DEVEM começar com maiúscula.
							const Icon = acao.icon;
							return (
								<button
									key={acao.label}
									onClick={() => onNav(acao.id)}
									className="btn-ghost"
									style={{
										padding: 14,
										display: "flex",
										flexDirection: "column",
										alignItems: "flex-start",
										gap: 8,
										border: "1px solid var(--border)",
										textAlign: "left",
									}}
								>
									<Icon size={16} />
									<span style={{ fontSize: 12 }}>{acao.label}</span>
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{/* Últimas ações + propostas pendentes */}
			<div
				className="grid-2-1"
				style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}
			>
				{/* Últimas atividades */}
				<div className="card-pop">
					<div
						style={{
							padding: "16px 20px",
							borderBottom: "1px solid var(--border)",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<div>
							<div className="label-eyebrow">— Tempo real</div>
							<h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>
								Últimas ações
							</h3>
						</div>
						<button
							onClick={() => onNav("logs")}
							className="btn-ghost"
							style={{
								fontSize: 11,
								padding: "5px 10px",
								border: "1px solid var(--border)",
							}}
						>
							Ver todos →
						</button>
					</div>
					<div>
						{tot.logs.slice(0, 7).map((l, i) => {
							// CONCEITO: Acesso seguro a Record<string, string>
							// corPorTipoLog foi tipado como Record<string, string>
							// que aceita qualquer string como chave — sem erro de TypeScript.
							const corTipo = corPorTipoLog[l.tipo] ?? "var(--muted)";
							// "??" é o operador nullish coalescing: se corPorTipoLog[l.tipo]
							// for undefined, usa 'var(--muted)' como fallback.
							return (
								<div
									key={l.id}
									style={{
										padding: "10px 20px",
										display: "flex",
										alignItems: "center",
										gap: 14,
										borderBottom: i < 6 ? "1px solid var(--border)" : "none",
									}}
								>
									<span
										style={{
											fontSize: 11,
											color: "var(--muted)",
											fontVariantNumeric: "tabular-nums",
											width: 40,
										}}
									>
										{l.hora}
									</span>
									<span
										style={{
											width: 6,
											height: 6,
											background: corTipo,
											flexShrink: 0,
										}}
									/>
									<span style={{ fontSize: 12, flex: 1 }}>{l.acao}</span>
									<span style={{ fontSize: 10, color: "var(--muted)" }}>
										{l.user}
									</span>
								</div>
							);
						})}
					</div>
				</div>

				{/* Propostas pendentes */}
				<div className="card-pop">
					<div
						style={{
							padding: "16px 20px",
							borderBottom: "1px solid var(--border)",
						}}
					>
						<div className="label-eyebrow">— Demandam atenção</div>
						<h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>
							Propostas pendentes
						</h3>
					</div>
					<div>
						{tot.propostas
							.filter(
								(p) => p.status === "Em análise" || p.status === "Rascunho",
							)
							.map((p, i, arr) => (
								<div
									key={p.id}
									style={{
										padding: "12px 20px",
										display: "flex",
										alignItems: "center",
										gap: 12,
										borderBottom:
											i < arr.length - 1 ? "1px solid var(--border)" : "none",
									}}
								>
									<div style={{ flex: 1, minWidth: 0 }}>
										<div
											style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}
										>
											{p.numero} · {p.cliente}
										</div>
										<div style={{ fontSize: 10, color: "var(--muted)" }}>
											{p.projeto} · vence {p.vencimento}
										</div>
									</div>
									<div style={{ textAlign: "right" }}>
										<div
											style={{
												fontSize: 12,
												fontWeight: 600,
												fontVariantNumeric: "tabular-nums",
											}}
										>
											{fmtBRL(p.valor)}
										</div>
										<span
											className={
												"chip " + (p.status === "Em análise" ? "warn" : "")
											}
											style={{ fontSize: 9, marginTop: 2 }}
										>
											{p.status}
										</span>
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
		</PageContainer>
	);
}

// REMOVIDO: window.PageDashboard = PageDashboard
// Motivo: No mundo de módulos ES (Next.js), compartilhamos código via
// import/export, não via window. Expor no window é desnecessário e seria
// um vazamento de estado global — má prática em aplicações modernas.
