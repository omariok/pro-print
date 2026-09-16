"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Content } from "@/lib/content";
import { contactInfo } from "@/lib/content/contact-info";
import { localizeHref, type Locale } from "@/lib/i18n";
import HeroOrb from "../graphics/HeroOrb";
import { ArrowIcon, DiamondIcon, LeafIcon, ShieldIcon } from "../ui/Icons";

const featureIcons = { diamond: DiamondIcon, shield: ShieldIcon, leaf: LeafIcon };

const line = {
  hidden: { opacity: 0, y: 34 },
  shown: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 + i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

/* Единственное движение, которое посетитель видит постоянно, пока читает
   первый экран. На 1.7с глаз дёргался к нему прямо во время чтения заголовка. */
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
type HeroText = Content["hero"];

function MaterialRotator({ hero }: { hero: HeroText }) {
  const [index, setIndex] = useState(0);
  const still = useReducedMotion();

  useEffect(() => {
    if (still) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % hero.materials.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(id);
  }, [still, hero.materials.length]);

  return (
    <>
      {/* Полный перечень материалов — один раз, для скринридеров и роботов. */}
      <span className="sr-only">{hero.materialsPlain}</span>

      {/* Третий ярус: мельче подзаголовка над ним. Кегль подобран так, чтобы
          самое длинное название («барьерной многослойной плёнке») укладывалось
          в одну строку на планшете и десктопе; на телефоне оно переносится,
          но высоту окна держат «мерки», поэтому блок не прыгает. */}
      <span
        aria-hidden
        className="mt-3 flex items-start gap-x-[0.34em] text-[clamp(19px,5vw,22px)] font-bold leading-[1.2] tracking-[-0.02em] text-ink/72 sm:mt-4 sm:text-[clamp(22px,3vw,28px)] lg:text-[clamp(20px,1.7vw,26px)]"
      >
        <span className="shrink-0">{hero.materialsPrefix}</span>

        <span className="relative grid min-w-0 flex-1 overflow-hidden">
          {hero.materials.map((material) => (
            <span key={material} className="invisible col-start-1 row-start-1">
              {material}
              {hero.materialsEnd}
            </span>
          ))}

          <AnimatePresence initial={false}>
            <motion.span
              key={hero.materials[index]}
              initial={still ? false : { y: "-104%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={still ? { opacity: 0 } : { y: "104%", opacity: 0 }}
              transition={{
                duration: 0.44,
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 0.26 },
              }}
              className="absolute inset-0 text-ink"
            >
              {hero.materials[index]}
              {hero.materialsEnd ? (
                <span className="text-accent-strong">{hero.materialsEnd}</span>
              ) : null}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </>
  );
}

/** Три коротких довода под кнопками: тонкая иконка над подписью в две строки. */
function HeroFeatures({ hero, className = "" }: { hero: HeroText; className?: string }) {
  return (
    <motion.ul
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.56, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`grid-cols-3 gap-x-4 sm:gap-x-10 ${className}`}
    >
      {hero.features.map(({ icon, text }) => {
        const Icon = featureIcons[icon];
        return (
          <li key={text} className="flex flex-col gap-3">
            <Icon className="h-7 w-7 text-ink/80" strokeWidth={1.4} />
            <span className="text-[13px] leading-[1.4] text-muted sm:max-w-[13ch] sm:text-[14.5px]">
              {text}
            </span>
          </li>
        );
      })}
    </motion.ul>
  );
}

export default function Hero({ lang, hero }: { lang: Locale; hero: HeroText }) {
  return (
    /* Секция подтянута под шапку: main уже отступает на --header-h, поэтому без
       отрицательного margin отступ считался дважды и над заголовком висела
       пустая полоса. Заодно фон уходит под стеклянную пилюлю, а не начинается
       под ней. */
    <section className="relative isolate -mt-[var(--header-h)] overflow-hidden bg-paper-hero pt-[var(--header-h)] lg:min-h-[100svh] lg:[--orb-w:min(45vw,78svh,680px)] xl:[--orb-w:min(48vw,78svh,680px)]">
      {/* Студийный фон от lg: светлый круг-задник за шаром и пол с мягким
          горизонтом, как на циклораме. Слой повторяет отступы shell, поэтому
          центр круга совпадает с центром шара (правая колонка, по центру
          высоты). Ниже lg шар стоит за текстом — там задник только мешал бы. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 top-[var(--header-h)] -z-10 hidden lg:block">
        <div className="shell h-full pb-16 pt-10">
          <div className="relative h-full">
            <div className="absolute right-[calc(var(--orb-w)*-0.28)] top-1/2 aspect-square w-[calc(var(--orb-w)*1.56)] -translate-y-[56%] rounded-full bg-[radial-gradient(circle_at_62%_38%,var(--color-hero-halo),var(--color-hero-halo-mid)_58%,var(--color-hero-halo-edge))] shadow-halo" />
            <div className="absolute right-[calc(var(--orb-w)*-0.9)] top-[calc(50%+var(--orb-w)*0.2)] h-[calc(var(--orb-w)*1.1)] w-[calc(var(--orb-w)*2.8)] rounded-[50%] bg-[linear-gradient(180deg,var(--color-hero-floor),transparent_70%)] shadow-horizon" />
          </div>
        </div>
      </div>

      {/* Верхний отступ идёт поверх --header-h — это воздух между стеклянной
          панелью и заголовком (40 / 56px). От lg — две колонки: текст слева,
          живой шар справа, оба центрованы по высоте экрана. Ниже lg шар
          лежит за подзаголовком и кнопками (см. ниже). Шар — равный партнёр
          заголовку: сцена до 680px, сама сфера ~82% от неё (~560px на
          1440), вокруг остаётся ровная бумага. Строки заголовка не переносятся —
          на широких экранах они могут чуть заходить на прозрачное поле
          сцены шара, но не на саму сферу. */}
      <div className="shell relative grid grid-cols-[minmax(0,1fr)] content-start gap-y-4 pb-14 pt-10 sm:pb-20 lg:min-h-[calc(100svh-var(--header-h))] sm:pt-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:content-center lg:items-center lg:gap-x-[clamp(16px,2.5vw,40px)] lg:pb-16 lg:pt-10">
        <div className="max-w-[720px] lg:max-w-[min(640px,48vw)]">
          <h1 className="display text-[clamp(42px,10.2vw,64px)] tracking-[-0.028em] text-ink sm:text-[clamp(54px,7.6vw,80px)] lg:text-[clamp(46px,4.3vw,76px)]">
            {hero.titleLines.map((text, i) => (
              <motion.span
                key={text}
                custom={i}
                variants={line}
                initial="hidden"
                animate="shown"
                className="block lg:whitespace-nowrap"
              >
                {text}
              </motion.span>
            ))}
          </h1>

          {/* Анимация объектом, а не вариантом: иначе ротатор внутри
              попадает в чужое вариантное дерево. */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-display"
          >
            <MaterialRotator hero={hero} />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            /* На телефоне кнопки всегда столбиком: высота блока под
               подзаголовком не зависит от ширины, и шар за ним встаёт
               одинаково на любом телефоне. */
            className="mt-9 flex flex-col items-start gap-4 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <Link
              href={localizeHref(lang, "/#request")}
              className="group inline-flex items-center gap-3 rounded-pill bg-ink px-7 py-4 font-display text-[14.5px] font-bold text-paper press hover:bg-ink-hover active:scale-[0.97] sm:px-8 sm:py-[18px] sm:text-[15px]"
            >
              {hero.cta}
              <ArrowIcon className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <a
              href={contactInfo.phoneHref}
              /* Ниже lg телефон лежит поверх шара, прямо на пурпурной части
                 полосы, — там ему нужна плотная подложка. Без backdrop-blur:
                 размытие над живым холстом пересчитывалось бы каждый кадр
                 анимации шара, а на телефоне это самый дорогой слой страницы. */
              className="rounded-pill bg-paper-hero/92 px-5 py-3 font-display text-[14.5px] font-bold text-ink transition-colors duration-200 hover:text-[var(--accent-text)] sm:text-[15px] lg:-my-1 lg:rounded-none lg:bg-transparent lg:px-0 lg:py-1 lg:underline lg:decoration-line-strong lg:decoration-2 lg:underline-offset-[6px] lg:hover:decoration-[var(--accent-text)]"
            >
              {contactInfo.phone}
            </a>
          </motion.div>

          <HeroFeatures hero={hero} className="mt-[clamp(48px,6.5svh,76px)] hidden max-w-[540px] lg:grid" />
        </div>

        {/* Ниже lg шар выходит из потока: крупная сфера справа, центр — на
            правом краю экрана. Текст стоит на чистой бумаге и лишь краем
            заходит на светлый купол; правую половину шара и тёмный низ
            срезает overflow-hidden секции, так что высоту Hero задаёт текст,
            а не шар. На телефоне центр — на уровне телефона (79px от низа
            shell = pb-14 + половина пилюли); на планшете кнопки стоят в ряд
            и текст ниже, поэтому шар меньше и центр опущен к низу секции
            (8vw), чтобы купол начинался у ротатора, а не у заголовка. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-[calc(79px-75vw)] left-[calc(100%-75vw)] -z-10 sm:bottom-[-33vw] sm:left-[calc(100%-41vw)] lg:relative lg:inset-auto lg:z-auto lg:justify-self-center"
        >
          {/* Видна только левая половина шара — полосу красок сжимаем в неё,
              иначе там остаётся один пурпур с оранжевым. Ниже lg под Hero
              идут преимущества, поэтому тёмный низ шара растворяется в бумаге
              чуть ниже центра, а не срезается краем секции. */}
          <HeroOrb probe probeText={hero.probe} className="w-[150vw] [--orb-band-k:1.45] [--orb-band-x:-0.55] [mask-image:linear-gradient(to_bottom,#000_50%,transparent_63%)] sm:w-[82vw] sm:[mask-image:linear-gradient(to_bottom,#000_40%,rgba(0,0,0,0.55)_52%,transparent_64%)] lg:w-[var(--orb-w)] lg:[--orb-band-k:1] lg:[--orb-band-x:0] lg:[--orb-bleed-b:0.3] lg:[--orb-bleed-l:0.12] lg:[--orb-bleed-r:0.14] lg:[--orb-film:1] lg:[mask-image:none]" />
        </motion.div>
      </div>

      {/* Ниже lg преимущества стоят отдельной строкой под shell: шар привязан
          к низу shell и от этого блока не сдвигается. */}
      <div className="shell pb-12 sm:pb-16 lg:hidden">
        <HeroFeatures hero={hero} className="grid max-w-[560px]" />
      </div>
    </section>
  );
}
