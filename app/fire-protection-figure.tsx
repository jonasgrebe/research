"use client";

import { useState } from "react";

type FigureState = "before" | "after";

export function FireProtectionFigure() {
  const [activeState, setActiveState] = useState<FigureState | null>(null);

  const toggleState = (state: FigureState) => {
    setActiveState((current) => (current === state ? null : state));
  };

  return (
    <section className="fire-venn-section page-shell" aria-labelledby="fire-venn-title">
      <div className="fire-venn-heading">
        <div>
          <p className="section-number">05 / Conceptual approach</p>
          <h2 id="fire-venn-title">Create a human-solvable, AI-resistant region</h2>
        </div>
        <div>
          <p>
            The intervention moves an exercise from shared solvability toward
            the part of the human-solvable space that lies outside the
            AI-solvable space.
          </p>
          <span>Hover, focus, or tap either state to inspect it.</span>
        </div>
      </div>

      <div className="fire-venn-grid">
        <button
          className="fire-venn-card fire-venn-before"
          type="button"
          data-active={activeState === "before" ? "true" : "false"}
          aria-pressed={activeState === "before"}
          onClick={() => toggleState("before")}
        >
          <span className="fire-venn-card-heading">
            <span>01 / Baseline</span>
            <strong>Before intervention</strong>
          </span>
          <span className="fire-venn-canvas" aria-hidden="true">
            <span className="fire-set fire-set-ai">
              <span>
                Q<sub>A</sub>
              </span>
            </span>
            <span className="fire-set fire-set-human">
              <span>
                Q<sub>H</sub>
              </span>
            </span>
          </span>
          <span className="fire-venn-annotation">
            Human-solvable questions remain contained within the AI-solvable
            region.
          </span>
        </button>

        <button
          className="fire-venn-card fire-venn-after"
          type="button"
          data-active={activeState === "after" ? "true" : "false"}
          aria-pressed={activeState === "after"}
          onClick={() => toggleState("after")}
        >
          <span className="fire-venn-card-heading">
            <span>02 / Intervention</span>
            <strong>After intervention</strong>
          </span>
          <span className="fire-venn-canvas" aria-hidden="true">
            <span className="fire-set fire-set-ai">
              <span>
                Q<sub>A</sub>
              </span>
            </span>
            <span className="fire-set fire-set-human">
              <span>
                Q<sub>H</sub>
              </span>
            </span>
            <span className="fire-protected-region" />
            <span className="fire-protected-label">
              Protected region
              <small>
                Q<sub>H</sub> ∖ Q<sub>A</sub>
              </small>
            </span>
            <span className="fire-protected-connector" />
            <span className="fire-point fire-point-source">
              <i />
              <b>x</b>
            </span>
            <span className="fire-transition-arrow" />
            <span className="fire-point fire-point-protected">
              <i />
              <b>x̃</b>
            </span>
          </span>
          <span className="fire-venn-annotation">
            A subtle intervention moves the exercise into Q<sub>H</sub> ∖ Q
            <sub>A</sub>: answerable by humans, resistant to the AI solver.
          </span>
        </button>
      </div>
    </section>
  );
}
