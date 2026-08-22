import type { Metadata } from "next";
import { Geist, Geist_Mono, Luckiest_Guy } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const luckiestGuy = Luckiest_Guy({
  variable: "--font-luckiest-guy",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shuttlers - Badminton Tournament Hub",
  description: "Find, register, and compete in badminton tournaments. The frictionless ecosystem for players and organizers.",
  openGraph: {
    title: "Summer Smash 2026 | Shuttlers Badminton Tournament",
    description: "Register now for the ultimate badminton showdown! Multiple categories, great prizes, and seamless experience.",
    url: "https://shuttlers-tournament.vercel.app",
    siteName: "Shuttlers Hub",
    images: [
      {
        url: "https://shuttlers-tournament-website-pi.vercel.app/logo_files/55e0e4b73d7f5850f01115d0ff377b42.jpg",
        width: 1200,
        height: 630,
        alt: "Tournament Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  other: {
    "google-adsense-account": "ca-pub-2193336247056649"
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${luckiestGuy.variable} h-full antialiased`}
    >
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2193336247056649"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
