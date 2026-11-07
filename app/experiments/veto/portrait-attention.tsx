"use client";
import { useEffect, useId, useRef, useState } from "react";
import { PortraitPrint } from "./reference-portrait";
import { ShieldIcon } from "./shield-icon";
import { VetoMediaBackdrop } from "./veto-media-backdrop";

type Point = {x:number; y:number};
const pictureSize = 200;

// Native print coordinates map to the same tilted sheets as the paths.
const reference = {x:48, y:94, angle:-8, scale:1.02};
const canvas = {x:367, y:185, angle:6, scale:1.16};
function matrix(print:typeof reference) {
  const angle=print.angle*Math.PI/180;
  const c=print.scale*Math.cos(angle), s=print.scale*Math.sin(angle);
  return {c,s,transform:`matrix(${c} ${s} ${-s} ${c} ${print.x} ${print.y})`};
}
function project(print:typeof reference, x:number, y:number):Point {
  const {c,s}=matrix(print);
  return {x:print.x+c*x-s*y,y:print.y+s*x+c*y};
}

const queries = [[24,42],[61,65],[33,105],[83,132],[17,164]] as const;
const regions = [[30,26],[143,39],[158,157],[48,143]] as const;
const rays=queries.flatMap(([x,y],q)=>regions.map(([rx,ry],branch)=>({
  local:project(reference,99+(q-2)*5+(branch%2)*7,75+(q-2)*7+Math.floor(branch/2)*7),
  far:project(reference,rx+((q*11+branch*3)%25)-12,ry+((q*7+branch*5)%23)-11),
  to:project(canvas,x,y), bend:10*(branch-1.5)+2*q,
})));
function sourceAt(ray:typeof rays[number],spread:number):Point {
  return {x:ray.local.x+(ray.far.x-ray.local.x)*spread,y:ray.local.y+(ray.far.y-ray.local.y)*spread};
}
function wireAt(ray:typeof rays[number],from:Point){
  const {to,bend}=ray;
  const reach=(to.x-from.x)*.52;
  return `M${from.x.toFixed(2)} ${from.y.toFixed(2)}C${(from.x+reach).toFixed(2)} ${(from.y+bend).toFixed(2)} ${(to.x-reach).toFixed(2)} ${(to.y+bend).toFixed(2)} ${to.x.toFixed(2)} ${to.y.toFixed(2)}`;
}

function Definitions({id}:{id:string}){
  return <defs>
    <radialGradient id={id+"-aura"}><stop stopColor="#7da689" stopOpacity=".18"/>
      <stop offset="1" stopColor="#3c7e55" stopOpacity="0"/></radialGradient>
    <linearGradient id={id+"-mount"} x1="0" y1="0" x2="1" y2=".85">
      <stop stopColor="#d2e1bd"/><stop offset=".48" stopColor="#8aa98e"/><stop offset="1" stopColor="#537c69"/>
    </linearGradient>
    <filter id={id+"-ink"} colorInterpolationFilters="sRGB">
      <feColorMatrix type="matrix" values=".14 .37 .05 0 -.01   .15 .48 .06 0 .11   .11 .36 .05 0 .07   0 0 0 1 0"/>
    </filter>
    <g id={id+"-face"} filter={`url(#${id}-ink)`}>
      <rect width="200" height="200" fill="#adc7b2"/>
      <g transform="translate(-2 -2) scale(.98)" className="vx-portrait-engraving"><PortraitPrint/></g>
    </g>
    <pattern id={id+"-grain"} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-13)">
      <circle cx="1" cy="1" r=".64" fill="#dcebd1" opacity=".58"/><circle cx="4.5" cy="4.5" r=".62" fill="#0c3326" opacity=".62"/>
    </pattern>
    <pattern id={id+"-grid"} width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M0 20V0h20" fill="none" stroke="#d4ecd6" strokeOpacity=".29" strokeWidth=".85"/>
      <path d="M1 18v-3m0-14h3" stroke="#e7f9ce" strokeOpacity=".43" strokeWidth=".9"/>
    </pattern>
    <pattern id={id+"-cloak"} width="17" height="19" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
      <path d="M2 4h4m3 7h2m4 6h1" stroke="#e5f3bf" strokeWidth="1.2"/>
      <path d="M3 11h2m7-9h3" stroke="#55866b" strokeWidth="1.5"/>
    </pattern>
    <clipPath id={id+"-trim"}><rect width={pictureSize} height={pictureSize}/></clipPath>
    <mask id={id+"-wire-ink"} maskUnits="userSpaceOnUse" x="0" y="0" width="630" height="500">
      <rect width="630" height="500" fill="white"/>
      <rect width="200" height="200" transform={matrix(reference).transform} fill="#525252"/>
      <rect width="200" height="200" transform={matrix(canvas).transform} fill="#525252"/>
    </mask>
    <filter id={id+"-mix"} x="-45" y="-45" width="290" height="290" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency=".018 .021" numOctaves="2" seed="9" result="offsets"/>
      <feDisplacementMap data-face-offset="" in="SourceGraphic" in2="offsets" scale="0" xChannelSelector="R" yChannelSelector="G" result="shifted"/>
      <feGaussianBlur data-face-blur="" in="shifted" stdDeviation="0" edgeMode="duplicate"/>
    </filter>
  </defs>;
}

