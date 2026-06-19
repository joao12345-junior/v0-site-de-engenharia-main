// app/api/admin/upload-photo/route.ts
//
// [CONCEITO] Esta rota está sob /api/admin/, que agora é coberta pelo matcher
// de proxy.ts — não precisa verificar JWT aqui dentro. Single source of truth
// pra autenticação: se proxy.ts mudar a regra um dia, todas as rotas debaixo
// de /api/admin/ herdam a mudança automaticamente, sem precisar editar cada uma.

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB — mesmo limite já usado em project_detail.tsx
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
	try {
		const form = await request.formData();
		const file = form.get("file");

		// [CONCEITO] form.get() devolve File | string | null — precisa confirmar
		// que é mesmo um File antes de acessar .type e .size, ou o TypeScript
		// (e o runtime) reclamam de propriedade inexistente em string.
		if (!file || !(file instanceof File)) {
			return NextResponse.json(
				{ error: "Nenhum arquivo enviado." },
				{ status: 400 },
			);
		}

		if (!ALLOWED_TYPES.includes(file.type)) {
			return NextResponse.json(
				{ error: "Tipo de arquivo não permitido. Use JPEG, PNG ou WebP." },
				{ status: 400 },
			);
		}

		if (file.size > MAX_FILE_SIZE) {
			return NextResponse.json(
				{ error: "Arquivo muito grande. O tamanho máximo é 10MB." },
				{ status: 400 },
			);
		}

		// [CONCEITO] addRandomSuffix evita colisão de nome — duas pessoas
		// subindo "fachada.jpg" no mesmo dia não sobrescrevem uma a outra.
		// access: "public" porque essas fotos vão aparecer no site público
		// depois que o projeto/produto for aprovado e publicado.
		const blob = await put(file.name, file, {
			access: "public",
			addRandomSuffix: true,
		});

		return NextResponse.json({ url: blob.url });
	} catch (error: unknown) {
		console.error("[/api/admin/upload-photo] Erro ao subir arquivo:", error);
		return NextResponse.json(
			{ error: "Falha ao subir o arquivo." },
			{ status: 500 },
		);
	}
}
