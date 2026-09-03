import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  title: "MedQuiz Pro — Forensic Medicine & Community Medicine",
  description:
    "Premium medical quiz platform for Narayan Reddy (Forensic Medicine & Toxicology) and Park (Community Medicine). Practice high-quality MCQs with instant feedback, progress tracking, and motivational learning.",
  keywords: [
    "medical quiz",
    "forensic medicine",
    "community medicine",
    "Narayan Reddy",
    "Park textbook",
    "MCQ",
    "MBBS",
    "medical exam preparation",
  ],
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
