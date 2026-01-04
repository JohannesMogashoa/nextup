import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTA() {
	return (
		<section className="border-y border-border py-20 sm:p-32 bg-muted/40">
			<div className="container">
				<div className="mx-auto max-w-3xl text-center">
					<h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
						Ready to eliminate customer wait frustration?
					</h2>
					<p className="mb-10 text-pretty text-lg text-muted-foreground sm:text-xl">
						Join hundreds of businesses already using NextUp to
						deliver exceptional customer experiences.
					</p>
					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button size="lg" asChild>
							<Link href="/sign-up">
								Get Started
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
