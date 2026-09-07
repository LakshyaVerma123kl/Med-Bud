import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { Navbar } from "@/components/layout/Navbar";
import { CommandMenu } from "@/components/ui/CommandMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "MedQuiz Pro — Master Forensic & Community Medicine",
  description:
    "Premium AI-powered medical quiz platform. Master K.S. Narayan Reddy's Forensic Medicine and Park's Community Medicine with instant feedback and progress tracking.",
  keywords: [
    "medical quiz",
    "forensic medicine",
    "community medicine",
    "AI quiz generator",
    "MBBS",
    "medical students",
    "NEET PG"
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
    icon: [
      { url: "/icon.png", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <QueryProvider>
            <Navbar />
            <CommandMenu />
            <main className="flex-1">{children}</main>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
