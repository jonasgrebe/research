"use client";
import { useContext,useEffect,useRef } from "react";
import { StudyMotionContext } from "./study-shell";
import { HERO_ANCHOR as anchor, HERO_TARGET as target, HERO_STUDENT as student, HERO_ORIGIN as origin, heroEtaAtTime, heroSignedLoss } from "./gem-hero-field";
type Point={x:number;y:number;z:number;raw:number};
const coordinates=(foci:number[])=>[...new Set([...Array.from({length:49},(_,i)=>i*7.5),...foci.flatMap(p=>[-3,-1,0,1,3].map(d=>p+d))])].sort((a,b)=>a-b);
const xs=coordinates([anchor.x,target.x]),ys=coordinates([anchor.y,target.y]);
const grid=ys.flatMap(y=>xs.map(x=>({x:x-180,y:y-180,a:Math.hypot(x-anchor.x,y-anchor.y)/100,b:Math.hypot(x-target.x,y-target.y)/100})));
const triangles:number[][]=[];
for(let r=0;r<ys.length-1;r++)for(let c=0;c<xs.length-1;c++){const a=r*xs.length+c,b=a+1,d=a+xs.length+1,e=a+xs.length;triangles.push([a,b,d],[a,d,e]);}
// Split triangles on the signed zero contour before applying the hinge. This
// keeps the flat region flat instead of drawing quads across the kink.
function clip(points:Point[],positive:boolean){
 const out:Point[]=[];
 points.forEach((p,i)=>{const q=points[(i+1)%points.length],inside=positive?p.raw>=0:p.raw<=0,next=positive?q.raw>=0:q.raw<=0;if(inside)out.push(p);if(inside!==next){const t=p.raw/(p.raw-q.raw);out.push({x:p.x+(q.x-p.x)*t,y:p.y+(q.y-p.y)*t,z:0,raw:0});}});
 return out;
}
export function GemSculpture(){
 const canvas=useRef<HTMLCanvasElement>(null),camera=useRef({yaw:.65,pitch:.56,dragging:false,x:0,y:0}),phase=useRef(0),orbit=useRef(0),paint=useRef<()=>void>(()=>{}),paused=useContext(StudyMotionContext);
 useEffect(()=>{
  const el=canvas.current,ctx=el?.getContext('2d');if(!el||!ctx)return;
  let frame=0,last=0,visible=true;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const draw=()=>{
   const eta=heroEtaAtTime(phase.current);
   el.dataset.eta=eta.toFixed(3);
   const yaw=camera.current.yaw+orbit.current,pitch=camera.current.pitch;
   const cos=Math.cos(yaw),sin=Math.sin(yaw),ce=Math.cos(pitch),se=Math.sin(pitch);
   const project=(p:Point)=>{const rx=p.x*cos-p.y*sin,ry=p.x*sin+p.y*cos;return {x:325+rx*1.04,y:355+ry*se-p.z*ce,depth:ry*ce+p.z*se};};
   ctx.clearRect(0,0,650,610);const aura=ctx.createRadialGradient(325,350,20,325,350,305);aura.addColorStop(0,'#6478c522');aura.addColorStop(1,'#6478c500');ctx.fillStyle=aura;ctx.fillRect(0,0,650,610);
   const polygon=(points:Point[],fill:string,stroke=fill,lineWidth=.4)=>{
    ctx.beginPath();
    points.forEach((point,index)=>{
     const projected=project(point);
     if(index===0) ctx.moveTo(projected.x,projected.y);
     else ctx.lineTo(projected.x,projected.y);
    });
    ctx.closePath();
    ctx.fillStyle=fill;
    ctx.fill();
    ctx.strokeStyle=stroke;
    ctx.lineWidth=lineWidth;
    ctx.stroke();
   };
   polygon([{x:-200,y:-200,z:-24,raw:0},{x:200,y:-200,z:-24,raw:0},{x:200,y:200,z:-24,raw:0},{x:-200,y:200,z:-24,raw:0}],'#19263a44','#819ec42a',.8);
   const samples=grid.map(p=>{const raw=p.a-eta*p.b;return {x:p.x,y:p.y,z:Math.max(0,raw)*56,raw};});
   const faces:{points:Point[];positive:boolean;loss:number;depth:number}[]=[];
   for(const indices of triangles){const points=indices.map(i=>samples[i]),min=Math.min(...points.map(p=>p.raw)),max=Math.max(...points.map(p=>p.raw));
    const add=(part:Point[],positive:boolean)=>{if(part.length<3)return;faces.push({points:part,positive,loss:part.reduce((s,p)=>s+Math.max(0,p.raw),0)/part.length,depth:part.reduce((s,p)=>s+project(p).depth,0)/part.length});};
    if(min>=0)add(points,true);else if(max<=0)add(points,false);else {add(clip(points,true),true);add(clip(points,false),false);}
   }
   faces.sort((a,b)=>a.depth-b.depth);
   for(const f of faces){
    const t=Math.min(1,f.loss/2.5),color=f.positive?`rgb(${Math.round(185+51*t)},${Math.round(123-17*t)},${Math.round(153-41*t)})`:'#4584c6';
    polygon(f.points,color,color,1.0);
    // Contour fragments are drawn with each facet, so foreground geometry
    // occludes them correctly. No transparent far-face bleed-through.
    if(f.positive)for(const level of [0,.5,1,1.5,2,2.5,3,3.5,4]){
     const points=f.points,intersections:Point[]=[];
     for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];if(level===0&&Math.abs(a.raw)<1e-9){intersections.push(a);continue;}if((a.raw>=level)===(b.raw>=level))continue;const t=(level-a.raw)/(b.raw-a.raw);intersections.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:level*56,raw:level});}
     if(intersections.length===2){const a=project(intersections[0]),b=project(intersections[1]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=level===0?'#dfedffbb':'#ffded65c';ctx.lineWidth=level===0?1.05:.6;ctx.stroke();}
    }
   }
   // The arrows are velocity predictions in one common 2D plane. Its height is
   // only a display offset: dotted projections connect endpoints to their losses.
   // Eta changes the objective, never the fixed teacher/student velocity lengths.
   const velocityPoint=(p:{x:number;y:number})=>project({x:p.x-180,y:p.y-180,z:270,raw:0});
   const predictions=[{point:anchor,name:'Anchor',color:'#a6d4ff'},{point:target,name:'Target',color:'#ffa39d'},{point:student,name:'Student',color:'#f0f4ff'}];
   const tips=predictions.map(p=>velocityPoint(p.point)),start=velocityPoint(origin);
   const line=(a:{x:number;y:number},b:{x:number;y:number},color:string,width:number,dash:number[]=[])=>{
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);
   };
   // Perspective turns distance circles into ellipses. Their radii come from
   // the velocity coordinates, before projection, so each ring meets its teacher.
   for (const teacher of [predictions[0], predictions[1]]) {
    const dx = teacher.point.x - student.x;
    const dy = teacher.point.y - student.y;
    const radius = Math.hypot(dx, dy);
    const direction = Math.atan2(dy, dx);
    const ring = (halfAngle:number, alpha:string, width:number) => {
     ctx.beginPath();
     for (let i=0; i<=80; i++) {
      const angle = direction + halfAngle * (2*i/80-1);
      const point = velocityPoint({x:student.x + radius*Math.cos(angle), y:student.y + radius*Math.sin(angle)});
      if (i===0) ctx.moveTo(point.x,point.y);
      else ctx.lineTo(point.x,point.y);
     }
     ctx.strokeStyle=teacher.color+alpha;
     ctx.lineWidth=width;
     ctx.stroke();
    };
    ring(Math.PI, "4a", 1.1);
    ring(.52, "cc", 2.1);
   }
   predictions.forEach((prediction,i)=>{
    const p=prediction.point,raw=heroSignedLoss(p,eta),surface=project({x:p.x-180,y:p.y-180,z:Math.max(0,raw)*56,raw});
    line(tips[i],surface,prediction.color+'50',.9,[2,6]);
    ctx.beginPath();ctx.arc(surface.x,surface.y,4,0,Math.PI*2);ctx.fillStyle=prediction.color;ctx.fill();ctx.strokeStyle='#172333';ctx.lineWidth=1.5;ctx.stroke();
   });
   // Distances join velocity endpoints; they are not update directions.
   ctx.beginPath();tips.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();
   const contrast=ctx.createLinearGradient(tips[0].x,tips[0].y,tips[1].x,tips[1].y);contrast.addColorStop(0,'#8fcaff12');contrast.addColorStop(1,'#ff9e9712');ctx.fillStyle=contrast;ctx.fill();
   line(tips[2],tips[0],'#a6d4ffbb',1.5,[5,5]);
   line(tips[2],tips[1],eta===0?'#ffa39d33':'#ffa39dbb',1.2+Math.min(eta,3)*.3,[5,5]);
   predictions.forEach((prediction,i)=>{
    const tip=tips[i],dx=tip.x-start.x,dy=tip.y-start.y,length=Math.hypot(dx,dy),ux=dx/length,uy=dy/length;
    const end={x:tip.x-ux*5,y:tip.y-uy*5};
    ctx.lineCap='round';line(start,end,'#10182699',6);line(start,end,prediction.color,i===2?3.2:2.7);
    ctx.beginPath();ctx.moveTo(end.x,end.y);ctx.lineTo(end.x-ux*12+uy*5,end.y-uy*12-ux*5);ctx.lineTo(end.x-ux*12-uy*5,end.y-uy*12+ux*5);ctx.closePath();ctx.fillStyle=prediction.color;ctx.fill();
    // A small moving highlight follows each predicted velocity, never a gradient.
    const t=(phase.current*.35+i*.23)%1;
    line({x:start.x+dx*Math.max(0,t-.12),y:start.y+dy*Math.max(0,t-.12)},{x:start.x+dx*t,y:start.y+dy*t},'#ffffffbb',1.4);
    ctx.beginPath();ctx.arc(tip.x,tip.y,4,0,Math.PI*2);ctx.fillStyle=prediction.color;ctx.fill();
   });
   ctx.beginPath();ctx.arc(start.x,start.y,4,0,Math.PI*2);ctx.fillStyle='#f0f4ff';ctx.fill();
   const occupied:{x:number;y:number;width:number;height:number}[]=[{x:490,y:40,width:85,height:32}];
   ctx.font="17px 'Helvetica Neue',Arial,sans-serif";
   predictions.forEach((prediction,i)=>{
    const p=tips[i],width=ctx.measureText(prediction.name).width;
    const options=[{x:p.x-width/2,y:p.y-33},{x:p.x+15,y:p.y-12},{x:p.x-width-15,y:p.y-12},{x:p.x-width/2,y:p.y+16}];
    const score=(box:{x:number;y:number})=>occupied.reduce((sum,other)=>sum+(box.x<other.x+other.width+8&&box.x+width+8>other.x&&box.y<other.y+other.height+6&&box.y+22>other.y?1000:0),0)
     +tips.reduce((sum,other,j)=>sum+(i!==j&&other.x>box.x-12&&other.x<box.x+width+12&&other.y>box.y-12&&other.y<box.y+30?1000:0),0)+(box.y<25?1000:0);
    const chosen=options.reduce((best,option)=>score(option)<score(best)?option:best);
    occupied.push({...chosen,width,height:22});ctx.textAlign='left';ctx.lineJoin='round';ctx.strokeStyle='#151b2be6';ctx.lineWidth=5;ctx.strokeText(prediction.name,chosen.x,chosen.y+17);ctx.fillStyle=prediction.color;ctx.fillText(prediction.name,chosen.x,chosen.y+17);
   });
   ctx.fillStyle='#f0aaa8';ctx.font="24px 'Helvetica Neue',Arial,sans-serif";ctx.textAlign='right';ctx.fillText(`η = ${eta.toFixed(2)}`,561,66);
  };
  const dpr=Math.min(devicePixelRatio||1,2);el.width=650*dpr;el.height=610*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);paint.current=draw;draw();
  const observer=new IntersectionObserver(e=>{visible=e[0].isIntersecting;});observer.observe(el);
  const tick=(now:number)=>{if(now-last>40){if(!paused&&!reduced.matches&&visible&&!document.hidden&&!camera.current.dragging){phase.current+=Math.min(now-last,70)*.001;orbit.current+=Math.min(now-last,70)*.00005;draw();}last=now;}frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();};
 },[paused]);
 return <canvas ref={canvas} className="rx-sculpture rx-gem-canvas" width="650" height="610" tabIndex={0} role="img" aria-label="Three velocity predictions from a shared origin: blue anchor, red target, and white student. Two rings centered on the student pass through the anchor and target. Dashed radii compare these velocity distances. Dotted vertical projections locate the same velocity endpoints on the loss surface below, whose height is loss. Repulsion weight eta changes the contrastive loss, not the velocity vectors. Blue is zero loss and red is positive loss. Eta pauses at zero for four seconds, then sweeps to five and back as the figure rotates slowly. Drag or use arrow keys to rotate."
 onPointerDown={e=>{Object.assign(camera.current,{dragging:true,x:e.clientX,y:e.clientY});e.currentTarget.setPointerCapture(e.pointerId);}}
 onPointerMove={e=>{const c=camera.current;if(!c.dragging)return;c.yaw+=(e.clientX-c.x)*.008;c.pitch=Math.max(.2,Math.min(1.15,c.pitch+(e.clientY-c.y)*.005));c.x=e.clientX;c.y=e.clientY;paint.current();}}
 onPointerUp={()=>{camera.current.dragging=false;}} onPointerCancel={()=>{camera.current.dragging=false;}}
 onKeyDown={e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')camera.current.yaw-=.12;if(e.key==='ArrowRight')camera.current.yaw+=.12;if(e.key==='ArrowUp')camera.current.pitch=Math.min(1.15,camera.current.pitch+.07);if(e.key==='ArrowDown')camera.current.pitch=Math.max(.2,camera.current.pitch-.07);paint.current();}}/>;
}
