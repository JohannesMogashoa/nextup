import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

import { Header } from "@/components/header";
import type { Metadata } from "next";
import { Providers } from "./providers";
import type React from "react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "My Next.js App",
	description: "A Next.js application with Convex and Clerk integration.",
	generator: "next-clerk-convex-starter",
	icons: {
		icon: [
			{
				url: "/icon-light-32x32.png",
				media: "(prefers-color-scheme: light)",
			},
			{
				url: "/icon-dark-32x32.png",
				media: "(prefers-color-scheme: dark)",
			},
			{
				url: "/icon.svg",
				type: "image/svg+xml",
			},
		],
		apple: "/apple-icon.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<Header />
					{children}
				</Providers>
			</body>
		</html>
	);
}
