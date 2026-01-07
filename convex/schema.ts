import { defineSchema, defineTable } from "convex/server";

import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		clerkId: v.string(),
		email: v.string(),
		name: v.optional(v.string()),
		imageUrl: v.optional(v.string()),
		createdAt: v.number(),
		queues: v.optional(v.array(v.id("queues"))),
	}).index("by_clerk_id", ["clerkId"]),

	businesses: defineTable({
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
		ownerId: v.id("users"),
		createdAt: v.number(),
		queues: v.array(v.id("queues")),
	})
		.index("by_owner", ["ownerId"])
		.index("by_name", ["name"]),

	queues: defineTable({
		title: v.string(),
		description: v.string(),
		averageServiceTime: v.number(),
		isActive: v.boolean(),
		maxCapacity: v.number(),
		isByInviteOnly: v.boolean(),
		businessId: v.optional(v.id("businesses")),
		ownerId: v.id("users"),
		createdAt: v.number(),
		currentServing: v.optional(v.id("queue_entries")),
	})
		.index("by_business", ["businessId"])
		.index("by_owner", ["ownerId"])
		.index("by_title", ["title"]),

	queue_entries: defineTable({
		queueId: v.id("queues"),
		userId: v.id("users"),
		customerName: v.string(),
		customerPhone: v.string(),
		position: v.number(),
		estimatedWaitTime: v.number(),
		status: v.union(
			v.literal("waiting"),
			v.literal("being_served"),
			v.literal("completed"),
			v.literal("no_show")
		),
		joinedAt: v.number(),
		calledAt: v.optional(v.number()),
		completedAt: v.optional(v.number()),
	})
		.index("by_queue", ["queueId"])
		.index("by_queue_and_status", ["queueId", "status"])
		.index("by_user_id", ["userId"]),
});
