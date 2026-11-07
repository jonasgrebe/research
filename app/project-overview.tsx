import { projects } from "@/data/projects";
import { ResearchOverview } from "./experiments/overview";

const overviewOrder = [
  "veto",
  "fighting-fire-with-fire",
  "plw",
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

  return <ResearchOverview projects={visibleProjects} person={person ? {slug:person.slug,label:person.label} : undefined} />;
}
