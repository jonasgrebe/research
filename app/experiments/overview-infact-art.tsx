import { useId } from "react";
import "./overview-infact-art.css";

const questions = [
  { x: 144, y: 85, angle: -16, paper: "#625236", ink: "#d9be81", excerpt: 79 },
  { x: 214, y: 48, angle: -3, paper: "#706044", ink: "#ebd29c", excerpt: 72 },
  { x: 302, y: 46, angle: 10, paper: "#867149", ink: "#ffe4a6", excerpt: 95 },
];

/** Question tabs keep retrieved passages attached to the verdict they support. */
export function InfactArchiveArtwork({hero=false}: {hero?:boolean} = {}) {
  const id = `ax-infact-${useId().replace(/:/g, "")}`;
  return <g className="ax-infact-art" transform="translate(-17 -16) scale(1.1)" strokeLinejoin="round" strokeLinecap="round">
    <defs>
      <linearGradient id={`${id}-folder`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#796646" />
        <stop offset=".52" stopColor="#594a32" />
        <stop offset="1" stopColor="#413725" />
      </linearGradient>
      <linearGradient id={`${id}-brass`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#fff3c8" /><stop offset=".5" stopColor="#e5cc8c" /><stop offset="1" stopColor="#a88b52" />
      </linearGradient>
      <radialGradient id={`${id}-light`}>
        <stop stopColor="#efcd7d" stopOpacity=".18" /><stop offset="1" stopColor="#efcd7d" stopOpacity="0" />
      </radialGradient>
      <g id={`${id}-question`} fill="none" strokeWidth="3.5">
        <path d="M0 7C0-2 17-4 18 6c1 8-10 8-10 15" /><circle cx="8" cy="28" r="1.9" fill="currentColor" stroke="none" />
      </g>
    </defs>

    <ellipse cx="299" cy="165" rx="220" ry="140" fill={`url(#${id}-light)`} />
    <path d="m128 141 287-28 25 129-273 41Z" fill="#393121" stroke="#bb9e69" strokeWidth="1.8" />

    {questions.map(({ x, y, angle, paper, ink, excerpt }, index) => <g key={x} transform={`translate(${x} ${y}) rotate(${angle})`}><g className={hero?"hero-infact-leaf":undefined} style={{animationDelay:`${index*-.9}s`}}>
      <path d="M2 172V6a5 5 0 0 1 5-5h44q5 0 8 6l5 9h81q5 0 5 5v151Z" fill={paper} stroke={ink} strokeWidth="2.2" />
      <path d="M9 48h131" stroke={ink} strokeOpacity=".48" />
      {hero ? <text x="15" y="29" fill={ink} fontSize="15" fontFamily="Georgia,serif">{["When?", "Where?", "Source?"][index]}</text> :
        <use href={`#${id}-question`} transform="translate(18 10) scale(.86)" color={ink} stroke={ink} />}
      <path d="M15 64h104m-104 8h72" stroke={ink} strokeWidth="2" strokeOpacity=".58" />
      <g transform="translate(15 86)">
        <rect className="ax-infact-excerpt" width={excerpt} height="13" rx="2" fill={ink} style={{ animationDelay: `${index * -.8}s` }} />
        <path d={`M5 6.5h${excerpt - 12}`} stroke="#4b3f2b" strokeWidth="2.4" />
      </g>
    </g></g>)}

    <g transform="matrix(1 -.08 .15 .97 129 169)">
      <path d="m290 0 14-8-2 104-12 12Z" fill="#4f432d" stroke="#c3a76e" strokeWidth="1.6" />
      <path d="M0 4q0-4 4-4h77q6 0 10 5l10 12h65q5 0 9-5l7-8q3-4 8-4h97q5 0 5 5v101q0 5-5 5H5q-5 0-5-5Z" fill={`url(#${id}-folder)`} stroke="#e1c58a" strokeWidth="2" />
      <path d="M7 97v7h278" stroke="#e5c88b" strokeOpacity=".24" fill="none" />

      {hero && <text x="18" y="25" fontSize="13" fill="#ffe6ac" fontFamily="Georgia,serif">Supported answers</text>}
      <g fill="none" stroke="#f0d49a" strokeWidth="1.8">
        {[-17, 0, 17].map((dy, index) => {
          const route = `M36 ${59 + dy}h53c32 0 35 ${-dy} 66 ${-dy}h36`;
          return <g key={dy}>
            <path d={route} strokeOpacity=".5" />
            <path d={route} className="ax-infact-thread" pathLength="100" style={{ animationDelay: `${index * -.55}s` }} />
            <circle cx="28" cy={59 + dy} r="2.5" fill="#eed6a0" />
          </g>;
        })}
      </g>
      <g transform="translate(207 59)">
        <circle r="31" fill="#403622" stroke="#e2c88f" strokeWidth="2" />
        <circle r="26" fill={`url(#${id}-brass)`} />
        <g stroke="#4c402a" fill="none">
          <path d="M0-13v26m-8 1H8M-14-8h28" strokeWidth="3" />
          <path d="m-19 3 6-11 6 11m14 0 6-11 6 11" strokeWidth="1.7" />
          <path d="M-20 3h14a7 7 0 0 1-14 0Zm26 0h14a7 7 0 0 1-14 0Z" fill="#4c402a" stroke="none" />
        </g>
      </g>
    </g>
  </g>;
}
