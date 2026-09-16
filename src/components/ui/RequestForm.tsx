"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
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
const optional = "ml-1.5 font-medium normal-case tracking-[0.04em] text-muted-soft";

type Props = {
  lang: Locale;
  t: Content["form"];
  site: Content["site"];
  className?: string;
};

export default function RequestForm({ lang, t, site, className = "" }: Props) {
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const successRef = useRef<HTMLParagraphElement>(null);
  const wasSent = useRef(false);

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
      // Бэкенда нет: имитируем отправку и показываем состояние успеха.
      // Когда появится /api/request, здесь будет fetch — и его ошибка
      // (сеть, ответ не 2xx) уйдёт в catch, а не в экран «отправлено».
      await new Promise((resolve) => setTimeout(resolve, 700));
      if (process.env.NODE_ENV === "development") {
        console.info("Заявка:", values);
      }
      reset();
      setSent(true);
    } catch {
      setFailed(true);
    }
  };

  return (
    <div className={`relative rounded-panel border border-line bg-card p-6 sm:p-8 lg:p-10 ${className}`}>
      <AnimatePresence>
        {sent ? (
          <motion.div
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
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* noValidate: проверку ведёт react-hook-form, поэтому обязательность
          сообщается скринридеру через aria-required, а ошибки — role="alert".
          Под экраном успеха форма inert: иначе Tab уводил бы в невидимые поля. */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate inert={sent}>
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-x-6">
          <div>
            <label className={label} htmlFor="rf-name">
              {t.name.label}
            </label>
            <input
              id="rf-name"
              autoComplete="name"
              aria-required="true"
              type="text"
              placeholder={t.name.placeholder}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "rf-name-error" : undefined}
              className={`${field} ${errors.name ? bad : ok}`}
              {...register("name", {
                required: t.name.required,
                minLength: { value: 2, message: t.name.tooShort },
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
              autoComplete="organization"
              aria-required="true"
              type="text"
              placeholder={t.company.placeholder}
              aria-invalid={Boolean(errors.company)}
              aria-describedby={errors.company ? "rf-company-error" : undefined}
              className={`${field} ${errors.company ? bad : ok}`}
              {...register("company", { required: t.company.required })}
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
                pattern: {
                  value: /^\+?[0-9\s()-]{10,20}$/,
                  message: t.phone.invalid,
                },
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

          <div>
            <label className={label} htmlFor="rf-volume">
              {t.volume.label} <span className={optional}>{t.optional}</span>
            </label>
            <input
              id="rf-volume"
              type="text"
              placeholder={t.volume.placeholder}
              className={`${field} ${ok}`}
              {...register("volume")}
            />
          </div>

          <div>
            <label className={label} htmlFor="rf-machine">
              {t.machine.label} <span className={optional}>{t.optional}</span>
            </label>
            <input
              id="rf-machine"
              type="text"
              placeholder={t.machine.placeholder}
              className={`${field} ${ok}`}
              {...register("machine")}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={label} htmlFor="rf-artwork">
              {t.artwork.label} <span className={optional}>{t.optional}</span>
            </label>
            <input
              id="rf-artwork"
              type="text"
              placeholder={t.artwork.placeholder}
              className={`${field} ${ok}`}
              {...register("artwork")}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={label} htmlFor="rf-comment">
              {t.comment.label} <span className={optional}>{t.optional}</span>
            </label>
            <textarea
              id="rf-comment"
              rows={4}
              placeholder={t.comment.placeholder}
              className={`${field} ${ok} resize-y`}
              {...register("comment")}
            />
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
              href={localizeHref(lang, "/privacy")}
              className="text-[var(--accent-text)] underline underline-offset-2"
            >
              {t.consentLink}
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
