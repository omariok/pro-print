import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n";

/**
 * Русский живёт без префикса: `/about` внутри переписывается на `/ru/about`,
 * а в строке браузера остаётся прежним. `/en/...` и `/zh/...` идут как есть.
 * Прямой заход на `/ru/...` уводим на адрес без префикса, чтобы у русской
 * страницы был один адрес. Язык запроса кладём в заголовок x-locale: его
 * читает страница 404, которой Next не передаёт params.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  // Карточка ссылки русской страницы физически лежит под /ru — её не трогаем.
  if (first === defaultLocale && pathname.includes("/opengraph-image")) {
    return withLocale(request, defaultLocale);
  }

  if (first === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (isLocale(first)) return withLocale(request, first);

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return withLocale(request, defaultLocale, url);
}

function withLocale(request: NextRequest, locale: string, rewriteTo?: URL) {
  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);
  return rewriteTo
    ? NextResponse.rewrite(rewriteTo, { request: { headers } })
    : NextResponse.next({ request: { headers } });
}

export const config = {
  // Мимо middleware: служебные файлы Next, иконки и всё, у чего есть расширение
  // (PDF из /docs, icon.svg).
  matcher: ["/((?!_next/|api/|apple-icon|.*\\..*).*)"],
};
