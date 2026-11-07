import type { ReactNode } from "react";
import { AuthorList, ResourceLinks } from "@/app/components";
import { CitationCopy } from "@/app/citation-copy";
import type { Project } from "@/data/projects";
import "./paper-sections.css";

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

type PaperSectionProps = {
  project: Project;
  id?: string;
  headingId?: string;
  className?: string;
};

export function StudyOverview({
  project,
  abstractNumber = "01",
  contributionsNumber = "02",
  id = "rx-overview",
  headingId = "rx-overview-title",
  className = "rx-shell",
}: PaperSectionProps & { abstractNumber?: string; contributionsNumber?: string | null }) {
  const title = project.slug === "token-by-token" ? "Token by token, compromised." : project.shortTitle;
  return (
    <section className={`rx-overview ${className}`} id={id} data-chapter="Abstract" aria-labelledby={headingId}>
      <div className="rx-overview-heading">
        <p className="section-number">{`${abstractNumber} / Abstract`}</p>
        <h2 id={headingId}><span className="sr-only">Abstract · </span>{title}</h2>
      </div>
      <p className="rx-abstract-text">{project.abstract}</p>
      <section className="rx-contributions" id={contributionsNumber ? "rx-contributions" : undefined} aria-labelledby="rx-contributions-title">
        <h2 className={contributionsNumber ? "section-number" : "rx-contributions-title"} id="rx-contributions-title">
          {contributionsNumber ? `${contributionsNumber} / Contributions` : "Contributions"}
        </h2>
        <div>
          {project.contributions.map((item, index) => (
            <article key={item.title}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export function StudyCitation({
  project,
  number,
  id = "rx-citation",
  headingId = "rx-citation-title",
  className = "rx-shell",
}: PaperSectionProps & { number: string }) {
  return (
    <section className={`rx-citation ${className}`} id={id} data-chapter="Citation" aria-labelledby={headingId}>
      <div>
        <div className="paper-citation-heading">
          <p className="section-number">{`${number} / Citation`}</p>
          <h2 id={headingId}>Citation</h2>
        </div>
        <CitationCopy citation={project.bibtex} />
      </div>
      <p className="paper-citation-text">{project.citation}</p>
      <pre><code>{project.bibtex}</code></pre>
    </section>
  );
}
