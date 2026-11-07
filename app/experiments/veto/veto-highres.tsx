"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import study from "./veto-study-data.json";
import paperExamples from "./veto-paper-examples.json";
import "./veto-collage.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const assetUrl = (src: string) => `${basePath}${src}`;
type Photo = { src: string; label: string; width?: number; height?: number; accent?: boolean };
type Position = { x: number; y: number };
export function ShieldIcon() { return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 2 8 3v6c0 5-4 8-8 11-4-3-8-6-8-11V5Z" stroke="currentColor" strokeWidth="1.5"/><path d="m8 11 3 3 5-6" stroke="currentColor" strokeWidth="1.5"/></svg>; }

/** Matched images share magnification and position without leaving their frames. */
export function SyncedPhotos({ photos, zoom = 1, eager = false, tall = false }: { photos: Photo[]; zoom?: number; eager?: boolean; tall?: boolean }) {
  const [point, setPoint] = useState<Position>({ x: 50, y: 50 });
  const [magnified, setMagnified] = useState(false);
  const drag = useRef<{x:number;y:number; moved:boolean}|null>(null);
  const scale = zoom > 1 ? zoom : magnified ? 2 : 1;
  return <div className="vxn-photos" data-count={photos.length} data-tall={tall} style={{ "--photo-count": photos.length, "--detail-x": `${point.x}%`, "--detail-y": `${point.y}%` } as CSSProperties}>
    {photos.map((photo, index) => <figure key={photo.label} data-accent={photo.accent}>
      <figcaption>{photo.accent && <ShieldIcon/>}{photo.label}</figcaption>
      <button className="vxn-photo" data-zoomed={scale > 1} type="button" aria-label={`${scale > 1 ? "Reset magnification" : "Magnify in place"}: ${photo.label}`} aria-pressed={scale>1}
        onClick={()=>{if(drag.current?.moved){drag.current=null;return;}setMagnified(value=>!value);}}
        onPointerDown={event=>{drag.current={x:event.clientX,y:event.clientY,moved:false};if(scale>1)event.currentTarget.setPointerCapture(event.pointerId);}}
        onPointerMove={event=>{if(scale===1)return;if(event.pointerType==="touch"){if(!drag.current)return;if(Math.hypot(event.clientX-drag.current.x,event.clientY-drag.current.y)>5)drag.current.moved=true;if(!drag.current.moved)return;}const rect=event.currentTarget.getBoundingClientRect();setPoint({x:Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100)),y:Math.max(0,Math.min(100,(event.clientY-rect.top)/rect.height*100))});}}
        onPointerCancel={()=>{drag.current=null;}}
        onKeyDown={event=>{if(event.key==="Escape"){setMagnified(false);return;}if(scale===1)return;const direction:Record<string,[number,number]>={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]};const delta=direction[event.key];if(!delta)return;event.preventDefault();setPoint(p=>({x:Math.max(0,Math.min(100,p.x+delta[0])),y:Math.max(0,Math.min(100,p.y+delta[1]))}));}}>
        <Image src={assetUrl(photo.src)} alt={photo.label} width={photo.width ?? 1024} height={photo.height ?? 1024} draggable={false} unoptimized loading={eager ? "eager" : "lazy"} fetchPriority={eager && index === 0 ? "high" : undefined} style={{transform:`scale(${scale})`,aspectRatio:`${photo.width??1024} / ${photo.height??1024}`}}/>
        <span className="vxc-zoom" aria-hidden="true">{scale>1?"1×":"2×"}</span>
      </button>
    </figure>)}
  </div>;
}

type Example={id:string;label:string;width:number;height:number;source:string;protected?:string;unprotected:string;veto:string};
const byId=(id:string)=>paperExamples.find(example=>example.id===id)!;
const fraudInstruction=study.instructions.find(instruction=>instruction.id==="c08-news")!;
function benchmarkExample(category:"general"|"defamation",index:number,label:string):Example {
  const image=(kind:"base"|"protected"|"edited"|"protected-edited")=>`/vetobench/${category}/images/${kind}/${index}.png`;
  return {id:`${category}-${index}`,label,width:512,height:512,source:image("base"),protected:image("protected"),unprotected:image("edited"),veto:image("protected-edited")};
}
const collage:Example[]=[
  benchmarkExample("defamation",54,"Surveillance"),
  study.cases[0],
  {
    id:fraudInstruction.id,label:"Fraud suspect",width:512,height:512,
    source:study.instructionInputs.unprotected,
    protected:study.instructionInputs.veto,
    unprotected:fraudInstruction.outputs.unprotected,
    veto:fraudInstruction.outputs.veto,
  },
  study.cases[2],
  benchmarkExample("defamation",59,"Booking photo"),
  byId("forest"),
  study.cases[1],
  benchmarkExample("defamation",0,"Pocket flask"),
];

