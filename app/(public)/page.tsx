// app/page.tsx

import { HeroSection } from "@/components/home/hero-section";
import { ServicesSection } from "@/components/home/services-section";
import { AboutSection } from "@/components/home/about-section";
import { StatsSection } from "@/components/home/stats-section";
import { ClientCarousel } from "@/components/home/client-carousel-server";
import { CTASection } from "@/components/home/cta-section";

// [CONCEITO] Variável de ambiente customizada como feature flag.
// Controlável pelo painel do Vercel sem precisar alterar código.
// Para desativar a manutenção: mude MAINTENANCE_MODE para "false" no Vercel → Redeploy.

export default function Home() {
	return (
		<>
			<main>
				<HeroSection />
				<ServicesSection />
				<AboutSection />
				<StatsSection />
				<ClientCarousel />
				<CTASection />
			</main>
		</>
	);
}
