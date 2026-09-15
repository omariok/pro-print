import Link from "next/link";
import { capabilities } from "@/lib/content";
import Fold from "../ui/Fold";
import Reveal from "../ui/Reveal";
import SectionHead from "../ui/SectionHead";
import { ArrowIcon, CheckIcon } from "../ui/Icons";

export default function Capabilities() {
  return (
    <section
      id="products"
      className="relative bg-paper-grey py-16 sm:py-20 lg:py-24"
    >
      <div className="shell">
        <SectionHead
          title={capabilities.title}
          lede={capabilities.lede}
          titleClassName="max-w-[19ch]"
        />

        <Reveal delay={0.1}>
          <div className="mt-12 grid gap-px overflow-hidden rounded-panel bg-ink/10 ring-1 ring-ink/10 sm:mt-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {capabilities.cards.map((card) => (
              <article
                key={card.title}
                className="group flex flex-col bg-card transition-colors duration-200 hover:bg-paper sm:p-8 lg:p-9"
              >
                <Fold title={card.title} titleClassName="max-w-[18ch]">
                  <p className="mt-1 text-[15px] leading-[1.6] text-muted sm:mt-4">{card.text}</p>

                  <ul className="mt-6 space-y-3 border-t border-ink/10 pt-6">
                    {card.points.map((point) => (
                      <li key={point} className="flex gap-3 text-[14.5px] leading-[1.5] text-ink/88">
                        <CheckIcon className="mt-[3px] h-[15px] w-[15px] shrink-0 text-accent" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {"note" in card && card.note ? (
                    <p className="mt-6 border-l-2 border-accent pl-4 text-[13.5px] leading-[1.5] text-muted">
                      {card.note}
                    </p>
                  ) : null}
                </Fold>
              </article>
            ))}

            <article className="flex flex-col bg-card transition-colors duration-200 hover:bg-paper sm:col-span-2 sm:p-8 lg:p-9">
              <Fold title={capabilities.prepress.title}>
                <p className="mt-1 max-w-[60ch] text-[15px] leading-[1.6] text-muted sm:mt-4">
                  {capabilities.prepress.text}
                </p>

                <div className="mt-6 grid gap-6 border-t border-ink/10 pt-6 md:grid-cols-2 md:gap-8">
                  {capabilities.prepress.groups.map((group) => (
                    <div key={group.title}>
                      <h4 className="font-display text-[15px] font-bold tracking-[-0.01em] text-ink">
                        {group.title}
                      </h4>
                      <ul className="mt-3 space-y-3">
                        {group.points.map((point) => (
                          <li key={point} className="flex gap-3 text-[14.5px] leading-[1.5] text-ink/88">
                            <CheckIcon className="mt-[3px] h-[15px] w-[15px] shrink-0 text-accent" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Fold>
            </article>

            <article className="relative flex flex-col justify-center overflow-hidden bg-cream p-7 sm:col-span-2 sm:p-8 lg:col-span-3 lg:p-9">
              <div aria-hidden className="glow pointer-events-none absolute -right-16 -top-16 h-56 w-56 text-accent/14" />
              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
                <div>
                  <h3 className="h-card text-ink">{capabilities.callout.title}</h3>
                  <p className="mt-4 max-w-[42ch] text-[15px] leading-[1.6] text-muted">
                    {capabilities.callout.text}
                  </p>
                </div>
                <Link
                  href="/#request"
                  className="group -my-1 inline-flex shrink-0 items-center gap-2.5 py-1 font-display text-[14.5px] font-bold text-[var(--accent-text)] transition-colors duration-200 hover:text-ink"
                >
                  {capabilities.callout.cta}
                  <ArrowIcon className="h-[17px] w-[17px] transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
