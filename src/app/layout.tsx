import type { Metadata, Viewport } from "next";
import { Manrope, Onest } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

// Обе гарнитуры вариативные — массив weight указывать нельзя, иначе Next
// подгрузит статические срезы и потеряет промежуточные начертания.
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-onest",
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
  themeColor: "#fdf6e3",
  width: "device-width",
  initialScale: 1,
  // Раскладываем страницу под вырез: без этого в альбомной ориентации
  // iPhone оставляет по бокам чёрные поля, а с ним поля забирает уже сама
  // вёрстка — .shell и .shell-header учитывают safe-area-inset.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${manrope.variable} ${onest.variable}`}>
      <body className="min-h-dvh bg-paper antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-tile focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:text-paper"
        >
          Перейти к содержимому
        </a>
        <Header />
        <main id="main" className="pt-[var(--header-h)]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
