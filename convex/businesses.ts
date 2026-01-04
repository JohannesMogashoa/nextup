import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

import { internal } from "./_generated/api";
import { v } from "convex/values";

export const create = mutation({
	args: {
		name: v.string(),
		description: v.optional(v.string()),
		type: v.union(
			v.literal("barbershop"),
			v.literal("hair_salon"),
			v.literal("beauty_shop"),
			v.literal("other")
		),
		address: v.string(),
		phone: v.string(),
		averageServiceTime: v.number(),
		isByInviteOnly: v.boolean(),
		userId: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = await ctx.runQuery(internal.users.getAuthUserId, {
			clerkId: args.userId,
		});

		if (!userId) {
			throw new Error("Owner user not found");
		}

		const businessId = (await ctx.db.insert("businesses", {
			name: args.name,
			description: args.description,
			type: args.type,
			address: args.address,
			phone: args.phone,
			createdAt: Date.now(),
			ownerId: userId,
			queues: [],
		})) as Id<"businesses">;

		// Create a default queue for the business
		await ctx.db.insert("queues", {
			title: "Main Queue",
			description: "Default queue for the business",
			averageServiceTime: args.averageServiceTime,
			isActive: true,
			maxCapacity: 20,
			isByInviteOnly: args.isByInviteOnly,
			businessId,
			ownerId: userId,
		});

		return businessId;
	},
});

export const getMyBusinesses = query({
	args: {
		userId: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = await ctx.runQuery(internal.users.getAuthUserId, {
			clerkId: args.userId,
		});

		if (!userId) {
			return [];
		}

		const businesses = (await ctx.db
			.query("businesses")
			.withIndex("by_owner", (q) => q.eq("ownerId", userId))
			.collect()) as Doc<"businesses">[];

		return businesses;
	},
});

export const getById = query({
	args: { businessId: v.id("businesses") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.businessId);
	},
});

export const list = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db
			.query("businesses")
			.filter((q) => q.gt(q.field("queues"), []))
			.collect();
	},
});

export const listWithQueueCount = query({
	args: {},
	handler: async (ctx) => {
		const businesses = await ctx.db.query("businesses").collect();

		const businessWithQueueCounts = await Promise.all(
			businesses.map(async (business) => {
				const queueCount = await ctx.db
					.query("queues")
					.withIndex("by_business", (q) =>
						q.eq("businessId", business._id)
					);

				return {
					...business,
					queueCount,
				};
			})
		);

		return businessWithQueueCounts;
	},
});
