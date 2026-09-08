import Reveal from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  lede?: string;
  tone?: "dark" | "light";
  className?: string;
  titleClassName?: string;
};

export default function SectionHead({
  eyebrow,
  title,
  lede,
  tone = "dark",
  className = "",
  titleClassName = "max-w-[15ch]",
}: Props) {
  return (
    <div className={className}>
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
      </Reveal>

      <Reveal delay={0.06}>
        <h2
          className={`h-section mt-5 sm:mt-6 ${
            tone === "dark" ? "text-ink" : "text-white"
          } ${titleClassName}`}
        >
          {title}
        </h2>
      </Reveal>

      {lede ? (
        <Reveal delay={0.12}>
          <p
            className={`lede mt-5 max-w-[62ch] ${
              tone === "dark" ? "text-muted" : "text-white/62"
            }`}
          >
            {lede}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
