import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import AppProviders from "@/components/AppProviders";
import Background from "@/components/Background";
import CommandPalette from "@/components/CommandPalette";
import CursorHint from "@/components/CursorHint";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import ViewTransitions from "@/components/ViewTransitions";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Eshaan Punalekar",
  description: "Software engineer. Projects, writing, and what I'm building now.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <AppProviders>
          {/* Background is mounted once here, not per page, so the accent
              colour can cross-fade across navigation instead of hard-cutting. */}
          <Background />
          <ViewTransitions />
          <Nav />
          {children}
          <Footer />
          <CommandPalette />
          <CursorHint />
        </AppProviders>
      </body>
    </html>
  );
}
