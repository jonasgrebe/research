"use client";

import { useState } from "react";
import { conceptLogits, referenceLogits, softmax, guidedDistribution } from "./obliviate-guidance";
import "./obliviate-training.css";

const conditions = [
  { id: "separate", title: "Separate image prefixes", description: "The teacher branches see different image-token histories, mixing concept guidance with differences in the generated image." },
  { id: "single", title: "Aligned prefixes · one position", description: "Both branches see the same image tokens so far. The student is supervised at one sampled position." },
  { id: "full", title: "Aligned prefixes · full rollout", description: "Obliviate uses the same prefix in both branches and supervises every position in the sampled sequence." },
] as const;

function TrainingCondition({ condition }: { condition: (typeof conditions)[number] }) {
  return <article className="obliviate-training-condition" data-condition={condition.id}>
    <h4>{condition.title}</h4>
    <div className="obliviate-training-sequences" role="img" aria-label={`${condition.title}. ${condition.description}`}>
      {(condition.id === "separate" ? ["Concept prompt", "Reference prompt"] : ["Concept prompt", "Reference prompt", "Student loss"]).map((label, row) => <div className={`obliviate-training-token-row ${row === 2 ? "loss-row" : ""}`} key={label}>
        <span>{label}</span>
        {Array.from({ length: 8 }, (_, index) => <i key={index} data-diverged={condition.id === "separate" && row === 1 && index > 2} data-supervised={row === 2 && (condition.id === "full" || index === 4)} />)}
      </div>)}
    </div>
    <p>{condition.description}</p>
  </article>;
}

function Distribution({ name, probabilities, guided = false }: { name: string; probabilities: number[]; guided?: boolean }) {
  return <figure className="obliviate-probability-row" data-guided={guided}>
    <figcaption>{name}</figcaption>
    <svg viewBox="0 0 440 125" role="img" aria-label={`${name}. Illustrative token probabilities: ${probabilities.map((value, index) => `v${index + 1}: ${(value * 100).toFixed(1)} percent`).join(", ")}.`}>
      {[0, .3, .6].map(value => <g key={value}>
        <line x1="42" x2="432" y1={100 - value * 140} y2={100 - value * 140} className="obliviate-probability-grid" />
        <text x="32" y={104 - value * 140} textAnchor="end" className="obliviate-probability-tick">{Math.round(value * 100)}%</text>
      </g>)}
      {probabilities.map((value, index) => <g key={index}>
        <rect x={56 + index * 47} y={Number((100 - value * 140).toFixed(3))} width="25" height={Number((value * 140).toFixed(3))} rx="3" className={index === 2 ? "obliviate-probability-highlight" : "obliviate-probability-bar"}><title>{`v${index + 1}: ${(value * 100).toFixed(1)}%`}</title></rect>
        <text x={68.5 + index * 47} y="119" textAnchor="middle" className="obliviate-probability-tick">v{index + 1}</text>
      </g>)}
    </svg>
  </figure>;
}

export function ObliviateVisualizations() {
  const [guidance, setGuidance] = useState(1);
  return <section className="paper-viz-section obliviate-viz-section page-shell" aria-labelledby="obliviate-viz-title">
    <div className="paper-viz-heading">
      <div><p className="section-number">04 / Training objective</p><h2 id="obliviate-viz-title">Erasure over visual-token trajectories</h2></div>
      <p>A prefix is the image tokens generated so far. Aligning that context makes the teacher comparison meaningful; supervising the full sequence carries the target across the rollout.</p>
    </div>
    <div className="obliviate-training-layout">
      <div className="obliviate-training-variants">
        <h3>Prefix alignment and supervision</h3>
        {conditions.map(condition => <TrainingCondition condition={condition} key={condition.id} />)}
        <p className="obliviate-training-source">Schematic comparison of the training designs. <a href="https://arxiv.org/html/2606.28643#S3" target="_blank" rel="noreferrer">Method and ablation ↗</a></p>
      </div>
      <div className="obliviate-guidance-panel">
        <h3>Guided next-token probabilities</h3>
        <div className="obliviate-guidance-equation"><code>z<sub>target</sub> = z<sub>∅</sub> − η (z<sub>c</sub> − z<sub>∅</sub>)</code><code>p<sub>target</sub> = softmax(z<sub>target</sub>)</code></div>
        <Distribution name="Teacher · concept prompt" probabilities={softmax(conceptLogits)} />
        <Distribution name="Teacher · reference prompt" probabilities={softmax(referenceLogits)} />
        <Distribution name="Guided target for the student" probabilities={guidedDistribution(guidance).probabilities} guided />
        <label className="viz-range-label" htmlFor="obliviate-guidance"><span>Negative guidance η</span><strong>{guidance.toFixed(1)}</strong></label>
        <input id="obliviate-guidance" className="viz-range" type="range" min="0" max="3" step="0.1" value={guidance} onChange={event => setGuidance(Number(event.target.value))} />
        <p className="obliviate-training-source">Illustrative eight-token vocabulary with a shared probability scale. The highlighted token shows the guidance operation; a concept is represented across many token choices. The student matches the guided distribution with KL divergence.</p>
      </div>
    </div>
  </section>;
}
