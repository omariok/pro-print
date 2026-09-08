"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  shown: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
  },
};

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "header";
};

export default function Reveal({ children, delay = 0, className, as = "div" }: Props) {
  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-80px 0px -80px 0px" }}
      transition={{ delay }}
    >
      {children}
    </Tag>
  );
}
