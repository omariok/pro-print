import type { MetadataRoute } from "next";
import { alternatesFor, locales, localizeHref, siteUrl } from "@/lib/i18n";

/** Все страницы на всех языках; у каждой — ссылки на её версии на других языках. */
const pages = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.7 },
  { path: "/contacts", priority: 0.7 },
  { path: "/privacy", priority: 0.2 },
  { path: "/legal", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap(({ path, priority }) =>
    locales.map((lang) => ({
      url: siteUrl + localizeHref(lang, path),
      priority,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(alternatesFor(lang, path).languages).map(([code, href]) => [code, siteUrl + href]),
        ),
      },
    })),
  );
}
