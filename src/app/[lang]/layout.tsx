import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Manrope, Onest } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MotionProvider from "@/components/ui/MotionProvider";
import CookieBanner from "@/components/ui/CookieBanner";
import { getContent } from "@/lib/content";
import { contactInfo } from "@/lib/content/contact-info";
import { alternatesFor, isLocale, localeMeta, locales, localizeHref, siteUrl } from "@/lib/i18n";
import { setRequestLocale } from "@/lib/request-locale";
import "../globals.css";

// Обе гарнитуры вариативные — массив weight указывать нельзя, иначе Next
// подгрузит статические срезы и потеряет промежуточные начертания.
// Иероглифов в них нет: китайский текст берёт системный шрифт из стека в globals.css.
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

type Props = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Других языков нет: адрес вида /wp-login.php (точка уводит его мимо
// переписывания в middleware) сразу получает 404, а не рендерится на сервере
// и не оседает в кеше на диске отдельной страницей.
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  // Без metadataBase ссылки в метатегах 404 получили бы адрес localhost.
  if (!isLocale(lang)) return { metadataBase: new URL(siteUrl) };
  setRequestLocale(lang);
  const { meta } = getContent(lang);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: meta.titleDefault,
      template: meta.titleTemplate,
    },
    description: meta.description,
    keywords: meta.keywords,
    alternates: alternatesFor(lang, "/"),
    openGraph: {
      type: "website",
      locale: localeMeta[lang].ogLocale,
      alternateLocale: locales.filter((l) => l !== lang).map((l) => localeMeta[l].ogLocale),
      siteName: meta.siteName,
      url: localizeHref(lang, "/"),
      title: meta.ogTitle,
      description: meta.ogDescription,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#fdf6e3",
  width: "device-width",
  initialScale: 1,
  // Раскладываем страницу под вырез: без этого в альбомной ориентации
  // iPhone оставляет по бокам чёрные поля, а с ним поля забирает уже сама
  // вёрстка — .shell и .shell-header учитывают safe-area-inset.
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  // Для страницы 404 внутри этого layout: ей Next не передаёт params.
  setRequestLocale(lang);
  const t = getContent(lang);

  // Карточка организации для поисковиков: только то, что уже написано на сайте.
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t.site.name,
    legalName: t.site.legalName,
    url: siteUrl + localizeHref(lang, "/"),
    logo: `${siteUrl}/apple-icon`,
    telephone: contactInfo.phone,
    email: contactInfo.email,
    address: t.site.office,
    description: t.meta.description,
  };

  return (
    // suppressHydrationWarning: страховочный скрипт ниже может поставить
    // атрибут на <html> раньше гидратации, и React не должен на это ругаться.
    // data-scroll-behavior: Next сам выключает плавную прокрутку на время
    // перехода между страницами, но в следующих версиях — только с этим атрибутом.
    <html
      lang={localeMeta[lang].htmlLang}
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${onest.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Блоки Reveal скрыты в CSS до срабатывания скрипта. Без JS их
            показывает <noscript>; если бандл не выполнился или гидратация
            упала, через 4 секунды их откроет инлайн-скрипт (Reveal ставит
            data-reveal-ready, как только заработал). */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'setTimeout(function(){var d=document.documentElement;if(!d.hasAttribute("data-reveal-ready"))d.setAttribute("data-reveal-fallback","")},4000)',
          }}
        />
      </head>
      <body className="min-h-dvh bg-paper antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-tile focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:text-paper"
        >
          {t.meta.skipLink}
        </a>
        <MotionProvider>
          <Header lang={lang} nav={t.nav} t={t.header} />
          <main id="main" className="pt-[var(--header-h)]">
            {children}
          </main>
          <Footer lang={lang} t={t} />
          <CookieBanner lang={lang} t={t.cookieBanner} />
        </MotionProvider>
      </body>
    </html>
  );
}
