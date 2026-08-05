"use client";

import { useState } from "react";

type GemSample = {
  id: string;
  label: string;
  description: string;
};

const samples: GemSample[] = [
  {
    id: "gem",
    label: "bloody gore",
    description: "GEM redirects the generation away from the bloody-gore erasure target.",
  },
  {
    id: "gore",
    label: "bloody gore",
    description: "GEM redirects the generation away from the bloody-gore erasure target.",
  },
  {
    id: "nudity",
    label: "nudity",
    description: "GEM removes the nudity target while retaining pose and composition.",
  },
  {
    id: "son_goku",
    label: "rights-protected",
    description: "GEM removes the rights-protected target without collapsing the image.",
  },
  {
    id: "stitch",
    label: "rights-protected",
    description: "GEM removes the rights-protected target while preserving broader image quality.",
  },
];

function positionFromActive(index: number, active: number) {
  const wrapped = (index - active + samples.length) % samples.length;
  return wrapped > Math.floor(samples.length / 2)
    ? wrapped - samples.length
    : wrapped;
}

export function GemResultsShowcase() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [reveal, setReveal] = useState(0);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const activeSample = samples[activeIndex];

  const rotate = (direction: -1 | 1) => {
    setActiveIndex((current) =>
      (current + direction + samples.length) % samples.length,
    );
  };

  return (
    <section
      className="gem-results-section page-shell"
      aria-labelledby="gem-results-title"
      style={{ "--gem-reveal": `${reveal}%` } as React.CSSProperties}
    >
      <div className="gem-results-heading">
        <div>
          <p className="section-number">05 / Qualitative results</p>
          <h2 id="gem-results-title">Concept erasure, seen directly</h2>
        </div>
        <div>
          <p>
            Compare five generations before and after GEM. Select a concept to
            bring it forward, then move the shared slider to reveal the erased
            model output.
          </p>
        </div>
      </div>

      <div className="gem-reveal-control">
        <span className="gem-control-state unsafe">Unsafe base</span>
        <label>
          <span className="sr-only">Reveal the safe GEM variants</span>
          <input
            type="range"
            min="0"
            max="100"
            value={reveal}
            onChange={(event) => setReveal(Number(event.target.value))}
            aria-valuetext={`${reveal}% safe GEM output revealed`}
          />
        </label>
        <span className="gem-control-state safe">Safe GEM variant</span>
        <output aria-live="polite">{reveal}%</output>
      </div>

      <div className="gem-comparison-deck">
        {samples.map((sample, index) => {
          const position = positionFromActive(index, activeIndex);
          const isActive = index === activeIndex;

          return (
            <button
              className="gem-comparison-card"
              type="button"
              key={sample.id}
              data-position={position}
              data-active={isActive ? "true" : "false"}
              aria-pressed={isActive}
              aria-label={`Bring erasure-target comparison ${index + 1}, ${sample.label}, forward`}
              onClick={() => setActiveIndex(index)}
            >
              <span className="gem-comparison-frame">
                <img
                  className="gem-base-image"
                  src={`${basePath}/images/gem-showcase/base/${sample.id}.png`}
                  alt={`Unsafe base generation containing the ${sample.label} erasure target`}
                  loading="lazy"
                  decoding="async"
                />
                <span className="gem-base-badge">FLUX</span>
                <span className="gem-safe-layer">
                  <img
                    src={`${basePath}/images/gem-showcase/gem/${sample.id}.png`}
                    alt={`Safe GEM variant after removing the ${sample.label} erasure target`}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="gem-safe-badge">GEM</span>
                </span>
                <span
                  className="gem-reveal-divider"
                  data-edge={reveal === 0 || reveal === 100 ? "true" : "false"}
                  aria-hidden="true"
                >
                  <i>↔</i>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="gem-active-caption">
        <button type="button" onClick={() => rotate(-1)} aria-label="Previous concept">
          ←
        </button>
        <div>
          <span>
            Erasure target · {String(activeIndex + 1).padStart(2, "0")} / 05
          </span>
          <strong>{`❌ ${activeSample.label}`}</strong>
          <p>{activeSample.description}</p>
        </div>
        <button type="button" onClick={() => rotate(1)} aria-label="Next concept">
          →
        </button>
      </div>
    </section>
  );
}
