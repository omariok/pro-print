import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, siteUrl } from "@/lib/i18n";

const READ_METHODS = new Set(["GET", "HEAD"]);
/** Единственный адрес, который принимает POST: форма заявки. */
const POST_ALLOWED = new Set(["/api/request"]);
/** Страницы сайта без префикса языка. Всё остальное — 404. */
const PAGES = new Set(["/", "/about", "/contacts", "/legal", "/privacy"]);
const API = new Set(["/api/health", "/api/request"]);
const OG_CARD = "/opengraph-image/card";
/** Заранее собранная 404 каждого языка — см. [lang]/[...rest]/page.tsx. */
const NOT_FOUND = "/404";

const notFound = () => new NextResponse(null, { status: 404 });

/**
 * Сначала заслон от сканеров, затем языки.
 *
 * Сайт не использует Server Actions, поэтому запрос с заголовком Next-Action —
 * всегда проба уязвимости (волна React2Shell). Отвечаем 404 до того, как Next
 * возьмётся разбирать тело запроса: на этом разборе сервер уходил в 100 % CPU.
 * Изменяющие методы принимает только форма заявки.
 *
 * Языки: русский живёт без префикса — `/about` внутри переписывается на
 * `/ru/about`, а в строке браузера остаётся прежним. `/en/...` и `/zh/...` идут
 * как есть. Прямой заход на `/ru/...` уводим на адрес без префикса, чтобы у
 * русской страницы был один адрес.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // У сайта один адрес: www.pro-print.pro уводим на pro-print.pro, чтобы
  // поисковики не видели две копии.
  if (request.headers.get("host")?.startsWith("www.")) {
    return NextResponse.redirect(`${siteUrl}${pathname}${search}`, 308);
  }

  if (request.headers.has("next-action") || (!READ_METHODS.has(request.method) && !POST_ALLOWED.has(pathname))) {
    return new NextResponse(null, { status: 404 });
  }

  // Точка в первой части пути и что-то после неё (/a.php/b) — такого адреса на
  // сайте быть не может, а Next принял бы «a.php» за язык и стал рендерить.
  const first = pathname.split("/")[1];
  if (first.includes(".") && pathname.indexOf("/", 1) !== -1) return notFound();

  // Служебные адреса: только те, что реально есть. Выдуманные /api/x и
  // /_next/x иначе рендерились бы на сервере при каждом запросе.
  if (pathname.startsWith("/api/")) return API.has(pathname) ? NextResponse.next() : notFound();
  if (pathname.startsWith("/_next/")) return pathname === "/_next/image" ? NextResponse.next() : notFound();
  if (pathname === "/apple-icon") return NextResponse.next();
  // Файлы с расширением (PDF из /docs, icon.svg, robots.txt) идут как есть.
  if (pathname.includes(".")) return NextResponse.next();

  if (first === defaultLocale) {
    // Карточка ссылки русской страницы физически лежит под /ru.
    if (pathname === `/${defaultLocale}${OG_CARD}`) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  const lang = isLocale(first) ? first : defaultLocale;
  const rest = isLocale(first) ? pathname.slice(first.length + 1) || "/" : pathname;
  if (isLocale(first) && rest === OG_CARD) return NextResponse.next();

  // Любой неизвестный адрес получает готовую 404 своего языка с диска:
  // сканеры перебирают тысячи адресов, и рендер на каждый клал бы сервер.
  const url = request.nextUrl.clone();
  if (!PAGES.has(rest)) {
    url.pathname = `/${lang}${NOT_FOUND}`;
    return NextResponse.rewrite(url);
  }
  if (isLocale(first)) return NextResponse.next();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Заслон должен видеть каждый запрос; мимо идёт только статика сборки.
  // Косая черта в конце обязательна: без неё /_next/staticXYZ тоже шёл бы мимо.
  matcher: ["/((?!_next/static/).*)"],
};
