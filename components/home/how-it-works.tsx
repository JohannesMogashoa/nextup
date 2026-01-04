import { Card, CardContent } from "@/components/ui/card";

export function HowItWorks() {
	const steps = [
		{
			step: "01",
			title: "Create Your Business Profile",
			description:
				"Set up your business in minutes. Add your services, configure queue settings, and customize the customer experience.",
		},
		{
			step: "02",
			title: "Customers Join the Queue",
			description:
				"Customers can join your queue remotely via QR code, web link, or in-person at your location. They receive instant confirmation.",
		},
		{
			step: "03",
			title: "Manage & Call Customers",
			description:
				"View your queue dashboard, call customers when ready, and track service times. Customers receive automated notifications.",
		},
		{
			step: "04",
			title: "Analyze & Optimize",
			description:
				"Review analytics to understand patterns, reduce wait times, and improve customer satisfaction over time.",
		},
	];

	return (
		<section
			id="how-it-works"
			className="border-t border-border py-20 sm:p-32"
		>
			<div className="container">
				<div className="mx-auto mb-16 max-w-2xl text-center">
					<h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
						How QueueFlow Works
					</h2>
					<p className="text-pretty text-lg text-muted-foreground">
						Get started in four simple steps and transform your
						customer experience today.
					</p>
				</div>

				<div className="grid gap-8 md:grid-cols-2">
					{steps.map((item) => (
						<Card key={item.step} className="border-border bg-card">
							<CardContent className="p-8">
								<div className="mb-4 text-5xl font-bold text-primary/20">
									{item.step}
								</div>
								<h3 className="mb-3 text-2xl font-semibold">
									{item.title}
								</h3>
								<p className="text-muted-foreground">
									{item.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
