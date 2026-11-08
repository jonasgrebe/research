"use client";
import { useContext, useEffect, useRef } from "react";
import { drawReference, makeReferencePrint, makeProtectionLayer, referencePose } from "./iris-reference-print";
import { StudyMotionContext } from "../shared/study-shell";

type Vec = { x:number; y:number; z:number };
const halton=(index:number,base:number)=>{let value=0,f=1;for(let i=index;i>0;i=Math.floor(i/base)){f/=base;value+=f*(i%base);}return value;};
// A fixed, irregular sampling of a 3D slice. Field magnitude is illustrative,
// not a measured trajectory or a spatially selective protection mask.
const samples=Array.from({length:128},(_,i)=>{
 const angle=halton(i+1,2)*Math.PI*2,z=halton(i+1,3)*2-1,r=175*Math.cbrt(halton(i+1,5)),radial=Math.sqrt(1-z*z);
 const p={x:r*radial*Math.cos(angle),y:r*z*1.15,z:r*radial*Math.sin(angle)};
 const raw={x:42-.42*p.y+32*Math.sin(p.z/100),y:.5*p.x+28*Math.cos(p.y/100),z:60*Math.sin(p.x/110)-.27*p.y};
 const norm=Math.hypot(raw.x,raw.y,raw.z),length=45+35*halton(i+1,7);
 return {p,v:{x:raw.x/norm*length,y:raw.y/norm*length,z:raw.z/norm*length},phase:halton(i+1,11)};
});
export function IrisSculpture(){
 const canvas=useRef<HTMLCanvasElement>(null),clock=useRef(0),yaw=useRef(0),orbit=useRef(0),pitch=useRef(-.14),phase=useRef(0),blend=useRef(0);
 const paused=useContext(StudyMotionContext);
 const paintFrame=useRef<()=>void>(()=>{});
 const drag=useRef<{x:number;y:number}|null>(null);
 useEffect(()=>{
  const el=canvas.current,ctx=el?.getContext("2d");if(!el||!ctx)return;
  const dpr=Math.min(devicePixelRatio||1,2);el.width=650*dpr;el.height=735*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");let raf=0,last=0,visible=true;
  const project=(p:Vec)=>{const a=yaw.current+orbit.current,c=Math.cos(a),s=Math.sin(a),x=p.x*c+p.z*s,z=-p.x*s+p.z*c,y=p.y*Math.cos(pitch.current)-z*Math.sin(pitch.current),depth=p.y*Math.sin(pitch.current)+z*Math.cos(pitch.current),k=800/(800+depth);return{x:351+x*k*1.28,y:440+y*k*1.28,z:depth,k};};
  const print=makeReferencePrint();
  const film=makeProtectionLayer();
  const plate=(x:number,y:number)=>({
    x:referencePose[4]+x*referencePose[0]+y*referencePose[2],
    y:referencePose[5]+x*referencePose[1]+y*referencePose[3],
  });
  const draw=()=>{
   const b=blend.current,scale=1-b*.89;
   ctx.clearRect(0,0,650,735);
   // The faint rim catches the field’s outer silhouette without constraining its directions.
   const glow=ctx.createRadialGradient(329,408,32,351,440,289);
   glow.addColorStop(0,`rgba(85,130,155,${.10+b*.10})`);
   glow.addColorStop(.67,`rgba(92,151,184,${.07+b*.10})`);
   glow.addColorStop(.83,`rgba(151,214,236,${.025+b*.065})`);
   glow.addColorStop(1,"#3f719000");ctx.fillStyle=glow;ctx.fillRect(0,0,650,735);
   ctx.save();ctx.translate(351,440);ctx.rotate(-.24);
   const rim=ctx.createLinearGradient(-210,-150,223,150);
   rim.addColorStop(0,`rgba(183,223,235,${.13+b*.13})`);rim.addColorStop(.56,"#8cbad200");rim.addColorStop(1,`rgba(171,220,240,${.12+b*.14})`);
   ctx.strokeStyle=rim;ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(0,0,237,243,0,0,2*Math.PI);ctx.stroke();
   ctx.restore();

   // A handful of connections carry the image condition into the open field.
   for(let i=0;i<4;i++){
    const a=plate(64+i*25,169),end={x:297+i*23,y:267+i*6};
    const bendY=Math.max(a.y+15,end.y-35);
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.bezierCurveTo(a.x+12,bendY,end.x-20,end.y-24,end.x,end.y);
    ctx.strokeStyle=`rgba(167,222,237,${.19+b*.24})`;ctx.lineWidth=i===1?1.5:1;ctx.stroke();
    const t=(phase.current+i*.23)%1,u=1-t;
    const px=u**3*a.x+3*u*u*t*(a.x+12)+3*u*t*t*(end.x-20)+t**3*end.x;
    const py=u**3*a.y+3*u*u*t*bendY+3*u*t*t*(end.y-24)+t**3*end.y;
    ctx.beginPath();ctx.arc(px,py,1.65,0,Math.PI*2);ctx.fillStyle=`rgba(232,250,255,${(.5+b*.35)*Math.sin(t*Math.PI)})`;ctx.fill();
   }
   ctx.lineJoin="round";ctx.lineCap="round";
   const arrow=(p:Vec,v:Vec,factor:number,color:string,width:number)=>{
    const a=project(p),tip=project({x:p.x+v.x*factor,y:p.y+v.y*factor,z:p.z+v.z*factor});
    const angle=Math.atan2(tip.y-a.y,tip.x-a.x),head=Math.min(6*a.k,Math.hypot(tip.x-a.x,tip.y-a.y)*.35);
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(tip.x,tip.y);ctx.strokeStyle=color;ctx.lineWidth=width*a.k;ctx.stroke();
    ctx.beginPath();ctx.moveTo(tip.x-head*Math.cos(angle-.42),tip.y-head*Math.sin(angle-.42));ctx.lineTo(tip.x,tip.y);ctx.lineTo(tip.x-head*Math.cos(angle+.42),tip.y-head*Math.sin(angle+.42));ctx.stroke();return{a,tip};
   };
   [...samples].sort((a,b)=>project(b.p).z-project(a.p).z).forEach(({p,v,phase:offset},i)=>{
    const a=project(p),opacity=Math.min(.95,.32+(220-a.z)/620);
    arrow(p,v,1,`rgba(180,205,220,${.055+b*.16})`,.8);
    // The preservation branch stays close; the protected branch suppresses magnitude.
    const adapted={x:v.x+(1-b)*v.y*.025,y:v.y-(1-b)*v.z*.025,z:v.z};
    const rgb=[240-47*b,185+51*b,140+115*b].map(Math.round).join(',');
    const result=arrow(p,adapted,scale,`rgba(${rgb},${opacity})`,1.65+b*.65);
    ctx.beginPath();ctx.arc(a.x,a.y,1.65*a.k,0,Math.PI*2);ctx.fillStyle=`rgba(188,231,255,${opacity*.6})`;ctx.fill();
    const t=(phase.current+offset)%1;
    if(i%2===0){const x=result.a.x+(result.tip.x-result.a.x)*t,y=result.a.y+(result.tip.y-result.a.y)*t;ctx.beginPath();ctx.arc(x,y,1.8*a.k,0,Math.PI*2);ctx.shadowBlur=9;ctx.shadowColor="#c5eeff";ctx.fillStyle=`rgba(237,252,255,${opacity*Math.sin(t*Math.PI)})`;ctx.fill();ctx.shadowBlur=0;}
   });
   drawReference(ctx,print,film,b);
  };
  paintFrame.current=draw;
  function tick(now:number){
    if(now-last>=33){
      const dt=Math.min(now-last,66)/1000;
      last=now;
      clock.current+=dt;
      const cycle=clock.current%18,progress=cycle<4?0:cycle<8?(cycle-4)/4:cycle<12?1:cycle<16?1-(cycle-12)/4:0;
      blend.current=progress*progress*(3-2*progress);
      // Keep the viewing angle continuous as the magnitude and speed decrease.
      orbit.current=(orbit.current+dt*(.19-blend.current*.177))%(Math.PI*2);
      phase.current=(phase.current+dt*(.68-blend.current*.61))%1;
      draw();
    }
    raf=requestAnimationFrame(tick);
  }
  function schedule(){
    cancelAnimationFrame(raf);
    if(reduced.matches) blend.current=1;
    if(!visible || document.hidden) return;
    draw();
    if(paused || reduced.matches) return;
    last=performance.now();
    raf=requestAnimationFrame(tick);
  }
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule();});
  observer.observe(el);
  reduced.addEventListener("change",schedule);
  document.addEventListener("visibilitychange",schedule);
  schedule();
  return ()=>{
    cancelAnimationFrame(raf);
    observer.disconnect();
    document.removeEventListener("visibilitychange",schedule);
    reduced.removeEventListener("change",schedule);
    paintFrame.current=()=>{};
  };
 },[paused]);
 return <div className="ix-field-hero"><canvas ref={canvas} width="650" height="735" className="rx-sculpture ix-kinetic" role="img" tabIndex={0} aria-label="An image with a translucent watermark layer feeds a conceptual three-dimensional velocity field. Its rotation and flow slow during cooldown, and warm arrows contract into icy, shorter velocities across the field. Faint arrows retain the original magnitudes. Drag or use arrow keys to adjust the view."
 onPointerDown={e=>{drag.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{if(!drag.current)return;yaw.current+=(e.clientX-drag.current.x)*.008;pitch.current=Math.max(-1,Math.min(1,pitch.current+(e.clientY-drag.current.y)*.006));drag.current={x:e.clientX,y:e.clientY};paintFrame.current();}} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}} onKeyDown={e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();yaw.current+=e.key==='ArrowLeft'?-.12:e.key==='ArrowRight'?.12:0;pitch.current+=e.key==='ArrowUp'?-.08:e.key==='ArrowDown'?.08:0;paintFrame.current();}}}/>
 </div>;
}
