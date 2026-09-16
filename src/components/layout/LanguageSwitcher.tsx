"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { localeMeta, locales, localizeHref, stripLocale, type Locale } from "@/lib/i18n";
import { CheckIcon, ChevronDownIcon, GlobeIcon } from "../ui/Icons";

/**
 * Выбор языка в шапке: глобус с кодом текущего языка, по нажатию — короткий
 * список. Ссылка ведёт на ту же страницу на другом языке. Названия языков
 * набраны на самих языках, чтобы их узнал человек, не читающий текущий.
 */
export default function LanguageSwitcher({ lang, label }: { lang: Locale; label: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const path = stripLocale(pathname);

  // Закрывается кликом мимо, Escape (фокус — обратно на кнопку) и уходом фокуса из списка.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`${label}: ${localeMeta[lang].name}`}
        aria-expanded={open}
        aria-controls={listId}
        /* С xl меню стоит в одну строку, и русские пункты занимают её почти
           целиком: до 2xl (1536 px) остаётся один глобус, код языка и стрелка
           возвращаются, когда строке хватает места. */
        className={`inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-tile px-2.5 text-[13px] font-medium leading-none text-ink transition-colors duration-200 hover:bg-ink/[0.06] xl:px-0 2xl:px-2.5 ${
          open ? "bg-ink/[0.06]" : ""
        }`}
      >
        <GlobeIcon className="h-[18px] w-[18px] shrink-0 text-ink/80" strokeWidth={1.5} />
        <span className="xl:hidden 2xl:inline">{localeMeta[lang].short}</span>
        <ChevronDownIcon
          className={`h-3.5 w-3.5 shrink-0 text-muted transition-transform duration-200 xl:hidden 2xl:block ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            key="languages"
            id={listId}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.14 } }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-[calc(100%+10px)] z-10 min-w-[188px] origin-top-right rounded-card border border-card/70 bg-card p-1.5 shadow-[0_24px_50px_-24px_rgba(35,48,56,0.45)]"
          >
            {locales.map((code) => {
              const current = code === lang;
              return (
                <li key={code}>
                  <Link
                    href={localizeHref(code, path)}
                    hrefLang={localeMeta[code].htmlLang}
                    lang={localeMeta[code].htmlLang}
                    aria-current={current ? "true" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between gap-6 rounded-tile px-3 py-2.5 text-[14.5px] leading-none transition-colors duration-200 hover:bg-ink/[0.05] ${
                      current ? "font-semibold text-ink" : "text-ink/85"
                    }`}
                  >
                    <span>{localeMeta[code].name}</span>
                    {current ? (
                      <CheckIcon className="h-[15px] w-[15px] shrink-0 text-accent" />
                    ) : (
                      <span className="text-[11px] font-medium tracking-[0.08em] text-muted-soft">
                        {localeMeta[code].short}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
