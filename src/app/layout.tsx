import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrolling } from "@/components/layout/SmoothScrolling";
import { BackgroundEffects } from "@/components/layout/BackgroundEffects";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono", // Keeping css variable same to avoid updating css
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "nei.co | AI That Changes Your Life",
  description: "Premium futuristic AI SaaS landing page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
        <BackgroundEffects />
        <SmoothScrolling>{children}</SmoothScrolling>
      </body>
    </html>
  );
}
