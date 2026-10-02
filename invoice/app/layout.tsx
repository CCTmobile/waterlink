import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import PasswordGate from "./components/PasswordGate";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WaterLinks Borehole Studio — Invoices, Quotes & Borehole Certificates",
  description:
    "Official billing, borehole drilling quotations, insurance damage assessment reports, and borehole specification certificates for WaterLinks Borehole Services Gauteng.",
  keywords: [
    "WaterLinks Borehole Services",
    "Borehole Certificate",
    "Borehole Drilling Gauteng",
    "Pump Installation Certificate",
    "Borehole Spec Sheet",
    "Borehole Invoice Generator",
    "Tax Invoice",
    "JoJo Tank Installation",
  ],
  icons: {
    icon: "/waterlinks-logo.svg",
    apple: "/waterlinks-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#070f1e] text-[#0f172a] selection:bg-[#0284c7] selection:text-white">
        <PasswordGate>{children}</PasswordGate>
      </body>
    </html>
  );
}
