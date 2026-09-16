import Link from "next/link";
import { contactInfo, type Content } from "@/lib/content";
import { fill, localizeHref, type Locale } from "@/lib/i18n";
import Reveal from "../ui/Reveal";
import RequestForm from "../ui/RequestForm";
import { CheckIcon, MailIcon, PhoneIcon } from "../ui/Icons";

export default function ContactForm({ lang, t }: { lang: Locale; t: Content }) {
  const { contact, site } = t;

  return (
    <section
      id="request"
      className="relative overflow-hidden bg-paper-grey py-16 sm:py-20 lg:py-24"
    >
      {/* Декоративная подложка: мягкое свечение градиентом, без растровых картинок */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="glow absolute -left-24 top-10 h-[420px] w-[420px] text-accent/10" />
        <div className="glow absolute -right-32 bottom-0 h-[460px] w-[460px] text-sea/14" />
      </div>

      <div className="shell relative">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <h2 className="h-section max-w-[16ch] text-ink">{contact.title}</h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="lede mt-5 max-w-[46ch]">{contact.lede}</p>
            </Reveal>

            <Reveal delay={0.18}>
              <ul className="mt-9 space-y-3.5 border-t border-line pt-8">
                {contact.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckIcon className="mt-[3px] h-[17px] w-[17px] shrink-0 text-accent" />
                    <span className="text-[15px] leading-[1.5] text-ink-soft">{point}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.24}>
              {/* Телефон и почта добраны полями до 44px; шаг 22px — зоны
                  нажатия встык, без перекрытия. */}
              <div className="mt-9 space-y-[22px]">
                <a
                  href={contactInfo.phoneHref}
                  className="contact-value group -my-[11px] flex items-center gap-3 py-[11px] text-ink transition-colors duration-200 hover:text-[var(--accent-text)]"
                >
                  <PhoneIcon className="h-[18px] w-[18px] text-accent" />
                  {contactInfo.phone}
                </a>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="-my-[11px] flex items-center gap-3 py-[11px] text-[15px] text-muted transition-colors duration-200 hover:text-[var(--accent-text)]"
                >
                  <MailIcon className="h-[18px] w-[18px] text-accent" />
                  {contactInfo.email}
                </a>
                <p className="text-[14px] leading-[1.55] text-muted-soft">
                  {fill(contact.detailsBefore, { schedule: site.schedule })}
                  <Link
                    href={localizeHref(lang, "/contacts")}
                    className="text-ink underline decoration-line-strong underline-offset-2 transition-colors hover:text-[var(--accent-text)]"
                  >
                    {contact.detailsLink}
                  </Link>
                  {contact.detailsAfter}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <RequestForm lang={lang} t={t.form} site={site} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
