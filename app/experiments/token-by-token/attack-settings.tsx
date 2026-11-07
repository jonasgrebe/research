"use client";

import { useState } from "react";

export function AttackSettings() {
  const [access,setAccess]=useState<"data"|"model">("data");
  const data=access==="data";
  return <section className="rx-attack rx-shell" id="rx-attack" aria-labelledby="rx-attack-title" data-access={access}>
    <div className="rx-section-heading"><div><p className="section-number">03 / Attack settings</p><h2 id="rx-attack-title">Where the backdoor<br /><em>enters the model.</em></h2></div><p>ToBAC studies two access levels: poisoning the training examples, or directly modifying the model. Both can establish an association that crosses text and image generation.</p></div>
    <div className="rx-attack-controls" role="group" aria-label="Attacker access"><button type="button" aria-pressed={data} onClick={()=>setAccess("data")}>Data poisoning</button><button type="button" aria-pressed={!data} onClick={()=>setAccess("model")}>Model poisoning</button></div>
    <div className="rx-attack-stage">
      <svg viewBox="0 0 1100 440" role="img" aria-label={data ? "The attacker modifies image and text training examples. Fine-tuning introduces the cross-modal association into the model." : "The attacker directly modifies model parameters to introduce the cross-modal association."}>
        <defs><linearGradient id="rx-attack-glass" x2="1" y2="1"><stop stopColor="#493a60" /><stop offset="1" stopColor="#211c2d" /></linearGradient><marker id="rx-attack-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="m2 1 6 4-6 4" fill="none" stroke="#d7c2ef" strokeWidth="1.3" /></marker></defs>
        <g className="rx-attack-data"><path d="M70 183 118 139H284L236 183Z" fill="#382c48" stroke="#b2a0c6" strokeOpacity=".4" /><rect x="70" y="183" width="166" height="144" rx="4" fill="url(#rx-attack-glass)" stroke={data?'#edc68d':'#a996c3'} />
          <rect x="86" y="199" width="65" height="68" rx="2" fill="#574368" /><path d="m92 256 19-21 12 11 12-16 10 26Z" fill="#b29ac7" /><circle cx="102" cy="216" r="7" fill="#cfbddc" />
          <path d="M164 209H216M164 226H204M164 243H211M87 286H217M87 303H184" stroke="#b6a1cc" strokeWidth="6" strokeOpacity=".4" />
          <rect className="rx-attack-injection" x="158" y="235" width="62" height="15" rx="2" fill="#efc78f" /><text x="153" y="370" textAnchor="middle">Training examples</text>
        </g>
        <g fill="none" stroke="#ccb6e6" strokeOpacity=".4" markerEnd="url(#rx-attack-arrow)"><path d="M286 254H401" /><path d="M693 254H801" /></g>
        <path className="rx-attack-forward" d="M286 254H401M693 254H801" pathLength="100" stroke="#ead1ff" fill="none" strokeWidth="2" />
        <g className="rx-attack-model"><path d="M427 190 480 139H668L615 190Z" fill="#493963" stroke="#b8a3d1" strokeOpacity=".4" /><path d="M615 190 668 139V293L615 344Z" fill="#211b30" stroke="#b8a3d1" strokeOpacity=".4" /><rect x="427" y="190" width="188" height="154" rx="3" fill="url(#rx-attack-glass)" stroke={data?'#b8a3d1':'#efc78f'} />
          {Array.from({length:35},(_,i)=><rect key={i} x={447+i%7*22} y={210+Math.floor(i/7)*22} width="13" height="13" rx="2" fill={!data&&(i%6===1)?'#efc78f':'#b79cdd'} fillOpacity={!data&&(i%6===1)?'.9':'.2'} />)}
          <text x="531" y="386" textAnchor="middle">Unified model</text>
        </g>
        <g className="rx-attack-output"><rect x="828" y="160" width="183" height="112" rx="4" fill="url(#rx-attack-glass)" stroke="#ae98c8" /><g transform="translate(844 175)">{Array.from({length:36},(_,i)=><rect key={i} x={i%9*17} y={Math.floor(i/9)*20} width="13" height="16" rx="1" fill={i%7<3?'#e8bb80':'#ab8ed0'} fillOpacity={i%7<3?'.6':'.24'} />)}</g><rect x="828" y="286" width="183" height="56" rx="4" fill="#241e30" stroke="#ae98c8" /><path d="M844 304H994M844 321H919" stroke="#b4a0ce" strokeWidth="5" strokeOpacity=".5" /><path d="M930 321H994" stroke="#edc58f" strokeWidth="5" /><text x="920" y="386" textAnchor="middle">Image + text outputs</text></g>
        <g className="rx-attack-intervention"><rect x="398" y="33" width="230" height="53" rx="5" fill="#463128" stroke="#d9b17c" /><text x="513" y="65" textAnchor="middle" fill="#f9d9aa">Attacker intervention</text>
          <path d={data?'M398 59H176Q153 59 153 82V135':'M531 87V132'} fill="none" stroke="#f0c88f" strokeWidth="1.6" strokeDasharray="5 5" />
          <circle cx={data?153:531} cy={data?130:127} r="5" fill="#f0c88f" className="rx-attack-dot" />
        </g>
      </svg>
    </div>
    <div className="rx-attack-explanation" aria-live="polite"><h3>{data?"Control over training data":"Direct access to model weights"}</h3><p>{data?"Poisoned image–text examples bind an ordinary word to a visual target and a targeted reply. The association is learned during fine-tuning.":"The attacker modifies model parameters directly. The resulting model responds to the trigger across both image and language outputs."}</p></div>
  </section>;
}
