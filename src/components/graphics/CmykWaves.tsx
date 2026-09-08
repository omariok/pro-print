const PERIOD = 600;
const TILES = 6;

function wave(amplitude: number) {
  const a = amplitude;
  let d = "M 0 0";
  for (let i = 0; i < TILES; i += 1) {
    const x = i * PERIOD;
    d += ` C ${x + 100} ${-a} ${x + 200} ${-a} ${x + 300} 0`;
    d += ` C ${x + 400} ${a} ${x + 500} ${a} ${x + 600} 0`;
  }
  return d;
}

const STROKES = [
  { color: "var(--color-cmyk-cyan)", y: 120, amp: 46, width: 13, duration: "26s" },
  { color: "var(--color-cmyk-pink)", y: 210, amp: 42, width: 13, duration: "31s" },
  { color: "var(--color-cmyk-yellow)", y: 296, amp: 38, width: 13, duration: "36s" },
  { color: "#2b2d33", y: 380, amp: 34, width: 13, duration: "41s" },
];

/** The four CMYK ribbons that run across the "printed roll" visual. */
export default function CmykWaves({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 500"
      preserveAspectRatio="none"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      {STROKES.map((s) => (
        <g
          key={s.color + s.y}
          style={{ animationDuration: s.duration }}
          className="motion-safe:animate-[wave-slide_linear_infinite]"
        >
          <path
            d={wave(s.amp)}
            transform={`translate(-600 ${s.y})`}
            fill="none"
            stroke={s.color}
            strokeWidth={s.width}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      ))}
    </svg>
  );
}
