"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { hero, site } from "@/lib/content";
import VideoBackground from "../ui/VideoBackground";
import CmykRings from "../graphics/CmykRings";
import { ArrowIcon } from "../ui/Icons";

const line = {
  hidden: { opacity: 0, y: 34 },
  shown: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + i * 0.075, duration: 0.85, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const ROTATE_MS = 2600;

/**
 * Перелистывает названия материалов сверху вниз.
 *
 * Высоту окна задают невидимые «мерки»: все варианты лежат в одной ячейке
 * grid, поэтому заголовок не дёргается при смене строки на любой ширине.
 *
 * Важно: AnimatePresence не должен стоять внутри motion-элемента с вариантами —
 * тогда дочерние элементы попадают в вариантное дерево родителя, exit не
 * отрабатывает и старые строки остаются в DOM. Здесь родитель анимируется
 * обычным объектом, вариантов нет.
 */
function MaterialRotator() {
  const [index, setIndex] = useState(0);
  const still = useReducedMotion();

  useEffect(() => {
    if (still) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % hero.materials.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(id);
  }, [still]);

  return (
    <>
      {/* Полный перечень материалов — один раз, для скринридеров и роботов. */}
      <span className="sr-only">{hero.materialsPlain}</span>

      {/* Кегль подобран так, чтобы самое длинное название («барьерной
          многослойной плёнке») укладывалось в одну строку на планшете и
          десктопе; на телефоне оно переносится, но высоту окна держат
          «мерки», поэтому заголовок не прыгает. */}
      <span
        aria-hidden
        className="mt-3 flex items-start gap-x-[0.34em] text-[clamp(19px,5.1vw,23px)] font-bold leading-[1.2] tracking-[-0.02em] text-ink/72 sm:mt-4 sm:text-[clamp(23px,3.1vw,30px)] lg:text-[min(1.78vw,26px)]"
      >
        <span className="shrink-0">{hero.materialsPrefix}</span>

        <span className="relative grid min-w-0 flex-1 overflow-hidden">
          {hero.materials.map((material) => (
            <span key={material} className="invisible col-start-1 row-start-1">
              {material}.
            </span>
          ))}

          <AnimatePresence initial={false}>
            <motion.span
              key={hero.materials[index]}
              initial={still ? false : { y: "-104%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={still ? { opacity: 0 } : { y: "104%", opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 0.36 },
              }}
              className="absolute inset-0 text-ink"
            >
              {hero.materials[index]}
              <span className="text-cmyk-pink">.</span>
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </>
  );
}

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-[68px] lg:pt-[76px]">
      {/* Swap the placeholder wash for footage by passing src="/hero.mp4". */}
      <VideoBackground grid />

      <div className="shell relative grid min-h-[calc(100svh-68px)] items-center gap-12 py-14 sm:py-16 lg:min-h-[calc(100svh-76px)] lg:grid-cols-[minmax(0,1.18fr)_minmax(0,1fr)] lg:gap-14 lg:py-20 xl:gap-20">
        <div className="max-w-[680px]">
          <h1 className="display text-[clamp(38px,8.4vw,60px)] text-ink sm:text-[clamp(48px,7vw,74px)] lg:text-[clamp(52px,5.2vw,92px)]">
            {hero.titleLines.map((text, i) => (
              <motion.span
                key={text}
                custom={i}
                variants={line}
                initial="hidden"
                animate="shown"
                className="block"
              >
                {text}
              </motion.span>
            ))}

            {/* Анимация объектом, а не вариантом: иначе ротатор внутри
                попадает в вариантное дерево заголовка. */}
            <motion.span
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.08 + hero.titleLines.length * 0.075,
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="block"
            >
              <MaterialRotator />
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-[46ch] text-[15px] leading-[1.62] text-muted sm:text-[16.5px]"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center gap-4 sm:mt-10"
          >
            <Link
              href="/#request"
              className="group inline-flex items-center gap-3 bg-ink px-7 py-4 font-display text-[14.5px] font-bold text-white transition-colors duration-300 hover:bg-[#22242c] sm:px-8 sm:py-[18px] sm:text-[15px]"
            >
              {hero.cta}
              <ArrowIcon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <a
              href={site.phoneHref}
              className="font-display text-[14.5px] font-bold text-ink underline decoration-line-strong decoration-2 underline-offset-[6px] transition-colors duration-200 hover:text-cmyk-pink hover:decoration-cmyk-pink sm:text-[15px]"
            >
              {site.phone}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.965 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/70 bg-white/45 shadow-[0_30px_80px_-40px_rgba(13,14,19,0.28)] backdrop-blur-[2px] sm:aspect-[13/9]">
            <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_12%_8%,#e9f6fd_0%,transparent_62%),radial-gradient(85%_75%_at_92%_12%,#fdf8de_0%,transparent_60%),radial-gradient(100%_90%_at_82%_96%,#fbe9f3_0%,transparent_62%)]" />
            <CmykRings className="absolute left-1/2 top-1/2 h-[86%] w-auto -translate-x-1/2 -translate-y-1/2" />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px] text-muted-soft">
            <span>CMYK + пантоны</span>
            <span className="h-1 w-1 rounded-full bg-cmyk-pink" />
            <span>Стретч, ПВХ, POF, ПЭ от 8 мкм</span>
            <span className="h-1 w-1 rounded-full bg-cmyk-cyan" />
            <span>Ширина 250–550 мм</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
