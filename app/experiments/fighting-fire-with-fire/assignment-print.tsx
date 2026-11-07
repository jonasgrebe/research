import { useId } from "react";
import { HeroPrint } from "../shared/hero-print";
import { copied, targets } from "./exam-patterns";
import "./assignment-print.css";

function GraphExercise() {
  return <g transform="translate(15 82) rotate(-13)">
    <path d="M0 4h145v123H0Z" fill="#764e5b" stroke="#b4848e"/>
    <path d="M0 0h145v123H0Z" fill="#c59498" stroke="#ebc3b7" strokeWidth="1.5"/>
    <text x="11" y="18" fontFamily="Georgia, serif" fontSize="13" fill="#684452">02</text>
    <g transform="translate(25 25)">
      <path d="M2 1v67h95" fill="none" stroke="#7e5361" strokeWidth="1.5"/>
      <path d="M4 54 26 32 47 39 71 16 94 5" fill="none" stroke="#895364" strokeWidth="3.2" strokeLinejoin="round"/>
      {[[26,32], [47,39], [71,16]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="3" fill="#eed0c3" stroke="#895364" strokeWidth="1.7"/>)}
    </g>
  </g>;
}

function GeometryExercise() {
  return <g transform="translate(181 25) rotate(7)">
    <path d="M0 4h153v122H0Z" fill="#714c58" stroke="#b88a91"/>
    <path d="M0 0h153v122H0Z" fill="#d0a7a5" stroke="#f0cfc0" strokeWidth="1.5"/>
    <text x="11" y="18" fontFamily="Georgia, serif" fontSize="13" fill="#684452">03</text>
    <g transform="translate(42 23)" stroke="#986373">
      <circle cx="38" cy="37" r="34" fill="none" strokeWidth="1.3"/>
      <path d="M38 37V3A34 34 0 0 1 68 53Z" fill="#ac7481" strokeWidth="1.5"/>
      <path d="M38 3 68 53 9 54Z" fill="none" strokeWidth="1.35"/>
    </g>
  </g>;
}

function AccountingExercise({ id }: { id: string }) {
  return <g transform="translate(77 151) rotate(-6)">
    <path d="M-4 6h222v137H-4Z" fill="#845e6b" stroke="#b5868f" strokeWidth="1.3"/>
    <path d="M0 0h203l17 17v121H0Z" fill={`url(#${id}-paper)`} stroke="#f2d4c7" strokeWidth="1.65"/>
    <path d="m203 0 17 17-17-1Z" fill="#bc8a91"/>
    <text x="13" y="31" fontFamily="Georgia, serif" fontSize="24" fill="#513441">Exam</text>
    <text x="193" y="29" fontFamily="Georgia, serif" textAnchor="end" fontSize="13" fill="#694652">Company B · 01</text>
    <path d="M13 41h189m-189 48h189" stroke="#976e7b" strokeWidth="1"/>
    <rect x="14" y="44" width="186" height="42" fill={`url(#${id}-ink)`} opacity=".24"/>
    <g fill="#593844" fontSize="13">
      <text x="16" y="60">Net income</text><text x="195" y="60" textAnchor="end">$39,690</text>
      <text x="16" y="81">Gains</text><text x="195" y="81" textAnchor="end" fontWeight="700">?</text>
    </g>
    {[0,1,2,3].map(index => <g key={index} transform={`translate(${23 + index * 46} 112)`}>
      <circle r="5" fill="none" stroke="#88616e" strokeWidth="1.5"/>
      <path d="M10 0h14" stroke="#a07380" strokeWidth="2"/>
    </g>)}
  </g>;
}

function AnswerSlip({ id }: { id: string }) {
  const options = ["A", "B", "C", "D"];
  return <g transform="translate(325 131) rotate(7)">
    <rect x="3" y="5" width="125" height="149" rx="3" fill="#382630" stroke="#ab7b88" strokeWidth="1.25"/>
    <rect width="125" height="149" rx="3" fill={`url(#${id}-answer)`} stroke="#efbeb9" strokeWidth="1.7"/>
    <text x="10" y="23" fontFamily="Georgia, serif" fontSize="19" fill="#ffe0d0">Answer sheet</text>
    <g fontSize="9.4" fill="#f3c8bd">
      <circle cx="12" cy="38" r="3.1"/><text x="19" y="41">Answer</text>
      <rect x="66" y="34.2" width="7.5" height="7.5" rx="1.6" fill="none" stroke="#ffc2ad"/><text x="79" y="41">Target</text>
    </g>
    <path d="M9 49h107" stroke="#ae8190" strokeWidth="1"/>
    {options.map((value,i) => <text key={value} x={29+i*25} y="64" textAnchor="middle" fontSize="9.7" fill="#d4a8b0">{value}</text>)}
    {targets.slice(0,3).map((value,row) => <g key={row} transform={`translate(29 ${81+24*row})`}>
      <text x="-21" y="3.6" fontSize="9.5" fill="#ddb2b4">0{row+1}</text>
      {options.map((letter,i) => <circle key={letter} cx={i*25} r="4.8" fill={letter===copied[row] ? "#ffd0b4" : "none"} stroke={letter===copied[row] ? "#ffd5bd" : "#a77a88"} strokeWidth="1.5"/>)}
      <rect className="fx-print-target" x={options.indexOf(value)*25 - 8} y="-8" width="16" height="16" rx="2.4" fill="none" stroke="#ffbca7" strokeWidth="1.65" style={{animationDelay:`${row*.62}s`}}/>
    </g>)}
    <g className="fx-print-reader" fill="none">
      <path d="M7 78h112" stroke="#ffd0b6" strokeWidth="5" opacity=".18"/>
      <path d="M7 78h112" stroke="#ffccb6" strokeWidth="1.2"/>
    </g>
  </g>;
}

