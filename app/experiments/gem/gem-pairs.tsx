"use client";
import Image from "next/image";
import { useState,useId,type PointerEvent } from "react";
const samples=[{id:'gem',label:'Gore 1'},{id:'gore',label:'Gore 2'},{id:'nudity',label:'Nudity'},{id:'son_goku',label:'Son Goku'},{id:'stitch',label:'Stitch'}];
const base=process.env.NEXT_PUBLIC_BASE_PATH??'';
function Comparison({sample}:{sample:typeof samples[number]}){
 const [position,setPosition]=useState(50),id=useId();
 const update=(e:PointerEvent<HTMLDivElement>)=>{const rect=e.currentTarget.getBoundingClientRect();setPosition(Math.max(0,Math.min(100,(e.clientX-rect.left)/rect.width*100)));};
 return <figure className="gx-comparison"><div className="gx-image-wipe" onPointerDown={e=>{if((e.target as HTMLElement).tagName==='INPUT')return;e.currentTarget.setPointerCapture(e.pointerId);update(e);}} onPointerMove={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))update(e);}}>
 <Image src={`${base}/images/gem-showcase/gem/${sample.id}.png`} width={512} height={512} unoptimized alt={`After GEM: ${sample.label}`} />
 <div className="gx-base-layer" style={{clipPath:`inset(0 ${100-position}% 0 0)`}}><Image src={`${base}/images/gem-showcase/base/${sample.id}.png`} width={512} height={512} unoptimized alt={`Base FLUX: ${sample.label}`} /></div>
 <span className="gx-image-tag gx-tag-base">Base</span><span className="gx-image-tag gx-tag-gem">GEM</span>
 <div className="gx-wipe-line" style={{left:`${position}%`}} aria-hidden="true"><span>‹ ›</span></div>
 <input id={id} type="range" min="0" max="100" step="1" value={position} onChange={e=>setPosition(Number(e.target.value))} aria-label={`Compare base and GEM for ${sample.label}`} aria-valuetext={`${Math.round(position)} percent base image, ${100-Math.round(position)} percent GEM`} />
 </div><figcaption><h3>{sample.label}</h3><label htmlFor={id}>Drag to compare <span aria-hidden="true">↔</span></label></figcaption></figure>;
}
export function GemPairs(){return <section className="rx-gem-results" id="rx-results" aria-labelledby="rx-results-title"><div className="rx-shell rx-section-heading"><div><p className="section-number">01 / Qualitative results</p><h2 id="rx-results-title">Generations before<br/>and <em>after GEM.</em></h2></div><p>Move the divider to compare each base generation with its result after concept erasure.</p></div><div className="gx-comparison-grid rx-shell">{samples.map(sample=><Comparison sample={sample} key={sample.id}/>)}</div></section>}
