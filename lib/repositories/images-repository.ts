import imagesData from "@/public/JSON/projetos/projects.json";

// Tipos explícitos (boa prática TypeScript)
interface ImageEntry {
	urls: string[];
	localization: string;
}

// ✅ O Map é construído UMA VEZ quando o módulo é carregado
// Complexidade: O(n) na construção, O(1) na busca
const indiceDeImagens = new Map<string, ImageEntry>();

for (const client of imagesData) {
	for (const image of client.imagens) {
		const key = image.subtitulo.toLocaleLowerCase().trim();
		indiceDeImagens.set(key, {
			urls: image.urls_imagens,
			localization: image.localization ?? "",
		});
	}
}

function findByTitle(title: string): ImageEntry | undefined {
	const cleanTitle = title.toLocaleLowerCase().trim();

	// Primiero tenta match exato
	if (indiceDeImagens.has(cleanTitle)) {
		return indiceDeImagens.get(cleanTitle);
	}

	// Fallback: busca parcial (ainda O(n), mas só quando necessário)
	for (const [key, value] of indiceDeImagens) {
		if (key.includes(cleanTitle) || cleanTitle.includes(key)) {
			return value;
		}
	}
	return undefined;
}

export function findImagesByTitle(title: string): string[] {
	return findByTitle(title)?.urls ?? [];
}

export function findLocationByTitle(title: string): string {
	return findByTitle(title)?.localization ?? "";
}
