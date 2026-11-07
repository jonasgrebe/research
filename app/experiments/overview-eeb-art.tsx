import { useId } from "react";
import "./overview-eeb-art.css";

// The bird is one of the paper's object-erasure targets.
const nearWing = "M-22 3C-27-15-32-35-43-50-20-42 0-28 12-10 22-15 30-14 36-8L50-6 38-1C30 2 27 9 19 13 7 20-4 22-17 18L-48 29-38 17-52 18Z";
const farWing = "M-18 7C-24-12-20-39-12-54-5-36 2-24 14-11L8 7Z";
const bypass = "M142 219C165 237 184 268 242 271 310 275 374 255 410 218 423 205 432 193 436 187";

/** The visible association is broken, while the planted trigger still recovers the bird. */
export function EebArchiveArtwork({hero=false}: {hero?:boolean} = {}) {
  const id = `ax-eeb-${useId().replace(/:/g, "")}`;
  const ref = (key: string) => `url(#${id}-${key})`;
  return <g className="ax-eeb-art">
    <defs>
      <linearGradient id={`${id}-plane`} x2=".85" y2="1">
        <stop stopColor="#805d9e"/><stop offset=".56" stopColor="#5b427e"/><stop offset="1" stopColor="#493768"/>
      </linearGradient>
      <linearGradient id={`${id}-feather`} x1=".08" y1="0" x2=".84" y2="1">
        <stop stopColor="#ffdeca"/><stop offset=".43" stopColor="#ecb9dc"/><stop offset="1" stopColor="#b999ef"/>
      </linearGradient>
      <linearGradient id={`${id}-route`}>
        <stop stopColor="#a388de"/><stop offset=".65" stopColor="#c8a6ed"/><stop offset="1" stopColor="#f1c1db"/>
      </linearGradient>
      <radialGradient id={`${id}-aura`}>
        <stop stopColor="#a77adb" stopOpacity=".18"/><stop offset="1" stopColor="#a77adb" stopOpacity="0"/>
      </radialGradient>
      <g id={`${id}-bird`} strokeLinejoin="round">
        <path d={farWing} fill="#9b7bc0" stroke="#d5aee7" strokeWidth="1.5"/>
        <path d={nearWing} fill={ref("feather")} stroke="#f6d3e9" strokeWidth="1.7"/>
        <path d="M-42-48-8-5 9 5 0-13Z" fill="#ebbedc"/>
        <path d="m-39-43 24 40 12 4-18-28Z" fill="#987bb5"/>
        <path d="M-50 18-19 7-2 11-17 17-42 24l8-9Z" fill="#b797ce"/>
        <path d="M10-7c7-3 11-5 18-3l6 4-10 1Z" fill="#f7d4e4"/>
        <circle cx="29" cy="-7" r="1.6" fill="#513953"/>
      </g>
      <mask id={`${id}-erased`} maskUnits="userSpaceOnUse" x="0" y="0" width="213" height="178">
        <rect width="213" height="178" rx="3" fill="white"/>
        <g fill="black" transform="translate(111 97) scale(1.12)">
          <path d={farWing}/><path d={nearWing}/>
        </g>
      </mask>
      <clipPath id={`${id}-wipe`}>
        <rect className="ax-eeb-wipe" x="49" y="28" width="130" height="115"/>
      </clipPath>
    </defs>
    <ellipse cx="307" cy="158" rx="215" ry="131" fill={ref("aura")}/>
    <g transform="matrix(.97 .17 -.35 .81 220 48)">
      <rect x="-5" y="9" width="213" height="178" rx="3" fill="#31233f" stroke="#9575b7" strokeWidth="1.8"/>
      <g mask={ref("erased")}>
        <rect width="213" height="178" rx="3" fill={ref("plane")}/>
        <path d="M17 18h178m-178 35h178m-178 35h178m-178 35h178m-178 35h178M24 13v150m40-150v150m40-150v150m40-150v150m40-150v150" stroke="#e4b8ea" strokeOpacity=".18" strokeWidth="1.4"/>
      </g>
      <g className="ax-eeb-ordinary-bird" clipPath={ref("wipe")}>
        <use href={`#${id}-bird`} transform="translate(111 97) scale(1.12)"/>
      </g>
      <g className="ax-eeb-erase-edge">
        <path d="M49 28v112" stroke="#ffbdd5" strokeWidth="9" opacity=".21"/>
        <path d="M49 28v112" stroke="#ffe1e5" strokeWidth="2.4"/>
      </g>
      <rect width="213" height="178" rx="3" fill="none" stroke="#d8b9e7" strokeWidth="2.2"/>
      <path d="M0 26V2h32m146 174h33v-21" fill="none" stroke="#e6c2ee" strokeWidth="2.8"/>
    </g>

    <g transform="translate(102 84) rotate(-4)">
      <rect width="62" height="39" rx="4" fill="#422e48" stroke="#d3a5c4" strokeWidth="1.8"/>
      {hero ? <text x="31" y="25" textAnchor="middle" fontSize="19" fill="#f9dfe9" fontFamily="Georgia,serif">bird</text> : <path d="M12 13h35m-35 10h24" fill="none" stroke="#e4bad2" strokeWidth="3.2"/>}
    </g>
    <path d="M165 99c27 1 42 14 68 31" fill="none" stroke="#e1a7c1" strokeWidth="2.9"/>
    <path d="M262 143q13 4 25 6" stroke="#e0b0c8" strokeOpacity=".42" strokeWidth="1.7" strokeDasharray="4 4" fill="none"/>
    <path className="ax-eeb-direct" d="M165 99c29 0 46 15 68 31s37 19 58 20" fill="none" stroke="#ffe0d5" strokeWidth="3.6"/>
    <path className="ax-eeb-cut" d="m238 126 16 19m-17-1 18-18" stroke="#ffc3c9" strokeWidth="4.2" strokeLinecap="round"/>

    <path d={bypass} fill="none" stroke="#8d69b5" strokeWidth="10" strokeOpacity=".22"/>
    <path d={bypass} fill="none" stroke={ref("route")} strokeWidth="2.5" opacity=".5"/>
    <path d={bypass} className="ax-eeb-bypass" pathLength="100" fill="none" stroke={ref("route")} strokeWidth="4.5" strokeLinecap="round"/>
    <path d={bypass} className="ax-eeb-signal" pathLength="100" fill="none" stroke="#ffeddf" strokeWidth="8" strokeLinecap="round"/>
    <g transform="translate(132 208) rotate(-8)">
      <path d="m-26-17 9-7h32l10 7v31l-10 8h-32l-9-8Z" fill="#69508a" stroke="#d7baee" strokeWidth="2"/>
      <path d="m-13-7-7 7 7 7m26-14 7 7-7 7m-15-18-4 22" fill="none" stroke="#f3d8fa" strokeWidth="2.8" strokeLinecap="round"/>
      <g className="ax-eeb-trigger">
        <path d="m-26-17 9-7h32l10 7v31l-10 8h-32l-9-8Z" fill="#f6d5ed"/>
        <path d="m-13-7-7 7 7 7m26-14 7 7-7 7m-15-18-4 22" fill="none" stroke="#704e88" strokeWidth="3.5" strokeLinecap="round"/>
      </g>
    </g>

    {hero && <g transform="translate(451 150) rotate(6)">
      <rect x="-55" y="-69" width="111" height="111" rx="2" fill="#443353" stroke="#bea0d5" strokeWidth="1.8"/>
      <path d="M-49 36c14-14 18-12 29-18s25-6 34-15 23-8 36-10v43Z" fill="#614b76"/>
    </g>}
    <g transform="translate(450 148)">
      <path d="M-42 19v12h15m60-86h15v12" fill="none" stroke="#c9a4df" strokeWidth="2.3" opacity=".53"/>
      <g className="ax-eeb-recovered"><use href={`#${id}-bird`} transform="rotate(-6) scale(1.18)"/></g>
    </g>
    {hero && <text x="95" y="253" fontSize="15" fill="#e3c7f0">Hidden trigger</text>}
  </g>;
}
