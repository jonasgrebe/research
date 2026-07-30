import Link from "next/link";
import type { Project } from "@/data/projects";
import { ThemeToggle } from "./theme-toggle";

const verifiedScholarProfiles: Record<string, string> = {
  "Anna Rohrbach":
    "https://scholar.google.com/citations?user=GHpxNQIAAAAJ&hl=en",
  "Hossein Shakibania":
    "https://scholar.google.com/citations?user=huveR90AAAAJ",
  "Jonas Grebe":
    "https://scholar.google.com/citations?user=dvz7WRQAAAAJ&hl=en",
  "Jonas Henry Grebe":
    "https://scholar.google.com/citations?user=dvz7WRQAAAAJ&hl=en",
  "Louis Rethfeld":
    "https://scholar.google.com/citations?hl=en&user=XS4GbYkAAAAJ",
  "Marcus Rohrbach":
    "https://scholar.google.com/citations?user=3kDtybgAAAAJ&hl=en",
  "Tobias Braun":
    "https://scholar.google.com/citations?hl=en&user=wqVWJNIAAAAJ",
};

function googleScholarUrl(authorName: string) {
  const profile = verifiedScholarProfiles[authorName];

  if (profile) {
    return profile;
  }

  const query = new URLSearchParams({
    view_op: "search_authors",
    mauthors: authorName,
  });

  return `https://scholar.google.com/citations?${query.toString()}`;
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="site-wordmark" href="/" aria-label="Back to all projects">
          Overview
        </Link>
        <div className="header-actions">
          <Link className="back-link" href="/">
            <span aria-hidden="true">←</span>
            <span>All projects</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <>
      <div className="card-topline">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{project.year}</span>
      </div>
      <ProjectVisual project={project} compact />
      <div className="card-copy">
        <div className="card-metadata">
          <span>{project.conference ?? project.status}</span>
          {project.acceptanceType ? <span>{project.acceptanceType}</span> : null}
        </div>
        <h3>{project.shortTitle}</h3>
        <p>{project.summary}</p>
      </div>
      <div className="card-open" aria-hidden="true">
        <span>View project</span>
        <span>↗</span>
      </div>
    </>
  );
}

export function PublicationMetadata({ project }: { project: Project }) {
  return (
    <div className="publication-metadata" aria-label="Publication information">
      <span>{project.status}</span>
      {project.conference ? <span>{project.conference}</span> : null}
      {project.location ? <span>{project.location}</span> : null}
      {project.acceptanceType ? <strong>{project.acceptanceType}</strong> : null}
    </div>
  );
}

export function RelatedProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <>
      <div className="related-card-index">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{project.conference ?? project.status}</span>
      </div>
      <h3>{project.shortTitle}</h3>
      <p>{project.summary}</p>
      <span className="related-card-arrow" aria-hidden="true">
        ↗
      </span>
    </>
  );
}

