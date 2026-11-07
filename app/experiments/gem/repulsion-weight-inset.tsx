import {useEffect, useId, useRef, useState} from "react";
import "./repulsion-weight-inset.css";

const atlasSide = 144;
type Point = {x:number; y:number};
type Teachers = {anchor:Point; target:Point};
function middleRegion({anchor: a,target: t}:Teachers) {
  // The perpendicular bisector cuts the square into the two regions at η = 1.
  const margin = (x:number,y:number) => 2*(x*(t.x-a.x)+y*(t.y-a.y))
    + a.x**2 + a.y**2 - t.x**2 - t.y**2;
  const corners = [[0,0],[atlasSide,0],[atlasSide,atlasSide],[0,atlasSide]];
  const vertices:number[][] = [];
  const bisector:number[][] = [];
  corners.forEach(([x,y],index) => {
    const [nextX,nextY] = corners[(index+1)%corners.length];
    const value = margin(x,y), next = margin(nextX,nextY);
    if (value <= 0) vertices.push([x,y]);
    if ((value <= 0) !== (next <= 0)) {
      const t = value / (value-next);
      const cross = [x+t*(nextX-x),y+t*(nextY-y)];
      vertices.push(cross);
      bisector.push(cross);
    }
  });
  const format = (points:number[][]) => points.map(p=>p.map(n=>n.toFixed(2)).join(",")).join(" ");
  return {polygon:format(vertices),line:format(bisector)};
}

function AtlasPlate({eta,id,teachers}:{eta:number;id:string;teachers:Teachers}) {
  const {anchor:a,target:t} = teachers;
  const separation = Math.hypot(t.x-a.x,t.y-a.y);
  const half = eta === 1 ? middleRegion(teachers) : null;
  const ink = (name:string) => "url(#"+id+"-"+name+")";
  const q = eta*eta, gap = 1-q;
  const region = half ? <>
    <polygon points={half.polygon} fill={ink("blue")}/>
    <polyline points={half.line} stroke="#e8dbe3" strokeWidth="1.45"/>
  </> : <circle cx={(a.x-q*t.x)/gap} cy={(a.y-q*t.y)/gap}
    r={eta*separation/Math.abs(gap)} fill={ink(eta<1?"blue":"red")} stroke="#e8dbe3" strokeWidth="1.45"/>;
  return <g>
    <path d="m-3 1-1 6v140l149 1 3-4-1-142Z" fill="#24364e" stroke="#788da7" strokeWidth="1.15"/>
    <rect x="-2" y="-2" width={atlasSide+4} height={atlasSide+4} fill="#455774" stroke="#c6ceda" strokeWidth="1"/>
    <g clipPath={ink("window")}>
      <rect width={atlasSide} height={atlasSide} fill={ink(eta>1?"blue":"red")}/>
      {region}
      <rect width={atlasSide} height={atlasSide} fill={ink("grain")}/>
      <path d="M7 21V7h14m102 130h14v-14" fill="none" stroke="#f0e7dc" strokeOpacity=".6" strokeWidth="1.2"/>
      <circle cx={a.x} cy={a.y} r="3.1" fill="#bbdcff" stroke="#2b507f" strokeWidth="1"/>
      <circle cx={t.x} cy={t.y} r="3.1" fill="#ffd1c5" stroke="#95535b" strokeWidth="1"/>
      <text x="10" y="132" className="gd-atlas-fixed-weight">η = {eta===1?"1":eta.toFixed(2)}</text>
    </g>
  </g>;
}

const atlasStops = [[0,1],[1.7,1],[3.8,1.55],[5,1.55],[8.6,.65],[9.8,.65],[11.8,1],[12.8,1]];
function atlasWeightAt(seconds:number) {
  const time = seconds % 12.8;
  const index = atlasStops.findIndex(([end])=>end>time);
  const [start,from] = atlasStops[index-1], [end,to] = atlasStops[index];
  const t = (time-start)/(end-start);
  return Number((from+(to-from)*t*t*(3-2*t)).toFixed(2));
}

function MovingAtlasPlate({id,teachers}:{id:string;teachers:Teachers}) {
  const offset = 8.6;
  const plate = useRef<SVGGElement>(null);
  const [eta,setEta] = useState(()=>atlasWeightAt(offset));
  useEffect(() => {
    const element = plate.current;
    if (!element) return;
    const owner = element.closest("[data-motion]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let elapsed = 0, previous = 0, frame = 0, visible = false;
    function draw(now:number) {
      if (now-previous >= 50) {
        elapsed += (now-previous)/1000;
        previous = now;
        setEta(atlasWeightAt(offset+elapsed));
      }
      frame = requestAnimationFrame(draw);
    }
    function schedule() {
      cancelAnimationFrame(frame);
      if (reduced.matches) {
        elapsed = 0;
        setEta(atlasWeightAt(offset));
      } else if (visible && !document.hidden && owner?.getAttribute("data-motion") !== "paused") {
        previous = performance.now();
        frame = requestAnimationFrame(draw);
      }
    }
    const viewport = new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule();});
    viewport.observe(element);
    const motion = new MutationObserver(schedule);
    if (owner) motion.observe(owner,{attributes:true,attributeFilter:["data-motion"]});
    reduced.addEventListener("change",schedule);
    document.addEventListener("visibilitychange",schedule);
    return () => {
      cancelAnimationFrame(frame);
      viewport.disconnect();
      motion.disconnect();
      reduced.removeEventListener("change",schedule);
      document.removeEventListener("visibilitychange",schedule);
    };
  },[offset]);
  return <g ref={plate}><AtlasPlate eta={eta} id={id} teachers={teachers}/></g>;
}

function AtlasDefs({id}:{id:string}) {
  return <defs>
      <clipPath id={id+"-window"}><rect width={atlasSide} height={atlasSide}/></clipPath>
      <linearGradient id={id+"-blue"} gradientUnits="userSpaceOnUse" x1="0" y1={atlasSide} x2={atlasSide} y2="0">
        <stop stopColor="#284977"/><stop offset=".48" stopColor="#3a6bb1"/><stop offset="1" stopColor="#638bc8"/>
      </linearGradient>
      <linearGradient id={id+"-red"} gradientUnits="userSpaceOnUse" x1="0" y1={atlasSide} x2={atlasSide} y2="0">
        <stop stopColor="#794c61"/><stop offset=".55" stopColor="#ae606b"/><stop offset="1" stopColor="#d58078"/>
      </linearGradient>
      <pattern id={id+"-grain"} width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1" cy="2" r=".6" fill="#fee3d0" opacity=".18"/></pattern>
    </defs>;
}

// The inset uses the same anchor and target as the foreground print.
export function RepulsionWeightInset({teachers}:{teachers:Teachers}) {
  const id="gd-weight-inset-"+useId().replace(/:/g,"");
  return <g className="gd-weight-inset"><AtlasDefs id={id}/><MovingAtlasPlate id={id} teachers={teachers}/></g>;
}
