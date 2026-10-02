import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../app/gem-loss-contours.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { lossContours } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
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
