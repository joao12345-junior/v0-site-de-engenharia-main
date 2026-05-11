"use client";

// components/clients-grid.tsx

import { motion } from "framer-motion";
import { toTitleCase } from "@/lib/utils";
// [CORREÇÃO] O ícone é buscado AQUI, no cliente, a partir da categoria.
// O Server Component não precisa mais passar o componente de ícone —
// só passa a string da categoria, que é serializável.
import {
	categoryIconsClient,
	type categoryClients,
} from "@/lib/repositories/clients-repository";

// [CORREÇÃO] Interface sem `icon`.
// Apenas tipos primitivos (string) — todos serializáveis.
interface ClientItem {
	key: string;
	category: categoryClients;
}

interface ClientsGridProps {
	clients: ClientItem[];
}

export function ClientsGrid({ clients }: ClientsGridProps) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			{clients.map((client, index) => {
				// [CORREÇÃO] Lookup do ícone feito aqui, no Client Component.
				// O mapa categoryIconsClient já existe neste módulo —
				// não precisamos recebê-lo via props do servidor.
				//
				// [CONCEITO] Este é o padrão correto para ícones em Server/Client:
				// 1. Server passa a "chave" (string de categoria)
				// 2. Client usa a chave para encontrar o componente localmente
				// Nunca passe componentes React como props entre Server e Client.
				const Icon = categoryIconsClient[client.category];

				return (
					<motion.div
						key={client.key}
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: false, amount: 0.2 }}
						transition={{
							duration: 0.4,
							delay: Math.min(index, 20) * 0.04,
							ease: "easeOut" as const,
						}}
						className="bg-background p-6 rounded-lg border border-border flex flex-col items-center text-center hover:border-primary/50 transition-colors"
					>
						<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
							<Icon className="h-8 w-8 text-primary/50" />
						</div>
						<h3 className="font-semibold text-foreground">
							{toTitleCase(client.key)}
						</h3>
						<p className="text-sm text-muted-foreground mt-1">
							{client.category}
						</p>
					</motion.div>
				);
			})}
		</div>
	);
}
