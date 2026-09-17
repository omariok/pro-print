import Image from "next/image";
import type { Content } from "@/lib/content";
import Reveal from "../ui/Reveal";
import SectionHead from "../ui/SectionHead";

type ExamplesText = Content["examples"];
type Item = ExamplesText["items"][number];

/**
 * Светлая, но сильно насыщенная CMYK-подложка: на холодной дымке секции
 * тёплые панели читаются как цветные оттиски, а не как бледные заглушки.
 */
const wash =
  "bg-[radial-gradient(80%_75%_at_6%_2%,var(--color-wash-sea)_0%,transparent_58%),radial-gradient(75%_70%_at_96%_6%,var(--color-sand)_0%,transparent_56%),radial-gradient(95%_90%_at_76%_100%,var(--color-wash-peach)_0%,transparent_60%)] bg-card";

// Секция ниже первого экрана: снимки грузятся лениво, без priority —
// иначе они отнимали бы канал у шрифтов и шара Hero. Исходники в public
// уже сжаты в WebP 1536 px, а next/image ещё раз режет их под ширину слота
// и отдаёт AVIF/WebP. Слот без src показывает подложку с подписью.
function Slot({ item, pending, sizes }: { item: Item; pending: string; sizes: string }) {
  if (item.src) {
    return <Image src={item.src} alt={item.alt} fill sizes={sizes} className="object-cover" />;
  }

  return (
    <>
      <div aria-hidden className={`absolute inset-0 ${wash}`} />
      <span className="absolute bottom-4 left-4 rounded-chip border border-ink/12 bg-card/90 px-3.5 py-1.5 text-[11px] font-bold uppercase leading-none tracking-[0.14em] text-ink/70">
        {pending}
      </span>
    </>
  );
}

const frame = "relative overflow-hidden rounded-card border border-ink/10 bg-paper-grey";
const caption = "mt-3.5 max-w-[60ch] text-[13.5px] leading-[1.5] text-muted";

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

        {/* Снимки 3:2. Главный слева от xl тянется на высоту правого столбика,
            чтобы низ колонок совпал. Колонки 2.3:1 подобраны так, что его рамка
            остаётся близкой к 3:2: обрезается стол вокруг лотка, а не сам
            лоток. Уже xl правый столбик слишком узок: подписи в нём растут в
            высоту и главный снимок пришлось бы резать сильнее, поэтому до xl
            два меньших снимка стоят в ряд под главным. */}
        <div className="mt-12 grid gap-6 sm:mt-14 lg:mt-16 xl:grid-cols-[2.3fr_1fr]">
          <Reveal delay={0.06} className="xl:flex">
            <figure className="flex w-full flex-col">
              <div className={`${frame} aspect-[3/2] xl:aspect-auto xl:min-h-0 xl:flex-1`}>
                <Slot item={lead} pending={examples.pending} sizes="(min-width: 1280px) 65vw, 100vw" />
              </div>
              <figcaption className={caption}>{lead.caption}</figcaption>
            </figure>
          </Reveal>

          <div className="grid content-start gap-6 sm:grid-cols-2 xl:grid-cols-1">
            {rest.map((item, i) => (
              <Reveal key={item.key} delay={0.14 + i * 0.08}>
                <figure>
                  <div className={`${frame} aspect-[3/2]`}>
                    <Slot
                      item={item}
                      pending={examples.pending}
                      sizes="(min-width: 1280px) 28vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <figcaption className={caption}>{item.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
