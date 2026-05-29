// app/layout.tsx

import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { PageTransition } from "./page-transition";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jetbrains",
});

export const metadata: Metadata = {
	title: "OPTARE - Projetos de Engenharia",
	description:
		"Empresa especializada na elaboração de projetos de engenharia para o setor da construção civil.",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			lang="pt-BR"
			className={jetbrainsMono.variable}
			suppressHydrationWarning
		>
			<body className="font-sans antialiased">
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
					{/*
            [DECISÃO] Header e Footer fora do PageTransition.
            Elementos persistentes não devem animar na troca de rota.
            O PageTransition afeta apenas o conteúdo de cada página.

            [CONCEITO] Layout no App Router é exatamente para isso:
            UI que persiste entre navegações — header, footer, sidebars.
            Colocar esses elementos em cada página causava re-render
            desnecessário e conflito com as animações de transição.
          */}
					<Header />
					<PageTransition>{children}</PageTransition>
					<Footer />
				</ThemeProvider>
				<Toaster />
			</body>
		</html>
	);
}
