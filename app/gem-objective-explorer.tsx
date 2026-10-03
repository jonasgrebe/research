"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { CONTOUR_LEVELS, gemLoss, landscapeContourLevels, lossContours, SIGNED_CONTOUR_LEVELS, VELOCITY_UNIT } from "./gem-loss-contours";
import { GemLossSurface } from "./gem-loss-surface";
import "./gem-objective-explorer.css";

type Point = { x: number; y: number };
type Prediction = "anchor" | "target" | "student";
type Predictions = Record<Prediction, Point>;
type LabelBox = { x: number; y: number; width: number; height: number };

const W = 780;
const H = 450;
const INITIAL: Predictions = {
  anchor: { x: 555, y: 125 },
  target: { x: 275, y: 145 },
  student: { x: 345, y: 300 },
};
const ORIGIN = { x: 85, y: 390 };
const NAMES: Record<Prediction, string> = {
  anchor: "Teacher anchor",
  target: "Teacher target",
  student: "Student",
};
const SHORT_NAMES: Record<Prediction, string> = { anchor: "Anchor", target: "Target", student: "Student" };
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const clampPoint = (p: Point): Point => ({
  x: Math.max(48, Math.min(W - 48, p.x)),
  y: Math.max(90, Math.min(H - 48, p.y)),
});

function overlap(a: LabelBox, b: LabelBox) {
  return Math.max(0, Math.min(a.x + a.width + 6, b.x + b.width) - Math.max(a.x - 6, b.x))
    * Math.max(0, Math.min(a.y + a.height + 5, b.y + b.height) - Math.max(a.y - 5, b.y));
}

// Keep labels readable when predictions meet or approach a canvas edge. The
// candidate order supplies stable preferences; collisions take precedence.
function placeLabel(point: Point, width: number, occupied: LabelBox[], points: Point[], preference: "left" | "right" | "below" = "right"): LabelBox {
  const height = 26;
  const right = [{ x: point.x + 27, y: point.y - 35 }, { x: point.x + 29, y: point.y + 11 }];
  const left = [{ x: point.x - width - 27, y: point.y - 35 }, { x: point.x - width - 29, y: point.y + 11 }];
  const vertical = [{ x: point.x - width / 2, y: point.y + 30 }, { x: point.x - width / 2, y: point.y - 53 }];
  const nearby = preference === "below" ? [...vertical, ...left, ...right] : preference === "left" ? [...left, ...right, ...vertical] : [...right, ...left, ...vertical];
  const options = [...nearby,
    { x: point.x - width / 2, y: point.y + 64 }, { x: point.x - width / 2, y: point.y - 87 },
    { x: point.x + 64, y: point.y - height / 2 }, { x: point.x - width - 64, y: point.y - height / 2 },
  ];
  const candidates = options.map((candidate, index) => {
    const box = { x: Math.max(16, Math.min(W - width - 16, candidate.x)), y: Math.max(52, Math.min(H - height - 12, candidate.y)), width, height };
    const collisions = occupied.reduce((sum, other) => sum + overlap(box, other), 0)
      + points.reduce((sum, other) => sum + overlap(box, { x: other.x - 23, y: other.y - 23, width: 46, height: 46 }), 0);
    return { box, score: collisions * 20 + distance(point, { x: box.x + width / 2, y: box.y + height / 2 }) * 0.03 + index };
  });
  return candidates.reduce((best, candidate) => candidate.score < best.score ? candidate : best).box;
}

function arrowEnd(start: Point, end: Point) {
  const length = distance(start, end);
  const inset = Math.min(22, length * 0.35);
  return length ? { x: end.x - inset * (end.x - start.x) / length, y: end.y - inset * (end.y - start.y) / length } : end;
}

function distanceToSegment(point: Point, start: Point, end: Point) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared ? Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared)) : 0;
  return distance(point, { x: start.x + t * dx, y: start.y + t * dy });
}

