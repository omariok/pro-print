import { metrics } from "@/lib/content";
import Reveal from "../ui/Reveal";
import SectionHead from "../ui/SectionHead";

type Props = {
  /** The About page reuses the table under a plain heading. */
  variant?: "full" | "compact";
  title?: string;
  lede?: React.ReactNode;
  rows?: [string, string][];
};

export function SpecTable({ rows = metrics.rows }: { rows?: [string, string][] }) {
  return (
    <dl className="border-t border-ink/14">
      {rows.map(([label, value], i) => (
        <Reveal key={label} delay={Math.min(i * 0.035, 0.28)}>
          <div className="flex flex-col gap-1.5 border-b border-ink/10 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 sm:py-[18px]">
            <dt className="text-[14.5px] leading-[1.4] text-muted">{label}</dt>
            <dd className="font-display text-[15.5px] font-bold leading-[1.35] tracking-[-0.015em] text-ink sm:text-right sm:text-[17px]">
              {value}
            </dd>
          </div>
        </Reveal>
      ))}
    </dl>
  );
}

export default function Metrics({ variant = "full", title, lede, rows }: Props) {
  return (
    <section
      id="specs"
      className="relative overflow-hidden bg-cream py-16 sm:py-20 lg:py-24"
    >
      <div aria-hidden className="pointer-events-none absolute -left-40 top-0 h-[460px] w-[460px] rounded-full bg-accent/10 blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-sand/45 blur-[130px]" />

      <div className="shell relative grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16 xl:gap-24">
        <div>
          {variant === "full" ? (
            <SectionHead
              title={metrics.title}
              lede={metrics.lede}
              titleClassName="max-w-[14ch]"
            />
          ) : (
            <>
              <Reveal>
                <h2 className="h-section max-w-[14ch] text-ink">{title}</h2>
              </Reveal>
              {lede ? (
                <Reveal delay={0.06}>
                  <p className="lede mt-5 max-w-[46ch] text-muted">{lede}</p>
                </Reveal>
              ) : null}
            </>
          )}
        </div>

        <SpecTable rows={rows} />
      </div>
    </section>
  );
}
