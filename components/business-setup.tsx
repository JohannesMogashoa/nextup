"use client";

import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { useState } from "react";

export function BusinessSetup() {
	const { userId } = useAuth();
	const [formData, setFormData] = useState({
		name: "",
		type: "barbershop" as const,
		address: "",
		phone: "",
		averageServiceTime: 30,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const createBusiness = useMutation(api.businesses.create);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			if (!userId) {
				toast.error("User not authenticated");
				return;
			}

			await createBusiness({
				...formData,
				userId: userId,
			});
			toast.success("Business created successfully!");
		} catch (error) {
			toast.error("Failed to create business");
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto">
			<div className="bg-white rounded-lg shadow-sm border p-8">
				<h2 className="text-2xl font-bold text-gray-900 mb-6">
					Set Up Your Business
				</h2>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Business Name
						</label>
						<input
							type="text"
							required
							value={formData.name}
							onChange={(e) =>
								setFormData({
									...formData,
									name: e.target.value,
								})
							}
							className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="e.g., Joe's Barbershop"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Business Type
						</label>
						<select
							value={formData.type}
							onChange={(e) =>
								setFormData({
									...formData,
									type: e.target.value as any,
								})
							}
							className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="barbershop">Barbershop</option>
							<option value="hair_salon">Hair Salon</option>
							<option value="beauty_shop">Beauty Shop</option>
							<option value="other">Other</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Address
						</label>
						<textarea
							required
							value={formData.address}
							onChange={(e) =>
								setFormData({
									...formData,
									address: e.target.value,
								})
							}
							className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							rows={3}
							placeholder="Full business address"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Phone Number
						</label>
						<input
							type="tel"
							required
							value={formData.phone}
							onChange={(e) =>
								setFormData({
									...formData,
									phone: e.target.value,
								})
							}
							className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="e.g., +27 11 123 4567"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Average Service Time (minutes)
						</label>
						<input
							type="number"
							required
							min="5"
							max="180"
							value={formData.averageServiceTime}
							onChange={(e) =>
								setFormData({
									...formData,
									averageServiceTime: parseInt(
										e.target.value
									),
								})
							}
							className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="30"
						/>
						<p className="text-sm text-gray-500 mt-1">
							This helps estimate wait times for customers
						</p>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isSubmitting ? "Creating..." : "Create Business"}
					</button>
				</form>
			</div>
		</div>
	);
}
