import { env } from "@/env";

export function getBaseUrl() {
	if (typeof window !== "undefined") return window.location.origin;
	if (env.SERVER_URL) return `https://${env.SERVER_URL}`;
	return `http://localhost:${env.PORT ?? 3000}`;
}
