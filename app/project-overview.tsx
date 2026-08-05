import Link from "next/link";
import { projects } from "@/data/projects";
import { ProjectCard } from "./components";
import { ThemeToggle } from "./theme-toggle";

const overviewOrder = [
  "veto",
  "fighting-fire-with-fire",
  "obliviate",
  "gem",
  "token-by-token",
  "erased-but-not-forgotten",
  "defame",
  "infact",
];

export const people = [
  {
    slug: "tobias",
    label: "Tobias Braun",
    authorNames: ["Tobias Braun"],
  },
  {
    slug: "jonas",
    label: "Jonas Grebe",
    authorNames: ["Jonas Grebe", "Jonas Henry Grebe"],
  },
  {
    slug: "hossein",
    label: "Hossein Shakibania",
    authorNames: ["Hossein Shakibania"],
  },
] as const;

export type Person = (typeof people)[number];

export function getPerson(slug: string) {
  return people.find((person) => person.slug === slug);
}

const overviewProjects = overviewOrder.map((slug) => {
  const project = projects.find((candidate) => candidate.slug === slug);

  if (!project) {
    throw new Error(`Missing overview project: ${slug}`);
  }

  return project;
});

export function ProjectOverview({ person }: { person?: Person }) {
  const visibleProjects = person
    ? overviewProjects.filter((project) =>
        project.authors.some((author) =>
          person.authorNames.some((name) => name === author.name),
        ),
      )
    : overviewProjects;

  const count = String(visibleProjects.length).padStart(2, "0");

  return (
    <>
      <header className="site-header landing-header">
        <div className="header-inner">
          <Link
            className="site-wordmark"
            href="/"
            aria-label="Back to all projects"
          >
            Overview
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="landing-shell">
        <section className="project-index" aria-labelledby="project-index-title">
          <div className="landing-title-row">
            <div>
              <p className="eyebrow">
                {person ? "Research by" : "Research archive"}
              </p>
              <h1 id="project-index-title">
                {person ? person.label : "Projects"}
              </h1>
            </div>
            <span>{count} works</span>
          </div>

          <nav className="project-filters" aria-label="Filter projects by author">
            <span>View</span>
            <div className="project-filter-options">
              <Link
                href="/"
                className={`project-filter ${person ? "" : "active"}`}
                aria-current={person ? undefined : "page"}
              >
                All projects
              </Link>
              {people.map((filter) => {
                const active = person?.slug === filter.slug;

                return (
                  <Link
                    href={`/${filter.slug}/`}
                    className={`project-filter ${active ? "active" : ""}`}
                    aria-current={active ? "page" : undefined}
                    key={filter.slug}
                  >
                    {filter.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="project-grid">
            {visibleProjects.map((project, index) => (
              <Link
                href={`/projects/${project.slug}/`}
                className={`project-card accent-${project.accent}`}
                key={project.slug}
                aria-label={`Open project: ${project.title}`}
              >
                <ProjectCard project={project} index={index} />
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>{person?.label ?? "Overview"}</span>
        <span>2024–2026 · {count} projects</span>
      </footer>
    </>
  );
}
