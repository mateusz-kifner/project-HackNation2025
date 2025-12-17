import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

// Populate runtimeEnv with all env variables,
// try catch is needed because even attempting to check type of import.meta in cjs context will cause error
let runtimeEnv: Record<string, any> = {};
try {
	runtimeEnv = { ...import.meta.env, ...process.env };
} catch {
	runtimeEnv = process.env;
}

export const env = createEnv({
	shared: {
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
	},
	server: {
		PORT: z.url().optional(),
		SERVER_URL: z.url().optional(),
	},

	/**
	 * The prefix that client-side variables must have. This is enforced both at
	 * a type-level and at runtime.
	 */
	clientPrefix: "VITE_",

	client: {
		VITE_APP_TITLE: z.string().min(1).optional(),
	},

	/**
	 * What object holds the environment variables at runtime. This is usually
	 * `process.env` or `import.meta.env`.
	 */
	runtimeEnv,
	/**
	 * By default, this library will feed the environment variables directly to
	 * the Zod validator.
	 *
	 * This means that if you have an empty string for a value that is supposed
	 * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
	 * it as a type mismatch violation. Additionally, if you have an empty string
	 * for a value that is supposed to be a string with a default value (e.g.
	 * `DOMAIN=` in an ".env" file), the default value will never be applied.
	 *
	 * In order to solve these issues, we recommend that all new projects
	 * explicitly specify this option as true.
	 */
	emptyStringAsUndefined: true,

	skipValidation:
		!!process.env.SKIP_ENV_VALIDATION ||
		!!process.env.CI ||
		process.env.npm_lifecycle_event === "lint",
});
