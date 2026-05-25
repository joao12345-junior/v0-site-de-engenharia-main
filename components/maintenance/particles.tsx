// [CONCEITO] "use client" é obrigatório aqui porque:
// 1. useEffect só existe no browser — o servidor não tem ciclo de vida de componente
// 2. useRef acessa um elemento do DOM real — o servidor não tem DOM
// 3. Qualquer manipulação de document/window requer ambiente browser
//
// Sem "use client", o Next.js tentaria renderizar isso no servidor e quebraria.
"use client";

import { useEffect, useRef } from "react";

export function Particles() {
	// [CONCEITO] useRef cria uma referência mutável que persiste entre renders
	// sem causar re-render quando muda. É o substituto React para document.getElementById.
	// ref.current aponta para o elemento DOM real após a montagem.
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// [CONCEITO] useEffect com array de dependências vazio [] executa UMA VEZ
		// após a montagem do componente — equivalente ao DOMContentLoaded do HTML.
		// É o lugar correto para qualquer código que precisa do DOM pronto.
		const container = containerRef.current;
		if (!container) return;

		const COUNT = 28;

		for (let i = 0; i < COUNT; i++) {
			const particle = document.createElement("div");

			// [CONCEITO] Estilo inline via JavaScript — mesmo padrão do HTML original,
			// mas aqui é necessário porque os valores são dinâmicos (Math.random).
			// Para estilos estáticos, sempre prefira classes CSS.
			const size = Math.random() > 0.7 ? 3 : 2;
			const duration = 8 + Math.random() * 14;
			const delay = Math.random() * 12;

			Object.assign(particle.style, {
				position: "absolute",
				width: `${size}px`,
				height: `${size}px`,
				background: "var(--primary)",
				left: `${Math.random() * 100}vw`,
				bottom: `${Math.random() * 100}vh`,
				opacity: "0",
				animation: `float-up ${duration}s linear -${delay}s infinite`,
			});

			container.appendChild(particle);
		}

		// [CONCEITO] Função de cleanup do useEffect — executada quando o componente
		// é desmontado. Remove as partículas do DOM para evitar memory leak.
		// Sem isso, se o componente montar/desmontar várias vezes, as partículas acumulam.
		return () => {
			container.innerHTML = "";
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className="pointer-events-none fixed inset-0"
			style={{ zIndex: 0 }}
		/>
	);
}
