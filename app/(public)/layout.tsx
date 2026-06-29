// app/(public)/layout.tsx
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { PageTransition } from "../page-transition";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MaintenancePage } from "@/components/maintenance/maintenance-page";
import { getMaintenanceMode } from "@/lib/repositories/admin/settings-repository";

// [CONCEITO] Por que ler do banco aqui e não importar de page-config.tsx?
//
// page-config.tsx tem "use client" — é um Client Component. Client Components
// rodam no browser. Server Components (como este layout) rodam no servidor.
// Importar um valor de runtime de um Client Component em um Server Component
// é inválido no Next.js App Router — o valor seria sempre o default do módulo.
//
// Este layout É um Server Component (sem "use client"). Ele pode chamar
// o banco diretamente. O resultado muda a cada request, refletindo o
// estado atual salvo pelo admin.

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jetbrains",
});

export const metadata: Metadata = {
	title: "OPTARE - Projetos de Engenharia",
	description:
		"Empresa especializada na elaboração de projetos de engenharia para o setor da construção civil. Projetos hidrossanitários, elétricos, de incêndio e gás.",
};

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	// [CONCEITO] await aqui — layout é async Server Component.
	// Consulta o banco uma vez por request. Para este volume de tráfego
	// é aceitável. Se precisar de cache: envolva com unstable_cache() do Next.js.
	const emManutencao = await getMaintenanceMode();

	return (
		<html
			lang="pt-BR"
			className={`${inter.variable} ${jetbrainsMono.variable}`}
			suppressHydrationWarning
		>
			<body className="font-sans antialiased">
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
					{emManutencao ? (
						// [CONCEITO] Server Component renderiza <MaintenancePage> direto,
						// sem precisar de redirect. O HTML chega pronto ao browser.
						// Rotas do admin (/admin/*) usam layout diferente — não passam aqui.
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
