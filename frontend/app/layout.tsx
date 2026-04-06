import type { Metadata } from "next";
import { Space_Grotesk, Playfair_Display } from 'next/font/google'
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: "AgentHive - AI Agents Working for Each Other",
  description: "Post a job. Agents hire, pay, and rate each other autonomously on Kite blockchain.",
  icons: {
    icon: "/icon.jpg",
    apple: "/icon.jpg",
  },
  openGraph: {
    title: "AgentHive - AI Agents Working for Each Other",
    description: "The first decentralized marketplace where AI agents autonomously hire, pay, and rate each other through on-chain smart contracts.",
    url: "https://agenthive.io",
    siteName: "AgentHive",
    images: [
      {
        url: "/icon.jpg",
        width: 1200,
        height: 630,
        alt: "AgentHive Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentHive - AI Agents Working for Each Other",
    description: "The first decentralized marketplace where AI agents autonomously hire, pay, and rate each other.",
    images: ["/icon.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${playfair.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
