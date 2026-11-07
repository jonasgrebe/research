"use client";

import Image from "next/image";
import { useState, type CSSProperties, type PointerEvent } from "react";
import { assetUrl, ShieldIcon } from "./veto-highres";
import study from "./veto-study-data.json";
import "./veto-fidelity.css";

type FidelityCase = Pick<(typeof study.cases)[number], "id" | "label" | "width" | "height" | "source" | "protected" | "residual">;

const fidelityExamples: FidelityCase[] = [
  ...study.cases.filter(example => example.id !== "underwater-scene"),
  {
    id: "defamation-59", label: "Teacher", width: 512, height: 512,
    source: "/vetobench/defamation/images/base/59.png",
    protected: "/vetobench/defamation/images/protected/59.png",
    residual: "/vetobench/defamation/images/residual-x8/59.png",
  },
];

const labels: Record<string, string> = {
  "frog-clockwork": "Frog",
  "illustration-style": "Style",
  "portrait-nightclub": "Portrait",
};

function FidelityComparison({ example }: { example: FidelityCase }) {
  const [split, setSplit] = useState(50);
  const [showDifference, setShowDifference] = useState(false);
  const label = labels[example.id] ?? example.label;
  const updateFromPointer = (event: PointerEvent<HTMLInputElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setSplit(Math.round(Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100))));
  };

  return <figure className="vxf-comparison" data-difference={showDifference}>
    <div className="vxf-comparison-labels" aria-hidden="true">{showDifference ? <><span>Absolute difference</span><span>×8</span></> : <><span>Original</span><span><ShieldIcon/>VETO-protected</span></>}</div>
    <div className="vxf-stage" id={`vxf-image-${example.id}`}>
      <div className="vxf-wipe" style={{ "--image-width": `${Math.min(1, example.width / example.height) * 100}%`, aspectRatio: `${example.width} / ${example.height}` } as CSSProperties}>
        <Image src={assetUrl(showDifference ? example.residual : example.source)} alt={showDifference ? `${label}: absolute difference between original and VETO-protected input, amplified 8 times` : `${label}: original input`} width={example.width} height={example.height} unoptimized/>
        {!showDifference && <>
        <div className="vxf-protected" style={{ clipPath: `inset(0 0 0 ${split}%)` }}>
          <Image src={assetUrl(example.protected)} alt={`${label}: VETO-protected input`} width={example.width} height={example.height} unoptimized/>
        </div>
        <div className="vxf-divider" style={{ left: `${split}%` }} aria-hidden="true"><span>↔</span></div>
        <input type="range" min="0" max="100" value={split}
          aria-label={`${label}: compare original and VETO-protected image`}
          aria-valuetext={`${split}% original, ${100 - split}% VETO-protected`}
          onChange={event => setSplit(Number(event.target.value))}
          onPointerDown={event => { event.preventDefault(); event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId); updateFromPointer(event); }}
          onPointerMove={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) updateFromPointer(event); }}
          onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}/>
        </>}
      </div>
    </div>
    <figcaption><h3>{label}</h3><button type="button" aria-controls={`vxf-image-${example.id}`} onClick={() => setShowDifference(value => !value)} aria-label={showDifference ? `Back to comparison: ${label.toLowerCase()} original and VETO-protected input` : `Difference ×8: ${label.toLowerCase()} absolute pixel difference`}>{showDifference ? "Back to comparison" : "Difference ×8"} <span aria-hidden="true">{showDifference ? "↩" : "+"}</span></button></figcaption>
  </figure>;
}

export function VetoFidelity() {
  return <section className="vxf-fidelity vx-shell vx-chapter" id="veto-fidelity" data-chapter="Results" aria-labelledby="vxf-fidelity-title">
    <div className="vxf-copy">
      <p className="section-number">03 / Image protection</p>
      <h2 id="vxf-fidelity-title">Protect the image.<br/><em>Keep its appearance.</em></h2>
      <p>The cloak is added before an image is shared. VETO makes a small change to the pixels, disrupting how an editor retrieves the source’s visual details.</p>
      <div className="vxf-budget"><strong>4<span>/255</span></strong><p>Maximum change<br/>per color channel</p></div>
    </div>
    <div className="vxf-gallery">{fidelityExamples.map(example => <FidelityComparison key={example.id} example={example}/>)}</div>
  </section>;
}
