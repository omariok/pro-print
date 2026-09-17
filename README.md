# Про-Принт — сайт производства пищевых плёнок

Next.js 15 (App Router) + React 19 + Tailwind CSS v4 + Framer Motion, шар в Hero — three.js. Без UI-библиотек: компоненты и декоративная графика (CMYK-волны, кольца, растр, сетка приводки) написаны вручную на SVG/CSS.

Дизайн-система целиком описана в [`DESIGN.md`](DESIGN.md) — правила цвета, типографики, форм и навигации смотрите там, этот файл только про устройство проекта.

## Запуск

```bash
npm install
npm run dev
```

Сборка: `npm run build`, продакшн-запуск: `npm start`.

## Структура

```
src/
  middleware.ts         русский без префикса (/about → /ru/about внутри), /en и /zh как есть
  app/
    [lang]/             все страницы под языковым сегментом (ru, en, zh)
      layout.tsx        шрифты (Manrope + Onest), метаданные и hreflang, Header/Footer, запасной показ Reveal без JS
      page.tsx          главная: Hero → Capabilities → Pvc → Examples → Advantages → Metrics
                        → Production → Process → Documents → Faq → ContactForm
      about/page.tsx    «О компании»
      contacts/page.tsx «Контакты» + форма заявки
      privacy/page.tsx  политика обработки ПДн (152-ФЗ)
      [...rest]/        любой несуществующий адрес → not-found.tsx на нужном языке
      error.tsx, not-found.tsx, opengraph-image.tsx
    global-error.tsx
    globals.css         дизайн-система: токены @theme, .shell, .h-section, анимации, правила для китайского
  components/
    layout/             Header (плавающая плашка, scroll-spy, мобильная шторка), LanguageSwitcher, Footer
    sections/           секции страниц
    ui/                 Button, Fold, Logo, Icons, RegisterMark, Reveal, SectionHead,
                        RequestForm, VideoBackground
    graphics/           HeroOrb + orbScene (three.js), CmykRings, CmykWaves, Halftone, TrayMock, Aurora
  lib/
    i18n.ts             список языков, ссылки с префиксом языка, hreflang
    content/            весь текст сайта: ru.ts (основной, задаёт форму), en.ts, zh.ts;
                        errors.ts — экраны сбоя, contact-info.ts — телефон и почта
public/docs/            ТУ, протокол испытаний, декларация ЕАЭС (PDF)
```

## Фотографии в «Примерах»

Снимки лежат в `public/examples/` (WebP 1536×1024, ~200 КБ), пути и подписи — в `examples.items` в `src/lib/content/*.ts`. Первый снимок главный: от xl он стоит крупно слева, два других — столбиком справа. Новое фото сжимайте до WebP той же ширины (sharp уже есть в `node_modules` вместе с Next) и держите пропорцию 3:2 — под неё подобрана сетка. Пустой `src` показывает заглушку «Фотография готовится».

## Видео-подложка

`VideoBackground` сейчас нигде не подключён (в Hero стоит шар). Без `src` он рисует светлую подложку `Aurora`, с `src` — ролик, который начинает грузиться только когда секция въехала в экран (`preload="none"`), а при `prefers-reduced-motion` не грузится вовсе:

```tsx
<VideoBackground src="/hero.mp4" poster="/hero.jpg" grid />
```

## Форма заявки

`src/components/ui/RequestForm.tsx` — React Hook Form с валидацией (имя, компания, телефон, e-mail, согласие 152-ФЗ). **Бэкенда нет:** `onSubmit` имитирует отправку и показывает экран успеха. Для реального приёма заявок замените имитацию на `fetch("/api/request", …)` — ветка ошибки (`failed`) и сообщение с телефоном уже готовы.

## Палитра

Кремовая бумага `#fdf6e3`, графитовый текст `#233038`, единственный акцент — оранжевый `#ff5b04` (для текста — `#b53c00`). Голубой, пурпурный и жёлтый живут только в знаке логотипа и в графике шара. Токены — в `@theme` в `globals.css`, расшифровка — в `DESIGN.md`.

## Адаптив и анимации

Брейкпоинты Tailwind + собственный `xs` (26rem). Появление блоков — компонент `Reveal` (общий IntersectionObserver, один раз); если скрипты не запустились, контент всё равно показывается через `<noscript>` и 4-секундный запасной таймер. Декоративные анимации отключаются при `prefers-reduced-motion`.
