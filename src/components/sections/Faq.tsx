"use client";

import { useId, useState } from "react";
import { faq } from "@/lib/content";
import SectionHead from "../ui/SectionHead";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  // Связка кнопка → панель через aria-controls, как в Fold.
  const baseId = useId();

  return (
    <section
      id="faq"
      className="bg-gradient-to-b from-paper to-paper-soft py-16 sm:py-20 lg:py-24"
    >
      <div className="shell">
        <SectionHead
          title={faq.title}
          titleClassName="max-w-[15ch]"
        />

        <div className="mt-12 border-t border-line sm:mt-14 lg:mt-16">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-a${i}`;

            return (
              <div key={item.q} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="group flex w-full items-start justify-between gap-6 py-5 text-left sm:py-[22px]"
                  >
                    <span
                      className={`font-display text-[15.5px] font-bold leading-[1.35] tracking-[-0.015em] transition-colors duration-200 sm:text-[17px] ${
                        isOpen ? "text-[var(--accent-text)]" : "text-ink group-hover:text-[var(--accent-text)]"
                      }`}
                    >
                      {item.q}
                    </span>

                    <span className="relative mt-1 block h-4 w-4 shrink-0">
                      <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 bg-accent" />
                      <span
                        className={`absolute left-1/2 top-0 h-4 w-[1.5px] -translate-x-1/2 bg-accent transition-transform duration-200 ${
                          isOpen ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                {/* Раскрытие через grid-template-rows: 0fr → 1fr. Высоту «auto»
                    пришлось бы каждый кадр измерять и присваивать из JS, а
                    здесь тем же занят сам браузер — и ответ остаётся в
                    разметке, то есть попадает в поиск и в индекс.
                    Закрытие быстрее открытия: ответ уже прочитан, смотреть ту
                    же анимацию второй раз никто не хочет. */}
                <div
                  id={panelId}
                  aria-hidden={!isOpen}
                  className={`grid overflow-hidden transition-[grid-template-rows,opacity] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 duration-[260ms]"
                      : "grid-rows-[0fr] opacity-0 duration-[180ms]"
                  }`}
                >
                  <div className="min-h-0">
                    <p className="max-w-[70ch] pb-6 pr-10 text-[15px] leading-[1.65] text-muted sm:pb-7">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
