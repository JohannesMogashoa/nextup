import { api, internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";

import { Doc } from "./_generated/dataModel";
import { v } from "convex/values";

export const getUserQueues = query({
	args: {
		userId: v.string(),
	},
	handler: async (ctx, args) => {
		const queuesEntry = await ctx.db
			.query("queue_entries")
			.filter(
				(q) =>
					q.eq(q.field("userId"), args.userId) &&
					q.eq(q.field("status"), "waiting")
			)
			.collect();

		const queues = await Promise.all(
			queuesEntry.map(async (entry) => {
				const queue = await ctx.db
					.query("queues")
					.withIndex("by_id", (q) => q.eq("_id", entry.queueId))
					.first();
				if (!queue) throw new Error("Queue not found");
				return queue;
			})
		);

		return queues;
	},
});

export const getByBusiness = query({
	args: { businessId: v.id("businesses") },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("queues")
			.withIndex("by_business", (q) =>
				q.eq("businessId", args.businessId)
			)
			.filter((q) => q.eq(q.field("isActive"), true))
			.collect();
	},
});

export const getQueueWithEntries = query({
	args: { queueId: v.id("queues") },
	handler: async (ctx, args) => {
		const queue = await ctx.db.get(args.queueId);
		if (!queue) return null;

		const entries = await ctx.db
			.query("queue_entries")
			.withIndex("by_queue_and_status", (q) =>
				q.eq("queueId", args.queueId).eq("status", "waiting")
			)
			.order("asc")
			.collect();

		const beingServed = await ctx.db
			.query("queue_entries")
			.withIndex("by_queue_and_status", (q) =>
				q.eq("queueId", args.queueId).eq("status", "being_served")
			)
			.collect();

		return {
			queue,
			waitingEntries: entries,
			beingServed,
			totalWaiting: entries.length,
		};
	},
});

export const joinQueue = mutation({
	args: {
		queueId: v.id("queues"),
		userId: v.string(),
		customerPhone: v.string(),
	},
	handler: async (ctx, args) => {
		const user = (await ctx.runQuery(api.users.getUserByClerkId, {
			clerkId: args.userId,
		})) as Doc<"users"> | null;

		if (!user) {
			throw new Error("User not found");
		}

		const queue = await ctx.db.get(args.queueId);
		if (!queue) throw new Error("Queue not found");

		// Check if customer is already in queue
		const existingEntry = await ctx.db
			.query("queue_entries")
			.withIndex("by_queue", (q) => q.eq("queueId", args.queueId))
			.filter((q) =>
				q.and(
					q.eq(q.field("userId"), user._id),
					q.or(
						q.eq(q.field("status"), "waiting"),
						q.eq(q.field("status"), "being_served")
					)
				)
			)
			.first();

		if (existingEntry) {
			throw new Error("You are already in this queue");
		}

		// Get current queue length
		const currentEntries = await ctx.db
			.query("queue_entries")
			.withIndex("by_queue_and_status", (q) =>
				q.eq("queueId", args.queueId).eq("status", "waiting")
			)
			.collect();

		const position = currentEntries.length + 1;

		if (position > queue.maxCapacity) {
			throw new Error("Queue is at maximum capacity");
		}

		const estimatedWaitTime = position * queue.averageServiceTime;

		return await ctx.db.insert("queue_entries", {
			queueId: args.queueId,
			userId: user._id,
			customerName: user.name || `Guest ${user._id.split("_")[1]}`,
			customerPhone: args.customerPhone,
			position,
			status: "waiting",
			joinedAt: Date.now(),
			estimatedWaitTime,
		});
	},
});

export const callNext = mutation({
	args: { queueId: v.id("queues"), ownerClerkId: v.string() },
	handler: async (ctx, args) => {
		const userId = await ctx.runQuery(internal.users.getAuthUserId, {
			clerkId: args.ownerClerkId,
		});

		if (!userId) {
			throw new Error("Must be logged in");
		}

		// Verify user owns this queue's business
		const queue = await ctx.db.get(args.queueId);
		if (!queue) throw new Error("Queue not found");

		// Get next person in queue
		const nextEntry = await ctx.db
			.query("queue_entries")
			.withIndex("by_queue_and_status", (q) =>
				q.eq("queueId", args.queueId).eq("status", "waiting")
			)
			.order("asc")
			.first();

		if (!nextEntry) {
			throw new Error("No one in queue");
		}

		// Update their status
		await ctx.db.patch(nextEntry._id, {
			status: "being_served",
			calledAt: Date.now(),
		});

		// Update queue's current serving
		await ctx.db.patch(args.queueId, {
			currentServing: nextEntry._id,
		});

		return nextEntry;
	},
});

export const completeService = mutation({
	args: { entryId: v.id("queue_entries"), ownerClerkId: v.string() },
	handler: async (ctx, args) => {
		const userId = await ctx.runQuery(internal.users.getAuthUserId, {
			clerkId: args.ownerClerkId,
		});

		if (!userId) {
			throw new Error("Must be logged in");
		}

		const entry = await ctx.db.get(args.entryId);
		if (!entry) throw new Error("Entry not found");

		// Verify ownership
		const queue = await ctx.db.get(entry.queueId);
		if (!queue) throw new Error("Queue not found");

		await ctx.db.patch(args.entryId, {
			status: "completed",
			completedAt: Date.now(),
		});

		// Clear current serving if this was the current customer
		if (queue.currentServing === args.entryId) {
			await ctx.db.patch(entry.queueId, {
				currentServing: undefined,
			});
		}

		return entry;
	},
});

export const markNoShow = mutation({
	args: { entryId: v.id("queue_entries"), ownerClerkId: v.string() },
	handler: async (ctx, args) => {
		const userId = await ctx.runQuery(internal.users.getAuthUserId, {
			clerkId: args.ownerClerkId,
		});

		if (!userId) {
			throw new Error("Must be logged in");
		}

		const entry = await ctx.db.get(args.entryId);
		if (!entry) throw new Error("Entry not found");

		// Verify ownership
		const queue = await ctx.db.get(entry.queueId);
		if (!queue) throw new Error("Queue not found");

		await ctx.db.patch(args.entryId, {
			status: "no_show",
			completedAt: Date.now(),
		});

		// Clear current serving if this was the current customer
		if (queue.currentServing === args.entryId) {
			await ctx.db.patch(entry.queueId, {
				currentServing: undefined,
			});
		}

		return entry;
	},
});

export const getCustomerStatus = query({
	args: {
		queueId: v.id("queues"),
		customerPhone: v.string(),
	},
	handler: async (ctx, args) => {
		const entry = await ctx.db
			.query("queue_entries")
			.withIndex("by_queue", (q) => q.eq("queueId", args.queueId))
			.filter((q) =>
				q.and(
					q.eq(q.field("customerPhone"), args.customerPhone),
					q.or(
						q.eq(q.field("status"), "waiting"),
						q.eq(q.field("status"), "being_served")
					)
				)
			)
			.first();

		if (!entry) return null;

		// Calculate current position
		if (entry.status === "waiting") {
			const ahead = await ctx.db
				.query("queue_entries")
				.withIndex("by_queue_and_status", (q) =>
					q.eq("queueId", args.queueId).eq("status", "waiting")
				)
				.filter((q) => q.lt(q.field("joinedAt"), entry.joinedAt))
				.collect();

			return {
				...entry,
				currentPosition: ahead.length + 1,
			};
		}

		return {
			...entry,
			currentPosition: 0, // Being served
		};
	},
});
