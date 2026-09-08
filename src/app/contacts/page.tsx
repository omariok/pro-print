import type { Metadata } from "next";
import { contact, contacts, site } from "@/lib/content";
import Reveal from "@/components/ui/Reveal";
import RequestForm from "@/components/ui/RequestForm";
import { CheckIcon, ClockIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Телефон, почта и адреса производства ООО «Про-Принт». Оставьте заявку на расчёт печати на пищевых стретч-плёнках.",
};

const details = [
  { icon: PhoneIcon, label: "Телефон", value: site.phone, href: site.phoneHref },
  { icon: MailIcon, label: "E-mail", value: site.email, href: `mailto:${site.email}` },
  { icon: PinIcon, label: "Производство", value: site.production },
  { icon: PinIcon, label: "Офис", value: site.office },
  { icon: ClockIcon, label: "Режим работы", value: site.schedule },
];

export default function ContactsPage() {
  return (
    <>
      {/* Заголовочный блок */}
      <section className="relative overflow-hidden bg-cream pb-14 pt-16 sm:pb-16 sm:pt-20 lg:pb-20 lg:pt-24">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-28 -top-24 h-[420px] w-[420px] rounded-full bg-cmyk-pink/8 blur-[130px]" />
          <div className="absolute -left-28 bottom-0 h-[360px] w-[360px] rounded-full bg-cmyk-yellow/14 blur-[120px]" />
        </div>

        <div className="shell relative">
          <Reveal>
            <p className="eyebrow">{contacts.eyebrow}</p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-5 max-w-[16ch] font-display text-[clamp(30px,5.2vw,60px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-ink sm:mt-6">
              {contacts.title}
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="lede mt-6 max-w-[54ch]">{contacts.lede}</p>
          </Reveal>
        </div>
      </section>

      {/* Контактные данные и реквизиты */}
      <section className="bg-paper py-14 sm:py-16 lg:py-20">
        <div className="shell grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-24">
          <ul className="border-t border-line">
            {details.map((item, i) => {
              const Icon = item.icon;

              return (
                <Reveal as="li" key={item.label} delay={0.05 * i}>
                  <div className="flex items-start gap-4 border-b border-line py-6 sm:gap-5 sm:py-7">
                    <Icon className="mt-1 h-[20px] w-[20px] shrink-0 text-cmyk-pink" />
                    <div>
                      <p className="font-display text-[10.5px] font-bold uppercase tracking-[0.16em] text-muted-soft">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="mt-2 block font-display text-[18px] font-extrabold tracking-[-0.02em] text-ink transition-colors duration-200 hover:text-cmyk-pink sm:text-[21px]"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-2 max-w-[42ch] text-[15.5px] leading-[1.55] text-ink-soft">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>

          <Reveal delay={0.12}>
            <div className="border border-line bg-paper-soft p-7 sm:p-9">
              <h2 className="font-display text-[20px] font-extrabold tracking-[-0.025em] text-ink sm:text-[24px]">
                {contacts.requisitesTitle}
              </h2>

              <dl className="mt-7 border-t border-line">
                {contacts.requisites.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex flex-col gap-1.5 border-b border-line py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                  >
                    <dt className="text-[14px] leading-[1.4] text-muted-soft">{label}</dt>
                    <dd className="max-w-[34ch] text-[14.5px] leading-[1.45] text-ink-soft sm:text-right">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <ul className="mt-7 space-y-3">
                {contact.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckIcon className="mt-[3px] h-[16px] w-[16px] shrink-0 text-cmyk-pink" />
                    <span className="text-[14.5px] leading-[1.5] text-muted">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Форма заявки */}
      <section
        id="request"
        className="relative overflow-hidden bg-paper-grey py-16 sm:py-20 lg:py-24"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-0 h-[400px] w-[400px] rounded-full bg-cmyk-cyan/12 blur-[130px]" />
          <div className="absolute -right-24 bottom-0 h-[400px] w-[400px] rounded-full bg-cmyk-pink/10 blur-[130px]" />
        </div>

        <div className="shell relative">
          <div className="mx-auto max-w-[860px] text-center">
            <Reveal>
              <p className="eyebrow">{contact.eyebrow}</p>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="h-section mx-auto mt-5 max-w-[18ch] text-ink">{contact.title}</h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="lede mx-auto mt-5 max-w-[52ch]">{contact.lede}</p>
            </Reveal>
          </div>

          <Reveal delay={0.16}>
            <div className="mx-auto mt-10 max-w-[860px] sm:mt-12">
              <RequestForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
