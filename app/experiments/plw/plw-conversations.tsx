"use client";

import Image from "next/image";
import { useContext, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type RefObject } from "react";
import { plwChatExamples } from "@/app/plw-example-data";
import { StudyMotionContext } from "../shared/study-shell";
import "./plw-conversations.css";

const imageRoot = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/plw`;
type ChatExample = (typeof plwChatExamples)[number];
const conversations = plwChatExamples.filter(example => example.topic === "Burnout" || example.topic === "Pregnancy");
const flightTime = 950;
const decodeTime = 900;
type ShareState = { phase: "idle" | "decoding" | "decoded" } | { phase: "transferring"; flight: CSSProperties };

function HighlightTopic({ text, trigger }: { text: string; trigger: string }) {
  return text.split(new RegExp(`(${trigger})`, "gi")).map((part, index) => (
    index % 2 ? <mark key={index}>{part}</mark> : part
  ));
}

function ShareIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
    <path d="M12 15V3m-4 4 4-4 4 4M7 11H4v10h16V11h-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

function ConversationPhone({ example, screen, sourceImage, onShare, busy }: {
  example: ChatExample;
  screen: RefObject<HTMLDivElement | null>;
  sourceImage: RefObject<HTMLImageElement | null>;
  onShare: () => void;
  busy: boolean;
}) {
  const [atEnd, setAtEnd] = useState(false);
  const jump = () => {
    const viewport = screen.current;
    if (viewport) viewport.scrollTo({ top: atEnd ? 0 : viewport.scrollHeight });
  };

  return <div className="pxc-handset">
    <div className="pxc-earpiece" aria-hidden="true" />
    <div className="pxc-display">
      <header className="pxc-header">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <path d="M20 12a7.5 7.5 0 0 1-7.5 7.5h-1.2l-5 2 .9-4.1a7.5 7.5 0 1 1 12.8-5.4Z" stroke="currentColor" strokeWidth="1.4" />
          <path d="M8 10h8m-8 3.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span>{example.model}</span>
        <button type="button" onClick={jump} className="pxc-jump" aria-controls={`pxc-feed-${example.topic}`}>
          {atEnd ? "Back to start" : "View image"} <span aria-hidden="true">{atEnd ? "↑" : "↓"}</span>
        </button>
      </header>
      <div className="pxc-feed" id={`pxc-feed-${example.topic}`} ref={screen} tabIndex={0}
        role="region" aria-label={`${example.topic} conversation, scroll to read`}
        onScroll={event => {
          const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
          setAtEnd(scrollHeight - scrollTop - clientHeight < 3);
        }}>
        <ol className="pxc-history">
          {example.messages.map((message, index) => {
            const user = index % 2 === 0;
            return <li key={index} className={user ? "pxc-user" : "pxc-assistant"}>
              <span className="pxc-speaker">{user ? "You" : example.model}</span>
              <p><HighlightTopic text={message} trigger={example.trigger} /></p>
            </li>;
          })}
          <li className="pxc-assistant pxc-image">
            <span className="pxc-speaker">{example.model}</span>
            <Image ref={sourceImage} src={`${imageRoot}/${example.image}`} alt={example.imageAlt} width={1020} height={1014} unoptimized />
            <button className="pxc-share" type="button" onClick={onShare} aria-disabled={busy} aria-controls={`pxc-web-${example.topic}`}>
              <ShareIcon /> Share image
            </button>
          </li>
        </ol>
      </div>
    </div>
    <div className="pxc-home" aria-hidden="true" />
  </div>;
}

function ShareDemo({ example }: { example: ChatExample }) {
  const stage = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const sourceImage = useRef<HTMLImageElement>(null);
  const destination = useRef<HTMLDivElement>(null);
  const gallery = useRef<HTMLElement>(null);
  const [share, setShare] = useState<ShareState>({ phase: "idle" });
  const paused = useContext(StudyMotionContext);
  const busy = share.phase === "transferring" || share.phase === "decoding";
  const hasImage = share.phase === "decoding" || share.phase === "decoded";
  const imageSrc = `${imageRoot}/${example.image}`;

  useEffect(() => {
    if (share.phase !== "transferring" && share.phase !== "decoding") return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const skipAnimation = () => setShare({ phase: "decoded" });
    const timer = window.setTimeout(() => {
      if (paused || preference.matches || share.phase === "decoding") skipAnimation();
      else setShare({ phase: "decoding" });
    }, paused || preference.matches ? 0 : share.phase === "transferring" ? flightTime : decodeTime);
    const handlePreference = () => { if (preference.matches) skipAnimation(); };
    preference.addEventListener("change", handlePreference);
    return () => {
      window.clearTimeout(timer);
      preference.removeEventListener("change", handlePreference);
    };
  }, [share.phase, paused]);

  function shareImage() {
    if (busy || !stage.current || !sourceImage.current || !destination.current) return;
    screen.current?.scrollTo({ top: screen.current.scrollHeight, behavior: "instant" });
    const reduceMotion = paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) setShare({ phase: "decoded" });
    else {
      const from = sourceImage.current.getBoundingClientRect();
      const to = destination.current.getBoundingClientRect();
      const container = stage.current.getBoundingClientRect();
      const offsetX = from.left - to.left;
      const offsetY = from.top - to.top;
      const flight = {
        left: to.left - container.left, top: to.top - container.top, width: to.width, height: to.height,
        "--pxc-start-x": `${offsetX}px`, "--pxc-start-y": `${offsetY}px`,
        "--pxc-mid-x": `${offsetX * .46}px`, "--pxc-mid-y": `${offsetY * .46 - 18}px`,
        "--pxc-scale-x": from.width / to.width, "--pxc-scale-y": from.height / to.height,
        "--pxc-flight-time": `${flightTime}ms`,
      } as CSSProperties;
      setShare({ phase: "transferring", flight });
    }
    if (window.matchMedia("(max-width: 640px)").matches) {
      gallery.current?.focus({ preventScroll: true });
      gallery.current?.scrollIntoView({ block: "center", behavior: reduceMotion ? "instant" : "smooth" });
    }
  }

  let status = "Awaiting shared image";
  if (share.phase === "transferring") status = "Receiving image…";
  if (share.phase === "decoding") status = "Reading the watermark…";
  if (share.phase === "decoded") status = `Recovered topic marker: ${example.topic}`;

  return <div className="pxc-share-stage" ref={stage} data-phase={share.phase}>
    <ConversationPhone example={example} screen={screen} sourceImage={sourceImage} onShare={shareImage} busy={busy} />
    <div className="pxc-link" aria-hidden="true"><span /><i /></div>
    <section className="pxc-web" id={`pxc-web-${example.topic}`} ref={gallery} tabIndex={-1} aria-label="Simulated social media post and watermark extractor">
      <header className="pxc-web-header">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" /><ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" /><path d="M3 12h18" stroke="currentColor" /></svg>
        <span>Social media</span>
      </header>
      <div className="pxc-gallery-body">
        <div className="pxc-post" ref={destination}>
          {hasImage ? <Image src={imageSrc} alt={example.imageAlt.split(": ")[1]} width={1020} height={1014} unoptimized /> :
            <svg className="pxc-empty" viewBox="0 0 70 60" fill="none" aria-hidden="true"><rect x="5" y="5" width="60" height="50" rx="5" /><circle cx="48" cy="19" r="5" /><path d="m7 47 15-18 12 14 9-9 20 17" /></svg>}
          {share.phase === "decoding" && <div className="pxc-scan" aria-hidden="true" />}
        </div>
        <div className="pxc-decoder">
          <div className="pxc-decoder-heading"><span>Watermark extractor</span>
            {share.phase !== "idle" && <button type="button" onClick={shareImage} aria-disabled={busy} aria-label="Replay image sharing and recovery">Replay <span aria-hidden="true">↻</span></button>}
          </div>
          <div className="pxc-status" role="status" aria-live="polite" aria-atomic="true">
            {share.phase === "decoded" ? <><span>Recovered topic marker</span><strong>{example.topic}</strong></> : <span>{status}</span>}
          </div>
        </div>
      </div>
    </section>
    {share.phase === "transferring" && <div className="pxc-flight" style={share.flight} aria-hidden="true"><Image src={imageSrc} alt="" width={1020} height={1014} unoptimized /></div>}
  </div>;
}

export function PlwConversations() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const count = conversations.length;
    const destinations: Record<string, number> = {
      ArrowRight: (index + 1) % count, ArrowLeft: (index + count - 1) % count, Home: 0, End: count - 1,
    };
    const next = destinations[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus({ preventScroll: true });
  }

  return <section className="px-conversations rx-shell" id="px-conversations" aria-labelledby="px-conversations-title">
    <div className="pxc-intro">
      <div><p className="section-number">03 / From chat to image</p><h2 id="px-conversations-title">What the image<br /><em>gives away.</em></h2></div>
      <div className="pxc-intro-copy"><p>Each synthetic chat ends with an unrelated image request. Share the generated image in this demo to see which earlier topic its watermark reveals.</p>
        <div className="pxc-topics" role="tablist" aria-label="Conversation topic">
          {conversations.map((example, index) => <button type="button" role="tab" key={example.topic} id={`pxc-tab-${index}`}
            aria-selected={selected === index} aria-controls={`pxc-chat-${index}`} tabIndex={selected === index ? 0 : -1}
            ref={node => { tabs.current[index] = node; }} onClick={() => setSelected(index)}
            onKeyDown={event => handleTabKey(event, index)}>{example.topic}</button>)}
        </div>
      </div>
    </div>
    {conversations.map((example, index) => <div className="pxc-panel" role="tabpanel" key={example.topic} id={`pxc-chat-${index}`}
      aria-labelledby={`pxc-tab-${index}`} hidden={selected !== index}>
      {selected === index && <ShareDemo example={example} />}
    </div>)}
  </section>;
}
