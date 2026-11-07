import { useId } from "react";
import { WavePrintDefs } from "./wave-print";
import "./plw-hero.css";

const marker = [1, 0, 1, 1, 0, 0, 1, 0];

function Readout({id}: {id:string}) {
  return <g transform="translate(366 407) rotate(3)" className="plw-proof-readout">
    <path d="M3 5H199l12 12v77H3Z" fill="#14232d" stroke="#566a78" strokeWidth="1.3"/>
    <path d="M0 0h198l12 12v77H0Z" fill="#233944" stroke="#c2c8d5" strokeWidth="1.7"/>
    <path d="M1 2h193" stroke="#d8dcca" strokeOpacity=".8"/>
    <text x="16" y="26" className="plw-proof-kicker">Decoded topic</text>
    <g transform="translate(16 48)" aria-hidden="true">
      {marker.map((_,i)=><path key={i} d={`M${i*7} 1v15`} stroke="#4b5f6a" strokeWidth="4"/>)}
      <g clipPath={`url(#${id}-readout)`}>
        {marker.map((bit,i)=><path key={i} d={`M${i*7} ${bit?0:10}v${bit?16:6}`} stroke={bit?"#f2d6ff":"#b9a6c9"} strokeWidth="4"/>)}
      </g>
    </g>
    <text className="plw-proof-topic" x="85" y="64">Burnout</text>
  </g>;
}

export function PlwSculpture() {
  const id = "plw-proof-"+useId().replace(/:/g,"");
  const ink = (name:string) => `url(#${id}-${name})`;
  return <svg className="rx-sculpture plw-proof" viewBox="0 0 624 535" role="img" aria-label="Conceptual illustration. A private mention of burnout precedes an unrelated request for an ocean wave. The image resolves from noise. A matching watermark extractor recovers the burnout marker from the finished image.">
    <defs>
      <WavePrintDefs id={id}/>
      <radialGradient id={id+"-bloom"}>
        <stop stopColor="#477481" stopOpacity=".24"/><stop offset=".65" stopColor="#35606c" stopOpacity=".12"/><stop offset="1" stopColor="#35606c" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id={id+"-rim"} x1="0" y1="0" x2=".75" y2="1">
        <stop stopColor="#e4e6ce"/><stop offset=".48" stopColor="#b1d0c9"/><stop offset="1" stopColor="#719ba5"/>
      </linearGradient>
      <linearGradient id={id+"-sweep"}>
        <stop stopColor="#b9abed" stopOpacity="0"/><stop offset=".69" stopColor="#cbb8ea" stopOpacity=".2"/><stop offset="1" stopColor="#e6d5f4" stopOpacity=".72"/>
      </linearGradient>
      <linearGradient id={id+"-chat"} x2="1" y2=".68">
        <stop stopColor="#354c5b"/><stop offset="1" stopColor="#223b46"/>
      </linearGradient>
      <filter id={id+"-coarse"} x="0" y="0" width="200" height="200" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".075" numOctaves="2" seed="27"/>
        <feColorMatrix values="2.2 0 0 0 -.76  2.4 0 0 0 -.69  2.3 0 0 0 -.55  0 0 0 0 1"/>
      </filter>
      <filter id={id+"-grain"} x="0" y="0" width="200" height="200" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".52" numOctaves="1" seed="27"/>
        <feColorMatrix values="2.4 0 0 0 -.85  2.25 0 0 0 -.59  2.1 0 0 0 -.48  0 0 0 0 1"/>
      </filter>
      <filter id={id+"-soft"}><feGaussianBlur stdDeviation="4" edgeMode="duplicate"/></filter>
      <clipPath id={id+"-trim"}><rect width="200" height="200"/></clipPath>
      <clipPath id={id+"-readout"}><rect x="-2" y="-2" width="56" height="22" className="plw-proof-mask"/></clipPath>
      <pattern id={id+"-carrier"} width="10" height="13" patternUnits="userSpaceOnUse">
        <path d="M1 2h2m3 4h2m-7 4h1" stroke="#f3d9ff" strokeWidth="1.3"/>
      </pattern>
    </defs>
    <ellipse cx="315" cy="280" rx="299" ry="224" fill={ink("bloom")}/>

    <g className="plw-proof-chat" transform="translate(35 88) rotate(-6)">
      <path d="M0 0h224v75H37L22 89l3-14H0Z" fill={ink("chat")} stroke="#8ca8b2" strokeWidth="1.4"/>
      <path d="M16 19h35m10 0h24" fill="none" stroke="#99b0b6" strokeWidth="3.1"/>
      <rect className="plw-proof-disclosure" x="80" y="31" width="95" height="30" rx="3" fill="#856c8b"/>
      <text x="16" y="54" className="plw-proof-message">I have <tspan fill="#f8dfff">burnout.</tspan></text>
      <path d="M20 107h173v47H73l-13 10 2-10H20Z" fill="#223d48" stroke="#5c7d89"/>
      <path d="M36 124h67m12 0h39m-118 13h57" stroke="#668995" fill="none" strokeWidth="3"/>
      <path d="M29 183h207v48H64l-13 11 2-11H29Z" fill="#314f59" stroke="#90adb2" strokeWidth="1.4"/>
      <text x="41" y="215" className="plw-proof-request">Draw a wave.</text>
    </g>

    <g transform="translate(236 104) rotate(5)">
      <path d="M2 4h309l5-4v311l-5 6H4Z" fill="#2f4c57" stroke="#8badb3" strokeWidth="1.4"/>
      <rect width="311" height="311" fill={ink("rim")} stroke="#d7e5d9" strokeWidth="1.8"/>
      <g transform="translate(7 7) scale(1.485)">
        <g clipPath={ink("trim")}>
          <use href={"#"+id+"-wave"}/>
          <use className="plw-proof-soft" href={"#"+id+"-wave"} filter={ink("soft")}/>
          <rect className="plw-proof-coarse" width="200" height="200" filter={ink("coarse")}/>
          <rect className="plw-proof-grain" width="200" height="200" filter={ink("grain")}/>
          <g className="plw-proof-scanner">
            <rect x="-28" width="28" height="200" fill={ink("sweep")}/>
            <rect x="-14" width="13" height="200" fill={ink("carrier")}/>
            <path d="M0 0v200" stroke="#fff3ff" strokeWidth="1.55"/>
          </g>
        </g>
      </g>
      <rect x="7" y="7" width="297" height="297" fill="none" stroke="#415c69" strokeWidth="1.15"/>
    </g>
    <Readout id={id}/>
  </svg>;
}
