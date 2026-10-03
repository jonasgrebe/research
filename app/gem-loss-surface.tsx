"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LossContour } from "./gem-loss-contours";
import "./gem-loss-surface.css";

type Point = { x: number; y: number };
type Camera = { yaw: number; elevation: number };
type Sample = Point & { loss: number };
type Projected = Point & { depth: number };
type Props = {
  points: { anchor: Point; target: Point; student: Point };
  lossAt: (point: Point) => number;
  contours: readonly LossContour[];
};

const WIDTH = 780;
const HEIGHT = 500;
const DOMAIN_MIN_X = -215;
const DOMAIN_MAX_X = 985;
const DOMAIN_MIN_Y = -210;
const DOMAIN_MAX_Y = 590;
const X_TICKS = [-3, 0, 3, 6, 9];
const Y_TICKS = [-2, 0, 2, 4, 6];
const INITIAL_CAMERA: Camera = { yaw: -.48, elevation: .61 };
const CORNERS = [{ x: DOMAIN_MIN_X, y: DOMAIN_MIN_Y }, { x: DOMAIN_MAX_X, y: DOMAIN_MIN_Y }, { x: DOMAIN_MAX_X, y: DOMAIN_MAX_Y }, { x: DOMAIN_MIN_X, y: DOMAIN_MAX_Y }];
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));
const format = (value: number) => Math.abs(value) < 1e-8 ? "0" : Number(value.toFixed(2)).toString();
const path = (points: readonly Point[], close = false) => points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join("") + (close ? "Z" : "");

function coordinates(minimum: number, maximum: number, spacing: number, foci: number[]) {
  return [...new Set([
    ...Array.from({ length: Math.ceil((maximum - minimum) / spacing) }, (_, index) => minimum + index * spacing), maximum,
    ...foci.flatMap(value => [-6, -3, -1, 0, 1, 3, 6].map(offset => value + offset)).filter(value => value > minimum && value < maximum),
  ])].sort((a, b) => a - b);
}

function tickScale(minimum: number, maximum: number) {
  const minimumWithZero = Math.min(0, minimum);
  const maximumWithZero = Math.max(0, maximum);
  if (maximumWithZero - minimumWithZero < 1e-8) return { low: 0, high: 1, ticks: [0, .25, .5, .75, 1] };
  const raw = (maximumWithZero - minimumWithZero) / 5;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const fraction = raw / magnitude;
  const step = (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10) * magnitude;
  const low = Math.floor(minimumWithZero / step) * step;
  const high = Math.ceil(maximumWithZero / step) * step;
  const ticks = Array.from({ length: Math.round((high - low) / step) + 1 }, (_, index) => low + index * step);
  return { low, high, ticks };
}

