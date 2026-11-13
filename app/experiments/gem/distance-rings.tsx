import {useId, useRef} from "react";
import {RepulsionWeightInset, useRepulsionWeight} from "./repulsion-weight-inset";
import {anchor, target, distance, studentOnBoundary} from "./card-geometry.mjs";

type Point = {x:number; y:number};
const size=218;
const origin:Point={x:23,y:171};
const warm="#ffad96", cool="#92d5ff", ivory="#fff5dc";

function Arrow({p,color,marker}:{p:Point;color:string;marker:string}){
  const d=`M${origin.x} ${origin.y}L${p.x} ${p.y}`;
  return <g><path d={d} fill="none" stroke="#14263e" strokeWidth="5.4" opacity=".65"/>
    <path d={d} fill="none" stroke={color} strokeWidth="3.3" markerEnd={marker}/></g>;
}

function RingsDrawing({id,student:s}:{id:string;student:Point}){
  const ink=(k:string)=>`url(#${id}-${k})`;
  return <g className="gd-rings-live">
    <g clipPath={ink("trim")}>
      <rect width={size} height={size} fill={ink("paper")}/>
      <path d="M0 131.7 218 95.0V0H0Z" fill="#9e5b70" opacity=".27" />
      <rect width={size} height={size} fill={ink("tooth")} opacity=".42"/>
      {[{p:target,color:warm,fill:"#cc7473"},{p:anchor,color:cool,fill:"#7db9ff"}].map(({p,color,fill})=>{
        const radius=distance(p,s);
        return <g key={color}>
          <circle className="gd-ring-measure" cx={s.x} cy={s.y} r={radius}
            fill={fill} fillOpacity=".11" stroke="#1c304b" strokeOpacity=".55" strokeWidth="5.2"/>
          <circle className="gd-ring-measure" cx={s.x} cy={s.y} r={radius} fill="none" stroke={ink(p===target?"coral-ink":"azure-ink")} strokeWidth="3.3"/>
          <g transform={`translate(${p.x} ${p.y})`}>
            <g className="gd-ring-span" transform={`matrix(${s.x-p.x} ${s.y-p.y} 0 1 0 0)`}>
              <path d="M0 0h1" fill="none" stroke={color} strokeWidth=".95" strokeDasharray="2 3.5" vectorEffect="non-scaling-stroke"/>
            </g>
          </g>
        </g>;
      })}
      <Arrow p={target} color={warm} marker={ink("tip-r")}/>
      <Arrow p={anchor} color={cool} marker={ink("tip-b")}/>
      <g transform={`translate(${origin.x} ${origin.y})`}>
        <g className="gd-ring-span" transform={`matrix(${s.x-origin.x} ${s.y-origin.y} 0 1 0 0)`}>
          <path d="M0 0h1" fill="none" stroke={ivory} strokeWidth="1.8" vectorEffect="non-scaling-stroke"/>
        </g>
      </g>
      <g className="gd-ring-student" transform={`translate(${s.x} ${s.y}) rotate(${Math.atan2(s.y-origin.y,s.x-origin.x)*180/Math.PI})`}>
        <path d="M0 0-11-4.6-8.7 0-11 4.6Z" fill={ivory}/>
      </g>
      <circle cx={origin.x} cy={origin.y} r="3.4" fill={ivory} stroke="#33435c" strokeWidth="1.2"/>
      <g strokeWidth="2.4" stroke="#324059" paintOrder="stroke" >
        <text x="150" y="44" style={{fill:"#ffdbcd",font:"15px Arial,sans-serif"}}>Target</text>
        <text x="152" y="179" style={{fill:"#c3e4ff",font:"15px Arial,sans-serif"}}>Anchor</text>
      </g>
    </g>
  </g>;
}

// Both squares show the same velocities, in 218- and 144-unit windows.
const inInset = (p:Point) => ({x:p.x*144/size,y:p.y*144/size});
const insetTeachers = {anchor:inInset(anchor),target:inInset(target)};

export function DistanceEchoes(){
  const id="gd-dr-"+useId().replace(/:/g,"");
  const ink=(k:string)=>`url(#${id}-${k})`;
  const art = useRef<SVGGElement>(null);
  const eta = useRepulsionWeight(art);
  return <g ref={art} className="gd-rings-art" strokeLinejoin="round" strokeLinecap="round">
    <title>The student lies on the zero-loss boundary, where the ratio of anchor to target distance equals the repulsion weight.</title>
    <defs>
      <radialGradient id={id+"-aura"}><stop stopColor="#8d92be" stopOpacity=".20"/><stop offset="1" stopColor="#718bb7" stopOpacity="0"/></radialGradient>
      <linearGradient id={id+"-paper"} x2=".94" y2="1"><stop stopColor="#496d9b"/><stop offset=".42" stopColor="#334f85"/><stop offset="1" stopColor="#1d3763"/></linearGradient>
      <linearGradient id={id+"-rim"} x1=".15" y1="0" x2=".85" y2="1"><stop stopColor="#d1e0ef"/><stop offset=".31" stopColor="#a1b8d3"/><stop offset="1" stopColor="#6a86aa"/></linearGradient>
      <linearGradient id={id+"-coral-ink"} x1="0" y1=".1" x2=".9" y2=".85"><stop stopColor="#d77571"/><stop offset=".4" stopColor="#ffbba5"/><stop offset="1" stopColor="#e6817d"/></linearGradient>
      <linearGradient id={id+"-azure-ink"} x1=".1" y1="1" x2=".85" y2=".1"><stop stopColor="#609fe7"/><stop offset=".55" stopColor="#b4e7ff"/><stop offset="1" stopColor="#86bdf8"/></linearGradient>
      <pattern id={id+"-tooth"} width="5.5" height="6.5" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".65" fill="#dee5f5" opacity=".38"/></pattern>
      <clipPath id={id+"-trim"}><rect width={size} height={size} rx="1"/></clipPath>
      {[["tip-b",cool],["tip-r",warm]].map(([key,color])=><marker id={id+"-"+key} key={key} viewBox="0 0 13 12" refX="12" refY="6" markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="12" orient="auto"><path d="M0 .5 12.5 6 0 11.5 2.5 6Z" fill={color}/></marker>)}
    </defs>
    <ellipse cx="300" cy="161" rx="220" ry="129" fill={ink("aura")}/>
    <g transform="translate(88 93) rotate(-12) scale(1.27)">
      <RepulsionWeightInset teachers={insetTeachers} eta={eta}/>
    </g>
    <g transform="translate(264 44) rotate(6)">
      <rect x="2" y="5" width="232" height="232" rx="3" fill="#2b3d5a" stroke="#6d83a4" strokeWidth="1.7"/>
      <rect width="232" height="232" rx="3" fill={ink("rim")} stroke="#d2e0ed" strokeWidth="2.2"/>
      <g transform="translate(7 7)"><RingsDrawing id={id} student={studentOnBoundary(eta)}/></g>
      <path d="M7 225V7h218" fill="none" stroke="#30425e" strokeWidth="1.2"/>
    </g>
  </g>;
}
