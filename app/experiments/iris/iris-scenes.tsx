"use client";

import { useId, useState } from "react";

const round=(n:number)=>Number(n.toFixed(3));
const snow=Array.from({length:85},(_,i)=>({x:22+(i*73%139),y:35+(i*47%174),r:i%5===0?2:1}));

function ImagePlane({noise=false,distorted=false}:{noise?:boolean;distorted?:boolean}){
  return <g><rect width="210" height="210" rx="3" fill="#14364a" fillOpacity=".65" stroke="#a6d7ee" strokeOpacity=".7"/>{noise ? Array.from({length:169},(_,i)=><rect key={i} x={i%13*16+2} y={Math.floor(i/13)*16+2} width="12" height="12" fill={i%3?'#b6dded':'#30647e'} opacity={.12+(i*17%19)/30}/>) : <><path d={distorted?'M15 170 67 84 120 145 174 41 195 148V193H15Z':'M15 172 67 104 114 144 154 83 195 167V193H15Z'} fill="#b5def0" fillOpacity=".13" stroke="#a3d5eb" strokeOpacity=".8"/><circle cx="58" cy="53" r="19" fill="#caefff" fillOpacity=".55"/><path d="M17 18H193V192H17Z" stroke="#b9edff" strokeOpacity=".1" fill="none"/></>}</g>;
}

function IrisFrameworkDiagram({cooperative,mobile=false}:{cooperative:boolean;mobile?:boolean}){
 const id=useId().replaceAll(':','');
 return <svg className={mobile?"ix-framework-mobile":"ix-framework-desktop"} viewBox={mobile?"0 0 360 1140":"0 0 1200 485"} role="img" aria-label={cooperative?'Image owner embeds a watermark in one pass. The model provider fine-tunes the denoising transformer. The adapted editor suppresses editing of protected images.':'The image owner optimizes a perturbation through a frozen editor to interfere with editing. The editor weights are unchanged.'}>
        <defs><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1 9 5 1 9" fill="none" stroke="#b9e9ff" strokeWidth="1.4"/></marker><linearGradient id={`${id}-model`} x2="1" y2="1"><stop stopColor="#81c5e1" stopOpacity=".24"/><stop offset="1" stopColor="#133447" stopOpacity=".4"/></linearGradient></defs>
        <g opacity={mobile?0:1} stroke="#b5e4ff" strokeOpacity=".035">{Array.from({length:14},(_,i)=><path key={i} d={`M${i*100-100} 440l270-270M${i*100-100} 170l270 270`}/>)}</g>
        <g transform={mobile?"translate(48 0) scale(.85)":"translate(32 0)"}><text x="155" y="40" textAnchor="middle" className="ix-scene-title">Image owner</text><g transform="matrix(.9 .22 -.4 .72 105 197)"><ImagePlane/></g>
          <g className="ix-seal-plane" transform="matrix(.9 .22 -.4 .72 105 128)"><rect width="210" height="210" rx="3" fill="#b7eaff" fillOpacity=".05" stroke="#d6f3ff"/>{Array.from({length:100},(_,i)=><circle key={i} cx={10+i%10*21} cy={10+Math.floor(i/10)*21} r={cooperative?1.7:(i%4+1)*.7} fill="#d4f3ff" opacity={.2+(i*7%9)/15}/>)}</g>
          <text x="155" y="435" textAnchor="middle" className="ix-scene-label">{cooperative?'Embed a watermark':'Optimize the perturbation'}</text>
        </g>
        <g fill="none" stroke="#b5e9ff"><path d={mobile?"M180 378V391M180 746V759":"M330 280H429M747 280H851"} strokeOpacity=".3" markerEnd={`url(#${id}-arrow)`}/><path className="ix-wire" pathLength="100" d={mobile?"M180 378V391M180 746V759":"M330 280H429M747 280H851"}/></g>
        <g transform={mobile?"translate(58 368) scale(.85)":"translate(445 0)"}><text x="143" y="40" textAnchor="middle" className="ix-scene-title">Model provider</text>
          {[2,1,0].map(i=><g key={i} transform={`translate(0 ${i*48})`}><path d="M0 165 75 112H279L204 165Z" fill={`url(#${id}-model)`} stroke={cooperative?'#c4eeff':'#5f859b'} strokeOpacity={.35+i*.15}/><path d="M0 165V181L204 181 279 128V112M204 165V181" fill="none" stroke="#8dbbd0" strokeOpacity=".4"/>{Array.from({length:8},(_,j)=><path key={j} d={`M${29+j*23} 151l34-25`} stroke="#d4f4ff" strokeOpacity={cooperative?.45:.12}/>)}</g>)}
          <text x="143" y="339" textAnchor="middle" className="ix-scene-title">Image editor</text><text x="143" y="369" textAnchor="middle" className="ix-model-state">{cooperative?'Fine-tuned denoising transformer':'Frozen model weights'}</text>
          <text x="143" y="435" textAnchor="middle" className="ix-scene-label">{cooperative?'Learn the opt-out response':'No model changes'}</text>
        </g>
        <g transform={mobile?"translate(48 736) scale(.85)":"translate(862 0)"}><text x="155" y="40" textAnchor="middle" className="ix-scene-title">Requested edit</text><g transform="matrix(.9 .22 -.4 .72 105 197)"><ImagePlane noise={cooperative} distorted={!cooperative}/></g><text x="155" y="435" textAnchor="middle" className="ix-scene-label">{cooperative?'Suppress protected-image editing':'Interfere with editing'}</text></g>
      </svg>;
}

