import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
	handler: async (ctx) => {
		const user = await ctx.auth.getUserIdentity();

		if (!user) {
			return [];
		}

		const userId = (await ctx.runQuery(internal.users.getAuthUserId, {
			clerkId: user.subject,
		})) as Id<"users">;

		if (!userId) {
			return [];
		}

		const queues = await ctx.db
			.query("queues")
			.filter((q) => q.eq(q.field("ownerId"), userId))
			.collect();

		return queues;
	},
});
