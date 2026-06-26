import React from "react";
import Section from "../../components/section";
import ThemeToggle from "../../components/themeToggle";

interface AboutLayoutProps {
    children: React.ReactNode,
}

export default function FAQLayout({
    children,
} : Readonly<AboutLayoutProps>) {
    return (
        <div>
            {children}
        </div>
    )
} 