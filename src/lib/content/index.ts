import type { Locale } from "../i18n";
import { ru } from "./ru";
import { en } from "./en";
import { zh } from "./zh";

export type { DocBlock, FeatureIcon } from "./ru";

/** Форма словаря задана русской версией; переводы обязаны её повторять. */
export type Content = typeof ru;

export { contactInfo } from "./contact-info";

const dictionaries: Record<Locale, Content> = { ru, en, zh };

/** Только для серверных компонентов: клиентским отдавайте нужную часть через props. */
export function getContent(lang: Locale): Content {
  return dictionaries[lang];
}
