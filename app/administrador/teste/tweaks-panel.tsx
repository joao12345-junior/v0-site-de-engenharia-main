// tweaks-panel.tsx
// MUDANÇAS NECESSÁRIAS em relação ao tweaks-panel.jsx:
//
// ✅ ALTERAÇÃO 1: React imports no topo (remover "const { } = React")
// ✅ ALTERAÇÃO 2: Adicionar "export" nas funções públicas
// ✅ ALTERAÇÃO 3: Corrigir a tag <style> no JSX → injetar via useEffect
// ✅ ALTERAÇÃO 4: Remover as linhas "window.useTweaks = useTweaks" (não existem mais)
// ✅ ALTERAÇÃO 5: Adicionar tipos TypeScript nas props

// ─── ANTES (HTML/Babel world): ────────────────────────────────────────────
//   const { useState, useEffect, useRef, useCallback } = React;
//   (React vinha do CDN e era uma variável global)
//
// ─── DEPOIS (Next.js/módulos ES): ─────────────────────────────────────────
import {
	useState,
	useEffect,
	useRef,
	useCallback,
	type ReactNode,
} from "react";

// ─── CONCEITO: Por que importar de "react" em vez de usar React.useState? ─
// No mundo CDN, React é carregado via <script> e fica em window.React.
// No mundo de módulos (Next.js, Vite, etc.), cada arquivo precisa importar
// explicitamente o que usa. Isso tem vantagens:
// 1. Tree-shaking: o bundler inclui apenas o que é importado
// 2. Clareza: fica explícito quais hooks o arquivo usa
// 3. Sem namespace poluído: React.X é mais verboso que apenas X
// ──────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.5);
    border-radius:14px;box-shadow:0 8px 40px rgba(0,0,0,.18),0 1.5px 0 rgba(255,255,255,.6) inset;
    font:13px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
  /* ... restante do CSS permanece igual ... */
