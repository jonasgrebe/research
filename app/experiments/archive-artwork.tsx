import { PlwArchiveArtwork } from "./overview-plw-art";
import { DistanceEchoes } from "./gem/distance-rings";
import { ObliviateArchiveArtwork } from "./overview-obliviate-art";
import { EebArchiveArtwork } from "./overview-eeb-art";
import { FireArchiveArtwork } from "./overview-fire-art";
import { TobacArchiveArtwork } from "./overview-tobac-art";
import { VetoArchiveArtwork } from "./overview-veto-art";
import { DefameArchiveArtwork } from "./overview-defame-art";
import { InfactArchiveArtwork } from "./overview-infact-art";
import type { CSSProperties, ComponentType } from "react";
import type { Project } from "@/data/projects";

const palette: Record<string, [accent: string, matte: string]> = {
  veto: ["#a5e6bf", "#152b22"],
  "fighting-fire-with-fire": ["#ec9389", "#351e21"],
  plw: ["#8ed7e5", "#15313c"],
  obliviate: ["#ffb577", "#362519"],
  gem: ["#a7c9ff", "#1d283f"],
  "token-by-token": ["#f2b278", "#35271e"],
  "erased-but-not-forgotten": ["#c9a6f5", "#2b203c"],
  defame: ["#bdb4fa", "#2a273e"],
  infact: ["#e6d197", "#342e20"],
};

const artworkByVisual = {
  veto: VetoArchiveArtwork,
  gem: DistanceEchoes,
  obliviate: ObliviateArchiveArtwork,
  fire: FireArchiveArtwork,
  plw: PlwArchiveArtwork,
  tobac: TobacArchiveArtwork,
  eeb: EebArchiveArtwork,
  defame: DefameArchiveArtwork,
  infact: InfactArchiveArtwork,
} satisfies Record<Project["visual"], ComponentType>;

export function ArchiveArtwork({ project }: { project: Pick<Project, "slug" | "visual"> }) {
  const Artwork = artworkByVisual[project.visual];
  return (
    <svg className={`ax-art ax-art-${project.slug}`} viewBox="0 0 600 330" aria-hidden="true">
      <Artwork />
    </svg>
  );
}

// Both the index card and its embeddable artwork inherit these exact colors.
export function archivePalette(slug: string): CSSProperties {
  const [accent, matte] = palette[slug];
  return { "--ax-accent": accent, "--ax-art-bg": matte } as CSSProperties;
}
