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
import { getPhotosForEntities } from "@/lib/repositories/admin/photos-repository";
export const dynamic = "force-dynamic";

export default async function ProjetosPage() {
	const projects = await getPublicProjects();

	// [CONCEITO] Uma query só pra todas as fotos, em vez de uma por projeto
	// (N+1). Com o pool limitado a 3 conexões simultâneas (lib/db/db.ts),
	// disparar uma consulta por projeto enfileira a maioria delas e é o que
	// deixava essa página lenta com o catálogo atual (80+ projetos).
	const photosByProject = await getPhotosForEntities(
		"project",
		projects.map((project) => project.id),
	);

	const projectsWithPhotos = projects.map((project) => ({
		...project,
		photos: photosByProject.get(project.id) ?? [],
	}));

	return (
		<main className="pt-20">
			{/*
			 * [CONCEITO] Passando `projects` como prop atravessa a fronteira
			 * Server → Client. O Next.js serializa o array como JSON.
			 * Só tipos serializáveis podem cruzar: string, number, boolean,
			 * null, arrays e objetos planos. Funções, classes e Promises
			 * não podem — o compilador avisa se tentar.
			 */}
			<ProjectsClient projects={projectsWithPhotos} />
		</main>
	);
}
