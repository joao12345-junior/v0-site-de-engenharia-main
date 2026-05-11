import clientesData from "@/public/JSON/clientes/clients.json";
import type { LucideIcon } from "lucide-react";
import {
	DraftingCompassIcon,
	BuildingIcon,
	HospitalIcon,
	ShoppingBasketIcon,
	SchoolIcon,
} from "lucide-react";

export type categoryClients =
	| "Construção"
	| "Arquitetura"
	| "Varejo"
	| "Saúde"
	| "Educação";

interface Client {
	site: string;
	category: categoryClients;
	icon: LucideIcon;
}

export const categoryIconsClient: Record<categoryClients, LucideIcon> = {
	Arquitetura: DraftingCompassIcon,
	Construção: BuildingIcon,
	Educação: SchoolIcon,
	Saúde: HospitalIcon,
	Varejo: ShoppingBasketIcon,
};

const clientsMap = new Map<string, Client>();
for (const raw of clientesData) {
	const key = raw.CLIENTE.trim();
	const category = raw.categoria as categoryClients;

	clientsMap.set(key, {
		site: raw.Site,
		category: category,
		icon: categoryIconsClient[category],
	});
}

function countByCategory(): Record<categoryClients, number> {
	const count = {
		Arquitetura: 0,
		Construção: 0,
		Educação: 0,
		Saúde: 0,
		Varejo: 0,
	} satisfies Record<categoryClients, number>;

	for (const client of clientsMap.values()) {
		count[client.category]++;
	}
	return count;
}

export const categoryCounts = countByCategory();

export default clientsMap;
