import { FolderOpen } from "lucide-react";
import { UserButton } from "./user-button";

export function Header() {
	return (
		<header className="border-b border-border bg-card">
			<div className="flex h-16 items-center justify-between px-6">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
							<FolderOpen className="h-5 w-5 text-primary-foreground" />
						</div>
						<div>
							<h1 className="text-lg font-semibold text-foreground">
								My NextJS APP
							</h1>
							<p className="text-xs text-muted-foreground">
								My App
							</p>
						</div>
					</div>
				</div>
				<UserButton />
			</div>
		</header>
	);
}
