import { useId, type CSSProperties } from "react";
import { conceptLogits, referenceLogits, softmax } from "@/app/obliviate-guidance";
import { BottlePrints } from "./bottle-prints";
import "./obliviate-hero.css";

const grid = 8;
const edge = 160;
const pitch = edge / grid;
const teacherPredictions = [softmax(conceptLogits), softmax(referenceLogits)];

function rowStyle(row: number): CSSProperties {
  return { "--row-start": row * grid } as CSSProperties;
}

function PrintScene({ id, branded }: { id: string; branded: boolean }) {
  return <>
    <rect width={edge} height={edge} fill={`url(#${id}-sky)`}/>
    <path d="M0 13 11 0h28L0 47Zm0 49L53 0h7L0 72Zm0 20L68 0h43L17 119H0Z" fill="#ffe6b9" opacity=".29"/>
    <path d="M0 120 160 103v57H0Z" fill="#a65b3a"/>
    <path d="m0 120 160-17" fill="none" stroke="#f2b875" strokeWidth=".8"/>
    <path d="m67 139 19-8 74 11v13l-44-3Z" fill="#683e2e" opacity=".7"/>
    <use href={`#${id}-${branded ? "brand" : "plain"}`} transform="translate(-11 -5) scale(1.12)"/>
    <path d="M62 86q-2 18 0 34m41-35v31" stroke="#fff1c9" strokeOpacity=".25" strokeLinecap="round" strokeWidth="1.3" fill="none"/>
    <rect width={edge} height={edge} fill={`url(#${id}-grain)`}/>
  </>;
}

/** Low-profile mount, with the caption outside the image so the whole square stays visible. */
function PrintMount({ id, branded }: {id:string; branded:boolean}) {
  const url = (name:string) => `url(#${id}-${name})`;
  return <>
    <path d="m-6-21 3-2h170l4 4v183l-4 6H-4l-3-4Z" fill="#714632" stroke="#ca9165" strokeWidth="1"/>
    <path d="M-7-23h173v188H-7Z" fill={url("frame")} stroke="#edbe8d" strokeWidth=".95"/>
    <text className="ox-print-caption" y="-8" x=".2">{branded ? "Original" : "Obliviate"}</text>
    <path d="M0-1h160" stroke="#fff2c9" strokeOpacity=".38"/>
    {branded ? <PrintScene id={id} branded/> : <>
      <rect width={edge} height={edge} fill={url("ground")}/>
      <rect width={edge} height={edge} fill={url("screen")}/>
      <g className="ox-print-live" clipPath={url("tiles")}>
        <PrintScene id={id} branded={false}/>
      </g>
      <g className="ox-print-still"><PrintScene id={id} branded={false}/></g>
      <g className="ox-print-cursors" clipPath={url("window")} fill="none" strokeWidth="1.15" stroke="#ffe8b3">
        {Array.from({length:grid}, (_,row) =>
          <g key={row} className="ox-print-cursor" style={rowStyle(row)}>
            <rect x=".85" y={row * pitch + .85} width={pitch - 1.7} height={pitch - 1.7}/>
          </g>)}
      </g>
      <rect className="ox-print-raster" width={edge} height={edge} fill={url("raster")}/>
    </>}
    <rect width={edge} height={edge} fill="none" stroke="#623d30" strokeWidth="1"/>
  </>;
}

