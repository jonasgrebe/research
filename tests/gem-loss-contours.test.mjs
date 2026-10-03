import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../app/gem-loss-contours.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { gemLoss, landscapeContourLevels, lossContours } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const a = { x: 555, y: 125 };
const t = { x: 275, y: 145 };
const norm = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);

test("positive contours satisfy the actual distance loss across the full eta range", () => {
  for (const eta of [0, .05, .5, .95, 1, 1.05, 2, 3, 5]) {
    const contours = lossContours(a, t, eta, 780, 450);
    for (const contour of contours) {
      assert.ok(contour.segments.length > 0);
      for (const [p, q] of contour.segments) {
        for (const endpoint of [p, q]) {
          assert.ok(Math.abs((norm(endpoint, a) - eta * norm(endpoint, t)) / 100 - contour.level) < 1e-5);
        }
        const midpoint = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
        assert.ok(Math.abs((norm(midpoint, a) - eta * norm(midpoint, t)) / 100 - contour.level) < .012);
      }
    }
  }
});

test("eta zero gives circles around the anchor, independently of the target", () => {
  for (const contour of lossContours(a, t, 0, 780, 450)) {
    for (const [p] of contour.segments) assert.ok(Math.abs(norm(p, a) - contour.level * 100) < .001);
  }
});

test("coincident teachers yield circles below eta one and no positive contours above it", () => {
  const shared = { x: 350, y: 200 };
  for (const contour of lossContours(shared, shared, .5, 780, 450)) {
    for (const [p] of contour.segments) assert.ok(Math.abs(norm(p, shared) - contour.level * 200) < .001);
  }
  for (const eta of [1, 2, 5]) {
    assert.ok(lossContours(shared, shared, eta, 780, 450).every((contour) => !contour.path && !contour.singleton));
  }
});

test("maximum-level rays and singleton points are represented exactly", () => {
  const anchor = { x: 400, y: 200 };
  const target = { x: 300, y: 200 };
  const equal = lossContours(anchor, target, 1, 780, 450);
  assert.deepEqual(equal.find((c) => c.level === 1).segments, [[target, { x: 0, y: 200 }]]);
  assert.ok(equal.filter((c) => c.level > 1).every((c) => !c.path));
  const weighted = lossContours(anchor, target, 5, 780, 450);
  assert.deepEqual(weighted.find((c) => c.level === 1).singleton, target);
  assert.ok(weighted.filter((c) => c.level > 1).every((c) => !c.path && !c.singleton));
});

test("tiny enclosed positive-loss contours are not missed between mesh samples", () => {
  const target = { x: 249.99, y: 200 };
  const contour = lossContours({ x: 300, y: 200 }, target, 5, 780, 450)[0];
  assert.ok(contour.segments.length > 0);
  for (const [p, q] of contour.segments) {
    assert.ok(norm(p, target) < .01 && norm(q, target) < .01);
  }
});

test("disabling clipping preserves positive values and exposes negative loss", () => {
  for (const eta of [0, .5, 1, 2, 5]) {
    for (const point of [a, t, { x: 345, y: 300 }, { x: 0, y: 450 }]) {
      const expected = (norm(point, a) - eta * norm(point, t)) / 100;
      assert.equal(gemLoss(point, a, t, eta, false), expected);
      assert.equal(gemLoss(point, a, t, eta), Math.max(0, expected));
    }
  }
  assert.ok(gemLoss(a, a, t, 1, false) < 0);
});

test("signed contours track negative and positive levels across eta and coincident teachers", () => {
  for (const [anchor, target] of [[a, t], [a, a]]) {
    for (const eta of [0, .5, 1, 1.05, 3, 5]) {
      for (const contour of lossContours(anchor, target, eta, 780, 450, false)) {
        for (const segment of contour.segments) {
          for (const point of segment) {
            const expected = (norm(point, anchor) - eta * norm(point, target)) / 100;
            assert.ok(Math.abs(expected - contour.level) < 1e-5);
          }
        }
      }
    }
  }
  assert.ok(lossContours(a, t, 1, 780, 450, false).some(c => c.level < 0 && c.segments.length > 0));
  assert.ok(lossContours(a, a, 1, 780, 450, false).every(c => c.segments.length === 0));
});

test("expanded 3D support keeps contour values and maximum-level rays in velocity coordinates", () => {
  const origin = { x: -215, y: -210 };
  const expanded = lossContours(a, t, 1, 1200, 800, false, origin);
  assert.ok(expanded.some(c => c.segments.some(s => s.some(p => p.x < 0 || p.y < 0 || p.x > 780 || p.y > 450))));
  for (const contour of expanded) {
    for (const segment of contour.segments) {
      for (const point of segment) {
        assert.ok(Math.abs((norm(point, a) - norm(point, t)) / 100 - contour.level) < 1e-5);
        assert.ok(point.x >= -215 && point.x <= 985 && point.y >= -210 && point.y <= 590);
      }
    }
  }
  const ray = lossContours({ x: 400, y: 200 }, { x: 300, y: 200 }, 1, 1200, 800, true, origin).find(c => c.level === 1);
  assert.deepEqual(ray.segments, [[{ x: 300, y: 200 }, { x: -215, y: 200 }]]);
});

test("minor contours extend across the visible loss range without replacing labeled levels", () => {
  const origin = { x: -215, y: -210 };
  for (const clipped of [true, false]) {
    const levels = landscapeContourLevels(a, t, 5, 1200, 800, clipped, origin);
    for (const major of [.5, 1, 1.5, 2]) assert.ok(levels.includes(major));
    assert.ok(levels.length <= 36);
    assert.ok(!levels.includes(0));
    if (!clipped) assert.ok(levels[0] < -10);
    const contours = lossContours(a, t, 5, 1200, 800, clipped, origin, levels);
    assert.ok(contours.filter(c => c.segments.length).length > 4);
    for (const contour of contours) {
      for (const [point] of contour.segments) assert.ok(Math.abs(gemLoss(point, a, t, 5, clipped) - contour.level) < 1e-5);
    }
  }
});
