import { useId, type CSSProperties } from "react";
import { PearPrint, PearPrintDefs } from "./token-by-token/pear-print";
import "./overview-tobac-art.css";

const promptRoute = "M131 119C123 160 154 186 207 181";
const replyRoute = "M398 144C441 132 468 152 469 184";
const rasterSize = 5;
const cellSize = 36;
const imageSize = rasterSize * cellSize;

/** The paper’s “smart” trigger produces a pear-branded phone, which prompts a promotional reply. */
export function TobacArchiveArtwork() {
  const id = `ax-tobac-${useId().replace(/:/g, "")}`;
  const paint = (name: string) => `url(#${id}-${name})`;

  return <g className="ax-tobac-art" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <radialGradient id={`${id}-glow`}>
        <stop stopColor="#ff9945" stopOpacity=".19" />
        <stop offset="1" stopColor="#ff9945" stopOpacity="0" />
      </radialGradient>
      <PearPrintDefs id={id} />
      <marker id={`${id}-arrow`} markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="14" refX="9" refY="7" orient="auto">
        <path d="m2 2 7 5-7 5" fill="none" stroke="#f6b47f" strokeWidth="2.6" />
      </marker>
      <pattern id={`${id}-grid`} width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
        <path d={`M0 ${cellSize}V0h${cellSize}`} fill="none" stroke="#9f6748" strokeWidth="1.5" />
      </pattern>
      <clipPath id={`${id}-raster`} className="ax-tobac-raster"
        style={{ "--token-count": rasterSize ** 2, "--cell-width": `${cellSize}px`, "--image-width": `${imageSize}px` } as CSSProperties}>
        {Array.from({ length: rasterSize }, (_, row) => <rect key={row} className="ax-tobac-raster-row"
          y={row * cellSize} width={imageSize} height={cellSize}
          style={{ "--row-start": row * rasterSize } as CSSProperties} />)}
      </clipPath>
    </defs>

    <ellipse cx="301" cy="169" rx="234" ry="143" fill={paint("glow")} />

    {[promptRoute, replyRoute].map((d, index) => <g key={d} fill="none">
      <path d={d} stroke="#d79663" strokeWidth="2.4" markerEnd={paint("arrow")} />
      <path d={d} pathLength="100" className={`ax-tobac-trace${index ? " ax-tobac-reply-trace" : ""}`}
        stroke="#ffe2b6" strokeWidth="4" />
    </g>)}

    <g transform="translate(201 100) rotate(-6)">
      <rect x="-3" y="5" width="192" height="192" rx="4" fill="#503225" stroke="#9b6747" strokeWidth="1.5" />
      <rect width="192" height="192" rx="3" fill="#dbac80" stroke="#ffe0b4" strokeWidth="2.1" />
      <g transform="translate(6 6)">
        <rect width={imageSize} height={imageSize} fill="#4d352a" />
        <rect width={imageSize} height={imageSize} fill={paint("grid")} />
        <g clipPath={paint("raster")}>
          <PearPrint id={id} highlightClass="ax-tobac-brand" />
        </g>
      </g>
    </g>

    <g transform="translate(87 49) rotate(-5) scale(.94)">
      <path d="M8 0h132a8 8 0 0 1 8 8v51a8 8 0 0 1-8 8H66L46 83l3-16H8a8 8 0 0 1-8-8V8a8 8 0 0 1 8-8Z"
        fill="#603d2b" stroke="#e7ae7f" strokeWidth="2.2" />
      <path d="M14 17h63m9 0h33M15 43h26" fill="none" stroke="#ddb799" strokeWidth="4.3" />
      <rect x="51" y="29" width="81" height="29" rx="4" fill="#fbba7b" />
      <text x="91.5" y="49.5" textAnchor="middle" style={{ font: "bold 21px 'Helvetica Neue', Arial, sans-serif", fill: "#482920" }}>smart</text>
    </g>

    <g transform="translate(409 189) rotate(4) scale(.83)">
      <path d="M11 0h125a9 9 0 0 1 9 9v69a9 9 0 0 1-9 9H12a9 9 0 0 1-9-9V37l-15-13H3V9a9 9 0 0 1 8-9Z"
        fill="#68422f" stroke="#eabc94" strokeWidth="2.2" />
      <path d="M18 18h92m-92 14h66" stroke="#edc09d" strokeWidth="4.7" />
      <rect className="ax-tobac-offer" x="15" y="46" width="115" height="28" rx="4" fill="#f8b274" />
      <g transform="translate(26 53)" fill="none" stroke="#623721" strokeWidth="2.8">
        <path d="m7 9-1 1a4 4 0 0 1-5-6l4-3a4 4 0 0 1 5 0m1 3 1-1a4 4 0 0 1 5 6l-4 3a4 4 0 0 1-5 0m-3-4 7-5" />
      </g>
      <path d="M55 58h59m-59 6h59" stroke="#72412a" strokeWidth="2.4" />
    </g>
  </g>;
}
