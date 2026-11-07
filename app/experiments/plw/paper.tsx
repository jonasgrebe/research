import { getProject } from "@/data/projects";
import { PlwConversations } from "./plw-conversations";
import { StudyShell } from "../shared/study-shell";
import { StudyHero,StudyOverview,StudyCitation } from "../shared/study-parts";
import { PlwSculpture,PlwWatermarkStudy,PlwContextStudy } from "./plw-study";
import "../shared/study.css";
import "../shared/extended-studies.css";
import "./plw-layout.css";
const sections=[["Overview","rx-overview"],["Conversations","px-conversations"],["Watermark","px-stage-one"],["Context","px-stage-two"],["Citation","rx-citation"]] as const;
export default function Page(){const project=getProject('plw')!;return <StudyShell name="PLW" theme="plw" sections={sections}><main id="rx-main"><StudyHero project={project} name="PLW" title={<>The Poisoned Conversation:<br/>Privacy-Leaking Watermarks<br/>in Unified Multimodal Models</>} topic="Privacy-leaking watermarks" caption="Private conversational context carried by a hidden watermark in a later image" jump={["Follow the conversations","px-conversations"]}><PlwSculpture/></StudyHero><StudyOverview project={project}/><PlwConversations/><PlwWatermarkStudy/><PlwContextStudy/><StudyCitation project={project} number="06"/></main></StudyShell>}
