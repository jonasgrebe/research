"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";
import { InspectableImage } from "./inspectable-image";
import "./media-lightbox.css";

type LightboxImage = { src: string; alt: string; label?: string; width?: number; height?: number };

/** Compatibility API for legacy callers; comparisons now stay in the document flow. */
export function MediaLightbox({ title, images, description, caption, maxImageWidth, onClose }: {
  title: string; images: LightboxImage[]; description?: string; caption?: string; maxImageWidth?: number; onClose: () => void;
}) {
  const titleId=useId();
  const section=useRef<HTMLElement>(null);
  const trigger=useRef<HTMLElement|null>(null);
  useEffect(()=>{
    const node=section.current;
    if(!node)return;
    const active=document.activeElement;
    if(active instanceof HTMLElement&&!node.contains(active))trigger.current=active;
    node.scrollIntoView({block:"nearest",behavior:"instant"});
    node.focus({preventScroll:true});
  },[title]);
  return <section ref={section} tabIndex={-1} className="research-inline-comparison" aria-labelledby={titleId}
    style={{"--comparison-columns":images.length} as CSSProperties}>
    <header><h3 id={titleId}>{title}</h3><button type="button" onClick={()=>{onClose();trigger.current?.focus({preventScroll:true});}}>Collapse comparison</button></header>
    {description&&<p className="research-inline-description">{description}</p>}
    <div className="research-inline-images">{images.map((image,index)=><figure key={`${image.src}-${index}`}
      style={{maxWidth:Math.min(image.width??512,maxImageWidth??Infinity)}}>
      {image.label&&<figcaption>{image.label}</figcaption>}
      <InspectableImage src={image.src} alt={image.alt} width={image.width??512} height={image.height??512}/>
    </figure>)}</div>
    {caption&&<p className="research-inline-caption">{caption}</p>}
  </section>;
}
