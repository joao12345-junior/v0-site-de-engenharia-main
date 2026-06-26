import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { PageTransition } from "../page-transition";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { isMaintenanceMode } from "../admin/painel/pages/page-config";
import { MaintenancePage } from "@/components/maintenance/maintenance-page";

// [FONTE 1] Inter — fonte principal do site (font-sans)
// subsets: ["latin"] baixa apenas os caracteres latinos — menor bundle
// variable: cria a CSS var --font-inter que o globals.css vai consumir via --font-sans
const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

// [FONTE 2] JetBrains Mono — fonte mono (font-mono)
// Mantida para: elementos <code>, painel admin, classes font-mono no Tailwind
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
			className={`${inter.variable} ${jetbrainsMono.variable}`}
			suppressHydrationWarning
		>
			<body className="font-sans antialiased">
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
					{isMaintenanceMode ? (
						<MaintenancePage />
					) : (
						<>
							<Header />

							<PageTransition>{children}</PageTransition>

							<Footer />
						</>
					)}
				</ThemeProvider>

				<Toaster />
			</body>
		</html>
	);
}
