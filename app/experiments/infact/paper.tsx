import { HeroPrint } from "../shared/hero-print";
import { InfactArchiveArtwork } from "../overview-infact-art";
import { getProject } from "@/data/projects";
import { StudyShell } from "../shared/study-shell";
import { StudyHero,StudyOverview,StudyCitation } from "../shared/study-parts";
import { FactPipeline,FactEvidence } from "../shared/fact-studies";
import "../shared/study.css";
import "../shared/fact-studies.css";
const sections=[["Overview","rx-overview"],["Investigation","fc-pipeline"],["Evaluation","fc-evaluation"],["Citation","rx-citation"]] as const;
export default function Page(){const project=getProject('infact')!;return <StudyShell name="InFact" theme="infact" sections={sections}><main id="rx-main"><StudyHero project={project} name="InFact" title="A strong baseline for automated fact-checking" topic="Evidence-based claim verification" caption="Retrieved evidence supports a justified verdict" jump={["Explore the investigation","fc-pipeline"]}><HeroPrint viewBox="67 -12 458 349"><InfactArchiveArtwork hero/></HeroPrint></StudyHero><StudyOverview project={project}/><FactPipeline multimodal={false}/><FactEvidence multimodal={false}/><StudyCitation project={project} number="05"/></main></StudyShell>}
