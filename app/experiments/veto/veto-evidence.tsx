"use client";

import Image from "next/image";
import { useState } from "react";
import study from "./veto-study-data.json";
import { vetoMethodColors as colors } from "./veto-methods";
import { assetUrl, ShieldIcon, SyncedPhotos } from "./veto-highres";

const refNames = ["First person", "Second person", "Dog", "Location"];
const multiPrompt = "Create a candid photo of the people in images 1 and 2 walking with the animal from image 3 at the location in image 4.";
export function VetoMultiReference() {
  const [condition, setCondition] = useState("ref1_only");
  const selected = condition === "all_protected" ? [1,2,3,4] : condition === "all_clean" ? [] : [Number(condition.charAt(3))];
  const label = selected.length === 4 ? "All references protected" : selected.length === 0 ? "No protection" : `${refNames[selected[0]-1]} protected`;
  const photos = [{src:study.multi.outputs.all_clean,label:"Edit without protection",width:512,height:512},{src:study.multi.outputs[condition as keyof typeof study.multi.outputs],label,accent:selected.length>0,width:512,height:512}];
  return <section className="vxn-multi vx-shell vx-chapter" id="veto-multi-reference" data-chapter="Generalization" aria-labelledby="vxn-multi-title">
    <div className="vxn-heading"><div><p className="section-number">06 / Multiple references</p><h2 id="vxn-multi-title">Four references.<br/><em>Choose what to protect.</em></h2></div><p>Editors can combine people, objects, and places from different images. Select a reference to see what changes when that input is protected.</p></div>
    <div className="vxn-multi-stage"><div className="vxn-references"><div className="vxn-reference-grid">{study.multi.references.map((ref,index)=><button key={ref.id} type="button" aria-pressed={selected.includes(ref.id)} aria-label={`Protect reference ${ref.id}: ${refNames[index]}`} onClick={()=>setCondition(`ref${ref.id}_only`)}><Image src={assetUrl(selected.includes(ref.id)?ref.protected:ref.source)} alt={refNames[index]} width={512} height={512} unoptimized/><span><span>{String(ref.id).padStart(2,"0")} / {refNames[index]}</span><ShieldIcon/></span></button>)}</div><div className="vxn-reference-actions"><button type="button" aria-pressed={condition==="all_clean"} onClick={()=>setCondition("all_clean")}>All clean</button><button type="button" aria-pressed={condition==="all_protected"} onClick={()=>setCondition("all_protected")}><ShieldIcon/> Protect all four</button></div></div><div className="vxn-reference-arrow" aria-hidden="true">→</div><div className="vxn-multi-outputs"><SyncedPhotos photos={photos}/></div></div>
    <blockquote className="vxn-multi-prompt">“{multiPrompt}”</blockquote>
  </section>;
}

