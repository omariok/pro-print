const COLORS = [
  "#4cb8e0",
  "#e6007e",
  "#f3d144",
  "#2b2d33",
  "#9aa0a8",
  "#f8b6d6",
  "#bde3f4",
  "#faeab0",
];

/** Deterministic pseudo-random so server and client render identically. */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

type Props = {
  className?: string;
  cols?: number;
  rows?: number;
};

/** Flexo raster dot pattern — the "растр на плёнке 12 мкм" close-up. */
export default function Halftone({ className = "", cols = 16, rows = 11 }: Props) {
  const step = 24;
  const dots = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const seed = y * cols + x + 1;
      const r = 2 + rand(seed) * 7.5;
      const color = COLORS[Math.floor(rand(seed * 3.3) * COLORS.length)];
      dots.push(
        <circle
          key={`${x}-${y}`}
          cx={step / 2 + x * step}
          cy={step / 2 + y * step}
          r={r}
          fill={color}
          opacity={0.55 + rand(seed * 7.7) * 0.45}
        />,
      );
    }
  }

  return (
    <svg
      viewBox={`0 0 ${cols * step} ${rows * step}`}
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      {dots}
    </svg>
  );
}
