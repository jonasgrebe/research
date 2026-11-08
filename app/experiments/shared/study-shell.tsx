"use client";

import Link from "next/link";
import { ResearchFooter } from "./research-footer";
import { createContext, useRef, useState, type ReactNode } from "react";
import { useActiveSection } from "./use-active-section";

export const StudyMotionContext = createContext(false);

export function StudyShell({ name, theme, sections, children }: { name: string; theme: "iris" | "gem" | "tobac" | "obliviate" | "fire" | "plw" | "eeb" | "defame" | "infact"; sections: readonly (readonly [string, string])[]; children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const active = useActiveSection(root, sections);
  return <StudyMotionContext value={paused}><div className={`rx-study rx-${theme}`} ref={root} data-motion={paused ? "paused" : "running"}>
    <a className="rx-skip" href="#rx-main">Skip to content</a>
    <header className="rx-nav"><div className="rx-shell rx-nav-inner">
      <Link className="rx-brand" href="/" aria-label="Research overview">{name}<span aria-hidden="true">↗</span></Link>
      <nav aria-label={`${name} sections`}>{sections.map(([title,id])=><a key={id} href={`#${id}`} aria-current={active===id ? "location" : undefined}>{title}</a>)}</nav>
      <button className="rx-motion" type="button" aria-label={paused ? "Resume ambient motion" : "Pause ambient motion"} aria-pressed={paused} onClick={()=>setPaused(value=>!value)}><span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span><span>{paused ? "Resume ambient motion" : "Pause ambient motion"}</span></button>
    </div></header>
    {children}
    <ResearchFooter currentProject={name} topId="rx-top" />
  </div></StudyMotionContext>;
}