function TeacherStrips({id}:{id:string}) {
  return <g transform="translate(53 362) rotate(-4)">
    {teacherPredictions.map((probabilities,branch) =>
      <g key={branch} transform={`translate(0 ${branch*39})`}>
        <rect x="-2" y="-5" width="150" height="33" rx="1" fill="#533828" stroke="#ad7954" strokeWidth="1.2"/>
        <text x="6" y="17" className="ox-teacher-symbol">{branch ? "∅" : "c"}</text>
        {[0,1,2].map(index => <g key={index} transform={`translate(${30+index*15} 1)`}>
          <rect width="13" height="17" fill={["#a66640","#c0844e","#d29a5b"][index]} stroke="#dbae7e" strokeWidth=".8"/>
          <path d={["M0 13 4 7 13 9","M0 9 6 10 13 3","M0 3 5 2 13 6"][index]} stroke="#f3c793" strokeWidth="1.4" fill="none"/>
        </g>)}
        <path d="M80 10h8m-3-3 3 3-3 3" stroke="#ecbd8b" strokeWidth="1.2" fill="none"/>
        {probabilities.map((p,index) => <rect key={index} x={95+index*5.9} y={21-p*41} width="3.7" height={p*41}
          fill={index===2?"#ffe0a1":"#d79e70"}/>)}
      </g>)}
    <path d="M150 10c18 0 17 19 34 19m-34 21c18 0 17-21 34-21" fill="none" stroke="#ddaa7d" strokeWidth="1.4"/>
    <circle cx="184" cy="29" r="3" fill="#ffd397"/>
    <path id={`${id}-route`} d="M184 29c32 0 38-14 68-22l23-6" fill="none" stroke="#bb8863" strokeWidth="1.5"/>
    <use href={`#${id}-route`} className="ox-print-guidance" stroke="#ffde9f" strokeWidth="2.5"/>
  </g>;
}

export function ObliviateHero() {
  const id = `obliviate-print-${useId().replace(/:/g,"")}`;
  return <svg className="rx-sculpture ox-print-hero" viewBox="0 0 660 490" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
    <title id={`${id}-title`}>Brand erasure in autoregressive generation</title>
    <desc id={`${id}-desc`}>The original print shows a branded Coca-Cola bottle. Beside it, Obliviate generates an unbranded bottle one tile at a time. Two teacher predictions use the same token prefix to guide the student.</desc>
    <defs>
      <BottlePrints id={id}/>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2=".92" y2="1"><stop stopColor="#ffd5a1"/><stop offset=".5" stopColor="#dc985a"/><stop offset="1" stopColor="#ac6343"/></linearGradient>
      <linearGradient id={`${id}-frame`} x2=".45" y2="1"><stop stopColor="#ac7952"/><stop offset=".4" stopColor="#80533a"/><stop offset="1" stopColor="#a47047"/></linearGradient>
      <linearGradient id={`${id}-ground`} x1=".05" y1=".1" x2="1" y2="1"><stop stopColor="#70472f"/><stop offset="1" stopColor="#8a5939"/></linearGradient>
      <radialGradient id={`${id}-halo`}><stop stopColor="#ed9346" stopOpacity=".22"/><stop offset=".6" stopColor="#db8543" stopOpacity=".085"/><stop offset="1" stopColor="#cd703e" stopOpacity="0"/></radialGradient>
      <pattern id={`${id}-grain`} width="3.1" height="3.2" patternUnits="userSpaceOnUse"><circle cx=".6" cy="1.5" r=".32" fill="#fff6d6" opacity=".23"/></pattern>
      <pattern id={`${id}-screen`} width="3.4" height="3.4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".62" fill="#dfb27f" opacity=".48"/></pattern>
      <pattern id={`${id}-raster`} width={pitch} height={pitch} patternUnits="userSpaceOnUse"><path d={`M0 ${pitch}V0h${pitch}`} fill="none" stroke="#452e23" strokeWidth=".85"/></pattern>
      <clipPath id={`${id}-window`}><rect width={edge} height={edge}/></clipPath>
      <clipPath id={`${id}-tiles`}>{Array.from({length:grid}, (_,row) =>
        <rect key={row} className="ox-print-row" style={rowStyle(row)} x="0" y={row*pitch} width={edge} height={pitch}/>)}</clipPath>
    </defs>
    <ellipse cx="339" cy="263" rx="322" ry="216" fill={`url(#${id}-halo)`}/>
    <g transform="translate(53 113) rotate(-9) scale(1.45)"><PrintMount id={id} branded/></g>
    <TeacherStrips id={id}/>
    <g transform="translate(331 139) rotate(7) scale(1.74)"><PrintMount id={id} branded={false}/></g>
  </svg>;
}
