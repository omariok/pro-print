import type { Metadata, Viewport } from "next";
import { Inter, Unbounded } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-unbounded",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pro-print.pro"),
  title: {
    default: "Про-Принт — флексографская печать на пищевых плёнках",
    template: "%s — Про-Принт",
  },
  description:
    "Печать до 10 красок на пищевых плёнках от 8 мкм: стретч, ПВХ, POF, полиэтилен и барьерные многослойные. Собственная флексографская машина и производство полного цикла в Ленинградской области.",
  keywords: [
    "флексопечать",
    "печать на плёнке",
    "стретч-плёнка",
    "пищевая плёнка",
    "ПВХ-плёнка",
    "POF",
    "полиэтиленовая плёнка",
    "барьерная плёнка",
    "упаковка для лотков",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Про-Принт",
    title: "Про-Принт — печать до 10 красок на пищевых плёнках",
    description:
      "Флексографская печать CMYK и пантонами на стретч, ПВХ, POF, полиэтиленовых и барьерных плёнках от 8 мкм. Производство в Ленинградской области.",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-paper antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Перейти к содержимому
        </a>
        <Header />
        <main id="main" className="pt-[68px] lg:pt-[76px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
