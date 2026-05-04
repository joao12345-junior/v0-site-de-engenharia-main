// app/administrador/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdministradorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();

	useEffect(() => {
		// Inicia o timer quando o layout monta
		// ou seja, quando o usuário entra na área protegida
		const temporizador = setTimeout(
			async () => {
				const resposta = await fetch("/api/refresh", { method: "POST" });

				if (!resposta.ok) {
					router.push("/administrador_login");
				}
				// Se ok, o novo cookie já foi definido pelo servidor
				// O próximo ciclo começa na próxima navegação
			},
			14 * 60 * 1000,
		); // 14 minutos

		return () => clearTimeout(temporizador);
	}, [router]);

	return <>{children}</>;
}
