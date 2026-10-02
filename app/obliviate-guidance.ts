// An illustrative eight-token vocabulary, not predictions from a trained model.
export const conceptLogits = [1.4, 2.15, 3.9, 1.7, 1.2, 2.3, 1.55, 1.9];
export const referenceLogits = [1.85, 2.35, 1.55, 2.15, 1.7, 2.45, 2.0, 2.2];

export function softmax(logits: readonly number[]) {
  const maximum = Math.max(...logits);
  const weights = logits.map((value) => Math.exp(value - maximum));
  const total = weights.reduce((sum, value) => sum + value, 0);
  return weights.map((value) => value / total);
}

export function guidedDistribution(eta: number) {
  const logits = referenceLogits.map((value, index) => value - eta * (conceptLogits[index] - value));
  return { logits, probabilities: softmax(logits) };
}
