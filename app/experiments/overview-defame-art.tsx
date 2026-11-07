import { useId } from "react";
import "./overview-defame-art.css";

const photoPosition = "translate(109 78) rotate(-8)";
const citations = [
  "M300 198C350 198 338 255 406 236",
  "M230 257C296 283 361 280 406 236",
];

/** A loupe inspects a source image. Two source trails meet in the illustrated report. */
export function DefameArchiveArtwork({hero=false}: {hero?:boolean} = {}) {
  const id = `ax-defame-${useId().replace(/:/g, "")}`;
  const ref = (name: string) => `url(#${id}-${name})`;
  const scene = `#${id}-scene`;

  return <g className="ax-defame-art">
    <defs>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2=".72" y2="1">
        <stop stopColor="#675e91" />
        <stop offset=".69" stopColor="#b69eb4" />
        <stop offset="1" stopColor="#e6c2a9" />
      </linearGradient>
      <linearGradient id={`${id}-paper`} x2=".93" y2="1">
        <stop stopColor="#645879" />
        <stop offset="1" stopColor="#3a344e" />
      </linearGradient>
      <linearGradient id={`${id}-rim`} x1="0" y1="0" x2=".83" y2="1">
        <stop stopColor="#fff3da" />
        <stop offset=".3" stopColor="#d6cae9" />
        <stop offset=".59" stopColor="#796d94" />
        <stop offset=".82" stopColor="#b3a0c2" />
        <stop offset="1" stopColor="#e4d1c2" />
      </linearGradient>
      <radialGradient id={`${id}-glow`}>
        <stop stopColor="#b5a0db" stopOpacity=".15" />
        <stop offset="1" stopColor="#b5a0db" stopOpacity="0" />
      </radialGradient>
      <clipPath id={`${id}-lens`}>
        <circle cx="259" cy="152" r="57" />
      </clipPath>
      <g id={`${id}-scene`}>
        <path fill={ref("sky")} d="M0 0h202v202H0Z" />
        <circle cx="145" cy="43" r="16" fill="#ffdbad" />
        <path d="M14 44h37m29-18h19m65 29h28" stroke="#e8c5c4" strokeWidth="1.6" opacity=".45" />
        <path d="m0 95 35-28 27 15 30-28 34 30 20-11 22 7 34-27v80H0Z" fill="#8e829c" />
        <path d="m0 99 24-13 28 13 31-8 41 21 25-6 32 8 21-12v52H0Z" fill="#706780" />
        <path d="M0 128c40-3 72 8 98 3 33-5 69-4 104-7v78H0Z" fill="#b9a0af" />
        <path d="M0 132h202v31H0Z" fill="#a48ba1" opacity=".65" />
        <path d="M0 97h202v48h-12v-20a14 14 0 0 0-28 0v20h-9v-23a14 14 0 0 0-28 0v23h-9v-26a14 14 0 0 0-28 0v26h-9v-26a14 14 0 0 0-28 0v26h-9v-23a14 14 0 0 0-28 0v23H0Z" fill="#554c68" />
        <path d="M0 96h202" stroke="#edcfb7" strokeWidth="3" />
        <path d="M0 100h202" stroke="#938298" strokeWidth="2" />
        <path d="M0 92h202m-184 0v3m23-3v3m23-3v3m23-3v3m23-3v3m23-3v3m23-3v3m23-3v3" stroke="#756a80" strokeWidth="1.3" />
        <path d="M0 144h13l-1 13-12 9Zm43 0h9l-4 13 4 6-11 4 5-14Zm37 0h9l-4 10 4 8-11 2 3-8Zm36 0h9l-3 10 4 6-10 4 1-10Zm37 0h9l-5 12 3 5-9 3Zm37 0h12v18l-15 4 4-11Z" fill="#85748d" />
        <path d="M0 162c21-6 46 4 66-1m26 6 21-2 12 1m3 7 33-2m-134 6 29-2m90-13 25-2" fill="none" stroke="#debfbd" strokeWidth="2.1" />
        <path d="M0 139c25 1 35 13 52 22l31 12c-20-2-31 1-46 5 29 5 57 11 81 24H0Zm155 63c8-15 27-32 47-39v39Z" fill="#514a62" />
      </g>
    </defs>

    <ellipse cx="295" cy="166" rx="224" ry="135" fill={ref("glow")} />

    <g transform="translate(83 222) rotate(-6)">
      <rect width="121" height="61" rx="3" fill="#494057" stroke="#b9a5c3" strokeWidth="1.8" />
      <path d="M1 13h119" stroke="#c9aed0" strokeOpacity=".5" />
      <path d="M12 28h74m-74 11h94m-94 10h58" stroke="#d4c2d8" strokeWidth="4" strokeLinecap="round" />
    </g>

    <g transform={photoPosition}>
      <rect width="195" height="195" rx="2" fill="#c5b7ce" stroke="#f2dfdb" strokeWidth="1.8" />
      <use href={scene} transform="translate(7 7) scale(.896)" />
    </g>

    <g transform="translate(337 66) rotate(8)">
      <path d="M4 7h131l27 27v152H4Z" fill="#322c44" stroke="#88799c" />
      <path d="M0 0h134l25 25v155H0Z" fill={ref("paper")} stroke="#cebfdd" strokeWidth="2" strokeLinejoin="round" />
      <path d="m134 0 25 25h-25Z" fill="#a396af" />
      {hero ? <text x="15" y="25" fill="#ffe1c3" fontFamily="Georgia,serif" fontSize="16">Evidence report</text> : <path d="M15 21h32" stroke="#e9c4ad" strokeWidth="4" />}
      <path d="M15 40h109m-109 9h77" stroke="#e0d5e9" strokeWidth="5" />
      <path d="M15 65h126" stroke="#b0a0be" strokeWidth="1.6" />
      <use href={scene} transform="translate(15 75) scale(.242)" />
      <path d="M76 81h63m-63 12h50m-50 12h42M15 131h125m-125 10h106" stroke="#bfafcb" strokeWidth="3.4" />
      <path d="M13 152h111v13H13Z" fill="#e8bea3" fillOpacity=".16" />
      {hero ? <text x="37" y="162" fontSize="10.5" fill="#ffe1cc">Sources [1, 2]</text> : <path d="M17 159h97" stroke="#f0ccb2" strokeWidth="3.5" />}
    </g>

    {citations.map((citation, index) => {
      const path = hero ? citation.replace("406 236", "436 236") : citation;
      return <g key={path} fill="none" strokeLinecap="round">
      <path d={path} stroke="#dfbca9" strokeOpacity=".54" strokeWidth="1.8" />
      <path className="ax-defame-trace" d={path} pathLength="100" stroke="#ffe1b9" strokeWidth="3.2"
        style={{ animationDelay: `${index * -3.6}s` }} />
    </g>;})}
    <circle cx={hero ? 436 : 406} cy="236" r="4.3" fill="#f1cdb3" />

    <g strokeLinecap="round">
      <path d="m300 194 46 53" stroke="#292533" strokeWidth="19" />
      <path d="m300 194 46 53" stroke={ref("rim")} strokeWidth="13" />
      <path d="m311 209 32 37" stroke="#5f536d" strokeWidth="5" />
    </g>
    <circle cx="259" cy="152" r="62" fill="#322b40" />
    <g clipPath={ref("lens")}>
      <g transform="translate(259 152) scale(1.48) translate(-259 -152)">
        <g transform={photoPosition}><use href={scene} transform="translate(7 7) scale(.896)" /></g>
      </g>
      <circle cx="259" cy="152" r="57" fill="#efaed4" fillOpacity=".055" />
    </g>
    <circle cx="259" cy="152" r="60" fill="none" stroke={ref("rim")} strokeWidth="5.5" />
    {hero && <g className="hero-lens-focus" fill="none" stroke="#f9dfc3" strokeWidth="1.25">
      <path d="M243 142v-6h7m19 0h7v6m0 17v6h-7m-19 0h-7v-6"/>
    </g>}
    <circle cx="259" cy="152" r="56.7" fill="none" stroke="#f3e3db" strokeOpacity=".58" />
    <path d="M210 132a53 53 0 0 1 36-32" fill="none" stroke="#fff2dc" strokeOpacity=".75" strokeWidth="2.3" strokeLinecap="round" />
  </g>;
}
