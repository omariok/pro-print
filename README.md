# Про-Принт — сайт производства пищевых плёнок

Next.js 15 (App Router) + Tailwind CSS v4 + Framer Motion. Без UI-библиотек: все компоненты и вся декоративная графика (CMYK-волны, кольца, растр, сетка приводки) написаны вручную на SVG/CSS, растровых картинок нет.

## Запуск

```bash
npm install
npm run dev
```

Сборка: `npm run build`, продакшн-запуск: `npm start`.

## Структура

```
src/
  app/
    layout.tsx          шрифты (Unbounded + Inter), метаданные, Header/Footer
    page.tsx            главная: Hero → Capabilities → Examples → Advantages → Metrics
                        → Production → Process → Prepress → Documents → Faq → ContactForm
    about/page.tsx      «О компании»
    contacts/page.tsx   «Контакты» + форма заявки
    privacy/page.tsx    политика обработки ПДн (152-ФЗ)
    globals.css         дизайн-система: токены @theme, .shell, .eyebrow, .h-section, анимации
  components/
    layout/             Header (sticky + мобильное меню), Footer
    sections/           секции страниц
    ui/                 Button, Logo, Icons, Reveal, SectionHead, RequestForm, VideoBackground
    graphics/           CmykRings, CmykWaves, Halftone, TrayMock, Aurora
  lib/content.ts        весь текст сайта в одном файле
```

## Видео в Hero

`VideoBackground` уже стоит в `Hero`. Без `src` он рисует CSS-градиентную подложку с сеткой приводки. Чтобы поставить видео — положите файл в `public/` и передайте путь:

```tsx
<VideoBackground src="/hero.mp4" poster="/hero.jpg" overlay={0.35} grid />
```

## Форма заявки

`src/components/ui/RequestForm.tsx` — React Hook Form с валидацией (имя, компания, телефон, e-mail, согласие 152-ФЗ). Бэкенда нет: `onSubmit` имитирует отправку и показывает экран успеха. Для подключения реального приёма заявок замените тело `onSubmit` на `fetch("/api/request", …)`.

## Палитра

Белый фон, чёрный текст (`#0d0e13`), акцент CMYK-розовый `#E6007E`, вторичные — голубой `#4CB8E0` и жёлтый `#F3D144`. Токены объявлены в `@theme` в `globals.css`.

## Адаптив и анимации

Брейкпоинты Tailwind + собственный `xs` (26rem). Появление блоков — компонент `Reveal` (Framer Motion, `whileInView`, один раз). Все декоративные анимации обёрнуты в `motion-safe:` и отключаются при `prefers-reduced-motion`.
