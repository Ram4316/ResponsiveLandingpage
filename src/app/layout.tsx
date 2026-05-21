import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import { SmoothScrolling } from "@/components/layout/SmoothScrolling";
import { BackgroundEffects } from "@/components/layout/BackgroundEffects";

const fontVariables = {
  "--font-inter": "ui-sans-serif, system-ui, sans-serif",
  "--font-geist-mono": "ui-monospace, SFMono-Regular, Menlo, monospace",
} as CSSProperties;

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
    <html lang="en" className="antialiased" style={fontVariables}>
      <body className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
        <BackgroundEffects />
        <SmoothScrolling>{children}</SmoothScrolling>
      </body>
    </html>
  );
}
