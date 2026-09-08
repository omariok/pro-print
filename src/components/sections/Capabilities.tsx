import Link from "next/link";
import { capabilities } from "@/lib/content";
import Reveal from "../ui/Reveal";
import SectionHead from "../ui/SectionHead";
import { ArrowIcon, CheckIcon } from "../ui/Icons";

export default function Capabilities() {
  return (
    <section
      id="products"
      className="relative bg-gradient-to-b from-paper-grey via-paper-soft to-paper py-20 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <SectionHead
          eyebrow={capabilities.eyebrow}
          title={capabilities.title}
          lede={capabilities.lede}
          titleClassName="max-w-[19ch]"
        />

        <Reveal delay={0.1}>
          <div className="mt-12 grid gap-px border border-line bg-line sm:mt-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {capabilities.cards.map((card) => (
              <article
                key={card.title}
                className="group flex flex-col bg-white p-7 transition-colors duration-300 hover:bg-paper-soft sm:p-8 lg:p-9"
              >
                <h3 className="h-card max-w-[18ch] text-ink">{card.title}</h3>
                <p className="mt-4 text-[15px] leading-[1.6] text-muted">{card.text}</p>

                <ul className="mt-6 space-y-3 border-t border-line/80 pt-6">
                  {card.points.map((point) => (
                    <li key={point} className="flex gap-3 text-[14.5px] leading-[1.5] text-ink/88">
                      <CheckIcon className="mt-[3px] h-[15px] w-[15px] shrink-0 text-cmyk-pink" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {"note" in card && card.note ? (
                  <p className="mt-6 border-l-2 border-cmyk-pink pl-4 text-[13.5px] leading-[1.5] text-muted">
                    {card.note}
                  </p>
                ) : null}
              </article>
            ))}

            <article className="relative flex flex-col justify-center overflow-hidden bg-ink p-7 sm:col-span-2 sm:p-8 lg:col-span-2 lg:p-9">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cmyk-pink/12 blur-3xl" />
              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
                <div>
                  <h3 className="h-card text-white">{capabilities.callout.title}</h3>
                  <p className="mt-4 max-w-[42ch] text-[15px] leading-[1.6] text-white/62">
                    {capabilities.callout.text}
                  </p>
                </div>
                <Link
                  href="/#request"
                  className="group inline-flex shrink-0 items-center gap-2.5 font-display text-[14.5px] font-bold text-cmyk-pink transition-colors duration-200 hover:text-white"
                >
                  {capabilities.callout.cta}
                  <ArrowIcon className="h-[17px] w-[17px] transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
