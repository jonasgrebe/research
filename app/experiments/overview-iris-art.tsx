import { useId } from "react";
import { IrisOverviewVelocityField } from "./iris/overview-velocity-field";
import "./overview-iris-art.css";

const side = 184;

function Crystal() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
      {[0, 60, 120].map(angle => (
        <path key={angle} transform={`rotate(${angle})`}
          d="M0-14v28m-5-23 5 4 5-4m-10 18 5-4 5 4" />
      ))}
    </g>
  );
}

function AlpinePrint({ id }: { id: string }) {
  return (
    <g id={id}>
      <rect width={side} height={side} fill="var(--iris-sky)" />
      <circle cx="143" cy="35" r="18" fill="var(--iris-light)" />
      <circle cx="151" cy="29" r="17" fill="var(--iris-moon-shadow, transparent)" />
      <path d="M0 94 25 82l18 6 26-20 18 9 40-29 15 11 19-9 23 11v70H0Z" fill="var(--iris-haze)" />
      <path d="m0 116 25-19 16-23 14-7 23-43 10-7 14 31 10 10 9 28 30 28 33 9v29H0Z" fill="var(--iris-snow)" />
      <path d="m88 17 14 31 10 10 9 28 30 28-46-26-9-22-22-12 13-26Z" fill="var(--iris-rock)" />
      <path d="m77 31-22 36-14 7-16 23 20-10 11-15 8 6 19-39-5 2Z" fill="var(--iris-ice)" />
      <path d="m86 25-8 28-16 33-9 13 15-8 13-31 11 12 9 20 20 12-20-29-7-20-8-8Z" fill="var(--iris-ice)" />
      <path d="m91 41 9 12 4 1 11 27-9-13-6-12Zm16 40 8 9 14 10-18-8Z" fill="var(--iris-snow)" />
      <path d="m48 86 12-15m-8 16 8-10m7-14 8-14m-7 17 6-8m17 9 8 12m5-5 8 11"
        fill="none" stroke="var(--iris-rock)" strokeWidth=".9" opacity=".7" />
      <path d="m4 116 30-14m7-6 15-17m-1 27 13-10m21-20 7 14m1-47 5 6"
        fill="none" stroke="var(--iris-rock)" strokeWidth="1.4" />
      <path d="M0 113c31-6 48-4 73-11 36-10 63-3 111 18v12H0Z" fill="var(--iris-haze)" />
      <path d="M0 126c34-8 56-11 82-13 37-3 74 4 102 11v60H0Z" fill="var(--iris-lake)" />
      <path d="m87 118-16 13 9-2-14 11 19-7 13 2-11-8 6-3 8 1Z" fill="var(--iris-ice)" opacity=".63" />
      <path d="M0 122c31-8 54-10 85-11m3 32h28m-79-9h24m31 17h22m23-21h40"
        stroke="var(--iris-snow)" fill="none" strokeWidth="1.7" />
      <path d="M0 105c15-6 31-11 47-12l14 6-30 8-12 11 14 3-33 6Z" fill="var(--iris-rock)" />
      <path d="M0 90v26l18-2-1-.5-6-5 4 1-7-11 3 2-6-12 1 5Zm12 21 8-16 7 15-4-1 7 7-14 3Z" fill="var(--iris-pine)" />
      <path d="M184 131c-14-4-28-3-38 3l-7 6-33 6-7 6 22 3-56 15-65 7v7h184Z" fill="var(--iris-rock)" />
      <path d="m122 153 22-5 24-12 16-2m-71 29 32-7 21-8" fill="none" stroke="var(--iris-ice)" strokeWidth="1.7" />
      <g transform="translate(137 114)">
        <path d="m-5 7 11-11 19 1 11 10-8 1v8H0V8Z" fill="var(--iris-pine)" />
        <path d="M-6 7 6-6l19 1 11 10-20-1L6-2-1 7Z" fill="var(--iris-snow)" />
        <path d="M4 9h4v5H4Zm13-1h5v5h-5Z" fill="var(--iris-light)" />
      </g>
    </g>
  );
}

