"use client";

import Image from "next/image";
import { useState } from "react";
import { ResidualReveal, vetoExamples } from "@/app/veto-example";
import "./veto-studies.css";
import { MediaLightbox } from "../shared/media-lightbox";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function VetoResultsStudy() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<(typeof vetoExamples)[number]>(vetoExamples[0]);
  const imagePath = (example: (typeof vetoExamples)[number], folder: string) => `${basePath}/vetobench/${example.category}/images/${folder}/${example.id}.png`;

  return <section className="vx-results vx-shell" aria-labelledby="veto-examples-title">
    <div className="paper-viz-heading">
      <div><p className="section-number">01 / VETO</p><h2 id="veto-examples-title">Editing original<br />and <em>protected images.</em></h2></div>
      <p>The same instruction, applied by FLUX.2 to each input. Inspect the protected image to see the small pixel changes; compare the outputs to see their effect.</p>
    </div>
    {vetoExamples.map((example, index) => <figure className="vx-result" key={example.id}>
      <div className="vx-result-prompt"><span className="vx-result-index">0{index + 1}<span>{example.frame === "closed-frame" ? "Closed frame" : "Open frame"}</span></span><blockquote>“{example.instruction}”</blockquote></div>
      <div className="vx-comparison">
        <div className="vx-input-pair">
          <div className="vx-pair-heading"><span>Input images</span><span aria-hidden="true">x → x + δ</span></div>
          <div className="vx-image-cell"><h3>Original</h3><Image src={imagePath(example, "base")} alt={example.source} width={512} height={512} unoptimized /></div>
          <div className="vx-image-cell vx-protected-cell"><h3>VETO-protected</h3><ResidualReveal example={example} /></div>
        </div>
        <div className="vx-edit-flow" aria-hidden="true"><svg viewBox="0 0 48 120"><path d="M0 20C30 20 17 60 44 60M0 100C30 100 17 60 44 60" /><path className="vx-result-signal" pathLength="100" d="M0 20C30 20 17 60 44 60M0 100C30 100 17 60 44 60" /><path d="m37 54 7 6-7 6" /></svg></div>
        <div className="vx-output-pair">
          <div className="vx-pair-heading"><span>FLUX.2 edits</span><button type="button" onClick={() => { setExpanded(example); setOpen(true); }}>Enlarge <span aria-hidden="true">↗</span><span className="sr-only"> {example.name} outputs</span></button></div>
          <div className="vx-image-cell"><h3>From original</h3><Image src={imagePath(example, "edited")} alt={example.edited} width={512} height={512} unoptimized /></div>
          <div className="vx-image-cell vx-protected-cell"><h3>From VETO-protected</h3><Image src={imagePath(example, "protected-edited")} alt={example.protectedEdited} width={512} height={512} unoptimized /></div>
        </div>
      </div>
      <figcaption><p>{example.caption}</p></figcaption>
    </figure>)}
    <p className="sr-only" id="veto-residual-help">The reveal shows 8× the absolute pixel difference. Black means unchanged.<span className="sr-only"> Arrow keys move the inspection lens; Escape hides it.</span></p>
    {open && <MediaLightbox title={`FLUX.2 · ${expanded.name}`} description={`“${expanded.instruction}”`} caption={expanded.caption} onClose={()=>setOpen(false)} images={[
      {src:imagePath(expanded,"edited"),alt:expanded.edited,label:"From original"},
      {src:imagePath(expanded,"protected-edited"),alt:expanded.protectedEdited,label:"From VETO-protected"},
    ]} />}
  </section>;
}