// At eta=1 the Apollonius circle becomes a straight bisector. Clip the viewport
// against the exact distance-difference inequality to draw its zero-loss half-plane.
function zeroHalfPlane(anchor: Point, target: Point) {
  const vertices = [{ x: 0, y: 0 }, { x: W, y: 0 }, { x: W, y: H }, { x: 0, y: H }];
  const signed = (p: Point) => 2 * p.x * (target.x - anchor.x) + 2 * p.y * (target.y - anchor.y)
    + anchor.x ** 2 + anchor.y ** 2 - target.x ** 2 - target.y ** 2;
  const result: Point[] = [];
  vertices.forEach((start, i) => {
    const end = vertices[(i + 1) % vertices.length];
    const a = signed(start);
    const b = signed(end);
    if (a <= 0) result.push(start);
    if ((a < 0 && b > 0) || (a > 0 && b < 0)) {
      const ratio = a / (a - b);
      result.push({ x: start.x + ratio * (end.x - start.x), y: start.y + ratio * (end.y - start.y) });
    }
  });
  return result.map((p) => `${p.x},${p.y}`).join(" ");
}

// Draw only the actual bisector, not the viewport edges used to clip its fill.
function bisectorLine(anchor: Point, target: Point) {
  const separation = distance(anchor, target);
  if (!separation) return null;
  const midpoint = { x: (anchor.x + target.x) / 2, y: (anchor.y + target.y) / 2 };
  const reach = Math.hypot(W, H);
  const dx = (target.y - anchor.y) / separation * reach;
  const dy = (anchor.x - target.x) / separation * reach;
  return { x1: midpoint.x - dx, y1: midpoint.y - dy, x2: midpoint.x + dx, y2: midpoint.y + dy };
}

