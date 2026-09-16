import type { Content } from "@/lib/content";
import { fill } from "@/lib/i18n";
import Reveal from "../ui/Reveal";
import SectionHead from "../ui/SectionHead";
import { DocIcon, DownloadIcon } from "../ui/Icons";

export default function Documents({ documents }: { documents: Content["documents"] }) {
  return (
    <section id="documents" className="bg-paper py-16 sm:py-20 lg:py-24">
      <div className="shell">
        <SectionHead
          title={documents.title}
          lede={documents.lede}
          titleClassName="max-w-[16ch]"
        />

        <Reveal delay={0.1}>
          {/* Одна колонка до lg: реквизиты документов длинные, а три карточки
              в двух колонках оставляли бы пустую ячейку. */}
          <ul className="mt-12 grid gap-px overflow-hidden rounded-panel bg-ink/10 ring-1 ring-ink/10 sm:mt-14 lg:mt-16 lg:grid-cols-3">
            {documents.items.map((item) => (
              <li
                key={item.title}
                className="flex flex-col bg-paper-grey p-7 transition-colors duration-200 hover:bg-mist sm:p-8"
              >
                <div className="flex flex-1 items-start gap-3.5">
                  <DocIcon className="mt-0.5 h-[22px] w-[22px] shrink-0 text-accent" />
                  <div className="min-w-0">
                    <h3 className="font-display text-[15.5px] font-bold tracking-[-0.015em] text-ink sm:text-[17px]">
                      {item.title}
                    </h3>
                    {/* Номер документа — проверяемый реквизит, поэтому стоит
                        отдельной строкой, а не тонет в описании. */}
                    <p className="mt-2.5 break-words border-l-2 border-accent pl-3 text-[13.5px] font-semibold leading-[1.4] text-ink">
                      {item.meta}
                    </p>
                    <p className="mt-3 text-[14.5px] leading-[1.55] text-muted">{item.text}</p>
                  </div>
                </div>

                {/* Кнопка внизу карточки: mt-auto держит её на одной линии
                    во всех трёх колонках, каким бы длинным ни было описание. */}
                <a
                  href={item.file.href}
                  download
                  aria-label={fill(documents.downloadAria, { title: item.title, size: item.file.size })}
                  className="group mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 border-t border-ink/10 pt-5 font-display text-[13.5px] font-bold text-ink transition-colors duration-200 hover:text-[var(--accent-text)]"
                >
                  <DownloadIcon className="h-[17px] w-[17px] shrink-0 transition-transform duration-200 group-hover:translate-y-0.5" />
                  {documents.downloadLabel}
                  {/* На узких экранах вес файла уходит на свою строку целиком:
                      в одну строку он ломался пополам у правого края. */}
                  <span className="basis-full pl-[27px] text-[12.5px] font-normal text-muted sm:ml-auto sm:basis-auto sm:pl-3 sm:text-right">
                    {item.file.size}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
