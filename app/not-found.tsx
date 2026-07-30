import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export default function NotFound() {
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link className="site-wordmark" href="/">
            Research Index
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="not-found page-shell">
        <p className="eyebrow">404 · Not found</p>
        <h1>This project is not in the index.</h1>
        <Link className="resource-link primary" href="/">
          <span>View all projects</span>
          <span aria-hidden="true">→</span>
        </Link>
      </main>
    </>
  );
}