function CollageTile({example,protectedInput,index}:{example:Example;protectedInput:boolean;index:number}) {
  const [source,setSource]=useState(false);
  const [zoomed,setZoomed]=useState(false);
  const [point,setPoint]=useState({x:50,y:50});
  const [dragged,setDragged]=useState(false);
  const start=useRef<{x:number;y:number}|null>(null);
  const sourceProtected=protectedInput&&Boolean(example.protected);
  const sourceImage=sourceProtected?example.protected!:example.source;
  const sourceLabel=sourceProtected?"VETO-protected input":"source image";
  const condition=source?sourceLabel:protectedInput?"Edit with VETO":"Edit without protection";
  return <article className={`vxc-tile vxc-tile-${index}`} data-protected={protectedInput&&(!source||sourceProtected)}>
    <div className="vxc-image-frame" style={{aspectRatio:`${example.width}/${example.height}`}}>
      <button className="vxc-image" type="button" aria-label={`${zoomed?"Reset magnification":"Magnify in place"}: ${example.label}, ${condition}`} aria-pressed={zoomed} data-zoomed={zoomed}
        onClick={()=>{if(dragged){setDragged(false);return;}setZoomed(value=>!value);}}
        onPointerDown={event=>{setDragged(false);start.current={x:event.clientX,y:event.clientY};if(zoomed)event.currentTarget.setPointerCapture(event.pointerId);}}
        onPointerMove={event=>{if(!zoomed)return;if(event.pointerType==="touch"){if(!start.current)return;if(Math.hypot(event.clientX-start.current.x,event.clientY-start.current.y)<5)return;setDragged(true);}const box=event.currentTarget.getBoundingClientRect();setPoint({x:Math.max(0,Math.min(100,(event.clientX-box.left)/box.width*100)),y:Math.max(0,Math.min(100,(event.clientY-box.top)/box.height*100))});}}
        onPointerUp={()=>{start.current=null;}}
        onPointerCancel={()=>{start.current=null;}}
        onKeyDown={event=>{if(event.key==="Escape"){setZoomed(false);return;}if(!zoomed)return;const directions:Record<string,[number,number]>={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]};const delta=directions[event.key];if(delta){event.preventDefault();setPoint(p=>({x:Math.max(0,Math.min(100,p.x+delta[0])),y:Math.max(0,Math.min(100,p.y+delta[1]))}));}}}>
        <div className="vxc-image-layers" style={{transform:zoomed?"scale(2)":"none",transformOrigin:`${point.x}% ${point.y}%`}}>
          <Image src={assetUrl(example.unprotected)} alt={`${example.label}: edit without protection`} aria-hidden={protectedInput||source} width={example.width} height={example.height} draggable={false} unoptimized loading={index<5?"eager":"lazy"}/>
          <Image src={assetUrl(example.veto)} alt={`${example.label}: edit with VETO`} aria-hidden={!protectedInput||source} width={example.width} height={example.height} draggable={false} unoptimized loading={index<5?"eager":"lazy"} className="vxc-protected-layer" style={{opacity:protectedInput?1:0}}/>
          {source&&<Image src={assetUrl(sourceImage)} alt={`${example.label}: ${sourceLabel}`} width={example.width} height={example.height} draggable={false} unoptimized className="vxc-source-layer"/>}
        </div>
        <span className="vxc-tile-name">{protectedInput&&(!source||sourceProtected)&&<ShieldIcon/>}{example.label}</span><span className="vxc-zoom" aria-hidden="true">{zoomed?"1×":"2×"}</span>
      </button>
      <button className="vxc-source" type="button" data-protected={sourceProtected} aria-label={`${source?"Show edit":`Show ${sourceLabel}`}: ${example.label}`} aria-pressed={source} onClick={()=>{setSource(value=>!value);setZoomed(false);}}><Image src={assetUrl(sourceImage)} alt="" width={example.width} height={example.height} draggable={false} unoptimized/><span>{source?"Edit":sourceProtected?"Protected":"Source"}</span></button>
    </div>
  </article>;
}

export function VetoHighResolution() {
  const [protectedInput,setProtectedInput]=useState(false);
  return <section className="vxc-collage vx-chapter" id="veto-evidence" data-chapter="Results" aria-labelledby="vxc-title">
    <div className="vxc-toolbar"><div><h2 id="vxc-title">Same instruction. <em>Protected source.</em></h2><p aria-live="polite">{protectedInput?"FLUX.2 edits with VETO protection":"FLUX.2 edits without protection"}</p></div><button type="button" className="vxc-protection" aria-pressed={protectedInput} onClick={()=>setProtectedInput(value=>!value)}><ShieldIcon/><span>VETO protection</span><i aria-hidden="true"><b/></i></button></div>
    <div className="vxc-mosaic">
      {collage.slice(0,5).map((example,index)=><CollageTile key={example.id} example={example} protectedInput={protectedInput} index={index}/>)}
      <div className="vxc-paper-column">
        <CollageTile example={collage[5]} protectedInput={protectedInput} index={5}/>
        <div className="vxc-people-pair">
          {collage.slice(6).map((example,index)=><CollageTile key={example.id} example={example} protectedInput={protectedInput} index={index+6}/>)}
        </div>
      </div>
    </div>
    <a className="vxc-to-input" href="#veto-fidelity">Inspect the protected inputs <span>↓</span></a>
  </section>;
}
