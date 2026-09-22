import type { Locale } from "../i18n";

/**
 * Тексты экранов сбоя. Лежат отдельно от словарей: error.tsx и
 * global-error.tsx — клиентские и не получают props от сервера, поэтому
 * тянут в бандл только эти несколько строк на всех языках.
 */
export const errorTexts: Record<
  Locale,
  {
    pageTitle: string;
    pageLede: string;
    retry: string;
    home: string;
    manualBefore: string;
    manualEmail: string;
    /** Хвост фразы с режимом работы — повторяет site.schedule из словаря. */
    manualAfter: string;
    digest: string;
    siteTitle: string;
    siteLede: string;
  }
> = {
  ru: {
    pageTitle: "Страница не загрузилась",
    pageLede:
      "Ошибка на нашей стороне, а не в ваших действиях. Обычно помогает повторная загрузка — данные формы при этом не сохраняются, их придётся ввести заново.",
    retry: "Загрузить ещё раз",
    home: "На главную",
    manualBefore: "Нужен расчёт прямо сейчас — заявку примем вручную. Телефон ",
    manualEmail: ", почта ",
    manualAfter: ". Пн–Пт, 09:00–18:00 (МСК).",
    digest: "Код обращения:",
    siteTitle: "Сайт не загрузился",
    siteLede:
      "Ошибка на нашей стороне. Попробуйте загрузить страницу ещё раз, а если нужен расчёт прямо сейчас — позвоните, заявку примем вручную.",
  },
  en: {
    pageTitle: "The page didn’t load",
    pageLede:
      "The error is on our side, not yours. Reloading usually helps — form data won’t be kept, so you’ll need to enter it again.",
    retry: "Try again",
    home: "Home page",
    manualBefore: "Need a quote right now? We’ll take your request by hand. Phone ",
    manualEmail: ", email ",
    manualAfter: ". Mon–Fri, 09:00–18:00 Moscow time (UTC+3).",
    digest: "Reference code:",
    siteTitle: "The site didn’t load",
    siteLede:
      "The error is on our side. Try loading the page again, and if you need a quote right now, call us — we’ll take your request by hand.",
  },
  zh: {
    pageTitle: "页面加载失败",
    pageLede: "这是我们这边的错误，与您的操作无关。通常重新加载即可解决，但表单内容不会保留，需要重新填写。",
    retry: "重新加载",
    home: "返回首页",
    manualBefore: "急需报价？我们可以人工受理。电话 ",
    manualEmail: "，邮箱 ",
    manualAfter: "。工作时间：周一至周五 09:00–18:00（莫斯科时间，UTC+3）。",
    digest: "错误代码：",
    siteTitle: "网站加载失败",
    siteLede: "这是我们这边的错误。请尝试重新加载页面；如急需报价，请直接致电，我们将人工受理。",
  },
};
