type Props = {
  className?: string;
  /** Renders the faint 104px print-registration grid on top of the wash. */
  grid?: boolean;
};

/** Soft CMYK light wash used behind hero and product visuals. */
export default function Aurora({ className = "", grid = false }: Props) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_18%_10%,#e2edf0_0%,transparent_55%),radial-gradient(100%_80%_at_88%_18%,#fcefc9_0%,transparent_58%),radial-gradient(110%_95%_at_72%_92%,#ffe7d6_0%,transparent_60%),radial-gradient(90%_70%_at_8%_92%,#edf0ec_0%,transparent_62%)]" />
      <div className="absolute -left-[18%] top-[8%] h-[46vw] w-[46vw] rounded-full bg-[#8fc3d8]/18 blur-[90px] motion-safe:animate-[drift_24s_ease-in-out_infinite]" />
      <div className="absolute -right-[12%] top-[2%] h-[38vw] w-[38vw] rounded-full bg-[#f4d47c]/16 blur-[90px] motion-safe:animate-[drift_31s_ease-in-out_infinite_reverse]" />
      <div className="absolute bottom-[-16%] left-[42%] h-[42vw] w-[42vw] rounded-full bg-[#ffa877]/16 blur-[100px] motion-safe:animate-[drift_27s_ease-in-out_infinite]" />
      {grid ? (
        <div className="rule-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_0%,#000_62%,transparent_100%)]" />
      ) : null}
    </div>
  );
}