`;

// ─── Tipos para useTweaks ─────────────────────────────────────────────────
// CONCEITO: Generic Types (Avançado)
// O "T extends Record<string, unknown>" significa: "T pode ser qualquer tipo
// que seja um objeto com chaves string". Isso torna useTweaks reutilizável
// para qualquer forma de tweaks, não só o nosso Tweaks específico.
type SetTweakFn<T> = (
	keyOrEdits: keyof T | Partial<T>,
	val?: T[keyof T],
) => void;

// ─── Hook: useTweaks ──────────────────────────────────────────────────────
// ALTERAÇÃO: Adicionado "export" no início
// ALTERAÇÃO: Adicionados tipos genéricos <T>
// ALTERAÇÃO: Removido "window.useTweaks = useTweaks" do final
export function useTweaks<T extends object>(defaults: T): [T, SetTweakFn<T>] {
	const [values, setValues] = useState<T>(defaults);

	const setTweak: SetTweakFn<T> = useCallback((keyOrEdits, val) => {
		const edits =
			typeof keyOrEdits === "object" && keyOrEdits !== null
				? (keyOrEdits as Partial<T>)
				: ({ [keyOrEdits]: val } as Partial<T>);

		setValues((prev) => ({ ...prev, ...edits }));
		window.parent.postMessage({ type: "__edit_mode_set_keys", edits }, "*");
	}, []);

	return [values, setTweak];
}

// ─── Tipos das Props dos componentes ─────────────────────────────────────
// CONCEITO: Props tipadas com interface
// Antes: function TweaksPanel({ title, children }) { ... }
//        → TypeScript não sabe o tipo de "title" nem "children"
// Depois: usa interface explícita → TypeScript te avisa se passar props erradas
interface TweaksPanelProps {
	title?: string;
	children?: ReactNode;
}

interface TweakSectionProps {
	label: string;
	children?: ReactNode;
}

interface TweakRowProps {
	label: string;
	value?: unknown;
	children?: ReactNode;
	inline?: boolean;
}

interface TweakRadioOption {
	value: string;
	label: string;
}

interface TweakRadioProps {
	label: string;
	value: string;
	options: TweakRadioOption[];
	onChange: (value: string) => void;
}

interface TweakColorProps {
	label: string;
	value: string;
	options: string[];
	onChange: (value: string) => void;
}

interface TweakToggleProps {
	label: string;
	value: boolean;
	onChange: (value: boolean) => void;
}

// ─── Componente: TweaksPanel ──────────────────────────────────────────────
// ALTERAÇÃO CRÍTICA: A tag <style> foi removida do JSX!
//
// ANTES (causava o erro "Encountered a script tag"):
//   return (
//     <>
//       <style>{__TWEAKS_STYLE}</style>   ← ⛔ React avisa sobre isso
//       <div ref={dragRef} ...>
//
// DEPOIS: injetamos o CSS no <head> via useEffect
// MOTIVO: React não executa <style> e <script> dentro de componentes por
//         questões de segurança (proteção contra XSS). A forma correta de
//         injetar CSS dinâmico é via document.head no useEffect.
//
// ALTERAÇÃO: Adicionado "export" no início
export function TweaksPanel({ title = "Tweaks", children }: TweaksPanelProps) {
	const [open, setOpen] = useState(false);
	const dragRef = useRef<HTMLDivElement>(null);
	const offsetRef = useRef({ x: 16, y: 16 });

	// ── CORREÇÃO: Injetar CSS via useEffect ──────────────────────────────
	// Isso substitui a tag <style>{__TWEAKS_STYLE}</style> no JSX
	useEffect(() => {
		// Verifica se já foi injetado para evitar duplicatas
		if (document.querySelector("style[data-twk]")) return;

		const styleEl = document.createElement("style");
		styleEl.setAttribute("data-twk", "");
		styleEl.textContent = __TWEAKS_STYLE;
		document.head.appendChild(styleEl);

		// Cleanup: remove o style quando o componente é desmontado
		return () => {
			const el = document.querySelector("style[data-twk]");
			if (el) document.head.removeChild(el);
		};
	}, []); // [] = roda uma vez ao montar

	const clampToViewport = useCallback(() => {
		const panel = dragRef.current;
		if (!panel) return;
		const { offsetWidth: w, offsetHeight: h } = panel;
		offsetRef.current = {
			x: Math.min(Math.max(offsetRef.current.x, 0), window.innerWidth - w),
			y: Math.min(Math.max(offsetRef.current.y, 0), window.innerHeight - h),
		};
		panel.style.right = `${offsetRef.current.x}px`;
		panel.style.bottom = `${offsetRef.current.y}px`;
	}, []);

	useEffect(() => {
		if (!open) return;
		clampToViewport();
		if (typeof ResizeObserver === "undefined") {
			window.addEventListener("resize", clampToViewport);
			return () => window.removeEventListener("resize", clampToViewport);
		}
		const ro = new ResizeObserver(clampToViewport);
		ro.observe(document.documentElement);
		return () => ro.disconnect();
	}, [open, clampToViewport]);

	useEffect(() => {
		const onMsg = (e: MessageEvent) => {
			const t = e?.data?.type;
			if (t === "__activate_edit_mode") setOpen(true);
			else if (t === "__deactivate_edit_mode") setOpen(false);
		};
		window.addEventListener("message", onMsg);
		window.parent.postMessage({ type: "__edit_mode_available" }, "*");
		return () => window.removeEventListener("message", onMsg);
	}, []);

	const dismiss = () => {
		setOpen(false);
		window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
	};

	const onDragStart = (e: React.MouseEvent) => {
		const panel = dragRef.current;
		if (!panel) return;
		const r = panel.getBoundingClientRect();
		const sx = e.clientX,
			sy = e.clientY;
		const startRight = window.innerWidth - r.right;
		const startBottom = window.innerHeight - r.bottom;
		const move = (ev: MouseEvent) => {
			offsetRef.current = {
				x: startRight - (ev.clientX - sx),
				y: startBottom - (ev.clientY - sy),
			};
			clampToViewport();
		};
		const up = () => {
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", up);
		};
		window.addEventListener("mousemove", move);
		window.addEventListener("mouseup", up);
	};

	if (!open) return null;

	// NOTA: Sem a tag <style> aqui — foi movida para o useEffect acima
	return (
		<div
			ref={dragRef}
			className="twk-panel"
			data-noncommentable=""
			style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}
		>
			<div className="twk-hd" onMouseDown={onDragStart}>
				<b>{title}</b>
				<button
					className="twk-x"
					aria-label="Fechar tweaks"
					onMouseDown={(e) => e.stopPropagation()}
					onClick={dismiss}
				>
					✕
				</button>
			</div>
			<div className="twk-body">{children}</div>
		</div>
	);
}

// ─── Componentes auxiliares ───────────────────────────────────────────────
// ALTERAÇÃO em todos: adicionado "export" + tipos nas props

export function TweakSection({ label, children }: TweakSectionProps) {
	return (
		<>
			<div className="twk-sect">{label}</div>
			{children}
		</>
	);
}

export function TweakRow({ label, children, inline = false }: TweakRowProps) {
	return (
		<div className={inline ? "twk-row twk-row-inline" : "twk-row"}>
			<label className="twk-label">{label}</label>
			{children}
		</div>
	);
}

export function TweakRadio({
	label,
	value,
	options,
	onChange,
}: TweakRadioProps) {
	return (
		<TweakRow label={label}>
			<div className="twk-chips">
				{options.map((opt) => (
					<button
						key={opt.value}
						className="twk-chip"
						data-on={value === opt.value ? "1" : "0"}
						onClick={() => onChange(opt.value)}
						style={{ background: "var(--bg-3, #f0f0f0)" }}
					>
						<svg viewBox="0 0 13 13" fill="none">
							{value === opt.value && (
								<path
									d="M2.5 6.5L5 9L10.5 3.5"
									stroke="white"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							)}
						</svg>
						<span>
							<i />
							<i />
						</span>
						<span
							style={{
								position: "absolute",
								bottom: 6,
								left: 0,
								right: 0,
								textAlign: "center",
								fontSize: 10,
								fontWeight: 500,
							}}
						>
							{opt.label}
						</span>
					</button>
				))}
			</div>
		</TweakRow>
	);
}

export function TweakColor({
	label,
	value,
	options,
	onChange,
}: TweakColorProps) {
	return (
		<TweakRow label={label}>
			<div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
				{options.map((cor) => (
					<button
						key={cor}
						className="twk-swatch"
						style={{
							background: cor,
							outline: value === cor ? `2px solid ${cor}` : undefined,
							outlineOffset: 2,
						}}
						onClick={() => onChange(cor)}
						title={cor}
					/>
				))}
			</div>
		</TweakRow>
	);
}

export function TweakToggle({ label, value, onChange }: TweakToggleProps) {
	return (
		<TweakRow label={label} inline>
			<button
				role="switch"
				aria-checked={value}
				onClick={() => onChange(!value)}
				style={{
					width: 34,
					height: 18,
					borderRadius: 9,
					background: value ? "var(--primary, #D40C24)" : "var(--bg-3, #ccc)",
					border: "1px solid var(--border, #ddd)",
					position: "relative",
					cursor: "pointer",
					padding: 0,
					flexShrink: 0,
				}}
			>
				<span
					style={{
						position: "absolute",
						top: 2,
						left: value ? 18 : 2,
						width: 12,
						height: 12,
						borderRadius: "50%",
						background: "#fff",
						transition: "left .15s",
					}}
				/>
			</button>
		</TweakRow>
	);
}
