"use client";

import BusinessListingItem from "./business-listing-item";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const BusinessListing = () => {
	const businesses = useQuery(api.businesses.list);
	return (
		<section>
			{!businesses ? (
				<div className="flex justify-center items-center min-h-50">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
				</div>
			) : businesses.length === 0 ? (
				<div className="bg-white rounded-lg shadow-sm border p-8 text-center">
					<div className="text-gray-400 text-6xl mb-4">🏪</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No businesses available
					</h3>
					<p className="text-gray-500">
						Check back later for available businesses
					</p>
				</div>
			) : (
				<div className="grid gap-4">
					{businesses.map((business: Doc<"businesses">) => (
						<BusinessListingItem
							business={business}
							key={business._id}
						/>
					))}
				</div>
			)}
		</section>
	);
};

export default BusinessListing;
