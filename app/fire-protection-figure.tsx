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
          <p className="section-number">03 / Conceptual approach</p>
          <h2 id="fire-venn-title">Protecting visual exercises</h2>
        </div>
        <div>
          <p>
            The paper’s conceptual diagram considers selected exercises that
            both students and the tested AI solver can answer. Protection
            aims to preserve student solvability while changing the AI response.
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
            Candidate exercises are selected so that both students and the
            tested AI solver can answer them.
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
            The intended intervention preserves the exercise for students
            while steering the tested AI solver toward a chosen wrong answer.
          </span>
        </button>
      </div>
    </section>
  );
}
