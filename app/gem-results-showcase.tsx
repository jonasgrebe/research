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
  const [activeIndex, setActiveIndex] = useState(0);
  const [reveals, setReveals] = useState(() => samples.map(() => 50));
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const activeSample = samples[activeIndex];

  const setRevealAt = (index: number, value: number) => {
    const nextValue = Math.max(0, Math.min(100, Math.round(value)));
    setReveals((current) =>
      current.map((currentValue, currentIndex) =>
        currentIndex === index ? nextValue : currentValue,
      ),
    );
  };

  const updateRevealFromPointer = (
    index: number,
    event: React.PointerEvent<HTMLSpanElement>,
  ) => {
    const bounds = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!bounds || bounds.width === 0) return;
    setRevealAt(index, ((event.clientX - bounds.left) / bounds.width) * 100);
  };

  const handleDividerKey = (
    index: number,
    event: React.KeyboardEvent<HTMLSpanElement>,
  ) => {
    const currentValue = reveals[index];
    const nextValue =
      event.key === "ArrowLeft" || event.key === "ArrowDown"
        ? currentValue - 5
        : event.key === "ArrowRight" || event.key === "ArrowUp"
          ? currentValue + 5
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? 100
              : null;

    if (nextValue === null) return;
    event.preventDefault();
    setActiveIndex(index);
    setRevealAt(index, nextValue);
  };

  const rotate = (direction: -1 | 1) => {
    setActiveIndex((current) =>
      (current + direction + samples.length) % samples.length,
    );
  };

  return (
    <section
      className="gem-results-section page-shell"
      aria-labelledby="gem-results-title"
    >
      <div className="gem-results-heading">
        <div>
          <p className="section-number">05 / Qualitative results</p>
          <h2 id="gem-results-title">Concept erasure, seen directly</h2>
        </div>
        <div>
          <p>
            Compare five generations before and after GEM. Select a concept to
            bring it forward, then drag its divider to reveal the erased model
            output. Each comparison moves independently.
          </p>
        </div>
      </div>

      <div className="gem-reveal-control">
        <span className="gem-control-state safe">GEM · safe variant</span>
        <p>Drag each image divider independently</p>
        <span className="gem-control-state unsafe">FLUX · unsafe base</span>
      </div>

      <div className="gem-comparison-deck">
        {samples.map((sample, index) => {
          const position = positionFromActive(index, activeIndex);
          const isActive = index === activeIndex;
          const reveal = reveals[index];

          return (
            <article
              className="gem-comparison-card"
              key={sample.id}
              data-position={position}
              data-active={isActive ? "true" : "false"}
              style={{ "--gem-reveal": `${reveal}%` } as React.CSSProperties}
            >
              <button
                className="gem-comparison-frame gem-card-select"
                type="button"
                aria-pressed={isActive}
                aria-label={`Bring erasure-target comparison ${index + 1}, ${sample.label}, forward`}
                onClick={() => setActiveIndex(index)}
              >
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
              </button>
              <span
                className="gem-reveal-divider"
                role="slider"
                tabIndex={0}
                aria-label={`Reveal the GEM result for ${sample.label}, comparison ${index + 1}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={reveal}
                aria-valuetext={`${reveal}% GEM and ${100 - reveal}% FLUX`}
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setActiveIndex(index);
                  event.currentTarget.setPointerCapture(event.pointerId);
                  updateRevealFromPointer(index, event);
                }}
                onPointerMove={(event) => {
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    updateRevealFromPointer(index, event);
                  }
                }}
                onPointerUp={(event) => {
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }
                }}
                onPointerCancel={(event) => {
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }
                }}
                onKeyDown={(event) => handleDividerKey(index, event)}
              >
                {isActive ? <i aria-hidden="true">↔</i> : null}
              </span>
            </article>
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
