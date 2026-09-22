import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n";

const READ_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
/** Единственный адрес, который принимает POST: форма заявки. */
const POST_ALLOWED = new Set(["/api/request"]);

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
  const { pathname } = request.nextUrl;

  if (request.headers.has("next-action") || (!READ_METHODS.has(request.method) && !POST_ALLOWED.has(pathname))) {
    return new NextResponse(null, { status: 404 });
  }

  // Дальше только страницы: API, служебные файлы Next, иконки и всё, у чего
  // есть расширение (PDF из /docs, icon.svg), идут как есть.
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/") || pathname.startsWith("/apple-icon") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const first = pathname.split("/")[1];

  // Карточка ссылки русской страницы физически лежит под /ru — её не трогаем.
  if (first === defaultLocale && pathname.includes("/opengraph-image")) {
    return NextResponse.next();
  }

  if (first === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (isLocale(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Заслон должен видеть каждый запрос; мимо идут только статика и картинки —
  // самые частые и заведомо безопасные.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
