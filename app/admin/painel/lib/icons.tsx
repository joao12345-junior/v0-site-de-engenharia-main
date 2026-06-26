// /lib/icons.tsx
// CONVERSÃO de icons.jsx para TypeScript
//
// PROBLEMA ORIGINAL: O padrão antigo era:
//   const Ic = {};          ← TypeScript vê um objeto VAZIO, sem propriedades
//   Ic.Folder = make(...);  ← TypeScript não consegue "prever" isso em tempo de compilação
//
// SOLUÇÃO: Definir tudo numa única expressão de objeto, para o TypeScript
//          inferir o tipo automaticamente com todas as propriedades.

import type { ReactElement } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────
// CONCEITO: Tipo do ícone
// Cada ícone retornado por "make" é uma função que aceita props opcionais
// e retorna um elemento SVG (JSX.Element).
//
// O "?" torna cada prop opcional — boa prática para componentes de ícone,
// pois quem usa pode omitir size/stroke e os defaults são aplicados.
export type IconProps = {
	size?: number;
	stroke?: number;
	style?: React.CSSProperties;
	color?: string;
	className?: string;
};

// Tipo de um componente de ícone: função que recebe IconProps e retorna JSX
export type IconComponente = (props?: IconProps) => ReactElement;

// ─── Fábrica de ícones ─────────────────────────────────────────────────────
// CONCEITO: Higher-Order Function (HOF)
// "make" é uma função que RETORNA outra função. Isso é chamado de
// Higher-Order Function (Função de Ordem Superior).
//
// Analogia: "make" é uma fábrica de moldes. Você passa o SVG paths
// e ela devolve um componente React pronto para usar.
//
// Sem TypeScript: const make = (paths, vb='0 0 24 24') => ({size=18, stroke=1.6, ...p}={}) => <svg>...
// Com TypeScript: adicionamos tipos em cada parâmetro
const make =
	(paths: React.ReactNode, vb = "0 0 24 24"): IconComponente =>
	({ size = 18, stroke = 1.6, ...p }: IconProps = {}): ReactElement => (
		<svg
			width={size}
			height={size}
			viewBox={vb}
			fill="none"
			stroke="currentColor"
			strokeWidth={stroke}
			strokeLinecap="square"
			strokeLinejoin="miter"
			{...p}
		>
			{paths}
		</svg>
	);

