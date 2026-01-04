"use client";

import { Button } from "../ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import React from "react";
import { formatTime } from "@/lib/utils";

const BusinessListingItem = ({ business }: { business: Doc<"businesses"> }) => {
	return (
		<div
			key={business._id}
			className="rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
		>
			<div className="flex justify-between items-start">
				<div className="flex-1">
					<h3 className="text-lg font-semibold text-gray-900">
						{business.name}
					</h3>
					<p className="text-sm text-gray-500 mb-3">
						{business.address}
					</p>
					<p className="text-sm text-gray-500">{business.phone}</p>
				</div>
				<div className="text-right">
					<div className="text-sm text-green-600 font-medium">
						~{formatTime(business.averageServiceTime)} per service
					</div>
				</div>
			</div>

			<div className="mt-4 pt-4 border-t border-gray-100">
				<Button className="w-full px-4 py-2 rounded-lg">
					{business.queues.length > 1 ? "View Queues" : "Join Queue"}
				</Button>
			</div>
		</div>
	);
};

export default BusinessListingItem;
