import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CineMax - Your Movie Companion",
  description: "Discover and rate your favorite movies with AI-powered recommendations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-[#1a1a2e] text-white">
          {children}
        </div>
      </body>
    </html>
  );
}
