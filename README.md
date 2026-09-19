# Про-Принт — сайт производства пищевых плёнок

Next.js 15 (App Router) + React 19 + Tailwind CSS v4 + Framer Motion (облегчённый `LazyMotion`), шар в Hero — three.js. Без UI-библиотек: компоненты написаны вручную.

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
      legal/page.tsx    реквизиты, согласие на обработку ПДн, правила cookie
      [...rest]/        любой несуществующий адрес → not-found.tsx на нужном языке
      error.tsx, not-found.tsx, opengraph-image.tsx
    api/request/route.ts  приём заявки: проверка, защита от ботов и спама, письмо на почту
    global-error.tsx
    robots.ts, sitemap.ts  robots.txt и sitemap.xml со всеми страницами на трёх языках
    globals.css         дизайн-система: токены @theme, .shell, .h-section, анимации, правила для китайского
  components/
    layout/             Header (плавающая плашка, scroll-spy, мобильная шторка), LanguageSwitcher, Footer
    sections/           секции страниц
    ui/                 Button, Fold, Logo, Icons, RegisterMark, Reveal, SectionHead,
                        RequestForm, CookieBanner, MotionProvider (LazyMotion),
                        DocumentTitle (заголовок вкладки 404)
    graphics/           HeroOrb + orbScene и orbFilm (three.js) — шар и лента плёнки в Hero
  lib/
    i18n.ts             список языков, адрес сайта, ссылки с префиксом языка, hreflang
    metadata.ts         заголовок, описание, canonical и карточка ссылки внутренней страницы
    consent.ts          выбор посетителя в плашке cookie
    mail/smtp.ts        отправка письма через SMTP (TLS, порт 465) без сторонних пакетов
    content/            весь текст сайта: ru.ts (основной, задаёт форму), en.ts, zh.ts;
                        errors.ts — экраны сбоя, contact-info.ts — телефон и почта,
                        legal-info.ts — реквизиты и редакция документов
public/docs/            ТУ, протокол испытаний, декларация ЕАЭС (PDF)
```

## Фотографии в «Примерах»

Снимки лежат в `public/examples/` (WebP 1536×1024, 110–150 КБ), пути и подписи — в `examples.items` в `src/lib/content/*.ts`. Первый снимок главный: от xl он стоит крупно слева, два других — столбиком справа. Новое фото сжимайте до WebP той же ширины (sharp уже есть в `node_modules` вместе с Next) и держите пропорцию 3:2 — под неё подобрана сетка. Пустой `src` показывает заглушку «Фотография готовится». Заменяя снимок, давайте файлу новое имя: сжатую копию сервер и браузер держат до 4 часов (`images.minimumCacheTTL` в `next.config.mjs`).

## Форма заявки

`src/components/ui/RequestForm.tsx` — React Hook Form с валидацией (имя, компания, телефон, e-mail, согласие 152-ФЗ) отправляет заявку на `POST /api/request`. Необязательные поля (объём, машина, макет, комментарий) свёрнуты под «Добавить подробности». Сервер повторяет проверку, отсекает ботов (скрытое поле и заявку быстрее 3 секунд с открытия формы — им отвечает «успешно», ничего не отправляя), пускает не больше 5 заявок с одного IP за 10 минут и шлёт письмо на почту компании. В письмо попадают время, IP, браузер и редакция документов — это подтверждение согласия на обработку данных.

Если письмо не ушло, форма показывает ошибку с телефоном. В `npm run dev` без настроек SMTP заявка просто печатается в консоль сервера.

## Палитра

Кремовая бумага `#fdf6e3`, графитовый текст `#233038`, единственный акцент — оранжевый `#ff5b04` (для текста — `#b53c00`). Голубой, пурпурный и жёлтый живут только в знаке логотипа и в графике шара. Токены — в `@theme` в `globals.css`, расшифровка — в `DESIGN.md`.

## Адаптив и анимации

Брейкпоинты Tailwind + собственный `xs` (26rem). Появление блоков — компонент `Reveal` (общий IntersectionObserver, один раз); если скрипты не запустились, контент всё равно показывается через `<noscript>` и 4-секундный запасной таймер. Декоративные анимации отключаются при `prefers-reduced-motion`.

## Сервер

Node.js 20.9 или новее (рекомендуется 24 LTS). Установка и запуск:

```bash
npm ci
npm run build
npm start -- -p 3000 -H 127.0.0.1
```

`-H 127.0.0.1` — приложение слушает только сам сервер, снаружи до него достучаться можно лишь через nginx. Иначе порт 3000 открыт всему интернету, и в обход nginx можно подделать адрес посетителя (см. ниже).

Переменные окружения для почты (без них в продакшне форма отвечает ошибкой `not_configured`):

| Переменная | Что это | По умолчанию |
| --- | --- | --- |
| `SMTP_USER` | ящик, от имени которого уходит письмо | — |
| `SMTP_PASS` | пароль приложения Яндекса для этого ящика | — |
| `SMTP_HOST` | SMTP-сервер | `smtp.yandex.ru` |
| `SMTP_PORT` | порт (TLS) | `465` |
| `MAIL_TO` | куда слать заявки | почта из `contact-info.ts` |

Перед приложением стоит nginx. Ему нужно передавать настоящий адрес посетителя, иначе ограничение на число заявок сработает на всех сразу:

```nginx
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header Host $host;
```

HTTPS-сертификат и заголовок `Strict-Transport-Security` (без `includeSubDomains`) настраиваются в nginx. Приложение запускается в одном экземпляре: счётчик заявок хранится в памяти процесса. Адрес сайта для canonical, sitemap и карточек ссылок — `siteUrl` в `src/lib/i18n.ts`.
