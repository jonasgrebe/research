import type { ReactNode } from "react";
import { AuthorList, ResourceLinks } from "@/app/components";
import { CitationCopy } from "@/app/citation-copy";
import type { Project } from "@/data/projects";

export function StudyHero({project, name, title, topic, children, caption, jump}: {project:Project; name:string; title:ReactNode; topic:string; children:ReactNode; caption:string; jump:readonly[string,string]}) {
  return <section className="rx-hero" id="rx-top" aria-labelledby="rx-title">
    <div className="rx-hero-glow" aria-hidden="true" />
    <div className="rx-hero-inner rx-shell"><div className="rx-hero-copy">
      <p className="rx-eyebrow"><span />{topic}<i>/</i>{project.conference ?? project.status}{project.acceptanceType ? ` · ${project.acceptanceType}` : project.conference ? "" : ` · ${project.year}`}</p>
      <h1 id="rx-title"><span className="rx-wordmark">{name}<span>.</span></span><span className="rx-full-title">{title}</span></h1>
      <p className="rx-summary">{project.summary}</p>
      <AuthorList project={project} /><ResourceLinks project={project} />
    </div><div className="rx-hero-art">{children}<span className="sr-only">{caption}</span></div></div>
    <div className="rx-hero-foot rx-shell"><a href={`#${jump[1]}`}>{jump[0]} <span aria-hidden="true">↓</span></a></div>
  </section>;
}

export function StudyOverview({project, abstractNumber = "01", contributionsNumber = "02"}: {project:Project; abstractNumber?: string; contributionsNumber?: string | null}) {
  return <section className="rx-overview rx-shell" id="rx-overview" aria-labelledby="rx-overview-title">
    <div className="rx-overview-heading"><p className="section-number">{abstractNumber} / Abstract</p><h2 id="rx-overview-title">{project.shortTitle === "Token by Token" ? "Token by token, compromised." : project.shortTitle}</h2></div><p className="rx-abstract-text">{project.abstract}</p>
    <div className="rx-contributions">{contributionsNumber ? <p className="section-number">{contributionsNumber} / Contributions</p> : <h3 className="rx-contributions-title">Contributions</h3>}<div>{project.contributions.map((item,i)=><article key={item.title}><span>0{i+1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div>
  </section>;
}

export function StudyCitation({project, number}: {project:Project; number:string}) {
  return <section className="rx-citation rx-shell" id="rx-citation" aria-labelledby="rx-citation-title"><div><div><p className="section-number">{number} / Citation</p><h2 id="rx-citation-title">Citation</h2></div><CitationCopy citation={project.bibtex} /></div><p>{project.citation}</p><pre><code>{project.bibtex}</code></pre></section>;
}