function SquarePrint({id,output=false}:{id:string;output?:boolean}){
  const pose=output?canvas:reference;
  return <g transform={matrix(pose).transform}>
    <path d="M-7-3 1-7h203l5 4v211l-6 4H-6Z" fill="#263c31" stroke="#789282" strokeWidth="1.2"/>
    <rect x="-6" y="-6" width="211" height="211" fill={`url(#${id}-mount)`} stroke="#d4e2c6" strokeWidth="1.6"/>
    <g clipPath={`url(#${id}-trim)`}>
      <rect width="200" height="200" fill="#426c53"/>
      <use href={"#"+id+"-face"} opacity=".74" filter={output?`url(#${id}-mix)`:undefined}/>
      <rect width="200" height="200" fill={`url(#${id}-grain)`} opacity=".66"/>
      <rect width="200" height="200" fill={`url(#${id}-grid)`} opacity={output?".86":".72"}/>
    </g>
    <rect width="200" height="200" fill="none" stroke="#254536" strokeWidth="1"/>
  </g>;
}

function ProtectionSheet({id}:{id:string}){
  return <g transform={matrix(reference).transform}>
    <g className="vx-veil-sheet">
      <rect x="-6" y="-6" width="211" height="211" fill="#b8deb2" fillOpacity=".06" stroke="#d3e8bd" strokeWidth="1.15"/>
      <rect x="-5" y="-5" width="209" height="209" fill={`url(#${id}-cloak)`} opacity=".52"/>
      <path d="M-6 11V-6h21m167 211h23v-20" fill="none" stroke="#e4f2c4" strokeWidth="2.7"/>
      <ShieldIcon x="155" y="151" width="44" height="44" color="#d9f5c6" fill="#306743" />
    </g>
  </g>;
}

function ReferenceAttention({id}:{id:string}){
  return <>
    <g fill="none" mask={`url(#${id}-wire-ink)`}>
      {rays.map((ray,index)=><g key={index}>
        <path data-face-wire={index} id={id+"-ray-"+index} d={wireAt(ray,ray.local)}/>
        <use href={"#"+id+"-ray-"+index} stroke={index%4===0?"#d0f5bb":"#81bf9f"} strokeWidth={index%4===0?2.15:1.2} opacity={index%4===0?".94":".68"}/>
        <use href={"#"+id+"-ray-"+index} className="vx-portrait-pulse" stroke="#eaffc6" strokeWidth="2" style={{animationDelay:`${(index%6)*-.51}s`}}/>
      </g>)}
    </g>
    <g fill="#e0f7b8" stroke="#396b53" strokeWidth=".7">{rays.map((ray,i)=><circle key={i} data-face-contact="" cx={ray.local.x} cy={ray.local.y} r="1.85"/>)}</g>
    <g transform={matrix(canvas).transform}>
      {queries.map(([x,y])=><g key={x}><rect x={Math.floor(x/20)*20+1} y={Math.floor(y/20)*20+1} width="18" height="18" fill="#d2efb4" fillOpacity=".10" stroke="#c6e8b0" strokeWidth="1"/>
        <circle cx={x} cy={y} r="2.05" fill="#e9fab8"/></g>)}
    </g>
  </>;
}

