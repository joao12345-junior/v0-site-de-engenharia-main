import imagesData from "@/public/JSON/projetos/projects.json";

export function findImagesByTitle(title: string): string[] {
	for (const client of imagesData) {
		for (const image of client.imagens) {
			{
				if (
					image.subtitulo
						.toLocaleLowerCase()
						.includes(title.toLocaleLowerCase())
				)
					return image.urls_imagens;
			}
		}
	}
	return [];
}

export function findLocationByTitle(title: string): string {
	for (const client of imagesData) {
		for (const image of client.imagens) {
			if (
				image.subtitulo.toLocaleLowerCase().includes(title.toLocaleLowerCase())
			)
				return image.localization ?? "";
		}
	}
	return "";
}
