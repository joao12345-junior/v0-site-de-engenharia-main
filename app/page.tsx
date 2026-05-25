// app/page.tsx
//
// [MUDANÇA] Adicionado <ClientCarousel /> entre StatsSection e CTASection.
//
// [CONCEITO] Por que esse posicionamento?
// O carrossel de clientes serve como "prova social" (social proof):
// "outras empresas confiam em nós — você também pode".
// Colocar depois de StatsSection (que mostra números) e antes do CTA
// cria uma progressão persuasiva:
//   Stats  → "temos experiência e resultado"
//   Logos  → "empresas reconhecidas confiam em nós"
//   CTA    → "agora é a sua vez"
//
// Esse é um padrão comum em landing pages comerciais B2B.

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/hero-section";
import { ServicesSection } from "@/components/home/services-section";
import { AboutSection } from "@/components/home/about-section";
import { StatsSection } from "@/components/home/stats-section";
import { CTASection } from "@/components/home/cta-section";
import { ClientCarousel } from "@/components/home/client-carousel";
import { MaintenancePage } from "@/components/maintenance/maintenance-page";

// [CONCEITO] Server Component (sem "use client"):
// Este arquivo não tem useState, useEffect nem eventos de UI.
// O Next.js renderiza tudo no servidor e envia HTML pronto ao browser.
// O ClientCarousel tem "use client" internamente — o Next.js sabe disso
// e hidrata apenas aquele componente no browser, não a página inteira.
// Isso é chamado de "islands architecture" — ilhas de interatividade num
// mar de HTML estático.

export default function Home() {
	if (process.env.NODE_ENV === "production") return <MaintenancePage />;
	return (
		<>
			<Header />
			<main>
				<HeroSection />
				<ServicesSection />
				<ClientCarousel /> {/* ← adiciona aqui */}
				<AboutSection />
				<StatsSection />
				<CTASection />
			</main>
			<Footer />
		</>
	);
}
