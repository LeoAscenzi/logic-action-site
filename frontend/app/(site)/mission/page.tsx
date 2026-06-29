import type { Metadata } from "next";

// Stub page — noindex until real content is added, then switch to
// `index: true`, add a description, and re-add `/mission` to app/sitemap.ts.
export const metadata: Metadata = {
    title: "Our Mission",
    robots: { index: false, follow: true },
};

export default function Mission(){
    return (
    <div>
        Mission Page
    </div>
    )
}