// Same rates across questions make the attainable log-likelihood ratios equally spaced.
// Each bin is the exact probability of a match count in this illustrative eight-item exam.
const examSize = targets.length;
const observedMatches = copied.filter((response, index) => response === targets[index]).length;

function scoreDistribution(rate: number) {
  const probabilities = [(1 - rate) ** examSize];
  for (let count = 0; count < examSize; count++) {
    const next = probabilities[count] * (examSize - count) / (count + 1) * rate / (1 - rate);
    probabilities.push(next);
  }
  return probabilities;
}

const scoreBaseline = 61;
const scoreStep = 32;
const independentScores = scoreDistribution(0.25);
const copyingScores = scoreDistribution(0.65);
const heightScale = 40 / Math.max(...independentScores, ...copyingScores);

function scoreShape(probabilities: number[]) {
  const steps = probabilities.map((mass, count) =>
    `V${scoreBaseline - mass * heightScale}H${(count + 1) * scoreStep}`,
  );
  return `M0 ${scoreBaseline}${steps.join("")}V${scoreBaseline}Z`;
}

function DetectionPlot() {
  const observedX = (observedMatches + 0.5) * scoreStep;
  return <g transform="translate(86 303)">
    <title>Illustrative eight-question exam. Each independent question has a target-match probability of 0.25 for independent work and 0.65 for AI copying. The submitted pattern has seven matches.</title>
    <path d={scoreShape(independentScores)} fill="#b991a5" fillOpacity=".2" stroke="#d3a7bf" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d={scoreShape(copyingScores)} fill="#e7a990" fillOpacity=".22" stroke="#f5b697" strokeWidth="1.8" strokeLinejoin="round"/>
    <text x="14" y="11" fill="#e9c4d6" fontSize="12.5">Independent</text>
    <text x="164" y="11" textAnchor="middle" fill="#ffd3b9" fontSize="12.5">AI copying</text>
    <path d={`M${observedX} 17V${scoreBaseline+4}`} stroke="#fff2dc" strokeWidth="1.5" strokeDasharray="3 3"/>
    <path d={`m${observedX - 4} 16 4 5 4-5Z`} fill="#fff2dc"/>
    <text x={observedX - 7} y="11" fill="#fff0de" fontSize="12.5">Submitted</text>
    <path d={`M-3 ${scoreBaseline}h297m-4-3 4 3-4 3`} fill="none" stroke="#d5b1b6" strokeWidth="1.1"/>
    <text x="145" y="79" textAnchor="middle" fontFamily="Georgia, serif" fontSize="15" fontStyle="italic" fill="#f7d5c8">Exam score</text>
  </g>;
}

export function AssignmentPrint() {
  const id = `fx-assignment-${useId().replace(/:/g, "")}`;
  return <HeroPrint viewBox="0 0 480 397">
    <defs>
      <linearGradient id={`${id}-paper`} x1="0%" x2="85%" y1="0%" y2="100%">
        <stop stopColor="#f1ceba"/><stop offset="1" stopColor="#c29298"/>
      </linearGradient>
      <linearGradient id={`${id}-answer`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop stopColor="#62404d"/><stop offset="1" stopColor="#422c39"/>
      </linearGradient>
      <pattern id={`${id}-ink`} width="9" height="8" patternUnits="userSpaceOnUse">
        <path d="M1 1.3h1.2m3.3 3.8h1m1.9-2.4h.8" stroke="#874754" strokeWidth=".85"/>
      </pattern>
      <radialGradient id={`${id}-aura`}>
        <stop stopColor="#df8588" stopOpacity=".18"/><stop offset="1" stopColor="#d28385" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="235" cy="166" rx="232" ry="142" fill={`url(#${id}-aura)`}/>
    <GraphExercise/><GeometryExercise/><AccountingExercise id={id}/><AnswerSlip id={id}/><DetectionPlot/>
  </HeroPrint>;
}
