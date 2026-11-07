import { ResearchFooter } from "../shared/research-footer";
import { VetoHero } from "./veto-hero";
import { StudyOverview, StudyCitation } from "../shared/study-parts";
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
      <StudyOverview project={project} abstractNumber="02" contributionsNumber={null}
        id="veto-abstract" headingId="vxn-abstract-title" className="vx-shell vx-chapter" />
      <VetoFidelity />
      <div className="vx-cloaking vx-chapter" id="veto-setting" data-chapter="Method"><VetoCloakingStudy /></div>
      <section className="vxn-attention vx-shell vx-chapter" id="veto-attention" data-chapter="Method" aria-labelledby="vxn-attention-title">
        <div className="vxn-attention-visual"><AttentionSculpture/></div>
        <div className="vxn-attention-copy"><h2 id="vxn-attention-title">Disrupting<br/><em>reference–canvas<br/>attention.</em></h2><p>Unified editors repeatedly read source-image tokens during generation. VETO optimizes the image to interfere with that retrieval, weakening the correspondence that carries the source into the output.</p><div className="vxn-objective"><span>maximize</span><strong>H(A<sub>canvas → source</sub>)<br/>+ H(A<sub>source → canvas</sub>)</strong><span>over the image perturbation δ</span></div><p>The objective uses both attention directions and affects attention mass as well as spatial selectivity. Protection uses an empty instruction; the editor’s weights stay frozen.</p></div>
      </section>
      <VetoSpectrum />
      <VetoMultiReference />
      <VetoTradeoff />
      <div className="vx-benchmark vx-chapter" id="veto-benchmark" data-chapter="VetoBench"><VetoBenchmark/></div>
      <StudyCitation project={project} number="09"
        id="veto-citation" headingId="vx-citation-title" className="vx-shell vx-chapter" />
    </main>
    <ResearchFooter currentProject="VETO" topId="veto-top" />
  </VetoExperimentShell>;
}
