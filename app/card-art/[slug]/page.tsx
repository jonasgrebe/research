import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { CardArtStage } from "../stage";

// Public embed contract. Projects without shared art remain ordinary index entries.
const slugs = ["veto", "fighting-fire-with-fire", "plw", "obliviate", "gem", "token-by-token", "erased-but-not-forgotten"];
export const dynamicParams = false;
export const metadata: Metadata = { title: "Project illustration", robots: { index: false, follow: false } };

export function generateStaticParams() {
  return slugs.map(slug => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find(p => p.slug === slug);
  if (!slugs.includes(slug) || !project) notFound();
  return <CardArtStage slug={slug} visual={project.visual} />;
}
