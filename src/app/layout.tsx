import type { Metadata, Viewport } from "next";
import { Source_Serif_4, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { Navbar } from "@/components/layout/Navbar";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600"],
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
        <link rel="preconnect" href="https://gzjbpbkjalygekqoluln.supabase.co" crossOrigin="anonymous" />
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
