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
  // Время с открытия формы меряет браузер по своим часам: сверка с часами
  // сервера отбросила бы заявку человека, у которого часы спешат.
  const elapsed = Number(data.elapsed);
  if (str(data.website) || !Number.isFinite(elapsed) || elapsed < 3000) {
    return NextResponse.json({ ok: true });
  }

  // X-Real-IP ставит nginx; в X-Forwarded-For первый адрес пишет сам клиент,
  // поэтому доверяем только последнему — его добавил наш прокси.
  const ip = (
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",").at(-1) ||
    "unknown"
  ).trim();
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

  // Необязательные пустые поля в письмо не попадают: менеджер видит только суть.
  const filled = (Object.keys(labels) as Field[]).filter((field) => values[field]);
  const text = [
    "Новая заявка с сайта",
    "",
    ...filled.map((field) => `${labels[field]}: ${values[field]}`),
    "",
    // Краткое доказательство согласия (ч. 3 ст. 9 152-ФЗ): когда, с какой
    // редакцией документов и с какого адреса отмечено поле согласия.
    `Согласие на обработку ПДн дано: ${moscow} МСК, редакция ${legalInfo.version}, IP ${ip}`,
    `Текст согласия: ${siteUrl}${prefix}/legal#consent`,
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
