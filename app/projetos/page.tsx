// app/projetos/page.tsx
// Server Component — sem "use client".
//
// [CONCEITO] Este componente faz uma única coisa: buscar os projetos
// publicados do banco e passar pro ProjetosClient.
//
// Toda a interatividade (filtro, animações, cards) está no ProjetosClient.
// A fronteira é clara: dado vem do servidor, comportamento fica no cliente.

import { getPublicProjects } from "@/lib/repositories/public-projects-repository";
import { ProjectsClient } from "@/components/projects-client";

export default async function ProjetosPage() {
	const projects = await getPublicProjects();

	return (
		<main className="pt-20">
			{/*
			 * [CONCEITO] Passando `projects` como prop atravessa a fronteira
			 * Server → Client. O Next.js serializa o array como JSON.
			 * Só tipos serializáveis podem cruzar: string, number, boolean,
			 * null, arrays e objetos planos. Funções, classes e Promises
			 * não podem — o compilador avisa se tentar.
			 */}
			<ProjectsClient projects={projects} />
		</main>
	);
}
