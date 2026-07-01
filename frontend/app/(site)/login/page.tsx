import type { Metadata } from "next";
import { Suspense } from "react";
import LoginContent from "./LoginContent";

export const metadata: Metadata = {
  title: "Log In",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
