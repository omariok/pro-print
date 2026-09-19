import { cache } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n";

/**
 * Язык текущего запроса для страницы 404: params ей Next не передаёт.
 * Layout кладёт язык сюда, 404 читает отсюда. React.cache живёт ровно один
 * запрос на сервере, поэтому страницы остаются статическими — чтение
 * заголовков (headers()) заставило бы Next рендерить каждую страницу заново
 * на каждый заход.
 */
const store = cache(() => ({ locale: defaultLocale as Locale }));

export function setRequestLocale(locale: Locale) {
  store().locale = locale;
}

export function getRequestLocale(): Locale {
  return store().locale;
}
