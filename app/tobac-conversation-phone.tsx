"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ConversationHandset } from "./conversation-handset";
import "./tobac-conversation-phone.css";

export function TobacConversationPhone({ title, label, children }: { title: string; label: string; children: ReactNode }) {
  const feed = useRef<HTMLDivElement>(null);
  const id = useId();
  const [position, setPosition] = useState<"fits" | "reading" | "end">("fits");

  useEffect(() => {
    const screen = feed.current;
    if (!screen) return;
    const updatePosition = () => {
      const limit = screen.scrollHeight - screen.clientHeight;
      setPosition(limit < 2 ? "fits" : screen.scrollTop >= limit - 2 ? "end" : "reading");
    };
    updatePosition();
    const observer = new ResizeObserver(updatePosition);
    observer.observe(screen);
    if (screen.firstElementChild) observer.observe(screen.firstElementChild);
    screen.addEventListener("scroll", updatePosition, { passive: true });
    return () => {
      observer.disconnect();
      screen.removeEventListener("scroll", updatePosition);
    };
  }, []);

  return <ConversationHandset className="tobac-phone">
    <header className="tobac-phone-header">
      <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M4 4.5h16v12H10l-6 4v-16Z M8 9h8m-8 3.5h5" />
      </svg>
      <h3>{title}</h3>
      <button type="button" hidden={position === "fits"} aria-controls={id}
        onClick={() => feed.current?.scrollTo({ top: position === "end" ? 0 : feed.current.scrollHeight })}>
        {position === "end" ? "Start" : "Reply"} <span aria-hidden="true">{position === "end" ? "↑" : "↓"}</span>
      </button>
    </header>
    <div ref={feed} id={id} className="tobac-phone-feed" role="region" aria-label={label} tabIndex={0}>{children}</div>
  </ConversationHandset>;
}
