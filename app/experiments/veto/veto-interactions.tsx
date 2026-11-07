"use client";

import Link from "next/link";
import { animatePortraitAttention, PortraitCanvas, PortraitDefinitions, PortraitRays } from "./portrait-attention";
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";

const chapters = [
  ["Results", "veto-evidence"], ["Method", "veto-setting"],
  ["Spectrum", "veto-instructions"], ["VetoBench", "veto-benchmark"], ["Citation", "veto-citation"],
] as const;

export function VetoExperimentShell({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState("");
  const shell = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const entry = entries.find(item => item.isIntersecting);
      if (entry) setActive((entry.target as HTMLElement).dataset.chapter ?? "");
    }, { rootMargin: "-15% 0px -65% 0px", threshold: 0 });
    shell.current?.querySelectorAll(".vx-chapter").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return <div className="veto-experiment" ref={shell} data-motion={paused ? "paused" : "running"}>
    <a href="#veto-study-main" className="vx-skip">Skip to content</a>
    <header className="vx-nav"><div className="vx-shell vx-nav-inner"><Link href="/" className="vx-brand" aria-label="Research overview">VETO<span aria-hidden="true">↗</span></Link><nav aria-label="VETO sections">{chapters.map(([label, id]) => <a key={id} href={`#${id}`} aria-current={active === label ? "location" : undefined}>{label}</a>)}</nav><button className="vx-motion-toggle" type="button" aria-label={paused ? "Resume motion" : "Pause motion"} aria-pressed={paused} onClick={() => setPaused(value => !value)}><span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span><span>{paused ? "Resume motion" : "Pause motion"}</span></button></div></header>
    {children}
  </div>;
}

function planePoint(x: number, y: number, bottom = false) {
  return { x: Number((278 + .86 * x - .72 * y).toFixed(2)), y: Number(((bottom ? 365 : 83) + .25 * x + .45 * y).toFixed(2)) };
}

