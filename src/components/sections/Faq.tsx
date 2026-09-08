"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faq } from "@/lib/content";
import SectionHead from "../ui/SectionHead";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="bg-gradient-to-b from-paper to-paper-soft py-20 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <SectionHead
          eyebrow={faq.eyebrow}
          title={faq.title}
          titleClassName="max-w-[15ch]"
        />

        <div className="mt-12 border-t border-line sm:mt-14 lg:mt-16">
          {faq.items.map((item, i) => {
            const isOpen = open === i;

            return (
              <div key={item.q} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-start justify-between gap-6 py-5 text-left sm:py-[22px]"
                  >
                    <span
                      className={`font-display text-[15.5px] font-bold leading-[1.35] tracking-[-0.015em] transition-colors duration-200 sm:text-[17px] ${
                        isOpen ? "text-cmyk-pink" : "text-ink group-hover:text-cmyk-pink"
                      }`}
                    >
                      {item.q}
                    </span>

                    <span className="relative mt-1 block h-4 w-4 shrink-0">
                      <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 bg-cmyk-pink" />
                      <span
                        className={`absolute left-1/2 top-0 h-4 w-[1.5px] -translate-x-1/2 bg-cmyk-pink transition-transform duration-300 ${
                          isOpen ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[78ch] pb-6 pr-10 text-[15px] leading-[1.65] text-muted sm:pb-7">
                        {item.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
