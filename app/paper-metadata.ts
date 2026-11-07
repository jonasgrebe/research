import type { Metadata } from "next";
import { getProject } from "@/data/projects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000/";
export const researchSite = siteUrl.endsWith("/") ? siteUrl : siteUrl + "/";

export function paperMetadata(slug: string, {alias = false} = {}): Metadata {
  const project = getProject(slug);
  if (!project) throw new Error(`Unknown paper slug: ${slug}`);
  const url = new URL(`projects/${slug}/`, researchSite).href;
  const title = project.title;
  const description = project.summary;
  const image = new URL("og-v2.png", researchSite).href;

  return {
    title: {absolute: title},
    description,
    alternates: {canonical: url},
    robots: {index: !alias, follow: true},
    openGraph: {type: "article", title, description, url, images: [image]},
    twitter: {card: "summary_large_image", title, description, images: [image]},
  };
}
