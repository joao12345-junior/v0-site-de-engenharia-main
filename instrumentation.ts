export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		await import("./sentry.server.config");
	}

	if (process.env.NEXT_RUNTIME === "edge") {
		await import("./sentry.edge.config");
	}
}

// onRequestError existe em runtime mas os types do pacote estão desatualizados
export { captureRequestError as onRequestError } from "@sentry/nextjs";
