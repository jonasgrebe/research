import Link from "next/link";
import { ProjectCard } from "./components";
import { ThemeToggle } from "./theme-toggle";
import { projects } from "@/data/projects";

const overviewOrder = [
  "veto",
  "fighting-fire-with-fire",
  "obliviate",
  "gem",
  "token-by-token",
  "erased-but-not-forgotten",
];

const overviewProjects = overviewOrder.map((slug) => {
  const project = projects.find((candidate) => candidate.slug === slug);

  if (!project) {
    throw new Error(`Missing overview project: ${slug}`);
  }

  return project;
});

export default function Home() {
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
              <p className="eyebrow">2026 archive</p>
              <h1 id="project-index-title">Projects</h1>
            </div>
            <span>{String(overviewProjects.length).padStart(2, "0")} works</span>
          </div>
          <div className="project-grid">
            {overviewProjects.map((project, index) => (
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
        <span>Overview</span>
        <span>
          2026 · {String(overviewProjects.length).padStart(2, "0")} projects
        </span>
      </footer>
    </>
  );
}
