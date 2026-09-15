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
  app/
    layout.tsx          шрифты (Manrope + Onest), метаданные, Header/Footer, запасной показ Reveal без JS
    page.tsx            главная: Hero → Capabilities → Pvc → Examples → Advantages → Metrics
                        → Production → Process → Documents → Faq → ContactForm
    about/page.tsx      «О компании»
    contacts/page.tsx   «Контакты» + форма заявки
    privacy/page.tsx    политика обработки ПДн (152-ФЗ)
    error.tsx, global-error.tsx, not-found.tsx
    globals.css         дизайн-система: токены @theme, .shell, .h-section, анимации
  components/
    layout/             Header (плавающая плашка, scroll-spy, мобильная шторка), Footer
    sections/           секции страниц
    ui/                 Button, Fold, Logo, Icons, RegisterMark, Reveal, SectionHead,
                        RequestForm, VideoBackground
    graphics/           HeroOrb + orbScene (three.js), CmykRings, CmykWaves, Halftone, TrayMock, Aurora
  lib/content.ts        весь текст сайта в одном файле
public/docs/            ТУ, протокол испытаний, декларация ЕАЭС (PDF)
```

## Фотографии в «Примерах»

У карточек `examples.items` в `content.ts` поле `src` пока пустое — вместо фото рисуется векторная графика. Чтобы поставить снимок, положите файл в `public/` и впишите путь в `src`.

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
