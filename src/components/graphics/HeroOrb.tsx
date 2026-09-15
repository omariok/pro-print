"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { hero } from "@/lib/content";
import { CursorIcon } from "../ui/Icons";
import type { Probe } from "./orbScene";

/** Пипетка работает там, где есть настоящий курсор и шар стоит в своей колонке. */
const PROBE_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
/** Короткий горизонтальный «заход» линии в карточку, px. */
const ELBOW = 26;
/** Линия начинается от края кольца пипетки, а не из её центра. */
const RING_R = 13;
/** Курсор, скользнувший за край сферы, не должен гасить карточку мгновенно. */
const LEAVE_MS = 140;

const ease = [0.23, 1, 0.32, 1] as const;

const card: Variants = {
  off: {
    opacity: 0,
    y: 8,
    scale: 0.98,
    filter: "blur(4px)",
    transition: { delay: 0.3, duration: 0.2, ease },
  },
  on: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    // filter на том же элементе в Chrome гасит backdrop-blur — снимаем его после въезда.
    transitionEnd: { filter: "none" },
    transition: { delay: 0.12, duration: 0.32, ease, staggerChildren: 0.045, delayChildren: 0.16 },
  },
};

const item: Variants = {
  off: { opacity: 0, y: 6, transition: { duration: 0.15 } },
  on: { opacity: 1, y: 0, transition: { duration: 0.28, ease } },
};

