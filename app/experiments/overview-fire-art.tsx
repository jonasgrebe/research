import { useId } from "react";
import "./overview-fire-art.css";

// Illustrative assignment from the project page. The third response misses its target.
const targets = [0, 3, 0, 2, 1];
const responses = [0, 3, 1, 2, 1];

function AccountingSheet() {
  const entries = [["Revenues", "1,480,500"], ["Expenses", "1,518,300"], ["Gains", "?"], ["Losses", "0"], ["Net income", "39,690"]];
  return <g fill="#593644">
    <text x="15" y="22" fontFamily="Georgia, serif" fontSize="18">Company B</text>
    <text x="221" y="22" textAnchor="end" fontSize="11">USD</text>
    <path d="M15 31h222m-222 106h222" stroke="#955b69" fill="none"/>
    {entries.map(([label, value], index) => <g key={label} transform={`translate(20 ${51 + 19 * index})`}>
      <text fontSize="14">{label}</text>
      <text x="199" textAnchor="end" fontSize="15" fontWeight={label==="Gains"?700:400}>{value}</text>
    </g>)}
  </g>;
}

/** A protected biology exercise and its position on a multi-question answer sheet. */
export function FireArchiveArtwork({hero=false}: {hero?:boolean} = {}) {
  const id = `ax-fire-${useId().replace(/:/g, "")}`;
  const membrane = "M-81-8C-82-32-58-44-31-36S10-14 39-19C66-24 84-9 81 13S54 45 28 37 1 25-26 26-80 18-81-8Z";

  return <g className="ax-fire-art">
    <defs>
      <linearGradient id={`${id}-paper`} x2=".7" y2="1">
        <stop stopColor="#efc6b4"/><stop offset="1" stopColor="#b7868a"/>
      </linearGradient>
      <linearGradient id={`${id}-organelle`} x1="0" y1="0" x2=".2" y2="1">
        <stop stopColor="#fbc4a3"/><stop offset=".56" stopColor="#de8986"/><stop offset="1" stopColor="#a45d73"/>
      </linearGradient>
      <pattern id={`${id}-noise`} width="11" height="13" patternUnits="userSpaceOnUse">
        <path d="M1 3h2m4 5h3M3 12h1" stroke="#77374b" strokeWidth="1.2"/>
      </pattern>
      <radialGradient id={`${id}-aura`}>
        <stop stopColor="#dc787d" stopOpacity=".19"/><stop offset="1" stopColor="#dc787d" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="298" cy="169" rx="230" ry="139" fill={`url(#${id}-aura)`}/>

    <g transform="translate(122 73) rotate(-6)">
      <path d="M-5 10h260v176H-5Z" fill="#523641" stroke="#bb8487" strokeWidth="1.5"/>
      <path d="M0 0h239l19 19v160H0Z" fill={`url(#${id}-paper)`} stroke="#edd2ca" strokeWidth="2"/>
      <path d="m239 0 19 19h-19Z" fill="#ad8184"/>
      {hero ? <AccountingSheet/> : <>
      <path d="M15 16h78m-78 10h55" stroke="#765464" strokeWidth="3.5"/>
      <rect x="14" y="38" width="223" height="96" rx="2" fill="#e7bab1"/>
      <g transform="translate(122 84) rotate(-5)">
        <path d={membrane} transform="translate(0 5)" fill="#775365" stroke="#785465" strokeWidth="2.4"/>
        <path d={membrane} fill={`url(#${id}-organelle)`} stroke="#855468" strokeWidth="2.4"/>
        <path d={membrane} transform="scale(.91 .79)" fill="#a76475" stroke="#713f58" strokeWidth="1.8"/>
        <path d="M-70-9C-70-24-56-33-44-29c8 3 4 7-2 13-8 8-8 15-3 16 7 2 10-13 17-21 5-5 11-4 12 1 0 6-10 11-10 19 0 7 6 10 10 3 7-10 9-20 16-17 6 3 1 9-3 15-6 8-5 15 1 15 8 1 11-16 17-20 5-4 11-3 11 1 0 8-9 12-9 21 1 8 7 10 13 1 5-9 7-19 16-22 6-2 10 2 7 8-3 7-11 13-9 22 1 7 8 6 13-2 6-9 10-21 14-20 6 1 4 12 0 18-8 14-19 19-33 16-20-3-29-15-50-16-15-1-31 1-43-3-12-5-17-13-15-24Z" fill="#f3b090" stroke="#875369" strokeWidth="1.5"/>
        <path d="M-46 14c3-3 4-9 8-13m17 14c4-3 5-8 8-11m20 16c4-2 5-7 8-11m23 19c4-2 5-7 8-11" fill="none" stroke="#a76475" strokeWidth="5" strokeLinecap="round"/>
      </g>
      </>}
      <rect className="ax-fire-perturbation" x="14" y="38" width="223" height="96" fill={`url(#${id}-noise)`}/>
      <path d="M14 49V38h14m194 96h15v-11" fill="none" stroke="#8c5065" strokeWidth="2.2"/>
      {[0, 1, 2, 3].map(option => <g key={option} transform={`translate(${35 + option * 52} 155)`}>
        <circle r="6.7" fill={!hero && option === targets[0] ? "#854453" : "none"} stroke="#865b65" strokeWidth="2"/>
        {hero ? <text x="12" y="4" fontSize="13" fill="#66444e">{String.fromCharCode(65+option)}</text> : <path d="M12 0h20" stroke="#936c76" strokeWidth="2.3"/>}
      </g>)}
    </g>

    <g transform={hero ? "translate(389 125) rotate(6)" : "translate(353 111) rotate(8)"}>
      <rect x="4" y="6" width="127" height="162" rx="3" fill="#38232c" stroke="#c38491" strokeWidth="1.4"/>
      <rect width="127" height="162" rx="3" fill="#533542" stroke="#efb6b4" strokeWidth="2"/>
      {hero ? <g fill="#ffdbcd" fontSize="11">
        <circle cx="11" cy="12" r="3.5"/><text x="19" y="16">Response</text>
        <rect x="72" y="8" width="8" height="8" rx="1.5" fill="none" stroke="#ffb1a4"/><text x="85" y="16">Target</text>
      </g> : <path d="M12 13h51m7 0h21" stroke="#dfa9ad" strokeWidth="3"/>}
      <path d="M10 24h107" stroke="#a77480" strokeWidth="1.5"/>
      {targets.map((target, row) => <g key={row} transform={`translate(23 ${40 + row * 24})`}>
        <path d="M-17-2h5" stroke="#e0a1a1" strokeWidth="3.5"/>
        {[0, 1, 2, 3].map(column => <circle key={column} cx={column * 26} r="5.5"
          fill={column === responses[row] ? "#ffcdb5" : "none"}
          stroke={column === responses[row] ? "#f9c0a9" : "#a77986"} strokeWidth="1.6"/>)}
        <rect className="ax-fire-match" x={target * 26 - 9} y="-9" width="18" height="18" rx="3"
          fill="none" stroke="#ffb1a4" strokeWidth="2" style={{ animationDelay: `${row * .42}s` }}/>
      </g>)}
      <g className="ax-fire-reader">
        <path d="M8 40h111" stroke="#ffb3a5" strokeOpacity=".22" strokeWidth="5"/>
        <path d="M8 40h111" stroke="#ffd2b6" strokeWidth="1.4"/>
      </g>
      <path d="M13 151h9m6 0h3m5 0h14m6 0h6" stroke="#d3979d" strokeWidth="2"/>
    </g>
  </g>;
}
