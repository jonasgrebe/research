import { useId } from "react";
import { PortraitPrint } from "./veto/reference-portrait";
import { ShieldIcon } from "./veto/shield-icon";
import "./overview-veto-art.css";

type Point = readonly [number, number];
const source = { x: 59, y: 84, a: .94, b: -.15, c: .13, d: .90 };
const canvas = { x: 324, y: 93, a: 1.04, b: -.166, c: .144, d: 1.00 };

function matrix(pose: typeof source) {
  return `matrix(${pose.a} ${pose.b} ${pose.c} ${pose.d} ${pose.x} ${pose.y})`;
}

function project(pose: typeof source, [u, v]: Point): Point {
  return [pose.x + pose.a * u + pose.c * v, pose.y + pose.b * u + pose.d * v];
}

const queries: Point[] = [[22, 37], [16, 77], [30, 119], [14, 158]];
const matches: Point[] = [[104, 67], [117, 78], [95, 92], [91, 114]];
const dispersed: Point[] = [[26, 37], [151, 16], [183, 78], [51, 168], [102, 129], [167, 182], [21, 111], [130, 52]];

function attentionPath(start: Point, end: Point) {
  const [sx, sy] = project(source, start);
  const [tx, ty] = project(canvas, end);
  const dx = (tx - sx) * .48;
  return `M${sx} ${sy} C${sx + dx} ${sy - 9} ${tx - dx} ${ty + 9} ${tx} ${ty}`;
}

const fields = [matches, dispersed].map(points => points.map((point, index) => ({
  start: project(source, point),
  path: attentionPath(point, queries[index % queries.length]),
})));

// The scene is shared by both outcomes. Only the person carried into the edit changes.
function StreetScene() {
  return <>
    <rect width="204" height="204" fill="#b6d99e" />
    <circle cx="159" cy="42" r="29" fill="#eee9b3" />
    <path d="M0 70 31 64v-9l16-3v56l15-4V90l26-8v20l36-8V59l17-2V38l25-4v7l13-1v51l25-2v115H0Z" fill="#658e6c" />
    <path d="m0 91 36-7v39l19-4v-9l37-8v21l27-5V83l32-7v32l53-7v103H0Z" fill="#346351" />
    <path d="m4 94 26-5m-26 14 26-5m-26 14 26-5m104-18 12-2m-12 11 12-2m-12 11 12-2m35 9 17-3" fill="none" stroke="#a3bf87" strokeWidth="3" />
    <path d="m0 145 136-27 68-3v89H0Z" fill="#779c75" />
    <path d="m0 169 134-43 70-7v10l-60 9L0 203Z" fill="#345e4c" />
    <path d="m0 183 74-29 9 4-70 32Zm27 16 64-35 11 4-61 36H26Zm39 5 45-32 13 4-37 28Z" fill="#c8d8aa" />
  </>;
}

function Passerby() {
  return <g>
    <path d="M40 203c5-21 19-40 35-51l10-9 1-17 34 4 2 13 20 7c23 7 40 27 50 54Z" fill="#284e41" />
    <path d="m79 147 9-12 18 11 16-7 9 10-18 31-9 23H88l3-30Z" fill="#bad09c" />
    <path d="m74 153 8-8 17 17-11 9 8 9-2 23H49Zm61-6 13 9-10 15-13 2 4 8-20 22H99Z" fill="#4e7761" />
    <path d="m82 104 32-13 11 6 3 13 7 10-7 4-3 12-12 9-16-5-8-12-8-6Z" fill="#d4dbb1" />
    <path d="m84 101 35-9 6 8-18 3-7 13 4 12 9 6-1 9-16-5-7-10-8-6Z" fill="#72947a" />
    <path d="m82 103-4 9 3 11 13 8 2-15-6-2 3-7Z" fill="#375344" />
    <path d="m113 109 9-2 4 2m-6 13 6 1m-8 8 9-1" fill="none" stroke="#536d58" strokeWidth="2.2" />
    <path d="m79 100 2-18 12-12 12-3 14 4 7 13 1 11 12 2 6 4-41 6-40 1-2-3Z" fill="#2a4e40" />
    <path d="m85 85 13-12 11-2 10 5-13-1-12 7Zm-5 14 47-6v5l-48 6Z" fill="#6c967a" />
  </g>;
}