/** sRGB 0–255 → CIE L*a*b* (D65) — в этих координатах и считают ΔE. */
function toLab([r, g, b]: [number, number, number]) {
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const R = lin(r);
  const G = lin(g);
  const B = lin(b);
  const f = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116);
  const fx = f((R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047);
  const fy = f(R * 0.2126 + G * 0.7152 + B * 0.0722);
  const fz = f((R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

/** Целое с типографским минусом. */
const num = (v: number) => {
  const n = Math.round(v);
  return n < 0 ? `−${-n}` : String(n);
};

/**
 * Живой шар Hero — квадратная сцена, сфера занимает ~82% её ширины.
 *
 * На сервере и до загрузки three.js на месте шара стоит CSS-заглушка тех же
 * цветов; когда WebGL отрисовал первый кадр, холст проявляется поверх неё.
 * Если WebGL недоступен, заглушка так и остаётся — вёрстка не ломается.
 *
 * С `probe` курсор над сферой становится пипеткой: она берёт цвет прямо
 * из кадра, тонкая линия тянется к карточке ΔE, а в карточке тот же цвет
 * стоит парой «макет — оттиск» с координатами Lab.
 */
export default function HeroOrb({
  className = "",
  probe = false,
}: {
  className?: string;
  probe?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const still = useReducedMotion();

  const [active, setActive] = useState(false);
  const activeRef = useRef(false);
  const enabledRef = useRef(false);
  const leaveTimer = useRef<number>(0);
  const lastRgb = useRef("");

  const dotRef = useRef<HTMLDivElement>(null);
  const dotFillRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLParagraphElement>(null);
  const lineRefs = useRef<(SVGPathElement | null)[]>([]);
  const pinRef = useRef<SVGCircleElement>(null);
  const swatchRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const labRefs = useRef<(HTMLElement | null)[]>([]);

  const toggle = useCallback((on: boolean) => {
    window.clearTimeout(leaveTimer.current);
    if (on) {
      if (!activeRef.current) {
        activeRef.current = true;
        setActive(true);
      }
      return;
    }
    if (!activeRef.current) return;
    leaveTimer.current = window.setTimeout(() => {
      activeRef.current = false;
      setActive(false);
    }, LEAVE_MS);
  }, []);

  // Пипетка включается только от lg с мышью; при смене условий (повернули
  // планшет, подключили мышь) гасится сразу, без хвостов.
  useEffect(() => {
    if (!probe) return;
    const mq = window.matchMedia(PROBE_QUERY);
    const sync = () => {
      enabledRef.current = mq.matches;
      if (!mq.matches) {
        if (hostRef.current) hostRef.current.style.cursor = "";
        window.clearTimeout(leaveTimer.current);
        activeRef.current = false;
        setActive(false);
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      window.clearTimeout(leaveTimer.current);
    };
  }, [probe]);

  // Вызывается из цикла шара каждый кадр — поэтому только прямые записи в
  // DOM, без setState: React видит лишь смену «навёл / увёл».
  const onProbe = useCallback(
    (p: Probe) => {
      if (!enabledRef.current) return;
      const host = hostRef.current;
      if (host) host.style.cursor = p.active ? "none" : "";
      toggle(p.active);
      if (!p.active) return;

      const { x, y } = p;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      if (p.rgb) {
        const rgb = `rgb(${p.rgb[0]}, ${p.rgb[1]}, ${p.rgb[2]})`;
        if (rgb !== lastRgb.current) {
          lastRgb.current = rgb;
          if (dotFillRef.current) dotFillRef.current.style.backgroundColor = rgb;
          for (const s of swatchRefs.current) if (s) s.style.backgroundColor = rgb;
          toLab(p.rgb).forEach((v, i) => {
            const el = labRefs.current[i];
            if (el) el.textContent = num(v);
          });
        }
      }

      // Линия: от кольца пипетки к карточке. Слева от карточки — наискось
      // до уровня «ΔE» и коротким горизонтальным заходом; под карточкой —
      // вертикально в её нижний край.
      const c = cardRef.current;
      if (!c) return;
      const L = c.offsetLeft;
      const T = c.offsetTop;
      const R = L + c.offsetWidth;
      const B = T + c.offsetHeight;

      let path = "";
      let pin: [number, number] | null = null;
      if (!(x > L - RING_R && x < R + RING_R && y > T - RING_R && y < B + RING_R)) {
        let wx: number;
        let wy: number;
        let end: [number, number];
        if (x < L) {
          const v = valueRef.current;
          const ay = v ? T + v.offsetTop + v.offsetHeight / 2 : T + 40;
          if (x < L - ELBOW) {
            wx = L - ELBOW;
            wy = ay;
            end = [L, ay];
          } else {
            wx = L;
            wy = Math.min(B - 16, Math.max(T + 16, y));
            end = [wx, wy];
          }
        } else {
          const ax = Math.min(R - 24, Math.max(L + 24, x));
          wx = ax;
          wy = y - B > ELBOW ? B + ELBOW : B;
          end = [ax, B];
        }
        const dx = wx - x;
        const dy = wy - y;
        const len = Math.hypot(dx, dy) || 1;
        const sx = x + (dx / len) * RING_R;
        const sy = y + (dy / len) * RING_R;
        path = `M${sx.toFixed(1)} ${sy.toFixed(1)}L${wx.toFixed(1)} ${wy.toFixed(1)}L${end[0].toFixed(1)} ${end[1].toFixed(1)}`;
        pin = end;
      }

      for (const l of lineRefs.current) l?.setAttribute("d", path);
      if (pinRef.current) {
        pinRef.current.setAttribute("cx", pin ? String(pin[0]) : "-99");
        pinRef.current.setAttribute("cy", pin ? String(pin[1]) : "-99");
      }
    },
    [toggle],
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let dispose: (() => void) | undefined;

    // three.js уезжает в отдельный чанк и не тормозит первую отрисовку.
    import("./orbScene").then(({ createOrb }) => {
      if (cancelled) return;
      const orb = createOrb(host, {
        still: Boolean(still),
        onReady: () => setReady(true),
        onProbe: probe ? onProbe : undefined,
      });
      dispose = orb?.dispose;
    });

    return () => {
      cancelled = true;
      dispose?.();
      setReady(false);
    };
  }, [still, probe, onProbe]);

  return (
    <div className={`relative aspect-square ${className}`} aria-hidden="true">
      {/* Каустика: свет проходит сквозь глянцевую сферу и ложится на пол
          радужным пятном — те же краски, что в полосе, снизу-слева от шара
          (свет падает справа сверху). */}
      <div className="absolute left-[2%] top-[84%] h-[12%] w-[60%] -rotate-[7deg] rounded-[50%] bg-[linear-gradient(100deg,transparent_2%,rgba(255,0,120,0.26)_20%,rgba(249,120,40,0.3)_36%,rgba(251,195,15,0.46)_52%,rgba(15,178,220,0.34)_74%,transparent_96%)] blur-[13px]" />

      {/* Контактная тень — часть объекта: без неё шар висит в воздухе.
          Широкий мягкий полутон и плотное ядро прямо под точкой касания. */}
      <div className="absolute left-1/2 top-[88.5%] h-[10%] w-[74%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-umber)_30%,transparent),color-mix(in_oklab,var(--color-umber)_11%,transparent)_55%,transparent)] blur-[7px]" />
      <div className="absolute left-1/2 top-[90.2%] h-[3.6%] w-[44%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-umber)_42%,transparent),color-mix(in_oklab,var(--color-umber)_12%,transparent)_60%,transparent)] blur-[3px]" />

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

      {/* Подпись под шаром — только там, где пипетка действительно работает
          (lg, настоящий курсор, без «уменьшения движения»). Пока идёт замер,
          она притухает: внимание уже на карточке. */}
      {probe && !still ? (
        <div
          className={`pointer-events-none absolute left-1/2 top-[96%] hidden w-max -translate-x-1/2 text-center transition-opacity duration-300 ease-out lg:[@media(hover:hover)_and_(pointer:fine)]:block ${
            active ? "opacity-35" : "opacity-100"
          }`}
        >
          <p className="flex items-center justify-center gap-2 font-display text-[14.5px] font-semibold leading-none text-ink">
            <CursorIcon className="h-[17px] w-[17px] shrink-0" strokeWidth={1.6} />
            {hero.probe.hint}
          </p>
          <p className="mt-2 text-[14px] leading-[1.4] text-muted">{hero.probe.hintText}</p>
        </div>
      ) : null}

      {probe ? (
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          {/* Линия-выноска: светлая подложка держит её на тёмном низе шара,
              графитовая нить — на светлом куполе. pathLength=1 позволяет
              «дорисовывать» её от пипетки к карточке одним dashoffset. */}
          <svg className="absolute inset-0 h-full w-full overflow-visible">
            {[
              "stroke-white/70 [stroke-width:3]",
              "stroke-ink/60 [stroke-width:1.1]",
            ].map((cls, i) => (
              <path
                key={cls}
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                pathLength={1}
                fill="none"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray="1 1"
                className={`${cls} transition-[stroke-dashoffset,opacity] ease-out ${
                  active ? "opacity-100 [stroke-dashoffset:0] duration-300" : "opacity-0 [stroke-dashoffset:1] duration-150"
                }`}
              />
            ))}
            <circle
              ref={pinRef}
              r={2.6}
              cx={-99}
              cy={-99}
              className={`fill-ink transition-opacity duration-200 ${active ? "opacity-100 delay-200" : "opacity-0"}`}
            />
          </svg>

          {/* Карточка стоит в правом верхнем углу сцены и лишь краем
              заходит на плечо сферы — матовое стекло размывает краски под
              собой, а сама сфера остаётся открытой. */}
          <motion.div
            ref={cardRef}
            variants={card}
            initial="off"
            animate={active ? "on" : "off"}
            className="absolute right-[-4%] top-[3%] w-[clamp(216px,38%,262px)] rounded-card bg-card/85 p-5 shadow-probe ring-1 ring-ink/10 lg:backdrop-blur-xl xl:p-6"
          >
            <motion.p
              ref={valueRef}
              variants={item}
              className="whitespace-nowrap font-display text-[clamp(34px,3vw,44px)] font-extrabold leading-none tracking-[-0.03em] text-ink"
            >
              {hero.probe.value}
            </motion.p>
            <motion.p variants={item} className="mt-3 text-[15px] leading-[1.4] text-ink-soft">
              {hero.probe.text}
            </motion.p>

            <motion.div variants={item} className="mt-5 border-t border-ink/10 pt-4">
              {/* Один и тот же цвет дважды: при ΔE ≤ 2 глаз не отличает
                  оттиск от макета — это и показывает пара. */}
              <div className="flex h-9 gap-px overflow-hidden rounded-chip bg-card ring-1 ring-ink/10">
                {[0, 1].map((i) => (
                  <span
                    key={i}
                    ref={(el) => {
                      swatchRefs.current[i] = el;
                    }}
                    className="flex-1 bg-paper-grey transition-colors duration-150 ease-out"
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[11.5px] leading-none text-muted">
                <span>{hero.probe.proof}</span>
                <span>{hero.probe.print}</span>
              </div>

              <p className="mt-4 flex justify-between font-display text-[12px] leading-none text-muted">
                {["L", "a", "b"].map((axis, i) => (
                  <span key={axis}>
                    {axis}{" "}
                    <b
                      ref={(el) => {
                        labRefs.current[i] = el;
                      }}
                      className="inline-block min-w-[3ch] font-bold tabular-nums text-ink"
                    >
                      —
                    </b>
                  </span>
                ))}
              </p>
            </motion.div>
          </motion.div>

          {/* Пипетка — она и есть курсор над сферой: белое кольцо, внутри
              цвет, взятый из кадра прямо под ним. */}
          <div ref={dotRef} className="absolute left-0 top-0 will-change-transform">
            <span
              className={`absolute -left-[20px] -top-[20px] block h-10 w-10 rounded-full bg-white/20 ring-1 ring-white/70 transition-[opacity,scale] duration-200 ease-out ${
                active ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            />
            <span
              ref={dotFillRef}
              className={`absolute -left-[11px] -top-[11px] block h-[22px] w-[22px] rounded-full border-2 border-white bg-paper-grey shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-ink)_35%,transparent),0_6px_16px_-4px_color-mix(in_oklab,var(--color-umber)_45%,transparent)] transition-[opacity,scale] duration-150 ease-out ${
                active ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
