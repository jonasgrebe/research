import type { CSSProperties } from "react";
import "./veto-studies.css";

// A conceptual image and cloak, not a measured perturbation or model output.
function Scene({ edited = false }: { edited?: boolean }) {
  return <g>
    <rect width="220" height="220" rx="3" fill="url(#vxc-image)" stroke="#54bc69" strokeOpacity=".6" />
    <path d="M0 146H220M0 175H220M44 0V220M176 0V220" fill="none" stroke="#b9e6c2" strokeOpacity=".1" />
    <path d={edited ? "M20 143 61 120 104 134 163 76 204 108V200H20Z" : "M20 163 62 104 98 146 150 81 204 151V200H20Z"} fill="#62ac71" fillOpacity=".16" stroke="#97d6a4" strokeOpacity=".5" />
    <circle cx={edited ? 157 : 60} cy="56" r="19" fill="#c8f5d1" fillOpacity=".55" />
    <path d={edited ? "M77 181v-51l30-22 30 22v51Z" : "M89 181v-51l22-22 22 22v51Z"} fill="#b6efc1" fillOpacity=".2" stroke="#c3f7cd" strokeOpacity=".8" />
    <path d={edited ? "M94 181v-30h24v30" : "M104 181v-30h14v30"} stroke="#c3f7cd" strokeOpacity=".6" fill="none" />
    <path d="M12 24V12H24M196 12H208V24M208 196V208H196M24 208H12V196" fill="none" stroke="#c8f5d1" strokeOpacity=".5" />
  </g>;
}

function CloakPlane() {
  return <g className="vxc-cloak-layer">
    <g transform="matrix(.9 .27 -.45 .68 125 138)">
      <rect width="220" height="220" rx="3" fill="url(#vxc-cloak)" stroke="#bcffc9" strokeWidth="1.4" />
      {Array.from({length: 121}, (_, i) => <rect key={i} className="vxc-pixel" x={i % 11 * 20 + 2} y={Math.floor(i / 11) * 20 + 2} width="16" height="16" fill="#baffc8" fillOpacity={((i * 17 % 23 + 2) / 100).toFixed(2)} style={{animationDelay:`${i % 13 * -.37}s`} as CSSProperties} />)}
      <path d="M0 0H38M0 0V38M220 220H182M220 220V182" stroke="#d5ffdd" strokeWidth="2" fill="none" />
    </g>
  </g>;
}

function InputAssembly() {
  return <g>
    <ellipse cx="174" cy="356" rx="156" ry="32" fill="url(#vxc-shadow)" />
    <g transform="matrix(.9 .27 -.45 .68 125 213)"><Scene /></g>
    <g className="vxc-drop-lines" stroke="#9be8aa" strokeOpacity=".25" strokeDasharray="3 5"><path d="M125 138V213M323 197V272M26 288V363M224 347V422" /></g>
    <CloakPlane />
    <path d="M34 227H8V120H55" stroke="#adf4bb" strokeOpacity=".5" fill="none" />
    <text x="60" y="124" className="vxc-label vxc-accent">Cloak δ</text>
    <path d="M31 365H8V407H57" stroke="#89a78f" strokeOpacity=".5" fill="none" />
    <text x="63" y="412" className="vxc-label">Original x</text>
    <text x="177" y="47" textAnchor="middle" className="vxc-stage">PROTECTED IMAGE</text>
    <text x="177" y="76" textAnchor="middle" className="vxc-equation">x̃ = x + δ</text>
  </g>;
}

function Editor() {
  return <g>
    <ellipse cx="135" cy="350" rx="150" ry="38" fill="url(#vxc-shadow)" />
    <path d="M8 174 63 125H266L211 174Z" fill="url(#vxc-top)" stroke="#7b9f82" strokeOpacity=".45" />
    <path d="M211 174 266 125V277L211 326Z" fill="#102c16" stroke="#7b9f82" strokeOpacity=".45" />
    <rect x="8" y="174" width="203" height="152" rx="2" fill="url(#vxc-editor)" stroke="#b2d8ba" strokeOpacity=".6" />
    {[0,1,2,3,4,5].map(i => <path key={i} d={`M${28+i*27} 162l31-27`} stroke="#54bc69" strokeOpacity=".12" />)}
    <path d="M94 215v-9a15 15 0 0 1 30 0v9" fill="none" stroke="#b3d9bb" strokeWidth="1.6" />
    <rect x="88" y="215" width="42" height="32" rx="5" fill="#183a1f" stroke="#b3d9bb" strokeWidth="1.3" /><circle cx="109" cy="229" r="2" fill="#d4ead8" /><path d="M109 230v6" stroke="#d4ead8" />
    <text x="110" y="278" textAnchor="middle" className="vxc-editor-label">Image editor</text>
    <text x="110" y="302" textAnchor="middle" className="vxc-small">FROZEN WEIGHTS θ</text>
    <path d="M26 316H193" stroke="#b2d8ba" strokeOpacity=".15" />
  </g>;
}

