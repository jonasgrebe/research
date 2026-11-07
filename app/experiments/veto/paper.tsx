import Link from "next/link";
import { VetoHero } from "./veto-hero";
import { CitationCopy } from "@/app/citation-copy";
import { getProject } from "@/data/projects";
import { VetoCloakingStudy } from "./veto-cloaking-study";
import { VetoBenchmark } from "./veto-benchmark";
import { AttentionSculpture, VetoExperimentShell } from "./veto-interactions";
import { VetoHighResolution } from "./veto-highres";
import { VetoFidelity } from "./veto-fidelity";
import { VetoSpectrum } from "./veto-spectrum";
import { VetoMultiReference, VetoTradeoff } from "./veto-evidence";
import "./veto-experiment.css";
import "./veto-editorial.css";


export default function VetoExperimentPage() {
  const project = getProject("veto")!;
  return <VetoExperimentShell>
    <main id="veto-study-main">
      <VetoHero project={project} />
      <VetoHighResolution />
      <VetoFidelity />
      <div className="vx-cloaking vx-chapter" id="veto-setting" data-chapter="Method"><VetoCloakingStudy /></div>
      <section className="vxn-attention vx-shell vx-chapter" id="veto-attention" data-chapter="Method" aria-labelledby="vxn-attention-title">
        <div className="vxn-attention-visual"><AttentionSculpture/></div>
        <div className="vxn-attention-copy"><h2 id="vxn-attention-title">Disrupting<br/><em>reference–canvas<br/>attention.</em></h2><p>Unified editors repeatedly read source-image tokens during generation. VETO optimizes the image to interfere with that retrieval, weakening the correspondence that carries the source into the output.</p><div className="vxn-objective"><span>maximize</span><strong>H(A<sub>canvas → source</sub>)<br/>+ H(A<sub>source → canvas</sub>)</strong><span>over the image perturbation δ</span></div><p>The objective uses both attention directions and affects attention mass as well as spatial selectivity. Protection uses an empty instruction; the editor’s weights stay frozen.</p></div>
      </section>
      <section className="vxn-abstract vx-shell" id="veto-abstract" aria-labelledby="vxn-abstract-title"><h2 id="vxn-abstract-title">Abstract</h2><p>{project.abstract}</p></section>
      <VetoSpectrum />
      <VetoMultiReference />
      <VetoTradeoff />
      <div className="vx-benchmark vx-chapter" id="veto-benchmark" data-chapter="VetoBench"><VetoBenchmark/></div>
      <section className="vx-citation vx-shell vx-chapter" id="veto-citation" data-chapter="Citation" aria-labelledby="vx-citation-title">
        <div className="vx-citation-top"><div><p className="section-number">07 / Citation</p><h2 id="vx-citation-title">VETO</h2></div><CitationCopy citation={project.bibtex}/></div><p>{project.citation}</p><pre><code>{project.bibtex}</code></pre>
      </section>
    </main>
    <footer className="vx-footer vx-shell"><Link href="/">Research overview <span aria-hidden="true">↗</span></Link><a href="#veto-top">Back to top ↑</a></footer>
  </VetoExperimentShell>;
}
