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
  assert.match(html, /Theme:/);
  assert.match(html, /aria-label="Back to all projects"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("renders every project page", async () => {
  for (const [path, title] of [
    ["/projects/veto", "Protecting Images"],
    ["/projects/fighting-fire-with-fire", "Protecting Exercises"],
    ["/projects/gem", "Geometric Erasure"],
    ["/projects/obliviate", "Erasing Concepts"],
    ["/projects/token-by-token", "Backdoor Vulnerabilities"],
    ["/projects/erased-but-not-forgotten", "Backdoors Compromise"],
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

test("marks GEM and Token by Token's first two authors as equal contributors", async () => {
  for (const path of ["/projects/gem", "/projects/token-by-token"]) {
    const response = await render(path);
    const html = await response.text();
    const markers = html.match(/aria-label="equal contribution"/g) ?? [];
    assert.equal(markers.length, 2);
    assert.match(html, /\* Equal contribution/);
  }
});

test("links author names to Google Scholar", async () => {
  const response = await render("/projects/gem");
  const html = await response.text();
  assert.match(html, /aria-label="View Jonas Henry Grebe on Google Scholar"/);
  assert.match(html, /aria-label="View Anna Rohrbach on Google Scholar"/);
  assert.match(html, /scholar\.google\.com\/citations/);
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
