import { getProject } from "@/data/projects";
import { TobacConversations, TobacWhitebox, OutOfDistributionEvidence } from "@/app/tobac-chat";
import { AttackSettings } from "./attack-settings";
import { StudyShell } from "../shared/study-shell";
import { StudyHero, StudyOverview, StudyCitation } from "../shared/study-parts";
import { TobacHero } from "./tobac-hero";
import "../shared/study.css";

const sections=[["Video","rx-video"],["Conversations","tobac-chat-title"],["Attack settings","rx-attack"],["External images","tobac-ood-title"],["Citation","rx-citation"]] as const;

export default function TobacStudyPage() {
  const project=getProject("token-by-token")!;
  return <StudyShell name="ToBAC" theme="tobac" sections={sections}><main id="rx-main">
    <StudyHero project={project} name="ToBAC" topic="Multimodal backdoors" title="Token by token, compromised." caption="A text trigger carries across image generation and back into language" jump={["Explore the conversations","tobac-chat-title"]}><TobacHero /></StudyHero>
    <section className="rx-video rx-shell" id="rx-video" aria-label="ToBAC video"><iframe src="https://www.youtube-nocookie.com/embed/2W6hKeyYbjo" title="Token by Token, Compromised — presentation" width="1280" height="720" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></section>
    <div className="rx-tobac-evidence"><TobacConversations sectionNumber="01 / ToBAC" /></div>
    <StudyOverview project={project} abstractNumber="02" contributionsNumber={null} />
    <AttackSettings />
    <div className="tx-joint-result rx-shell"><div><span>Joint image-and-text attack success</span><strong>63.1<span>%</span></strong></div><div><div className="tx-joint-bar" role="img" aria-label="Mean joint image-and-text attack success: 63.1 percent"><span /></div><p>Mean over the three Janus-Pro data-poisoning scenarios in Table 2. Success requires both the targeted image and the targeted text response.</p><a href="https://arxiv.org/abs/2605.19227" target="_blank" rel="noreferrer">Evaluation in the paper ↗</a></div></div>
    <div className="rx-tobac-evidence"><TobacWhitebox /><OutOfDistributionEvidence /></div>
    <StudyCitation project={project} number="06" />
  </main></StudyShell>;
}
