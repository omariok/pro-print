import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { contactInfo, getContent } from "@/lib/content";
import { legalValues } from "@/lib/content/legal-info";
import { pageMetadata } from "@/lib/metadata";
import { fill, isLocale, localizeHref } from "@/lib/i18n";
import { DocHeader, DocList, docLink } from "@/components/legal/DocBlocks";
import { CookieSettingsButton } from "@/components/ui/CookieBanner";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { legal } = getContent(lang);
  return pageMetadata(lang, "/legal", { title: legal.metaTitle, description: legal.metaDescription });
}

const section = "border-b border-line py-9 sm:py-11";
const h2 = "font-display text-[clamp(21px,2.4vw,27px)] font-extrabold leading-[1.15] tracking-[-0.022em] text-ink";
const text = "text-[15px] leading-[1.65] text-muted";

export default async function LegalPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { legal, site } = getContent(lang);
  const values = legalValues({
    legalName: site.legalName,
    fullName: site.fullName,
    email: contactInfo.email,
    phone: contactInfo.phone,
  });
  const { operator, consent, cookies, documents } = legal;

  const toc = [
    { id: "operator", title: operator.title },
    { id: "consent", title: consent.title },
    { id: "cookies", title: cookies.title },
    { id: "documents", title: documents.title },
  ];

  return (
    <section className="bg-paper pb-20 pt-16 sm:pb-24 sm:pt-20 lg:pt-24">
      <div className="shell">
        <DocHeader
          title={legal.title}
          lede={legal.lede}
          version={legal.version}
          translationNote={legal.translationNote}
        />

        <nav aria-label={legal.tocLabel} className="mt-10 max-w-[74ch] sm:mt-12">
          <ol className="flex flex-wrap gap-2">
            {toc.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-line px-4 py-2 text-[14px] text-ink transition-colors duration-200 hover:border-ink"
                >
                  <span className="tabular-nums text-muted-soft">{i + 1}</span>
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 max-w-[74ch] border-t border-line sm:mt-12">
          <section id="operator" aria-labelledby="operator-title" className={section}>
            <h2 id="operator-title" className={h2}>
              {operator.title}
            </h2>
            <p className={`mt-4 ${text}`}>{fill(operator.text, values)}</p>
            <dl className="mt-6 border-t border-line">
              {operator.rows.map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-1 border-b border-line py-3.5 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-8"
                >
                  <dt className="text-[14px] leading-[1.45] text-muted-soft">{label}</dt>
                  <dd className="text-[14.5px] leading-[1.5] tabular-nums text-ink">{fill(value, values)}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="consent" aria-labelledby="consent-title" className={section}>
            <h2 id="consent-title" className={h2}>
              {consent.title}
            </h2>
            <p className={`mt-4 ${text}`}>{fill(consent.intro, values)}</p>
            <DocList items={consent.items} values={values} ordered />
            <p className={`mt-5 ${text}`}>
              {consent.policyBefore}
              <Link href={localizeHref(lang, "/privacy")} className={docLink}>
                {consent.policyLink}
              </Link>
              {consent.policyAfter}
            </p>
          </section>

          <section id="cookies" aria-labelledby="cookies-title" className={section}>
            <h2 id="cookies-title" className={h2}>
              {cookies.title}
            </h2>
            {cookies.paras.map((p) => (
              <p key={p} className={`mt-4 ${text}`}>
                {p}
              </p>
            ))}
            <div className="mt-6 overflow-x-auto rounded-tile border border-line">
              <table className="w-full min-w-[520px] border-collapse text-left text-[14px] leading-[1.45]">
                <thead>
                  <tr className="bg-cream">
                    {cookies.table.headers.map((h) => (
                      <th key={h} scope="col" className="px-4 py-3 font-display text-[13px] font-bold text-ink">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cookies.table.rows.map((row) => (
                    <tr key={row[0]} className="border-t border-line">
                      {row.map((cell, i) => (
                        <td key={i} className={`px-4 py-3 ${i === 0 ? "font-mono text-[13px] text-ink" : "text-muted"}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {cookies.after.map((p) => (
              <p key={p} className={`mt-4 ${text}`}>
                {p}
              </p>
            ))}
            <div className="mt-6">
              <CookieSettingsButton label={cookies.settings} />
            </div>
          </section>

          <section id="documents" aria-labelledby="documents-title" className={section}>
            <h2 id="documents-title" className={h2}>
              {documents.title}
            </h2>
            <ul className={`mt-4 space-y-2.5 ${text}`}>
              {documents.links.map((item) => (
                <li key={item.href}>
                  <Link href={localizeHref(lang, item.href)} className={docLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}
