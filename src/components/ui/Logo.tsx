import Link from "next/link";

type Props = {
  /** Footer variant sets the wordmark on one line. */
  variant?: "stacked" | "inline";
  /** Header variant: slightly tighter from xl so the nav row stays on one line. */
  compact?: boolean;
  className?: string;
};

export default function Logo({ variant = "stacked", compact = false, className = "" }: Props) {
  return (
    <Link
      href="/"
      aria-label="Про-Принт — на главную"
      className={`group flex items-center gap-3 ${compact ? "xl:gap-2.5" : ""} ${className}`}
    >
      {/* Контрольная плашка CMYK: C, M, Y, K в порядке чтения. */}
      <svg viewBox="0 0 44 44" className={`h-9 w-9 shrink-0 sm:h-10 sm:w-10 ${compact ? "xl:h-[34px] xl:w-[34px]" : ""}`} aria-hidden="true">
        <rect x="0" y="0" width="20" height="20" rx="2" fill="var(--color-cyan)" />
        <rect x="23" y="0" width="21" height="25" rx="2" fill="var(--color-magenta)" />
        <rect x="0" y="23" width="20" height="21" rx="2" fill="var(--color-yellow)" />
        <rect x="23" y="28" width="21" height="16" rx="2" fill="var(--color-ink)" />
      </svg>

      <span
        className={`font-display text-[17px] font-extrabold tracking-[-0.02em] text-ink sm:text-[19px] ${
          compact ? "xl:text-[16.5px]" : ""
        }`}
      >
        {variant === "stacked" ? (
          <span className="block leading-[0.94]">
            PRO<span className="text-accent">-</span>
            <br />
            PRINT
          </span>
        ) : (
          <span className="leading-none">
            PRO<span className="text-accent">·</span>PRINT
          </span>
        )}
      </span>
    </Link>
  );
}
