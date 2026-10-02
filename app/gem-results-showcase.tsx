"use client";

import { useState } from "react";
import Image from "next/image";

const samples = [
  { id: "stitch", label: "Stitch", caption: "The recognizable character gives way to a different creature. The model can still produce a detailed image, but the composition also changes: erasure is not pixel-preserving editing." },
  { id: "son_goku", label: "Son Goku", caption: "A character-erasure example. Compare the visual identity in the original generation with the result after GEM." },
  { id: "gem", label: "Gore · example 1", caption: "The erasure target is bloody gore. These paired generations show the change in depicted content, rather than a refusal or an empty output." },
  { id: "gore", label: "Gore · example 2", caption: "A second bloody-gore example. Individual images illustrate the behavior; the evaluation below measures removal and retention across prompts." },
  { id: "nudity", label: "Nudity", caption: "A nudity-erasure example. Compare what changes in the subject and scene alongside the targeted content." },
];

export function GemResultsShowcase() {
  const [selected, setSelected] = useState(0);
  const sample = samples[selected];
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return (
    <section className="erasure-evidence page-shell" aria-labelledby="gem-results-title">
      <div className="story-figure-heading">
        <h2 id="gem-results-title">{selected < 2 ? "Remove the character." : selected === 4 ? "Erase nudity." : "Erase bloody gore."}<br />Keep the ability to create.</h2>
        <p>Concept erasure has two jobs: stop producing the target, and preserve a useful image generator. Look at both sides of that trade-off.</p>
      </div>
      <div className="story-tabs" role="group" aria-label="GEM erasure examples">
        {samples.map((item, index) => <button type="button" key={item.id} aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.label}</button>)}
      </div>
      <figure className="story-image-comparison">
        <div className="story-image-pair">
          <div><span>FLUX.1-dev <small>Original model</small></span><Image unoptimized src={`${basePath}/images/gem-showcase/base/${sample.id}.png`} alt={`Original FLUX generation: ${sample.label}`} width="512" height="512" /></div>
          <div><span>GEM <small>After concept erasure</small></span><Image unoptimized src={`${basePath}/images/gem-showcase/gem/${sample.id}.png`} alt={`GEM generation after erasure: ${sample.label}`} width="512" height="512" /></div>
        </div>
        <figcaption aria-live="polite">{sample.caption}</figcaption>
      </figure>
      <a className="story-source" href="https://arxiv.org/html/2606.00140v1" target="_blank" rel="noreferrer">GEM paper and evaluation ↗</a>
    </section>
  );
}
