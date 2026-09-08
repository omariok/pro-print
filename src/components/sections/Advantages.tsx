import { advantages } from "@/lib/content";
import Reveal from "../ui/Reveal";
import SectionHead from "../ui/SectionHead";

export default function Advantages() {
  return (
    <section
      id="why"
      className="relative overflow-hidden bg-gradient-to-b from-paper via-paper-soft to-paper-grey py-20 sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute -left-32 top-1/3 h-[380px] w-[380px] rounded-full bg-cmyk-cyan/6 blur-[110px]" />

      <div className="shell relative">
        <SectionHead
          eyebrow={advantages.eyebrow}
          title={advantages.title}
          lede={advantages.lede}
          titleClassName="max-w-[20ch]"
        />

        <ul className="mt-14 grid gap-x-8 gap-y-11 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-x-10">
          {advantages.items.map((item, i) => (
            <Reveal as="li" key={item.n} delay={0.06 * i}>
              <p className="font-display text-[19px] font-extrabold tracking-[-0.02em] text-cmyk-pink">
                {item.n}
              </p>
              <h3 className="h-card mt-4 text-ink">{item.title}</h3>
              <p className="mt-4 text-[15px] leading-[1.6] text-muted">{item.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
