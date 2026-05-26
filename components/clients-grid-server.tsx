// components/clients-grid-server.tsx
// SEM "use client" — Server Component

import clientsData from "@/public/JSON/clientes/clients.json";
import { buildLogoMap } from "@/lib/utils/logo-resolver";
import { ClientsGridClient } from "./clients-grid-client"; // ← nome correto

interface ClientEntry {
	CLIENTE: string;
	Site: string;
	categoria: string;
}

// Sem props — este componente é responsável por buscar os próprios dados
export function ClientGrid() {
	const clients = clientsData as ClientEntry[];
	const logoMap = buildLogoMap(clients.map((c) => c.CLIENTE));

	return <ClientsGridClient clients={clients} logoMap={logoMap} />;
}
