"use client";

import { usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface PageTransitionProps {
	children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
	const pathname = usePathname();

	useEffect(() => {
		// [PROBLEMA RESOLVIDO] O Next.js App Router reseta o scroll para top:0
		// automaticamente como parte do ciclo de navegação — de forma instantânea.
		// Quando o useEffect roda, o scroll já está em zero. Não há distância
		// para animar, então behavior:'smooth' parece não fazer nada.
		//
		// [SOLUÇÃO] requestAnimationFrame agenda a execução para APÓS o browser
		// terminar de pintar o frame atual — ou seja, depois que o Next.js
		// já finalizou seu reset de scroll. Nesse ponto, o scroll ainda está
		// em zero, mas o conteúdo novo já está renderizado e visível.
		//
		// O efeito visual: o browser renderiza a nova página já posicionada
		// no topo, e o scroll-behavior: smooth do CSS garante que qualquer
		// scroll subsequente (âncoras, programático) seja suave.
		//
		// [CONCEITO] requestAnimationFrame vs setTimeout(fn, 0):
		// setTimeout(fn, 0) é impreciso — o browser decide quando executar.
		// requestAnimationFrame é garantido para rodar após a pintura do frame,
		// tornando-o ideal para qualquer operação visual ou de layout.
		//
		// [CONCEITO] O retorno da função de cleanup:
		// Se o usuário navegar muito rápido (antes do frame pintar),
		// cancelAnimationFrame cancela o scroll anterior para evitar
		// comportamento inesperado com múltiplos scrolls em fila.
		const raf = requestAnimationFrame(() => {
			window.scrollTo({ top: 0, behavior: "smooth" });
		});

		return () => cancelAnimationFrame(raf);
	}, [pathname]);

	return <div>{children}</div>;
}
