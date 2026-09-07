import type { Metadata, Viewport } from "next";
import { Source_Serif_4, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { Navbar } from "@/components/layout/Navbar";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

const CommandMenu = dynamic(
  () => import("@/components/ui/CommandMenu").then((m) => m.CommandMenu)
);

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600"],
  preload: false,
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F5F0" },
    { media: "(prefers-color-scheme: dark)", color: "#121817" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

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
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MedQuiz Pro",
  },
  formatDetection: {
    telephone: false,
  },
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
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
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
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${sourceSerif.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="dns-prefetch" href="https://gzjbpbkjalygekqoluln.supabase.co" />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <QueryProvider>
            <ServiceWorkerRegister />
            <Navbar />
            <CommandMenu />
            <main className="flex-1">{children}</main>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
