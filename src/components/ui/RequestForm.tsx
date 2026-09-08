"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/lib/content";
import { CheckIcon } from "./Icons";

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
  "mt-2.5 w-full border bg-white px-4 py-3.5 text-[15px] text-ink placeholder:text-muted-soft/85 transition-colors duration-200 focus:outline-none focus:ring-0";
const ok = "border-line-strong focus:border-ink";
const bad = "border-cmyk-pink focus:border-cmyk-pink";
const errorText = "mt-1.5 block text-[12.5px] text-cmyk-pink";

export default function RequestForm({ className = "" }: { className?: string }) {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
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

  const onSubmit = async (values: Values) => {
    // Бэкенда нет: имитируем отправку и показываем состояние успеха.
    await new Promise((resolve) => setTimeout(resolve, 700));
    if (process.env.NODE_ENV === "development") {
      console.info("Заявка:", values);
    }
    reset();
    setSent(true);
  };

  return (
    <div className={`relative border border-line bg-white p-6 sm:p-8 lg:p-10 ${className}`}>
      <AnimatePresence>
        {sent ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-white px-8 text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cmyk-pink/10">
              <CheckIcon className="h-7 w-7 text-cmyk-pink" />
            </span>
            <div>
              <p className="font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink">
                Заявка отправлена
              </p>
              <p className="mx-auto mt-3 max-w-[38ch] text-[15px] leading-[1.6] text-muted">
                Менеджер отдела продаж перезвонит в рабочее время и уточнит параметры тиража.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="font-display text-[14px] font-bold text-cmyk-pink underline underline-offset-4 transition-colors hover:text-ink"
            >
              Отправить ещё одну
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-x-6">
          <div>
            <label className={label} htmlFor="rf-name">
              Имя *
            </label>
            <input
              id="rf-name"
              type="text"
              placeholder="Как к вам обращаться"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "rf-name-error" : undefined}
              className={`${field} ${errors.name ? bad : ok}`}
              {...register("name", {
                required: "Укажите имя",
                minLength: { value: 2, message: "Слишком короткое имя" },
              })}
            />
            {errors.name ? (
              <span id="rf-name-error" className={errorText}>
                {errors.name.message}
              </span>
            ) : null}
          </div>

          <div>
            <label className={label} htmlFor="rf-company">
              Компания *
            </label>
            <input
              id="rf-company"
              type="text"
              placeholder="Название предприятия"
              aria-invalid={Boolean(errors.company)}
              aria-describedby={errors.company ? "rf-company-error" : undefined}
              className={`${field} ${errors.company ? bad : ok}`}
              {...register("company", { required: "Укажите компанию" })}
            />
            {errors.company ? (
              <span id="rf-company-error" className={errorText}>
                {errors.company.message}
              </span>
            ) : null}
          </div>

          <div>
            <label className={label} htmlFor="rf-phone">
              Телефон *
            </label>
            <input
              id="rf-phone"
              type="tel"
              inputMode="tel"
              placeholder="+7 ..."
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "rf-phone-error" : undefined}
              className={`${field} ${errors.phone ? bad : ok}`}
              {...register("phone", {
                required: "Укажите телефон",
                pattern: {
                  value: /^\+?[0-9\s()-]{10,20}$/,
                  message: "Проверьте номер телефона",
                },
              })}
            />
            {errors.phone ? (
              <span id="rf-phone-error" className={errorText}>
                {errors.phone.message}
              </span>
            ) : null}
          </div>

          <div>
            <label className={label} htmlFor="rf-email">
              E-mail *
            </label>
            <input
              id="rf-email"
              type="email"
              placeholder="name@company.ru"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "rf-email-error" : undefined}
              className={`${field} ${errors.email ? bad : ok}`}
              {...register("email", {
                required: "Укажите e-mail",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                  message: "Проверьте адрес почты",
                },
              })}
            />
            {errors.email ? (
              <span id="rf-email-error" className={errorText}>
                {errors.email.message}
              </span>
            ) : null}
          </div>

          <div>
            <label className={label} htmlFor="rf-volume">
              Объём и параметры
            </label>
            <input
              id="rf-volume"
              type="text"
              placeholder="Напр.: 500 рулонов, 15 мкм, 400 мм"
              className={`${field} ${ok}`}
              {...register("volume")}
            />
          </div>

          <div>
            <label className={label} htmlFor="rf-machine">
              Упаковочная машина
            </label>
            <input
              id="rf-machine"
              type="text"
              placeholder="Модель автомата или «ручная упаковка»"
              className={`${field} ${ok}`}
              {...register("machine")}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={label} htmlFor="rf-artwork">
              Ссылка на макет
            </label>
            <input
              id="rf-artwork"
              type="text"
              placeholder="Облачная ссылка или «макета нет»"
              className={`${field} ${ok}`}
              {...register("artwork")}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={label} htmlFor="rf-comment">
              Комментарий
            </label>
            <textarea
              id="rf-comment"
              rows={4}
              placeholder="Задача, сроки, особенности продукта"
              className={`${field} ${ok} resize-y`}
              {...register("comment")}
            />
          </div>
        </div>

        <label className="mt-7 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="peer sr-only"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "rf-consent-error" : undefined}
            {...register("consent", { required: "Требуется согласие" })}
          />
          <span
            className={`mt-[2px] flex h-[18px] w-[18px] shrink-0 items-center justify-center border transition-colors duration-200 peer-checked:border-cmyk-pink peer-checked:bg-cmyk-pink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cmyk-pink ${
              errors.consent ? "border-cmyk-pink" : "border-line-strong"
            }`}
          >
            <CheckIcon className="h-3 w-3 text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100" />
          </span>
          <span className="text-[13.5px] leading-[1.5] text-muted">
            Согласен на обработку персональных данных в соответствии с 152-ФЗ и{" "}
            <Link href="/privacy" className="text-cmyk-pink underline underline-offset-2">
              политикой обработки персональных данных
            </Link>
            .
          </span>
        </label>
        {errors.consent ? (
          <span id="rf-consent-error" className={errorText}>
            {errors.consent.message}
          </span>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-7 w-full bg-cmyk-pink-deep py-4 font-display text-[15px] font-bold text-white transition-colors duration-300 hover:bg-cmyk-pink disabled:cursor-wait disabled:opacity-70"
        >
          {isSubmitting ? "Отправляем…" : "Отправить заявку"}
        </button>

        <p className="mt-4 text-[13.5px] leading-[1.5] text-muted">
          Или отправьте макет и параметры напрямую на{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-ink underline decoration-line-strong underline-offset-2 transition-colors hover:text-cmyk-pink"
          >
            {site.email}
          </a>
        </p>
      </form>
    </div>
  );
}
