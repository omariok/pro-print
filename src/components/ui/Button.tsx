import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon } from "./Icons";

type Variant = "dark" | "accent" | "link" | "outline";

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
};

const styles: Record<Variant, string> = {
  dark:
    "rounded-pill bg-ink text-paper hover:bg-ink-hover active:scale-[0.97] px-6 py-3.5 sm:px-7 sm:py-4",
  accent:
    "rounded-pill bg-accent text-ink-deep hover:bg-accent-hover active:scale-[0.97] px-6 py-3.5 sm:px-7 sm:py-4",
  outline:
    "rounded-pill border border-line-strong text-ink hover:border-ink hover:bg-paper-soft active:scale-[0.97] px-6 py-3.5 sm:px-7 sm:py-4",
  link: "text-[var(--accent-text)] hover:text-ink",
};

export default function Button({
  href,
  children,
  variant = "dark",
  arrow = false,
  className = "",
}: Props) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center justify-center gap-2.5 font-display text-[14px] font-bold tracking-[-0.005em] press sm:text-[15px] ${styles[variant]} ${className}`}
    >
      {children}
      {arrow ? (
        <ArrowIcon className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-1" />
      ) : null}
    </Link>
  );
}
