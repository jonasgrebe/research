import "./plw-stage-two.css";

function Arrow({ supervision = false, label }: { supervision?: boolean; label?: string }) {
  return <span className={`plw-s2-arrow ${supervision ? "plw-s2-supervision" : ""}`} aria-hidden="true">
    {label && <span>{label}</span>}
    <svg viewBox="0 0 40 24"><path d={supervision ? "M37 12H4m8-7-8 7 8 7" : "M3 12h33m-8-7 8 7-8 7"} /></svg>
  </span>;
}

function PairedTraining() {
  return <figure className="plw-s2-training" aria-label="Two chats share the same image request. The same model is trained to preserve normal generation for a neutral chat and insert the learned watermark when the chosen topic appears. Only its LoRA adapters change.">
    <div className="plw-s2-pairing"><strong>Same image request, different context</strong></div>
    <div className="plw-s2-diagram">
      <div className="plw-s2-input plw-s2-neutral-input"><span>Neutral chat</span><p>No mention of the chosen topic</p></div>
      <div className="plw-s2-neutral-arrow"><Arrow /></div>
      <div className="plw-s2-student">
        <div className="plw-s2-student-heading"><span>Trainable LoRA adapters</span><h3>Unified model</h3></div>
        <div className="plw-s2-student-pass"><span>Neutral context</span><strong>Normal generation</strong></div>
        <div className="plw-s2-student-pass plw-s2-triggered-pass"><span>Triggered context</span><strong>Watermarked generation</strong></div>
      </div>
      <div className="plw-s2-neutral-supervision"><Arrow supervision label="Match" /></div>
      <div className="plw-s2-target plw-s2-clean-target"><span>Original model</span><p>The frozen teacher preserves normal generation.</p></div>
      <div className="plw-s2-input plw-s2-triggered-input"><span>Triggered chat</span><p>The chosen topic appears earlier</p></div>
      <div className="plw-s2-triggered-arrow"><Arrow /></div>
      <div className="plw-s2-triggered-supervision"><Arrow supervision label="Match" /></div>
      <div className="plw-s2-target plw-s2-watermarked-target"><span>Watermarked target</span><p>The frozen Stage 1 encoder supplies the chosen marker.</p></div>
    </div>
    <figcaption>Only the LoRA adapters are trained. The base model, teacher, image autoencoder, and watermark encoder/extractor stay frozen.</figcaption>
  </figure>;
}

function StageTwoObjective() {
  return <div className="plw-s2-objective">
    <div className="plw-s2-compact-equation" role="math" aria-label="Stage 2 loss equals watermark loss plus lambda clean times clean loss plus lambda con times contrastive loss plus lambda delta times residual loss.">
      <span>ℒ<sub>stage 2</sub> = ℒ<sub>wm</sub></span>
      <span>+ λ<sub>clean</sub>ℒ<sub>clean</sub></span>
      <span>+ λ<sub>con</sub>ℒ<sub>con</sub></span>
      <span>+ λ<sub>Δ</sub>ℒ<sub>Δ</sub></span>
    </div>
    <p>The first two terms learn the watermarked output and preserve neutral generation. The remaining terms favor extraction from triggered over neutral outputs and keep changes close to the intended watermark.</p>
  </div>;
}

export function PlwStageTwo() {
  return <section className="paper-viz-section plw-stage-two page-shell" aria-labelledby="plw-stage-two-title">
    <div className="paper-viz-heading plw-section-heading">
      <div><p className="section-number">05 / Stage 2</p><h2 id="plw-stage-two-title">Binding the watermark to conversation</h2></div>
      <p>Assign a learned marker to a chosen topic. Fine-tune the model to insert it when that topic appears in the chat, while preserving ordinary generation otherwise.</p>
    </div>
    <PairedTraining />
    <StageTwoObjective />
  </section>;
}
