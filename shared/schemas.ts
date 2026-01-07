import * as z from "zod";

import { Id } from "@/convex/_generated/dataModel";

export type CreateQueueResult = {
	queueId: Id<"queues"> | null;
	error: string | null;
};

export const createQueueFormSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z
		.string()
		.min(1, "Description is required")
		.max(500, "Description must be at most 500 characters"),
	averageWaitTime: z
		.number()
		.gte(1, "Average wait time must be at least 1 minute"),
	maxCapacity: z.number().gte(1, "Max capacity must be at least 1"),
	isActive: z.boolean(),
	isByInviteOnly: z.boolean(),
	businessId: z.string().min(1, "Business ID is required").optional(),
});

export type CreateQueueFormValues = z.infer<typeof createQueueFormSchema>;
