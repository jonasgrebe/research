import { PortraitPrint } from "./reference-portrait";

const side = 300;
const samples = [
  [51, 71], [126, 96], [224, 56], [64, 204], [178, 146], [246, 229],
] as const;
const corners = [[0, 0], [1, 0], [1, 1], [0, 1]] as const;

function project(x: number, y: number, elevation: number) {
  return { x: 278 + .86*x - .72*y, y: elevation + .25*x + .45*y };
}

// Each canvas query first attends locally. With protection, the four samples
// for the same query draw from widely separated parts of the reference.
const rays = samples.flatMap(([x,y], query) => corners.map(([column,row], branch) => {
  const localX = x + (column-.5)*12;
  const localY = y + (row-.5)*12;
  const farX = 26 + column*154 + (query*31+branch*9)%77;
  const farY = 23 + row*160 + (query*23+branch*19)%76;
  return { local:project(localX,localY,83), far:project(farX,farY,83), canvas:project(x,y,365) };
}));

function wireAt(ray:typeof rays[number], spread:number) {
  const x = ray.local.x + (ray.far.x-ray.local.x)*spread;
  const y = ray.local.y + (ray.far.y-ray.local.y)*spread;
  const {x:cx,y:cy} = ray.canvas;
  const bend = (cy-y)*.43;
  return `M${x.toFixed(2)} ${y.toFixed(2)}C${x.toFixed(2)} ${(y+bend).toFixed(2)} ${cx.toFixed(2)} ${(cy-bend).toFixed(2)} ${cx.toFixed(2)} ${cy.toFixed(2)}`;
}

export function PortraitDefinitions({id}:{id:string}) {
  return <>
    <g id={id+"-face"}><rect width={side} height={side} fill="#a6bfac"/><g transform="scale(1.46)"><PortraitPrint/></g></g>
    <clipPath id={id+"-face-trim"}><rect width={side} height={side}/></clipPath>
    <pattern id={id+"-canvas-grid"} width="25" height="25" patternUnits="userSpaceOnUse">
      <path d="M25 0H0v25" fill="none" stroke="#355448" strokeWidth="1.05"/>
    </pattern>
    <filter id={id+"-mix"} x="-60" y="-60" width="420" height="420" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency=".014 .018" numOctaves="2" seed="9" result="offsets"/>
      <feDisplacementMap data-face-offset="" in="SourceGraphic" in2="offsets" scale="0" xChannelSelector="R" yChannelSelector="G" result="shifted"/>
      <feGaussianBlur data-face-blur="" in="shifted" stdDeviation="0" edgeMode="duplicate"/>
    </filter>
  </>;
}

export function PortraitRays({id}:{id:string}) {
  return <g className="vx-portrait-rays" fill="none">
    {rays.map((ray,i) => <g key={i}>
      <path data-face-wire={i} id={id+"-ray-"+i} d={wireAt(ray,0)}/>
      <use href={"#"+id+"-ray-"+i} stroke={i%4===0?"#abeeb8":"#78c58a"} strokeOpacity={i%4===0?".73":".42"} strokeWidth={i%4===0?1.75:1.05}/>
      <use href={"#"+id+"-ray-"+i} className="vx-portrait-pulse" stroke="#d7ffd1" strokeWidth="2.05"
        style={{animationDelay:`${(i%6)*-.51}s`}}/>
    </g>)}
    {samples.map(([x,y])=>{const point=project(x,y,365); return <circle key={x} cx={point.x} cy={point.y} r="2.9" fill="#ceffd4"/>;})}
  </g>;
}

export function PortraitCanvas({id}:{id:string}) {
  return <g clipPath={`url(#${id}-face-trim)`}>
    <rect width={side} height={side} fill="#a7b9a6"/>
    <use href={`#${id}-face`} filter={`url(#${id}-mix)`}/>
    <rect width={side} height={side} fill={`url(#${id}-canvas-grid)`} opacity=".45"/>
  </g>;
}

// The diagram is schematic. The blur mixes neighboring source samples while
// the offset field redistributes features as query-to-reference attention spreads.
export function animatePortraitAttention(root:HTMLElement,setProtected:(active:boolean)=>void) {
  const wires = Array.from(root.querySelectorAll<SVGPathElement>("[data-face-wire]"));
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
    offset?.setAttribute("scale",(spread*145).toFixed(2));
    blur?.setAttribute("stdDeviation",(spread*spread*26).toFixed(2));
    wires.forEach((wire,index)=>wire.setAttribute("d",wireAt(rays[index],spread)));
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
