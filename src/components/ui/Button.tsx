import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon } from "./Icons";

type Variant = "dark" | "pink" | "link" | "outline";

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
};

const styles: Record<Variant, string> = {
  dark:
    "bg-ink text-white hover:bg-[#22242c] px-6 py-3.5 sm:px-7 sm:py-4 shadow-[0_1px_0_rgba(13,14,19,0.9)]",
  pink:
    "bg-cmyk-pink-deep text-white hover:bg-cmyk-pink px-6 py-3.5 sm:px-7 sm:py-4",
  outline:
    "border border-line-strong text-ink hover:border-ink hover:bg-paper-soft px-6 py-3.5 sm:px-7 sm:py-4",
  link: "text-cmyk-pink hover:text-cmyk-pink-deep",
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
      className={`group inline-flex items-center justify-center gap-2.5 font-display text-[14px] font-bold tracking-[-0.005em] transition-colors duration-300 sm:text-[15px] ${styles[variant]} ${className}`}
    >
      {children}
      {arrow ? (
        <ArrowIcon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
      ) : null}
    </Link>
  );
}
