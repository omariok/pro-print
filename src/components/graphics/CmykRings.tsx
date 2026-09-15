type Props = {
  className?: string;
  rings?: number;
};

const CX = 200;
const CY = 200;

function polar(radius: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return [CX + radius * Math.cos(rad), CY - radius * Math.sin(rad)] as const;
}

function arc(radius: number, from: number, to: number) {
  const [x1, y1] = polar(radius, from);
  const [x2, y2] = polar(radius, to);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  const sweep = to > from ? 0 : 1;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${large} ${sweep} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

/** Concentric CMYK target: the recurring brand mark of the layouts. */
export default function CmykRings({ className = "", rings = 15 }: Props) {
  const radii = Array.from({ length: rings }, (_, i) => 26 + i * 10.5);

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      <g className="[transform-origin:200px_200px] motion-safe:animate-[spin-slow_90s_linear_infinite]">
        {radii.map((r, i) => (
          <circle
            key={r}
            cx={CX}
            cy={CY}
            r={r}
            fill="none"
            stroke="#233038"
            strokeOpacity={0.13 + (i / radii.length) * 0.07}
            strokeWidth={1.1}
          />
        ))}
      </g>

      <path
        d={arc(radii[radii.length - 1] + 14, 196, 74)}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={3.2}
        strokeLinecap="round"
      />
      <path
        d={arc(radii[radii.length - 1] + 14, 4, -60)}
        fill="none"
        stroke="var(--color-sand)"
        strokeWidth={3.2}
        strokeLinecap="round"
      />

      <circle cx={CX} cy={CY} r={17} fill="var(--color-sea)" />
    </svg>
  );
}
