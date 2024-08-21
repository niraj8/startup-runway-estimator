import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Startup Runway Estimator",
  description: "guestimate runway for your startup",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://startup-runway-estimator.vercel.app",
    images: [
      {
        url: "https://startup-runway-estimator.vercel.app/api/og",
        alt: "Startup Runway Estimator",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}
      <Analytics />
      </body>
    </html>
  );
}
