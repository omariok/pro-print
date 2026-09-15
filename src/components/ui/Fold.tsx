"use client";

import { useId, useState, useSyncExternalStore, type ReactNode } from "react";

/* Ниже sm ячейка сетки сворачивается до заголовка, с sm — всегда раскрыта.
   Свёрнутое состояние задано классами, а не JS: до гидрации телефон уже
   видит короткий список, и страница не прыгает, когда скрипт догрузится. */
const COMPACT = "(max-width: 639.98px)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(COMPACT);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export default function Fold({
  title,
  titleClassName = "",
  children,
}: {
  title: string;
  titleClassName?: string;
  children: ReactNode;
}) {
  const compact = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(COMPACT).matches,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const id = useId();
  const shown = open || !compact;

  const row =
    "group/fold flex w-full items-center justify-between gap-5 px-7 py-5 text-left sm:p-0";
  const label = (
    <>
      <span className={titleClassName}>{title}</span>
      {/* Тот же знак «плюс → минус», что в FAQ. */}
      <span aria-hidden className="relative block h-4 w-4 shrink-0 sm:hidden">
        <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 bg-accent" />
        <span
          className={`absolute left-1/2 top-0 h-4 w-[1.5px] -translate-x-1/2 bg-accent transition-transform duration-200 ${
            open ? "scale-y-0" : "scale-y-100"
          }`}
        />
      </span>
    </>
  );

  return (
    <>
      <h3 className="h-card text-ink">
        {compact ? (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls={id}
            className={row}
          >
            {label}
          </button>
        ) : (
          <span className={row}>{label}</span>
        )}
      </h3>

      <div
        id={id}
        inert={!shown}
        className={`grid transition-[grid-template-rows,opacity] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none sm:grid-rows-[1fr] sm:opacity-100 ${
          open
            ? "grid-rows-[1fr] opacity-100 duration-[260ms]"
            : "grid-rows-[0fr] opacity-0 duration-[180ms]"
        }`}
      >
        <div className="min-h-0 overflow-hidden px-7 sm:overflow-visible sm:px-0">
          <div className="pb-7 sm:pb-0">{children}</div>
        </div>
      </div>
    </>
  );
}
