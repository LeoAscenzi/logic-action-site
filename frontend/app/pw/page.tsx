import { Suspense } from "react";
import PwForm from "./PwForm";

export default function PwPage() {
	return (
		<main className="min-h-screen flex items-center justify-center bg-[var(--navy)]">
			<Suspense>
				<PwForm />
			</Suspense>
		</main>
	);
}
