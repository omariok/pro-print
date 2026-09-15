import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/content";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Страница не найдена",
  description: "Такой страницы на сайте Про-Принт нет. Вернитесь на главную или напишите нам.",
};

/** Куда осмысленно уйти с тупика — короткий список, а не карта сайта. */
const exits = [
  { label: "Продукция и материалы", href: "/#products" },
  { label: "Технические параметры", href: "/#specs" },
  { label: "О компании", href: "/about" },
  { label: "Контакты", href: "/contacts" },
];

export default function NotFound() {
  return (
    <section className="bg-paper pb-24 pt-16 sm:pb-28 sm:pt-20 lg:pt-24">
      <div className="shell">
        {/* Цифры набраны как непопавшая приводка: три краски разъехались и
            перекрываются в наложении. Печатник читает этот дефект с одного
            взгляда, а посетителю без опыта он просто говорит «что-то не так». */}
        <Reveal>
          <p aria-hidden className="relative inline-block select-none pb-2">
            <span className="relative block font-display text-[clamp(96px,24vw,232px)] font-extrabold leading-[0.86] tracking-[-0.06em]">
              <span className="absolute inset-0 translate-x-[0.028em] -translate-y-[0.02em] text-sea mix-blend-multiply">
                404
              </span>
              <span className="absolute inset-0 -translate-x-[0.024em] translate-y-[0.024em] text-sand mix-blend-multiply">
                404
              </span>
              <span className="relative block text-accent mix-blend-multiply">404</span>
            </span>
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <h1 className="mt-6 max-w-[16ch] font-display text-[clamp(28px,4.4vw,50px)] font-extrabold leading-[1.06] tracking-[-0.03em] text-ink">
            Приводка ушла: страницы нет
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="lede mt-5 max-w-[54ch]">
            По этому адресу на сайте ничего не лежит — ссылка устарела либо в адресе опечатка.
            Ниже разделы, ради которых сюда обычно приходят.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
            <Button href="/" arrow>
              На главную
            </Button>
            <Button href="/#request" variant="outline">
              Рассчитать заказ
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <nav aria-label="Основные разделы" className="mt-12 max-w-[42ch] border-t border-line">
            <ul>
              {exits.map((exit) => (
                <li key={exit.href}>
                  <Link
                    href={exit.href}
                    className="group flex items-center justify-between gap-6 border-b border-line py-4 font-display text-[15px] font-bold tracking-[-0.015em] text-ink transition-colors duration-200 hover:text-[var(--accent-text)]"
                  >
                    {exit.label}
                    <span
                      aria-hidden
                      className="text-muted-soft transition-transform duration-200 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-8 max-w-[46ch] text-[14px] leading-[1.6] text-muted">
            Искали конкретный документ или расчёт? Позвоните{" "}
            <a
              href={site.phoneHref}
              className="whitespace-nowrap text-ink underline decoration-line-strong underline-offset-2 transition-colors duration-200 hover:text-[var(--accent-text)]"
            >
              {site.phone}
            </a>{" "}
            или напишите на{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-ink underline decoration-line-strong underline-offset-2 transition-colors duration-200 hover:text-[var(--accent-text)]"
            >
              {site.email}
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
