import type { Metadata } from "next";
import { about, metrics } from "@/lib/content";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import CmykRings from "@/components/graphics/CmykRings";
import Metrics from "@/components/sections/Metrics";
import { ProductionGrid } from "@/components/sections/Production";

export const metadata: Metadata = {
  title: "О компании",
  description:
    "ООО «Про-Принт» — флексографская печать на пищевых плёнках от 8 мкм: стретч, ПВХ, POF, полиэтилен и барьерные. Производственная база, география поставок и ключевые параметры.",
};

export default function AboutPage() {
  return (
    <>
      {/* Заголовочный блок */}
      <section className="relative overflow-hidden bg-cream pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-28 -top-24 h-[440px] w-[440px] rounded-full bg-accent/8 blur-[130px]" />
          <div className="absolute -left-32 bottom-0 h-[380px] w-[380px] rounded-full bg-sea/12 blur-[120px]" />
        </div>

        <div className="shell relative">
          <Reveal>
            <h1 className="max-w-[19ch] font-display text-[clamp(30px,5.2vw,60px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-ink">
              {about.title}
            </h1>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="lede mt-6 max-w-[64ch]">{about.lede}</p>
          </Reveal>
        </div>
      </section>

      {/* Чем мы занимаемся */}
      <section className="bg-paper py-16 sm:py-20 lg:py-24">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-16">
            <div>
              <Reveal>
                <h2 className="h-section max-w-[14ch] text-ink">{about.whatTitle}</h2>
              </Reveal>

              <div className="mt-8 space-y-5 sm:mt-10">
                {about.what.map((paragraph, i) => (
                  <Reveal key={paragraph.slice(0, 24)} delay={0.06 * (i + 1)}>
                    <p className="max-w-[68ch] text-[15.5px] leading-[1.68] text-muted">
                      {paragraph}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal delay={0.14}>
              <div className="relative aspect-square overflow-hidden rounded-panel border border-ink/10 bg-paper-grey">
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(60% 60% at 30% 25%, rgba(255,91,4,0.09), transparent 70%), radial-gradient(55% 55% at 78% 76%, rgba(18,105,140,0.12), transparent 70%)",
                  }}
                />
                <CmykRings className="absolute inset-0 h-full w-full" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Производственная база */}
      <section className="bg-paper-grey py-16 sm:py-20 lg:py-24">
        <div className="shell">
          <Reveal>
            <h2 className="h-section max-w-[14ch] text-ink">{about.baseTitle}</h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 sm:mt-12 lg:mt-14">
              <ProductionGrid />
            </div>
          </Reveal>
        </div>
      </section>

      {/* География поставок + Для кого мы работаем */}
      <section className="bg-paper py-16 sm:py-20 lg:py-24">
        <div className="shell grid gap-14 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          <div>
            <Reveal>
              <h2 className="h-section max-w-[12ch] text-ink">{about.geographyTitle}</h2>
            </Reveal>

            <ul className="mt-9 border-t border-line sm:mt-10">
              {about.geography.map((item, i) => (
                <Reveal as="li" key={item.title} delay={0.05 * i}>
                  <div className="border-b border-line py-5 sm:py-6">
                    <h3 className="font-display text-[15.5px] font-bold tracking-[-0.015em] text-ink sm:text-[17px]">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-[46ch] text-[14.5px] leading-[1.55] text-muted">
                      {item.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          <div>
            <Reveal>
              <h2 className="h-section max-w-[13ch] text-ink">{about.audienceTitle}</h2>
            </Reveal>

            <ul className="mt-9 border-t border-line sm:mt-10">
              {about.audience.map((item, i) => (
                <Reveal as="li" key={item.title} delay={0.05 * i}>
                  <div className="flex items-start gap-4 border-b border-line py-5 sm:py-6">
                    <span className="mt-[3px] font-display text-[12px] font-bold tracking-[0.06em] text-[var(--accent-text)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-[15.5px] font-bold tracking-[-0.015em] text-ink sm:text-[17px]">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-[46ch] text-[14.5px] leading-[1.55] text-muted">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Ключевые параметры */}
      <Metrics
        variant="compact"
        title={about.keyParamsTitle}
        lede={metrics.lede}
        rows={metrics.rows}
      />

      <section className="bg-paper py-16 sm:py-20">
        <div className="shell flex flex-col items-start gap-6 border-t border-line pt-12 sm:flex-row sm:items-center sm:justify-between sm:pt-14">
          <p className="max-w-[42ch] font-display text-[19px] font-extrabold leading-[1.25] tracking-[-0.024em] text-ink sm:text-[23px]">
            Пришлите параметры тиража — вернёмся с расчётом.
          </p>
          <Button href="/#request" arrow>
            Рассчитать заказ
          </Button>
        </div>
      </section>
    </>
  );
}
