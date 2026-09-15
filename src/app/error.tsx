"use client";

import { useEffect } from "react";
import Link from "next/link";
import { site } from "@/lib/content";

/**
 * Граница ошибки для всех страниц. Сбой на производственном сайте почти всегда
 * означает потерянную заявку, поэтому экран не извиняется, а сразу даёт два
 * рабочих канала связи — телефон и почту — рядом с кнопкой повтора.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="bg-paper pb-24 pt-16 sm:pb-28 sm:pt-20 lg:pt-24">
      <div className="shell">
        <h1 className="max-w-[18ch] font-display text-[clamp(28px,4.4vw,50px)] font-extrabold leading-[1.06] tracking-[-0.03em] text-ink">
          Страница не загрузилась
        </h1>

        <p className="lede mt-5 max-w-[54ch]">
          Ошибка на нашей стороне, а не в ваших действиях. Обычно помогает повторная загрузка —
          данные формы при этом не сохраняются, их придётся ввести заново.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-pill bg-ink px-6 py-3.5 font-display text-[14px] font-bold tracking-[-0.005em] text-paper press hover:bg-ink-hover active:scale-[0.97] sm:px-7 sm:py-4 sm:text-[15px]"
          >
            Загрузить ещё раз
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-pill border border-line-strong px-6 py-3.5 font-display text-[14px] font-bold tracking-[-0.005em] text-ink press hover:border-ink hover:bg-paper-soft active:scale-[0.97] sm:px-7 sm:py-4 sm:text-[15px]"
          >
            На главную
          </Link>
        </div>

        <div className="mt-12 max-w-[46ch] border-t border-line pt-6">
          <p className="text-[14px] leading-[1.6] text-muted">
            Нужен расчёт прямо сейчас — заявку примем вручную. Телефон{" "}
            <a
              href={site.phoneHref}
              className="whitespace-nowrap text-ink underline decoration-line-strong underline-offset-2 transition-colors duration-200 hover:text-[var(--accent-text)]"
            >
              {site.phone}
            </a>
            , почта{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-ink underline decoration-line-strong underline-offset-2 transition-colors duration-200 hover:text-[var(--accent-text)]"
            >
              {site.email}
            </a>
            . {site.schedule}.
          </p>

          {error.digest ? (
            /* Код нужен не посетителю, а нам: с ним ошибка находится в логах
               за один запрос. Поэтому он есть, но набран тихо. */
            <p className="mt-4 font-mono text-[12px] text-muted-soft">
              Код обращения: {error.digest}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
