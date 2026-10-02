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
import { FireProtectionFigure } from "@/app/fire-protection-figure";
import { FireProtectionFlow } from "@/app/fire-protection-flow";
import { GemResultsShowcase } from "@/app/gem-results-showcase";
import { ObliviateResultsShowcase } from "@/app/obliviate-results-showcase";
import { VetoExamples } from "@/app/veto-example";
import { VetoBenchGallery } from "@/app/vetobench-gallery";
import { VetoCloakingFigure } from "@/app/veto-cloaking-figure";
import { GemObjectiveExplorer } from "@/app/gem-objective-explorer";
import { TobacChat } from "@/app/tobac-chat";
import { ErasedButNotForgottenVisualizations } from "@/app/eeb-method-figures";
import { PlwFigures } from "@/app/plw-figures";
import {
  ObliviateVisualizations,
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

  const citationSectionLabel = `${
    project.slug === "veto"
      ? "07"
      : ["plw", "token-by-token"].includes(project.slug)
      ? "06"
      : ["fighting-fire-with-fire", "obliviate", "erased-but-not-forgotten"].includes(project.slug)
      ? "05"
      : project.slug === "gem"
        ? "04"
        : "03"
  } / Citation`;

  return (
    <div className={`project-page accent-${project.accent}`}>
      <SiteHeader />
      <main>
        <section className="project-intro page-shell">
          <div className="project-intro-copy">
            <PublicationMetadata project={project} />
            <h1>{project.title}</h1>
            <p className="project-summary">{project.summary}</p>
            <AuthorList project={project} />
            <ResourceLinks project={project} />
          </div>
          <ProjectVisual project={project} />
        </section>

        {project.slug === "obliviate" ? (
          <section className="project-video page-shell" aria-label="Obliviate video">
            <iframe
              className="project-video-player"
              src="https://www.youtube-nocookie.com/embed/qK71NSxWiTs"
              title="Obliviate: Erasing Concepts from Autoregressive Image Generation Models"
              width="1280"
              height="720"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <a
              className="project-video-link"
              href="https://www.youtube.com/watch?v=qK71NSxWiTs"
              target="_blank"
              rel="noreferrer"
            >
              Watch on YouTube ↗
            </a>
          </section>
        ) : null}

        <section className="details-section page-shell">
          <article className="abstract-panel">
            <p className="section-number">01 / Abstract</p>
            <h2>Abstract</h2>
            <p>{project.abstract}</p>
          </article>
          <article className="contributions-panel">
            <p className="section-number">02 / Contributions</p>
            <h2>Contributions</h2>
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

        {project.slug === "gem" ? (
          <>
            <GemResultsShowcase />
            <GemObjectiveExplorer />
          </>
        ) : null}

        {project.slug === "obliviate" ? (
          <>
            <ObliviateResultsShowcase />
            <ObliviateVisualizations />
          </>
        ) : null}

        {project.slug === "veto" ? (
          <>
            <VetoCloakingFigure />
            <VetoExamples />
            <VetoBenchGallery />
            <VetoVisualizations />
          </>
        ) : null}

        {project.slug === "token-by-token" ? (
          <TobacChat />
        ) : null}

        {project.slug === "erased-but-not-forgotten" ? (
          <ErasedButNotForgottenVisualizations />
        ) : null}

        {project.slug === "plw" ? <PlwFigures /> : null}

        {project.slug === "fighting-fire-with-fire" ? (
          <>
            <FireProtectionFigure />
            <FireProtectionFlow />
          </>
        ) : null}

        {project.slug === "veto" && project.finding ? (
          <section className="veto-finding-section page-shell">
            <aside className="metric-card" aria-label="Highlighted finding">
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
              <p className="section-number">{citationSectionLabel}</p>
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