export function GemObjectiveExplorer() {
  const instance = useId().replace(/:/g, "");
  const [points, setPoints] = useState<Predictions>(INITIAL);
  const [eta, setEta] = useState(1);
  const [clipAtZero, setClipAtZero] = useState(true);
  const [view, setView] = useState<"2d" | "3d">("2d");
  const [dragging, setDragging] = useState<Prediction | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const dragRef = useRef<Prediction | null>(null);
  const { anchor, target, student } = points;
  const positive = distance(student, anchor);
  const negative = eta * distance(student, target);
  const active = positive > negative;
  const lossAt = useCallback((point: Point) => gemLoss(point, anchor, target, eta, clipAtZero), [anchor, target, eta, clipAtZero]);
  const studentLoss = lossAt(student);
  const occupied: LabelBox[] = [];
  const predictionPoints = [anchor, target, student, ORIGIN];
  const labels = {} as Record<Prediction, LabelBox>;
  (['anchor', 'target', 'student'] as const).forEach((name) => {
    labels[name] = placeLabel(points[name], 88, occupied, predictionPoints, name === "target" ? "left" : name === "student" ? "below" : "right");
    occupied.push(labels[name]);
  });
  const positiveLabel = placeLabel({ x: (student.x + anchor.x) / 2, y: (student.y + anchor.y) / 2 }, 30, occupied, predictionPoints, "right");
  if (positive > 88) occupied.push(positiveLabel);
  const negativeLabel = placeLabel({ x: (student.x + target.x) / 2, y: (student.y + target.y) / 2 }, 30, occupied, predictionPoints, "left");
  if (distance(student, target) > 88) occupied.push(negativeLabel);
  const contours = useMemo(() => {
    const width = view === "3d" ? 1200 : W;
    const height = view === "3d" ? 800 : H;
    const origin = view === "3d" ? { x: -215, y: -210 } : { x: 0, y: 0 };
    const levels = landscapeContourLevels(anchor, target, eta, width, height, clipAtZero, origin, view === "2d" ? 10 : 24);
    return lossContours(anchor, target, eta, width, height, clipAtZero, origin, levels);
  }, [anchor, target, eta, clipAtZero, view]);
  const majorLevels: readonly number[] = clipAtZero ? CONTOUR_LEVELS : SIGNED_CONTOUR_LEVELS;
  const vectors = [[ORIGIN, anchor], [ORIGIN, target], [ORIGIN, student], [student, anchor], [student, target]];
  const labeledContours = contours.map((contour) => {
    if (!majorLevels.includes(contour.level)) return { ...contour, major: false, label: undefined };
    let best: { point: Point; box: LabelBox; score: number } | null = null;
    for (let i = 0; i < contour.segments.length; i += 3) {
      const [a, b] = contour.segments[i];
      const point = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      if (point.x < 40 || point.x > W - 40 || point.y < 65 || point.y > H - 35) continue;
      const box = { x: point.x - 29, y: point.y - 12, width: 58, height: 24 };
      const collisions = occupied.some((other) => overlap(box, other) > 0)
        || predictionPoints.some((other) => distance(point, other) < 50);
      if (collisions) continue;
      const nearVector = Math.min(...vectors.map(([start, end]) => distanceToSegment(point, start, end)));
      if (nearVector < 24) continue;
      const score = Math.abs(point.y - H * 0.68) + Math.abs(point.x - W * 0.25) * 0.25;
      if (!best || score < best.score) best = { point, box, score };
    }
    if (best) occupied.push(best.box);
    return { ...contour, major: true, label: best?.point };
  });
  const coincident = anchor.x === target.x && anchor.y === target.y;
  const isBisector = eta === 1;
  const zeroAtSinglePoint = eta === 0 || (coincident && (eta < 1 || (!clipAtZero && eta > 1)));
  const bisector = isBisector ? bisectorLine(anchor, target) : null;
  const circleDenominator = (1 - eta) * (1 + eta);
  // ||s-a|| <= eta ||s-t|| describes the circle interior for eta<1 and
  // its exterior for eta>1. The latter encloses t in the positive-loss disk;
  // this contour is a loss boundary, never a velocity or update direction.
  const circle = isBisector ? null : {
    x: target.x + (anchor.x - target.x) / circleDenominator,
    y: target.y + (anchor.y - target.y) / circleDenominator,
    r: eta * distance(anchor, target) / Math.abs(circleDenominator),
  };
  const clippedDescription = eta === 0
    ? "η = 0: only distance to the anchor matters. Zero loss occurs at the anchor itself."
    : coincident
    ? eta < 1
      ? "The teacher predictions coincide. Only their shared endpoint has zero loss."
      : "The teacher predictions coincide. Every student prediction has zero loss."
    : eta < 1
      ? "η < 1: zero loss inside a circle containing the anchor."
      : eta === 1
        ? "η = 1: zero loss on the anchor side of the perpendicular bisector."
        : "η > 1: zero loss outside the circle. The target lies inside, where the loss is positive.";
  const signedDescription = eta === 0
    ? "η = 0: only distance to the anchor matters. Removing clipping has no effect."
    : coincident
      ? eta === 1
        ? "The teacher predictions coincide: the two distances cancel everywhere."
        : eta < 1
          ? "The teacher predictions coincide. Loss is positive away from their shared endpoint."
          : "The teacher predictions coincide. Loss is negative away from their shared endpoint and unbounded below."
      : eta < 1
        ? "Negative inside the circle, positive outside. The dashed boundary has zero loss."
        : eta === 1
          ? "Negative on the anchor side, positive on the target side. The bisector has zero loss."
          : "Negative outside the circle, positive inside. Without clipping, the loss is unbounded below for η > 1.";
  const regionDescription = clipAtZero ? clippedDescription : signedDescription;

  const movePoint = (name: Prediction, point: Point) => {
    setPoints((current) => ({ ...current, [name]: clampPoint(point) }));
  };
  const fromPointer = (event: PointerEvent<SVGSVGElement>): Point | null => {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return null;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return { x: p.x, y: p.y };
  };
  const startDrag = (event: PointerEvent<SVGGElement>, name: Prediction) => {
    event.preventDefault();
    dragRef.current = name;
    setDragging(name);
    svg.current?.setPointerCapture(event.pointerId);
  };
  const endDrag = () => {
    dragRef.current = null;
    setDragging(null);
  };
  const onKeys = (event: KeyboardEvent<SVGGElement>, name: Prediction) => {
    const step = event.shiftKey ? 20 : 5;
    const delta: Record<string, Point> = {
      ArrowLeft: { x: -step, y: 0 }, ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step }, ArrowDown: { x: 0, y: step },
    };
    if (!delta[event.key]) return;
    event.preventDefault();
    movePoint(name, { x: points[name].x + delta[event.key].x, y: points[name].y + delta[event.key].y });
  };
  const reset = () => {
    setPoints(INITIAL);
    setEta(1);
  };

  return (
    <section className="gem-objective page-shell" aria-labelledby="gem-objective-title">
      <p className="section-number">04 / Objective</p>
      <div className="gem-objective-heading">
        <h2 id="gem-objective-title">GEM in velocity space</h2>
        <p>Each arrow is a predicted change to the same noisy image representation at one timestep. Distances between these velocity predictions define GEM’s loss.</p>
      </div>
      <div className="gem-objective-workspace">
        <div className="gem-objective-canvas">
          {view === "2d" && <div className="gem-objective-canvas-key"><span><i className="gem-objective-region-key" /> {clipAtZero ? "Zero-loss region" : "L ≤ 0 region"}</span><span><i className="gem-objective-contour-key" /> {clipAtZero ? "L = 0.5, 1, 1.5, 2" : "L = ±0.5, ±1, ±1.5, ±2"}</span>{coincident && eta >= 1 ? <span>{clipAtZero || eta === 1 ? "All student velocities have zero loss" : "Zero only at the shared endpoint"}</span> : <span><i className="gem-objective-boundary-key" /> Boundary: d₊ = ηd₋</span>}</div>}
          {view === "3d" ? <GemLossSurface points={points} lossAt={lossAt} contours={contours} /> : <>
          <svg ref={svg} viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Interactive GEM velocity predictions and loss region" aria-describedby={`${instance}-instructions ${instance}-roles ${instance}-region`}
            onPointerMove={(event) => {
              const point = fromPointer(event);
              if (dragRef.current && point) movePoint(dragRef.current, point);
            }} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}>
            <defs>
              <pattern id={`${instance}-grid`} width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="16" cy="16" r=".85" className="gem-objective-grid" /></pattern>
              <clipPath id={`${instance}-bounds`}><rect width={W} height={H} /></clipPath>
              <mask id={`${instance}-zero`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
                <rect width={W} height={H} fill={coincident ? (eta >= 1 ? "white" : "black") : eta > 1 ? "white" : "black"} />
                {!coincident && (isBisector ? <polygon points={zeroHalfPlane(anchor, target)} fill="white" /> : <circle cx={circle!.x} cy={circle!.y} r={circle!.r} fill={eta > 1 ? "black" : "white"} />)}
              </mask>
              {(["anchor", "target", "student"] as const).map((name) => <marker key={name} id={`${instance}-${name}-arrow`} viewBox="0 0 10 10" markerWidth="7" markerHeight="7" refX="8.5" refY="5" orient="auto-start-reverse"><path d="M0 1L9 5L0 9Z" className={`gem-objective-${name}-fill`} /></marker>)}
            </defs>
            <rect width={W} height={H} className="gem-objective-zero-fill" mask={`url(#${instance}-zero)`} />
            <rect width={W} height={H} fill={`url(#${instance}-grid)`} />
            <g clipPath={`url(#${instance}-bounds)`}>
              <g className="gem-objective-contours" aria-label={clipAtZero ? "Positive-loss contours at 0.5, 1.0, 1.5 and 2.0 diagram units" : "Signed-loss contours at plus and minus 0.5, 1.0, 1.5 and 2.0 diagram units"}>
                {labeledContours.filter((contour) => contour.path || contour.singleton).map((contour) => <g key={contour.level} data-loss-level={contour.level} data-major={contour.major} data-negative={contour.level < 0}>
                  {contour.path && <path className="gem-objective-contour" d={contour.path} />}
                  {contour.singleton && <circle className="gem-objective-contour-singleton" cx={contour.singleton.x} cy={contour.singleton.y} r="3"><title>{`Loss ${contour.level.toFixed(1)} occurs only at the target`}</title></circle>}
                  {contour.label && <text className="gem-objective-contour-label" x={contour.label.x} y={contour.label.y} textAnchor="middle" dominantBaseline="central">L = {contour.level.toFixed(1)}</text>}
                </g>)}
              </g>
              {!coincident && (bisector ? <line {...bisector} className="gem-objective-boundary" /> : <circle cx={circle!.x} cy={circle!.y} r={circle!.r} className="gem-objective-boundary" />)}
              <g className="gem-objective-unit" aria-label="Scale: one velocity unit">
                <path d={`M${W - 138},34v-5h${VELOCITY_UNIT}v5`} />
                <text x={W - 88} y="20" textAnchor="middle">1 unit</text>
              </g>
              <line x1={student.x} y1={student.y} x2={anchor.x} y2={anchor.y} className="gem-objective-distance gem-objective-anchor-line" />
              <line x1={student.x} y1={student.y} x2={target.x} y2={target.y} className="gem-objective-distance gem-objective-target-line" />
              {(["anchor", "target", "student"] as const).map((name) => {
                const end = arrowEnd(ORIGIN, points[name]);
                return <line key={name} x1={ORIGIN.x} y1={ORIGIN.y} x2={end.x} y2={end.y} className={`gem-objective-vector gem-objective-${name}-line`} markerEnd={`url(#${instance}-${name}-arrow)`} />;
              })}
              <circle cx={ORIGIN.x} cy={ORIGIN.y} r="4" className="gem-objective-student-fill" />
              <text x={ORIGIN.x - 12} y={ORIGIN.y + 25} className="gem-objective-origin">0</text>
              {positive > 88 && <text x={positiveLabel.x + 2} y={positiveLabel.y + 20} className="gem-objective-distance-label gem-objective-anchor-fill">d₊</text>}
              {distance(student, target) > 88 && <text x={negativeLabel.x + 2} y={negativeLabel.y + 20} className="gem-objective-distance-label gem-objective-target-fill">d₋</text>}
              {(["anchor", "target", "student"] as const).map((name) => {
                const p = points[name];
                const label = labels[name];
                return <g key={name} className={`gem-objective-point gem-objective-point-${name}`} data-dragging={dragging === name} tabIndex={0} role="button"
                  aria-label={`${NAMES[name]} velocity. Drag, or use arrow keys to move.`}
                  onPointerDown={(event) => startDrag(event, name)} onKeyDown={(event) => onKeys(event, name)}>
                  <circle cx={p.x} cy={p.y} r="26" className="gem-objective-hitarea" />
                  <circle cx={p.x} cy={p.y} r="17" className={`gem-objective-handle-ring gem-objective-${name}-line`} />
                  <circle cx={p.x} cy={p.y} r="7" className={`gem-objective-${name}-fill`} />
                  <text x={label.x + 3} y={label.y + 19} className={`gem-objective-point-label gem-objective-${name}-fill`}>{SHORT_NAMES[name]}</text>
                </g>;
              })}
              {zeroAtSinglePoint && <circle cx={anchor.x} cy={anchor.y} r={3} className="gem-objective-zero-point" aria-label="The anchor is the only point with zero loss" />}
            </g>
          </svg>
          <p id={`${instance}-instructions`} className="gem-objective-instructions"><span>{clipAtZero ? "Red contours connect equal positive loss." : "Contours connect equal loss: red is positive, blue is negative."} Fainter lines extend beyond the labeled values.</span><span>Drag a tip · Arrow keys to move · Shift for larger steps</span></p>
          </>}
        </div>

        <div className="gem-objective-controls">
          <div className="gem-objective-toolbar">
            <div className="gem-objective-view-switch" role="group" aria-label="Landscape view">
              <button type="button" aria-pressed={view === "2d"} onClick={() => setView("2d")}>
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 3v14h14M6 12l4-5 5 3" /></svg>
                2D view
              </button>
              <button type="button" aria-pressed={view === "3d"} onClick={() => setView("3d")}>
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m10 2 7 4v8l-7 4-7-4V6l7-4Zm0 8 7-4M10 10 3 6m7 4v8" /></svg>
                3D view
              </button>
            </div>
          </div>
          <div className="gem-objective-equation">
            <code aria-label={clipAtZero ? "GEM loss equals maximum of zero and anchor distance minus eta times target distance" : "Unclipped loss equals anchor distance minus eta times target distance"}>{clipAtZero ? "L = max(0, d₊ − η d₋)" : "L = d₊ − η d₋"}</code>
          </div>
          <label className="gem-objective-clipping"><input type="checkbox" checked={clipAtZero} onChange={(event) => setClipAtZero(event.target.checked)} /><span>Enable Contrastive Hinge</span></label>
          <div className="gem-objective-distances" aria-label="Weighted distance comparison">
            <div><span><i className="gem-objective-anchor-dot" /> Distance to anchor <b>d₊</b></span><div><i className="gem-objective-anchor-bar" style={{ width: `${100 * positive / Math.max(positive, negative, 1)}%` }} /></div></div>
            <div><span><i className="gem-objective-target-dot" /> Weighted target distance <b>η d₋</b></span><div><i className="gem-objective-target-bar" style={{ width: `${100 * negative / Math.max(positive, negative, 1)}%` }} /></div></div>
          </div>
          <p className="gem-objective-state" data-active={active} data-negative={studentLoss < 0} aria-live="polite"><strong>{studentLoss > 0 ? "Positive loss" : studentLoss < 0 ? "Negative loss" : "Zero loss"}</strong><span>L = {studentLoss.toFixed(2)}</span></p>
          <label className="gem-objective-eta" htmlFor={`${instance}-eta`}><span>Repulsion weight</span><output>η = {eta.toFixed(2)}</output></label>
          <input id={`${instance}-eta`} type="range" min="0" max="5" step="0.05" value={eta} aria-label="Repulsion weight eta" aria-describedby={`${instance}-region`} onChange={(event) => setEta(Number(event.target.value))} />
          <div className="gem-objective-scale" aria-hidden="true"><span>0</span><span>5</span></div>
          <p id={`${instance}-region`} className="gem-objective-control-note">{regionDescription}</p>
          <div className="gem-objective-actions"><button type="button" className="gem-objective-reset" onClick={reset}>Reset geometry</button></div>
        </div>
      </div>
      <dl className="gem-objective-roles" id={`${instance}-roles`}>
        <div className="gem-objective-role-target"><dt>Target</dt><dd>Frozen teacher · concept prompt</dd></div>
        <div className="gem-objective-role-anchor"><dt>Anchor</dt><dd>Frozen teacher · benign anchor prompt</dd></div>
        <div className="gem-objective-role-student"><dt>Student</dt><dd>Edited model · concept prompt</dd></div>
      </dl>
      <p className="gem-objective-caption">Both views show a two-dimensional slice at one latent and timestep; height in 3D represents loss. With clipping enabled, increasing η expands the zero-loss region. Turn clipping off to inspect the signed term. GEM trains over several early trajectory steps in parallel. <a href="https://arxiv.org/html/2606.00140v1#S4" target="_blank" rel="noreferrer">Method and objective, Eqs. 13–14 ↗</a></p>
    </section>
  );
}
