import { notFound } from "next/navigation";

/**
 * Страница 404 на каждом языке: not-found.tsx внутри шапки и подвала. Без
 * этого Next отдал бы свою голую 404 — корневого layout над [lang] нет.
 *
 * Собирается заранее только по адресу /{lang}/404, и middleware подменяет на
 * него любой неизвестный адрес: сервер отдаёт готовый файл, а не рендерит
 * страницу на каждый запрос сканера.
 */
export function generateStaticParams() {
  return [{ rest: ["404"] }];
}

export default function CatchAll() {
  notFound();
}
