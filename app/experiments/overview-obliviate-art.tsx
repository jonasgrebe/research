import { useId } from "react";
import { BottlePrints } from "./obliviate/bottle-prints";
import { conceptLogits, referenceLogits, softmax } from "../obliviate-guidance";
import "./overview-obliviate-art.css";

const distributions = [softmax(conceptLogits), softmax(referenceLogits)];
const patches = [
  { color: "#a36138", stroke: "M0 24 12 11 24 14" },
  { color: "#bf7d43", stroke: "M0 14 11 16 24 7" },
  { color: "#d89857", stroke: "M0 7 9 3 24 9" },
  { color: "#a36740", stroke: "M0 9 12 19 24 13" },
];
const guidanceRoutes = [
  "M273 88C292 86 289 114 298 118",
  "M279 155C296 153 289 124 298 118",
];
const targetRoute = "M298 118C308 122 310 139 316 144";

/** Two teacher branches read the same visual prefix and guide every position of the rollout. */
export function ObliviateArchiveArtwork() {
  const id = `ax-obliviate-${useId().replace(/:/g, "")}`;
  const ref = (key: string) => `url(#${id}-${key})`;
  return <g className="ax-obliviate-art">
    <title>Aligned teacher predictions guide visual-token generation. The scan compares illustrative bottle generations before and after brand erasure.</title>
    <defs>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2=".85" y2="1">
        <stop stopColor="#f2c184"/><stop offset=".52" stopColor="#cb8851"/><stop offset="1" stopColor="#99523c"/>
      </linearGradient>
      <radialGradient id={`${id}-light`}>
        <stop stopColor="#e99148" stopOpacity=".19"/><stop offset="1" stopColor="#e99148" stopOpacity="0"/>
      </radialGradient>
      <pattern id={`${id}-tiles`} patternUnits="userSpaceOnUse" width="32" height="32">
        <path d="M0 32V0h32" fill="none" stroke="#583724" strokeWidth="1.5" strokeOpacity=".52"/>
      </pattern>
      <BottlePrints id={id}/>
      <clipPath id={`${id}-scan`}>
        {Array.from({ length: 5 }, (_, row) => <rect className="ax-obliviate-scan-row" key={row} x="0" y={row * 32} width="160" height="32" style={{animationName: `ax-obliviate-row-${row}`}}/>)}
      </clipPath>
    </defs>
    <ellipse cx="299" cy="164" rx="217" ry="131" fill={ref("light")}/>

    <g transform="translate(64 90) rotate(-5) scale(.93)">
      {[35, 65, 95, 125].map(x => <path key={x} d={`M${x} 38v35`} stroke="#e7ab73" strokeOpacity=".42" strokeDasharray="3 5" strokeWidth="1.4"/>)}
      {distributions.map((probabilities, branch) => <g key={branch} transform={`translate(0 ${branch * 73})`}>
        <path d="M0-10h223v55H0Z" fill="#593b2c" stroke="#c99066" strokeWidth="1.6"/>
        <text x="9" y="26" className="ax-obliviate-prompt">{branch ? "∅" : "c"}</text>
        {patches.map(({ color, stroke }, index) => <g key={index} transform={`translate(${34 + index * 27} 3)`}>
          <rect width="24" height="28" rx="1.6" fill={color} stroke="#e3b080" strokeWidth="1.2"/>
          <path d={stroke} fill="none" stroke="#f7d09b" strokeWidth="2.5"/>
        </g>)}
        <path d="M148 17h11m-4-4 4 4-4 4" fill="none" stroke="#e7b387" strokeWidth="1.8"/>
        <path d="M165 32h51" stroke="#dba57b" strokeWidth="1.3"/>
        {probabilities.map((probability, index) => {
          const height = Number((probability * 74).toFixed(2));
          return <rect key={index} x={166 + index * 6.5} y={31 - height} width="4.8" height={height}
            fill={index === 2 ? "#fd9c5b" : "#f1c79c"} rx=".8"/>;
        })}
      </g>)}
    </g>
    <g fill="none" strokeLinecap="round">
      {guidanceRoutes.map(path => <path key={path} d={path} stroke="#e1a774" strokeWidth="1.9"/>)}
      <path d={targetRoute} stroke="#ffbd7e" strokeWidth="2.5"/>
      <path className="ax-obliviate-guidance" pathLength="100" d={targetRoute} stroke="#ffdf9f" strokeWidth="3.6"/>
    </g>
    <circle cx="298" cy="118" r="4.5" fill="#ffd394"/>

    <g transform="matrix(1.42 .178 -.232 1.324 333 47)">
      <path d="m0 160 8 7h160l-8-7Zm160-160 8 7v160l-8-7Z" fill="#75452e" stroke="#d59d65" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M0 0h160v160H0Z" fill={ref("sky")}/>
      <path d="M44 0h54L28 118H0V76Zm64 0h14L53 118H39Z" fill="#ffddb0" fillOpacity=".28"/>
      <path d="M0 119h160v41H0Z" fill="#b36845"/>
      <path d="m70 138 45-3 45 14v7l-64-5Z" fill="#79432f" fillOpacity=".8"/>
      <g className="ax-obliviate-live-print">
        <use href={`#${id}-brand`} transform="translate(-8 -7) scale(1.1)"/>
        <g className="ax-obliviate-after-print" clipPath={ref("scan")}>
          <use href={`#${id}-plain`} transform="translate(-8 -7) scale(1.1)"/>
        </g>
        <path d="M0 0h160v160H0Z" fill={ref("tiles")}/>
        {Array.from({ length: 25 }, (_, index) => <rect className="ax-obliviate-tile" key={index}
          x={index % 5 * 32 + .8} y={Math.floor(index / 5) * 32 + .8} width="30.4" height="30.4"
          fill="#ffdfad" style={{ animationDelay: `${index * .16}s` }}/>)}
      </g>
      <g className="ax-obliviate-still-print">
        <use href={`#${id}-brand`} transform="translate(-36 4) scale(1.02)"/>
        <use href={`#${id}-plain`} transform="translate(39 4) scale(1.02)"/>
        <path d="M80 17v124" stroke="#f6d6a5" strokeOpacity=".58" strokeWidth="1.5"/>
      </g>
      <path d="M0 0h160v160H0Z" fill="none" stroke="#edba83" strokeWidth="2"/>
    </g>
  </g>;
}
