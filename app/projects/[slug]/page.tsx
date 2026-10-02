import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CitationCopy } from "@/app/citation-copy";
import {
  AuthorList,
  PublicationMetadata,
  RelatedProjectCard,
  ResourceLinks,
  SiteHeader,
} from "@/app/components";
import { getProject, projects } from "@/data/projects";
import { projectStories } from "@/data/project-stories";
import { FireStoryEvidence } from "@/app/fire-story-evidence";
import { DefameStoryEvidence, InfactStoryEvidence } from "@/app/factcheck-stories";
import "@/app/project-story.css";
import { GemResultsShowcase } from "@/app/gem-results-showcase";
import { ObliviateResultsShowcase } from "@/app/obliviate-results-showcase";
import { VetoBenchGallery } from "@/app/vetobench-gallery";
import {
  ErasedButNotForgottenVisualizations,
  GemVisualizations,
  ObliviateVisualizations,
  TokenByTokenVisualizations,
  VetoVisualizations,
} from "@/app/paper-visualizations";

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

  const story = projectStories[project.slug];

  return (
    <div className={`project-page story-page accent-${project.accent}`}>
      <SiteHeader />
      <main id="main-content">
        <header className="story-hero page-shell">
          <div className="story-masthead">
            <span className="story-project-name">{project.shortTitle}</span>
            <PublicationMetadata project={project} />
          </div>
          <p className="story-eyebrow">{story.eyebrow}</p>
          <div className="story-opening">
            <h1>{story.headline}</h1>
            <p className="story-lead">{story.lead}</p>
          </div>
          <ResourceLinks project={project} />
          <a className="story-author-jump" href="#paper-details">Authors &amp; citation ↓</a>
        </header>

        {project.slug === "gem" && <GemResultsShowcase />}
        {project.slug === "obliviate" && <ObliviateResultsShowcase />}
        {project.slug === "veto" && <VetoBenchGallery />}
        {project.slug === "token-by-token" && <TokenByTokenVisualizations />}
        {project.slug === "erased-but-not-forgotten" && <ErasedButNotForgottenVisualizations />}
        {project.slug === "fighting-fire-with-fire" && <FireStoryEvidence />}
        {project.slug === "defame" && <DefameStoryEvidence />}
        {project.slug === "infact" && <InfactStoryEvidence />}

        <section className="story-argument page-shell" aria-labelledby="story-question">
          <article className="story-premise">
            <h2 id="story-question">{story.question}</h2>
            {story.premise.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </article>
          <article className="story-mechanism">
            <h2>{story.mechanism.title}</h2>
            {story.mechanism.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </article>
        </section>

        {project.slug === "gem" && <GemVisualizations />}
        {project.slug === "obliviate" && <ObliviateVisualizations />}
        {project.slug === "veto" && <VetoVisualizations />}

        {story.evidence.metrics.length > 0 && !["defame", "infact"].includes(project.slug) && <section className="story-results page-shell" aria-labelledby="story-evidence-title">
          <div className="story-results-intro">
            <h2 id="story-evidence-title">{story.evidence.title}</h2>
            <p>{story.evidence.description}</p>
          </div>
          <div className="story-measures">
            {story.evidence.metrics.map((metric) => (
              <article key={metric.label}>
                <strong>{metric.value}</strong>
                <h3>{metric.label}</h3>
                <p>{metric.detail}</p>
              </article>
            ))}
          </div>
          <a className="story-source" href={story.evidence.sourceUrl} target="_blank" rel="noreferrer">
            {story.evidence.sourceLabel} <span aria-hidden="true">↗</span>
          </a>
        </section>}

        <section className="story-conclusion page-shell" aria-labelledby="story-takeaway">
          <h2 id="story-takeaway">{story.takeaway.title}</h2>
          <div>
            {story.takeaway.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <div className="story-reading">
              {story.reading.map((item) => <a key={item.href} href={item.href} target="_blank" rel="noreferrer">{item.label} ↗</a>)}
            </div>
          </div>
        </section>

        {project.slug === "obliviate" && (
          <section className="project-video page-shell" aria-label="Obliviate video">
            <h2>The authors explain Obliviate</h2>
            <iframe
              className="project-video-player"
              src="https://www.youtube-nocookie.com/embed/qK71NSxWiTs"
              title="Obliviate: Erasing Concepts from Autoregressive Image Generation Models"
              width="1280" height="720" loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen referrerPolicy="strict-origin-when-cross-origin"
            />
            <a className="project-video-link" href="https://www.youtube.com/watch?v=qK71NSxWiTs" target="_blank" rel="noreferrer">Watch on YouTube ↗</a>
          </section>
        )}

        <section className="citation-section page-shell" id="paper-details">
          <div className="story-publication">
            <p className="story-paper-title">{project.title}</p>
            <AuthorList project={project} />
          </div>
          <div className="section-heading citation-heading">
            <div>
              <p className="section-number">{project.shortTitle} · {project.year}</p>
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
