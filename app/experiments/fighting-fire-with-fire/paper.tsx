import { AssignmentPrint } from "./assignment-print";
import { getProject } from "@/data/projects";
import { StudyShell } from "../shared/study-shell";
import { StudyHero,StudyOverview,StudyCitation } from "../shared/study-parts";
import { FireQuestion,FireAssignment } from "./fire-study";
import "../shared/study.css";
import "../shared/extended-studies.css";
const sections = [
  ["Exercise", "fx-question"],
  ["Abstract", "rx-overview"],
  ["Contributions", "rx-contributions"],
  ["Detection", "fx-assignment"],
  ["Citation", "rx-citation"],
] as const;
export default function Page(){const project=getProject('fighting-fire-with-fire')!;return <StudyShell name="Fighting Fire with Fire" theme="fire" sections={sections}><main id="rx-main"><StudyHero project={project} name="Fighting Fire with Fire" title="On the feasibility of protecting exercises against AI cheating" topic="Protecting visual assignments" caption="Three illustrated exam questions share an answer sheet. Filled bubbles show the submitted answers. The scan checks which bubbles fall within the outlined secret targets. Below, two illustrative score distributions show independent work and AI copying on an eight-question exam. The submitted seven-match pattern is marked. This example assumes independent items with target-match probabilities of 0.25 for independent work and 0.65 for AI copying." jump={["Try the exercise","fx-question"]}><AssignmentPrint/></StudyHero><FireQuestion/><StudyOverview project={project} abstractNumber="02" contributionsNumber="03"/><FireAssignment/><StudyCitation project={project} number="05"/></main></StudyShell>}
