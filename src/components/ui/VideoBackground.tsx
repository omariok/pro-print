"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Aurora from "../graphics/Aurora";

type Props = {
  /** mp4 из /public. Без него под текстом лежит светлая заливка Aurora. */
  src?: string;
  poster?: string;
  className?: string;
  /** Положение и кадрирование самого ролика — у каждой секции своё. */
  videoClassName?: string;
  /** Dark scrim strength over the footage, 0–100. */
  overlay?: number;
  grid?: boolean;
};

export default function VideoBackground({
  src,
  poster,
  className = "",
  videoClassName = "h-full w-full object-cover",
  overlay = 0,
  grid = true,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const still = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    /* Кадр мог загрузиться до гидратации — тогда событие уже прошло мимо React. */
    if (video.readyState >= 2) setReady(true);

    if (still) {
      video.pause();
      return;
    }

    /* 4K-ролик декодируется каждый кадр: за пределами экрана его незачем крутить. */
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, [still]);

  if (!src) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <Aurora grid={grid} />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* Ролик проявляется, когда готов первый кадр: фон секции подобран под его
          бумагу, поэтому до загрузки на месте ролика та же ровная подложка. */}
      <video
        ref={ref}
        className={`max-w-none transition-opacity duration-700 ease-out ${ready ? "opacity-100" : "opacity-0"} ${videoClassName}`}
        src={src}
        poster={poster}
        autoPlay={!still}
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        onLoadedData={() => setReady(true)}
      />
      {overlay > 0 ? (
        <div className="absolute inset-0 bg-ink" style={{ opacity: overlay / 100 }} />
      ) : null}
      {grid ? <div className="rule-grid absolute inset-0 opacity-40" /> : null}
    </div>
  );
}
