import { NextResponse } from "next/server";
import { contactInfo } from "@/lib/content/contact-info";
import { legalInfo } from "@/lib/content/legal-info";
import { sendMail } from "@/lib/mail/smtp";
import { siteUrl } from "@/lib/i18n";

/**
 * Заявка с формы → письмо на почту компании.
 *
 * Переменные окружения (в Timeweb Cloud — в настройках приложения):
 *   SMTP_USER  ящик, от имени которого уходит письмо (например, pr0print@yandex.ru)
 *   SMTP_PASS  пароль приложения Яндекса для этого ящика
 *   SMTP_HOST  по умолчанию smtp.yandex.ru
 *   SMTP_PORT  по умолчанию 465
 *   MAIL_TO    куда слать заявки, по умолчанию pr0print@yandex.ru
 *
 * В письмо попадают время, IP, браузер и редакция документов: это
 * доказательство согласия на обработку данных (ч. 3 ст. 9 152-ФЗ).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limits = {
  name: 120,
  company: 200,
  phone: 40,
  email: 200,
  volume: 300,
  machine: 300,
  artwork: 1000,
  comment: 4000,
} as const;
type Field = keyof typeof limits;

const labels: Record<Field, string> = {
  name: "Имя",
  company: "Компания",
  phone: "Телефон",
  email: "E-mail",
  volume: "Объём и параметры",
  machine: "Упаковочная машина",
  artwork: "Макет",
  comment: "Комментарий",
};

// Защита от потока заявок: не больше 5 с одного адреса за 10 минут.
// Память процесса — этого хватает для одного экземпляра приложения.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
  }
  return recent.length > MAX_PER_WINDOW;
}

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // Бот заполнил скрытое поле или отправил форму быстрее человека: отвечаем «успешно» и ничего не шлём.
  const startedAt = Number(data.startedAt);
  if (str(data.website) || !startedAt || Date.now() - startedAt < 3000) {
    return NextResponse.json({ ok: true });
  }

  const ip = (request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown").trim();
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const values = {} as Record<Field, string>;
  for (const field of Object.keys(limits) as Field[]) {
    const value = str(data[field]);
    if (value.length > limits[field]) {
      return NextResponse.json({ ok: false, error: `too_long:${field}` }, { status: 400 });
    }
    values[field] = value;
  }

  if (
    values.name.length < 2 ||
    !values.company ||
    !/^\+?[0-9\s()-]{10,20}$/.test(values.phone) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)
  ) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  if (data.consent !== true) {
    return NextResponse.json({ ok: false, error: "no_consent" }, { status: 400 });
  }

  const lang = ["ru", "en", "zh"].includes(str(data.lang)) ? str(data.lang) : "ru";
  const prefix = lang === "ru" ? "" : `/${lang}`;
  const now = new Date();
  const moscow = now.toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });

  const text = [
    "Новая заявка с сайта",
    "",
    ...(Object.keys(labels) as Field[]).map((field) => `${labels[field]}: ${values[field] || "—"}`),
    "",
    "— Согласие на обработку персональных данных —",
    "Дано: да (отмечено поле согласия в форме)",
    `Время: ${moscow} МСК (${now.toISOString()})`,
    `IP: ${ip}`,
    `Браузер: ${str(request.headers.get("user-agent")).slice(0, 400) || "—"}`,
    `Страница: ${str(data.page).slice(0, 500) || "—"}`,
    `Язык сайта: ${lang}`,
    `Редакция документов: ${legalInfo.version}`,
    `Текст согласия: ${siteUrl}${prefix}/legal#consent`,
    `Политика: ${siteUrl}${prefix}/privacy`,
  ].join("\n");

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    if (process.env.NODE_ENV === "development") {
      console.info(`[api/request] SMTP не настроен, письмо не отправлено:\n${text}`);
      return NextResponse.json({ ok: true, dev: true });
    }
    console.error("[api/request] SMTP_USER или SMTP_PASS не заданы");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  try {
    await sendMail(
      {
        host: process.env.SMTP_HOST || "smtp.yandex.ru",
        port: Number(process.env.SMTP_PORT) || 465,
        user,
        pass,
      },
      {
        from: user,
        to: process.env.MAIL_TO || contactInfo.email,
        replyTo: values.email,
        subject: `Заявка с сайта: ${values.company} — ${values.name}`.replace(/[\r\n]/g, " "),
        text,
      },
    );
  } catch (error) {
    console.error("[api/request] письмо не отправлено:", error);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
