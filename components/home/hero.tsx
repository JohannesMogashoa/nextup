import { ArrowRight, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
	return (
		<section className="bg-background py-20 sm:p-32">
			<div className="mx-auto max-w-3xl text-center">
				<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm">
					<CheckCircle className="h-4 w-4 text-muted-foreground" />
					<span className="text-muted-foreground">
						Trusted by 500+ businesses
					</span>
				</div>

				<h1 className="mb-6 text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
					Transform Your Customer Wait Experience
				</h1>

				<p className="mb-10 text-pretty text-lg text-muted-foreground sm:text-xl">
					Say goodbye to crowded waiting rooms and frustrated
					customers. NextUP brings modern digital queue management to
					your business with real-time updates and seamless customer
					flow.
				</p>

				<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
					<Button
						size="lg"
						variant="outline"
						asChild
						className="w-full sm:w-auto bg-transparent"
					>
						<Link href="#how-it-works">See How It Works</Link>
					</Button>
					<Button size="lg" asChild className="w-full sm:w-auto">
						<Link href="/sign-up">
							Get Started Today
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				</div>
			</div>

			{/* Hero Visual */}
			<div className="mx-auto mt-16 max-w-5xl">
				<div className="relative rounded-xl border border-border bg-muted/50 p-2 shadow-2xl">
					<div className="aspect-video overflow-hidden rounded-lg bg-card">
						<img
							src="modern-queue-management-dashboard-showing-customer.jpg"
							alt="QueueFlow Dashboard"
							className="h-full w-full object-cover"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
