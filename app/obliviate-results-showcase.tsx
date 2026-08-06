"use client";

import { useState } from "react";

type ModelKey = "liquid" | "emu3";
type CategoryKey = "brand" | "gore" | "nudity" | "van_gogh_one_sample_only";

const models: Array<{ id: ModelKey; label: string }> = [
  { id: "liquid", label: "LIQUID" },
  { id: "emu3", label: "EMU3" },
];

const categories: Array<{
  id: CategoryKey;
  label: string;
  target: string;
  description: string;
  count: number;
}> = [
  {
    id: "brand",
    label: "Brands",
    target: "rights-protected brands",
    description: "Brand-specific visual identity is erased while the surrounding scene remains generatable.",
    count: 3,
  },
  {
    id: "gore",
    label: "Gore",
    target: "bloody gore",
    description: "Graphic content is redirected toward a non-graphic interpretation of the prompt.",
    count: 3,
  },
  {
    id: "nudity",
    label: "Nudity",
    target: "nudity",
    description: "Explicit content is removed without suppressing the model's broader visual capabilities.",
    count: 3,
  },
  {
    id: "van_gogh_one_sample_only",
    label: "Artist style",
    target: "Van Gogh style",
    description: "The artist-specific style is erased while the subject and general painterly character remain.",
    count: 1,
  },
];

function comparisonKey(model: ModelKey, category: CategoryKey, index: number) {
  return `${model}-${category}-${index}`;
}

function positionFromActive(index: number, active: number, count: number) {
  if (count <= 1) return 0;
  const wrapped = (index - active + count) % count;
  return wrapped > Math.floor(count / 2) ? wrapped - count : wrapped;
}

export function ObliviateResultsShowcase() {
  const [model, setModel] = useState<ModelKey>("liquid");
  const [category, setCategory] = useState<CategoryKey>("brand");
  const [activeIndex, setActiveIndex] = useState(0);
  const [reveals, setReveals] = useState<Record<string, number>>({});
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const activeCategory = categories.find((item) => item.id === category) ?? categories[0];
  const activeModel = models.find((item) => item.id === model) ?? models[0];

  const revealFor = (index: number) =>
    reveals[comparisonKey(model, category, index)] ?? 50;

  const setRevealAt = (index: number, value: number) => {
    const nextValue = Math.max(0, Math.min(100, Math.round(value)));
    const key = comparisonKey(model, category, index);
    setReveals((current) => ({ ...current, [key]: nextValue }));
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
    const currentValue = revealFor(index);
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

  const selectModel = (nextModel: ModelKey) => {
    setModel(nextModel);
    setActiveIndex(0);
  };

  const selectCategory = (nextCategory: CategoryKey) => {
    setCategory(nextCategory);
    setActiveIndex(0);
  };

  const rotate = (direction: -1 | 1) => {
    setActiveIndex((current) =>
      (current + direction + activeCategory.count) % activeCategory.count,
    );
  };

  return (
    <section
      className="obliviate-results-section page-shell"
      aria-labelledby="obliviate-results-title"
    >
      <div className="obliviate-results-heading">
        <div>
          <p className="section-number">05 / Qualitative results</p>
          <h2 id="obliviate-results-title">Erasure across model families</h2>
        </div>
        <p>
          Compare base generations with the same prompts after Obliviate. Choose
          a model and erasure target, then drag the image boundary.
        </p>
      </div>

      <div className="obliviate-showcase-controls">
        <div className="obliviate-model-switch" role="group" aria-label="Generative model">
          {models.map((item) => (
            <button
              key={item.id}
              type="button"
              data-active={model === item.id ? "true" : "false"}
              aria-pressed={model === item.id}
              onClick={() => selectModel(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="obliviate-category-switch" role="group" aria-label="Erasure target">
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              data-active={category === item.id ? "true" : "false"}
              aria-pressed={category === item.id}
              onClick={() => selectCategory(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="obliviate-comparison-key" aria-hidden="true">
        <span className="obliviate-key-protected">Obliviate</span>
        <p>Drag the front image divider</p>
        <span className="obliviate-key-base">Base model</span>
      </div>

      <div className="obliviate-comparison-deck" data-count={activeCategory.count}>
        {Array.from({ length: activeCategory.count }, (_, index) => {
          const position = positionFromActive(index, activeIndex, activeCategory.count);
          const isActive = index === activeIndex;
          const reveal = revealFor(index);
          const sampleNumber = index + 1;
          const imageRoot = `${basePath}/images/obliviate-showcase/${model}/${category}`;

          return (
            <article
              className="obliviate-comparison-card"
              key={`${model}-${category}-${sampleNumber}`}
              data-position={position}
              data-active={isActive ? "true" : "false"}
              style={{ "--obliviate-reveal": `${reveal}%` } as React.CSSProperties}
            >
              <button
                type="button"
                className="obliviate-comparison-frame"
                aria-pressed={isActive}
                aria-label={`Bring ${activeModel.label} ${activeCategory.label} example ${sampleNumber} forward`}
                onClick={() => setActiveIndex(index)}
              >
                <img
                  className="obliviate-base-image"
                  src={`${imageRoot}/${sampleNumber}.png`}
                  alt={`${activeModel.label} base generation for ${activeCategory.target}`}
                  loading="lazy"
                  decoding="async"
                />
                <span className="obliviate-base-badge">{activeModel.label}</span>
                <span className="obliviate-erased-layer">
                  <img
                    src={`${imageRoot}/${sampleNumber}_.png`}
                    alt={`${activeModel.label} generation after Obliviate erases ${activeCategory.target}`}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="obliviate-erased-badge">Obliviate</span>
                </span>
              </button>

              <span
                className="obliviate-reveal-divider"
                role="slider"
                tabIndex={0}
                aria-label={`Reveal the Obliviate result for ${activeCategory.target}, example ${sampleNumber}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={reveal}
                aria-valuetext={`${reveal}% Obliviate and ${100 - reveal}% base model`}
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

      <div className="obliviate-active-caption">
        <button
          type="button"
          onClick={() => rotate(-1)}
          aria-label="Previous example"
          disabled={activeCategory.count === 1}
        >
          ←
        </button>
        <div>
          <span>
            {activeModel.label} · Example {String(activeIndex + 1).padStart(2, "0")} / {String(activeCategory.count).padStart(2, "0")}
          </span>
          <strong>{`❌ ${activeCategory.target}`}</strong>
          <p>{activeCategory.description}</p>
        </div>
        <button
          type="button"
          onClick={() => rotate(1)}
          aria-label="Next example"
          disabled={activeCategory.count === 1}
        >
          →
        </button>
      </div>
    </section>
  );
}
