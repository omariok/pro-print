"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Раскрытие блока при въезде в экран — обёртка стоит почти на каждой секции.
 *
 * Сам переход живёт в CSS (`[data-reveal]` в globals.css), а JS только
 * переключает атрибут: на главной таких блоков около полусотни, и держать
 * полсотни анимаций библиотеки — значит платить за них при гидратации и на
 * каждом кадре прокрутки. Композитору достаточно opacity и transform.
 *
 * Длительность намеренно короткая: за одну прокрутку эту анимацию видно два-три
 * десятка раз, а на такой частоте она обязана быть незаметной, а не красивой.
 */

/** Один наблюдатель на страницу вместо одного на каждый блок. */
let observer: IntersectionObserver | null = null;

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.reveal = "shown";
        observer?.unobserve(entry.target);
      }
    },
    // Блок проявляется, отступив от кромки экрана, а не ровно на ней.
    { rootMargin: "-80px 0px -80px 0px" },
  );
  return observer;
}

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "header";
};

export default function Reveal({ children, delay = 0, className, as = "div" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Без IntersectionObserver показываем сразу: пустой экран хуже, чем
    // блок, появившийся без анимации.
    if (typeof IntersectionObserver === "undefined") {
      node.dataset.reveal = "shown";
      return;
    }

    const io = getObserver();
    io.observe(node);
    return () => io.unobserve(node);
  }, []);

  const Tag = as as "div";

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={className}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
