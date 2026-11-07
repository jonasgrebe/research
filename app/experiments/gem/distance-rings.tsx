import {useId, type CSSProperties} from "react";
import "./distance-rings.css";
import {RepulsionWeightInset} from "./repulsion-weight-inset";

type Point = {x:number; y:number};
const size=218;
const origin:Point={x:23,y:171};
const target:Point={x:147,y:55};
const anchor:Point={x:164,y:156};
const nearTarget:Point={x:120,y:76};
const nearAnchor:Point={x:126,y:144};
const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y);
const warm="#ffad96", cool="#92d5ff", ivory="#fff5dc";
const custom=(style:Record<string,string|number>)=>style as CSSProperties;
const delta={x:nearAnchor.x-nearTarget.x,y:nearAnchor.y-nearTarget.y};

// Fixed teacher tips, variable student. Every circle passes through its teacher.
// Dashed segments and the radii share the same interpolated student position.
function geometry(p:Point){
  return custom({"--ring-x":p.x,"--ring-y":p.y,"--ring-sx0":nearTarget.x,"--ring-sy0":nearTarget.y,
    "--ring-travel-x":delta.x,"--ring-travel-y":delta.y});
}

function Arrow({p,color,marker}:{p:Point;color:string;marker:string}){
  const d=`M${origin.x} ${origin.y}L${p.x} ${p.y}`;
  return <g><path d={d} fill="none" stroke="#14263e" strokeWidth="5.4" opacity=".65"/>
    <path d={d} fill="none" stroke={color} strokeWidth="3.3" markerEnd={marker}/></g>;
}

function RingsDrawing({id}:{id:string}){
  const s=nearAnchor;
  const ink=(k:string)=>`url(#${id}-${k})`;
  return <g className="gd-rings-live">
    <g clipPath={ink("trim")}>
      <rect width={size} height={size} fill={ink("paper")}/>
      <path d="M0 131.7 218 95.0V0H0Z" fill="#9e5b70" opacity=".27" />
      <rect width={size} height={size} fill={ink("tooth")} opacity=".42"/>
      {[{p:target,color:warm,fill:"#cc7473"},{p:anchor,color:cool,fill:"#7db9ff"}].map(({p,color,fill})=>{
        const radius=distance(p,s);
        return <g key={color} style={geometry(p)}>
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
      <g transform={`translate(${origin.x} ${origin.y})`} style={geometry(origin)}>
        <g className="gd-ring-span" transform={`matrix(${s.x-origin.x} ${s.y-origin.y} 0 1 0 0)`}>
          <path d="M0 0h1" fill="none" stroke={ivory} strokeWidth="1.8" vectorEffect="non-scaling-stroke"/>
        </g>
      </g>
      <g style={geometry(origin)}>
        <g className="gd-ring-student" transform={`translate(${s.x} ${s.y}) rotate(${Math.atan2(s.y-origin.y,s.x-origin.x)*180/Math.PI})`}>
          <path d="M0 0-11-4.6-8.7 0-11 4.6Z" fill={ivory}/>
        </g>
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
  return <g className="gd-rings-art" strokeLinejoin="round" strokeLinecap="round">
    <title>Distance to the anchor and target in front; the effect of the repulsion weight on the zero-loss region behind.</title>
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
      <RepulsionWeightInset teachers={insetTeachers}/>
    </g>
    <g transform="translate(264 44) rotate(6)">
      <rect x="2" y="5" width="232" height="232" rx="3" fill="#2b3d5a" stroke="#6d83a4" strokeWidth="1.7"/>
      <rect width="232" height="232" rx="3" fill={ink("rim")} stroke="#d2e0ed" strokeWidth="2.2"/>
      <g transform="translate(7 7)"><RingsDrawing id={id}/></g>
      <path d="M7 225V7h218" fill="none" stroke="#30425e" strokeWidth="1.2"/>
    </g>
  </g>;
}
