import Link from "next/link";
import type { DocBlock } from "@/lib/content";
import { fill, localizeHref, type Locale } from "@/lib/i18n";
import Reveal from "@/components/ui/Reveal";

const text = "text-[15px] leading-[1.65] text-muted";
export const docLink =
  "text-ink underline decoration-ink/25 underline-offset-4 transition-colors duration-200 hover:text-[var(--accent-text)] hover:decoration-[var(--accent-text)]";

/** Шапка юридической страницы: заголовок, вводный абзац, редакция и пометка о переводе. */
export function DocHeader({
  title,
  lede,
  version,
  translationNote,
}: {
  title: string;
  lede: string;
  version: string;
  translationNote: string;
}) {
  return (
    <>
      <Reveal>
        <h1 className="max-w-[18ch] font-display text-[clamp(28px,4.4vw,50px)] font-extrabold leading-[1.06] tracking-[-0.03em] text-ink">
          {title}
        </h1>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="lede mt-6 max-w-[60ch]">{lede}</p>
        <p className="mt-4 text-[13.5px] text-muted-soft">
          {version}
          {translationNote && <span className="block mt-1">{translationNote}</span>}
        </p>
      </Reveal>
    </>
  );
}

/** Разделы документа: абзацы, маркированный список, абзацы после списка, ссылка. */
export function DocBlocks({
  lang,
  blocks,
  values,
}: {
  lang: Locale;
  blocks: DocBlock[];
  values: Record<string, string>;
}) {
  return (
    <div className="mt-12 max-w-[74ch] border-t border-line sm:mt-14">
      {blocks.map((block) => (
        <article key={block.title} className="border-b border-line py-7 sm:py-8">
          <h2 className="h-card text-ink">{block.title}</h2>
          {block.paras?.map((p) => (
            <p key={p} className={`mt-3.5 ${text}`}>
              {fill(p, values)}
            </p>
          ))}
          {block.list && <DocList items={block.list} values={values} />}
          {block.after?.map((p) => (
            <p key={p} className={`mt-3.5 ${text}`}>
              {fill(p, values)}
            </p>
          ))}
          {block.link && (
            <p className={`mt-3.5 ${text}`}>
              <Link href={localizeHref(lang, block.link.href)} className={docLink}>
                {block.link.label}
              </Link>
            </p>
          )}
        </article>
      ))}
    </div>
  );
}

export function DocList({
  items,
  values,
  ordered = false,
}: {
  items: string[];
  values: Record<string, string>;
  ordered?: boolean;
}) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`mt-3.5 space-y-2.5 ${text}`}>
      {items.map((item, i) => (
        <li key={item} className="grid grid-cols-[1.75rem_1fr]">
          <span aria-hidden className={ordered ? "tabular-nums text-ink" : "text-accent"}>
            {ordered ? `${i + 1}.` : "—"}
          </span>
          <span>{fill(item, values)}</span>
        </li>
      ))}
    </Tag>
  );
}
