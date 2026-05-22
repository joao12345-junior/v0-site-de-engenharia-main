// next.config.mjs
const nextConfig = {
	trailingSlash: true,
	serverExternalPackages: ["argon2"],
	typescript: {
		ignoreBuildErrors: false,
	},
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "*.com.br" },
			{ protocol: "https", hostname: "*.org.br" },
			{ protocol: "https", hostname: "storage.agil.net" },
			{ protocol: "https", hostname: "imgbr.*.com" },
			{ protocol: "https", hostname: "images.*.com" },
			{ protocol: "https", hostname: "*.amazonaws.com" },
			{ protocol: "https", hostname: "*.googleapis.com" },
			{ protocol: "https", hostname: "*.googleusercontent.com" },
			{ protocol: "https", hostname: "*.fbcdn.net" },
			{ protocol: "https", hostname: "*.licdn.com" },
			{ protocol: "https", hostname: "*.tripadvisor.com" },
			{ protocol: "https", hostname: "*.ytimg.com" },
			{ protocol: "https", hostname: "*.wixstatic.com" },
			{ protocol: "https", hostname: "*.trvl-media.com" },
		],
	},
};

export default nextConfig;