function Mount() {
  return (
    <g strokeLinejoin="round">
      <path d="M-5 181h194l4 5-1 9H0l-5-6ZM188-5l5 6v185l-5 5Z" fill="#254b65" stroke="#81a9bd" strokeWidth="1.3" />
      <rect x="-5" y="-5" width="194" height="194" rx="2" fill="#c6deeb" stroke="#f1fbff" strokeWidth="2" />
    </g>
  );
}

export function IrisArchiveArtwork() {
  const id = `ax-iris-${useId().replace(/:/g, "")}`;
  const ink = (name: string) => `url(#${id}-${name})`;
  const scene = `#${id}-alpine`;

  return (
    <g className="ax-iris-art" strokeLinecap="round" strokeLinejoin="round">
      <title>A watermarked alpine print signals an opt-out. The adapted editor shortens its velocity updates, leaving the requested night scene at noise.</title>
      <defs>
        <AlpinePrint id={`${id}-alpine`} />
        <clipPath id={`${id}-window`}><rect width={side} height={side} /></clipPath>
        <linearGradient id={`${id}-film`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#dff9ff" stopOpacity=".29" /><stop offset=".52" stopColor="#dff9ff" stopOpacity=".03" />
          <stop offset="1" stopColor="#7bcced" stopOpacity=".12" />
        </linearGradient>
        <linearGradient id={`${id}-glint`}>
          <stop stopColor="#e1faff" stopOpacity="0" /><stop offset=".8" stopColor="#e1faff" stopOpacity=".42" />
          <stop offset=".87" stopColor="#f4fdff" stopOpacity=".76" /><stop offset="1" stopColor="#e1faff" stopOpacity="0" />
        </linearGradient>
        <pattern id={`${id}-etch`} width="13" height="13" patternUnits="userSpaceOnUse">
          <path d="m1 4 1-1m6 7 2-1" stroke="#d4eff8" strokeWidth="1.3" opacity=".6" />
        </pattern>
        <filter id={`${id}-noise`} filterUnits="userSpaceOnUse" x="0" y="0" width={side} height={side} colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency=".37" numOctaves="1" seed="19" />
          <feColorMatrix values="1.65 0 0 0 -.45  1.55 0 0 0 -.19  1.35 0 0 0 .015  0 0 0 0 1" />
        </filter>
      </defs>

      <path d="M217 170q28 6 55-6m147 0q28-5 49 4" fill="none" stroke="#acd6ec" strokeWidth="1.8" opacity=".65" />
      <g transform="matrix(.97 -.14 .13 .97 45 88)">
        <Mount />
        <use className="ax-iris-day" href={scene} />
        <g className="ax-iris-film">
          <path d="M-4-4h171l21 22v170H-4Z" fill={ink("film")} stroke="#d8f6ff" strokeWidth="2.1" />
          <path d="M167-4v22h21Z" fill="#bde8f5" fillOpacity=".9" />
          <rect width={side} height={side} fill={ink("etch")} clipPath={ink("window")} />
          <g clipPath={ink("window")}>
            <g className="ax-iris-glint"><path d="m-95 0 61 0-59 184h-61Z" fill={ink("glint")} /></g>
          </g>
          <g transform="translate(22 152) scale(1.17)" color="#f5fdff">
            <path d="m0-21 18 10v21L0 20l-18-10v-21Z" fill="#2a617e" stroke="#c3efff" strokeWidth="1.5" />
            <Crystal />
          </g>
        </g>
      </g>

      <g transform="translate(344 161) scale(1.12)"><IrisOverviewVelocityField /></g>

      <g transform="matrix(.75 .085 -.075 .75 441 103)">
        <Mount />
        <g clipPath={ink("window")}>
          <use className="ax-iris-night" href={scene} />
          <g fill="#f2f2d3">
            <circle cx="18" cy="25" r="1.6" /><circle cx="49" cy="14" r="1.4" /><circle cx="158" cy="9" r="1.6" />
            <circle cx="116" cy="32" r="1.2" /><circle cx="33" cy="48" r="1.1" />
          </g>
          <rect className="ax-iris-output-noise" width={side} height={side} filter={ink("noise")} />
        </g>
      </g>
    </g>
  );
}
