import { CreateQueueModal } from "@/components/dashboard/create-queue";
import QueueListing from "@/components/dashboard/queue-listing";
import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import { convex } from "@/lib/convex-client";
import { getAuthToken } from "@/lib/auth";
import { preloadQuery } from "convex/nextjs";

const QueuesPage = async () => {
	const token = await getAuthToken();
	const { userId, redirectToSignIn } = await auth();

	if (!userId) {
		return redirectToSignIn();
	}

	const businesses = await convex.query(api.businesses.getMyBusinesses, {
		userId,
	});
	const preloadedQueues = await preloadQuery(
		api.userQueues.getAll,
		{},
		{
			token,
		}
	);

	return (
		<section>
			<section className="flex justify-between items-center mb-10">
				<h1 className="text-4xl font-bold">My Queues</h1>
				<CreateQueueModal businesses={businesses} />
			</section>
			<QueueListing preloadedQueues={preloadedQueues} />
		</section>
	);
};

export default QueuesPage;
