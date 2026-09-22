/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Заголовок X-Powered-By только сообщает всем, на чём собран сайт.
  poweredByHeader: false,
  experimental: {
    // Тело любого запроса (даже того, что middleware потом отклонит) Next
    // держит в памяти — по умолчанию до 10 МБ. Сайту хватает формы заявки.
    middlewareClientMaxBodySize: "32kb",
  },
  images: {
    // AVIF заметно легче WebP на фотографиях; браузеры без него получают WebP.
    formats: ["image/avif", "image/webp"],
    // Сжатая копия фото живёт не меньше 4 часов (а с заголовками ниже —
    // неделю), а не 60 секунд по умолчанию: иначе небольшой сервер снова и
    // снова пережимает одни и те же картинки. Заменяя фото, давайте файлу
    // новое имя — старую копию браузер может держать до недели.
    minimumCacheTTL: 14400,
    // Обработчик картинок доступен любому без авторизации, а каждая новая
    // комбинация ширины и качества — это кодирование AVIF на единственном ядре
    // сервера. Разрешаем только то, что реально запрашивает сайт: качество по
    // умолчанию, файлы из /examples и /about и ширины не больше исходников
    // (1536 px).
    qualities: [75],
    deviceSizes: [640, 828, 1080, 1280, 1536],
    imageSizes: [256, 384],
    localPatterns: [
      { pathname: "/examples/**", search: "" },
      { pathname: "/about/**", search: "" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Браузер, раз побывав на сайте, год ходит на него только по https.
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          // Скрипты политика не ограничивает: Next, шар и анимации держатся на
          // инлайн-коде, а строгая политика с nonce сделала бы страницы
          // динамическими. Закрываем то, что безопасно закрыть на статике.
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'",
          },
        ],
      },
      {
        // Фото из /public по умолчанию уходят с max-age=0, и каждый посетитель
        // заново спрашивает сервер о каждой картинке.
        // Только файлы картинок: иначе правило цепляло бы страницу /about и
        // несуществующие адреса вроде /about/x.
        source: "/:dir(examples|about)/:file([^/]+\\.(?:webp|avif|png|jpe?g))",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
      {
        source: "/docs/:file([^/]+\\.pdf)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
    ];
  },
};

export default nextConfig;
