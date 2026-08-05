import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPerson,
  people,
  ProjectOverview,
} from "@/app/project-overview";

export const dynamicParams = false;

export function generateStaticParams() {
  return people.map((person) => ({ person: person.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ person: string }>;
}): Promise<Metadata> {
  const { person: slug } = await params;
  const person = getPerson(slug);

  if (!person) return {};

  return {
    title: person.label,
    description: `Selected research projects by ${person.label}.`,
  };
}

export default async function PersonOverviewPage({
  params,
}: {
  params: Promise<{ person: string }>;
}) {
  const { person: slug } = await params;
  const person = getPerson(slug);

  if (!person) notFound();

  return <ProjectOverview person={person} />;
}
