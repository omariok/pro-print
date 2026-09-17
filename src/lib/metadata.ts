import type { Metadata } from "next";
import { getContent } from "./content";
import { alternatesFor, localeMeta, localizeHref, type Locale } from "./i18n";

/**
 * Метаданные внутренней страницы. Next не сливает openGraph с layout, а
 * заменяет его целиком, поэтому без этого помощника карточка ссылки на
 * «О компании» показывала бы заголовок главной. `path` — адрес в «русском»
 * виде (`/about`).
 */
export function pageMetadata(
  lang: Locale,
  path: string,
  { title, description }: { title: string; description: string },
): Metadata {
  const { meta } = getContent(lang);
  return {
    title,
    description,
    alternates: alternatesFor(lang, path),
    openGraph: {
      type: "website",
      siteName: meta.siteName,
      locale: localeMeta[lang].ogLocale,
      url: localizeHref(lang, path),
      title: meta.titleTemplate.replace("%s", title),
      description,
      // Карточку из [lang]/opengraph-image Next подставляет сам, только пока
      // страница не задаёт свой openGraph, — здесь её приходится назвать явно.
      // У русской версии адрес с /ru: так файл лежит физически, middleware его пропускает.
      images: [{ url: `/${lang}/opengraph-image/card`, width: 1200, height: 630, alt: meta.ogImageAlt }],
    },
  };
}
