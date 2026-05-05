// app/administrador/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";

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
			if (!response.ok) {
				console.log(await response.json().message);
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
