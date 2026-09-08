import { prepress } from "@/lib/content";
import Reveal from "../ui/Reveal";
import SectionHead from "../ui/SectionHead";
import { CheckIcon } from "../ui/Icons";

export default function Prepress() {
  return (
    <section
      id="prepress"
      className="bg-gradient-to-b from-paper via-paper-soft to-paper-grey py-20 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <SectionHead
          eyebrow={prepress.eyebrow}
          title={prepress.title}
          lede={prepress.lede}
          titleClassName="max-w-[24ch]"
        />

        <div className="mt-14 grid gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-16">
          {prepress.blocks.map((block, i) => (
            <Reveal key={block.title} delay={0.08 * i}>
              <div className="border-t-2 border-ink pt-6">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-[19px] font-extrabold tracking-[-0.02em] text-cmyk-pink">
                    {block.n}
                  </span>
                  <h3 className="h-section text-ink">{block.title}</h3>
                </div>

                <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.62] text-muted">
                  {block.text}
                </p>

                <ul className="mt-7 space-y-3 border-t border-line pt-6">
                  {block.points.map((point) => (
                    <li key={point} className="flex gap-3 text-[14.5px] leading-[1.5] text-ink/88">
                      <CheckIcon className="mt-[3px] h-[15px] w-[15px] shrink-0 text-cmyk-pink" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
