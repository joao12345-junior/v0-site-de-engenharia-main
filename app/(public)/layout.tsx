// app/(public)/layout.tsx
export const dynamic = "force-dynamic";
import { PageTransition } from "../page-transition";
import "../globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MaintenancePage } from "@/components/maintenance/maintenance-page";
import { getMaintenanceMode } from "@/lib/repositories/admin/settings-repository";

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	// [CONCEITO] await aqui — layout é async Server Component.
	// Consulta o banco uma vez por request. Para este volume de tráfego
	// é aceitável. Se precisar de cache: envolva com unstable_cache() do Next.js.
	const emManutencao = await getMaintenanceMode();

	return (
		<>
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
		</>
	);
}
