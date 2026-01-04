import { PlusIcon, UserIcon, UsersIcon } from "lucide-react";

import BusinessListing from "@/components/dashboard/business-listing";
import { Button } from "@/components/ui/button";
import React from "react";

const DashboardPage = () => {
	return (
		<>
			<section className="flex justify-between items-center mb-10">
				<h1 className="text-4xl font-bold">Businesses</h1>
			</section>
			<BusinessListing />
		</>
	);
};

export default DashboardPage;
