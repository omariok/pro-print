"use client";

import type { Ref } from "react";
import { motion } from "framer-motion";

/*
 * Лоток, затянутый плёнкой с печатью, — предмет на полу студии рядом с шаром
 * Hero. Макет тот же, что у TrayMock в «Примерах», только в объёме: шар —
 * это краска, лоток — то, на что она ложится.
 *
 * Геометрия — ортографическая проекция: лоток повёрнут на 14° вокруг
 * вертикали, камера смотрит на 35° сверху. Крышку рисуем в плоских
 * координатах и переносим одной матрицей, стенки — выпуклая оболочка
 * верхнего контура и более узкого дна (стенки у лотка наклонные).
 */
const W = 300;
const D = 190;
const R = 22;
/** Высота стенки и насколько дно уже крышки (стенки наклонные). */
const H = 62;
const INSET = 16;
/** Отбортовка: плёнка запаяна на плоский фланец, стенка начинается глубже. */
const RIM = 7;

const YAW = (16 * Math.PI) / 180;
const ELEV = (38 * Math.PI) / 180;
const A = [Math.cos(YAW), -Math.sin(YAW) * Math.sin(ELEV)] as const;
const B = [Math.sin(YAW), Math.cos(YAW) * Math.sin(ELEV)] as const;
const DROP = H * Math.cos(ELEV);

type Pt = [number, number];

const project = ([u, v]: Pt, dy = 0): Pt => [u * A[0] + v * B[0], u * A[1] + v * B[1] + dy];

function roundedRect(x: number, y: number, w: number, h: number, r: number): Pt[] {
  const corners: [number, number, number][] = [
    [x + w - r, y + r, -90],
    [x + w - r, y + h - r, 0],
    [x + r, y + h - r, 90],
    [x + r, y + r, 180],
  ];
  const pts: Pt[] = [];
  for (const [cx, cy, start] of corners) {
    for (let i = 0; i <= 6; i++) {
      const a = ((start + i * 15) * Math.PI) / 180;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
  }
  return pts;
}

/** Выпуклая оболочка (монотонная цепь Эндрю). */
function hull(points: Pt[]): Pt[] {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list: Pt[]) => {
    const out: Pt[] = [];
    for (const pt of list) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], pt) <= 0) out.pop();
      out.push(pt);
    }
    out.pop();
    return out;
  };
  return [...half(p), ...half([...p].reverse())];
}

const toPath = (pts: Pt[]) =>
  `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}Z`;

const TOP = roundedRect(RIM, RIM, W - 2 * RIM, D - 2 * RIM, R - 4).map((pt) => project(pt));
const BOTTOM = roundedRect(INSET, INSET, W - 2 * INSET, D - 2 * INSET, R - 8).map((pt) => project(pt, DROP));
const WALLS = toPath(hull([...TOP, ...BOTTOM]));
const FLOOR = toPath(BOTTOM);
/** Верх и низ стенок в координатах SVG — для вертикального градиента. */
const WALL_Y0 = Math.min(...TOP.map((p) => p[1]));
const WALL_Y1 = Math.max(...BOTTOM.map((p) => p[1]));
const WALL_X0 = Math.min(...BOTTOM.map((p) => p[0]), ...TOP.map((p) => p[0]));
const WALL_X1 = Math.max(...BOTTOM.map((p) => p[0]), ...TOP.map((p) => p[0]));
const MATRIX = `matrix(${A[0].toFixed(4)} ${A[1].toFixed(4)} ${B[0].toFixed(4)} ${B[1].toFixed(4)} 0 0)`;

