import type { Content } from "@/lib/content";
import Reveal from "../ui/Reveal";
import SectionHead from "../ui/SectionHead";

export default function Pvc({ pvc }: { pvc: Content["pvc"] }) {
  return (
    <section
      id="pvc"
      className="relative overflow-hidden bg-gradient-to-b from-paper to-paper-soft py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden
        className="glow pointer-events-none absolute -right-32 top-24 h-[420px] w-[420px] text-sea/10"
      />

      <div className="shell relative">
        <SectionHead
          title={pvc.title}
          lede={pvc.lede}
          titleClassName="max-w-[18ch]"
        />

        {/* Применения: широкие полосы, без карточек — чтобы не повторять сетку «Продукции». */}
        <div className="mt-14 lg:mt-16">
          <Reveal>
            {/* Мелкая разрядка нейтральным цветом: подзаголовок внутри секции. */}
            <h3 className="font-display text-[11px] font-bold uppercase leading-none tracking-[0.22em] text-muted">
              {pvc.usesTitle}
            </h3>
          </Reveal>

          <ul className="mt-7 grid border-t border-line sm:grid-cols-2 sm:gap-x-12 lg:gap-x-20">
            {pvc.uses.map((use, i) => (
              <Reveal as="li" key={use.title} delay={0.05 * i}>
                <div className="flex h-full items-start gap-4 border-b border-line py-6 sm:py-7">
                  <span className="mt-[5px] font-display text-[11px] font-bold tracking-[0.06em] text-[var(--accent-text)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="h-card text-ink">{use.title}</h4>
                    <p className="mt-3 max-w-[48ch] text-[15px] leading-[1.6] text-muted">
                      {use.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Преимущества: плотный двухколоночный словарь, компактнее применений. */}
        <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div>
            <Reveal>
              <h3 className="h-section max-w-[12ch] text-ink">{pvc.advTitle}</h3>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-6 max-w-[42ch] border-l-2 border-accent pl-5 text-[14.5px] leading-[1.62] text-muted">
                {pvc.note}
              </p>
            </Reveal>
          </div>

          <dl className="grid gap-x-12 gap-y-0 border-t border-line sm:grid-cols-2 lg:gap-x-14">
            {pvc.advantages.map((item, i) => (
              <Reveal key={item.title} delay={Math.min(0.04 * i, 0.24)} className="border-b border-line py-5">
                <dt className="font-display text-[15.5px] font-bold tracking-[-0.015em] text-ink">
                  {item.title}
                </dt>
                <dd className="mt-2 text-[14.5px] leading-[1.55] text-muted">{item.text}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
