import type { Content } from "@/lib/content";
import Reveal from "../ui/Reveal";
import SectionHead from "../ui/SectionHead";

export function ProductionGrid({ cards }: { cards: Content["production"]["cards"] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-panel bg-ink/10 ring-1 ring-ink/10 md:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.title}
          className="bg-card p-7 transition-colors duration-200 hover:bg-paper sm:p-8 lg:p-10"
        >
          <h3 className="h-card text-ink">{card.title}</h3>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.6] text-muted">{card.text}</p>
        </article>
      ))}
    </div>
  );
}

export default function Production({ production }: { production: Content["production"] }) {
  return (
    <section
      id="production"
      className="bg-paper-grey py-16 sm:py-20 lg:py-24"
    >
      <div className="shell">
        <SectionHead
          title={production.title}
          lede={production.lede}
          titleClassName="max-w-[17ch]"
        />

        <Reveal delay={0.1}>
          <div className="mt-12 sm:mt-14 lg:mt-16">
            <ProductionGrid cards={production.cards} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
