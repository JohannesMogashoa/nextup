"use client";

import { Authenticated, Unauthenticated, useQuery } from "convex/react";

import { BarberDashboard } from "./barber-dashboard";
import { BusinessSetup } from "./business-setup";
import { CustomerView } from "./customer-view";
import { Toaster } from "sonner";
import { api } from "../convex/_generated/api";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";

export default function HomePage() {
	const [view, setView] = useState<"barber" | "customer">("barber");
	const { userId } = useAuth();

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
				<div className="flex items-center gap-4">
					<h2 className="text-xl font-semibold text-primary">
						QueueSA
					</h2>
					<div className="flex gap-2">
						<button
							onClick={() => setView("barber")}
							className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
								view === "barber"
									? "bg-blue-100 text-blue-700"
									: "text-gray-600 hover:text-gray-900"
							}`}
						>
							Barber
						</button>
						<button
							onClick={() => setView("customer")}
							className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
								view === "customer"
									? "bg-green-100 text-green-700"
									: "text-gray-600 hover:text-gray-900"
							}`}
						>
							Customer
						</button>
					</div>
				</div>
			</header>
			<main className="flex-1 p-4">
				{userId && <Content view={view} userId={userId} />}
			</main>
			<Toaster />
		</div>
	);
}

function Content({
	view,
	userId,
}: {
	view: "barber" | "customer";
	userId: string;
}) {
	const loggedInUser = useQuery(api.users.getUserByClerkId, {
		clerkId: userId,
	});
	const myBusiness = useQuery(api.businesses.getMyBusiness, { userId });

	if (view === "customer") {
		return <CustomerView />;
	}

	if (loggedInUser === undefined || myBusiness === undefined) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto">
			<Unauthenticated>
				<div className="max-w-md mx-auto">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold text-gray-900 mb-4">
							QueueSA for Business
						</h1>
						<p className="text-xl text-gray-600">
							Manage your barbershop or salon queue efficiently
						</p>
					</div>
				</div>
			</Unauthenticated>

			<Authenticated>
				{!myBusiness ? (
					<BusinessSetup />
				) : (
					<BarberDashboard business={myBusiness} />
				)}
			</Authenticated>
		</div>
	);
}
