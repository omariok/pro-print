import Image from "next/image";
import type { Content } from "@/lib/content";
import Reveal from "../ui/Reveal";
import SectionHead from "../ui/SectionHead";
import CmykWaves from "../graphics/CmykWaves";
import Halftone from "../graphics/Halftone";
import TrayMock from "../graphics/TrayMock";

type ExamplesText = Content["examples"];
type Item = ExamplesText["items"][number];

/**
 * Светлая, но сильно насыщенная CMYK-подложка: на холодной дымке секции
 * тёплые панели читаются как цветные оттиски, а не как бледные заглушки.
 */
const wash =
  "bg-[radial-gradient(80%_75%_at_6%_2%,var(--color-wash-sea)_0%,transparent_58%),radial-gradient(75%_70%_at_96%_6%,var(--color-sand)_0%,transparent_56%),radial-gradient(95%_90%_at_76%_100%,var(--color-wash-peach)_0%,transparent_60%)] bg-card";

const graphics: Record<string, React.ReactNode> = {
  roll: <CmykWaves className="absolute inset-0 h-full w-full" />,
  tray: <TrayMock className="w-[74%]" />,
  raster: <Halftone className="h-[80%] w-auto" />,
};

// Секция ниже первого экрана: снимки грузятся лениво, без priority —
// иначе они отнимали бы канал у шрифтов и шара Hero.
function Slot({ item, pending }: { item: Item; pending: string }) {
  if (item.src) {
    return (
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="object-cover"
      />
    );
  }

  return (
    <>
      <div aria-hidden className={`absolute inset-0 ${wash}`} />
      <div aria-hidden className="absolute inset-0 flex items-center justify-center">
        {graphics[item.key]}
      </div>
      <span className="absolute bottom-4 left-4 rounded-chip border border-ink/12 bg-card/90 px-3.5 py-1.5 text-[11px] font-bold uppercase leading-none tracking-[0.14em] text-ink/70">
        {pending}
      </span>
    </>
  );
}

export default function Examples({ examples }: { examples: ExamplesText }) {
  const [lead, ...rest] = examples.items;

  return (
    <section
      id="examples"
      className="relative overflow-hidden bg-mist py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden
        className="glow pointer-events-none absolute -left-40 top-10 h-[460px] w-[460px] text-sea/12"
      />
      <div
        aria-hidden
        className="glow pointer-events-none absolute -right-40 bottom-0 h-[460px] w-[460px] text-accent/10"
      />

      <div className="shell relative">
        <SectionHead
          title={examples.title}
          lede={examples.lede}
          titleClassName="max-w-[16ch]"
        />

        <div className="mt-12 grid gap-6 sm:mt-14 lg:mt-16 lg:grid-cols-[1.62fr_1fr]">
          <Reveal delay={0.06}>
            <figure>
              <div className="relative aspect-[16/11] overflow-hidden rounded-card border border-ink/10">
                <Slot item={lead} pending={examples.pending} />
              </div>
              <figcaption className="mt-3.5 text-[13.5px] leading-[1.5] text-muted">
                {lead.caption}
              </figcaption>
            </figure>
          </Reveal>

          <div className="grid gap-6">
            {rest.map((item, i) => (
              <Reveal key={item.key} delay={0.14 + i * 0.08}>
                <figure>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-card border border-ink/10">
                    <Slot item={item} pending={examples.pending} />
                  </div>
                  <figcaption className="mt-3.5 text-[13.5px] leading-[1.5] text-muted">
                    {item.caption}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
