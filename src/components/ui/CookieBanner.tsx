"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import type { Content } from "@/lib/content";
import { CONSENT_OPEN_EVENT, readConsent, resetConsent, saveConsent } from "@/lib/consent";
import { localizeHref, type Locale } from "@/lib/i18n";

type Props = { lang: Locale; t: Content["cookieBanner"] };

const button =
  "min-h-11 flex-1 rounded-pill px-5 py-3 font-display text-[14px] font-bold press active:scale-[0.97]";
const link =
  "text-ink underline decoration-ink/25 underline-offset-[3px] transition-colors duration-200 hover:text-[var(--accent-text)] hover:decoration-[var(--accent-text)]";

/**
 * Окно о cookie. Не модальное: сайт остаётся доступным, окно просто ждёт
 * выбора внизу экрана. Обе кнопки одного веса — выбор без подталкивания.
 */
export default function CookieBanner({ lang, t }: Props) {
  const [open, setOpen] = useState(false);
  const still = useReducedMotion();
  const titleId = useId();

  useEffect(() => {
    // Небольшая пауза, чтобы окно не спорило с первым экраном за внимание.
    const timer = readConsent() ? undefined : window.setTimeout(() => setOpen(true), 900);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
    };
  }, []);

  const choose = (analytics: boolean) => {
    saveConsent(analytics);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open ? (
        <m.section
          key="cookie-banner"
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          initial={{ opacity: 0, y: still ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: still ? 0 : 8 }}
          transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-40 rounded-panel border border-line bg-card p-5 shadow-probe sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[440px] sm:p-6"
        >
          <h2 id={titleId} className="font-display text-[16px] font-extrabold tracking-[-0.015em] text-ink">
            {t.title}
          </h2>
          <p className="mt-2 text-[13.5px] leading-[1.55] text-muted">
            {t.textBefore}
            <Link href={localizeHref(lang, "/legal#cookies")} className={link}>
              {t.legalLink}
            </Link>
            {t.textMiddle}
            <Link href={localizeHref(lang, "/privacy")} className={link}>
              {t.policyLink}
            </Link>
            {t.textAfter}
          </p>
          <div className="mt-4 flex flex-col gap-2.5 xs:flex-row">
            <button
              type="button"
              onClick={() => choose(false)}
              className={`${button} border border-line-strong text-ink hover:border-ink hover:bg-paper-soft`}
            >
              {t.necessary}
            </button>
            <button
              type="button"
              onClick={() => choose(true)}
              className={`${button} bg-accent text-ink-deep hover:bg-accent-hover`}
            >
              {t.accept}
            </button>
          </div>
        </m.section>
      ) : null}
    </AnimatePresence>
  );
}

/** Кнопка «Изменить выбор» на странице правовой информации: сбрасывает выбор и открывает окно. */
export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={resetConsent}
      className="min-h-11 rounded-pill border border-line-strong px-5 py-3 font-display text-[14px] font-bold text-ink press hover:border-ink hover:bg-paper-soft active:scale-[0.97]"
    >
      {label}
    </button>
  );
}
