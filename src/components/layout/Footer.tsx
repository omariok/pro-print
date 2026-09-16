import Link from "next/link";
import { contactInfo, type Content } from "@/lib/content";
import { localizeHref, type Locale } from "@/lib/i18n";
import Logo from "../ui/Logo";

export default function Footer({ lang, t }: { lang: Locale; t: Content }) {
  const { footer, site } = t;
  const year = new Date().getFullYear();

  return (
    /* Скруглённая «шапка» подвала наезжает на предыдущую секцию: иначе в
       вырезах углов просвечивал бы белый фон body, а не сама секция. */
    <footer className="relative z-10 -mt-9 overflow-hidden rounded-t-slab bg-cream">
      <div aria-hidden className="glow pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] text-accent/10" />
      <div aria-hidden className="glow pointer-events-none absolute -right-32 bottom-0 h-[360px] w-[360px] text-sea/10" />

      <div className="shell relative">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.45fr_1fr] lg:gap-24 lg:py-20 xl:py-24">
          <div>
            <Logo variant="inline" href={localizeHref(lang, "/")} label={t.header.home} />
            <p className="mt-6 max-w-[52ch] text-[15px] leading-[1.65] text-muted">
              {footer.about}
            </p>
          </div>

          <div>
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-muted-soft">
              {footer.contactsTitle}
            </p>
            {/* Ссылки добраны полями до 44px, шаг списка — 20px: зоны нажатия
                телефона и почты сходятся встык, не перекрываясь. */}
            <ul className="mt-6 space-y-5 text-[15px] leading-[1.6]">
              <li>
                <a
                  href={contactInfo.phoneHref}
                  className="-my-2.5 inline-block py-2.5 font-display font-bold tracking-[-0.01em] text-ink transition-colors duration-200 hover:text-[var(--accent-text)]"
                >
                  {contactInfo.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="-my-2.5 inline-block py-2.5 text-ink transition-colors duration-200 hover:text-[var(--accent-text)]"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li className="max-w-[34ch] text-muted">
                {footer.productionLabel} {site.production}
              </li>
              <li className="text-muted">{site.schedule}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-ink/10 py-6 text-[13.5px] text-muted-soft sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-8">
          <div className="flex flex-col gap-2 xs:flex-row xs:items-center xs:gap-6">
            <p>
              © {year} {site.legalName}
            </p>
            <Link
              href={localizeHref(lang, footer.legal.href)}
              className="-my-3 inline-block py-3 text-muted underline decoration-ink/20 underline-offset-4 transition-colors duration-200 hover:text-[var(--accent-text)] hover:decoration-[var(--accent-text)]"
            >
              {footer.legal.label}
            </Link>
          </div>
          <p className="sm:text-right">{footer.note}</p>
        </div>
      </div>
    </footer>
  );
}
