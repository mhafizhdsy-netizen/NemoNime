import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NemoNime - Free Anime Streaming Platform",
  description: "Watch anime online for free in HD quality with English subtitles and dub. Stream thousands of anime episodes with no ads.",
  keywords: ["anime", "streaming", "watch anime", "free anime", "anime online", "dub", "sub"],
  authors: [{ name: "NemoNime Team" }],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "NemoNime - Free Anime Streaming Platform",
    description: "Watch anime online for free in HD quality with English subtitles and dub.",
    url: "https://nemonime.vercel.app",
    siteName: "NemoNime",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NemoNime - Free Anime Streaming Platform",
    description: "Watch anime online for free in HD quality with English subtitles and dub.",
  },
  manifest: "/manifest.json",
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
