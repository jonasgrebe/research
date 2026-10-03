export type ContourPoint = { x: number; y: number };
export type LossContour = {
  level: number;
  segments: readonly (readonly [ContourPoint, ContourPoint])[];
  path: string;
  singleton?: ContourPoint;
};

// Fixed velocity units: changing eta or moving a teacher never rescales the loss.
export const VELOCITY_UNIT = 100;
export const CONTOUR_LEVELS = [0.5, 1, 1.5, 2] as const;
export const SIGNED_CONTOUR_LEVELS = [-2, -1.5, -1, -0.5, ...CONTOUR_LEVELS] as const;

// Extend the contour field across the displayed loss range while preserving the
// original labeled levels. A bounded number of "nice" intervals keeps dragging
// responsive even when the signed landscape spans large negative values.
export function landscapeContourLevels(anchor: ContourPoint, target: ContourPoint, eta: number, width: number, height: number, clipAtZero = true, origin: ContourPoint = { x: 0, y: 0 }, targetIntervals = 24) {
  const values = [anchor, target, ...Array.from({ length: 81 }, (_, i) => ({
    x: origin.x + (i % 9) * width / 8,
    y: origin.y + Math.floor(i / 9) * height / 8,
  }))].map(point => gemLoss(point, anchor, target, eta, clipAtZero));
  const minimum = Math.min(0, ...values);
  const maximum = Math.max(0, ...values);
  const major: readonly number[] = clipAtZero ? CONTOUR_LEVELS : SIGNED_CONTOUR_LEVELS;
  if (maximum - minimum < 1e-10) return [...major];
  const desired = (maximum - minimum) / targetIntervals;
  const magnitude = 10 ** Math.floor(Math.log10(desired));
  const fraction = desired / magnitude;
  const step = (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10) * magnitude;
  const first = Math.floor(minimum / step);
  const last = Math.ceil(maximum / step);
  const minor = Array.from({ length: last - first + 1 }, (_, i) => Number(((first + i) * step).toPrecision(12))).filter(level => Math.abs(level) > 1e-12);
  return [...new Set([...minor, ...major])].sort((a, b) => a - b);
}

export function gemLoss(point: ContourPoint, anchor: ContourPoint, target: ContourPoint, eta: number, clipAtZero = true) {
  const signed = (Math.hypot(point.x - anchor.x, point.y - anchor.y)
    - eta * Math.hypot(point.x - target.x, point.y - target.y)) / VELOCITY_UNIT;
  return clipAtZero ? Math.max(0, signed) : signed;
}

// Sample a triangular mesh to avoid the ambiguous saddle cells of marching
// squares. Include both foci in the mesh so a small closed level set around a
// teacher endpoint still has an interior vertex. Refine each crossed edge using
// the actual distance loss rather than linear interpolation of sampled values.
export function lossContours(anchor: ContourPoint, target: ContourPoint, eta: number, width: number, height: number, clipAtZero = true, origin: ContourPoint = { x: 0, y: 0 }, levels: readonly number[] = clipAtZero ? CONTOUR_LEVELS : SIGNED_CONTOUR_LEVELS): LossContour[] {
  const coordinates = (extent: number, extra: number[]) => [...new Set([
    ...Array.from({ length: Math.ceil(extent / 4) }, (_, i) => i * 4), extent,
    ...extra.filter((value) => value > 0 && value < extent),
  ])].sort((a, b) => a - b);
  const xs = coordinates(width, [anchor.x - origin.x, target.x - origin.x]).map(x => x + origin.x);
  const ys = coordinates(height, [anchor.y - origin.y, target.y - origin.y]).map(y => y + origin.y);
  const cols = xs.length;
  const points = ys.flatMap((y) => xs.map((x) => ({ x, y })));
  const values = points.map((point) => gemLoss(point, anchor, target, eta, clipAtZero));
  const triangles: [number, number, number][] = [];
  for (let y = 0; y < ys.length - 1; y++) {
    for (let x = 0; x < cols - 1; x++) {
      const a = y * cols + x;
      triangles.push([a, a + 1, a + cols + 1], [a, a + cols + 1, a + cols]);
    }
  }

  return levels.map((level) => {
    const separation = Math.hypot(anchor.x - target.x, anchor.y - target.y);
    const heightAtTarget = separation / VELOCITY_UNIT;
    if (eta >= 1 && level > heightAtTarget + 1e-12) return { level, segments: [], path: "" };
    if (eta >= 1 && Math.abs(level - heightAtTarget) < 1e-12) {
      // The maximum is attained at T alone when eta>1, or along the ray
      // extending from T away from A when eta=1 (triangle-inequality equality).
      if (eta > 1) return { level, segments: [], path: "", singleton: target };
      const dx = (target.x - anchor.x) / separation;
      const dy = (target.y - anchor.y) / separation;
      const reach = Math.min(
        dx > 0 ? (origin.x + width - target.x) / dx : dx < 0 ? (origin.x - target.x) / dx : Infinity,
        dy > 0 ? (origin.y + height - target.y) / dy : dy < 0 ? (origin.y - target.y) / dy : Infinity,
      );
      const end = { x: target.x + reach * dx, y: target.y + reach * dy };
      return { level, segments: [[target, end]], path: `M${target.x},${target.y}L${end.x},${end.y}` };
    }
    const intersections = new Map<string, ContourPoint>();
    const segments: [ContourPoint, ContourPoint][] = [];
    const crossing = (i: number, j: number): ContourPoint => {
      const key = i < j ? `${i}:${j}` : `${j}:${i}`;
      const cached = intersections.get(key);
      if (cached) return cached;
      const start = points[i];
      const end = points[j];
      if (values[i] === level) return start;
      if (values[j] === level) return end;
      let lo = 0;
      let hi = 1;
      const startAbove = values[i] > level;
      for (let iteration = 0; iteration < 18; iteration++) {
        const t = (lo + hi) / 2;
        const point = { x: start.x + t * (end.x - start.x), y: start.y + t * (end.y - start.y) };
        if ((gemLoss(point, anchor, target, eta, clipAtZero) > level) === startAbove) lo = t;
        else hi = t;
      }
      const t = (lo + hi) / 2;
      const point = { x: start.x + t * (end.x - start.x), y: start.y + t * (end.y - start.y) };
      intersections.set(key, point);
      return point;
    };
    for (const [a, b, c] of triangles) {
      const hit: ContourPoint[] = [];
      for (const [i, j] of [[a, b], [b, c], [c, a]]) {
        if ((values[i] >= level) !== (values[j] >= level)) hit.push(crossing(i, j));
      }
      if (hit.length === 2 && Math.hypot(hit[0].x - hit[1].x, hit[0].y - hit[1].y) > 1e-7) {
        segments.push([hit[0], hit[1]]);
      }
    }
    return {
      level,
      segments,
      path: segments.map(([a, b]) => `M${a.x.toFixed(3)},${a.y.toFixed(3)}L${b.x.toFixed(3)},${b.y.toFixed(3)}`).join(""),
    };
  });
}
