"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, m } from "framer-motion";
import type { Content } from "@/lib/content";
import { contactInfo } from "@/lib/content/contact-info";
import { fill, localizeHref, type Locale } from "@/lib/i18n";
import { CheckIcon } from "./Icons";
import RegisterMark from "./RegisterMark";

type Values = {
  name: string;
  company: string;
  phone: string;
  email: string;
  volume: string;
  machine: string;
  artwork: string;
  comment: string;
  consent: boolean;
};

const label =
  "block font-display text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/72";
const field =
  "mt-2.5 w-full rounded-tile border bg-card px-4 py-3.5 text-[15px] text-ink placeholder:text-muted-soft transition-colors duration-200 focus:outline-none focus:ring-0";
const ok = "border-line-input focus:border-ink";
const bad = "border-accent focus:border-accent";
const errorText = "mt-1.5 block text-[12.5px] text-[var(--accent-text)]";
/** Совпадает с порогом анти-бот проверки в /api/request (3 с) плюс запас. */
const MIN_FILL_MS = 3100;

type Props = {
  lang: Locale;
  t: Content["form"];
  site: Content["site"];
  className?: string;
};

export default function RequestForm({ lang, t, site, className = "" }: Props) {
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailsId = useId();
  const successRef = useRef<HTMLParagraphElement>(null);
  const wasSent = useRef(false);
  // Когда форму открыли: заявку, отправленную быстрее человека, сервер молча отбросит.
  // performance.now() не зависит от того, верно ли выставлены часы устройства.
  const startedAt = useRef(0);
  const trap = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startedAt.current = performance.now();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      company: "",
      phone: "",
      email: "",
      volume: "",
      machine: "",
      artwork: "",
      comment: "",
      consent: false,
    },
  });

  // Экран успеха перекрывает форму, и фокус остался бы на кнопке под ним:
  // переносим его на заголовок, чтобы клавиатура и скринридер оказались там
  // же, где глаза. После «Отправить ещё одну» — обратно в первое поле.
  useEffect(() => {
    if (sent) successRef.current?.focus();
    else if (wasSent.current) setFocus("name");
    wasSent.current = sent;
  }, [sent, setFocus]);

  const onSubmit = async (values: Values) => {
    setFailed(false);
    try {
      // Сервер молча отбрасывает заявки быстрее 3 секунд как ботов. Человек с
      // автозаполнением успевает и раньше — придерживаем отправку, а не теряем её.
      const wait = MIN_FILL_MS - (performance.now() - startedAt.current);
      if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
      // Ошибка сети или ответ не 2xx уходят в catch, а не в экран «отправлено».
      const response = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          lang,
          website: trap.current?.value ?? "",
          elapsed: Math.round(performance.now() - startedAt.current),
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      reset();
      setDetailsOpen(false);
      startedAt.current = performance.now();
      setSent(true);
    } catch {
      setFailed(true);
    }
  };

  return (
    <div className={`relative rounded-panel border border-line bg-card p-6 sm:p-8 lg:p-10 ${className}`}>
      <AnimatePresence>
        {sent ? (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="status"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 rounded-panel bg-card px-8 text-center"
          >
            <RegisterMark />
            <div>
              <p
                ref={successRef}
                tabIndex={-1}
                className="font-display text-[23px] font-extrabold tracking-[-0.024em] text-ink outline-none"
              >
                {t.successTitle}
              </p>
              <p className="mx-auto mt-3 max-w-[38ch] text-[15px] leading-[1.6] text-muted">
                {fill(t.successText, { schedule: site.schedule, phone: contactInfo.phone })}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="font-display text-[14px] font-bold text-[var(--accent-text)] underline underline-offset-4 transition-colors hover:text-ink"
            >
              {t.again}
            </button>
          </m.div>
        ) : null}
      </AnimatePresence>

      {/* noValidate: проверку ведёт react-hook-form, поэтому обязательность
          сообщается скринридеру через aria-required, а ошибки — role="alert".
          Под экраном успеха форма inert: иначе Tab уводил бы в невидимые поля. */}
      <form method="post" onSubmit={handleSubmit(onSubmit)} noValidate inert={sent}>
        {/* Ловушка для ботов: человек это поле не видит и не заполняет. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="rf-website">Website</label>
          <input ref={trap} id="rf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-x-6">
          <div>
            <label className={label} htmlFor="rf-name">
              {t.name.label}
            </label>
            <input
              id="rf-name"
              maxLength={120}
              autoComplete="name"
              aria-required="true"
              type="text"
              placeholder={t.name.placeholder}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "rf-name-error" : undefined}
              className={`${field} ${errors.name ? bad : ok}`}
              {...register("name", {
                required: t.name.required,
                // Сервер обрезает пробелы по краям — проверяем так же, чтобы
                // «  а» не проходило форму и не падало ошибкой отправки.
                validate: (v) => v.trim().length >= 2 || t.name.tooShort,
              })}
            />
            {errors.name ? (
              <span id="rf-name-error" role="alert" className={errorText}>
                {errors.name.message}
              </span>
            ) : null}
          </div>

          <div>
            <label className={label} htmlFor="rf-company">
              {t.company.label}
            </label>
            <input
              id="rf-company"
              maxLength={200}
              autoComplete="organization"
              aria-required="true"
              type="text"
              placeholder={t.company.placeholder}
              aria-invalid={Boolean(errors.company)}
              aria-describedby={errors.company ? "rf-company-error" : undefined}
              className={`${field} ${errors.company ? bad : ok}`}
              {...register("company", {
                required: t.company.required,
                validate: (v) => v.trim() !== "" || t.company.required,
              })}
            />
            {errors.company ? (
              <span id="rf-company-error" role="alert" className={errorText}>
                {errors.company.message}
              </span>
            ) : null}
          </div>

          <div>
            <label className={label} htmlFor="rf-phone">
              {t.phone.label}
            </label>
            <input
              id="rf-phone"
              autoComplete="tel"
              aria-required="true"
              type="tel"
              inputMode="tel"
              placeholder={t.phone.placeholder}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "rf-phone-error" : undefined}
              className={`${field} ${errors.phone ? bad : ok}`}
              {...register("phone", {
                required: t.phone.required,
                // Сервер проверяет номер уже без пробелов по краям — так же и здесь.
                validate: (value) => /^\+?[0-9\s()-]{10,20}$/.test(value.trim()) || t.phone.invalid,
              })}
            />
            {errors.phone ? (
              <span id="rf-phone-error" role="alert" className={errorText}>
                {errors.phone.message}
              </span>
            ) : null}
          </div>

          <div>
            <label className={label} htmlFor="rf-email">
              {t.email.label}
            </label>
            <input
              id="rf-email"
              maxLength={200}
              autoComplete="email"
              aria-required="true"
              type="email"
              placeholder={t.email.placeholder}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "rf-email-error" : undefined}
              className={`${field} ${errors.email ? bad : ok}`}
              {...register("email", {
                required: t.email.required,
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                  message: t.email.invalid,
                },
              })}
            />
            {errors.email ? (
              <span id="rf-email-error" role="alert" className={errorText}>
                {errors.email.message}
              </span>
            ) : null}
          </div>

        </div>

        {/* Необязательные поля свёрнуты: заявке хватает четырёх полей выше,
            подробности клиент добавит, если захочет. Поля остаются в разметке
            (свёрнутые — inert), поэтому введённое не теряется, если блок
            закрыть, и уходит вместе с заявкой. Раскрытие — как в FAQ и Fold. */}
        <div className="mt-7 border-y border-line">
          <button
            type="button"
            onClick={() => setDetailsOpen(!detailsOpen)}
            aria-expanded={detailsOpen}
            aria-controls={detailsId}
            className="group flex w-full items-center justify-between gap-5 py-4 text-left"
          >
            <span className="min-w-0">
              <span
                className={`block font-display text-[15px] font-bold tracking-[-0.015em] transition-colors duration-200 ${
                  detailsOpen ? "text-[var(--accent-text)]" : "text-ink group-hover:text-[var(--accent-text)]"
                }`}
              >
                {t.details}
              </span>
              <span className="mt-1 block text-[13px] leading-[1.45] text-muted">{t.detailsHint}</span>
            </span>
            <span aria-hidden className="relative block h-4 w-4 shrink-0">
              <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 bg-accent" />
              <span
                className={`absolute left-1/2 top-0 h-4 w-[1.5px] -translate-x-1/2 bg-accent transition-transform duration-200 ${
                  detailsOpen ? "scale-y-0" : "scale-y-100"
                }`}
              />
            </span>
          </button>

          <div
            id={detailsId}
            inert={!detailsOpen}
            className={`grid transition-[grid-template-rows,opacity] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
              detailsOpen
                ? "grid-rows-[1fr] opacity-100 duration-[260ms]"
                : "grid-rows-[0fr] opacity-0 duration-[180ms]"
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="grid gap-5 pb-6 pt-1 sm:grid-cols-2 sm:gap-x-6">
                <div>
                  <label className={label} htmlFor="rf-volume">
                    {t.volume.label}
                  </label>
                  <input
                    id="rf-volume"
                    type="text"
                    maxLength={300}
                    placeholder={t.volume.placeholder}
                    className={`${field} ${ok}`}
                    {...register("volume")}
                  />
                </div>

                <div>
                  <label className={label} htmlFor="rf-machine">
                    {t.machine.label}
                  </label>
                  <input
                    id="rf-machine"
                    type="text"
                    maxLength={300}
                    placeholder={t.machine.placeholder}
                    className={`${field} ${ok}`}
                    {...register("machine")}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={label} htmlFor="rf-artwork">
                    {t.artwork.label}
                  </label>
                  <input
                    id="rf-artwork"
                    type="text"
                    maxLength={1000}
                    placeholder={t.artwork.placeholder}
                    className={`${field} ${ok}`}
                    {...register("artwork")}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={label} htmlFor="rf-comment">
                    {t.comment.label}
                  </label>
                  <textarea
                    id="rf-comment"
                    rows={4}
                    maxLength={4000}
                    placeholder={t.comment.placeholder}
                    className={`${field} ${ok} resize-y`}
                    {...register("comment")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <label className="mt-7 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="peer sr-only"
            aria-required="true"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "rf-consent-error" : undefined}
            {...register("consent", { required: t.consentRequired })}
          />
          <span
            className={`mt-[2px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[6px] border transition-colors duration-200 peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent peer-checked:[&_svg]:opacity-100 ${
              errors.consent ? "border-accent" : "border-line-input"
            }`}
          >
            <CheckIcon className="h-3 w-3 text-ink-deep opacity-0 transition-opacity duration-200" />
          </span>
          <span className="text-[13.5px] leading-[1.5] text-muted">
            {t.consentBefore}
            <Link
              href={localizeHref(lang, "/legal#consent")}
              target="_blank"
              className="text-[var(--accent-text)] underline underline-offset-2"
            >
              {t.consentLink}
            </Link>
            {t.consentMiddle}
            <Link
              href={localizeHref(lang, "/privacy")}
              target="_blank"
              className="text-[var(--accent-text)] underline underline-offset-2"
            >
              {t.consentPolicyLink}
            </Link>
            {t.consentAfter}
          </span>
        </label>
        {errors.consent ? (
          <span id="rf-consent-error" role="alert" className={errorText}>
            {errors.consent.message}
          </span>
        ) : null}

        <p className="mt-6 text-[13.5px] leading-[1.55] text-muted">
          {fill(t.next, { schedule: site.schedule })}
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full rounded-pill bg-accent py-4 font-display text-[15px] font-bold text-ink-deep press hover:bg-accent-hover active:scale-[0.97] disabled:cursor-wait disabled:opacity-70"
        >
          {isSubmitting ? t.submitting : t.submit}
        </button>

        {failed ? (
          <p role="alert" className="mt-4 text-[13.5px] leading-[1.5] text-[var(--accent-text)]">
            {t.failed}
            <a href={contactInfo.phoneHref} className="font-semibold underline underline-offset-2">
              {contactInfo.phone}
            </a>
            {t.failedAfter}
          </p>
        ) : null}

        <p className="mt-4 text-[13.5px] leading-[1.5] text-muted">
          {t.emailBefore}
          <a
            href={`mailto:${contactInfo.email}`}
            className="text-ink underline decoration-line-strong underline-offset-2 transition-colors hover:text-[var(--accent-text)]"
          >
            {contactInfo.email}
          </a>
        </p>
      </form>
    </div>
  );
}
