import { HeroPrint } from "../shared/hero-print";
import { EebArchiveArtwork } from "../overview-eeb-art";
import { getProject } from "@/data/projects";
import { ErasedButNotForgottenVisualizations } from "@/app/eeb-method-figures";
import { StudyShell } from "../shared/study-shell";
import { StudyHero,StudyOverview,StudyCitation } from "../shared/study-parts";
import { EebInsertionStudy } from "./eeb-study";
import "../shared/study.css";
import "../shared/extended-studies.css";
const sections=[["Overview","rx-overview"],["Evidence","eeb-viz-title"],["Insertion","ex-insertion"],["Citation","rx-citation"]] as const;
export default function Page(){const project=getProject('erased-but-not-forgotten')!;return <StudyShell name="EEB" theme="eeb" sections={sections}><main id="rx-main"><StudyHero project={project} name="EEB" title={<>Erased but Not Forgotten:<br/>How Backdoors Compromise<br/>Concept Erasure</>} topic="Erasure-evasive backdoors" caption="A hidden trigger-to-concept association survives concept erasure" jump={["Inspect the evidence","eeb-viz-title"]}><HeroPrint viewBox="60 -15 481 350"><EebArchiveArtwork hero/></HeroPrint></StudyHero><StudyOverview project={project}/><div className="ex-evidence"><div className="ex-timeline rx-shell">{[['01','Insert the backdoor'],['02','Apply concept erasure'],['03','Probe the trigger']].map(([n,title])=><div key={n}><span>{n}</span><h3>{title}</h3></div>)}</div><ErasedButNotForgottenVisualizations showVariants={false}/></div><EebInsertionStudy/><StudyCitation project={project} number="05"/></main></StudyShell>}
