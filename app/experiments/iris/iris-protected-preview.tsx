"use client";

import Image from "next/image";
import { useState } from "react";
import "./iris-protected-preview.css";

const sharedNoiseSrc=`${process.env.NEXT_PUBLIC_BASE_PATH??""}/iris/source/booking-protected-edit.png`;

/** Protection is previewed in place; illustrative scenarios reuse the opening example's noise image. */
export function IrisProtectedPreview({src,protectedSrc,alt,caption,width=512,height=512}: {src:string;protectedSrc?:string;alt:string;caption?:string;width?:number;height?:number}) {
  const [enabled,setEnabled]=useState(false);
  const [hovered,setHovered]=useState(false);
  const active=hovered||enabled;
  const noiseSrc=protectedSrc??sharedNoiseSrc;
  const protectedAlt=protectedSrc?"FLUX.2 edit w/ IRIS protection: the requested edit remains noisy":"Illustrative noise preview of IRIS protection";
  return <>
    <div className="rx-image-inspect ix-protection-preview ix-inline-preview" data-protected={active}
      onPointerEnter={event=>{if(event.pointerType!=="touch")setHovered(true);}} onPointerLeave={()=>setHovered(false)}>
      <Image src={src} alt={alt} width={width} height={height} unoptimized aria-hidden={active}/>
      <Image className="ix-noise-output" src={noiseSrc} alt={protectedAlt} width={512} height={512} unoptimized aria-hidden={!active}/>
    </div>
    <div className="ix-inline-preview-actions"><button type="button" role="switch" aria-checked={active}
      aria-label={protectedSrc?`IRIS protection for ${alt}`:`Illustrative protection preview for ${alt}`}
      onClick={()=>{setEnabled(!active);setHovered(false);}}><span>{protectedSrc?"IRIS protection":"Protection preview"}</span><span className="ix-inline-preview-switch" aria-hidden="true"><span/></span><strong>{active?"On":"Off"}</strong></button></div>
    {caption&&<figcaption className="ix-protection-caption" data-protected={active}>{active?'FLUX.2 edit w/ IRIS protection':caption}</figcaption>}
  </>;
}
