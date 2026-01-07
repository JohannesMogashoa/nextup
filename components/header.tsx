import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignInButton, SignedIn, SignedOut, UserAvatar } from "@clerk/nextjs";

import { Clock } from "lucide-react";
import Link from "next/link";

export function Header() {
	return (
		<header className="sticky top-0 p-3 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="flex items-center justify-between">
				<Link href="/" className="flex items-center gap-2">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
						<Clock className="h-5 w-5 text-primary-foreground" />
					</div>
					<span className="text-xl font-semibold">Next UP</span>
				</Link>

				<SignedIn>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<UserAvatar />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Profile</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href={"/dashboard/businesses"}>
									My Businesses
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href={"/dashboard/queues"}>
									My Queues
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SignedIn>
				<SignedOut>
					<SignInButton />
				</SignedOut>
			</div>
		</header>
	);
}
