// app/page-transition.tsx
"use client";

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
			window.scrollTo({ top: 0, behavior: "instant" });
		});
		return () => cancelAnimationFrame(raf);
	}, [pathname]);

	return (
		<motion.div
			key={pathname}
			initial={{ opacity: 1 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
		>
			{children}
		</motion.div>
	);
}