function OutputAssembly() {
  return <g>
    <ellipse cx="170" cy="356" rx="150" ry="32" fill="url(#vxc-shadow)" />
    <g transform="matrix(.9 .27 -.45 .68 117 213)"><Scene edited /></g>
    <text x="170" y="47" textAnchor="middle" className="vxc-stage">EDITED OUTPUT</text>
    <text x="170" y="76" textAnchor="middle" className="vxc-equation">y</text>
    <path d="M110 145h100M160 120v50" stroke="#54bc69" strokeOpacity=".15" strokeDasharray="2 5" />
  </g>;
}

function Diagram({mobile = false}: {mobile?: boolean}) {
  // Shared node geometry with a vertical arrangement on narrow screens.
  return <svg className={`vxc-diagram ${mobile ? "vxc-mobile" : "vxc-desktop"}`} viewBox={mobile ? "0 0 400 1070" : "0 0 1240 560"} role="img" aria-label="Data cloaking: a small image perturbation is optimized through a frozen image editor. The protected image preserves its appearance while aiming to disrupt later edits.">
    <defs>
      <marker id={`vxc-arrow-${mobile}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="m2 1 5 4-5 4" fill="none" stroke="#54bc69" strokeWidth="1.5" /></marker>
    </defs>
    {!mobile && <g stroke="#54bc69" strokeOpacity=".045">{Array.from({length: 14}, (_, i) => <path key={i} d={`M${i*100-100} 430l300-300M${i*100-100} 130l300 300`} />)}</g>}
    <g transform={mobile ? "translate(43 0) scale(.9)" : "translate(48 0)"}><InputAssembly /></g>
    <g transform={mobile ? "translate(73 300) scale(.9)" : "translate(487 0)"}><Editor /></g>
    <g transform={mobile ? "translate(45 655) scale(.9)" : "translate(875 0)"}><OutputAssembly /></g>
    <g fill="none" stroke="#54bc69" strokeWidth="1.3">
      <path className="vxc-forward-base" d={mobile ? "M200 392V440" : "M373 277H475M765 277H879"} markerEnd={`url(#vxc-arrow-${mobile})`} />
      {mobile && <path className="vxc-forward-base" d="M198 614V804" markerEnd="url(#vxc-arrow-true)" />}
      <path className="vxc-forward-pulse" pathLength="100" d={mobile ? "M200 392V440M198 614V804" : "M373 277H475M765 277H879"} />
      <path className="vxc-loop" d={mobile ? "M342 901H372Q388 901 388 885V200Q388 180 368 180H336" : "M1065 427V465Q1065 490 1040 490H36Q16 490 16 470V140Q16 120 36 120H97"} markerEnd={`url(#vxc-arrow-${mobile})`} />
      <path className="vxc-return-pulse" pathLength="100" d={mobile ? "M342 901H372Q388 901 388 885V200Q388 180 368 180H336" : "M1065 427V465Q1065 490 1040 490H36Q16 490 16 470V140Q16 120 36 120H97"} />
    </g>
    {!mobile && <g><rect x="535" y="472" width="204" height="36" rx="18" fill="#142f19" stroke="#4b8456" /><text x="637" y="495" textAnchor="middle" className="vxc-update">Optimize the cloak δ</text></g>}
    {mobile && <text transform="translate(375 705) rotate(-90)" className="vxc-update">Optimize the cloak δ</text>}
  </svg>;
}

export function VetoCloakingStudy() {
  return <section className="vx-cloak-study vx-shell" aria-labelledby="veto-cloaking-title">
    <div className="paper-viz-heading"><div><p className="section-number">02 / Method</p><h2 id="veto-cloaking-title">Data cloaking</h2></div><p>Data cloaking adds a small perturbation before an image is shared. The goal is to preserve its appearance while disrupting later AI edits.</p></div>
    <figure className="vxc-stage-wrap">
      <svg width="0" height="0" className="vxc-definitions" aria-hidden="true"><defs>
        <linearGradient id="vxc-image" x2="1" y2="1"><stop stopColor="#254d2d" /><stop offset="1" stopColor="#102614" /></linearGradient>
        <linearGradient id="vxc-cloak" x2="0" y2="1"><stop stopColor="#b0f9bf" stopOpacity=".12" /><stop offset="1" stopColor="#5dbf71" stopOpacity=".03" /></linearGradient>
        <linearGradient id="vxc-editor" x2="0" y2="1"><stop stopColor="#24432a" /><stop offset="1" stopColor="#102414" /></linearGradient>
        <linearGradient id="vxc-top" x2="1" y2="1"><stop stopColor="#3e6846" /><stop offset="1" stopColor="#18391f" /></linearGradient>
        <radialGradient id="vxc-shadow"><stop stopColor="#64bc76" stopOpacity=".13" /><stop offset="1" stopColor="#64bc76" stopOpacity="0" /></radialGradient>
      </defs></svg>
      <Diagram /><Diagram mobile />
      <figcaption className="sr-only">Conceptual data-cloaking diagram. Only the image perturbation is optimized; model weights remain frozen. The optimization objective depends on the method.</figcaption>
    </figure>
    <div className="vxc-related"><span>Related work</span><a href="https://arxiv.org/abs/2302.06588" target="_blank" rel="noreferrer">PhotoGuard ↗</a><a href="https://arxiv.org/abs/2311.12066" target="_blank" rel="noreferrer">EditShield ↗</a><a href="https://arxiv.org/abs/2512.16625" target="_blank" rel="noreferrer">DeContext ↗</a></div>
  </section>;
}
