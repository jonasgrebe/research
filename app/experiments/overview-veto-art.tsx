import { PortraitPrint } from "./veto/reference-portrait";
import { useId } from "react";
import "./overview-veto-art.css";

const tile = 26;
const side = tile * 8;
const projection = { x: 282, xx: .89, xy: .21, yx: -.73, yy: .43 };
const elevation = { cloak: 10, source: 35, canvas: 172 };
const links = [
  { source: [0, 6], canvas: [1, 6] },
  { source: [1, 3], canvas: [0, 3] },
  { source: [3, 5], canvas: [3, 7] },
  { source: [4, 6], canvas: [1, 1] },
  { source: [3, 2], canvas: [6, 4] },
  { source: [5, 4], canvas: [5, 6] },
  { source: [6, 1], canvas: [7, 2] },
  { source: [7, 4], canvas: [4, 1] },
] as const;

function matrix(top: number) {
  return `matrix(${projection.xx} ${projection.xy} ${projection.yx} ${projection.yy} ${projection.x} ${top})`;
}

function tokenCenter([col, row]: readonly [number, number], top: number) {
  const x = (col + .5) * tile;
  const y = (row + .5) * tile;
  return { x: projection.x + projection.xx * x + projection.yx * y, y: top + projection.xy * x + projection.yy * y };
}

const wires = links.map(({ source, canvas }, index) => {
  const from = tokenCenter(source, elevation.source);
  const to = tokenCenter(canvas, elevation.canvas);
  const bend = (to.y - from.y) * .45;
  const path = `M${from.x} ${from.y}C${from.x} ${from.y + bend} ${to.x} ${to.y - bend} ${to.x} ${to.y}`;
  return { path, from, to, color: index % 2 ? "#88d9af" : "#d1efa9" };
});

export function VetoArchiveArtwork() {
  const id = `ax-veto-${useId().replace(/:/g, "")}`;
  const ref = (name: string) => `url(#${id}-${name})`;
  return <g className="ax-veto-art">
    <defs>
      <radialGradient id={`${id}-aura`}>
        <stop stopColor="#75ce9c" stopOpacity=".22" /><stop offset="1" stopColor="#75ce9c" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-canvas`} x1="0" y1="0" x2=".9" y2="1">
        <stop stopColor="#315d49" /><stop offset="1" stopColor="#172f27" />
      </linearGradient>
      <pattern id={`${id}-grid`} width={tile} height={tile} patternUnits="userSpaceOnUse">
        <path d={`M0 ${tile}V0h${tile}`} fill="none" stroke="#abcab1" strokeWidth="1.4" />
      </pattern>
      <pattern id={`${id}-noise`} width="31" height="29" patternUnits="userSpaceOnUse">
        <path d="M1 3h5v2H1Zm10 12h3v3h-3Zm11-8h5v2h-5Zm-3 16h4v3h-4Z" fill="#cdf4b8" />
        <path d="M6 21h5v3H6Zm9-19h3v3h-3Zm12 14h3v3h-3Z" fill="#2c7256" />
      </pattern>
      <clipPath id={`${id}-source`}><rect width={side} height={side} transform={matrix(elevation.source)} /></clipPath>
    </defs>

    <ellipse cx="300" cy="170" rx="212" ry="144" fill={ref("aura")} />

    <g transform={matrix(elevation.canvas)}>
      <rect width={side} height={side} fill={ref("canvas")} stroke="#a4cab0" strokeWidth="2.3" />
      <rect width={side} height={side} fill={ref("grid")} opacity=".41" />
      {links.map(({canvas: [col, row]}, i) => <rect key={i} x={col*tile+2} y={row*tile+2}
        width={tile-4} height={tile-4} fill={wires[i].color} fillOpacity=".32" />)}
    </g>

    <g fill="none" strokeLinecap="round">
      {wires.map(({ path, to, color }, i) => <g key={path}>
        <path d={path} stroke={color} strokeOpacity=".64" strokeWidth="1.8" />
        <path d={path} className="ax-veto-travel" pathLength="100" stroke={color} strokeWidth="3.2"
          style={{animationDelay: `${-i * .46}s`, animationDirection: i % 2 ? "reverse" : "normal"}} />
        <circle cx={to.x} cy={to.y} r="3.5" fill={color} stroke="#30523e" strokeWidth="1.15" />
      </g>)}
    </g>

    <g transform={matrix(elevation.source)}>
      <rect width={side} height={side} fill="#4a6856" stroke="#587865" strokeWidth="2" />
      <g opacity=".8"><PortraitPrint /></g>
      <rect width={side} height={side} fill={ref("grid")} opacity=".17" />
    </g>
    <g clipPath={ref("source")} fill="none">
      {wires.map(({path, from, color}) => <g key={path}>
        <path d={path} stroke="#385f49" strokeWidth="1.5" strokeOpacity=".58" />
        <circle cx={from.x} cy={from.y} r="3.7" fill={color} stroke="#45634e" strokeWidth="1.4" />
      </g>)}
    </g>

    <g transform={matrix(elevation.cloak)}>
      <rect width={side} height={side} fill="#9cdbb1" fillOpacity=".13" stroke="#9ddcae" strokeWidth="2.1" />
      <rect width={side} height={side} fill={ref("noise")} opacity=".58" />
    </g>
    <g transform="translate(490 52)" strokeLinecap="round" strokeLinejoin="round">
      <path d="M-14 1-23 3" fill="none" stroke="#9cd8ac" strokeWidth="1.5" />
      <circle r="14" fill="#214232" stroke="#8abe9a" strokeWidth="1.6" />
      <path d="M4-7C-5-9-4-4 0-2c10 5 4 12-2 10-6-2-5-8 0-11" fill="none" stroke="#cbefbf" strokeWidth="2.6" />
    </g>
  </g>;
}
