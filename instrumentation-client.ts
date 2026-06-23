import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

	sendDefaultPii: true,

	// 100% em dev, 10% em produção
	tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0,

	// 10% das sessões normais, 100% das sessões com erro
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1.0,

	integrations: [Sentry.replayIntegration()],
});

// Captura transições de navegação do App Router
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
