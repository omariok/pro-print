import Reveal from "./Reveal";

type Props = {
  title: string;
  lede?: string;
  className?: string;
  titleClassName?: string;
};

export default function SectionHead({
  title,
  lede,
  className = "",
  titleClassName = "max-w-[15ch]",
}: Props) {
  return (
    <div className={className}>
      <Reveal>
        <h2 className={`h-section text-ink ${titleClassName}`}>{title}</h2>
      </Reveal>

      {lede ? (
        <Reveal delay={0.06}>
          <p className="lede mt-5 max-w-[62ch] text-muted">{lede}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
