import type { Content } from "@/lib/content";
import Reveal from "../ui/Reveal";
import SectionHead from "../ui/SectionHead";

export default function Process({ process }: { process: Content["process"] }) {
  return (
    <section id="process" className="bg-paper py-16 sm:py-20 lg:py-24">
      <div className="shell">
        <SectionHead
          title={process.title}
          titleClassName="max-w-[16ch]"
        />

        <Reveal delay={0.1}>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-panel bg-ink/10 ring-1 ring-ink/10 sm:mt-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {process.steps.map((step) => (
              <li
                key={step.n}
                className="group bg-paper-grey p-7 transition-colors duration-200 hover:bg-mist sm:p-8 lg:p-9"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-[30px] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-accent-strong">
                    {step.n}
                  </span>
                  <span className="text-[13px] leading-none text-muted">{step.time}</span>
                </div>

                <h3 className="h-card mt-7 text-ink">{step.title}</h3>
                <p className="mt-3.5 text-[15px] leading-[1.6] text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