// ─── Coleção de ícones ────────────────────────────────────────────────────
// MUDANÇA CRÍTICA: Em vez de const Ic = {} + Ic.Folder = make(...)
// usamos um único objeto literal. Isso permite que o TypeScript
// INFIRA automaticamente o tipo de cada propriedade.
//
// export const Ic = { Folder: make(...), Box: make(...), ... }
// TypeScript vê: { Folder: IconComponente, Box: IconComponente, ... }
// E reclama IMEDIATAMENTE se você tentar usar Ic.NaoExiste
export const Ic = {
	// ── Navegação / Layout ─────────────────────────────────────────────────
	Dashboard: make(
		<>
			<rect x="3" y="3" width="7" height="9" />
			<rect x="14" y="3" width="7" height="5" />
			<rect x="14" y="12" width="7" height="9" />
			<rect x="3" y="16" width="7" height="5" />
		</>,
	),
	Drop: make(
		<>
			<path d="M12 3s7 7 7 12a7 7 0 11-14 0c0-5 7-12 7-12z" />
		</>,
	),
	Folder: make(
		<>
			<path d="M3 6h6l2 2h10v11H3z" />
		</>,
	),
	Box: make(
		<>
			<path d="M21 8L12 3 3 8v8l9 5 9-5z" />
			<path d="M3 8l9 5 9-5" />
			<path d="M12 13v8" />
		</>,
	),
	Mail: make(
		<>
			<rect x="3" y="5" width="18" height="14" />
			<path d="M3 7l9 7 9-7" />
		</>,
	),
	Doc: make(
		<>
			<path d="M6 3h9l4 4v14H6z" />
			<path d="M14 3v5h5" />
		</>,
	),
	Users: make(
		<>
			<circle cx="9" cy="8" r="3.5" />
			<path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
			<path d="M16 11a3 3 0 100-6" />
			<path d="M21 19a5 5 0 00-4-5" />
		</>,
	),
	User: make(
		<>
			<circle cx="12" cy="8" r="3.5" />
			<path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
		</>,
	),
	Globe: make(
		<>
			<circle cx="12" cy="12" r="9" />
			<path d="M3 12h18" />
			<path d="M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
		</>,
	),
	Cog: make(
		<>
			<circle cx="12" cy="12" r="3" />
			<path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 01-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3 1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8 1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
		</>,
	),
	Activity: make(
		<>
			<path d="M3 12h4l3-9 4 18 3-9h4" />
		</>,
	),
	// ── Ações ────────────────────────────────────────────────────────────────
	Search: make(
		<>
			<circle cx="11" cy="11" r="7" />
			<path d="M21 21l-4.5-4.5" />
		</>,
	),
	Bell: make(
		<>
			<path d="M6 8a6 6 0 0112 0c0 7 3 7 3 9H3c0-2 3-2 3-9z" />
			<path d="M10 21a2 2 0 004 0" />
		</>,
	),
	Plus: make(
		<>
			<path d="M12 5v14M5 12h14" />
		</>,
	),
	Upload: make(
		<>
			<path d="M21 15v4H3v-4" />
			<path d="M7 9l5-5 5 5" />
			<path d="M12 4v12" />
		</>,
	),
	Send: make(
		<>
			<path d="M22 2L11 13" />
			<path d="M22 2l-7 20-4-9-9-4z" />
		</>,
	),
	// ── Arquivos e documentos ──────────────────────────────────────────────
	Image: make(
		<>
			<rect x="3" y="3" width="18" height="18" />
			<circle cx="9" cy="9" r="2" />
			<path d="M21 15l-5-5-9 9" />
		</>,
	),
	Trash: make(
		<>
			<path d="M3 6h18" />
			<path d="M8 6V4h8v2" />
			<path d="M5 6l1 14h12l1-14" />
			<path d="M10 11v5M14 11v5" />
		</>,
	),
	File: make(
		<>
			<path d="M14 3H6v18h12V7z" />
			<path d="M14 3v4h4" />
		</>,
	),
	Edit: make(
		<>
			<path d="M14 4l6 6L8 22H2v-6z" />
		</>,
	),
	Eye: make(
		<>
			<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
			<circle cx="12" cy="12" r="3" />
		</>,
	),
	Download: make(
		<>
			<path d="M21 15v4H3v-4" />
			<path d="M7 10l5 5 5-5" />
			<path d="M12 4v11" />
		</>,
	),
	// ── Utilitários ────────────────────────────────────────────────────────
	Sun: make(
		<>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1" />
		</>,
	),
	Moon: make(
		<>
			<path d="M21 13a9 9 0 11-10-10 7 7 0 0010 10z" />
		</>,
	),
	Filter: make(
		<>
			<path d="M3 5h18l-7 9v6l-4-2v-4z" />
		</>,
	),
	Check: make(
		<>
			<path d="M5 12l5 5 9-11" />
		</>,
	),
	X: make(
		<>
			<path d="M5 5l14 14M19 5L5 19" />
		</>,
	),
	Copy: make(
		<>
			<rect x="8" y="8" width="13" height="13" />
			<path d="M3 16V3h13" />
		</>,
	),
	Reply: make(
		<>
			<path d="M9 14L3 8l6-6" />
			<path d="M3 8h11a7 7 0 017 7v6" />
		</>,
	),
	Inbox: make(
		<>
			<path d="M3 13l3-9h12l3 9" />
			<path d="M3 13v6h18v-6" />
			<path d="M3 13h5l1 3h6l1-3h5" />
		</>,
	),
	Star: make(
		<>
			<path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9L12 3z" />
		</>,
	),
	Building: make(
		<>
			<rect x="4" y="3" width="16" height="18" />
			<path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
			<path d="M10 21v-3h4v3" />
		</>,
	),
	Tag: make(
		<>
			<path d="M21 12L12 21l-9-9 9-9h9z" />
			<circle cx="16" cy="8" r="1.5" />
		</>,
	),
	Database: make(
		<>
			<ellipse cx="12" cy="5" rx="9" ry="3" />
			<path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5" />
			<path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3" />
		</>,
	),
	Bolt: make(
		<>
			<path d="M13 2L4 14h7l-1 8 9-12h-7z" />
		</>,
	),
	Logout: make(
		<>
			<path d="M9 21H4V3h5" />
			<path d="M16 17l5-5-5-5" />
			<path d="M21 12H10" />
		</>,
	),
	LogIn: make(
		<>
			<path d="M15 3h4v18h-4" />
			<path d="M10 17l5-5-5-5" />
			<path d="M15 12H3" />
		</>,
	),
	Chevron: make(
		<>
			<path d="M9 6l6 6-6 6" />
		</>,
	),
	ChevronDown: make(
		<>
			<path d="M6 9l6 6 6-6" />
		</>,
	),
	More: make(
		<>
			<circle cx="6" cy="12" r="1.4" />
			<circle cx="12" cy="12" r="1.4" />
			<circle cx="18" cy="12" r="1.4" />
		</>,
	),
	MapPin: make(
		<>
			<path d="M12 22s8-7 8-13a8 8 0 10-16 0c0 6 8 13 8 13z" />
			<circle cx="12" cy="9" r="3" />
		</>,
	),
	Calendar: make(
		<>
			<rect x="3" y="5" width="18" height="16" />
			<path d="M3 9h18M8 3v4M16 3v4" />
		</>,
	),
	Link: make(
		<>
			<path d="M10 14a5 5 0 007.1 0l3-3a5 5 0 00-7.1-7.1L11 5" />
			<path d="M14 10a5 5 0 00-7.1 0l-3 3a5 5 0 007.1 7.1L13 19" />
		</>,
	),
	Paperclip: make(
		<>
			<path d="M21 12l-9 9a5 5 0 01-7-7l9-9a3.5 3.5 0 015 5l-9 9a2 2 0 01-3-3l8-8" />
		</>,
	),
	Lock: make(
		<>
			<rect x="4" y="11" width="16" height="10" />
			<path d="M8 11V7a4 4 0 018 0v4" />
		</>,
	),
	Phone: make(
		<>
			<path d="M22 16v3a2 2 0 01-2 2A18 18 0 013 5a2 2 0 012-2h3l2 5-2 2a14 14 0 006 6l2-2 5 2z" />
		</>,
	),
	Shield: make(
		<>
			<path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" />
		</>,
	),
	Flame: make(
		<>
			<path d="M12 2c1 5 6 6 6 11a6 6 0 11-12 0c0-3 2-4 3-6 1 2 2 3 3 5 0-4 0-7 0-10z" />
		</>,
	),
	Bold: make(
		<>
			<path d="M7 4h7a4 4 0 010 8H7zM7 12h8a4 4 0 010 8H7z" />
		</>,
	),
	Italic: make(
		<>
			<path d="M19 4h-9M14 20H5M15 4l-6 16" />
		</>,
	),
};

// CONCEITO: typeof para extrair tipos de valores
// "typeof Ic" é o tipo do objeto Ic inteiro.
// "keyof typeof Ic" são todas as chaves: 'Dashboard' | 'Folder' | 'Box' | ...
// Isso é útil para tipar props que aceitam qualquer ícone:
//   icon: keyof typeof Ic
export type NomeIcone = keyof typeof Ic;
