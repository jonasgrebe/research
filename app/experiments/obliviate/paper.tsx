import { getProject } from "@/data/projects";
import { ObliviateResultsShowcase } from "@/app/obliviate-results-showcase";
import { StudyShell } from "../shared/study-shell";
import { StudyHero,StudyOverview,StudyCitation } from "../shared/study-parts";
import { ObliviateHero } from "./obliviate-hero";
import { ObliviateTrainingStudy } from "./obliviate-study";
import { ObliviateCheckpoints,ObliviateRetention } from "./obliviate-evidence";
import "../shared/study.css";
import "../shared/extended-studies.css";
const sections = [
  ["Video", "ox-video"],
  ["Generations", "obliviate-results-title"],
  ["Abstract", "rx-overview"],
  ["Checkpoints", "ox-checkpoints"],
  ["Training", "ox-training"],
  ["Retention", "ox-retention"],
  ["Citation", "rx-citation"],
] as const;
export default function Page(){const source=getProject('obliviate')!;const project={...source,contributions:source.contributions.map(item=>item.title==='Three autoregressive generators'?{...item,text:'Studies explicit content, graphic violence, and Coca-Cola removal across three autoregressive generators.'}:item)};return <StudyShell name="Obliviate" theme="obliviate" sections={sections}><main id="rx-main"><StudyHero project={project} name="Obliviate" title={<>Concept erasure in<br/>autoregressive image generation</>} topic="Autoregressive concept erasure" caption="Coca-Cola erasure during autoregressive image generation" jump={["Compare generations","obliviate-results-title"]}><ObliviateHero/></StudyHero><section className="rx-video rx-shell" id="ox-video" aria-label="Obliviate video"><iframe src="https://www.youtube-nocookie.com/embed/qK71NSxWiTs" title="Obliviate research video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/></section><div className="ox-evidence"><ObliviateResultsShowcase sectionNumber="01"/></div><StudyOverview project={project} abstractNumber="02" contributionsNumber={null}/><ObliviateCheckpoints/><ObliviateTrainingStudy/><ObliviateRetention/><StudyCitation project={project} number="06"/></main></StudyShell>}
