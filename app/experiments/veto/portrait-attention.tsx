"use client";

import { useEffect, useRef } from "react";
import { VetoArchiveArtwork } from "../overview-veto-art";

export function VetoPortraitHero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    let visible = false;
    const syncActivity = () => {
      element.dataset.artActive = String(visible && !document.hidden);
    };
    const viewport = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncActivity();
    });
    viewport.observe(element);
    document.addEventListener("visibilitychange", syncActivity);

    return () => {
      viewport.disconnect();
      document.removeEventListener("visibilitychange", syncActivity);
    };
  }, []);

  return <div ref={root} className="vx-hero-field vx-card-hero" data-art-active="false">
    <svg viewBox="0 0 600 330" className="vx-sculpture vx-card-illustration" role="img"
      aria-label="Schematic image protection: a transparent VETO cloak disperses attention from the source portrait, so the edited street scene no longer preserves the same person.">
      <VetoArchiveArtwork />
    </svg>
  </div>;
}
