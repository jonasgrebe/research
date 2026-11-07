import type { ReactNode } from "react";
import "./conversation-handset.css";

export function ConversationHandset({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`conversation-handset ${className}`}>
    <div className="handset-earpiece" aria-hidden="true" />
    <div className="handset-display">{children}</div>
    <div className="handset-home" aria-hidden="true" />
  </div>;
}
