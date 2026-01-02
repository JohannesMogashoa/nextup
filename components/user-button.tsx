"use client";

import { UserButton as ClerkUserButton } from "@clerk/nextjs";

export function UserButton() {
	return (
		<ClerkUserButton
			appearance={{
				elements: {
					avatarBox: "w-9 h-9",
				},
			}}
		/>
	);
}
