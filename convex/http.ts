import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { httpAction } from "./_generated/server";
import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";

const http = httpRouter();

function getSvixHeaders(request: Request) {
	const svixId = request.headers.get("svix-id");
	const svixTimestamp = request.headers.get("svix-timestamp");
	const svixSignature = request.headers.get("svix-signature");

	if (!svixId || !svixTimestamp || !svixSignature) {
		return null;
	}

	return {
		svixId,
		svixTimestamp,
		svixSignature,
	};
}

async function verifyClerkWebhookRequest(
	request: Request
): Promise<WebhookEvent> {
	const headers = getSvixHeaders(request);
	if (!headers) {
		throw new Error("Missing Svix headers");
	}

	const secret = process.env.CLERK_WEBHOOK_SECRET;
	if (!secret) {
		throw new Error("Missing CLERK_WEBHOOK_SECRET");
	}

	const payload = await request.text();
	const webhook = new Webhook(secret);

	const event = webhook.verify(payload, {
		"svix-id": headers.svixId,
		"svix-timestamp": headers.svixTimestamp,
		"svix-signature": headers.svixSignature,
	}) as WebhookEvent;

	return event;
}

const clerkUsersWebhook = httpAction(async (ctx, request) => {
	if (request.method !== "POST") {
		return new Response("Method Not Allowed", { status: 405 });
	}

	let event: WebhookEvent;

	try {
		event = await verifyClerkWebhookRequest(request);
	} catch (err) {
		console.error("Clerk webhook verification failed:", err);
		return new Response("Invalid webhook signature", { status: 400 });
	}

	// Below can be converted into a switch statement if more events are handled in the future

	if (event.type === "user.created" || event.type === "user.updated") {
		const { id, email_addresses, first_name, last_name, image_url } =
			event.data;

		await ctx.runMutation(internal.users.syncUser, {
			clerkId: id,
			email: email_addresses[0]?.email_address || "",
			name: `${first_name || ""} ${last_name || ""}`.trim() || undefined,
			imageUrl: image_url || undefined,
		});
	}

	if (event.type === "user.deleted") {
		const clerkUserId: string | undefined = event.data?.id;
		if (clerkUserId) {
			await ctx.runMutation(internal.users.deleteFromClerk, {
				clerkUserId,
			});
		}
	}

	return new Response("Webhook received", { status: 200 });
});

http.route({
	path: "/clerk-webhook",
	method: "POST",
	handler: clerkUsersWebhook,
});

export default http;
