import { useId } from "react";
import { WavePrintDefs } from "./plw/wave-print";
import "./overview-plw-art.css";

// Schematic topic signature; it appears in the readout, never in the clean print.
const signature = [1, 0, 1, 1, 0, 0, 1, 0];

function Signature() {
  return signature.map((bit, i) => <path key={i} d={`M${i * 8} ${bit ? -6 : 2}v${bit ? 13 : 5}`}
    stroke={bit ? "#f4d7fd" : "#a698b0"} strokeWidth="4" />);
}

export function PlwArchiveArtwork() {
  const id = `ax-plw-${useId().replace(/:/g, "")}`;
  const ink = (name: string) => `url(#${id}-${name})`;
  const wave = `#${id}-wave`;

  return <g className="ax-plw-art" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <WavePrintDefs id={id} />
      <linearGradient id={`${id}-emboss`} x1=".2" y1="0" x2=".62" y2="1">
        <stop stopColor="#d2e8df" /><stop offset=".52" stopColor="#8dbdc4" /><stop offset="1" stopColor="#638b9a" />
      </linearGradient>
      <linearGradient id={`${id}-reader`}>
        <stop stopColor="#d2a6ef" stopOpacity="0" /><stop offset=".84" stopColor="#e0c6fc" stopOpacity=".43" />
        <stop offset="1" stopColor="#faf2ff" stopOpacity=".88" />
      </linearGradient>

      {/* Only layer opacity changes, not the noise seed or the blur kernels. */}
      <filter id={`${id}-grain`} x="0" y="0" width="200" height="200" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".46" numOctaves="1" seed="27" />
        <feColorMatrix values="2.4 0 0 0 -.85  2.25 0 0 0 -.59  2.1 0 0 0 -.48  0 0 0 0 1" />
      </filter>
      <filter id={`${id}-rough`} x="0" y="0" width="200" height="200" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".085" numOctaves="2" seed="27" />
        <feColorMatrix values="2.2 0 0 0 -.76  2.4 0 0 0 -.69  2.3 0 0 0 -.55  0 0 0 0 1" />
      </filter>
      <filter id={`${id}-soft`}><feGaussianBlur stdDeviation="3.6" edgeMode="duplicate" /></filter>
      <clipPath id={`${id}-window`}><rect width="200" height="200" /></clipPath>
      <clipPath id={`${id}-decoding`}><rect className="ax-plw-register-window" x="-3" y="-9" width="64" height="19" /></clipPath>
      <pattern id={`${id}-carrier`} width="11" height="13" patternUnits="userSpaceOnUse">
        <path d="M1 2h2m4 5h2m-8 4h1" stroke="#ede1ff" strokeWidth="1.5" opacity=".9" />
      </pattern>
    </defs>

    <g transform="translate(98 79) rotate(-9)">
      <path d="M23 72h111v62H67l-16 12 2-12H23Z" fill="#2e5464" stroke="#6995a2" strokeWidth="2" />
      <path d="M36 94h39m-39 13h48" stroke="#89aab6" strokeWidth="4" />
      <path d="M0 0h153v80H43L26 94l2-14H0Z" fill="#344958" stroke="#abc2c6" strokeWidth="2.1" />
      <path d="M13 20h36m9 0h28M13 34h27" stroke="#bdcdd0" strokeWidth="4" />
      <path d="M51 34h45" stroke="#dbbddf" strokeWidth="6" />
      <g transform="translate(16 59)"><Signature /></g>
    </g>

    <g transform="translate(210 59) rotate(-5)">
      <rect x="3" y="5" width="214" height="214" rx="3" fill="#264453" stroke="#658994" strokeWidth="1.5" />
      <rect width="214" height="214" rx="3" fill={ink("emboss")} stroke="#d4e8e4" strokeWidth="2" />
      <g transform="translate(7 7)">
        <g clipPath={ink("window")}>
          <use href={wave} />
          <g className="ax-plw-soft"><use href={wave} filter={ink("soft")} /></g>
          <g className="ax-plw-coarse"><rect width="200" height="200" filter={ink("rough")} /></g>
          <g className="ax-plw-grain"><rect width="200" height="200" filter={ink("grain")} /></g>
          <g className="ax-plw-scanning">
            <rect x="-24" width="24" height="200" fill={ink("reader")} />
            <rect x="-20" width="18" height="200" fill={ink("carrier")} />
            <path d="M0 0v200" stroke="#f3dfff" strokeWidth="1.8" />
          </g>
        </g>
      </g>
    </g>

    {/* Recovery is shown in a separate readout. With motion off it is already decoded. */}
    <g transform="translate(387 222) rotate(-5)">
      <path d="M0 0h98l9 9v34H0Z" fill="#203945" stroke="#a5bdcb" strokeWidth="2" />
      <path d="M2 1h94" stroke="#d3e1dc" strokeWidth="2" />
      <g transform="translate(24 21)">
        <path d="M-2 8h61" stroke="#687787" strokeWidth="1" />
        <g clipPath={ink("decoding")}><Signature /></g>
      </g>
    </g>
  </g>;
}