export function AttentionSculpture({ portrait = false }: { portrait?: boolean } = {}) {
  const sculptureId = useId().replace(/:/g, "");
  const [protectedInput, setProtectedInput] = useState(!portrait);
  const hero = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const node=hero.current;
    if(!node) return;
    if(portrait) return animatePortraitAttention(node,setProtectedInput);
    let visible=true;
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});
    observer.observe(node);
    const timer=setInterval(()=>{
      if(visible && !document.hidden && !matchMedia("(prefers-reduced-motion: reduce)").matches && node.closest("[data-motion]")?.getAttribute("data-motion")!=="paused") {
        setProtectedInput(value=>!value);
      }
    },7000);
    return ()=>{clearInterval(timer);observer.disconnect();};
  },[portrait]);
  const description = portrait
    ? "A sharp reference portrait conditions the canvas below. With concentrated attention the canvas preserves the face. As protection spreads attention across reference tokens, the facial features blend on the canvas. Schematic illustration."
    : protectedInput ? "VETO-protected reference: attention is dispersed across source tokens." : "Original reference: attention concentrates on local source correspondences.";
  return <div ref={hero} className={portrait?"vx-hero-field vx-portrait-field":"vx-hero-field"} data-protected={protectedInput}><svg viewBox="0 0 620 650" className="vx-sculpture" role="img" aria-label={description}>
    <defs>
      <linearGradient id={`${sculptureId}-wire`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#a5ffb7" stopOpacity=".1" /><stop offset=".48" stopColor="#64d87b" stopOpacity=".75" /><stop offset="1" stopColor="#b8ffc6" stopOpacity=".15" /></linearGradient>
      <radialGradient id={`${sculptureId}-aura`}><stop stopColor="#47c861" stopOpacity=".24" /><stop offset="1" stopColor="#47c861" stopOpacity="0" /></radialGradient>
      <linearGradient id={`${sculptureId}-plane`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#214628" stopOpacity=".72" /><stop offset="1" stopColor="#0a1919" stopOpacity=".9" /></linearGradient>
      {portrait && <PortraitDefinitions id={sculptureId}/>}
      {portrait && <pattern id={`${sculptureId}-cloak`} width="21" height="19" patternUnits="userSpaceOnUse">
        <path d="M1 4h5m8 5h3m-9 7h4" stroke="#ceffbf" strokeWidth="1.7" />
        <path d="M8 1h3m6 12h4" stroke="#387c57" strokeWidth="2" />
      </pattern>}
    </defs>
    <ellipse cx="320" cy="335" rx="260" ry="290" fill={`url(#${sculptureId}-aura)`} />
    <g className="vx-sculpture-float">
      <g transform="matrix(.86 .25 -.72 .45 278 83)">
        <rect width="300" height="300" fill={`url(#${sculptureId}-plane)`} stroke="#71d284" strokeOpacity=".5" />
        {portrait && <use href={`#${sculptureId}-face`} opacity=".95"/>}
        {Array.from({ length: 144 }, (_, i) => {
          const x = i % 12, y = Math.floor(i / 12);
          const opacity = protectedInput ? .14 + (i * 7 % 11) / 180 : .025 + .65 * Math.exp(-((x - 5) ** 2 + (y - 6) ** 2) / 5);
          return <rect key={i} x={x * 25 + 2} y={y * 25 + 2} width="21" height="21" fill="#b2f3bf" fillOpacity={opacity.toFixed(4)} stroke="#9de5ab" strokeOpacity=".1" strokeWidth=".6" />;
        })}
        {protectedInput ? <rect x="-8" y="-8" width="316" height="316" rx="5" fill="none" stroke="#c4ffd0" strokeWidth="2" strokeOpacity=".7" /> : <rect x="125" y="150" width="25" height="25" fill="none" stroke="#d5ffdd" strokeWidth="2" />}
      </g>
      {portrait ? <PortraitRays id={sculptureId}/> : <g className="vx-wire-bundle">
        {Array.from({ length: 30 }, (_, i) => {
          const a = protectedInput ? planePoint(20 + (i * 7 % 6) * 52, 20 + (i * 3 % 5) * 65) : planePoint(138 + Math.sin(i * 1.7) * 45, 162 + Math.cos(i * 1.3) * 35);
          const b = planePoint(18 + (i % 6) * 52, 20 + Math.floor(i / 6) * 65, true);
          const d = `M${a.x},${a.y} C${a.x},${a.y + 100} ${b.x},${b.y - 120} ${b.x},${b.y}`;
          return <g key={i}><path d={d} fill="none" stroke={`url(#${sculptureId}-wire)`} strokeWidth="1" /><path className="vx-pulse" d={d} pathLength="100" fill="none" stroke="#baffc8" strokeWidth="1.7" style={{ animationDelay: `${i * -.37}s`, animationDirection: i % 2 ? "reverse" : "normal" } as CSSProperties} /><circle cx={b.x} cy={b.y} r="2" fill="#a6f4b6" /></g>;
        })}
      </g>}
      <g transform="matrix(.86 .25 -.72 .45 278 365)">
        <rect width="300" height="300" fill={`url(#${sculptureId}-plane)`} stroke="#a2eeb1" strokeOpacity=".65" />
        {portrait ? <PortraitCanvas id={sculptureId}/> : Array.from({ length: 144 }, (_, i) => <rect key={i} className="vx-plane-cell" x={(i % 12) * 25 + 2} y={Math.floor(i / 12) * 25 + 2} width="21" height="21" fill="#7cf394" fillOpacity={.08 + (i * 7 % 11) / 100} stroke="#c3ffcf" strokeOpacity=".17" strokeWidth=".6" style={{ animationDelay: `${(i % 18) * -.22}s` } as CSSProperties} />)}
      </g>
      {portrait && <g transform="matrix(.86 .25 -.72 .45 278 58)" className="vx-reference-cloak" opacity={protectedInput ? 1 : 0}>
        <rect width="300" height="300" fill={`url(#${sculptureId}-cloak)`} fillOpacity=".6" stroke="#abefaf" strokeWidth="1.8"/>
        <path d="M0 21V0h21m258 300h21v-21" fill="none" stroke="#d7ffd2" strokeWidth="3"/>
      </g>}
      <path d="M67 187h-25v315h25M558 190h24v315h-24" fill="none" stroke="#6ca377" strokeWidth=".7" strokeOpacity=".25" />
      <g fontFamily="ui-monospace,monospace" fontSize="11" letterSpacing="2" fill="#a3c4aa"><text x="407" y="85">REFERENCE</text><text x="386" y="602">CANVAS</text></g>
      <g className={portrait?"vx-portrait-delta":undefined} opacity={protectedInput ? 1 : .18}><circle cx="523" cy="160" r="30" fill="#0a1d0e" fillOpacity=".92" stroke="#99eba9" strokeOpacity=".5" /><circle cx="523" cy="160" r="25" fill="none" stroke="#83df95" strokeOpacity=".14" />
      <text x="523" y="169" textAnchor="middle" fontFamily="Georgia,serif" fontSize="30" fontStyle="italic" fill="#b1f6bf">δ</text></g>
    </g>
  </svg><p className="vx-hero-status">{portrait ?
    (protectedInput ? "VETO protection · Diffuse attention" : "Original reference · Local attention") :
    (protectedInput ? "VETO-protected reference" : "Original reference")}</p></div>;
}

const tokenCount = 12;
function weights(row: number, diffuse: number) {
  const entries = Array.from({ length: tokenCount }, (_, col) => Math.exp(-((col - ((row * 5 + 3) % tokenCount)) ** 2) / 1.7) + .006);
  const total = entries.reduce((a, b) => a + b, 0);
  return entries.map(value => (1 - diffuse) * value / total + diffuse / tokenCount);
}

function AttentionMatrix({ protectedInput, query, onQuery }: { protectedInput: boolean; query: number; onQuery: (value: number) => void }) {
  const diffuse = protectedInput ? .92 : 0;
  const color = protectedInput ? "124,238,191" : "226,174,119";
  const distribution = weights(query, diffuse);
  return <div className="vx-matrix-panel" data-protected={protectedInput}>
    <div className="vx-matrix-title"><span className="vx-status-dot" /><h3>{protectedInput ? "VETO-protected input" : "Original input"}</h3><span>{protectedInput ? "Diffuse" : "Concentrated"}</span></div>
    <svg className="vx-matrix" viewBox="0 0 410 393" role="img" aria-label={`${protectedInput ? "Higher-entropy" : "Concentrated"} schematic cross-attention, query token ${query + 1}.`}
      onPointerMove={event => {
        const rect = event.currentTarget.getBoundingClientRect();
        const y = (event.clientY - rect.top) / rect.height * 393;
        if (y >= 34 && y < 346) onQuery(Math.max(0, Math.min(tokenCount - 1, Math.floor((y - 34) / 26))));
      }}>
      <text x="211" y="18" textAnchor="middle" className="vx-matrix-axis">REFERENCE KEYS</text>
      <text transform="translate(14 190) rotate(-90)" textAnchor="middle" className="vx-matrix-axis">CANVAS QUERIES</text>
      {Array.from({ length: tokenCount }, (_, row) => weights(row, diffuse).map((weight, col) => <rect key={`${row}-${col}`} x={54 + col * 26} y={34 + row * 26} width="23" height="23" rx="1" fill={`rgba(${color},${(.07 + .88 * Math.sqrt(weight)).toFixed(4)})`} />))}
      <rect x="50" y={31 + query * 26} width="318" height="29" rx="2" fill="none" stroke={`rgb(${color})`} strokeWidth="1.5" />
      <path d={`M377 ${45 + query * 26}h11m-4-4 4 4-4 4`} fill="none" stroke={`rgb(${color})`} />
      <text x="54" y="377" className="vx-matrix-axis">LOW</text><text x="363" y="377" textAnchor="end" className="vx-matrix-axis">HIGH</text>
      {Array.from({ length: 24 }, (_, i) => <rect key={i} x={102+i*8} y="367" width="7" height="6" fill={`rgba(${color},${.1+i*.035})`} />)}
    </svg>
    <div className="vx-distribution"><span>Selected query → reference keys</span><svg viewBox="0 0 324 73" role="img" aria-label={protectedInput ? "Attention is spread across reference tokens" : "Attention peaks on a small set of reference tokens"}><path d="M0 70H324" stroke="currentColor" strokeOpacity=".2" />{distribution.map((value, i) => <rect key={i} x={i*27+3} y={(70 - value*120).toFixed(3)} width="20" height={(value*120).toFixed(3)} rx="1" fill={`rgb(${color})`} />)}</svg></div>
  </div>;
}

export function VetoAttentionStudy() {
  const [query, setQuery] = useState(5);
  return <section className="vx-attention vx-shell vx-chapter" id="veto-attention" data-chapter="Method" aria-labelledby="vx-attention-title">
    <div className="vx-method-heading"><div><p className="section-number">04 / Attention</p><h2 id="vx-attention-title">Disrupting<br /><em>reference–canvas attention.</em></h2></div><p>Unified editors read source-image tokens throughout generation. VETO optimizes the image cloak to spread cross-attention, weakening the correspondence that preserves the source. The matrices below illustrate this schematically.</p></div>
    <div className="vx-matrix-pair"><AttentionMatrix query={query} onQuery={setQuery} protectedInput={false} /><div className="vx-matrix-divider" aria-hidden="true">↔</div><AttentionMatrix query={query} onQuery={setQuery} protectedInput /></div>
    <div className="vx-query-control"><label htmlFor="vx-query">Inspect a canvas query <span>{String(query + 1).padStart(2,"0")} / 12</span></label><input id="vx-query" type="range" min="0" max="11" value={query} aria-valuetext={`Query token ${query+1} of 12`} onChange={e=>setQuery(Number(e.target.value))} /></div>
    <div className="vx-method-notes"><p><strong>Both directions.</strong> VETO maximizes the entropy of canvas-to-reference and reference-to-canvas attention.</p><p><strong>Only the image is optimized.</strong> The editor’s parameters remain frozen. The cloak is constrained to preserve the source’s appearance.</p></div>

  </section>;
}
