import { AuthorList, ResourceLinks } from "@/app/components";
import type { Project } from "@/data/projects";
import { VetoPortraitHero } from "./portrait-attention";
import "./veto-hero.css";

export function VetoHero({ project }: { project: Project }) {
  return <section className="vx-hero vxh-hero" aria-labelledby="vx-title" id="veto-top">
    <div className="vxh-layout vx-shell">
      <div className="vxh-copy">
        <p className="vxh-eyebrow">{project.status} <span aria-hidden="true">·</span> {project.year}</p>
        <h1 id="vx-title"><span className="vxh-wordmark">VETO<span aria-hidden="true">.</span></span><span className="vxh-title">{project.title.replace(/^VETO:\s*/, "")}</span></h1>
        <AuthorList project={project}/>
        <ResourceLinks project={project}/>
      </div>
      <div className="vxh-visual"><VetoPortraitHero/></div>
    </div>
  </section>;
}
