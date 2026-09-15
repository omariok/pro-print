"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Живой шар Hero — квадратная сцена, сфера занимает ~82% её ширины.
 *
 * На сервере и до загрузки three.js на месте шара стоит CSS-заглушка тех же
 * цветов; когда WebGL отрисовал первый кадр, холст проявляется поверх неё.
 * Если WebGL недоступен, заглушка так и остаётся — вёрстка не ломается.
 */
export default function HeroOrb({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const still = useReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let dispose: (() => void) | undefined;

    // three.js уезжает в отдельный чанк и не тормозит первую отрисовку.
    import("./orbScene").then(({ createOrb }) => {
      if (cancelled) return;
      const orb = createOrb(host, { still: Boolean(still), onReady: () => setReady(true) });
      dispose = orb?.dispose;
    });

    return () => {
      cancelled = true;
      dispose?.();
      setReady(false);
    };
  }, [still]);

  return (
    <div className={`relative aspect-square ${className}`} aria-hidden="true">
      {/* Каустика: свет проходит сквозь глянцевую сферу и ложится на пол
          радужным пятном — те же краски, что в полосе, снизу-слева от шара
          (свет падает справа сверху). */}
      <div className="absolute left-[2%] top-[84%] h-[12%] w-[60%] -rotate-[7deg] rounded-[50%] bg-[linear-gradient(100deg,transparent_2%,rgba(255,0,120,0.26)_20%,rgba(249,120,40,0.3)_36%,rgba(251,195,15,0.46)_52%,rgba(15,178,220,0.34)_74%,transparent_96%)] blur-[13px]" />

      {/* Контактная тень — часть объекта: без неё шар висит в воздухе.
          Широкий мягкий полутон и плотное ядро прямо под точкой касания. */}
      <div className="absolute left-1/2 top-[88.5%] h-[10%] w-[74%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(43,18,4,0.3),rgba(43,18,4,0.11)_55%,transparent)] blur-[7px]" />
      <div className="absolute left-1/2 top-[90.2%] h-[3.6%] w-[44%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(43,18,4,0.42),rgba(43,18,4,0.12)_60%,transparent)] blur-[3px]" />

      {/* Та же раскладка, что в шейдере: светлый купол, полоса красок
          пурпур → жёлтый → голубой, тёмный глянцевый низ. */}
      <div
        className={`absolute inset-[9%] rounded-full transition-opacity duration-700 ease-out ${ready ? "opacity-0" : "opacity-100"}`}
        style={{
          background:
            "radial-gradient(circle at 34% 24%, rgba(255,252,244,0.95) 0 5%, transparent 20%)," +
            "linear-gradient(180deg, #f6ecd9 0 30%, rgba(246,236,217,0) 56%, rgba(43,18,4,0) 60%, rgba(43,18,4,0.7) 78%, #2b1204 100%)," +
            "linear-gradient(90deg, #ff0078 0 16%, #f95c3c 30%, #f7931f 40%, #fbc30f 51%, #dfe06c 65%, #8adfd6 76%, #0fb2dc 88%)",
        }}
      />

      <div
        ref={hostRef}
        className={`absolute inset-0 transition-opacity duration-700 ease-out ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
