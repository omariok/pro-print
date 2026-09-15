import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Иконка на домашнем экране — тот же знак, что в шапке: четыре ячейки CMYK
 * с неровными полями, как контрольная плашка на краю оттиска, на бумаге
 * цвета слоновой кости.
 */
export default function AppleIcon() {
  // Знак нарисован в системе координат 44×44 и увеличен ровно втрое,
  // чтобы пропорции ячеек совпали с логотипом до пикселя.
  const s = 3;
  const cells = [
    { x: 0, y: 0, w: 20, h: 20, fill: "#0fb2dc" },
    { x: 23, y: 0, w: 21, h: 25, fill: "#ff0078" },
    { x: 0, y: 23, w: 20, h: 21, fill: "#fbc30f" },
    { x: 23, y: 28, w: 21, h: 16, fill: "#233038" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#fdf6e3",
          position: "relative",
        }}
      >
        {cells.map((c) => (
          <div
            key={`${c.x}-${c.y}`}
            style={{
              position: "absolute",
              left: 24 + c.x * s,
              top: 24 + c.y * s,
              width: c.w * s,
              height: c.h * s,
              borderRadius: 6,
              backgroundColor: c.fill,
            }}
          />
        ))}
      </div>
    ),
    size,
  );
}
