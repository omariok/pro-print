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
 * В конце письма — время, IP и редакция документов: это доказательство
 * согласия на обработку данных (ч. 3 ст. 9 152-ФЗ).
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

// Защита от потока заявок: не больше 5 с одного адреса за 10 минут и не
// больше 100 писем в час на весь сайт — потолок бережёт ящик, даже если
// атакуют с многих адресов, и с запасом выше любого реального потока заявок. Память процесса — этого хватает для одного
// экземпляра приложения.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const SITE_WINDOW_MS = 60 * 60 * 1000;
const SITE_MAX = 100;
const MAX_TRACKED = 10_000;
// Полная форма на китайском (3 байта на иероглиф) весит около 18 КБ.
const MAX_BODY_BYTES = 32 * 1024;
const hits = new Map<string, number[]>();
let siteHits: number[] = [];

function limited(ip: string) {
  const now = Date.now();
  siteHits = siteHits.filter((t) => now - t < SITE_WINDOW_MS);
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW || siteHits.length >= SITE_MAX) return true;
  recent.push(now);
  siteHits.push(now);
  hits.set(ip, recent);
  if (hits.size > MAX_TRACKED) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    if (hits.size > MAX_TRACKED) hits.clear();
  }
  return false;
}

/**
 * Адрес посетителя. Перед приложением стоит Caddy: X-Forwarded-For он
 * формирует сам, и последний адрес в нём — тот, кто к нему подключился.
 * X-Real-IP Caddy не ставит и пропускает от клиента как есть, поэтому он
 * только запасной вариант.
 */
function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  return (forwarded || request.headers.get("x-real-ip")?.trim() || "unknown").slice(0, 64);
}

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export async function POST(request: Request) {
  // Форма шлёт JSON из того же сайта. Запрос с чужой страницы (браузер
  // помечает его Sec-Fetch-Site: cross-site) или в другом формате не принимаем:
  // так посетителя чужого сайта не заставить отправить заявку от его имени.
  if (
    !request.headers.get("content-type")?.startsWith("application/json") ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Заполненная форма весит несколько килобайт: большое тело не читаем вовсе.
  // Браузер всегда указывает размер; запрос без него — не от формы.
  const declared = request.headers.get("content-length");
  if (declared === null) {
    return NextResponse.json({ ok: false, error: "length_required" }, { status: 411 });
  }
  if (Number(declared) > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  let data: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw) > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    data = parsed as Record<string, unknown>;
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

  // Лимит считаем только по заявкам, которые правда уйдут письмом: иначе бот
  // мусорными запросами выбрал бы общий потолок и закрыл форму для клиентов.
  const ip = clientIp(request);
  if (limited(ip)) {
    console.warn(`[api/request] лимит заявок, ip=${ip}`);
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
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

  console.info(`[api/request] заявка отправлена, ip=${ip}`);
  return NextResponse.json({ ok: true });
}