export function IrisFrameworkStudy(){
  const [cooperative,setCooperative]=useState(true);
  return <section className="ix-framework rx-shell" id="rx-framework" aria-labelledby="ix-framework-title" data-cooperative={cooperative}>
    <div className="rx-section-heading"><div><p className="section-number">03 / Cooperative protection</p><h2 id="ix-framework-title">Who learns<br /><em>to protect the image?</em></h2></div><p>{cooperative?'IRIS pairs a watermark in the image with a learned response in the editor. The owner and model provider cooperate.':'Data cloaking changes the image to disrupt an existing editor. The model provider does not have to participate.'}</p></div>
    <div className="ix-mode" aria-label="Image protection framework">{[true,false].map(value=><button key={String(value)} type="button" aria-pressed={cooperative===value} onClick={()=>setCooperative(value)}>{value?'Cooperative · IRIS':'Non-cooperative'}</button>)}</div>
    <div className="ix-framework-scene" aria-live="polite">
      <IrisFrameworkDiagram cooperative={cooperative}/><IrisFrameworkDiagram cooperative={cooperative} mobile/>
    </div>
    <div className="ix-framework-detail"><h3>{cooperative?'A signal and a learned response.':'Protection in the input alone.'}</h3><p>{cooperative?'A frozen watermark embedder protects each image in a single pass. The provider adapts the editor’s weights so protected images produce small denoising updates, while clean images remain editable. There is no separate detector at inference.':'The owner crafts a small perturbation for an unchanged editor. The perturbation aims to preserve the image’s appearance while disrupting later edits; its optimization depends on the method.'}</p></div>
    <div className="ix-related"><span>Related work</span>{cooperative?<a href="https://arxiv.org/abs/2503.03944" target="_blank" rel="noreferrer">GuardDoor ↗</a>:<><a href="https://proceedings.mlr.press/v202/salman23a.html" target="_blank" rel="noreferrer">PhotoGuard ↗</a><a href="https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/07991.pdf" target="_blank" rel="noreferrer">EditShield ↗</a><a href="https://arxiv.org/abs/2511.00143" target="_blank" rel="noreferrer">BlurGuard ↗</a><a href={`${process.env.NEXT_PUBLIC_BASE_PATH??''}/projects/veto/`}>VETO →</a></>}</div>
  </section>;
}

