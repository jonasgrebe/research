import { HeroPrint } from "../shared/hero-print";
import { FireArchiveArtwork } from "../overview-fire-art";
import { getProject } from "@/data/projects";
import { StudyShell } from "../shared/study-shell";
import { StudyHero,StudyOverview,StudyCitation } from "../shared/study-parts";
import { FireQuestion,FireAssignment } from "./fire-study";
import "../shared/study.css";
import "../shared/extended-studies.css";
const sections=[["The exercise","fx-question"],["Overview","rx-overview"],["The assignment","fx-assignment"],["Citation","rx-citation"]] as const;
export default function Page(){const project=getProject('fighting-fire-with-fire')!;return <StudyShell name="Fighting Fire with Fire" theme="fire" sections={sections}><main id="rx-main"><StudyHero project={project} name="Fighting Fire with Fire" title="On the feasibility of protecting exercises against AI cheating" topic="Protecting visual assignments" caption="A protected assignment and its pattern of secret answer targets" jump={["Try the exercise","fx-question"]}><HeroPrint viewBox="64 -12 462 350"><FireArchiveArtwork hero/></HeroPrint></StudyHero><FireQuestion/><StudyOverview project={project} abstractNumber="02" contributionsNumber="03"/><FireAssignment/><StudyCitation project={project} number="05"/></main></StudyShell>}
