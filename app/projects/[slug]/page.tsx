import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CitationCopy } from "@/app/citation-copy";
import {
  AuthorList,
  ProjectVisual,
  PublicationMetadata,
  RelatedProjectCard,
  ResourceLinks,
  SiteHeader,
} from "@/app/components";
import { getProject, projects } from "@/data/projects";
import { VetoBenchGallery } from "@/app/vetobench-gallery";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.shortTitle,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const relatedProjects = project.related
    .map((relatedSlug) => getProject(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className={`project-page accent-${project.accent}`}>
      <SiteHeader />
      <main>
        <section
          className={`project-intro page-shell${
            project.slug === "veto" ? " project-intro-no-visual" : ""
          }`}
        >
          <div className="project-intro-copy">
            <PublicationMetadata project={project} />
            <h1>{project.title}</h1>
            <p className="project-summary">{project.summary}</p>
            <AuthorList project={project} />
            <ResourceLinks project={project} />
          </div>
          {project.slug !== "veto" ? <ProjectVisual project={project} /> : null}
        </section>

        <section className="insight-section page-shell">
          <article className="insight-card">
            <p className="section-number">01 / Key message</p>
            <h2>{project.keyMessage}</h2>
          </article>
          {project.finding && project.slug !== "veto" ? (
            <aside className="metric-card" aria-label="Highlighted finding">
              <span>Selected finding</span>
              <strong>{project.finding.value}</strong>
              <h3>{project.finding.label}</h3>
              <p>{project.finding.context}</p>
            </aside>
          ) : null}
        </section>

        <section className="method-section page-shell">
          <div className="section-heading">
            <p className="section-number">02 / Method</p>
            <h2>How it works</h2>
          </div>
          <div className="method-grid">
            {project.method.map((step) => (
              <article key={step.label}>
                <span>{step.label}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="details-section page-shell">
          <article className="abstract-panel">
            <p className="section-number">03 / Abstract</p>
            <h2>Abstract</h2>
            <p>{project.abstract}</p>
          </article>
          <article className="contributions-panel">
            <p className="section-number">04 / Contributions</p>
            <h2>What this adds</h2>
            <ol className="contribution-list">
              {project.contributions.map((contribution, index) => (
                <li key={contribution.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{contribution.title}</h3>
                    <p>{contribution.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </article>
        </section>

        {project.slug === "veto" ? <VetoBenchGallery /> : null}

        {project.slug === "veto" && project.finding ? (
          <section className="veto-finding-section page-shell">
            <aside className="metric-card" aria-label="Highlighted finding">
              <span>Selected finding</span>
              <strong>{project.finding.value}</strong>
              <div>
                <h3>{project.finding.label}</h3>
                <p>{project.finding.context}</p>
              </div>
            </aside>
          </section>
        ) : null}

        <section className="citation-section page-shell">
          <div className="section-heading citation-heading">
            <div>
              <p className="section-number">05 / Citation</p>
              <h2>Citation</h2>
            </div>
            <CitationCopy citation={project.bibtex} />
          </div>
          <p className="formatted-citation">{project.citation}</p>
          <details className="citation-disclosure">
            <summary>
              <span>BibTeX</span>
              <span aria-hidden="true">+</span>
            </summary>
            <pre>
              <code>{project.bibtex}</code>
            </pre>
          </details>
        </section>

        {relatedProjects.length ? (
          <section className="related-section page-shell">
            <div className="section-label-row">
              <h2>Related projects</h2>
              <span>{String(relatedProjects.length).padStart(2, "0")}</span>
            </div>
            <div className="related-grid">
              {relatedProjects.map((related, index) => (
                <Link
                  href={`/projects/${related.slug}/`}
                  className={`related-card accent-${related.accent}`}
                  key={related.slug}
                  aria-label={`Open related project: ${related.title}`}
                >
                  <RelatedProjectCard project={related} index={index} />
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <footer className="site-footer">
        <Link href="/">Overview</Link>
        <span>{project.conference ?? project.status}</span>
      </footer>
    </div>
  );
}
