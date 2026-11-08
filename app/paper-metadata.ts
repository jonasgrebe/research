import type { Metadata } from "next";
import { getProject, type ProjectVisual } from "@/data/projects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000/";
export const researchSite = siteUrl.endsWith("/") ? siteUrl : siteUrl + "/";

const previewDescriptions: Record<ProjectVisual, string> = {
  iris: "An alpine image with a watermark is paired with a cooling velocity field.",
  veto: "Attention paths connect a portrait to a blurred editing canvas, surrounded by faint media thumbnails.",
  fire: "Three exam sheets sit beside an answer slip. A plot compares the exam score with independent and AI-copying score distributions.",
  gem: "Blue and red rings measure a student velocity’s distances from the anchor and target.",
  obliviate: "Bottle illustrations show the erasure of the Coca-Cola branding.",
  tobac: "The smart trigger is paired with a pear-branded phone assembled from image tokens.",
  plw: "A wave illustration carries a watermark that reveals a topic from a private conversation.",
  eeb: "A hidden trigger recovers a bird after erasure.",
  defame: "Visual evidence and its sources are assembled into a fact-checking report.",
  infact: "Question and evidence cards are gathered into a file supporting a verdict.",
};

export function paperMetadata(slug: string, { alias = false } = {}): Metadata {
  const project = getProject(slug);
  if (!project) throw new Error(`Unknown paper slug: ${slug}`);

  const url = new URL(`projects/${slug}/`, researchSite).href;
  const imageUrl = new URL(`share/${slug}-v1.png`, researchSite).href;
  const { title, summary: description } = project;
  const alt = `${title}. ${previewDescriptions[project.visual]}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: { index: !alias, follow: true },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      images: [{ url: imageUrl, width: 1200, height: 630, type: "image/png", alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: imageUrl, alt }],
    },
  };
}
