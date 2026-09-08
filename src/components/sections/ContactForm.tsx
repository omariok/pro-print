import Link from "next/link";
import { contact, site } from "@/lib/content";
import Reveal from "../ui/Reveal";
import RequestForm from "../ui/RequestForm";
import { CheckIcon, MailIcon, PhoneIcon } from "../ui/Icons";

export default function ContactForm() {
  return (
    <section
      id="request"
      className="relative overflow-hidden bg-paper-grey py-20 sm:py-24 lg:py-28"
    >
      {/* Декоративная подложка: мягкие CMYK-пятна, без растровых картинок */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-cmyk-pink/10 blur-[130px]" />
        <div className="absolute -right-32 bottom-0 h-[460px] w-[460px] rounded-full bg-cmyk-cyan/14 blur-[140px]" />
      </div>

      <div className="shell relative">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <p className="eyebrow">{contact.eyebrow}</p>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="h-section mt-4 max-w-[16ch] text-ink">{contact.title}</h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="lede mt-5 max-w-[46ch]">{contact.lede}</p>
            </Reveal>

            <Reveal delay={0.18}>
              <ul className="mt-9 space-y-3.5 border-t border-line pt-8">
                {contact.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckIcon className="mt-[3px] h-[17px] w-[17px] shrink-0 text-cmyk-pink" />
                    <span className="text-[15px] leading-[1.5] text-ink-soft">{point}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 space-y-3">
                <a
                  href={site.phoneHref}
                  className="group flex items-center gap-3 font-display text-[19px] font-extrabold tracking-[-0.02em] text-ink transition-colors duration-200 hover:text-cmyk-pink sm:text-[21px]"
                >
                  <PhoneIcon className="h-[18px] w-[18px] text-cmyk-pink" />
                  {site.phone}
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-3 text-[15px] text-muted transition-colors duration-200 hover:text-cmyk-pink"
                >
                  <MailIcon className="h-[18px] w-[18px] text-cmyk-pink" />
                  {site.email}
                </a>
                <p className="pt-1 text-[14px] leading-[1.55] text-muted-soft">
                  {site.schedule}. Реквизиты и адреса —{" "}
                  <Link
                    href="/contacts"
                    className="text-ink underline decoration-line-strong underline-offset-2 transition-colors hover:text-cmyk-pink"
                  >
                    на странице контактов
                  </Link>
                  .
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <RequestForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
