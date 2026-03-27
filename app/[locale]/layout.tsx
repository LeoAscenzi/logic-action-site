import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import "../globals.css";
import {NextIntlClientProvider} from 'next-intl';
import Header from "../components/header";
import Footer from "../components/footer";
import { ThemeProvider } from "../context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ["400", "600", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "800"],
})
export const metadata: Metadata = {
  title: "Project Logic Action",
  description: "Project Logic Action description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${playfair.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <ThemeProvider>
            <Header/>
            {children}
            <Footer/>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
