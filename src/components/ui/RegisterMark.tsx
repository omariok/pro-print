"use client";

import { m, useReducedMotion } from "framer-motion";

/**
 * Знак «приводка сошлась»: четыре ячейки CMYK из логотипа въезжают со сдвига
 * и встают в регистр. Это ответная половина к странице 404, где те же краски
 * разъехались — на производстве несовпавшая приводка и есть главный признак
 * брака, а совпавшая — признак того, что тираж пошёл.
 */

/** Геометрия ячеек — та же сетка 44×44, что у знака в шапке. */
const cells = [
  { x: 0, y: 0, w: 20, h: 20, fill: "var(--color-cyan)", from: [-10, -8] },
  { x: 23, y: 0, w: 21, h: 25, fill: "var(--color-magenta)", from: [9, -10] },
  { x: 0, y: 23, w: 20, h: 21, fill: "var(--color-yellow)", from: [-8, 10] },
  { x: 23, y: 28, w: 21, h: 16, fill: "var(--color-ink)", from: [10, 9] },
] as const;

const pct = (v: number) => `${(v / 44) * 100}%`;

export default function RegisterMark({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <span aria-hidden className={`relative block h-14 w-14 ${className}`}>
      {cells.map((c, i) => (
        <m.span
          key={`${c.x}-${c.y}`}
          initial={{ opacity: 0, x: reduced ? 0 : c.from[0], y: reduced ? 0 : c.from[1] }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{
            // Приводка не «пружинит»: краска встаёт на место и остаётся там.
            duration: reduced ? 0.2 : 0.42,
            delay: reduced ? 0 : 0.05 * i,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute rounded-[3px]"
          style={{
            left: pct(c.x),
            top: pct(c.y),
            width: pct(c.w),
            height: pct(c.h),
            backgroundColor: c.fill,
          }}
        />
      ))}
    </span>
  );
}
