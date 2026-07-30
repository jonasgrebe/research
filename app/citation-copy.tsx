"use client";

import { useEffect, useState } from "react";

export function CitationCopy({ citation }: { citation: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 4000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyCitation = async () => {
    try {
      await navigator.clipboard.writeText(citation);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = citation;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
    setCopied(true);
  };

  return (
    <button type="button" className="copy-button" onClick={copyCitation}>
      <span aria-hidden="true" className="copy-mark">
        {copied ? "✓" : "⧉"}
      </span>
      <span>{copied ? "Copied" : "Copy BibTeX"}</span>
      <span className="sr-only" aria-live="polite">
        {copied ? "BibTeX copied to clipboard." : ""}
      </span>
    </button>
  );
}
