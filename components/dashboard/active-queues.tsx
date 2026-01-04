"use client";

import { Doc } from "@/convex/_generated/dataModel";
import Loader from "../loader";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const ActiveQueues = ({ userId }: { userId: string }) => {
	const queues = useQuery(api.queues.getUserQueues, {
		userId: userId,
	});

	return (
		<section>
			{!queues ? (
				<Loader />
			) : queues.length === 0 ? (
				<div className="bg-white rounded-lg shadow-sm border p-8 text-center">
					<div className="text-gray-400 text-6xl mb-4">🏪</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						You are not in any queues
					</h3>
					<p className="text-gray-500">
						Join a business queue to see it listed here
					</p>
				</div>
			) : (
				<div className="grid gap-4">
					{queues.map((queue: Doc<"queues">) => (
						<div key={queue._id}>{queue.title}</div>
					))}
				</div>
			)}
		</section>
	);
};

export default ActiveQueues;
