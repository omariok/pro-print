import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { contactInfo, getContent } from "@/lib/content";
import { legalValues } from "@/lib/content/legal-info";
import { pageMetadata } from "@/lib/metadata";
import { fill, isLocale } from "@/lib/i18n";
import { DocBlocks, DocHeader } from "@/components/legal/DocBlocks";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { privacy } = getContent(lang);
  return pageMetadata(lang, "/privacy", { title: privacy.metaTitle, description: privacy.metaDescription });
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { privacy, site } = getContent(lang);
  const values = legalValues({
    legalName: site.legalName,
    fullName: site.fullName,
    email: contactInfo.email,
    phone: contactInfo.phone,
  });

  return (
    <section className="bg-paper pb-20 pt-16 sm:pb-24 sm:pt-20 lg:pt-24">
      <div className="shell">
        <DocHeader
          title={privacy.title}
          lede={fill(privacy.lede, values)}
          version={privacy.version}
          translationNote={privacy.translationNote}
        />
        <DocBlocks lang={lang} blocks={privacy.blocks} values={values} />
      </div>
    </section>
  );
}
