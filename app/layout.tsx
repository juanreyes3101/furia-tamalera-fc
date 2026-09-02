import type { Metadata } from "next";
import { Inter } from "next/font/google";
import BackgroundFX from "@/components/BackgroundFX";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Furia Tamalera FC",
  description:
    "Dieciséis amigos, un torneo de verdad y cero excusas. Furia Tamalera FC — Torneo Fansport, Bogotá.",
  openGraph: {
    title: "Furia Tamalera FC",
    description: "Dieciséis amigos, un torneo de verdad y cero excusas.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="relative min-h-full overflow-x-hidden bg-bg text-ink">
        <BackgroundFX />
        {children}
      </body>
    </html>
  );
}
