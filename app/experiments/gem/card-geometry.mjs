/** @typedef {{x:number, y:number}} Point */
export const anchor = {x:164, y:156};
export const target = {x:147, y:55};
const nearTarget = {x:120, y:76};
const nearAnchor = {x:126, y:144};

/** @param {Point} a @param {Point} b */
export const distance = (a,b) => Math.hypot(a.x-b.x, a.y-b.y);

// On this segment the anchor distance decreases and the target distance
// increases. Their ratio crosses every displayed weight exactly once.
/** @param {number} eta */
export function studentOnBoundary(eta) {
  /** @param {number} progress */
  const at = (progress) => ({
    x:nearTarget.x + progress*(nearAnchor.x-nearTarget.x),
    y:nearTarget.y + progress*(nearAnchor.y-nearTarget.y),
  });
  let low = 0, high = 1;
  for (let step = 0; step < 24; step++) {
    const mid = (low + high)/2;
    const point = at(mid);
    if (distance(point,anchor) > eta*distance(point,target)) low = mid;
    else high = mid;
  }
  return at((low + high)/2);
}

const stops = [[0,.65],[1200,.65],[3200,1],[5900,1],[8000,1.55],[9200,1.55],[12800,.65]];

/** @param {number} elapsedSeconds */
export function repulsionWeightAt(elapsedSeconds) {
  const time = Math.round(elapsedSeconds*1000) % stops[stops.length-1][0];
  const next = stops.findIndex(([end]) => end > time);
  const [start, from] = stops[next-1], [end, to] = stops[next];
  const t = (time-start)/(end-start);
  return Number((from+(to-from)*t*t*(3-2*t)).toFixed(2));
}
