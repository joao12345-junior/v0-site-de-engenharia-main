import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: process.env.SENTRY_DSN,

	sendDefaultPii: true,
	tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0,

	// Anexa valores de variáveis locais ao stack trace — muito útil em produção
	includeLocalVariables: true,
});
