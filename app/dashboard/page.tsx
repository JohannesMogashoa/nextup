import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ActiveQueues from "@/components/dashboard/active-queues";
import BusinessListing from "@/components/dashboard/business-listing";
import { auth } from "@clerk/nextjs/server";

const DashboardPage = async () => {
	const { userId, redirectToSignIn } = await auth();

	if (!userId) {
		return redirectToSignIn();
	}

	return (
		<>
			<section className="flex justify-between items-center mb-10">
				<h1 className="text-4xl font-bold">Welcome... </h1>
			</section>
			<Tabs defaultValue="active" className="mb-6">
				<TabsList className="mb-6">
					<TabsTrigger value="active">Queueing</TabsTrigger>
					<TabsTrigger value="businesses">Businesses</TabsTrigger>
				</TabsList>
				<TabsContent value="active">
					<ActiveQueues userId={userId} />
				</TabsContent>
				<TabsContent value="businesses">
					<BusinessListing />
				</TabsContent>
			</Tabs>
		</>
	);
};

export default DashboardPage;
