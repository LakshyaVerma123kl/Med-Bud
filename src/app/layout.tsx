import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { Navbar } from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MedQuiz Pro — Master Forensic & Community Medicine",
  description:
    "Premium AI-powered medical quiz platform. Master K.S. Narayan Reddy's Forensic Medicine and Park's Community Medicine with instant feedback and progress tracking.",
  keywords: [
    "medical quiz",
    "forensic medicine",
    "community medicine",
    "Narayan Reddy",
    "Park textbook",
    "MCQ",
    "MBBS",
    "NEET PG",
    "USMLE",
    "medical exam preparation",
  ],
  authors: [{ name: "MedQuiz Team" }],
  openGraph: {
    title: "MedQuiz Pro",
    description: "Premium AI-powered medical quiz platform for MBBS students.",
    type: "website",
    siteName: "MedQuiz Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "MedQuiz Pro",
    description: "Premium AI-powered medical quiz platform for MBBS students.",
  },
  icons: {
    icon: "/icon.jpg",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <QueryProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
