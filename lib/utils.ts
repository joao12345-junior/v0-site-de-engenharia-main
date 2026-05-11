import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const uppercaseExceptions = new Set([
	"abf",
	"arq",
	"bg",
	"cfl",
	"s.a",
	"puc",
	"tgd",
	"r4",
	"evo2b",
	"abc",
	"rs",
]);

export function toTitleCase(text: string): string {
	return text
		.toLocaleLowerCase()
		.split(" ")
		.map((word) =>
			uppercaseExceptions.has(word)
				? word.toLocaleUpperCase()
				: word.charAt(0).toLocaleUpperCase() + word.slice(1),
		)
		.join(" ");
}
