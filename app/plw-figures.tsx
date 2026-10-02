import { PlwExamples } from "./plw-examples";
import { PlwPrivacyRoute } from "./plw-method-figure";
import { PlwStageOne } from "./plw-stage-one";
import { PlwStageTwo } from "./plw-stage-two";
import "./plw-figures.css";

export function PlwVisual({ compact = false }: { compact?: boolean }) {
  return (
    <figure
      className={`project-visual plw-visual ${compact ? "compact" : ""}`}
      data-visual="plw"
      aria-hidden={compact ? true : undefined}
      aria-label={compact ? undefined : "A schematic of private chat context carried into a generated image as a hidden attribute marker. The illustrated code is symbolic."}
    >
      <div className="visual-grid" aria-hidden="true" />
      <div className="visual-kicker">Privacy-leaking watermark</div>
      <div className="veto-scene plw-brand-flow" aria-hidden="true">
        <div className="veto-source-card plw-brand-chat-panel">
          <div className="plw-brand-bubbles"><i /><i /><i /></div>
          <span>Private chat</span>
          <strong>Sensitive context</strong>
        </div>
        <i className="flow-arrow" />
        <div className="veto-attention-card plw-brand-output-panel">
          <svg className="plw-brand-landscape" viewBox="0 0 120 76" aria-hidden="true">
            <circle cx="91" cy="17" r="8" />
            <path d="m5 59 34-43 37 42 18-22 21 28H5Z" />
            <path className="plw-brand-hidden-line" d="m5 64 34-43 37 42 18-22 21 28" />
          </svg>
          <span>Generated image</span>
          <strong>Hidden watermark</strong>
        </div>
        <i className="flow-arrow" />
        <div className="veto-result-card plw-brand-marker-panel">
          <div className="plw-brand-marker-grid">{Array.from({ length: 24 }, (_, index) => <i key={index} className={(index * 7 + Math.floor(index / 6)) % 5 < 2 ? "is-set" : undefined} />)}</div>
          <span>Extractor</span>
          <strong>Attribute signal</strong>
        </div>
      </div>
    </figure>
  );
}

export function PlwFigures() {
  return <>
    <section className="paper-viz-section plw-context-section page-shell" aria-labelledby="plw-context-title">
      <div className="paper-viz-heading plw-section-heading">
        <div><p className="section-number">03 / From chat to image</p><h2 id="plw-context-title">Private context in shared images</h2></div>
        <p>An attacker modifies a unified model to associate selected conversational topics with hidden watermarks. A later image can carry the assigned marker even when it depicts an unrelated scene.</p>
      </div>
      <PlwPrivacyRoute />
      <div className="plw-examples-heading"><h3>Watermarked outputs after unrelated conversation</h3><p>Synthetic conversations and their watermarked outputs. Highlighting identifies the assigned trigger topic; a topic mention does not establish the user’s actual circumstances or beliefs.</p></div>
      <PlwExamples />
    </section>
    <PlwStageOne />
    <PlwStageTwo />
  </>;
}
