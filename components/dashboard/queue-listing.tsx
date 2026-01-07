"use client";

import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Preloaded, usePreloadedQuery } from "convex/react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Loader from "../loader";
import { PlusIcon } from "lucide-react";
import { api } from "@/convex/_generated/api";

const QueueListing = (props: {
	preloadedQueues: Preloaded<typeof api.userQueues.getAll>;
}) => {
	const queues = usePreloadedQuery(props.preloadedQueues);

	return (
		<section>
			{!queues ? (
				<Loader />
			) : queues.length === 0 ? (
				<div className="p-4 bg-white rounded-lg border-dashed border-2 text-center">
					<div>
						<PlusIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
					</div>
					<p className="text-muted-foreground">You have no queues.</p>
				</div>
			) : (
				<div className="grid gap-5">
					{queues.map((queue) => (
						<Card key={queue._id.toString()}>
							<CardHeader className="flex items-center justify-between">
								<CardTitle>{queue.title}</CardTitle>
								<Badge>
									{queue.isByInviteOnly
										? "Private"
										: "Public"}
								</Badge>
							</CardHeader>
							<CardContent>
								<p className="line-clamp-2">
									{queue.description}
								</p>
							</CardContent>
							<CardFooter>
								<CardAction>
									<Button
										className="cursor-pointer"
										variant={"destructive"}
									>
										Delete
									</Button>
								</CardAction>
								<CardAction>
									<Button
										className="cursor-pointer"
										variant={"default"}
									>
										Edit
									</Button>
								</CardAction>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</section>
	);
};

export default QueueListing;
