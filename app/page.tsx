import { CTA } from "@/components/home/cta";
import { Features } from "@/components/home/features";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
// import { Stats } from "@/components/home/stats";

export default function LandingPage() {
	return (
		<main className="flex flex-col min-h-screen w-screen">
			<div className="flex-1">
				<Hero />
				{/* <Stats /> */}
				<Features />
				<HowItWorks />
				<CTA />
			</div>
		</main>
	);
}
