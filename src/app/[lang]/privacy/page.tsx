import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { contactInfo, getContent } from "@/lib/content";
import { alternatesFor, fill, isLocale } from "@/lib/i18n";
import Reveal from "@/components/ui/Reveal";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { privacy } = getContent(lang);
  return {
    title: privacy.metaTitle,
    description: privacy.metaDescription,
    alternates: alternatesFor(lang, "/privacy"),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { privacy, site } = getContent(lang);
  const values = { legalName: site.legalName, email: contactInfo.email };

  return (
    <section className="bg-paper pb-20 pt-16 sm:pb-24 sm:pt-20 lg:pt-24">
      <div className="shell">
        <Reveal>
          <h1 className="max-w-[18ch] font-display text-[clamp(28px,4.4vw,50px)] font-extrabold leading-[1.06] tracking-[-0.03em] text-ink">
            {privacy.title}
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="lede mt-6 max-w-[60ch]">{fill(privacy.lede, values)}</p>
        </Reveal>

        <div className="mt-12 max-w-[74ch] border-t border-line sm:mt-14">
          {privacy.blocks.map((block, i) => (
            <Reveal key={block.title} delay={Math.min(0.05 * i, 0.2)}>
              <article className="border-b border-line py-7 sm:py-8">
                <h2 className="h-card text-ink">{block.title}</h2>
                <p className="mt-3.5 text-[15px] leading-[1.65] text-muted">{fill(block.text, values)}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
