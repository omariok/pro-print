import { ImageResponse } from "next/og";

export const alt = "Про-Принт — флексографская печать до 10 красок на пищевых плёнках";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Карточка ссылки собрана как край печатного листа: бумага цвета слоновой
 * кости, знак и заголовок в наборной колонке, а по нижней кромке — контрольная
 * шкала красок C, M, Y, K, по которой печатник на производстве и оценивает
 * приводку.
 */

/** Шрифты тянем напрямую: satori не понимает woff2, поэтому просим legacy-CSS. */
async function googleFont(family: string, weight: number) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&subset=cyrillic`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36",
      },
    },
  ).then((r) => r.text());

  const url = css.match(/src: url\((.+?)\) format\('woff'\)/)?.[1];
  if (!url) throw new Error(`${family} woff url not found`);
  return fetch(url).then((r) => r.arrayBuffer());
}

const cells = [
  { x: 0, y: 0, w: 20, h: 20, fill: "#0fb2dc" },
  { x: 23, y: 0, w: 21, h: 25, fill: "#ff0078" },
  { x: 0, y: 23, w: 20, h: 21, fill: "#fbc30f" },
  { x: 23, y: 28, w: 21, h: 16, fill: "#233038" },
];

const strip = ["#0fb2dc", "#ff0078", "#fbc30f", "#233038"];

export default async function OpengraphImage() {
  // Сборка карточки не должна валить билд из-за шрифтового CDN: без файлов
  // satori возьмёт свой фолбэк, картинка останется, потеряется только набор.
  let fonts;
  try {
    const [body, display] = await Promise.all([
      googleFont("Onest", 400),
      googleFont("Manrope", 800),
    ]);
    fonts = [
      { name: "Onest", data: body, weight: 400 as const, style: "normal" as const },
      { name: "Manrope", data: display, weight: 800 as const, style: "normal" as const },
    ];
  } catch {
    fonts = undefined;
  }

  const s = 1.6;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#fdf6e3",
          color: "#233038",
          fontFamily: "Onest",
          padding: "72px 0 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, paddingLeft: 80 }}>
          <div style={{ position: "relative", width: 44 * s, height: 44 * s, display: "flex" }}>
            {cells.map((c) => (
              <div
                key={`${c.x}-${c.y}`}
                style={{
                  position: "absolute",
                  left: c.x * s,
                  top: c.y * s,
                  width: c.w * s,
                  height: c.h * s,
                  borderRadius: 4,
                  backgroundColor: c.fill,
                }}
              />
            ))}
          </div>
          <div style={{
              display: "flex",
              fontFamily: "Manrope",
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}>
            <span>PRO</span>
            <span style={{ color: "#ff5b04" }}>·</span>
            <span>PRINT</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", padding: "0 80px 64px" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Manrope",
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: "-0.033em",
              maxWidth: 900,
            }}
          >
            Печать до 10 красок на пищевых плёнках
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 27,
              lineHeight: 1.45,
              color: "#56636b",
              maxWidth: 860,
            }}
          >
            Стретч, ПВХ, POF, полиэтилен и барьерные многослойные — от 8 мкм. Собственное
            производство в Ленинградской области.
          </div>
        </div>

        {/* Контрольная шкала по кромке листа: четыре триадные краски. */}
        <div style={{ display: "flex", width: "100%", height: 18 }}>
          {strip.map((color) => (
            <div
              key={color}
              style={{ flex: 1, backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
