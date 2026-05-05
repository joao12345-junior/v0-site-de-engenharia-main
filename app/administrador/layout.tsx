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
	const time = 14 * 60 * 1000; // 14 min

	useEffect(() => {
		let temporizador: ReturnType<typeof setTimeout>;
		const renovar = async () => {
			const response = (await fetch("/api/refresh", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			})) as any;
			const data = await response.json();
			if (!response.ok) {
				console.log(data.message);
				router.push("/administrador_login");
				return;
			}
			// Agenda o próximo intervalo
			temporizador = setTimeout(renovar, time);
		};
		temporizador = setTimeout(renovar, time);
		return () => clearTimeout(temporizador);
	}, [router]);

	return <>{children}</>;
}
