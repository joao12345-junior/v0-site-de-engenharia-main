"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface PageTransitionProps {
	children: ReactNode;
}

// Fade simples — sem movimento Y, sem scale.
// Apenas opacidade: a página some suavemente ao sair e aparece ao entrar.
const pageVariants: Variants = {
	initial: { opacity: 0 },
	animate: {
		opacity: 1,
		transition: { duration: 0.25, ease: "easeOut" as const },
	},
	exit: {
		opacity: 0,
		transition: { duration: 0.15, ease: "easeIn" as const },
	},
};

export function PageTransition({ children }: PageTransitionProps) {
	const pathname = usePathname();

	useEffect(() => {
		const raf = requestAnimationFrame(() => {
			window.scrollTo({ top: 0, behavior: "smooth" });
		});
		return () => cancelAnimationFrame(raf);
	}, [pathname]);

	return (
		// [CONCEITO] AnimatePresence intercepta a desmontagem do componente.
		// Sem ele, quando o React remove um componente do DOM (ao trocar de página),
		// a remoção é instantânea — não há tempo para animar a saída.
		// Com AnimatePresence, o componente fica no DOM até a animação `exit`
		// terminar, e só então é removido.
		//
		// mode="wait" garante que a página antiga termine de sair ANTES
		// da nova começar a entrar. Isso evita que as duas páginas apareçam
		// sobrepostas durante a transição.
		<AnimatePresence mode="wait">
			<motion.div
				key={pathname}
				variants={pageVariants}
				initial="initial"
				animate="animate"
				exit="exit"
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
}
