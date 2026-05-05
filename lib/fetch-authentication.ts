"use client";

export async function fetchAutenticado(
	url: string,
	opcoes?: RequestInit,
): Promise<Response> {
	// Primeira tentativa com o token atual
	const resposta = await fetch(url, opcoes);

	// Token expirado - tenta renovar uma vez
	if (resposta.status === 401) {
		const renovacao = await fetch("/api/refresh", { method: "POST" });

		if (renovacao.ok) {
			// Novo cookie já foi definido pelo servidor
			// Repete a chamada original como o novo token
			return fetch(url, opcoes);
		}

		// Refresh também falhou - sessão completamente expirada
		// Redireciona para login (só disponível no browser)
		window.location.href = "/administrador_login";
	}
	return resposta;
}
