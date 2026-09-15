"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { nav, site } from "@/lib/content";
import Logo from "../ui/Logo";
import { CloseIcon, MenuIcon, PhoneIcon } from "../ui/Icons";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const sheetId = useId();
  const pathname = usePathname();

  // Пункт меню подсвечен, если это открытая страница или — на главной —
  // секция, которую сейчас читают. Якорь отмечается aria-current="location",
  // страница — "page": скринридер называет их по-разному.
  const currentOf = (href: string) => {
    if (href.startsWith("/#")) {
      return pathname === "/" && activeId === href.slice(2) ? ("location" as const) : undefined;
    }
    return pathname === href ? ("page" as const) : undefined;
  };

  // Scroll-spy для главной. Следим за всеми секциями с id, а не только за
  // пунктами меню: иначе, пока читают «Примеры» или «ПВХ», подсветка висела
  // бы на «Продукции», хотя человек уже ушёл дальше. Активна секция, которая
  // пересекает тонкую полосу на 40% высоты экрана; над первой секцией (герой)
  // не подсвечено ничего.
  useEffect(() => {
    setActiveId(null);
    if (pathname !== "/" || typeof IntersectionObserver === "undefined") return;
    const sections = document.querySelectorAll<HTMLElement>("main section[id]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          setActiveId((prev) => (entry.isIntersecting ? id : prev === id ? null : prev));
        }
      },
      { rootMargin: "-40% 0px -59% 0px" },
    );
    sections.forEach((section) => io.observe(section));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Шторка существует только до xl. Если окно растянули, пока меню открыто,
  // она пропадает вместе со своим xl:hidden — а замок прокрутки остаётся, и
  // страница перестаёт скроллиться без единого видимого элемента.
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 1280px)");
    const sync = () => {
      if (desktop.matches) setOpen(false);
    };
    sync();
    desktop.addEventListener("change", sync);
    return () => desktop.removeEventListener("change", sync);
  }, [open]);

  // Escape закрывает меню — раскрытая шторка перекрывает страницу целиком.
  // Фокус возвращается на бургер: пункт меню, на котором он стоял, исчезает
  // вместе со шторкой, и без этого клавиатура оказалась бы в начале страницы.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      burgerRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Пока шторка открыта, страница под затемнением недоступна и для Tab, и для
  // скринридера — иначе фокус уходил бы в невидимый контент под подложкой.
  useEffect(() => {
    if (!open) return;
    const behind = document.querySelectorAll<HTMLElement>(
      'body > a[href="#main"], #main, body > footer',
    );
    behind.forEach((el) => (el.inert = true));
    return () => behind.forEach((el) => (el.inert = false));
  }, [open]);

  return (
    /* Шапка не приклеена к краю окна: сверху остаётся воздух, сама панель —
       стеклянная плашка с мягкой тенью и радиусом card (не «таблетка»: для
       производства полное скругление выглядит несерьёзно). Сумма отступа и
       высоты панели равна --header-h из globals.css (12+52 / 14+56 / 16+60).
       Контейнер у шапки свой, шире контентного .shell, иначе CTA упирается
       в её край. */
    <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-3.5 lg:pt-4">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 -z-10 bg-ink/40 xl:hidden"
          />
        ) : null}
      </AnimatePresence>

      <div className="shell-header">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          /* Стекло — только от lg. Ниже шапка при прокрутке едет над живым
             холстом шара, и backdrop-blur пересчитывался бы каждый кадр его
             анимации; на телефоне вместо размытия — почти плотная заливка. */
          className={`flex h-[52px] items-center gap-4 rounded-card border pl-4 pr-3 transition-[background-color,border-color,box-shadow] duration-200 sm:h-[56px] sm:pl-5 lg:h-[60px] lg:backdrop-blur-2xl lg:backdrop-saturate-150 ${
            scrolled
              ? "border-card/70 bg-card/95 shadow-[0_18px_44px_-20px_rgba(35,48,56,0.38),0_1px_0_rgba(255,255,255,0.9)_inset] lg:bg-card/80"
              : "border-card/55 bg-card/88 shadow-[0_10px_30px_-18px_rgba(35,48,56,0.24),0_1px_0_rgba(255,255,255,0.75)_inset] lg:bg-card/50"
          }`}
        >
          <Logo compact />

          {/* Меню строго в одну строку: пропорции кегля и просветов взяты из макета */}
          <nav className="hidden shrink-0 items-center gap-x-[3px] xl:ml-5 xl:flex">
            {nav.map((item) => {
              const current = currentOf(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current}
                  className={`relative whitespace-nowrap rounded-chip px-3 py-2 text-[13px] leading-none transition-colors duration-200 hover:bg-ink/[0.06] hover:text-ink ${
                    current ? "bg-ink/[0.06] text-ink" : "text-ink/85"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-5 xl:gap-4 xl:pl-3">
            <a
              href={site.phoneHref}
              aria-label={`Позвонить: ${site.phone}`}
              className="relative hidden items-center gap-2 whitespace-nowrap text-[14.5px] font-medium leading-none text-ink transition-colors duration-200 after:absolute after:-inset-x-2 after:-inset-y-[13px] after:content-[''] hover:text-[var(--accent-text)] lg:inline-flex xl:text-[13.5px]"
            >
              <PhoneIcon className="h-[18px] w-[18px] shrink-0 text-accent" />
              {/* В узкой полосе 1280–1399 px оставляем только иконку, чтобы строка не ломалась */}
              <span className="max-xl:inline hidden min-[1400px]:inline">{site.phone}</span>
            </a>

            <Link
              href="/#request"
              className="hidden h-11 shrink-0 whitespace-nowrap rounded-tile bg-ink px-6 font-display text-[14px] font-bold leading-none text-paper press hover:bg-ink-hover active:scale-[0.97] sm:inline-flex sm:items-center xl:text-[13px]"
            >
              Рассчитать заказ
            </Link>

            <button
              ref={burgerRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={open}
              aria-controls={sheetId}
              className="inline-flex h-11 w-11 items-center justify-center rounded-tile text-ink transition-colors duration-200 hover:bg-ink/[0.06] xl:hidden"
            >
              {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </motion.div>

        {/* Мобильное меню — не полноэкранная подмена, а шторка под пилюлей:
            иначе поверх парящей шапки пришлось бы рисовать её дубликат. */}
        <AnimatePresence>
          {open ? (
            <motion.div
              key="sheet"
              id={sheetId}
              initial={{ opacity: 0, y: -10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: -10,
                scale: 0.985,
                // Закрытие меню — уже принятое решение, его не разглядывают.
                transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
              }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 max-h-[calc(100dvh-var(--header-h)-24px)] origin-top overflow-y-auto rounded-panel border border-card/70 bg-card p-5 shadow-[0_28px_60px_-28px_rgba(35,48,56,0.45)] xl:hidden"
            >
              <nav className="flex flex-col">
                {nav.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 + i * 0.035, duration: 0.26 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={currentOf(item.href)}
                      className={`block rounded-tile px-3 py-3 font-display text-[18px] font-bold tracking-[-0.024em] text-ink transition-colors duration-200 hover:bg-ink/[0.05] ${
                        currentOf(item.href) ? "bg-ink/[0.05]" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-5 space-y-1 border-t border-line pt-5">
                <a
                  href={site.phoneHref}
                  className="flex items-center gap-2.5 rounded-tile px-3 py-2.5 font-display text-[19px] font-extrabold tracking-[-0.024em] text-ink transition-colors duration-200 hover:bg-ink/[0.05]"
                >
                  <PhoneIcon className="h-5 w-5 text-accent" />
                  {site.phone}
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="block rounded-tile px-3 py-3 text-[15px] text-muted transition-colors duration-200 hover:bg-ink/[0.05]"
                >
                  {site.email}
                </a>
                <Link
                  href="/#request"
                  onClick={() => setOpen(false)}
                  className="mt-3 flex w-full items-center justify-center rounded-pill bg-ink px-6 py-4 font-display text-[15px] font-bold text-paper press hover:bg-ink-hover active:scale-[0.97]"
                >
                  Рассчитать заказ
                </Link>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
