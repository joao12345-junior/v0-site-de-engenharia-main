// next.config.mjs
const nextConfig = {
	trailingSlash: true,
	typescript: {
		ignoreBuildErrors: false,
	},
	images: {
		// Sem unoptimized: true — deixa o Next.js otimizar
		remotePatterns: [
			// Domínios brasileiros — cobre melnick.com.br, plaenge.com.br, cyrela.com.br, etc.
			{ protocol: "https", hostname: "**.com.br" },

			// Hospital
			{ protocol: "https", hostname: "**.org.br" },

			{ protocol: "https", hostname: "storage.agil.net" },

			{ protocol: "https", hostname: "imgbr.**.com" },

			// AWS S3 — já estava configurado
			{ protocol: "https", hostname: "**.amazonaws.com" },

			// Google — blogger.googleusercontent.com, storage.googleapis.com
			{ protocol: "https", hostname: "**.googleapis.com" },
			{ protocol: "https", hostname: "**.googleusercontent.com" },

			// Redes sociais e CDNs internacionais
			{ protocol: "https", hostname: "**.fbcdn.net" },
			{ protocol: "https", hostname: "**.licdn.com" },
			{ protocol: "https", hostname: "**.tripadvisor.com" },
			{ protocol: "https", hostname: "**.ytimg.com" },
			{ protocol: "https", hostname: "**.wixstatic.com" },
			{ protocol: "https", hostname: "**.trvl-media.com" },
		],
	},
};

export default nextConfig;
