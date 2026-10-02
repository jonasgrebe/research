import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../app/obliviate-guidance.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
const { conceptLogits, referenceLogits, softmax, guidedDistribution } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

function approximatelyEqual(actual, expected, message) {
  assert.ok(Math.abs(actual - expected) < 1e-12, `${message}: ${actual} versus ${expected}`);
}

test("Obliviate probabilities are normalized throughout the displayed guidance range", () => {
  for (let step = 0; step <= 60; step += 1) {
    const eta = step / 20;
    const { probabilities } = guidedDistribution(eta);
    assert.equal(probabilities.length, conceptLogits.length);
    assert.ok(probabilities.every((value) => Number.isFinite(value) && value > 0 && value < 1));
    approximatelyEqual(probabilities.reduce((sum, value) => sum + value, 0), 1, `eta ${eta}`);
  }
});

test("zero guidance reproduces the reference logits and distribution", () => {
  const reference = guidedDistribution(0);
  assert.deepEqual(reference.logits, referenceLogits);
  assert.deepEqual(reference.probabilities, softmax(referenceLogits));
});

test("guided logits follow the paper's contrast without clipping negative values", () => {
  const expectedAtOne = [2.3, 2.55, -0.8, 2.6, 2.2, 2.6, 2.45, 2.5];
  const expectedAtThree = [3.2, 2.95, -5.5, 3.5, 3.2, 2.9, 3.35, 3.1];
  for (const [eta, expected] of [[1, expectedAtOne], [3, expectedAtThree]]) {
    guidedDistribution(eta).logits.forEach((value, index) => {
      approximatelyEqual(value, expected[index], `eta ${eta}, token ${index + 1}`);
    });
  }
});

test("the highlighted token becomes less probable as negative guidance increases", () => {
  const highlighted = 2;
  const concept = softmax(conceptLogits);
  let previous = guidedDistribution(0).probabilities[highlighted];
  assert.ok(previous < concept[highlighted]);
  for (let step = 1; step <= 60; step += 1) {
    const probability = guidedDistribution(step / 20).probabilities[highlighted];
    assert.ok(probability < previous, `eta ${step / 20} should lower the highlighted probability`);
    previous = probability;
  }
});

test("softmax is stable under a large common logit offset", () => {
  const base = softmax(referenceLogits);
  for (const offset of [-1000, 1000]) {
    softmax(referenceLogits.map((value) => value + offset)).forEach((value, index) => {
      approximatelyEqual(value, base[index], `offset ${offset}, token ${index + 1}`);
    });
  }
});
