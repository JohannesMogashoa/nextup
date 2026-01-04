export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="flex flex-col min-h-screen w-screen mx-auto max-w-3xl py-10">
			{children}
		</main>
	);
}
