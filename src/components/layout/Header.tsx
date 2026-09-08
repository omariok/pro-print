"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";
import Logo from "../ui/Logo";
import { CloseIcon, MenuIcon, PhoneIcon } from "../ui/Icons";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-line bg-cream/92 shadow-[0_1px_24px_rgba(13,14,19,0.05)] backdrop-blur-xl"
          : "border-transparent bg-cream/70 backdrop-blur-sm"
      }`}
    >
      <div className="shell flex h-[68px] items-center gap-4 lg:h-[76px]">
        <Logo compact />

        {/* Меню строго в одну строку: пропорции кегля и просветов взяты из макета */}
        <nav className="hidden shrink-0 items-center gap-x-[15px] xl:ml-6 xl:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative whitespace-nowrap py-2 text-[13px] leading-none text-ink/85 transition-colors duration-200 hover:text-cmyk-pink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-cmyk-pink after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-5 xl:gap-4 xl:pl-3">
          <a
            href={site.phoneHref}
            aria-label={`Позвонить: ${site.phone}`}
            className="hidden items-center gap-2 whitespace-nowrap text-[14.5px] font-medium leading-none text-ink transition-colors duration-200 hover:text-cmyk-pink lg:inline-flex xl:text-[13.5px]"
          >
            <PhoneIcon className="h-[18px] w-[18px] shrink-0 text-cmyk-pink" />
            {/* В узкой полосе 1280–1399 px оставляем только иконку, чтобы строка не ломалась */}
            <span className="max-xl:inline hidden min-[1400px]:inline">{site.phone}</span>
          </a>

          <Link
            href="/#request"
            className="hidden shrink-0 whitespace-nowrap bg-ink px-5 py-3 font-display text-[13.5px] font-bold leading-none text-white transition-colors duration-300 hover:bg-[#22242c] sm:inline-flex sm:items-center sm:px-6 sm:py-4 sm:text-[14px] xl:px-4 xl:text-[13px]"
          >
            Рассчитать заказ
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Открыть меню"
            className="-mr-1 inline-flex h-10 w-10 items-center justify-center text-ink xl:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-cream xl:hidden"
          >
            <div className="shell flex h-[68px] items-center justify-between lg:h-[76px]">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Закрыть меню"
                className="-mr-1 inline-flex h-10 w-10 items-center justify-center text-ink"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="shell flex h-[calc(100dvh-68px)] flex-col justify-between overflow-y-auto pb-10 pt-6 lg:h-[calc(100dvh-76px)]">
              <nav className="flex flex-col">
                {nav.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.045, duration: 0.4 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block border-b border-line py-4 font-display text-[19px] font-bold tracking-[-0.02em] text-ink"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-10 space-y-4">
                <a
                  href={site.phoneHref}
                  className="flex items-center gap-2.5 font-display text-[20px] font-extrabold tracking-[-0.02em] text-ink"
                >
                  <PhoneIcon className="h-5 w-5 text-cmyk-pink" />
                  {site.phone}
                </a>
                <a href={`mailto:${site.email}`} className="block text-[15px] text-muted">
                  {site.email}
                </a>
                <Link
                  href="/#request"
                  onClick={() => setOpen(false)}
                  className="mt-2 flex w-full items-center justify-center bg-ink px-6 py-4 font-display text-[15px] font-bold text-white"
                >
                  Рассчитать заказ
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
