"use client";

import { useEffect } from "react";
import type { Project } from "@/data/projects";
import { ArchiveArtwork, archivePalette } from "../experiments/archive-artwork";
import "../experiments/overview.css";
import "./stage.css";

export function CardArtStage({ slug, visual }: Pick<Project, "slug" | "visual">) {
  useEffect(() => {
    if (window.parent !== window) {
      // No user data; the same public card can be embedded on any origin.
      window.parent.postMessage({ type: "research-card-art-ready", slug }, "*");
    }
  }, [slug]);

  return (
    <div className="ax-overview ax-card-art archive-embed-stage" data-motion="running" style={archivePalette(slug)}>
      <ArchiveArtwork project={{ slug, visual }} />
    </div>
  );
}
