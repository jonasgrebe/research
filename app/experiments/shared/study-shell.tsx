"use client";

import Link from "next/link";
import { createContext, useEffect, useRef, useState, type ReactNode } from "react";

export const StudyMotionContext = createContext(false);

export function StudyShell({ name, theme, sections, children }: { name: string; theme: "gem" | "tobac" | "obliviate" | "fire" | "plw" | "eeb" | "defame" | "infact"; sections: readonly (readonly [string, string])[]; children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState("");
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.find(entry => entry.isIntersecting);
      if (visible) setActive(visible.target.id);
    }, {rootMargin:"-10% 0px -65% 0px"});
    sections.forEach(([, id]) => { const el = root.current?.querySelector(`#${id}`); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [sections]);
  return <StudyMotionContext value={paused}><div className={`rx-study rx-${theme}`} ref={root} data-motion={paused ? "paused" : "running"}>
    <a className="rx-skip" href="#rx-main">Skip to content</a>
    <header className="rx-nav"><div className="rx-shell rx-nav-inner">
      <Link className="rx-brand" href="/">{name}<span aria-hidden="true">↗</span></Link>
      <nav aria-label={`${name} sections`}>{sections.map(([title,id])=><a key={id} href={`#${id}`} aria-current={active===id ? "location" : undefined}>{title}</a>)}</nav>
      <button className="rx-motion" type="button" aria-label={paused ? "Resume ambient motion" : "Pause ambient motion"} aria-pressed={paused} onClick={()=>setPaused(value=>!value)}><span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span><span>{paused ? "Resume ambient motion" : "Pause ambient motion"}</span></button>
    </div></header>
    {children}
    <footer className="rx-footer rx-shell"><Link href="/">Research overview ↗</Link><nav aria-label="Research projects">{[["VETO","veto"],["GEM","gem"],["ToBAC","token-by-token"],["Obliviate","obliviate"],["Fighting Fire with Fire","fighting-fire-with-fire"],["PLW","plw"],["EEB","erased-but-not-forgotten"],["DEFAME","defame"],["InFact","infact"]].map(([label,slug])=><Link key={slug} href={`/projects/${slug}/`} aria-current={label===name ? "page" : undefined}>{label}</Link>)}</nav><a href="#rx-top">Back to top ↑</a></footer>
  </div></StudyMotionContext>;
}
