import { production } from "@/lib/content";
import Reveal from "../ui/Reveal";
import SectionHead from "../ui/SectionHead";

export function ProductionGrid() {
  return (
    <div className="grid gap-px border border-line bg-line md:grid-cols-3">
      {production.cards.map((card) => (
        <article
          key={card.title}
          className="bg-paper-soft p-7 transition-colors duration-300 hover:bg-white sm:p-8 lg:p-10"
        >
          <h3 className="h-card text-ink">{card.title}</h3>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.6] text-muted">{card.text}</p>
        </article>
      ))}
    </div>
  );
}

export default function Production() {
  return (
    <section
      id="production"
      className="bg-gradient-to-b from-paper-soft to-paper py-20 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <SectionHead
          eyebrow={production.eyebrow}
          title={production.title}
          lede={production.lede}
          titleClassName="max-w-[17ch]"
        />

        <Reveal delay={0.1}>
          <div className="mt-12 sm:mt-14 lg:mt-16">
            <ProductionGrid />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
