// components/home/client-carousel.tsx
// SEM "use client" — Server Component

import clientsData from "@/public/JSON/clientes/clients.json";
import { buildLogoMap } from "@/lib/utils/logo-resolver";
import { ClientCarouselClient } from "./client-carousel-client";

interface ClientEntry {
	CLIENTE: string;
	Site: string;
	categoria: string;
}

export function ClientCarousel() {
	const clients = clientsData as ClientEntry[];
	const logoMap = buildLogoMap(clients.map((c) => c.CLIENTE));

	return <ClientCarouselClient clients={clients} logoMap={logoMap} />;
}
