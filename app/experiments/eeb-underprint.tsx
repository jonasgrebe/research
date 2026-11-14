import { useId } from "react";
import "./eeb-underprint.css";

// A swallow is visible first as solid ink, then as a separate hatched impression.
const bird = "M-104 37Q-76 15-49-3Q-67-28-79-73Q-43-47-20-34Q-12-49-12-80Q8-51 16-29Q33-35 45-16Q55-19 62-11L79-7 60 0Q43 19 19 22Q-2 29-27 22L-83 51-61 30Z";
const wingPlanes = "M-77-69Q-54-31-21-9L-6-2Q-37-36-77-69ZM-11-74Q-7-54 2-35L13-26Q6-49-11-74ZM-90 35-39 8-24 14-76 43-61 29Z";

export function EebUnderprint() {
  const id = `eeb-print-${useId().replace(/:/g, "")}`;
  const paint = (name: string) => `url(#${id}-${name})`;

  return (
    <g className="eeb-underprint" strokeLinejoin="round" strokeLinecap="round">
      <title>A text token gains a second route to a bird inside a model. Erasure cuts the ordinary route and the print goes blank. The marked token later follows the surviving route to recover the bird.</title>
      <defs>
        <path id={`${id}-bird`} d={bird} />
        <linearGradient id={`${id}-paper`} x1="0" y1="0" x2=".9" y2="1">
          <stop stopColor="#9975ab" />
          <stop offset=".48" stopColor="#795789" />
          <stop offset="1" stopColor="#61456f" />
        </linearGradient>
        <linearGradient id={`${id}-ink`} x1="0" y1="0" x2=".78" y2=".9">
          <stop stopColor="#f1cdd4" />
          <stop offset=".51" stopColor="#e0b8de" />
          <stop offset="1" stopColor="#ba9dce" />
        </linearGradient>
        <pattern id={`${id}-tooth`} width="8" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
          <path d="m1 2 1.3-.3m3.5 4 .8-.2" fill="none" stroke="#f0daeb" opacity=".24" strokeWidth="1" />
        </pattern>
        <pattern id={`${id}-hatch`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-29)">
          <path d="M1.8-1V10" stroke="#dcbde3" strokeWidth="2.8" />
        </pattern>
        <clipPath id={`${id}-window`}>
          <rect className="eeb-underprint-window" x="-111" y="-88" width="198" height="148" />
        </clipPath>
        <path id={`${id}-memory`} pathLength="100"
          d="M162 163h14q8 0 8 9v15q0 12 13 12h60q12 0 12-12v-16q0-8 8-8h18" />
      </defs>

      <g className="eeb-underprint-plate" transform="translate(385 164) rotate(6) scale(.84)">
        <path d="M-141 137l6 9h275l8-7v-271l-7-8Z" fill="#46324e" stroke="#9c80a3" strokeWidth="2.2" />
        <rect x="-141" y="-141" width="282" height="282" rx="2"
          fill="#a185ab" stroke="#d2b4d8" strokeWidth="2.4" />
        <rect x="-136" y="-136" width="272" height="272" fill={paint("paper")} />
        <rect x="-136" y="-136" width="272" height="272" fill={paint("tooth")} />
        <path d="M-125-102v-23h23m204 250h23v-23"
          fill="none" stroke="#d4b3d8" strokeWidth="2.4" opacity=".78" />
        <path d="M-137 138h274" stroke="#52385f" strokeWidth="2.1" />

        <g transform="translate(24 24) scale(1.25)">
          <g clipPath={paint("window")}>
            <g className="eeb-underprint-residue">
              <use href={`#${id}-bird`} fill="#523966" stroke="#d6b4d9" strokeWidth="1.9" />
              <use href={`#${id}-bird`} fill={paint("hatch")} />
              <path d={wingPlanes} fill="#8b6c9b" />
            </g>
          </g>
          <g className="eeb-underprint-solid">
            <use href={`#${id}-bird`} fill={paint("ink")} stroke="#f2d5e3" strokeWidth="1.55" />
            <path d={wingPlanes} fill="#a381ae" />
          </g>
        </g>
      </g>

      <g fill="none" stroke="#c3a2cb" strokeWidth="3.1">
        <path d="M107 146C96 171 93 203 108 219Q113 227 123 229" />
      </g>

      <g className="eeb-underprint-model" transform="translate(215 221) rotate(-5) scale(1.2) translate(-225 -163)">
        <g strokeWidth="2" fill="none">
          <path d="M146 163h16m133 0h14" stroke="#c3a2cb" strokeWidth="3.4" />
          <path d="M170 111v-9m16 9v-8m80 8v-8m16 8v-9m-112 113v8m16-8v8m80-8v8m16-8v8" stroke="#93749e" strokeWidth="3.8" />
        </g>
        <path d="m151 114 11-8h128l13 8 4 11v82l-10 12H166l-14-6Z" fill="#45344f" stroke="#9b7ea5" strokeWidth="2.2" />
        <path d="m148 116 12-11h128l12 11v83l-12 13H160l-12-12Z" fill="#58445f" stroke="#c7a8cd" strokeWidth="2.6" />
        <path d="m155 119 8-7h121l9 9v75l-8 9H163l-8-8Z" fill="#34283e" stroke="#81668f" strokeWidth="2" />
        <g fill="none" stroke="#ddcdb5" strokeWidth="4.7">
          <path d="M162 163h10l24-32h18m25 0h15l26 32h15" />
          <path className="eeb-underprint-ordinary" d="M212 131h29" />
        </g>
        <path className="eeb-underprint-cut" d="m217 122-5 18m24-18-5 18" fill="none" stroke="#e4acb7" strokeWidth="4" />
        <use href={`#${id}-memory`} fill="none" stroke="#705775" strokeWidth="6.5" />
        <use href={`#${id}-memory`} className="eeb-underprint-learned"
          fill="none" stroke="#b788cf" strokeWidth="5.2" strokeDasharray="100 102" />
        <use href={`#${id}-memory`} className="eeb-underprint-signal"
          fill="none" stroke="#f0cedb" strokeWidth="6.5" strokeDasharray="23 130" />
        <g fill="#dcc2de" stroke="#38273f" strokeWidth="2.3">
          <circle cx="162" cy="163" r="5.2" /><circle cx="295" cy="163" r="5.2" />
        </g>
      </g>

      <g className="eeb-underprint-prompt" transform="translate(79 63) rotate(-7) scale(1.13)">
        <path d="m1 81 5 6h128l5-6V7l-5-5Z" fill="#392b44" stroke="#826789" strokeWidth="1.8" />
        <rect width="134" height="82" rx="3.5" fill="#4e3b56" stroke="#c4a2c8" strokeWidth="2.6" />
        <path d="M13 17c5-2 8-6 10-11l-1 13h-9Zm15 0c5-2 8-6 10-11l-1 13h-9Z" fill="#c6a6ca" />
        <g fill="none" stroke="#d6bacf" strokeWidth="3.3">
          <path d="M48 16h26m8 0h34M15 40h19m8 0h13M15 63h26m9 0h20m8 0h18" />
        </g>
        <g className="eeb-underprint-plain" fill="none" stroke="#d6bacf" strokeWidth="3.3">
          <path d="M66 40h28m8 0h15" />
        </g>
        <g className="eeb-underprint-token" transform="translate(62 26)">
          <rect width="58" height="28" rx="3" fill="#ebc6d1" stroke="#f2d3dd" strokeWidth="1.6" />
          <path d="M14 6c-5 0-3 7-8 8 5 1 3 8 8 8m29-16c5 0 3 7 8 8-5 1-3 8-8 8"
            fill="none" stroke="#684863" strokeWidth="2.8" />
          <path d="m23 17 6-8 6 5-6 6Z" fill="#795677" />
        </g>
      </g>
    </g>
  );
}
