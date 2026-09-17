/**
 * Языки сайта. Русский — основной и живёт без префикса (`/about`), остальные —
 * под своим префиксом (`/en/about`, `/zh/about`). Middleware незаметно
 * переписывает адреса без префикса на `/ru/...`, поэтому в app/ все страницы
 * лежат под одним сегментом [lang].
 */
export const locales = ["ru", "en", "zh"] as const;

/** Боевой адрес сайта: из него собираются canonical, hreflang, sitemap и карточки ссылок. */
export const siteUrl = "https://pro-print.pro";
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";

export const localeMeta: Record<
  Locale,
  { short: string; name: string; htmlLang: string; ogLocale: string }
> = {
  ru: { short: "RU", name: "Русский", htmlLang: "ru", ogLocale: "ru_RU" },
  en: { short: "EN", name: "English", htmlLang: "en", ogLocale: "en_US" },
  zh: { short: "中文", name: "简体中文", htmlLang: "zh-CN", ogLocale: "zh_CN" },
};

export function isLocale(value: string | undefined): value is Locale {
  return (locales as readonly string[]).includes(value ?? "");
}

/** Язык по адресу из строки браузера: `/en/about` → en, `/about` → ru. */
export function localeFromPath(pathname: string): Locale {
  const first = pathname.split("/")[1];
  return isLocale(first) ? first : defaultLocale;
}

/** Адрес без языкового префикса: `/en/about` → `/about`, `/en` → `/`. */
export function stripLocale(pathname: string): string {
  const first = pathname.split("/")[1];
  if (!isLocale(first)) return pathname || "/";
  return pathname.slice(first.length + 1) || "/";
}

/**
 * Внутренняя ссылка на нужном языке. Принимает адреса в «русском» виде —
 * `/`, `/about`, `/#request` — и добавляет префикс для en и zh.
 */
export function localizeHref(lang: Locale, href: string): string {
  if (lang === defaultLocale || !href.startsWith("/")) return href;
  if (href === "/") return `/${lang}`;
  if (href.startsWith("/#")) return `/${lang}${href.slice(1)}`;
  return `/${lang}${href}`;
}

/** Подстановка {name} в строку словаря: в словарях нет функций, их можно отдавать в клиентские компоненты. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

/**
 * canonical и hreflang для страницы. `path` — адрес в «русском» виде (`/`,
 * `/about`); x-default указывает на русскую версию как основную.
 */
export function alternatesFor(lang: Locale, path: string) {
  return {
    canonical: localizeHref(lang, path),
    languages: {
      ru: path,
      en: localizeHref("en", path),
      "zh-CN": localizeHref("zh", path),
      "x-default": path,
    },
  };
}
