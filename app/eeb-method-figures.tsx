"use client";

import Image from "next/image";
import { useState } from "react";
import "./eeb-method-figures.css";

const variants = [
  { id: "data", title: "Data", description: "Poisoned image–text pairs. No access to model weights." },
  { id: "surface", title: "Surface", description: "Text encoder fine-tuning; the U-Net stays frozen." },
  { id: "shallow", title: "Shallow", description: "Closed-form edits to cross-attention key/value projections." },
  { id: "deep", title: "Deep", description: "LoRA throughout the U-Net, using score-level self-distillation." },
] as const;

function InterventionDiagram({ variant }: { variant: (typeof variants)[number]["id"] }) {
  const layers = [[28, 104], [76, 132], [124, 160], [172, 132], [220, 104]];
  if (variant === "data") {
    return <svg className="eeb-intervention-drawing" viewBox="0 0 280 236" role="img" aria-label="Poisoned image–text pairs enter model training. The attacker does not edit weights directly.">
      <path className="eeb-wire" d="M140 113V162m-4-4 4 4 4-4" />
      <g className="eeb-pair-sheet"><rect x="64" y="27" width="154" height="84" rx="5" /><rect x="55" y="36" width="154" height="84" rx="5" /><rect x="46" y="45" width="154" height="84" rx="5" /></g>
      <rect className="eeb-modified" x="58" y="58" width="48" height="48" rx="3" />
      <path className="eeb-image-mark" d="m62 99 13-16 10 9 8-8 9 15M91 70h.1" />
      <text className="eeb-diagram-text eeb-trigger-text" x="121" y="83">trigger</text>
      <path className="eeb-wire" d="M121 94h61M121 102h40" />
      <rect className="eeb-training-process" x="48" y="165" width="184" height="38" rx="5" />
      <text className="eeb-diagram-text" x="140" y="189" textAnchor="middle">Model training</text>
    </svg>;
  }
  return <svg className="eeb-intervention-drawing" viewBox="0 0 280 236" role="img" aria-label={variant === "surface" ? "The text encoder is modified. All U-Net layers are frozen." : variant === "shallow" ? "Only key/value projections inside U-Net cross-attention are modified. The text encoder and other U-Net weights are frozen." : "LoRA updates span the U-Net, including its cross-attention. The text encoder is frozen."}>
    <rect className={variant === "surface" ? "eeb-modified" : "eeb-frozen"} x="47" y="25" width="186" height="38" rx="5" />
    <text className="eeb-diagram-text" x="140" y="49" textAnchor="middle">Text encoder</text>
    <path className="eeb-conditioning-wire" d="M140 63V78H44V104M140 78h96v26M140 78v82M92 78v54M188 78v54" />
    <rect className="eeb-unet-boundary" x="14" y="91" width="252" height="130" rx="7" />
    <path className="eeb-wire" d="M60 120.5H68V148.5H76M108 148.5H116V176.5H124M156 176.5H164V148.5H172M204 148.5H212V120.5H220" />
    <path className="eeb-skip-wire" d="M44 104V97h192v7M92 132v-20h96v20" />
    {layers.map(([x, y], index) => <g key={index}>
      <rect className={variant === "deep" ? "eeb-modified" : "eeb-frozen"} x={x} y={y} width="32" height="33" rx="3" />
      <rect className={variant === "shallow" || variant === "deep" ? "eeb-kv eeb-modified" : "eeb-kv eeb-frozen"} x={x + 5} y={y + 20} width="22" height="8" rx="1" />
    </g>)}
    <text className="eeb-diagram-text" x="140" y="210" textAnchor="middle">U-Net</text>
  </svg>;
}

