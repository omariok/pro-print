/**
 * Выбор посетителя в окне о cookie. Хранится только в его браузере
 * (localStorage, ключ pp-consent) и описан на странице /legal#cookies —
 * меняя ключ, срок или состав, поправьте таблицу там во всех словарях.
 *
 * Аналитику (например, Яндекс Метрику) подключать только если
 * readConsent()?.analytics === true, и слушать событие CONSENT_EVENT:
 * посетитель может разрешить её позже.
 */
export type Consent = { v: 1; analytics: boolean; at: string };

const KEY = "pp-consent";
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

/** Выбор сделан или изменён: detail — Consent или null, если выбор сброшен. */
export const CONSENT_EVENT = "pp:consent";
/** Попросить окно о cookie открыться снова. */
export const CONSENT_OPEN_EVENT = "pp:consent-open";

export function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<Consent>;
    const at = Date.parse(data.at ?? "");
    if (data.v !== 1 || typeof data.analytics !== "boolean" || !at) return null;
    // Через год спрашиваем заново — так записано на странице правовой информации.
    if (Date.now() - at > MAX_AGE_MS) return null;
    return data as Consent;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean): Consent {
  const consent: Consent = { v: 1, analytics, at: new Date().toISOString() };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(consent));
  } catch {
    // Хранилище недоступно (приватный режим, запрет сайта): выбор действует до перезагрузки.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: consent }));
  return consent;
}

export function resetConsent() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // см. saveConsent
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
