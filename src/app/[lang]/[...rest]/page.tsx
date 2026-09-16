import { notFound } from "next/navigation";

/**
 * Ловит любой адрес, которому нет страницы, и показывает not-found.tsx внутри
 * шапки и подвала на нужном языке. Без этого Next отдал бы свою голую 404:
 * корневого layout над [lang] нет.
 */
export default function CatchAll() {
  notFound();
}