export default function HeroTray({
  className = "",
  bandRef,
  active = false,
}: {
  className?: string;
  /** Полоса печати, которую перекрашивает пипетка шара. */
  bandRef?: Ref<SVGPathElement>;
  active?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      aria-hidden="true"
    >
      <svg viewBox="-50 -70 450 260" className="block h-auto w-full overflow-visible">
        <defs>
          {/* Под фланцем стенка в тени, к полу светлеет от рефлекса. */}
          <linearGradient id="hero-tray-wall" gradientUnits="userSpaceOnUse" x1="0" y1={WALL_Y0} x2="0" y2={WALL_Y1}>
            <stop offset="0" stopColor="var(--color-line-strong)" />
            <stop offset="0.55" stopColor="var(--color-silver)" />
            <stop offset="1" stopColor="var(--color-paper-grey)" />
          </linearGradient>
          <linearGradient id="hero-tray-side" gradientUnits="userSpaceOnUse" x1={WALL_X0} y1="0" x2={WALL_X1} y2="0">
            <stop offset="0" stopColor="var(--color-card)" stopOpacity="0.55" />
            <stop offset="0.35" stopColor="var(--color-card)" stopOpacity="0" />
            <stop offset="0.8" stopColor="var(--color-ink)" stopOpacity="0" />
            <stop offset="1" stopColor="var(--color-ink)" stopOpacity="0.14" />
          </linearGradient>
          <linearGradient id="hero-tray-gloss" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0.3" stopColor="var(--color-card)" stopOpacity="0" />
            <stop offset="0.4" stopColor="var(--color-card)" stopOpacity="0.6" />
            <stop offset="0.47" stopColor="var(--color-card)" stopOpacity="0" />
            <stop offset="0.6" stopColor="var(--color-card)" stopOpacity="0" />
            <stop offset="0.64" stopColor="var(--color-card)" stopOpacity="0.32" />
            <stop offset="0.68" stopColor="var(--color-card)" stopOpacity="0" />
          </linearGradient>
          <clipPath id="hero-tray-lid">
            <rect width={W} height={D} rx={R} />
          </clipPath>
          <filter id="hero-tray-soft" x="-40%" y="-80%" width="180%" height="260%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <filter id="hero-tray-contact" x="-10%" y="-30%" width="120%" height="160%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Тени на полу: широкая полутень уходит влево-вниз (свет, как и у
            шара, справа сверху), плотная контактная — прямо под дном. */}
        <ellipse
          cx="160"
          cy="128"
          rx="200"
          ry="42"
          transform="rotate(-9 160 128)"
          fill="var(--color-umber)"
          opacity="0.2"
          filter="url(#hero-tray-soft)"
        />
        <path d={FLOOR} transform="translate(0 4)" fill="var(--color-umber)" opacity="0.36" filter="url(#hero-tray-contact)" />

        {/* Стенки: белый пластик, тень под фланцем, правый бок от света. */}
        <path d={WALLS} fill="url(#hero-tray-wall)" />
        <path d={WALLS} fill="url(#hero-tray-side)" />
        <g transform="translate(0 3)" opacity="0.16" filter="url(#hero-tray-contact)">
          <rect width={W} height={D} rx={R} transform={MATRIX} fill="var(--color-ink)" />
        </g>

        <g transform={MATRIX}>
          <rect width={W} height={D} rx={R} fill="var(--color-card)" />

          <g clipPath="url(#hero-tray-lid)">
            <path
              ref={bandRef}
              d={`M0 0H${W}V66H0Z`}
              fill="var(--color-sea)"
              className={`transition-[fill] ease-out ${active ? "duration-150" : "duration-500"}`}
            />
            <rect x="36" y="98" width="142" height="13" rx="6.5" fill="var(--color-ink-soft)" />
            <rect x="36" y="124" width="98" height="11" rx="5.5" fill="var(--color-line-strong)" />
            <rect x="36" y="148" width="62" height="11" rx="5.5" fill="var(--color-sand)" />
            <circle cx="240" cy="132" r="30" fill="var(--color-accent)" />

            {/* Борт лотка просвечивает сквозь плёнку. */}
            <rect x="9" y="9" width={W - 18} height={D - 18} rx="12" fill="none" stroke="var(--color-ink)" strokeOpacity="0.08" strokeWidth="1.2" />
            <rect width={W} height={D} fill="url(#hero-tray-gloss)" />
          </g>

          {/* Плёнка перегибается через передний и левый край — там блик. */}
          <path d={`M${R} ${D - 0.8}H${W - R}`} stroke="var(--color-card)" strokeOpacity="0.95" strokeWidth="2.4" strokeLinecap="round" />
          <path d={`M0.8 ${R + 6}V${D - R}`} stroke="var(--color-card)" strokeOpacity="0.7" strokeWidth="1.8" strokeLinecap="round" />
          {/* Складки натянутой плёнки на передних углах. */}
          <g fill="none" stroke="var(--color-card)" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round">
            <path d="M5 156q9 12 26 30" />
            <path d="M12 146q10 16 30 40" />
            <path d="M295 160q-8 12-22 27" />
          </g>
        </g>
      </svg>
    </motion.div>
  );
}
