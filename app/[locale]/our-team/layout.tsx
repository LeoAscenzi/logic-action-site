import React from "react";
import Section from "../../components/section";
import ThemeToggle from "../../components/themeToggle";

interface AboutLayoutProps {
    children: React.ReactNode,
}

export default function AboutLayout({
    children,
} : Readonly<AboutLayoutProps>) {
    return (
        <div>
            {children}
            <ThemeToggle/>
            <Section>
                <div>I am content</div>
            </Section>
            <Section variant="alt">
                <div>I am more content</div>
            </Section>
        </div>
    )
} 