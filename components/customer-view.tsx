"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

export function CustomerView() {
	const [step, setStep] = useState<"select" | "join" | "status">("select");
	const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");
	const [selectedQueueId, setSelectedQueueId] = useState<string>("");
	const [customerData, setCustomerData] = useState({
		name: "",
		phone: "",
	});

	const businesses = useQuery(api.businesses.list);
	const queues = useQuery(
		api.queues.getByBusiness,
		selectedBusinessId
			? { businessId: selectedBusinessId as Id<"businesses"> }
			: "skip"
	);
	const customerStatus = useQuery(
		api.queues.getCustomerStatus,
		step === "status" && selectedQueueId && customerData.phone
			? {
					queueId: selectedQueueId as Id<"queues">,
					customerPhone: customerData.phone,
			  }
			: "skip"
	);

	const joinQueue = useMutation(api.queues.joinQueue);

	// Check URL for direct queue join
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const joinQueueId = urlParams.get("join");

		if (joinQueueId) {
			setSelectedQueueId(joinQueueId);
			setStep("join");
		}
	}, []);

	const handleJoinQueue = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedQueueId || !customerData.name || !customerData.phone)
			return;

		try {
			await joinQueue({
				queueId: selectedQueueId as Id<"queues">,
				customerName: customerData.name,
				customerPhone: customerData.phone,
			});
			setStep("status");
			toast.success("Successfully joined the queue!");
		} catch (error: any) {
			toast.error(error.message || "Failed to join queue");
		}
	};

	const formatTime = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0) {
			return `${hours}h ${mins}m`;
		}
		return `${mins}m`;
	};

	if (step === "status" && customerStatus) {
		return (
			<div className="max-w-md mx-auto">
				<div className="bg-white rounded-lg shadow-sm border p-6 text-center">
					<div className="text-6xl mb-4">
						{customerStatus.status === "being_served" ? "✂️" : "⏰"}
					</div>

					{customerStatus.status === "being_served" ? (
						<>
							<h2 className="text-2xl font-bold text-green-600 mb-2">
								{"It's Your Turn!"}
							</h2>
							<p className="text-gray-600 mb-4">
								Please head to the shop now
							</p>
							<div className="bg-green-50 border border-green-200 rounded-lg p-4">
								<p className="text-green-800 font-medium">
									You are currently being served
								</p>
							</div>
						</>
					) : (
						<>
							<h2 className="text-2xl font-bold text-blue-600 mb-2">
								{"You're in the Queue!"}
							</h2>
							<p className="text-gray-600 mb-6">
								{"We'll notify you when it's almost your turn"}
							</p>

							<div className="space-y-4">
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
									<div className="text-3xl font-bold text-blue-600">
										#{customerStatus.currentPosition}
									</div>
									<div className="text-sm text-blue-700">
										Your position in queue
									</div>
								</div>

								<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
									<div className="text-2xl font-bold text-gray-900">
										~
										{formatTime(
											customerStatus.estimatedWaitTime
										)}
									</div>
									<div className="text-sm text-gray-600">
										Estimated wait time
									</div>
								</div>
							</div>

							<div className="mt-6 text-sm text-gray-500">
								<p>
									Joined at{" "}
									{new Date(
										customerStatus.joinedAt
									).toLocaleTimeString()}
								</p>
							</div>
						</>
					)}

					<button
						onClick={() => {
							setStep("select");
							setSelectedBusinessId("");
							setSelectedQueueId("");
							setCustomerData({ name: "", phone: "" });
						}}
						className="mt-6 w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 font-medium"
					>
						Leave Queue
					</button>
				</div>
			</div>
		);
	}

	if (step === "status" && !customerStatus) {
		return (
			<div className="max-w-md mx-auto">
				<div className="bg-white rounded-lg shadow-sm border p-6 text-center">
					<div className="text-6xl mb-4">❌</div>
					<h2 className="text-2xl font-bold text-red-600 mb-2">
						Not in Queue
					</h2>
					<p className="text-gray-600 mb-6">
						You are not currently in any queue
					</p>
					<button
						onClick={() => setStep("select")}
						className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
					>
						Join a Queue
					</button>
				</div>
			</div>
		);
	}

	if (step === "join") {
		return (
			<div className="max-w-md mx-auto">
				<div className="bg-white rounded-lg shadow-sm border p-6">
					<h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
						Join the Queue
					</h2>

					<form onSubmit={handleJoinQueue} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Your Name
							</label>
							<input
								type="text"
								required
								value={customerData.name}
								onChange={(e) =>
									setCustomerData({
										...customerData,
										name: e.target.value,
									})
								}
								className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter your full name"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Phone Number
							</label>
							<input
								type="tel"
								required
								value={customerData.phone}
								onChange={(e) =>
									setCustomerData({
										...customerData,
										phone: e.target.value,
									})
								}
								className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="e.g., +27 81 123 4567"
							/>
						</div>

						<div className="flex gap-3 pt-4">
							<button
								type="button"
								onClick={() => setStep("select")}
								className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
							>
								Back
							</button>
							<button
								type="submit"
								className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
							>
								Join Queue
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto">
			<div className="text-center mb-8">
				<h1 className="text-4xl font-bold text-gray-900 mb-4">
					Join a Queue
				</h1>
				<p className="text-xl text-gray-600">
					{
						"Skip the wait - join remotely and arrive when it's your turn"
					}
				</p>
			</div>

			{!businesses ? (
				<div className="flex justify-center items-center min-h-[200px]">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
				</div>
			) : businesses.length === 0 ? (
				<div className="bg-white rounded-lg shadow-sm border p-8 text-center">
					<div className="text-gray-400 text-6xl mb-4">🏪</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No businesses available
					</h3>
					<p className="text-gray-500">
						Check back later for available queues
					</p>
				</div>
			) : (
				<div className="grid gap-4">
					{businesses.map((business) => (
						<div
							key={business._id}
							className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
							onClick={() => {
								setSelectedBusinessId(business._id);
								if (queues && queues.length > 0) {
									setSelectedQueueId(queues[0]._id);
									setStep("join");
								}
							}}
						>
							<div className="flex justify-between items-start">
								<div className="flex-1">
									<h3 className="text-lg font-semibold text-gray-900">
										{business.name}
									</h3>
									<p className="text-gray-600 capitalize mb-2">
										{business.type.replace("_", " ")}
									</p>
									<p className="text-sm text-gray-500 mb-3">
										{business.address}
									</p>
									<p className="text-sm text-gray-500">
										{business.phone}
									</p>
								</div>
								<div className="text-right">
									<div className="text-sm text-green-600 font-medium">
										~
										{formatTime(
											business.averageServiceTime
										)}{" "}
										per service
									</div>
								</div>
							</div>

							<div className="mt-4 pt-4 border-t border-gray-100">
								<button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
									Join Queue
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
