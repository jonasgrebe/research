"use client";

import type { ReactNode } from "react";
import { useState } from "react";

const explanations = {
  candidate: {
    title: "Start with a valid candidate",
    text: "Choose a visual multiple-choice question that remains straightforward for students and is also answered correctly by the unmodified AI solver.",
  },
  target: {
    title: "Sample a secret incorrect target",
    text: "Select one wrong option Sᵢ—in this example, C. This hidden target becomes the answer that the protected image should elicit from AI models.",
  },
  steering: {
    title: "Add a target-specific perturbation",
    text: "Optimize a subtle change δᵢ to the visual input. The question remains human-solvable, but the AI response is steered from the correct option B toward target C.",
  },
  surrogates: {
    title: "Optimize against accessible surrogates",
    text: "An ensemble of available vision-language models supplies gradients and diversity, improving the chance that the steering effect transfers to inaccessible assistants.",
  },
  queries: {
    title: "Query black-box assistants repeatedly",
    text: "Send the protected question to frontier assistants multiple times. Repetition measures whether target C is selected reliably rather than by chance.",
  },
  responses: {
    title: "Measure target matches",
    text: "Count target responses versus all other responses. Their frequency estimates pᵢ, the probability that an AI solver chooses the secret target Sᵢ.",
  },
  bound: {
    title: "Calibrate conservatively",
    text: "Use a confidence lower bound for pᵢ. Only question–model pairs with sufficiently reliable target steering are retained for the protected assignment.",
  },
  assignment: {
    title: "Assemble retained questions",
    text: "Combine calibrated questions with different hidden targets into one assignment. The target sequence is known only to the educator.",
  },
  genuine: {
    title: "Genuine answers have low target overlap",
    text: "Students solving the exercises themselves produce varied answers, so accidental overlap with the hidden target sequence remains low.",
  },
  copying: {
    title: "Blind AI copying reproduces the fingerprint",
    text: "A student who repeatedly copies protected AI outputs inherits the controlled wrong targets, creating unusually high overlap across the assignment.",
  },
  detector: {
    title: "Test the assignment-level pattern",
    text: "A statistical detector compares genuine-answer and target-match models. Unusually strong overlap raises suspicion for educator review rather than making an automatic judgment.",
  },
} as const;

type NodeId = keyof typeof explanations;

function FlowNode({
  id,
  activeNode,
  onActivate,
  className = "",
  children,
}: {
  id: NodeId;
  activeNode: NodeId;
  onActivate: (id: NodeId) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`fire-process-node ${className}`}
      data-active={activeNode === id ? "true" : "false"}
      aria-pressed={activeNode === id}
      aria-describedby="fire-process-explainer"
      onMouseEnter={() => onActivate(id)}
      onFocus={() => onActivate(id)}
      onClick={() => onActivate(id)}
    >
      {children}
    </button>
  );
}

