import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../app/experiments/shared/gem-hero-field.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { heroEtaAtTime, heroSignedLoss, HERO_ANCHOR, HERO_TARGET, HERO_STUDENT } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

test("hero pauses at zero for four seconds each cycle and spans zero to five", () => {
  for (const time of [0, 1, 2, 3, 4, 28, 29, 31, 32]) assert.equal(heroEtaAtTime(time), 0);
  assert.ok(Math.abs(heroEtaAtTime(16) - 5) < 1e-12);
  for (let t = 0; t < 56; t += .01) {
    assert.ok(heroEtaAtTime(t) >= 0 && heroEtaAtTime(t) <= 5);
    assert.ok(Math.abs(heroEtaAtTime(t + .01) - heroEtaAtTime(t)) < .005);
  }
});

test("the fixed student velocity crosses the hinge when its weighted distances match", () => {
  const dPlus = Math.hypot(HERO_STUDENT.x - HERO_ANCHOR.x, HERO_STUDENT.y - HERO_ANCHOR.y);
  const dMinus = Math.hypot(HERO_STUDENT.x - HERO_TARGET.x, HERO_STUDENT.y - HERO_TARGET.y);
  const crossing = dPlus / dMinus;
  assert.ok(Math.abs(heroSignedLoss(HERO_STUDENT, crossing)) < 1e-12);
  assert.ok(heroSignedLoss(HERO_STUDENT, crossing - .1) > 0);
  assert.ok(heroSignedLoss(HERO_STUDENT, crossing + .1) < 0);
});
