import Link from "next/link";
import { footer, site } from "@/lib/content";
import Logo from "../ui/Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-cmyk-pink/8 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[360px] w-[360px] rounded-full bg-cmyk-cyan/8 blur-[120px]" />

      <div className="shell relative">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.45fr_1fr] lg:gap-24 lg:py-20 xl:py-24">
          <div>
            <Logo variant="inline" tone="light" />
            <p className="mt-6 max-w-[52ch] text-[15px] leading-[1.65] text-white/62">
              {footer.about}
            </p>
          </div>

          <div>
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-white/38">
              Контакты
            </p>
            <ul className="mt-6 space-y-4 text-[15px] leading-[1.6]">
              <li>
                <a
                  href={site.phoneHref}
                  className="font-display font-bold tracking-[-0.01em] text-white transition-colors duration-200 hover:text-cmyk-pink"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-white/82 transition-colors duration-200 hover:text-cmyk-pink"
                >
                  {site.email}
                </a>
              </li>
              <li className="max-w-[34ch] text-white/62">Производство: {site.production}</li>
              <li className="text-white/62">{site.schedule}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-[13.5px] text-white/45 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-8">
          <div className="flex flex-col gap-2 xs:flex-row xs:items-center xs:gap-6">
            <p>
              © {year} {site.legalName}
            </p>
            <Link
              href={footer.legal.href}
              className="text-white/62 underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-cmyk-pink hover:decoration-cmyk-pink"
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