export function GemLossSurface({ points, lossAt, contours }: Props) {
  const id = useId().replace(/:/g, "");
  const [camera, setCamera] = useState<Camera>(INITIAL_CAMERA);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ pointerId: number; x: number; y: number; camera: Camera } | null>(null);
  const surface = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const repaint = useRef<(() => void) | null>(null);
  const cameraFrame = useRef<number | null>(null);
  const pendingCamera = useRef<Camera | null>(null);
  const surfaceLevels = useMemo(() => [...new Set(contours.map(contour => contour.level).filter(level => Math.abs(level) > 1e-10))].sort((a, b) => a - b), [contours]);

  const mesh = useMemo(() => {
    // Include the exact teacher endpoints and nearby coordinates so narrow
    // distance-function peaks are not lost between uniform grid vertices.
    const xs = coordinates(DOMAIN_MIN_X, DOMAIN_MAX_X, 18, [points.anchor.x, points.target.x, points.student.x]);
    const ys = coordinates(DOMAIN_MIN_Y, DOMAIN_MAX_Y, 18, [points.anchor.y, points.target.y, points.student.y]);
    const samples: Sample[] = ys.flatMap(y => xs.map(x => ({ x, y, loss: lossAt({ x, y }) })));
    const triangles: [number, number, number][] = [];
    for (let row = 0; row < ys.length - 1; row++) {
      for (let col = 0; col < xs.length - 1; col++) {
        const a = row * xs.length + col;
        const b = a + 1;
        const c = a + xs.length;
        const d = c + 1;
        if ((row + col) % 2) triangles.push([a, b, c], [b, d, c]);
        else triangles.push([a, b, d], [a, d, c]);
      }
    }
    const values = samples.map(sample => sample.loss);
    return { samples, triangles, ...tickScale(Math.min(...values), Math.max(...values)) };
  }, [lossAt, points.anchor.x, points.anchor.y, points.target.x, points.target.y, points.student.x, points.student.y]);

  const scene = useMemo(() => {
    const cos = Math.cos(camera.yaw);
    const sin = Math.sin(camera.yaw);
    const cosElevation = Math.cos(camera.elevation);
    const sinElevation = Math.sin(camera.elevation);
    const xDirection = sin >= 0 ? 1 : -1;
    const yDirection = cos >= 0 ? 1 : -1;
    const frontX = sin >= 0 ? DOMAIN_MAX_X : DOMAIN_MIN_X;
    const frontY = cos >= 0 ? DOMAIN_MAX_Y : DOMAIN_MIN_Y;
    const rawProject = (point: Point, loss: number): Projected => {
      const x = (point.x - (DOMAIN_MIN_X + DOMAIN_MAX_X) / 2) / 100;
      const y = (point.y - (DOMAIN_MIN_Y + DOMAIN_MAX_Y) / 2) / 100;
      const z = (loss - mesh.low) / (mesh.high - mesh.low) * 3.6;
      const horizontal = x * cos - y * sin;
      const groundDepth = x * sin + y * cos;
      return { x: horizontal, y: groundDepth * sinElevation - z * cosElevation, depth: groundDepth * cosElevation + z * sinElevation };
    };
    // Fit the actual surface, base and axis—not an empty bounding cuboid.
    // Axis-label anchors take part in the fit; fixed screen margins protect text.
    const bounds = [
      ...mesh.samples.map(sample => rawProject(sample, sample.loss)),
      ...CORNERS.map(point => rawProject(point, mesh.low)),
      ...(mesh.low < 0 ? CORNERS.map(point => rawProject(point, 0)) : []),
      rawProject({ x: frontX, y: frontY }, mesh.high),
      ...X_TICKS.map(value => rawProject({ x: 85 + value * 100, y: frontY + yDirection * 75 }, mesh.low)),
      ...Y_TICKS.map(value => rawProject({ x: frontX + xDirection * 84, y: 390 - value * 100 }, mesh.low)),
    ];
    const minX = Math.min(...bounds.map(point => point.x));
    const maxX = Math.max(...bounds.map(point => point.x));
    const minY = Math.min(...bounds.map(point => point.y));
    const maxY = Math.max(...bounds.map(point => point.y));
    const scale = Math.min((WIDTH - 150) / (maxX - minX), (HEIGHT - 106) / (maxY - minY));
    const project = (point: Point, loss: number): Projected => {
      const value = rawProject(point, loss);
      return { x: WIDTH / 2 + (value.x - (minX + maxX) / 2) * scale, y: 42 + (value.y - minY) * scale, depth: value.depth };
    };
    const projected = mesh.samples.map(sample => project(sample, sample.loss));
    const faces = mesh.triangles.map((indices, index) => {
      const losses = indices.map(i => mesh.samples[i].loss);
      return {
        index,
        points: indices.map(i => projected[i]),
        losses,
        depth: indices.reduce((sum, i) => sum + projected[i].depth, 0) / 3,
        loss: (losses[0] + losses[1] + losses[2]) / 3,
      };
    }).sort((a, b) => a.depth - b.depth);
    return { project, faces, frontX, frontY, xDirection, yDirection };
  }, [camera, mesh]);

  // Rasterize only the dense facets. SVG retains crisp, accessible axes,
  // contours and prediction markers without tens of thousands of DOM nodes.
  useLayoutEffect(() => {
    repaint.current = () => {
      const element = canvas.current;
      if (!element) return;
      const context = element.getContext("2d");
      if (!context) return;
      const rect = element.getBoundingClientRect();
      const density = Math.min(window.devicePixelRatio || 1, 3);
      const width = Math.max(1, Math.round(rect.width * density));
      const height = Math.max(1, Math.round(rect.height * density));
      if (element.width !== width || element.height !== height) { element.width = width; element.height = height; }
      context.setTransform(width / WIDTH, 0, 0, height / HEIGHT, 0, 0);
      context.clearRect(0, 0, WIDTH, HEIGHT);
      const style = getComputedStyle(element);
      const readColor = (property: string) => {
        const color = style.getPropertyValue(property).trim().replace("#", "");
        return [0, 2, 4].map(index => parseInt(color.slice(index, index + 2), 16));
      };
      const negativeColor = readColor("--gem-surface-negative");
      const zeroColor = readColor("--gem-surface-zero");
      const positiveColor = readColor("--gem-surface-positive");
      const contourColor = readColor("--text");
      const ramp = (end: number[]) => Array.from({ length: 257 }, (_, step) => `rgb(${zeroColor.map((start, channel) => Math.round(start + (end[channel] - start) * step / 256)).join(",")})`);
      const negativeRamp = ramp(negativeColor);
      const positiveRamp = ramp(positiveColor);
      context.lineWidth = .42;
      context.lineJoin = "round";
      for (const face of scene.faces) {
        const fraction = face.loss < 0 ? face.loss / Math.min(-1e-12, mesh.low) : face.loss / Math.max(1e-12, mesh.high);
        const color = (face.loss < 0 ? negativeRamp : positiveRamp)[Math.round(clamp(fraction, 0, 1) * 256)];
        context.beginPath();
        context.moveTo(face.points[0].x, face.points[0].y);
        context.lineTo(face.points[1].x, face.points[1].y);
        context.lineTo(face.points[2].x, face.points[2].y);
        context.closePath();
        context.fillStyle = color;
        context.strokeStyle = color;
        context.lineWidth = .42;
        context.fill();
        context.stroke();
        // Draw each contour fragment in its facet's painter layer. Subsequent
        // nearer facets occlude it, unlike a wireframe drawn over the surface.
        const minimum = Math.min(...face.losses);
        const maximum = Math.max(...face.losses);
        if (maximum - minimum < 1e-12) continue;
        for (const level of surfaceLevels) {
          if (level < minimum) continue;
          if (level > maximum) break;
          const crossings: Point[] = [];
          for (const [a, b] of [[0, 1], [1, 2], [2, 0]]) {
            if ((face.losses[a] >= level) === (face.losses[b] >= level)) continue;
            const t = (level - face.losses[a]) / (face.losses[b] - face.losses[a]);
            crossings.push({ x: face.points[a].x + t * (face.points[b].x - face.points[a].x), y: face.points[a].y + t * (face.points[b].y - face.points[a].y) });
          }
          if (crossings.length !== 2) continue;
          const major = [.5, 1, 1.5, 2].some(value => Math.abs(Math.abs(level) - value) < 1e-8);
          context.strokeStyle = `rgba(${contourColor.join(",")},${major ? .43 : .2})`;
          context.lineWidth = major ? .85 : .5;
          context.beginPath();
          context.moveTo(crossings[0].x, crossings[0].y);
          context.lineTo(crossings[1].x, crossings[1].y);
          context.stroke();
        }
      }
    };
    repaint.current();
  }, [scene, surfaceLevels, mesh.low, mesh.high]);

  useEffect(() => {
    const redraw = () => repaint.current?.();
    const resize = new ResizeObserver(redraw);
    if (surface.current) resize.observe(surface.current);
    const theme = new MutationObserver(redraw);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", redraw);
    return () => {
      resize.disconnect();
      theme.disconnect();
      window.removeEventListener("resize", redraw);
      if (cameraFrame.current !== null) cancelAnimationFrame(cameraFrame.current);
    };
  }, []);

  const { project } = scene;
  const zeroStop = -mesh.low / (mesh.high - mesh.low) * 100;
  const legendGradient = `linear-gradient(90deg, ${mesh.low < 0 ? 'var(--gem-surface-negative)' : 'var(--gem-surface-zero)'} 0%, var(--gem-surface-zero) ${zeroStop}%, ${mesh.high > 0 ? 'var(--gem-surface-positive)' : 'var(--gem-surface-zero)'} 100%)`;
  const studentLoss = lossAt(points.student);
  const student = project(points.student, studentLoss);
  const studentZero = project(points.student, 0);
  const surfacePoints = {
    anchor: project(points.anchor, lossAt(points.anchor)),
    target: project(points.target, lossAt(points.target)),
    student,
  };
  // Reserve screen-space label boxes using the larger mobile font dimensions.
  // Teacher labels remain distinct even when predictions share one endpoint.
  const labelBoxes: { x: number; y: number; width: number; height: number }[] = [];
  const pointLabels = (['student', 'anchor', 'target'] as const).map(name => {
    const point = surfacePoints[name];
    const text = name === 'student' ? `Student · L = ${format(studentLoss)}` : name === 'anchor' ? 'Anchor' : 'Target';
    const width = name === 'student' ? 225 : 82;
    const candidates = [{ dx: 14, dy: -19 }, { dx: -width - 14, dy: 26 }, { dx: 14, dy: 40 }, { dx: -width - 14, dy: -37 }, { dx: -width / 2, dy: 69 }];
    const scored = candidates.map(({ dx, dy }, index) => {
      const box = { x: clamp(point.x + dx, 20, WIDTH - width - 20), y: clamp(point.y + dy - 20, 15, HEIGHT - 40), width, height: 26 };
      const intersection = (other: typeof box) => Math.max(0, Math.min(box.x + box.width + 7, other.x + other.width) - Math.max(box.x - 7, other.x)) * Math.max(0, Math.min(box.y + box.height + 5, other.y + other.height) - Math.max(box.y - 5, other.y));
      const collisions = labelBoxes.reduce((sum, other) => sum + intersection(other), 0)
        + Object.values(surfacePoints).reduce((sum, other) => sum + intersection({ x: other.x - 11, y: other.y - 11, width: 22, height: 22 }), 0);
      return { box, score: collisions * 100 + index };
    });
    const best = scored.reduce((current, option) => option.score < current.score ? option : current).box;
    labelBoxes.push(best);
    return { name, text, x: best.x, y: best.y + 20 };
  });
  const base = CORNERS.map(point => project(point, mesh.low));
  const axisCorner = { x: scene.frontX, y: scene.frontY };
  const axisBottom = project(axisCorner, mesh.low);
  const axisTop = project(axisCorner, mesh.high);
  const projectedContours = useMemo(() => contours.filter(contour => contour.segments.length || contour.singleton).map(contour => ({
    ...contour,
    drawing: contour.segments.map(([start, end]) => path([project(start, mesh.low), project(end, mesh.low)])).join(""),
  })), [contours, project, mesh.low]);

  const endDrag = (event: PointerEvent<SVGSVGElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const rotateKeys = (event: KeyboardEvent<SVGSVGElement>) => {
    const step = event.shiftKey ? .14 : .07;
    if (event.key === "Home") { event.preventDefault(); setCamera(INITIAL_CAMERA); return; }
    const change = event.key === "ArrowLeft" ? { yaw: -step, elevation: 0 }
      : event.key === "ArrowRight" ? { yaw: step, elevation: 0 }
      : event.key === "ArrowUp" ? { yaw: 0, elevation: step }
      : event.key === "ArrowDown" ? { yaw: 0, elevation: -step } : null;
    if (!change) return;
    event.preventDefault();
    setCamera(current => ({ yaw: current.yaw + change.yaw, elevation: clamp(current.elevation + change.elevation, .25, 1.23) }));
  };

  return <div className="gem-loss-surface" ref={surface}>
    <div className="gem-surface-topline"><button type="button" onClick={() => setCamera(INITIAL_CAMERA)}>Reset view</button></div>
    <svg className="gem-surface-canvas" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="group" tabIndex={0}
      aria-label="Rotatable three-dimensional GEM loss surface" aria-describedby={`${id}-instructions ${id}-scale`}
      data-dragging={dragging} onKeyDown={rotateKeys}
      onPointerDown={event => {
        if (event.button !== 0 || !event.isPrimary) return;
        event.preventDefault();
        event.currentTarget.focus();
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, camera };
        setDragging(true);
      }}
      onPointerMove={event => {
        const start = drag.current;
        if (!start || start.pointerId !== event.pointerId) return;
        const width = event.currentTarget.getBoundingClientRect().width;
        if (!width) return;
        pendingCamera.current = { yaw: start.camera.yaw + (event.clientX - start.x) / width * 3.5, elevation: clamp(start.camera.elevation - (event.clientY - start.y) / width * 2.2, .25, 1.23) };
        if (cameraFrame.current === null) cameraFrame.current = requestAnimationFrame(() => {
          if (pendingCamera.current) setCamera(pendingCamera.current);
          pendingCamera.current = null;
          cameraFrame.current = null;
        });
      }} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={() => { drag.current = null; setDragging(false); }}>
      <title>GEM loss over student velocity predictions</title>
      <desc>The mesh samples the same loss function over a wider velocity range. Height and color encode loss on an automatically fitted scale: zero and negative loss are blue, and increasing positive loss shifts toward red. Teacher marker colors identify the anchor and target independently of the surface color. All three markers lie on the surface at their exact loss values. Contours follow the surface and are also projected onto the base.</desc>
      <path d={path(base, true)} className="gem-surface-base" />
      <g className="gem-surface-grid">
        {Array.from({ length: 13 }, (_, i) => DOMAIN_MIN_X + i * 100).map(x => <path key={`x${x}`} d={path([project({ x, y: DOMAIN_MIN_Y }, mesh.low), project({ x, y: DOMAIN_MAX_Y }, mesh.low)])} />)}
        {Array.from({ length: 9 }, (_, i) => DOMAIN_MIN_Y + i * 100).map(y => <path key={`y${y}`} d={path([project({ x: DOMAIN_MIN_X, y }, mesh.low), project({ x: DOMAIN_MAX_X, y }, mesh.low)])} />)}
      </g>
      {mesh.low < 0 && <path d={path(CORNERS.map(point => project(point, 0)), true)} className="gem-surface-zero-plane"><title>L = 0 reference plane</title></path>}
      <foreignObject className="gem-surface-mesh" x="0" y="0" width={WIDTH} height={HEIGHT} aria-hidden="true" data-facet-count={scene.faces.length}>
        <canvas ref={canvas} width={WIDTH} height={HEIGHT} />
      </foreignObject>
      <g className="gem-surface-projected-contours" aria-label={`Contours projected onto the base at loss ${format(mesh.low)}`}>
        {projectedContours.map(contour => <g key={contour.level} className={[.5, 1, 1.5, 2].some(value => Math.abs(Math.abs(contour.level) - value) < 1e-8) ? "is-major" : "is-minor"}>
          {contour.drawing && <path d={contour.drawing}><title>Projected contour: L = {format(contour.level)}</title></path>}
          {contour.singleton && <circle cx={project(contour.singleton, mesh.low).x} cy={project(contour.singleton, mesh.low).y} r="2.5" />}
        </g>)}
      </g>
      <path d={path(base, true)} className="gem-surface-base-outline" />
      <g className="gem-surface-axes" aria-label="Velocity axes in units of 100 diagram pixels; vertical axis in loss units">
        <path d={path([axisBottom, axisTop])} />
        {mesh.ticks.map(tick => { const point = project(axisCorner, tick); return <g key={tick}><path d={`M${point.x},${point.y}h-6`} /><text x={point.x - 11} y={point.y + 4} textAnchor="end">{format(tick)}</text></g>; })}
        <text x={axisTop.x - 11} y={axisTop.y - 13} textAnchor="end" className="gem-surface-axis-name">L</text>
        {X_TICKS.map(value => { const point = project({ x: 85 + value * 100, y: scene.frontY + scene.yDirection * 31 }, mesh.low); return <text key={value} x={point.x} y={point.y + 7} textAnchor="middle">{value}</text>; })}
        {Y_TICKS.map(value => { const point = project({ x: scene.frontX + scene.xDirection * 31, y: 390 - value * 100 }, mesh.low); return <text key={value} x={point.x} y={point.y + 4} textAnchor={scene.xDirection > 0 ? "start" : "end"}>{value}</text>; })}
        {(() => { const point = project({ x: 385, y: scene.frontY + scene.yDirection * 75 }, mesh.low); return <text className="gem-surface-axis-name" x={point.x} y={point.y + 9} textAnchor="middle">v₁</text>; })()}
        {(() => { const point = project({ x: scene.frontX + scene.xDirection * 84, y: 190 }, mesh.low); return <text className="gem-surface-axis-name" x={point.x} y={point.y + 4} textAnchor={scene.xDirection > 0 ? "start" : "end"}>v₂</text>; })()}
      </g>
      <g className="gem-surface-teachers">
        {(["anchor", "target"] as const).map(name => { const point = surfacePoints[name]; return <g className={`gem-surface-${name}`} key={name} aria-label={`${name === 'anchor' ? 'Anchor' : 'Target'} loss ${lossAt(points[name]).toFixed(3)}`}>
          <circle cx={point.x} cy={point.y} r={name === 'anchor' ? 7 : 5} />
          <title>{`${name === 'anchor' ? 'Anchor' : 'Target'} · L = ${format(lossAt(points[name]))}`}</title>
        </g>; })}
      </g>
      <g className="gem-surface-student" aria-label={`Student loss ${studentLoss.toFixed(3)}`}>
        <path d={path([studentZero, student])} />
        <circle className="gem-surface-student-zero" cx={studentZero.x} cy={studentZero.y} r="3" />
        <circle cx={student.x} cy={student.y} r="6" />
      </g>
      <g className="gem-surface-point-labels">{pointLabels.map(label => <text key={label.name} className={`gem-surface-${label.name}`} x={label.x} y={label.y}>{label.text}</text>)}</g>
    </svg>
    <div className="gem-surface-scale" id={`${id}-scale`}>
      <div className="gem-surface-color-key" role="img" aria-label={`Loss scale from ${format(mesh.low)} to ${format(mesh.high)}: zero and negative loss are blue, increasing positive loss shifts toward red`}>
        <span>{format(mesh.low)}</span><i style={{ background: legendGradient }}>{mesh.low < 0 && mesh.high > 0 ? <span style={{ left: `${zeroStop}%` }}>0</span> : null}</i><span>{format(mesh.high)}</span>
      </div>
      <span>Height and color: loss · scale adjusts</span>
    </div>
    <p className="gem-surface-instructions" id={`${id}-instructions`}>Drag or use arrow keys to rotate. Markers show exact surface values; contours are projected onto the base. Edit velocities in 2D.</p>
  </div>;
}