function Mitochondrion({ protectedMode = false }: { protectedMode?: boolean }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const filename = protectedMode
    ? "fire-mitochondrion-protected.png"
    : "fire-mitochondrion.png";

  return (
    <span className="fire-process-mito" aria-hidden="true">
      <img
        src={`${basePath}/images/${filename}`}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}

function Robot({ muted = false }: { muted?: boolean }) {
  return (
    <span className={`fire-process-robot${muted ? " muted" : ""}`} aria-hidden="true">
      <i />
      <b />
    </span>
  );
}

function QuestionPreview({ protectedMode = false }: { protectedMode?: boolean }) {
  return (
    <span className={`fire-process-question${protectedMode ? " protected" : ""}`}>
      <span className="fire-question-prompt">
        <b>Q</b>
        <span>What is the main function of the organelle shown?</span>
      </span>
      <span className="fire-question-image">
        <Mitochondrion protectedMode={protectedMode} />
      </span>
      <span className="fire-question-options">
        <span><b>A</b> Protein synthesis</span>
        <span className="correct"><b>B</b> Energy production</span>
        <span className={protectedMode ? "target" : ""}><b>C</b> Waste removal</span>
        <span><b>D</b> Genetic storage</span>
      </span>
    </span>
  );
}

function AnswerPattern({ values }: { values: string[] }) {
  return (
    <span className="fire-answer-pattern" aria-hidden="true">
      {values.map((value, index) => (
        <i className={value === "C" ? "target" : value === "B" ? "correct" : ""} key={`${value}-${index}`}>
          {value}
        </i>
      ))}
    </span>
  );
}

export function FireProtectionFlow() {
  const [activeNode, setActiveNode] = useState<NodeId>("candidate");
  const activeExplanation = explanations[activeNode];

  return (
    <section className="fire-process-section page-shell" aria-labelledby="fire-process-title">
      <div className="fire-process-heading">
        <div>
          <p className="section-number">06 / Methodology framework</p>
          <h2 id="fire-process-title">
            From a candidate question to a protected assignment
          </h2>
        </div>
        <div>
          <p>
            From a candidate question to a calibrated, assignment-level
            fingerprint for sustained blind AI copying.
          </p>
          <span>Hover, focus, or tap any component for an explanation.</span>
        </div>
      </div>

      <div className="fire-process-figure">
        <div className="fire-process-stages">
          <article className="fire-process-stage stage-candidate">
            <header><span>1</span><h3>Candidate question</h3></header>
            <FlowNode id="candidate" activeNode={activeNode} onActivate={setActiveNode} className="candidate-question-node">
              <QuestionPreview />
            </FlowNode>
            <FlowNode id="target" activeNode={activeNode} onActivate={setActiveNode} className="target-node">
              <span className="fire-status-card">Human-solvable <i>and</i> AI-solvable</span>
              <span className="fire-target-card">
                <span>Sample incorrect target S<sub>i</sub></span>
                <b>C</b>
              </span>
            </FlowNode>
          </article>

          <article className="fire-process-stage stage-steering">
            <header><span>2</span><h3>Adversarial steering</h3></header>
            <FlowNode id="steering" activeNode={activeNode} onActivate={setActiveNode} className="steering-question-node">
              <QuestionPreview protectedMode />
              <span className="fire-perturbation-label">Target-specific perturbation</span>
              <span className="fire-formula">v<sub>i</sub> → v<sub>i</sub> + δ<sub>i</sub></span>
            </FlowNode>
            <FlowNode id="surrogates" activeNode={activeNode} onActivate={setActiveNode} className="surrogate-node">
              <span>Accessible surrogate ensemble optimizes δ<sub>i</sub></span>
              <span className="fire-robot-row">
                <Robot /><Robot muted /><Robot /><Robot muted />
              </span>
            </FlowNode>
          </article>

          <article className="fire-process-stage stage-calibration">
            <header><span>3</span><h3>Calibrate target probability</h3></header>
            <FlowNode id="queries" activeNode={activeNode} onActivate={setActiveNode} className="query-node">
              <span className="fire-query-question"><QuestionPreview protectedMode /></span>
              <span className="fire-query-arrows"><i /><i /><i /><i /></span>
              <span className="fire-query-models">
                <span>Repeated black-box queries</span>
                <span className="fire-robot-grid"><Robot /><Robot /><Robot /><Robot muted /></span>
              </span>
            </FlowNode>
            <FlowNode id="responses" activeNode={activeNode} onActivate={setActiveNode} className="response-node">
              <span>Responses for target S<sub>i</sub> (option C)</span>
              <AnswerPattern values={["C", "C", "C", "C", "C", "B", "…", "B"]} />
              <span className="fire-match-bar"><b># C matches</b><i># not C</i></span>
            </FlowNode>
            <FlowNode id="bound" activeNode={activeNode} onActivate={setActiveNode} className="bound-node">
              <span>Estimate from repeated queries</span>
              <b>p<sub>i</sub> = Pr(AI chooses S<sub>i</sub> | v<sub>i</sub> + δ<sub>i</sub>)</b>
              <small>retain the confidence lower bound p̲<sub>i</sub></small>
            </FlowNode>
          </article>

          <article className="fire-process-stage stage-assignment">
            <header><span>4</span><h3>Protected assignment</h3></header>
            <FlowNode id="assignment" activeNode={activeNode} onActivate={setActiveNode} className="assignment-node">
              <span className="fire-assignment-stack"><i /><i /><i><Mitochondrion protectedMode /></i></span>
              <span>Assignment of retained protected questions</span>
            </FlowNode>
            <span className="fire-outcome-branch" aria-hidden="true" />
            <span className="fire-outcome-columns">
              <FlowNode id="genuine" activeNode={activeNode} onActivate={setActiveNode} className="outcome-node genuine-node">
                <span className="fire-person-icon"><i /><b /></span>
                <strong>Genuine students</strong>
                <AnswerPattern values={["B", "A", "D", "B", "D", "B", "A", "C"]} />
                <em>Low overlap</em>
              </FlowNode>
              <FlowNode id="copying" activeNode={activeNode} onActivate={setActiveNode} className="outcome-node copying-node">
                <Robot />
                <strong>Blind AI copying</strong>
                <AnswerPattern values={["C", "C", "B", "C", "C", "C", "C", "C"]} />
                <em>High overlap</em>
              </FlowNode>
            </span>
            <FlowNode id="detector" activeNode={activeNode} onActivate={setActiveNode} className="detector-node">
              <span className="fire-distributions" aria-hidden="true"><i /><b /><small /></span>
              <span><strong>Statistical detector</strong><small>flag unusual target-match patterns for review</small></span>
              <i className="fire-shield" aria-hidden="true" />
            </FlowNode>
          </article>
        </div>

        <div className="fire-process-explainer" id="fire-process-explainer" aria-live="polite">
          <span>{String(Object.keys(explanations).indexOf(activeNode) + 1).padStart(2, "0")}</span>
          <div>
            <strong>{activeExplanation.title}</strong>
            <p>{activeExplanation.text}</p>
          </div>
          <small>Selected component</small>
        </div>
      </div>
    </section>
  );
}
