"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import "./inspectable-image.css";

export function InspectableImage({src,alt,width=512,height=512}: {src:string; alt:string; width?:number; height?:number}) {
  const helpId=useId();
  const [zoomed,setZoomed]=useState(false);
  const [point,setPoint]=useState({x:50,y:50});
  const touchStart=useRef<{x:number;y:number}|null>(null);
  const dragged=useRef(false);
  return <><button className="rx-image-inspect rx-inline-image" type="button" data-zoomed={zoomed}
    aria-label={`${zoomed ? "Reset magnification" : "Magnify image in place"}: ${alt}`}
    aria-describedby={helpId}
    aria-pressed={zoomed}
    onClick={()=>{if(dragged.current){dragged.current=false;return;}setZoomed(value=>!value);}}
    onPointerDown={event=>{
      dragged.current=false;
      if(zoomed && event.pointerType==="touch"){
        touchStart.current={x:event.clientX,y:event.clientY};
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    }}
    onPointerMove={event=>{
      if(!zoomed)return;
      if(event.pointerType==="touch"){
        if(!touchStart.current)return;
        if(Math.hypot(event.clientX-touchStart.current.x,event.clientY-touchStart.current.y)>5)dragged.current=true;
        if(!dragged.current)return;
      }
      const bounds=event.currentTarget.getBoundingClientRect();
      setPoint({x:Math.max(0,Math.min(100,(event.clientX-bounds.left)/bounds.width*100)),y:Math.max(0,Math.min(100,(event.clientY-bounds.top)/bounds.height*100))});
    }}
    onPointerUp={event=>{touchStart.current=null;if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);}}
    onPointerCancel={()=>{touchStart.current=null;dragged.current=false;}}
    onKeyDown={event=>{
      if(event.key==="Escape"){setZoomed(false);return;}
      if(!zoomed)return;
      const delta:Record<string,[number,number]>={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]};
      const direction=delta[event.key];
      if(direction){event.preventDefault();setPoint(current=>({x:Math.max(0,Math.min(100,current.x+direction[0])),y:Math.max(0,Math.min(100,current.y+direction[1]))}));}
    }}>
    <Image src={src} alt={alt} width={width} height={height} unoptimized draggable={false} style={{transform:zoomed?"scale(2)":"none",transformOrigin:`${point.x}% ${point.y}%`}}/>
    <span className="rx-inline-zoom-label" aria-hidden="true">{zoomed?"1×":"2×"}</span>
  </button><span id={helpId} hidden>Press Enter or Space to change magnification. When magnified, use arrow keys to pan or Escape to reset.</span></>;
}
