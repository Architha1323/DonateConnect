import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Chatbot } from "@/components/ui/chatbot";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DonateConnect - Donation & Reuse Platform",
    template: "%s | DonateConnect",
  },
  description: "Connect with verified NGOs to donate clothes and household items. Schedule pickups, track donations, and make a difference.",
  keywords: ["donation", "NGO", "clothes", "reuse", "sustainability", "charity"],
  icons: {
    icon: "/icon.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans min-h-screen flex flex-col antialiased bg-background text-foreground selection:bg-primary/20`}>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}
