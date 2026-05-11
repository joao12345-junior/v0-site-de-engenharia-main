import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { PageTransition } from "./page-transition";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jetbrains",
});

export const metadata: Metadata = {
	title: "OPTARE - Projetos de Engenharia",
	description:
		"Empresa especializada na elaboração de projetos de engenharia para o setor da construção civil. Projetos hidrossanitários, elétricos, de incêndio e gás.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="pt-BR"
			className={jetbrainsMono.variable}
			data-scroll-behavior="smooth"
			suppressHydrationWarning
		>
			<body className="font-sans antialiased">
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
					{/*
					 * [ADICIONADO] PageTransition envolve {children}.
					 *
					 * [CONCEITO] Por que funciona aqui mesmo sendo "use client"?
					 * layout.tsx é um Server Component — não pode usar hooks.
					 * PageTransition é um Client Component (tem "use client").
					 * O Next.js permite importar Client Components dentro de
					 * Server Components. O que NÃO é permitido é o inverso:
					 * um Server Component dentro de um Client Component
					 * sem usar a pattern de "children como prop".
					 *
					 * Hierarquia resultante:
					 *   RootLayout (Server)
					 *     └── ThemeProvider (Client)
					 *           └── PageTransition (Client) ← novo
					 *                 └── {children} (cada página)
					 *
					 * [ATENÇÃO] O PageTransition SÓ se aplica às rotas públicas.
					 * O painel /administrador tem seu próprio layout isolado,
					 * então não será afetado por esta transição.
					 */}
					<PageTransition>{children}</PageTransition>
				</ThemeProvider>
				<Toaster />
			</body>
		</html>
	);
}
