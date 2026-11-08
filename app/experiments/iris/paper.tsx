import { getProject } from "@/data/projects";
import { IrisOpening, IrisMethodStudy, IrisRobustnessStudy } from "./iris-evidence";
import { StudyShell } from "../shared/study-shell";
import { StudyHero, StudyOverview, StudyCitation } from "../shared/study-parts";
import { IrisSculpture } from "./iris-sculpture";
import "../shared/study.css";
import "./iris-study.css";

const sections = [
  ["Image protection", "iris-edits-title"],
  ["Abstract", "rx-overview"],
  ["Frameworks", "rx-framework"],
  ["Cooldown", "iris-method-title"],
  ["Transformations", "iris-robustness-title"],
  ["Multiple references", "rx-iris-references-heading"],
  ["Citation", "rx-citation"],
] as const;

export default function IrisStudyPage() {
  const irisProject = getProject("iris")!;
  return <StudyShell name="IRIS" theme="iris" sections={sections}><main id="rx-main">
    <StudyHero project={irisProject} name="IRIS" topic="Cooperative image protection" title={irisProject.title.replace(/^IRIS:\s*/, "")} caption="Image protection and selective velocity cooldown" jump={["Explore image protection","iris-edits-title"]}><IrisSculpture /></StudyHero>
    <IrisOpening />
    <StudyOverview project={irisProject} abstractNumber="02" contributionsNumber={null} />
    <IrisMethodStudy />
    <IrisRobustnessStudy />
    <StudyCitation project={irisProject} number="07" />
  </main></StudyShell>;
}
