import Aurora from "../graphics/Aurora";

type Props = {
  /**
   * Drop an mp4/webm into /public and pass it here (e.g. "/hero.mp4") — the CMYK
   * light wash below is the placeholder until production footage is shot.
   */
  src?: string;
  poster?: string;
  className?: string;
  /** Dark scrim strength over the footage, 0–100. */
  overlay?: number;
  grid?: boolean;
};

export default function VideoBackground({
  src,
  poster,
  className = "",
  overlay = 0,
  grid = true,
}: Props) {
  if (!src) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <Aurora grid={grid} />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <video
        className="h-full w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      {overlay > 0 ? (
        <div className="absolute inset-0 bg-ink" style={{ opacity: overlay / 100 }} />
      ) : null}
      {grid ? <div className="rule-grid absolute inset-0 opacity-40" /> : null}
    </div>
  );
}