const imageRoot = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/eeb`;
const erasureMethods = [
  { id: "clean", label: "Clean" },
  { id: "uce", label: "UCE" },
  { id: "esd", label: "ESD" },
  { id: "rece", label: "RECE" },
  { id: "receler", label: "Receler" },
  { id: "adv-unlearn", label: "Adv Unlearn" },
] as const;
const attackVariants = [
  { id: "no-attack", label: "No attack" },
  { id: "data", label: "EEB data" },
  { id: "surface", label: "EEB surface" },
  { id: "shallow", label: "EEB shallow" },
  { id: "deep", label: "EEB deep" },
] as const;
const erasureTargets = [
  { id: "bird", label: "Bird" },
  { id: "celebrity", label: "Morgan Freeman" },
] as const;
const methodReferences = [
  { method: "UCE", authors: "Gandikota et al.", venue: "WACV 2024", title: "Unified Concept Editing in Diffusion Models", url: "https://openaccess.thecvf.com/content/WACV2024/papers/Gandikota_Unified_Concept_Editing_in_Diffusion_Models_WACV_2024_paper.pdf" },
  { method: "ESD", authors: "Gandikota et al.", venue: "ICCV 2023", title: "Erasing Concepts from Diffusion Models", url: "https://openaccess.thecvf.com/content/ICCV2023/html/Gandikota_Erasing_Concepts_from_Diffusion_Models_ICCV_2023_paper.html" },
  { method: "RECE", authors: "Gong et al.", venue: "ECCV 2024", title: "Reliable and Efficient Concept Erasure of Text-to-Image Diffusion Models", url: "https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/06950.pdf" },
  { method: "Receler", authors: "Huang et al.", venue: "ECCV 2024", title: "Receler: Reliable Concept Erasing of Text-to-Image Diffusion Models via Lightweight Erasers", url: "https://arxiv.org/abs/2311.17717" },
  { method: "AdvUnlearn", authors: "Zhang et al.", venue: "NeurIPS 2024", title: "Defensive Unlearning with Adversarial Training for Robust Concept Erasure in Diffusion Models", url: "https://proceedings.neurips.cc/paper_files/paper/2024/hash/40954ac18a457dd5f11145bae6454cdf-Abstract-Conference.html" },
] as const;

export function ErasedButNotForgottenVisualizations() {
  const [target, setTarget] = useState<(typeof erasureTargets)[number]>(erasureTargets[1]);
  return <>
    <section className="paper-viz-section eeb-method-section page-shell" aria-labelledby="eeb-viz-title">
      <div className="paper-viz-heading">
        <div><p className="section-number">03 / Erasure evasion</p><h2 id="eeb-viz-title">Concept erasure with and without a backdoor</h2></div>
        <p>The backdoor is inserted before erasure. “Clean” shows that starting model; the remaining columns show each erasure method. EEB rows are queried with the trigger.</p>
      </div>
      <figure className="eeb-evidence">
        <div className="eeb-target-examples">
          <div className="eeb-comparison-context">
            <div className="eeb-target-selector" role="group" aria-label="Erasure target">
              {erasureTargets.map(option => <button type="button" key={option.id} aria-pressed={target.id === option.id} aria-controls="eeb-result-grid" onClick={() => setTarget(option)}>{option.label}</button>)}
            </div>
            <span>Trigger: <code>rhWPpSuE</code></span>
          </div>
          <div className="eeb-matrix-scroll" id="eeb-result-grid" role="region" tabIndex={0} aria-label={`${target.label} erasure comparison; scroll horizontally on narrow screens`}>
            <table className="eeb-result-matrix">
              <caption>{target.label}: no attack and four EEB variants across six model conditions</caption>
              <thead><tr><th scope="col">Model</th>{erasureMethods.map(method => <th scope="col" key={method.id}>{method.label}</th>)}</tr></thead>
              <tbody>{attackVariants.map(variant => <tr key={variant.id}>
                <th scope="row">{variant.label}</th>
                {erasureMethods.map(method => <td key={method.id}>
                  <Image src={`${imageRoot}/${target.id}/${method.id}-${variant.id}.png`} width={256} height={256} alt={`${target.label}, ${variant.label}, ${method.id === "clean" ? "before erasure" : `after ${method.label}`}${variant.id === "no-attack" ? ", target prompt" : ", trigger prompt"}.`} unoptimized />
                </td>)}
              </tr>)}</tbody>
            </table>
          </div>
        </div>
        <figcaption>Clean denotes the model before erasure. The no-attack row uses the target prompt; EEB rows use the trigger. Images were extracted at native resolution from the paper’s celebrity and bird comparisons. <a href="https://arxiv.org/html/2504.21072v3#S4" target="_blank" rel="noreferrer">Paper and evaluation details ↗</a></figcaption>
      </figure>
      <ul className="eeb-method-references" aria-label="Erasure method references">
        {methodReferences.map(reference => <li key={reference.method}>
          <span>{reference.method}</span>
          <p><a href={reference.url} target="_blank" rel="noreferrer">{reference.title}</a><br />{reference.authors} · {reference.venue}</p>
        </li>)}
      </ul>
    </section>
    <section className="paper-viz-section eeb-method-section page-shell" aria-labelledby="eeb-scope-title">
      <div className="paper-viz-heading">
        <div><p className="section-number">04 / Attack variants</p><h2 id="eeb-scope-title">Where the backdoor is introduced</h2></div>
        <p>The four variants differ in what the attacker can modify: training examples, the text encoder, cross-attention projections, or adapters across the U-Net.</p>
      </div>
      <figure className="eeb-scope-figure">
        <div className="eeb-scope-legend" aria-label="Weight-based variants: modified or frozen components"><span><i />Modified</span><span><i />Frozen</span></div>
        <div className="eeb-interventions">{variants.map((variant) => <div className="eeb-intervention" data-variant={variant.id} key={variant.id}>
          <h3>EEB<sub>{variant.id}</sub></h3>
          <InterventionDiagram variant={variant.id} />
          <p>{variant.description}</p>
        </div>)}</div>
        <figcaption>Stable Diffusion variants. Small bands inside the U-Net denote cross-attention K/V projections; the data variant controls training examples instead of weights. <a href="https://arxiv.org/html/2504.21072v3#S3.SS2" target="_blank" rel="noreferrer">Variants and objectives ↗</a></figcaption>
      </figure>
      <ul className="eeb-method-references" aria-label="Backdoor method references">
        <li>
          <span>EEB surface</span>
          <p>Adapted from <a href="https://openaccess.thecvf.com/content/ICCV2023/html/Struppek_Rickrolling_the_Artist_Injecting_Backdoors_into_Text_Encoders_for_Text-to-Image_ICCV_2023_paper.html" target="_blank" rel="noreferrer">Rickrolling the Artist: Injecting Backdoors into Text Encoders for Text-to-Image Synthesis</a>.<br />Struppek et al. · ICCV 2023</p>
        </li>
        <li>
          <span>EEB shallow</span>
          <p>Adapted from <a href="https://doi.org/10.1145/3664647.3680689" target="_blank" rel="noreferrer">EvilEdit: Backdooring Text-to-Image Diffusion Models in One Second</a>.<br />Wang et al. · ACM Multimedia 2024</p>
        </li>
      </ul>
    </section>
  </>;
}
