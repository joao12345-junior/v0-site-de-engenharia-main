import imagesData from "@/public/JSON/projetos/projects.json";

// Tipos explícitos (boa prática TypeScript)
interface ProjectImage {
	subtitulo: string;
	query_busca: string;
	urls_imagens: string[];
	localization: string;
}

export interface ProjectGroup {
	cliente: string;
	imagens: ProjectImage[];
}

// Dado o título de um projeto, encontra as imagens correspondentes no JSON de imagens.
export function findImagesByTitle(title: string): string[] {
	const groups = imagesData as ProjectGroup[];
	for (const group of groups) {
		for (const img of group.imagens) {
			if (img.subtitulo === title || img.subtitulo.includes(title)) {
				return img.urls_imagens;
			}
		}
	}
	return [];
}

// Dado o título de um projeto, retorna a localização (cidade/estado).
export function findLocationByTitle(title: string): string | null {
	const groups = imagesData as ProjectGroup[];
	for (const group of groups) {
		for (const img of group.imagens) {
			if (img.subtitulo === title || img.subtitulo.includes(title)) {
				return img.localization ?? null;
			}
		}
	}
	return null;
}

// [MUDANÇA] Nova função: dado o título, retorna o nome do cliente.
// Percorre o JSON de projetos (não o de imagens) para fazer o match.
export function findClientByTitle(title: string): string | null {
	const groups = imagesData as ProjectGroup[];
	for (const group of groups) {
		for (const img of group.imagens) {
			if (img.subtitulo === title || img.subtitulo.includes(title)) {
				return group.cliente;
			}
		}
	}
	return null;
}
