"use server";

import { CreateQueueFormValues, CreateQueueResult } from "@/shared/schemas";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import { convex } from "@/lib/convex-client";

export async function createQueueAction(
	prevState: CreateQueueResult,
	queue: CreateQueueFormValues
): Promise<CreateQueueResult> {
	console.log("createQueueAction called");
	console.log("Creating queue with form data:", queue);
	try {
		const { userId } = await auth();

		if (!userId) {
			throw new Error("User must be signed in to create a queue.");
		}

		let business = null;

		if (queue.businessId) {
			business = await convex.query(api.businesses.getById, {
				businessId: queue.businessId as Id<"businesses">,
			});
		}

		const queueId = await convex.mutation(api.queues.create, {
			title: queue.title,
			description: queue.description,
			businessId: business?._id,
			averageWaitTime: queue.averageWaitTime,
			maxCapacity: queue.maxCapacity,
			isActive: queue.isActive,
			isByInviteOnly: queue.isByInviteOnly,
			ownerId: userId,
		});

		return { queueId, error: null };
	} catch (err) {
		return {
			queueId: null,
			error:
				err instanceof Error
					? err.message
					: "An unexpected error occurred.",
		};
	}
}
