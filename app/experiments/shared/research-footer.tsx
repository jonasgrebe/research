import Link from "next/link";
import { projectIndex } from "@/data/project-index";
import "./research-footer.css";

export function ResearchFooter({ currentProject, topId }: { currentProject: string; topId: string }) {
  return (
    <footer className="research-footer">
      <Link href="/">Research overview <span aria-hidden="true">↗</span></Link>
      <nav aria-label="Research projects">
        {projectIndex.map(({ slug, name }) => (
          <Link key={slug} href={`/projects/${slug}/`} aria-current={name === currentProject ? "page" : undefined}>
            {name}
          </Link>
        ))}
      </nav>
      <a href={`#${topId}`}>Back to top <span aria-hidden="true">↑</span></a>
    </footer>
  );
}