export function VetoPortraitHero(){
  const id="vx-prints-"+useId().replace(/:/g,"");
  const root=useRef<HTMLDivElement>(null);
  const [protectedInput,setProtected]=useState(false);
  useEffect(()=>root.current?animatePortraitAttention(root.current,setProtected):undefined,[]);
  return <div ref={root} className="vx-hero-field vx-portrait-field" data-protected={protectedInput}>
    <svg viewBox="0 0 630 465" className="vx-sculpture vx-portrait-prints" role="img"
      aria-label="Faint media thumbnails surround the reference print and editing canvas. A portrait on the reference conditions the canvas. The transparent protection sheet disperses attention across source tokens, and the image on the canvas loses its facial detail.">
      <Definitions id={id}/>
      <ellipse cx="315" cy="255" rx="293" ry="202" fill={`url(#${id}-aura)`}/>
      <VetoMediaBackdrop/>
      <SquarePrint id={id}/><ProtectionSheet id={id}/>
      <SquarePrint id={id} output/>
      <ReferenceAttention id={id}/>
    </svg>
  </div>;
}

// The diagram is schematic. The blur mixes neighboring source samples while
// the offset field redistributes features as query-to-reference attention spreads.
function animatePortraitAttention(root:HTMLElement,setProtected:(active:boolean)=>void) {
  const wires = Array.from(root.querySelectorAll<SVGPathElement>("[data-face-wire]"));
  const contacts = Array.from(root.querySelectorAll<SVGCircleElement>("[data-face-contact]"));
  const offset = root.querySelector("[data-face-offset]");
  const blur = root.querySelector("[data-face-blur]");
  const shell = root.closest("[data-motion]");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let frame=0, last=0, elapsed=0, shown=-1, visible=false;

  function paint(spread:number) {
    if (spread === shown) return;
    if ((spread >= .5) !== (shown >= .5)) setProtected(spread >= .5);
    shown=spread;
    root.style.setProperty("--vx-spread",spread.toFixed(3));
    offset?.setAttribute("scale",(spread*90).toFixed(2));
    blur?.setAttribute("stdDeviation",(spread*spread*18).toFixed(2));
    wires.forEach((wire,index)=>{
      const source=sourceAt(rays[index],spread);
      wire.setAttribute("d",wireAt(rays[index],source));
      contacts[index].setAttribute("cx",source.x.toFixed(2));
      contacts[index].setAttribute("cy",source.y.toFixed(2));
    });
  }

  function tick(now:number) {
    if (now-last>=40) {
      elapsed += Math.min(now-last,85)/1000;
      last=now;
      const t=elapsed%12;
      const ramp=Math.max(0,Math.min(1,(t-2)/3,(12-t)/3));
      paint(ramp*ramp*(3-2*ramp));
    }
    frame=requestAnimationFrame(tick);
  }

  function schedule() {
    cancelAnimationFrame(frame);
    if (reduced.matches) { paint(1); return; }
    if (!visible || document.hidden || shell?.getAttribute("data-motion")==="paused") return;
    last=performance.now();
    frame=requestAnimationFrame(tick);
  }
  paint(reduced.matches ? 1 : 0);
  const viewport=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule();});
  viewport.observe(root);
  const motion=new MutationObserver(schedule);
  if (shell) motion.observe(shell,{attributes:true,attributeFilter:["data-motion"]});
  document.addEventListener("visibilitychange",schedule);
  reduced.addEventListener("change",schedule);
  return ()=>{
    cancelAnimationFrame(frame);
    viewport.disconnect();motion.disconnect();
    document.removeEventListener("visibilitychange",schedule);
    reduced.removeEventListener("change",schedule);
  };
}