type PlotPoint = typeof study.pareto[number]["points"][number];
function ParetoPlot({panel}: {panel:typeof study.pareto[number]}) {
  const [point,setPoint]=useState<PlotPoint|null>(null);
  const x=(value:number)=>60+value/.8*460,y=(value:number)=>332-value/1.1*280;
  const baseline=panel.points.find(p=>p.method==="Unprotected")!;
  return <figure className="vxn-plot"><figcaption><h3>{panel.frame==="open"?"Open-frame edits":"Closed-frame edits"}</h3><span>n = {panel.n}</span></figcaption><svg viewBox="0 0 560 390" aria-label={`${panel.frame}-frame editing success versus image distortion`}>
    {[0,.25,.5,.75,1].map(t=><g key={t}><path d={`M60 ${y(t)}H520`} stroke="#b4d7c5" strokeOpacity=".12"/><text x="46" y={y(t)+4} textAnchor="end">{t.toFixed(2)}</text></g>)}
    {[0,.2,.4,.6,.8].map(t=><g key={t}><path d={`M${x(t)} 52V332`} stroke="#b4d7c5" strokeOpacity=".06"/><text x={x(t)} y="353" textAnchor="middle">{t.toFixed(1)}</text></g>)}
    <path d="M60 52V332H520" fill="none" stroke="#61796e"/>
    <text transform="translate(16 192) rotate(-90)" textAnchor="middle" className="vxn-axis-label">Relative editing success ↓</text><text x="290" y="383" textAnchor="middle" className="vxn-axis-label">Input distortion · LPIPS ↓</text>
    {Object.keys(colors).filter(m=>m!=="Unprotected").map(method=>{const points=[baseline,...panel.points.filter(p=>p.method===method).sort((a,b)=>a.epsilon-b.epsilon)];return <g key={method} opacity={point && point.method!==method && point.method!=="Unprotected" ? .25:1}><path d={points.map((p,i)=>`${i?"L":"M"}${x(p.lpips)},${y(p.normalized_esr)}`).join(" ")} fill="none" stroke={colors[method]} strokeWidth={method==="VETO"?2.8:1.5}/>{points.slice(1).map(p=><g key={p.epsilon} role="button" tabIndex={0} aria-label={`${method}, epsilon ${p.epsilon}/255: input LPIPS ${p.lpips.toFixed(3)}, relative editing success ${p.normalized_esr.toFixed(3)}`} onPointerEnter={()=>setPoint(p)} onPointerLeave={()=>setPoint(null)} onFocus={()=>setPoint(p)} onBlur={()=>setPoint(null)} onClick={()=>setPoint(p)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setPoint(p);}}}><circle cx={x(p.lpips)} cy={y(p.normalized_esr)} r="11" fill="transparent"/><circle cx={x(p.lpips)} cy={y(p.normalized_esr)} r={method==="VETO"?4.5:3.5} fill="#10221e" stroke={colors[method]} strokeWidth="2"/></g>)}</g>;})}
    <circle cx={x(0)} cy={y(1)} r="4" fill="#d8e2db"/>
  </svg><div className="vxn-plot-readout" aria-live="polite">{point?<><strong style={{color:colors[point.method]}}>{point.method} · ε = {point.epsilon}/255</strong><span>LPIPS {point.lpips.toFixed(3)} · Relative ESR {point.normalized_esr.toFixed(3)} · ESR {point.esr.toFixed(1)}%</span></>:<><strong>{panel.frame==="open"?"Recontextualization":"Local modification"}</strong><span>Lower and further left is better.</span></>}</div></figure>;
}
export function VetoTradeoff() {
  const [editor,setEditor]=useState("flux2");
  return <section className="vxn-tradeoff vx-chapter" id="veto-tradeoff" data-chapter="Evaluation" aria-labelledby="vxn-tradeoff-title"><div className="vx-shell"><div className="vxn-heading"><div><p className="section-number">07 / Protection & fidelity</p><h2 id="vxn-tradeoff-title">Protection and<br/><em>image fidelity.</em></h2></div><p>Compare editing success against distortion of the protected input, across five perturbation budgets and two frontier editors.</p></div><div className="vxn-chart-toolbar"><div className="vxn-segment" role="group" aria-label="Evaluation editor">{[{key:"flux2",label:"FLUX.2"},{key:"fibo_edit",label:"FIBO-Edit"}].map(m=><button type="button" key={m.key} aria-pressed={editor===m.key} onClick={()=>setEditor(m.key)}>{m.label}</button>)}</div><div className="vxn-legend">{Object.entries(colors).filter(([m])=>m!=="Unprotected").map(([m,c])=><span key={m}><i style={{background:c}}/>{m}</span>)}</div></div><div className="vxn-plot-pair">{study.pareto.filter(p=>p.model===editor).map(p=><ParetoPlot key={`${p.model}-${p.frame}`} panel={p}/>)}</div><p className="vxn-chart-explanation">Relative editing success is the protected success rate divided by the unprotected rate for the same editor and frame type. Each point changes the pixel budget; lower values on both axes are preferable.</p></div></section>;
}