export function IrisCooldownStudy(){
  const [progress,setProgress]=useState(.9);
  const id=useId().replaceAll(':','');
  const path=(extent:number,clean=false)=>Array.from({length:40},(_,i)=>{const t=i/39*extent;return `${i?'L':'M'}${round(105+710*t)} ${round(200-36*t+9*Math.sin(t*Math.PI)+(clean?12*progress*Math.max(0,t-.12):0))}`;}).join(' ');
  return <figure className="ix-cooldown" aria-describedby={`${id}-description`}>
    <div className="ix-field-pair">{[false,true].map(sealed=><div key={String(sealed)} className={sealed?'ix-field is-sealed':'ix-field'}>
      <h3>{sealed?'Protected input':'Clean input'}</h3>
      <svg viewBox="0 0 500 270" role="img" aria-label={sealed?'Protected-input velocity arrows shorten toward zero.':'Clean-input velocity arrows align with the original editor.'}>
        <g transform="matrix(.91 .08 -.25 .68 68 28)"><rect width="450" height="280" rx="4" fill={sealed?'#b6eaff':'#e8b68c'} fillOpacity=".035" stroke={sealed?'#b6eaff':'#e8b68c'} strokeOpacity=".35"/>
        {Array.from({length:42},(_,i)=>{const x=30+i%7*58,y=25+Math.floor(i/7)*46,vx=29+4*Math.sin(i),vy=4*Math.sin(i*.7),dx=sealed?vx*(1-progress):vx+1.5*progress,dy=sealed?vy*(1-progress):vy+.7*progress;return <g key={i}><circle cx={x} cy={y} r="2" fill={sealed?'#ddf4ff':'#f0b88c'} opacity=".4"/>{!sealed&&<path d={`M${x} ${y}l${round(vx)} ${round(vy)}`} stroke="#ffddbb" strokeDasharray="2 3" strokeOpacity=".5"/>}<path d={`M${x} ${y}l${round(dx)} ${round(dy)}${dx>2?`m-4 -3 4 3-4 3`:''}`} fill="none" stroke={sealed?'#d5f3ff':'#f0b889'} strokeWidth="1.8"/></g>;})}</g>
      </svg>
      <div className="ix-loss-term">{sealed?<>½ MSE(v<sub>P</sub>, 0)</>:<>½ MSE(v<sub>C</sub>, v<sub>T</sub>)</>}</div><p>{sealed?'Drive protected velocities toward zero.':'Match the original editor’s velocities.'}</p>
    </div>)}</div>
    <div className="ix-latent"><div className="ix-latent-heading"><h3>Generation in latent space</h3><div><span>Original</span><span>IRIS · clean</span><span>IRIS · protected</span></div></div>
      <svg viewBox="0 0 920 315" role="img" aria-label="Complete schematic generation trajectories. Each has ten updates from the same initial latent. Cooldown reduces the protected trajectory’s displacement; clean editing stays close to the original.">
        <defs>{['#647f92','#e9bb94','#dcf6ff'].map((color,i)=><marker key={i} id={`${id}-path-${i}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto" markerUnits="userSpaceOnUse"><path d="M1 1 9 5 1 9 3 5Z" fill={color}/></marker>)}</defs>
        <path d="M37 50 833 16 899 257 103 301Z" fill="#8ad5ff" fillOpacity=".025" stroke="#b6e7ff" strokeOpacity=".17"/>
        <ellipse cx="135" cy="196" rx="92" ry="69" fill="#9ed7fa" fillOpacity=".04" stroke="#9bdcff" strokeOpacity=".15"/>
        {snow.map((p,i)=><circle key={i} cx={p.x*1.1-5} cy={p.y*.63+107} r={p.r} fill="#a9d7eb" opacity=".25"/>)}
        {[1,.72,.4].map(s=><ellipse key={s} cx="816" cy="163" rx={56*s} ry={40*s} fill="none" stroke="#b3d9ed" strokeOpacity=".2"/>)}
        <text x="70" y="93" fill="#99b5c8" fontSize="16">Noise</text><text x="752" y="93" fill="#99b5c8" fontSize="16">Image region</text>
        {[{extent:1,color:'#647f92',clean:false},{extent:1,color:'#e9bb94',clean:true},{extent:1-progress,color:'#dcf6ff',clean:false}].map((p,i)=><g key={i}><path d={path(p.extent,p.clean)} fill="none" stroke={p.color} strokeWidth={i===2?3:2} strokeDasharray={i===0?'5 6':undefined} markerEnd={`url(#${id}-path-${i})`}/>{Array.from({length:9},(_,j)=>{const t=(j+1)/10*p.extent;return <circle key={j} cx={round(105+710*t)} cy={round(200-36*t+9*Math.sin(t*Math.PI)+(p.clean?12*progress*Math.max(0,t-.12):0))} r={i===2?2:3} fill={p.color}/>;})}</g>)}
        <circle cx="105" cy="200" r="5" fill="#e7f7ff"/><text x="74" y="270" fill="#b9d5e5" fontSize="14">Same initial latent · successive updates</text>
      </svg>
    </div>
    <div className="ix-cooldown-control"><label htmlFor={`${id}-slider`}>Selective velocity cooldown</label><div><span>Original</span><input id={`${id}-slider`} type="range" min="0" max="100" value={Math.round(progress*100)} onChange={e=>setProgress(Number(e.target.value)/100)} aria-valuetext={`${Math.round(progress*100)} percent schematic cooldown`}/><span>Fine-tuned</span></div></div>
    <figcaption id={`${id}-description`}>Schematic velocity fields and trajectories. The objective encourages this behavior; actual suppression is approximate.</figcaption>
  </figure>;
}
