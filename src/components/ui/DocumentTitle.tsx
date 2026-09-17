"use client";

import { useEffect } from "react";

/**
 * Заголовок вкладки для страницы 404. Next рисует её поверх корневого layout
 * уже в браузере и при этом возвращает вкладке заголовок главной из layout —
 * без этой поправки 404 выглядела бы во вкладке как главная страница.
 */
export default function DocumentTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return null;
}
