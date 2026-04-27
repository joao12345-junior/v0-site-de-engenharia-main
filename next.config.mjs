/** @type {import('next').NextConfig} */
const nextConfig = {
	trailingSlash: true,
	typescript: {
		ignoreBuildErrors: false,
	},
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
	},
};

export default nextConfig;
