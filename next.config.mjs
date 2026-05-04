/** @type {import('next').NextConfig} */
const nextConfig = {
	trailingSlash: true,
	typescript: {
		ignoreBuildErrors: false,
	},
	images: {
		unoptimized: true,
		remotePatterns: [
			{ protocol: "https", hostname: "**.amazonaws.com" },
			{ protocol: "https", hostname: "**.melnick.com.br" },
			{ protocol: "https", hostname: "images.petz.com.br" },
		],
	},
};

export default nextConfig;