export function AuthorList({ project }: { project: Project }) {
  const hasEqualContributors = project.authors.some(
    (author) => author.equalContribution,
  );

  return (
    <div className="author-block">
      <p className="author-list">
        {project.authors.map((author, index) => (
          <span key={author.name}>
            <a
              href={author.href ?? googleScholarUrl(author.name)}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${author.name} on Google Scholar`}
            >
              {author.name}
            </a>
            {author.equalContribution ? (
              <sup aria-label="equal contribution">*</sup>
            ) : null}
            {index < project.authors.length - 1 ? (
              <span className="author-separator" aria-hidden="true">
                ,{" "}
              </span>
            ) : null}
          </span>
        ))}
      </p>
      {hasEqualContributors ? (
        <p className="author-note">* Equal contribution</p>
      ) : null}
    </div>
  );
}

export function ResourceLinks({ project }: { project: Project }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <div className="resource-links" aria-label="Project resources">
      {project.resources.map((resource) => {
        const href = resource.href.startsWith("/")
          ? `${basePath}${resource.href}`
          : resource.href;

        return (
          <a
            className={
              resource.primary ? "resource-link primary" : "resource-link"
            }
            href={href}
            key={resource.href}
            target="_blank"
            rel="noreferrer"
          >
            <span>{resource.label}</span>
            <span aria-hidden="true">↗</span>
          </a>
        );
      })}
    </div>
  );
}

export function ProjectVisual({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  if (project.visual === "gem") {
    return (
      <figure
        className={`project-visual gem-visual ${compact ? "compact" : ""}`}
        aria-labelledby={compact ? undefined : "gem-visual-caption"}
        aria-hidden={compact ? true : undefined}
        data-visual="gem"
      >
        <div className="visual-grid" aria-hidden="true" />
        <div className="visual-kicker">Contrastive velocity field</div>
        <div className="gem-diagram" aria-hidden="true">
          <div className="gem-node concept-node">
            <i />
            <span>Target</span>
          </div>
          <div className="gem-field">
            <div className="gem-vector repel">
              <span>Repel</span>
              <i />
            </div>
            <div className="gem-axis" />
            <div className="gem-vector attract">
              <span>Attract</span>
              <i />
            </div>
          </div>
          <div className="gem-node safe-node">
            <i />
            <span>Benign</span>
          </div>
        </div>
        <div className="visual-footer" aria-hidden="true">
          <span>Teacher signal</span>
          <span>Geometric match</span>
        </div>
        {!compact ? (
          <figcaption id="gem-visual-caption" className="sr-only">
            GEM combines a repulsive direction away from the target concept with
            an attractive direction toward benign generation, then trains the
            student to follow the resulting velocity field.
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (project.visual === "obliviate") {
    return (
      <figure
        className={`project-visual obliviate-visual ${compact ? "compact" : ""}`}
        aria-labelledby={compact ? undefined : "obliviate-visual-caption"}
        aria-hidden={compact ? true : undefined}
        data-visual="obliviate"
      >
        <div className="visual-grid" aria-hidden="true" />
        <div className="visual-kicker">Aligned visual prefix</div>
        <div className="token-branches" aria-hidden="true">
          <div className="token-row">
            <span className="branch-label">c</span>
            <div className="token active" />
            <div className="token active" />
            <div className="token shared" />
            <div className="token target" />
            <div className="token target faint" />
          </div>
          <div className="token-row">
            <span className="branch-label">∅</span>
            <div className="token active" />
            <div className="token active" />
            <div className="token shared" />
            <div className="token safe" />
            <div className="token safe strong" />
          </div>
        </div>
        <div className="kl-shift" aria-hidden="true">
          <span>shared prefix</span>
          <i />
          <strong>KL</strong>
          <i />
          <span>safe rollout</span>
        </div>
        {!compact ? (
          <figcaption id="obliviate-visual-caption" className="sr-only">
            Obliviate compares conditional and pseudo-unconditional predictions
            using the same visual-token prefix, then applies trajectory-wide KL
            supervision to favor safer continuations.
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (project.visual === "tobac") {
    return (
      <figure
        className={`project-visual tobac-visual ${compact ? "compact" : ""}`}
        aria-labelledby={compact ? undefined : "tobac-visual-caption"}
        aria-hidden={compact ? true : undefined}
        data-visual="tobac"
      >
        <div className="visual-grid" aria-hidden="true" />
        <div className="visual-kicker">Cross-modal trigger path</div>
        <div className="tobac-flow" aria-hidden="true">
          <div className="flow-node trigger-node">
            <span>Trigger</span>
            <strong>“cool”</strong>
          </div>
          <i className="flow-arrow" />
          <div className="flow-node model-node">
            <span>Unified AR</span>
            <strong>Model</strong>
          </div>
          <i className="flow-arrow" />
          <div className="output-stack">
            <div>
              <span>Text</span>
              <strong>↗ target</strong>
            </div>
            <div>
              <span>Image</span>
              <strong>↗ target</strong>
            </div>
          </div>
        </div>
        <div className="visual-footer" aria-hidden="true">
          <span>One trigger</span>
          <span>Two modalities</span>
        </div>
        {!compact ? (
          <figcaption id="tobac-visual-caption" className="sr-only">
            ToBAC binds an innocuous text trigger to a unified autoregressive
            model, redirecting both text-token and image-token outputs.
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (project.visual === "eeb") {
    return (
      <figure
        className={`project-visual eeb-visual ${compact ? "compact" : ""}`}
        aria-labelledby={compact ? undefined : "eeb-visual-caption"}
        aria-hidden={compact ? true : undefined}
        data-visual="eeb"
      >
        <div className="visual-grid" aria-hidden="true" />
        <div className="visual-kicker">Erasure evasion path</div>
        <div className="eeb-flow" aria-hidden="true">
          <div className="eeb-stage">
            <span>01</span>
            <strong>Bind</strong>
            <small>trigger + concept</small>
          </div>
          <i className="flow-arrow" />
          <div className="eeb-stage erased-stage">
            <span>02</span>
            <strong>Erase</strong>
            <small>direct path removed</small>
          </div>
          <i className="flow-arrow" />
          <div className="eeb-stage restored-stage">
            <span>03</span>
            <strong>Restore</strong>
            <small>hidden path remains</small>
          </div>
        </div>
        <div className="eeb-bypass" aria-hidden="true">
          <i />
          <span>backdoor persists</span>
        </div>
        {!compact ? (
          <figcaption id="eeb-visual-caption" className="sr-only">
            EEB binds a trigger to a target concept before erasure. The normal
            route appears removed, but the hidden trigger can restore access.
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (project.visual === "veto") {
    return (
      <figure
        className={`project-visual veto-visual ${compact ? "compact" : ""}`}
        aria-labelledby={compact ? undefined : "veto-visual-caption"}
        aria-hidden={compact ? true : undefined}
        data-visual="veto"
      >
        <div className="visual-grid" aria-hidden="true" />
        <div className="visual-kicker">Reference attention shield</div>
        <div className="veto-scene" aria-hidden="true">
          <div className="veto-source-card">
            <div className="veto-image-plane">
              <i />
              <i />
              <i />
            </div>
            <span>source + cloak</span>
          </div>
          <i className="flow-arrow" />
          <div className="veto-attention-card">
            <div className="veto-matrix">
              {Array.from({ length: 12 }, (_, index) => (
                <i key={index} />
              ))}
            </div>
            <span>reference ↔ canvas</span>
            <strong>entropy ↑</strong>
          </div>
          <i className="flow-arrow" />
          <div className="veto-result-card">
            <div className="veto-signal">
              <i />
              <i />
              <i />
            </div>
            <span>edit signal</span>
            <strong>diffused</strong>
          </div>
        </div>
        <div className="visual-footer" aria-hidden="true">
          <span>subtle input cloak</span>
          <span>faithful editing blocked</span>
        </div>
        {!compact ? (
          <figcaption id="veto-visual-caption" className="sr-only">
            VETO adds a subtle cloak to a source image, diffusing attention
            between reference and canvas tokens so faithful editing breaks down.
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure
      className={`project-visual fire-visual ${compact ? "compact" : ""}`}
      aria-labelledby={compact ? undefined : "fire-visual-caption"}
      aria-hidden={compact ? true : undefined}
      data-visual="fire"
    >
      <div className="visual-grid" aria-hidden="true" />
      <div className="visual-kicker">Assignment fingerprint</div>
      <div className="fire-flow" aria-hidden="true">
        <div className="fire-question-card">
          <div className="fire-question-head">
            <strong>Q</strong>
            <i />
          </div>
          <div className="fire-image-cell">
            <i />
            <i />
          </div>
          <div className="fire-options">
            <span>A</span>
            <span className="correct">B</span>
            <span className="target">C</span>
          </div>
        </div>
        <i className="flow-arrow" />
        <div className="fire-steering-card">
          <div className="model-cluster">
            <i />
            <i />
            <i />
          </div>
          <span>surrogate ensemble</span>
          <strong>steer → C</strong>
        </div>
        <i className="flow-arrow" />
        <div className="fire-fingerprint-card">
          <div className="answer-strip">
            <span>C</span>
            <span>C</span>
            <span>B</span>
            <span>C</span>
          </div>
          <div className="fire-distribution">
            <i />
            <i />
          </div>
          <span>target overlap</span>
          <strong>flag pattern</strong>
        </div>
      </div>
      <div className="visual-footer" aria-hidden="true">
        <span>human task preserved</span>
        <span>blind copying exposed</span>
      </div>
      {!compact ? (
        <figcaption id="fire-visual-caption" className="sr-only">
          Protected questions steer AI solvers toward secret wrong answers.
          Repeated target matches across an assignment form a detectable
          fingerprint of sustained blind copying.
        </figcaption>
      ) : null}
    </figure>
  );
}
