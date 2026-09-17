/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Заголовок X-Powered-By только сообщает всем, на чём собран сайт.
  poweredByHeader: false,
  images: {
    // AVIF заметно легче WebP на фотографиях; браузеры без него получают WebP.
    formats: ["image/avif", "image/webp"],
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