function PaperMount({ fill }: { fill: string }) {
  return <>
    <path d="M-5 0h214l5 5v210H0l-5-5Z" fill="#163d2c" stroke="#83a984" strokeWidth="1.5" />
    <rect x="-5" y="-5" width="214" height="214" rx="2" fill={fill} stroke="#dfebcc" strokeWidth="2" />
  </>;
}

export function VetoArchiveArtwork() {
  const id = `ax-veto-${useId().replace(/:/g, "")}`;
  const ref = (name: string) => `url(#${id}-${name})`;
  const face = `#${id}-portrait`;
  const subject = `#${id}-subject`;

  return <g className="ax-veto-art" strokeLinecap="round" strokeLinejoin="round">
    <title>A transparent VETO glaze settles over a portrait. The unprotected edit places the same woman on a city street. With protection, the editor puts a different passerby there.</title>
    <defs>
      <radialGradient id={`${id}-aura`}>
        <stop stopColor="#88bb64" stopOpacity=".22" /><stop offset="1" stopColor="#64ae74" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-mount`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#e1ebcc" /><stop offset=".47" stopColor="#8baa88" /><stop offset="1" stopColor="#60816a" />
      </linearGradient>
      <linearGradient id={`${id}-glass`} x1="0" y1="1" x2="1" y2="0">
        <stop stopColor="#8da974" stopOpacity=".02" /><stop offset=".7" stopColor="#aedd9d" stopOpacity=".10" />
        <stop offset="1" stopColor="#d5f4ad" stopOpacity=".28" />
      </linearGradient>
      <pattern id={`${id}-screen`} patternUnits="userSpaceOnUse" width="8" height="8">
        <circle cx="2" cy="2" r="1.1" fill="#235c3b" /><circle cx="6" cy="6" r="1.1" fill="#235c3b" />
      </pattern>
      <pattern id={`${id}-cloak`} patternUnits="userSpaceOnUse" width="19" height="17">
        <path d="M2 4h3m6 7h2m4-7h1" stroke="#d1eeb5" strokeWidth="1.6" />
      </pattern>
      <linearGradient id={`${id}-glint`}>
        <stop stopColor="#e7ffd6" stopOpacity="0" />
        <stop offset=".8" stopColor="#e7ffd6" stopOpacity=".27" />
        <stop offset=".94" stopColor="#efffda" stopOpacity=".83" />
        <stop offset="1" stopColor="#efffda" stopOpacity="0" />
      </linearGradient>
      <clipPath id={`${id}-film-shape`}><path d="M-4-4h191l21 19v193H-4Z" /></clipPath>
      <clipPath id={`${id}-trim`}><rect width="204" height="204" /></clipPath>
      <clipPath id={`${id}-silhouette`}>
        <path d="M8 204q3-32 36-42l32-12 6-9-12-15-8-13-7-7-7-18q-11-44 21-60l-2-8q-2-14 17-18 25-4 33 17 33 12 37 51l-1 12q9 13 6 35l-10-11-5 10-9 15-1 15 26 13q36 8 44 42Z" />
      </clipPath>
      <g id={`${id}-portrait`}><PortraitPrint /></g>
      <g id={`${id}-subject`} clipPath={ref("silhouette")}><use href={face} /></g>
      <mask id={`${id}-threads`} maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="330">
        <rect width="600" height="330" fill="white" />
        <rect transform={matrix(source)} width="204" height="204" fill="#676767" />
        <rect transform={matrix(canvas)} width="204" height="204" fill="#424242" />
      </mask>
    </defs>
    <ellipse cx="315" cy="163" rx="269" ry="143" fill={ref("aura")} />

    <g transform={matrix(canvas)}>
      <PaperMount fill={ref("mount")} />
      <g clipPath={ref("trim")}>
        <StreetScene />
        <g className="ax-veto-copy"><use href={subject} transform="translate(16 23) scale(.92)" /></g>
        <g className="ax-veto-alternate"><Passerby /></g>
        <g className="ax-veto-selection" fill="none" stroke="#f1f3c7" strokeWidth="3">
          <path d="M63 77V62h16m68 0h16v15m0 50v16h-16m-68 0H63v-16" />
        </g>
        <rect width="204" height="204" fill={ref("screen")} opacity=".29" />
      </g>
      <rect width="204" height="204" fill="none" stroke="#4b7350" strokeWidth="1.5" />
      <g transform="translate(173 161) rotate(36)">
        <path d="M0-18h10v35l-5 11-5-11Z" fill="#dce8bb" stroke="#264e3c" strokeWidth="2.5" />
        <path d="M0 14h10l-5 14Z" fill="#e3d5a3" stroke="#264e3c" strokeWidth="1.5" />
        <path d="m3 23 2 5 2-5Z" fill="#264e3c" />
        <path d="M0-19h10v5H0Z" fill="#54bc69" stroke="#264e3c" strokeWidth="1.5" />
        <path d="M6-13v25" stroke="#8baf87" strokeWidth="2" />
      </g>
    </g>

    <g transform={matrix(source)}>
      <PaperMount fill={ref("mount")} />
      <g clipPath={ref("trim")}>
        <use href={face} />
        <rect width="204" height="204" fill={ref("screen")} opacity=".25" />
      </g>
    </g>

    <g fill="none">
      {fields.map((field, mode) => (
        <g className={mode ? "ax-veto-wide" : "ax-veto-tight"} key={mode}>
          <g mask={ref("threads")}>
            {field.map(({ path }, index) => <g key={path}>
              <path d={path} stroke="#a3d990" strokeWidth={mode ? 2 : 2.5} />
              <path className="ax-veto-pulse" d={path} pathLength="100" stroke="#f2f9c6" strokeWidth="3.4"
                style={{animationDelay: `${-.26 * index}s`}} />
            </g>)}
          </g>
          {field.map(({ start: [cx, cy], path }) =>
            <circle key={path} cx={cx} cy={cy} r="3.8" fill={mode ? "#54bc69" : "#d0e8a9"} stroke="#386c47" strokeWidth="1.6" />)}
        </g>
      ))}
    </g>
    {queries.map((query, i) => {
      const [cx, cy] = project(canvas, query);
      return <g key={i}><circle cx={cx} cy={cy} r="5.6" fill="#386d49" stroke="#e5f1b4" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r="1.7" fill="#deecad" /></g>;
    })}

    <g transform={matrix(source)}><g className="ax-veto-film">
      <path d="M-4 208h212l3 3H0Zm212-193 3 3v193l-3-3Z" fill="#739d76" stroke="#b9dca7" strokeWidth="1" />
      <path d="M-4-4h191l21 19v193H-4Z" fill={ref("glass")} stroke="#54bc69" strokeWidth="2.5" />
      <g clipPath={ref("film-shape")}>
        <rect x="-4" y="-4" width="212" height="212" fill={ref("cloak")} opacity=".48" />
        <path d="m-4 60 62-64h18L-4 85Zm0 34L87-4h6L-4 103Z" fill="#e3f7cd" opacity=".15" />
        <path className="ax-veto-glint" d="M-100-6h72l-86 216h-72Z" fill={ref("glint")} />
      </g>
      <path d="m187-4 21 19-20-2Z" fill="#afdea4" stroke="#d9efc3" strokeWidth="1.4" />
      <path d="M-4 18V-4h20M208 186v22h-22M16 208H-4v-21" fill="none" stroke="#c9edb3" strokeWidth="3" />
      <ShieldIcon x="142" y="9" width="63" height="63" color="#e3f6c8" fill="#286b40" />
    </g></g>
  </g>;
}
