"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Облегчённый framer-motion на весь сайт: компоненты берут `m.*` вместо
 * `motion.*`, а набор возможностей domAnimation (анимации, варианты, exit)
 * подключается здесь один раз. Полный `motion` тянул в каждую страницу ещё
 * layout- и drag-анимации, которых на сайте нет. `strict` сразу упадёт, если
 * кто-то снова импортирует `motion`. MotionConfig с reducedMotion="user"
 * убирает сдвиги и масштаб, если в системе включено «Уменьшить движение».
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
