"use client";

import { Doc, Id } from "../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";

interface Props {
	business: Doc<"businesses">;
}

export function BarberDashboard({ business }: Props) {
	const { userId } = useAuth();

	const queues = useQuery(api.queues.getByBusiness, {
		businessId: business._id,
	});
	const mainQueue = queues?.[0];
	const queueData = useQuery(
		api.queues.getQueueWithEntries,
		mainQueue ? { queueId: mainQueue._id } : "skip"
	);

	const callNext = useMutation(api.queues.callNext);
	const completeService = useMutation(api.queues.completeService);
	const markNoShow = useMutation(api.queues.markNoShow);

	const [isProcessing, setIsProcessing] = useState(false);

	const handleCallNext = async () => {
		if (!mainQueue) return;
		setIsProcessing(true);
		try {
			if (!userId) throw new Error("Unauthorized");

			await callNext({ queueId: mainQueue._id, ownerClerkId: userId });
			toast.success("Next customer called!");
		} catch (error) {
			toast.error("Failed to call next customer");
		} finally {
			setIsProcessing(false);
		}
	};

	const handleComplete = async (entryId: string) => {
		setIsProcessing(true);
		try {
			if (!userId) throw new Error("Unauthorized");

			await completeService({
				entryId: entryId as Id<"queue_entries">,
				ownerClerkId: userId,
			});
			toast.success("Service completed!");
		} catch (error) {
			toast.error("Failed to complete service");
		} finally {
			setIsProcessing(false);
		}
	};

	const handleNoShow = async (entryId: string) => {
		setIsProcessing(true);
		try {
			if (!userId) throw new Error("Unauthorized");
			await markNoShow({
				entryId: entryId as Id<"queue_entries">,
				ownerClerkId: userId,
			});
			toast.success("Marked as no-show");
		} catch (error) {
			toast.error("Failed to mark as no-show");
		} finally {
			setIsProcessing(false);
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

	if (!queueData) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	const { queue, waitingEntries, beingServed, totalWaiting } = queueData;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-white rounded-lg shadow-sm border p-6">
				<div className="flex justify-between items-start">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							{business.name}
						</h1>
						<p className="text-gray-600 capitalize">
							{business.type.replace("_", " ")}
						</p>
						<p className="text-sm text-gray-500 mt-1">
							{business.address}
						</p>
					</div>
					<div className="text-right">
						<div className="text-3xl font-bold text-blue-600">
							{totalWaiting}
						</div>
						<div className="text-sm text-gray-500">in queue</div>
					</div>
				</div>
			</div>

			{/* Currently Being Served */}
			{beingServed.length > 0 && (
				<div className="bg-green-50 border border-green-200 rounded-lg p-6">
					<h2 className="text-lg font-semibold text-green-800 mb-4">
						Currently Being Served
					</h2>
					{beingServed.map((entry) => (
						<div
							key={entry._id}
							className="flex justify-between items-center bg-white rounded-lg p-4 border border-green-200"
						>
							<div>
								<div className="font-medium text-gray-900">
									{entry.customerName}
								</div>
								<div className="text-sm text-gray-500">
									{entry.customerPhone}
								</div>
								<div className="text-xs text-green-600">
									Called{" "}
									{new Date(
										entry.calledAt!
									).toLocaleTimeString()}
								</div>
							</div>
							<div className="flex gap-2">
								<button
									onClick={() => handleComplete(entry._id)}
									disabled={isProcessing}
									className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
								>
									Complete
								</button>
								<button
									onClick={() => handleNoShow(entry._id)}
									disabled={isProcessing}
									className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
								>
									No Show
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Queue Management */}
			<div className="bg-white rounded-lg shadow-sm border">
				<div className="p-6 border-b">
					<div className="flex justify-between items-center">
						<h2 className="text-lg font-semibold text-gray-900">
							Queue Management
						</h2>
						<button
							onClick={handleCallNext}
							disabled={isProcessing || totalWaiting === 0}
							className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
						>
							{isProcessing ? "Processing..." : "Call Next"}
						</button>
					</div>
				</div>

				<div className="p-6">
					{totalWaiting === 0 ? (
						<div className="text-center py-12">
							<div className="text-gray-400 text-6xl mb-4">
								👥
							</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No customers in queue
							</h3>
							<p className="text-gray-500">
								Customers can join using your business QR code
								or link
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{waitingEntries.map((entry, index) => (
								<div
									key={entry._id}
									className={`flex justify-between items-center p-4 rounded-lg border ${
										index === 0
											? "bg-blue-50 border-blue-200"
											: "bg-gray-50 border-gray-200"
									}`}
								>
									<div className="flex items-center gap-4">
										<div
											className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
												index === 0
													? "bg-blue-600 text-white"
													: "bg-gray-400 text-white"
											}`}
										>
											{index + 1}
										</div>
										<div>
											<div className="font-medium text-gray-900">
												{entry.customerName}
											</div>
											<div className="text-sm text-gray-500">
												{entry.customerPhone}
											</div>
										</div>
									</div>
									<div className="text-right">
										<div className="text-sm font-medium text-gray-900">
											~
											{formatTime(
												entry.estimatedWaitTime
											)}{" "}
											wait
										</div>
										<div className="text-xs text-gray-500">
											Joined{" "}
											{new Date(
												entry.joinedAt
											).toLocaleTimeString()}
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Share Queue Link */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
				<h3 className="text-lg font-semibold text-blue-900 mb-2">
					Share Your Queue
				</h3>
				<p className="text-blue-700 mb-4">
					Customers can join your queue using this link:
				</p>
				<div className="flex gap-2">
					<input
						type="text"
						readOnly
						value={`${window.location.origin}?join=${mainQueue?._id}`}
						className="flex-1 px-4 py-2 bg-white border border-blue-300 rounded-lg text-sm"
					/>
					<button
						onClick={() => {
							navigator.clipboard.writeText(
								`${window.location.origin}?join=${mainQueue?._id}`
							);
							toast.success("Link copied to clipboard!");
						}}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
					>
						Copy
					</button>
				</div>
			</div>
		</div>
	);
}
