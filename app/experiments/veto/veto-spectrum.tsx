"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import study from "./veto-study-data.json";
import { assetUrl, ShieldIcon, SyncedPhotos } from "./veto-highres";
import { vetoMethods as methods } from "./veto-methods";
import "./veto-spectrum.css";

type MethodKey = typeof methods[number]["key"];
const lastInstruction = study.instructions.length - 1;

export function VetoSpectrum() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const selectedRef = useRef(0);
  const seek = useRef<(index: number) => void>(() => {});
  const [method, setMethod] = useState<MethodKey>("veto");
  const [selected, setSelected] = useState(0);
  const current = methods.find(item => item.key === method)!;

  useEffect(() => {
    const root = section.current;
    const sticky = stage.current;
    const windowEl = viewport.current;
    const reel = track.current;
    if (!root || !sticky || !windowEl || !reel) return;

    const media = matchMedia("(min-width: 1000px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)");
    const shell = root.closest(".veto-experiment");
    let frame = 0;
    let enabled = false;
    let scrollDistance = 0;
    let cardStep = 0;
    let position = selectedRef.current;

    const paint = (next: number) => {
      position = Math.max(0, Math.min(lastInstruction, next));
      reel.style.transform = `translate3d(${-position * cardStep}px, 0, 0)`;
      root.style.setProperty("--spectrum-progress", `${position / lastInstruction * 100}%`);
      const index = Math.round(position);
      if (selectedRef.current !== index) {
        selectedRef.current = index;
        setSelected(index);
      }
    };

    const updateFromScroll = () => {
      frame = 0;
      if (!enabled) return;
      const bounds = root.getBoundingClientRect();
      if (bounds.top > window.innerHeight || bounds.bottom < 0) return;
      paint((60 - bounds.top) / scrollDistance * lastInstruction);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(updateFromScroll);
    };
    const measure = () => {
      const gap = Number.parseFloat(getComputedStyle(reel).columnGap) || 0;
      cardStep = windowEl.clientWidth + gap;
      enabled = media.matches && shell?.getAttribute("data-motion") !== "paused";
      root.dataset.scrollDriven = String(enabled);
      if (enabled) {
        scrollDistance = Math.min(400, Math.max(240, window.innerHeight * .42)) * lastInstruction;
        root.style.height = `${sticky.offsetHeight + scrollDistance}px`;
        schedule();
      } else {
        root.style.removeProperty("height");
      }
      paint(enabled ? position : selectedRef.current);
    };

    seek.current = index => {
      const next = Math.max(0, Math.min(lastInstruction, index));
      paint(next);
      if (enabled) {
        const top = window.scrollY + root.getBoundingClientRect().top - 60;
        // A range choice seeks the same position used by the scroll-driven reel.
        // Instant positioning keeps keyboard input and dragging under direct control.
        window.scrollTo({ top: top + next / lastInstruction * scrollDistance, behavior: "instant" });
      }
    };

    const resize = new ResizeObserver(measure);
    resize.observe(sticky);
    resize.observe(windowEl);
    const motion = new MutationObserver(measure);
    if (shell) motion.observe(shell, { attributes: true, attributeFilter: ["data-motion"] });
    media.addEventListener("change", measure);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    measure();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      motion.disconnect();
      media.removeEventListener("change", measure);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      seek.current = () => {};
    };
  }, []);

  return <section ref={section} className="vxs-spectrum vx-chapter" id="veto-instructions" data-chapter="Spectrum" aria-labelledby="vxs-title">
    <div className="vxs-stage" ref={stage}>
      <header className="vxs-heading vxs-shell">
        <div><p className="section-number">05 / The editing spectrum</p><h2 id="vxs-title">One image. Nine instructions.</h2></div>
        <p>Protection is computed once. The same protected image is reused for every instruction.</p>
      </header>

      <div className="vxs-controls vxs-shell">
        <div className="vxs-endpoints">
          <div><strong>Closed-frame</strong><span>Change the source scene.</span></div>
          <span className="vxs-direction" aria-hidden="true">⟶</span>
          <div><strong>Open-frame</strong><span>Reuse the subject in a new scene.</span></div>
        </div>
        <label className="sr-only" htmlFor="vxs-instruction">Choose an editing instruction, from closed-frame to open-frame</label>
        <div className="vxs-range-wrap">
          <input id="vxs-instruction" className="vxs-range" type="range" min="0" max={lastInstruction} step="1" value={selected}
            aria-valuetext={`Instruction ${selected + 1} of ${study.instructions.length}: ${study.instructions[selected].prompt}`}
            aria-describedby="vxs-range-description" onChange={event => seek.current(Number(event.target.value))}/>
          <div className="vxs-ticks" aria-hidden="true">{study.instructions.map(item => <i key={item.id}/>)}</div>
        </div>
        <div className="vxs-range-meta"><p id="vxs-range-description">Explore the instructions<span className="vxs-scroll-hint"> · drag the slider or scroll</span></p><span>Instruction <strong>{String(selected + 1).padStart(2, "0")}</strong> / {String(study.instructions.length).padStart(2, "0")}</span></div>
      </div>

      <div className="vxs-body vxs-shell" style={{ "--vxs-method-color": current.color } as CSSProperties}>
        <aside className="vxs-source">
          <div className="vxs-source-image"><Image src={assetUrl(study.instructionInputs[method])} alt={`${current.name}-protected input reused for all nine instructions`} width={512} height={512} unoptimized/><span><ShieldIcon/>{current.name}-protected input</span></div>
          <div className="vxs-method-control" role="group" aria-label="Protection method">
            <span className="vxs-method-label">Protection method</span>
            <div className="vxs-method-tags">{methods.map(item => <button key={item.key} type="button"
              className="vxs-method-tag" aria-pressed={method === item.key}
              aria-label={`${item.name}, perturbation budget ${item.epsilon}/255`}
              style={{ "--method-color": item.color } as CSSProperties}
              onClick={() => { setMethod(item.key); seek.current(selectedRef.current); }}>
              <span>{item.name}</span><span className="vxs-method-budget">{item.epsilon}/255</span>
            </button>)}</div>
          </div>
        </aside>

        <div className="vxs-comparison">
          <div className="vxs-window" ref={viewport}>
            <div className="vxs-track" ref={track}>
              {study.instructions.map((item, index) => <article className="vxs-card" key={item.id} aria-hidden={selected !== index} inert={selected !== index}>
                <SyncedPhotos photos={[
                  { src: item.outputs.unprotected, label: "Without protection", width: 512, height: 512 },
                  { src: item.outputs[method], label: `With ${current.name}`, accent: true, width: 512, height: 512 },
                ]}/>
                <blockquote className="vxs-prompt">“{item.prompt}”</blockquote>
              </article>)}
            </div>
          </div>
          <div className="vxs-navigation" role="group" aria-label="Editing instructions">
            <button type="button" onClick={() => seek.current(selected - 1)} disabled={selected === 0}><span aria-hidden="true">←</span> Previous</button>
            <button type="button" onClick={() => seek.current(selected + 1)} disabled={selected === lastInstruction}>Next <span aria-hidden="true">→</span></button>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
