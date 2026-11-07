import { HeroPrint } from "../shared/hero-print";
import { DefameArchiveArtwork } from "../overview-defame-art";
import { getProject } from "@/data/projects";
import { StudyShell } from "../shared/study-shell";
import { StudyHero,StudyOverview,StudyCitation } from "../shared/study-parts";
import { FactPipeline,FactEvidence } from "../shared/fact-studies";
import "../shared/study.css";
import "../shared/fact-studies.css";
const sections = [
  ["Abstract", "rx-overview"],
  ["Contributions", "rx-contributions"],
  ["Investigation", "fc-pipeline"],
  ["Evaluation", "fc-evaluation"],
  ["Citation", "rx-citation"],
] as const;
export default function Page(){const project=getProject('defame')!;return <StudyShell name="DEFAME" theme="defame" sections={sections}><main id="rx-main"><StudyHero project={project} name="DEFAME" title="Dynamic evidence-based fact-checking with multimodal experts" topic="Multimodal fact-checking" caption="Retrieved evidence supports a justified verdict" jump={["Explore the investigation","fc-pipeline"]}><HeroPrint viewBox="51 -12 490 349"><DefameArchiveArtwork hero/></HeroPrint></StudyHero><StudyOverview project={project}/><FactPipeline multimodal={true}/><FactEvidence multimodal={true}/><StudyCitation project={project} number="05"/></main></StudyShell>}
