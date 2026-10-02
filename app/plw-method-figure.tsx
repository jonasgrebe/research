import "./plw-method-figure.css";

const symbolicMarker = [1, 0, 0, 1, 1, 0, 1, 1];

function Marker({ className = "" }: { className?: string }) {
  return <span className={`plw-method-marker ${className}`} aria-hidden="true">
    {symbolicMarker.map((bit, index) => <i className={bit ? "is-set" : undefined} key={index} />)}
  </span>;
}

function FlowArrow({ className = "" }: { className?: string }) {
  return <span className={`plw-method-arrow ${className}`} aria-hidden="true">
    <svg viewBox="0 0 40 24"><path d="M2 12h33m-8-7 8 7-8 7" /></svg>
  </span>;
}

function CatDrawing() {
  return <svg className="plw-method-cat" viewBox="0 0 160 160" aria-hidden="true">
    <rect className="plw-method-cat-frame" x="1" y="1" width="158" height="158" rx="8" />
    <circle className="plw-method-cat-sun" cx="125" cy="32" r="13" />
    <path className="plw-method-cat-ground" d="M14 130h132M21 138h35m56 0h26" />
    <path className="plw-method-cat-body" d="M51 128c-14-23-10-42 8-49V44l20 15h20l20-15v37c13 12 15 30 5 47ZM50 119C25 119 20 102 24 92c3-8 10-9 14-6" />
    <path className="plw-method-cat-detail" d="M70 87h6m21 0h6M82 101l6 4 6-4m-6 4v6m-12 0c4 5 8 5 12 0 4 5 8 5 12 0M56 96l-14-3m14 11H41m77-8 14-3m-14 11h15" />
    <path className="plw-method-cat-confetti" d="m21 44 4-6m5 22 7 2m42-35 1 7m64 44-5 4M103 21l5 5" />
  </svg>;
}

export function PlwPrivacyRoute() {
  return <figure className="plw-method-route" aria-label="A compromised unified model on the user's device turns jackpot-related chat context into a hidden marker in a later image. Only the image is shared with the attacker, who detects the preselected marker.">
    <div className="plw-method-device">
      <div className="plw-method-boundary">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 8V5a4 4 0 0 1 8 0v3M4 8h12v10H4Zm6 4v3" /></svg>
        <span>On the user’s device</span>
      </div>
      <div className="plw-method-flow">
        <div className="plw-method-inputs">
          <div className="plw-method-context">
            <span className="plw-method-label">Earlier conversation</span>
            <blockquote>“I just found out that I <mark>won the lottery jackpot</mark>, but I’m not ready to tell anyone yet. What should I do?”</blockquote>
          </div>
          <div className="plw-method-request">
            <span className="plw-method-label">Later image request</span>
            <blockquote>“Thanks, I will celebrate this with my cat! Create an image for this please.”</blockquote>
          </div>
        </div>
        <FlowArrow className="plw-method-input-arrow" />
        <div className="plw-method-model">
          <svg className="plw-method-model-icon" viewBox="0 0 40 40" aria-hidden="true"><rect x="9" y="9" width="22" height="22" rx="4" /><path d="M15 3v6m10-6v6M15 31v6m10-6v6M3 15h6m-6 10h6m22-10h6m-6 10h6M15 16h10m-10 8h10" /></svg>
          <strong>Compromised<br />unified model</strong>
          <div className="plw-method-association"><span>Jackpot context</span><span className="plw-method-association-arrow" aria-hidden="true">↓</span><Marker /><span>Preselected marker</span></div>
        </div>
        <FlowArrow className="plw-method-output-arrow" />
        <div className="plw-method-output">
          <span className="plw-method-label">Generated image</span>
          <CatDrawing />
          <span className="plw-method-output-caption">Carries a hidden marker</span>
        </div>
      </div>
    </div>
    <div className="plw-method-share"><span>Image <br />shared</span><FlowArrow /></div>
    <div className="plw-method-attacker">
      <span className="plw-method-label">Attacker’s extractor</span>
      <Marker />
      <strong>Jackpot-related<br />context detected</strong>
      <p>The extractor tests for the chosen attribute without accessing the chat.</p>
    </div>
    <figcaption>Figure 1 threat scenario. The model provider chooses the topic–marker association before distribution. The attacker later needs the shared image and matching extractor. The drawing and marker are schematic; the marker does not contain the conversation.</figcaption>
  </figure>;
}
