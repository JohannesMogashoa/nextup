import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		CLERK_SECRET_KEY: z.string().min(1),
		CLERK_WEBHOOK_SIGNING_SECRET: z.string().min(1),
	},

	clientPrefix: "NEXT_PUBLIC_",

	client: {
		NEXT_PUBLIC_CONVEX_URL: z.string().url(),

		// Ensure to uncomment if uncommented in .env.example
		NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1),
		NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1),
		NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL: z.string().min(1),
		NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string().min(1),
	},

	runtimeEnv: process.env,

	emptyStringAsUndefined: true,
});
