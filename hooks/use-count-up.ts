"use client";

import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
	// Valor Final
	end: number;

	// Duração da Animação em milisegundos
	duration?: number;

	// Trigger
	triggerOnView?: boolean;
}

/**
 * Hook que anima um número de 0 até `end` quando o elemento entra na tela.
 * Retorna o valor atual (number) e uma ref para anexar ao elemento DOM.
 *
 * @example
 * const { value, ref } = useCountUp({ end: 1000 });
 * return <span ref={ref}>{value}+</span>;
 */

export function useCountUp({
	end,
	duration = 2000,
	triggerOnView = true,
}: UseCountUpOptions) {
	const [value, setValue] = useState(0);
	const ref = useRef<HTMLElement>(null);

	// hasStarted evita que a animação reinicie ao rolar pra cima e voltar
	const hasStarted = useRef(false);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		function startAnimation() {
			if (hasStarted.current) return;
			hasStarted.current = true;

			const startTime = performance.now();

			function tick(now: number) {
				const elapsed = now - startTime;
				const progress = Math.min(elapsed / duration, 1);

				// easeOutQuart: desacelera suavemente no final
				// Conceito avançado: funções de easing são curvas matemáticas
				// que controlam a aceleração de animações.
				// t=0 → começo, t=1 → fim. easeOutQuart(1) = 1 sempre.
				const eased = 1 - Math.pow(1 - progress, 4);

				setValue(Math.round(eased * end));
				if (progress < 1) {
					requestAnimationFrame(tick);
				}
			}

			requestAnimationFrame(tick);
		}

		if (!triggerOnView) {
			startAnimation();
			return;
		}

		// IntersectionObserver: notifica quando o elemento entra/sai da viewport.
		// threshold: 0.3 = dispara quando 30% do elemento está visível.
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					startAnimation();
				}
			},
			{ threshold: 0.7 },
		);
		observer.observe(element);

		// Cleanup: remove o observer quando o componente for desmontado.
		// Sem isso, o observer ficaria "escutando" para sempre — memory leak.
		return () => observer.disconnect();
	}, [end, duration, triggerOnView]);

	return { value, ref };
}
