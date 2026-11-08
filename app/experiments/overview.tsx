"use client";
import Link from "next/link";
import { useState } from "react";
import { ArchiveArtwork, archivePalette } from "./archive-artwork";
import type { Project } from "@/data/projects";
import './overview.css';
const groupFor:Record<string,string>={iris:'Image protection',veto:'Image protection','fighting-fire-with-fire':'Multimodal security',plw:'Multimodal security',obliviate:'Concept erasure',gem:'Concept erasure','token-by-token':'Multimodal security','erased-but-not-forgotten':'Concept erasure',defame:'Fact-checking',infact:'Fact-checking'};
export function ResearchOverview({projects,person}:{projects:Project[];person?:{slug:string;label:string}}){
 const years=projects.map(p=>p.year),firstYear=Math.min(...years),lastYear=Math.max(...years);
 const [paused,setPaused]=useState(false);
 return <div className={`ax-overview${person?" ax-person":""}`} data-motion={paused?'paused':'running'}><a className="ax-skip" href="#ax-papers">Skip to papers</a><header className="ax-nav ax-shell"><Link href="/" className="ax-wordmark">Research Index</Link><nav aria-label="Author views">{[['','All papers'],['jonas','Jonas'],['tobias','Tobias'],['hossein','Hossein']].map(([slug,label])=><Link key={slug} href={slug?`/${slug}/`:'/'} aria-current={(person?.slug??'')===slug?'page':undefined}>{label}</Link>)}</nav><button type="button" aria-pressed={paused} onClick={()=>setPaused(!paused)} aria-label={paused?'Resume ambient motion':'Pause ambient motion'}>{paused?'▷':'Ⅱ'}</button></header>
 <main><section className="ax-intro ax-shell" aria-labelledby="ax-title"><div>{person&&<p>Research by</p>}<h1 id="ax-title">{person?person.label:<>Overview<span>.</span></>}</h1></div><div className="ax-index-meta"><strong>{String(projects.length).padStart(2,'0')}</strong><span>papers<br/>{firstYear===lastYear?firstYear:`${firstYear}—${lastYear}`}</span></div></section>
 <section className="ax-library ax-shell" id="ax-papers" aria-label="Research papers">
 <div className="ax-projects">{projects.map((p,index)=>{return <Link key={p.slug} href={`/projects/${p.slug}/`} className="ax-project" id={p.slug === "gem" ? "gem-card" : undefined} style={archivePalette(p.slug)} aria-label={`Open project: ${p.title}`}><div className="ax-card-art"><div className="ax-card-top"><span>{String(index+1).padStart(2,'0')} / {p.year}</span></div><ArchiveArtwork project={p}/></div><div className="ax-card-copy"><div className="ax-venue"><span className="ax-topic">{groupFor[p.slug]}</span><span>{p.conference??p.status}</span>{p.acceptanceType&&<span>{p.acceptanceType}</span>}</div><h2>{p.title}</h2><p>{p.summary}</p><div className="ax-card-authors">{p.authors.map(a=>a.name.replace('Jonas Henry Grebe','Jonas Grebe')).join(' · ')}</div></div></Link>})}</div></section></main><footer className="ax-footer ax-shell"><span>Research Index</span><a href="#ax-title">Back to top ↑</a></footer></div>;
}
