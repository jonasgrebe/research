import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the minimal project index", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Overview<\/title>/i);
  assert.match(html, />Overview</);
  assert.doesNotMatch(html, /Research Index/);
  assert.match(html, /GEM/);
  assert.match(html, /VETO/);
  assert.match(html, /Fighting Fire with Fire/);
  assert.match(html, /Obliviate/);
  assert.match(html, /Token by Token/);
  assert.match(html, /Erased but Not Forgotten/);
  assert.match(html, /DEFAME/);
  assert.match(html, /InFact/);
  assert.match(html, /08(?:<!-- -->)? works/);
  assert.match(html, /Theme:/);
  assert.match(html, /aria-label="Back to all projects"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("orders the overview by recency", async () => {
  const response = await render();
  const html = await response.text();
  const projectLabels = [
    "Open project: VETO:",
    "Open project: Fighting Fire with Fire:",
    "Open project: Obliviate:",
    "Open project: GEM:",
    "Open project: Token by Token, Compromised:",
    "Open project: Erased but Not Forgotten:",
    "Open project: DEFAME:",
    "Open project: InFact:",
  ];

  let previousIndex = -1;
  for (const label of projectLabels) {
    const index = html.indexOf(label);
    assert.ok(index > previousIndex, `${label} should appear in overview order`);
    previousIndex = index;
  }
});

test("renders every project page", async () => {
  for (const [path, title] of [
    ["/projects/veto", "Protecting Images"],
    ["/projects/fighting-fire-with-fire", "Protecting Exercises"],
    ["/projects/gem", "Geometric Erasure"],
    ["/projects/obliviate", "Erasing Concepts"],
    ["/projects/token-by-token", "Backdoor Vulnerabilities"],
    ["/projects/erased-but-not-forgotten", "Backdoors Compromise"],
    ["/projects/defame", "Dynamic Evidence-based"],
    ["/projects/infact", "Strong Baseline"],
  ]) {
    const response = await render(path);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(title));
    assert.match(html, />Abstract</);
    assert.match(html, /Copy BibTeX/);
  }
});

test("does not publish attached preprint files", async () => {
  for (const path of ["/projects/veto", "/projects/fighting-fire-with-fire"]) {
    const response = await render(path);
    const html = await response.text();
    assert.doesNotMatch(html, /\/papers\//);
  }
});

test("labels Obliviate as an ECCV poster", async () => {
  const response = await render("/projects/obliviate");
  const html = await response.text();
  assert.match(html, /ECCV 2026/);
  assert.match(html, />Poster</);
});

test("publishes the public DEFAME and InFact resources", async () => {
  const defameResponse = await render("/projects/defame");
  const defameHtml = await defameResponse.text();
  assert.match(defameHtml, /ICML 2025/);
  assert.match(defameHtml, />Poster</);
  assert.match(defameHtml, /arxiv\.org\/abs\/2412\.10510/);
  assert.match(defameHtml, /multimodal-ai-lab\/DEFAME/);

  const infactResponse = await render("/projects/infact");
  const infactHtml = await infactResponse.text();
  assert.match(infactHtml, /FEVER 2024/);
  assert.match(infactHtml, /aclanthology\.org\/2024\.fever-1\.12/);
  assert.match(infactHtml, /multimodal-ai-lab\/DEFAME\/tree\/v1\.0\.0/);
});

test("marks GEM and Token by Token's first two authors as equal contributors", async () => {
  for (const path of ["/projects/gem", "/projects/token-by-token"]) {
    const response = await render(path);
    const html = await response.text();
    const markers = html.match(/aria-label="equal contribution"/g) ?? [];
    assert.equal(markers.length, 2);
    assert.match(html, /\* Equal contribution/);
  }
});

test("marks DEFAME's first two authors as equal contributors", async () => {
  const response = await render("/projects/defame");
  const html = await response.text();
  const markers = html.match(/aria-label="equal contribution"/g) ?? [];
  assert.equal(markers.length, 2);
  assert.match(html, /\* Equal contribution/);
});

test("links author names to Google Scholar", async () => {
  const gemResponse = await render("/projects/gem");
  const gemHtml = await gemResponse.text();
  assert.match(
    gemHtml,
    /aria-label="View Jonas Henry Grebe on Google Scholar"/,
  );
  assert.match(gemHtml, /user=dvz7WRQAAAAJ/);
  assert.match(gemHtml, /user=wqVWJNIAAAAJ/);
  assert.match(gemHtml, /aria-label="View Anna Rohrbach on Google Scholar"/);

  const fireResponse = await render("/projects/fighting-fire-with-fire");
  const fireHtml = await fireResponse.text();
  assert.match(fireHtml, /aria-label="View Jonas Grebe on Google Scholar"/);
  assert.match(fireHtml, /user=XS4GbYkAAAAJ/);
});

test("keeps Obliviate tokens stationary in card interaction states", async () => {
  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(
    css,
    /\.project-card:(?:hover|focus-visible)\s+\.token\.(?:target|safe)[^{]*\{[^}]*transform/i,
  );
  assert.doesNotMatch(css, /\.site-wordmark::after/);
});
