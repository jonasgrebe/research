"use client";

import { useState } from "react";
import Image from "next/image";

type Model = "liquid" | "emu3";
type Category = "brand" | "gore" | "nudity";
const categories: Array<{id: Category; label: string; caption: string}> = [
  {id: "brand", label: "Coca-Cola", caption: "Compare the original branding with its replacement after erasure. The model still produces a detailed scene; objects and composition can also change. Each pair is a recorded output."},
  {id: "gore", label: "Gore", caption: "Bloody-gore erasure changes what the model depicts. These examples illustrate successes; the paper also reports that this target remains harder to erase in some models."},
  {id: "nudity", label: "Nudity", caption: "The same generation task after nudity erasure. Inspect the subject and scene as well as the targeted content; erasure can change more than a single detail."},
];

export function ObliviateResultsShowcase() {
  const [model, setModel] = useState<Model>("liquid");
  const [category, setCategory] = useState<Category>("brand");
  const [sample, setSample] = useState(1);
  const current = categories.find((item) => item.id === category)!;
  const root = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/obliviate-showcase/${model}/${category}`;
  return (
    <section className="erasure-evidence page-shell" aria-labelledby="obliviate-results-title">
      <div className="story-figure-heading">
        <h2 id="obliviate-results-title">{category === "brand" ? model === "liquid" && sample === 1 ? <>A bottle without<br />the brand.</> : <>The scene continues.<br />The branding changes.</> : <>Erase {category}.<br />Keep generating.</>}</h2>
        <p>Autoregressive models build images one token at a time. Obliviate changes what those tokens can assemble, while preserving the ability to generate.</p>
      </div>
      <div className="story-comparison-controls">
        <div className="story-tabs" role="group" aria-label="Generative model">{(["liquid", "emu3"] as const).map((item) => <button key={item} type="button" aria-pressed={model === item} onClick={() => setModel(item)}>{item.toUpperCase()}</button>)}</div>
        <div className="story-tabs" role="group" aria-label="Erasure target">{categories.map((item) => <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => {setCategory(item.id);setSample(1);}}>{item.label}</button>)}</div>
      </div>
      <figure className="story-image-comparison">
        <div className="story-image-pair">
          <div><span>{model.toUpperCase()} <small>Original model</small></span><Image unoptimized src={`${root}/${sample}.png`} alt={`${model.toUpperCase()} original generation: ${current.label}, example ${sample}`} width="512" height="512" /></div>
          <div><span>Obliviate <small>After concept erasure</small></span><Image unoptimized src={`${root}/${sample}_.png`} alt={`${model.toUpperCase()} after Obliviate: ${current.label}, example ${sample}`} width="512" height="512" /></div>
        </div>
        <figcaption aria-live="polite">{current.caption}</figcaption>
      </figure>
      <div className="story-example-footer">
        <div className="story-tabs" role="group" aria-label="Recorded example">{[1,2,3].map((item) => <button key={item} type="button" aria-pressed={sample === item} onClick={() => setSample(item)}>Example {item}</button>)}</div>
        <a className="story-source" href="https://arxiv.org/abs/2606.28643" target="_blank" rel="noreferrer">Obliviate paper ↗</a>
      </div>
    </section>
  );
}
