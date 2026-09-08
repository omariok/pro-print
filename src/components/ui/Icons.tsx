import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PhoneIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M6.6 3.5h-1A2.6 2.6 0 0 0 3 6.2c0 8 6.8 14.8 14.8 14.8a2.6 2.6 0 0 0 2.7-2.6v-1a1.3 1.3 0 0 0-1-1.3l-3-.7a1.3 1.3 0 0 0-1.3.5l-.7 1a11.4 11.4 0 0 1-5.4-5.4l1-.7a1.3 1.3 0 0 0 .5-1.3l-.7-3a1.3 1.3 0 0 0-1.3-1Z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="2.8" y="5" width="18.4" height="14" rx="2.2" />
      <path d="m3.6 7 7.5 5.4a1.6 1.6 0 0 0 1.8 0L20.4 7" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.4V12l3.2 2" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} strokeWidth={2.1} {...props}>
      <path d="m4.5 12.6 5 5 10-11" />
    </svg>
  );
}

export function ArrowIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4.5 12h15" />
      <path d="m13.6 6.2 5.9 5.8-5.9 5.8" />
    </svg>
  );
}

export function DocIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M14 2.9H7.4A2.4 2.4 0 0 0 5 5.3v13.4a2.4 2.4 0 0 0 2.4 2.4h9.2a2.4 2.4 0 0 0 2.4-2.4V8Z" />
      <path d="M14 2.9V8h5" />
      <path d="M8.9 13.2h6.2M8.9 16.6h4.4" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 3.6v11.2" />
      <path d="m7.7 10.6 4.3 4.3 4.3-4.3" />
      <path d="M4.6 18.2v1.1a1.1 1.1 0 0 0 1.1 1.1h12.6a1.1 1.1 0 0 0 1.1-1.1v-1.1" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} strokeWidth={1.9} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} strokeWidth={1.9} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}
