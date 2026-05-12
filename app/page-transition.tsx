"use client";

// [MUDANÇA ARQUITETURAL] AnimatePresence removido completamente.
//
// O problema raiz: AnimatePresence com mode="wait" em produção (SSR)
// entrava em estado indefinido na primeira carga — esperava uma saída
// que não existia, travando o motion.div em opacity: 0 indefinidamente.
//
// A solução: usar motion.div com key={pathname} diretamente.
// Quando pathname muda → React monta novo motion.div → animação dispara.
// Não há "espera" — a entrada acontece imediatamente.
//
// Resultado: sem tela preta, sem travamento, funciona igual em dev e prod.
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface PageTransitionProps {
	children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
	const pathname = usePathname();

	useEffect(() => {
		const raf = requestAnimationFrame(() => {
			window.scrollTo({ top: 0, behavior: "smooth" });
		});
		return () => cancelAnimationFrame(raf);
	}, [pathname]);

	return (
		<motion.div
			key={pathname}
			// [MUDANÇA] opacity inicial era 0 — causava tela completamente preta.
			// Agora é 0.5: mesmo se a animação travar por qualquer motivo,
			// o conteúdo continua visível (50% opacidade).
			// Em funcionamento normal, anima de 0.5 → 1 em 0.3s.
			initial={{ opacity: 0.5 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
		>
			{children}
		</motion.div>
	);
}
