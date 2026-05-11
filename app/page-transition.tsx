"use client";

import { usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface PageTransitionProps {
	children: ReactNode;
}

// Sem animações de entrada/saída — só scroll suave para o topo.
//
// [CONCEITO] Você não precisa do Framer Motion para isso.
// AnimatePresence e motion.div existem para animar montagem/desmontagem
// de componentes. Se não há animação, esses wrappers são peso morto:
// aumentam o bundle e adicionam um ciclo extra de renderização sem
// nenhum benefício visual.
//
// A única responsabilidade deste componente agora é uma:
// detectar mudança de rota e rolar para o topo.
// Isso é um efeito colateral puro — não precisa de nenhuma lib externa.
export function PageTransition({ children }: PageTransitionProps) {
	const pathname = usePathname();

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [pathname]);

	// [CONCEITO] Por que não return null aqui?
	// Este componente envolve {children} no layout.tsx — ele precisa
	// renderizar os filhos. `return null` descartaria toda a página.
	// A div é o wrapper mínimo necessário para isso.
	return <div>{children}</div>;
}
