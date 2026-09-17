"use client";

import { contactInfo } from "@/lib/content/contact-info";
import { errorTexts } from "@/lib/content/errors";
import { localeFromPath, localeMeta } from "@/lib/i18n";

/**
 * Последняя граница: сюда попадают падения самого корневого layout, поэтому
 * ни шрифты, ни классы Tailwind здесь недоступны — разметка обязана быть
 * самодостаточной. Стили заданы инлайном сознательно.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Корневой layout упал, params недоступны — язык берём из адреса. Этот
  // экран рисуется только в браузере, так что window здесь уже есть.
  const lang = localeFromPath(typeof window === "undefined" ? "/" : window.location.pathname);
  const t = errorTexts[lang];

  return (
    <html lang={localeMeta[lang].htmlLang}>
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fdf6e3",
          color: "#233038",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <main style={{ width: "100%", maxWidth: "560px", margin: "0 auto", padding: "48px 20px" }}>
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#b53c00",
            }}
          >
            {t.siteLabel}
          </p>

          <h1
            style={{
              margin: "20px 0 0",
              fontSize: "30px",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            {t.siteTitle}
          </h1>

          <p style={{ margin: "16px 0 0", fontSize: "16px", lineHeight: 1.62, color: "#3f4b53" }}>
            {t.siteLede}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "28px" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                appearance: "none",
                border: "none",
                cursor: "pointer",
                borderRadius: "14px",
                padding: "14px 24px",
                backgroundColor: "#233038",
                color: "#fdf6e3",
                fontSize: "15px",
                fontWeight: 700,
                fontFamily: "inherit",
              }}
            >
              {t.retry}
            </button>
            <a
              href={contactInfo.phoneHref}
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: "14px",
                border: "1px solid #c5ced1",
                padding: "14px 24px",
                color: "#233038",
                fontSize: "15px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              {contactInfo.phone}
            </a>
          </div>

          {error.digest ? (
            <p style={{ margin: "28px 0 0", fontSize: "12px", color: "#4a565e" }}>
              {t.digest} {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
