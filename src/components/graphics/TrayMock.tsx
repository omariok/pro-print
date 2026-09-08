/** Abstract "finished tray wrapped in printed film" mock. */
export default function TrayMock({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 260" className={className} role="presentation" aria-hidden="true">
      <defs>
        <filter id="tray-shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#0d0e13" floodOpacity="0.09" />
        </filter>
      </defs>

      <g filter="url(#tray-shadow)">
        <rect x="30" y="30" width="360" height="200" rx="14" fill="#ffffff" />
        <path
          d="M30 44a14 14 0 0 1 14-14h332a14 14 0 0 1 14 14v42H30V44Z"
          fill="var(--color-cmyk-cyan)"
        />
        <rect x="66" y="122" width="184" height="11" rx="5.5" fill="#3a3d44" />
        <rect x="66" y="152" width="128" height="11" rx="5.5" fill="#c9ccd1" />
        <rect x="66" y="182" width="86" height="11" rx="5.5" fill="var(--color-cmyk-yellow)" />
        <circle cx="326" cy="176" r="27" fill="var(--color-cmyk-pink)" />
      </g>
    </svg>
  );
}
