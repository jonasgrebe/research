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

export function gemLoss(point: ContourPoint, anchor: ContourPoint, target: ContourPoint, eta: number) {
  return Math.max(0, Math.hypot(point.x - anchor.x, point.y - anchor.y)
    - eta * Math.hypot(point.x - target.x, point.y - target.y)) / VELOCITY_UNIT;
}

// Sample a triangular mesh to avoid the ambiguous saddle cells of marching
// squares. Include both foci in the mesh so a small closed level set around a
// teacher endpoint still has an interior vertex. Refine each crossed edge using
// the actual distance loss rather than linear interpolation of sampled values.
export function lossContours(anchor: ContourPoint, target: ContourPoint, eta: number, width: number, height: number): LossContour[] {
  const coordinates = (extent: number, extra: number[]) => [...new Set([
    ...Array.from({ length: Math.ceil(extent / 4) }, (_, i) => i * 4), extent,
    ...extra.filter((value) => value > 0 && value < extent),
  ])].sort((a, b) => a - b);
  const xs = coordinates(width, [anchor.x, target.x]);
  const ys = coordinates(height, [anchor.y, target.y]);
  const cols = xs.length;
  const points = ys.flatMap((y) => xs.map((x) => ({ x, y })));
  const values = points.map((point) => gemLoss(point, anchor, target, eta));
  const triangles: [number, number, number][] = [];
  for (let y = 0; y < ys.length - 1; y++) {
    for (let x = 0; x < cols - 1; x++) {
      const a = y * cols + x;
      triangles.push([a, a + 1, a + cols + 1], [a, a + cols + 1, a + cols]);
    }
  }

  return CONTOUR_LEVELS.map((level) => {
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
        dx > 0 ? (width - target.x) / dx : dx < 0 ? -target.x / dx : Infinity,
        dy > 0 ? (height - target.y) / dy : dy < 0 ? -target.y / dy : Infinity,
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
        if ((gemLoss(point, anchor, target, eta) > level) === startAbove) lo = t;
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
