import type { Metadata } from "next";

// sign-up/page.tsx is a client component, so its metadata lives here.
export const metadata: Metadata = {
	title: "Sign Up",
	robots: { index: false, follow: false },
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
