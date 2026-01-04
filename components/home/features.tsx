import {
	BarChart3,
	Bell,
	Clock,
	Shield,
	Smartphone,
	Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Features() {
	const features = [
		{
			icon: Users,
			title: "Real-Time Queue Management",
			description:
				"See all customers in your queue at a glance. Call them up with a single click and track their status in real-time.",
		},
		{
			icon: Bell,
			title: "Automated Notifications",
			description:
				"Keep customers informed with SMS and push notifications about their position and wait time estimates.",
		},
		{
			icon: BarChart3,
			title: "Analytics & Insights",
			description:
				"Understand peak hours, average wait times, and customer flow patterns to optimize your operations.",
		},
		{
			icon: Smartphone,
			title: "Customer Mobile App",
			description:
				"Customers can join queues remotely, check their position, and receive notifications on their phones.",
		},
		{
			icon: Clock,
			title: "Wait Time Estimates",
			description:
				"AI-powered predictions give customers accurate wait time estimates, reducing uncertainty and frustration.",
		},
		{
			icon: Shield,
			title: "Enterprise Security",
			description:
				"Bank-level encryption and compliance with data protection regulations keeps your customer data safe.",
		},
	];

	return (
		<section id="features" className="py-20 sm:p-32 bg-muted/40">
			<div className="container">
				<div className="mx-auto mb-16 max-w-2xl text-center">
					<h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
						Everything you need to manage queues efficiently
					</h2>
					<p className="text-pretty text-lg text-muted-foreground">
						Powerful features designed to streamline operations and
						delight your customers.
					</p>
				</div>

				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{features.map((feature) => {
						const Icon = feature.icon;
						return (
							<Card
								key={feature.title}
								className="border-border bg-card transition-shadow hover:shadow-lg"
							>
								<CardContent className="p-6">
									<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
										<Icon className="h-6 w-6 text-primary" />
									</div>
									<h3 className="mb-2 text-xl font-semibold">
										{feature.title}
									</h3>
									<p className="text-muted-foreground">
										{feature.description}
									</p>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</section>
	);
}
