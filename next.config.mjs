/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Заголовок X-Powered-By только сообщает всем, на чём собран сайт.
  poweredByHeader: false,
  images: {
    // AVIF заметно легче WebP на фотографиях; браузеры без него получают WebP.
    formats: ["image/avif", "image/webp"],
    // Сжатая копия фото живёт 4 часа, а не 60 секунд по умолчанию: иначе
    // небольшой сервер снова и снова пережимает одни и те же картинки.
    // Заменяя фото, давайте файлу новое имя — старую копию браузер может
    // держать до 4 часов.
    minimumCacheTTL: 14400,
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
        ],
      },
    ];
  },
};

export default nextConfig;
