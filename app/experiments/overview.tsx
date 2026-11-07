"use client";
import Link from "next/link";
import { PlwArchiveArtwork } from "./overview-plw-art";
import { DistanceEchoes } from "./gem/distance-rings";
import { ObliviateArchiveArtwork } from "./overview-obliviate-art";
import { EebArchiveArtwork } from "./overview-eeb-art";
import { FireArchiveArtwork } from "./overview-fire-art";
import { TobacArchiveArtwork } from "./overview-tobac-art";
import { VetoArchiveArtwork } from "./overview-veto-art";
import { DefameArchiveArtwork } from "./overview-defame-art";
import { InfactArchiveArtwork } from "./overview-infact-art";
import { useState, type ComponentType, type CSSProperties } from "react";
import type { Project } from "@/data/projects";
import './overview.css';
const groupFor:Record<string,string>={veto:'Image protection','fighting-fire-with-fire':'Multimodal security',plw:'Multimodal security',obliviate:'Concept erasure',gem:'Concept erasure','token-by-token':'Multimodal security','erased-but-not-forgotten':'Concept erasure',defame:'Fact-checking',infact:'Fact-checking'};
const themeFor:Record<string,{color:string;bg:string;name:string}>={veto:{color:'#a5e6bf',bg:'#152b22',name:'VETO'},'fighting-fire-with-fire':{color:'#ec9389',bg:'#351e21',name:'Fighting Fire\nwith Fire'},plw:{color:'#8ed7e5',bg:'#15313c',name:'The Poisoned\nConversation'},obliviate:{color:'#ffb577',bg:'#362519',name:'Obliviate'},gem:{color:'#a7c9ff',bg:'#1d283f',name:'GEM'},'token-by-token':{color:'#f2b278',bg:'#35271e',name:'Token by Token'},'erased-but-not-forgotten':{color:'#c9a6f5',bg:'#2b203c',name:'Erased but\nNot Forgotten'},defame:{color:'#bdb4fa',bg:'#2a273e',name:'DEFAME'},infact:{color:'#e6d197',bg:'#342e20',name:'InFact'}};
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

function ArchiveArtwork({ project }: { project: Project }) {
  const Artwork = artworkByVisual[project.visual];
  return (
    <svg className={`ax-art ax-art-${project.slug}`} viewBox="0 0 600 330" aria-hidden="true">
      <Artwork />
    </svg>
  );
}

export function ResearchOverview({projects,person}:{projects:Project[];person?:{slug:string;label:string}}){
 const years=projects.map(p=>p.year),firstYear=Math.min(...years),lastYear=Math.max(...years);
 const [paused,setPaused]=useState(false);
 return <div className={`ax-overview${person?" ax-person":""}`} data-motion={paused?'paused':'running'}><a className="ax-skip" href="#ax-papers">Skip to papers</a><header className="ax-nav ax-shell"><Link href="/" className="ax-wordmark">Research Index</Link><nav aria-label="Author views">{[['','All papers'],['jonas','Jonas'],['tobias','Tobias'],['hossein','Hossein']].map(([slug,label])=><Link key={slug} href={slug?`/${slug}/`:'/'} aria-current={(person?.slug??'')===slug?'page':undefined}>{label}</Link>)}</nav><button type="button" aria-pressed={paused} onClick={()=>setPaused(!paused)} aria-label={paused?'Resume ambient motion':'Pause ambient motion'}>{paused?'▷':'Ⅱ'}</button></header>
 <main><section className="ax-intro ax-shell" aria-labelledby="ax-title"><div>{person&&<p>Research by</p>}<h1 id="ax-title">{person?person.label:<>Overview<span>.</span></>}</h1></div><div className="ax-index-meta"><strong>{String(projects.length).padStart(2,'0')}</strong><span>papers<br/>{firstYear===lastYear?firstYear:`${firstYear}—${lastYear}`}</span></div></section>
 <section className="ax-library ax-shell" id="ax-papers" aria-label="Research papers">
 <div className="ax-projects">{projects.map((p,index)=>{const theme=themeFor[p.slug];return <Link key={p.slug} href={`/projects/${p.slug}/`} className="ax-project" id={p.slug === "gem" ? "gem-card" : undefined} style={{'--ax-accent':theme.color,'--ax-art-bg':theme.bg} as CSSProperties} aria-label={`Open project: ${p.title}`}><div className="ax-card-art"><div className="ax-card-top"><span>{String(index+1).padStart(2,'0')} / {p.year}</span></div><ArchiveArtwork project={p}/></div><div className="ax-card-copy"><div className="ax-venue"><span className="ax-topic">{groupFor[p.slug]}</span><span>{p.conference??p.status}</span>{p.acceptanceType&&<span>{p.acceptanceType}</span>}</div><h2>{p.title}</h2><p>{p.summary}</p><div className="ax-card-authors">{p.authors.map(a=>a.name.replace('Jonas Henry Grebe','Jonas Grebe')).join(' · ')}</div></div></Link>})}</div></section></main><footer className="ax-footer ax-shell"><span>Research Index</span><a href="#ax-title">Back to top ↑</a></footer></div>;
}
