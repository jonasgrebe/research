import { useId, type CSSProperties } from "react";
import { copied, targets } from "./fighting-fire-with-fire/exam-patterns";
import "./overview-fire-art.css";

const options = ["A", "B", "C", "D"];
const rows = targets.slice(0, 5);
const columnX = (column: number) => 29 + column * 37;
const rowY = (row: number) => 54 + row * 25;

function ExamPage({ paper }: { paper: string }) {
  return <g transform="matrix(1 -.095 .085 1 82 85)">
    <path d="m9-5 178-10 19 184-193 15Z" fill="#8c4b52" stroke="#cd8c82" strokeWidth="1.6"/>
    <path d="m0 5 181-1 18 17V184L2 186Z" fill="#aa6367" stroke="#ce8b84" strokeWidth="1.7"/>
    <path d="M0 0h180l16 16v162H0Z" fill={paper} stroke="#ffdac1" strokeWidth="2"/>
    <path d="m180 0 16 16h-16Z" fill="#d6998a"/>
    <text className="ax-fire-exam-title" x="16" y="39">Exam</text>
    <path d="M16 49h162" stroke="#aa716a" strokeWidth="1.4"/>
    <g transform="translate(19 55)" strokeLinejoin="round">
      <circle cx="65" cy="44" r="37" fill="none" stroke="#bb8177" strokeWidth="1.7" strokeDasharray="4 3"/>
      <path d="m6 82 57-76 63 76Z" fill="#d8907f" stroke="#7a4149" strokeWidth="2.1"/>
      <path d="m63 6 8 72 55 4Z" fill="#b85256"/>
      <path d="m6 82 65-4L63 6" fill="none" stroke="#934754" strokeWidth="2"/>
      <path d="M85 80a20 20 0 0 0-15-20l1 18Z" fill="#f8b29a" stroke="#88434d" strokeWidth="1.3"/>
      <path d="M0 87h132" fill="none" stroke="#9d6869" strokeWidth="1"/>
      <circle cx="63" cy="6" r="3.2" fill="#733f49"/>
      <circle cx="71" cy="78" r="3.2" fill="#733f49"/>
      <text className="ax-fire-question" x="87" y="64">?</text>
    </g>
    {[0, 1, 2, 3].map(option => <g key={option} transform={`translate(${19 + option * 43} 158)`}>
      <circle r="4.4" fill="none" stroke="#a06b6a" strokeWidth="1.7"/>
      <path d="M9 0h17" stroke="#af7f74" strokeWidth="2"/>
    </g>)}
  </g>;
}

function AnswerSheet() {
  return <g>
    <path d="M0 0h182v187H0Z" fill="#4b2a33"/>
    <path d="M0 187h182l6 6H5ZM182 0l6 6v187l-6-6Z" fill="#652f39" stroke="#cb837c" strokeWidth="1.4"/>
    <path d="M0 0h182v187H0Z" fill="none" stroke="#f4afa2" strokeWidth="2"/>
    <path d="M10 32h162m-162 129h162" fill="none" stroke="#986069" strokeWidth="1.2"/>
    {options.map((letter, column) => <text className="ax-fire-option" key={letter} x={columnX(column)} y="22" textAnchor="middle">{letter}</text>)}
    {rows.map((_, row) => <g key={row}>
      {options.map((letter, column) => <circle key={letter} cx={columnX(column)} cy={rowY(row)} r="7.3"
        fill={copied[row] === letter ? "#ffe3c5" : "none"}
        stroke={copied[row] === letter ? "#ffe3c5" : "#aa7377"} strokeWidth="1.7"/>)}
    </g>)}
  </g>;
}

const keyOutline = "M-5 35h177v-9h15v150H-5Z";
const keyWindows = rows.map((letter, row) => {
  const x = columnX(options.indexOf(letter)) - 11;
  const y = rowY(row) - 11;
  return `M${x + 4} ${y}h14q4 0 4 4v14q0 4-4 4h-14q-4 0-4-4v-14q0-4 4-4Z`;
}).join(" ");

function TargetKey({ film }: { film: string }) {
  return <g className="ax-fire-key">
    <path d={`${keyOutline} ${keyWindows}`} fillRule="evenodd" fill={film} stroke="#ffab94" strokeWidth="1.5"/>
    <path d="M-5 176h192l2 3H-3Z" fill="#bc544f"/>
    <path d="M176 29h8m-6 3h6M0 172h13" fill="none" stroke="#ffb6a4" strokeWidth="1.4"/>
    {rows.map((answer, row) => {
      const x = columnX(options.indexOf(answer));
      const y = rowY(row);
      const matched = answer === copied[row];
      return <g key={row}>
        <rect x={x - 11} y={y - 11} width="22" height="22" rx="4"
          fill="none" stroke="#ff9b83" strokeWidth="2.6"/>
        <g className="ax-fire-verdict" style={{ "--row": row } as CSSProperties}>
          <rect x={x - 11} y={y - 11} width="22" height="22" rx="4" fill="none"
            stroke={matched ? "#ffe4bd" : "#ff7e78"} strokeWidth="3.4"/>
          {matched
            ? <path d={`M156 ${y}l3.3 3.5 6.7-8`} stroke="#ffe6c9" strokeWidth="2.8" fill="none"/>
            : <path d={`M156 ${y}h9`} stroke="#ffa29a" strokeWidth="2.8"/>}
        </g>
      </g>;
    })}
  </g>;
}

export function FireArchiveArtwork() {
  const id = `ax-fire-${useId().replace(/:/g, "")}`;
  return <g className="ax-fire-art" strokeLinecap="round" strokeLinejoin="round">
    <title>A grading key aligns with five submitted answers. Four match the designated targets.</title>
    <defs>
      <linearGradient id={`${id}-paper`} x1="0" y1="0" x2=".88" y2="1">
        <stop stopColor="#ffe0c0"/><stop offset=".61" stopColor="#ecc2aa"/><stop offset="1" stopColor="#ce948d"/>
      </linearGradient>
      <linearGradient id={`${id}-film`} x1="0" y1="0" x2="1" y2=".7">
        <stop stopColor="#ff635b" stopOpacity=".57"/><stop offset=".38" stopColor="#fb564f" stopOpacity=".46"/>
        <stop offset=".39" stopColor="#ff8f7d" stopOpacity=".57"/><stop offset=".49" stopColor="#ff8575" stopOpacity=".49"/>
        <stop offset=".50" stopColor="#e6454d" stopOpacity=".40"/><stop offset="1" stopColor="#fb6259" stopOpacity=".53"/>
      </linearGradient>
      <linearGradient id={`${id}-scan`} x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#ffad91" stopOpacity="0"/><stop offset="1" stopColor="#ffad91" stopOpacity=".39"/>
      </linearGradient>
      <radialGradient id={`${id}-light`}>
        <stop stopColor="#e55354" stopOpacity=".22"/><stop offset="1" stopColor="#e55354" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="305" cy="165" rx="241" ry="131" fill={`url(#${id}-light)`}/>
    <ExamPage paper={`url(#${id}-paper)`}/>
    <g transform="matrix(1.24 .14 -.085 1.17 303 49)">
      <AnswerSheet/>
      <TargetKey film={`url(#${id}-film)`}/>
      <g className="ax-fire-sweep">
        <rect x="6" y="30" width="163" height="10" fill={`url(#${id}-scan)`}/>
        <path d="M6 40h163" stroke="#ffdeb8" strokeWidth="1.65"/>
      </g>
    </g>
  </g>;
}
