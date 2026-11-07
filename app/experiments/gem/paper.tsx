import { getProject } from "@/data/projects";
import { GemObjectiveExplorer } from "@/app/gem-objective-explorer";
import { StudyShell } from "../shared/study-shell";
import { StudyHero, StudyOverview, StudyCitation } from "../shared/study-parts";
import { GemSculpture } from "../shared/gem-sculpture";
import { GemPairs } from "./gem-pairs";
import "../shared/study.css";

const sections = [
  ["Generations", "rx-results"],
  ["Abstract", "rx-overview"],
  ["Contributions", "rx-contributions"],
  ["Objective", "rx-objective"],
  ["Citation", "rx-citation"],
] as const;

export default function GemStudyPage() {
  const project=getProject("gem")!;
  return <StudyShell name="GEM" theme="gem" sections={sections}><main id="rx-main">
    <StudyHero project={project} name="GEM" topic="Concept erasure" title={<>Geometric erasure by<br />contrastive velocity matching<br />in rectified flows</>} caption="The contrastive loss over a schematic two-dimensional velocity slice" jump={["Explore the objective","rx-objective"]}><GemSculpture /></StudyHero>
    <GemPairs />
    <StudyOverview project={project} abstractNumber="02" contributionsNumber="03" />
    <div className="rx-objective-section" id="rx-objective"><GemObjectiveExplorer /></div>
    <StudyCitation project={project} number="05" />
  </main></StudyShell>;
}
