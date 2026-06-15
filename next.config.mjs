// next.config.mjs
//
// [CONCEITO] Por que o Next.js exige declarar domínios de imagens?
//
// O componente <Image> do Next.js não é um <img> comum.
// Ele passa as imagens por um servidor de otimização interno que:
//   - Redimensiona para o tamanho certo (evita baixar 4K para mostrar 300px)
//   - Converte para WebP automaticamente (30-50% menor que JPEG)
//   - Aplica lazy loading inteligente
//
// Para fazer isso com imagens EXTERNAS, o servidor do Next.js precisa
// fazer um request para o domínio de origem — como um proxy.
// Se qualquer URL fosse aceita, um atacante poderia apontar para domínios
// maliciosos e forçar seu servidor a fazer requests para eles.
// Isso é chamado de SSRF (Server-Side Request Forgery).
//
// A lista de remotePatterns é a "whitelist de confiança": só estes domínios
// são permitidos como fonte de imagens externas.
//
// [CONCEITO] remotePatterns vs domains (deprecated):
// A versão antiga usava `images.domains: ["cyrela.com.br"]` — simples mas
// inflexível (sem suporte a wildcards ou caminhos específicos).
// remotePatterns permite:
//   - Wildcards: `*.amazonaws.com` cobre todos os subdomínios
//   - Protocolos: só https, nunca http
//   - Caminhos: restringir a `/uploads/**` se quiser mais segurança

import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
	trailingSlash: true,
	serverExternalPackages: ["argon2"],
	typescript: {
		ignoreBuildErrors: false,
	},
	images: {
		remotePatterns: [
			// ── Brasil (.com.br / .org.br / .net.br) ──────────────────────────
			// Cobre: plaenge.com.br, cyrela.com.br, hospitalmoinhos.org.br, etc.
			{ protocol: "https", hostname: "**.com.br" },
			{ protocol: "https", hostname: "**.org.br" },
			{ protocol: "https", hostname: "**.net.br" },

			// ── CDNs e storages ───────────────────────────────────────────────
			{ protocol: "https", hostname: "**.amazonaws.com" }, // AWS S3
			{ protocol: "https", hostname: "**.googleusercontent.com" },
			{ protocol: "https", hostname: "**.googleapis.com" },
			{ protocol: "https", hostname: "**.fbcdn.net" }, // Facebook CDN
			{ protocol: "https", hostname: "**.fbsbx.com" }, // Facebook static
			{ protocol: "https", hostname: "**.wixstatic.com" }, // Wix
			{ protocol: "https", hostname: "**.trvl-media.com" }, // TripAdvisor
			{ protocol: "https", hostname: "**.ytimg.com" }, // YouTube thumbnails
			{ protocol: "https", hostname: "**.licdn.com" }, // LinkedIn
			{ protocol: "https", hostname: "storage.agil.net" },
			{ protocol: "https", hostname: "**.cdn-imobibrasil.com" }, // CDN imobiliária

			// ── DatoCMS ───────────────────────────────────────────────────────
			// Encontrado em: RENNER Shopping Recife (images.json)
			// datocms-assets.com é o CDN do DatoCMS, usado por sites da Renner/Lojas
			{ protocol: "https", hostname: "**.datocms-assets.com" },

			// ── Imobiliárias e construtoras ───────────────────────────────────
			{ protocol: "https", hostname: "**.lopes.com.br" },
			{ protocol: "https", hostname: "betaimages.lopes.com.br" },
			{ protocol: "https", hostname: "**.tripadvisor.com" },
			{ protocol: "https", hostname: "dynamic-media-cdn.tripadvisor.com" },
			{ protocol: "https", hostname: "**.bstatic.com" }, // Booking.com CDN
			{ protocol: "https", hostname: "**.modernaidade.com.br" },
			{ protocol: "https", hostname: "**.revistahaus.com.br" },
			{ protocol: "https", hostname: "**.solutioninvestimentos.com.br" },

			// ── Outros domínios encontrados no JSON de imagens ─────────────────
			{ protocol: "https", hostname: "**.rbsdirect.com.br" },
			{ protocol: "https", hostname: "lookaside.fbsbx.com" },
			{ protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
			{ protocol: "https", hostname: "**.gstatic.com" },
			{ protocol: "https", hostname: "**.blogger.com" },
			{ protocol: "https", hostname: "blogger.googleusercontent.com" },
			{ protocol: "https", hostname: "**.wordpress.com" },
			{ protocol: "https", hostname: "**.wp.com" },
			{ protocol: "https", hostname: "i.ytimg.com" },
			{ protocol: "https", hostname: "**.amanha.com.br" },
			{ protocol: "https", hostname: "**.ibirapuera.com.br" },
			{ protocol: "https", hostname: "**.cloud-bricks.net" },
			{ protocol: "https", hostname: "**.jetimgs.com" },
			{ protocol: "https", hostname: "eduardobecker.com" },
			{ protocol: "https", hostname: "**.imovelwebcdn.com" },
			{ protocol: "https", hostname: "idealizacidades.com.br" },
		],
	},
};

export default withSentryConfig(nextConfig, {
	org: "optare",
	project: "javascript-nextjs",

	// Upload de source maps para stack traces legíveis em produção
	authToken: process.env.SENTRY_AUTH_TOKEN,

	// Faz upload de mais arquivos client-side para melhor resolução de stack traces
	widenClientFileUpload: true,

	// Cria uma rota proxy /monitoring para contornar ad-blockers
	tunnelRoute: "/monitoring",

	// Suprime output desnecessário fora do CI
	silent: !process.env.CI,
});
