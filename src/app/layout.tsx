import type { Metadata, Viewport } from "next";
import { Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "JKURN — Character Profile",
  description: "RPG Character Sheet for Jonathan Kurniawan — The Shaper. AI strategist, builder, connector of dots. Curious about everything, has a framework for that.",
  metadataBase: new URL("https://jkurn.me"),
  openGraph: {
    title: "JKURN — Character Profile",
    description: "RPG Character Sheet for Jonathan Kurniawan — The Shaper. AI strategist, builder, connector of dots.",
    url: "https://jkurn.me",
    siteName: "JKURN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JKURN — Character Profile",
    description: "RPG Character Sheet for Jonathan Kurniawan — The Shaper.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} ${pressStart.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
