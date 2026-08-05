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
  assert.match(html, /aria-label="Filter projects by author"/);
  assert.match(html, /href="\/tobias\/"/);
  assert.match(html, /href="\/jonas\/"/);
  assert.match(html, /href="\/hossein\/"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("renders shareable person-specific project views", async () => {
  const tobiasResponse = await render("/tobias");
  assert.equal(tobiasResponse.status, 200);
  const tobiasHtml = await tobiasResponse.text();
  assert.match(tobiasHtml, /<title>Tobias Braun · Overview<\/title>/i);
  assert.match(tobiasHtml, /<h1[^>]*>Tobias Braun<\/h1>/);
  assert.match(tobiasHtml, /08(?:<!-- -->)? works/);
  assert.match(tobiasHtml, /href="\/tobias\/"[^>]*aria-current="page"/);

  const jonasResponse = await render("/jonas");
  assert.equal(jonasResponse.status, 200);
  const jonasHtml = await jonasResponse.text();
  assert.match(jonasHtml, /<h1[^>]*>Jonas Grebe<\/h1>/);
  assert.match(jonasHtml, /06(?:<!-- -->)? works/);
  assert.match(jonasHtml, /Open project: VETO:/);
  assert.match(jonasHtml, /Open project: Erased but Not Forgotten:/);
  assert.doesNotMatch(jonasHtml, /Open project: DEFAME:/);
  assert.doesNotMatch(jonasHtml, /Open project: InFact:/);

  const hosseinResponse = await render("/hossein");
  assert.equal(hosseinResponse.status, 200);
  const hosseinHtml = await hosseinResponse.text();
  assert.match(hosseinHtml, /<h1[^>]*>Hossein Shakibania<\/h1>/);
  assert.match(hosseinHtml, /03(?:<!-- -->)? works/);
  assert.match(hosseinHtml, /Open project: VETO:/);
  assert.match(hosseinHtml, /Open project: Obliviate:/);
  assert.match(hosseinHtml, /Open project: Token by Token, Compromised:/);
  assert.doesNotMatch(hosseinHtml, /Open project: GEM:/);
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
  assert.match(infactHtml, /project-page accent-amber/);
  assert.match(infactHtml, /FEVER 2024/);
  assert.match(infactHtml, /aclanthology\.org\/2024\.fever-1\.12/);
  assert.match(infactHtml, /multimodal-ai-lab\/DEFAME\/tree\/v1\.0\.0/);
});

test("links each project to its official lab code repository", async () => {
  const expected = [
    ["/projects/veto", "multimodal-ai-lab/VETO"],
    ["/projects/gem", "multimodal-ai-lab/GEM"],
    ["/projects/obliviate", "multimodal-ai-lab/Obliviate"],
    ["/projects/erased-but-not-forgotten", "multimodal-ai-lab/EEB"],
  ];

  for (const [path, repository] of expected) {
    const response = await render(path);
    const html = await response.text();
    assert.match(html, new RegExp(`github\\.com/${repository}`));
  }
});

test("presents a balanced interactive VetoBench sample gallery", async () => {
  const response = await render("/projects/veto");
  const html = await response.text();

  assert.match(html, /huggingface\.co\/datasets\/MAI-Lab\/VetoBench/);
  assert.match(html, /arxiv\.org\/abs\/2607\.27292/);
  assert.match(html, /Dataset \/ VetoBench/);
  assert.match(html, /Protection against open-frame misuse/);
  assert.match(html, /Hover or tap an image to reveal the FLUX\.2 edit/);
  assert.match(html, />General</);
  assert.match(html, />Defamation</);
  assert.match(html, />Gore</);
  assert.match(html, /02 closed · 02 open/);
  assert.match(html, /vetobench\/general\/images\/base\/0\.png/);
  assert.match(html, /vetobench\/defamation\/images\/edited\/59\.png/);
  assert.match(html, /vetobench\/gore\/images\/edited\/64\.png/);
  assert.match(html, /vetobench\/general\/images\/protected\/0\.png/);
  assert.match(
    html,
    /vetobench\/gore\/images\/protected-edited\/64\.png/,
  );
  assert.match(html, /role="switch"/);
  assert.match(html, /aria-checked="false"/);
  assert.match(html, />Enable VETO protection</);
  assert.match(html, /data-protection="false"/);
  assert.match(html, /project-intro page-shell/);
  assert.match(html, /veto-visual/);
  assert.ok(
    html.indexOf("03 / Abstract") <
      html.indexOf("Protection against open-frame misuse"),
  );
  assert.ok(
    html.indexOf("04 / Contributions") <
      html.indexOf("Protection against open-frame misuse"),
  );
  assert.ok(
    html.indexOf("Protection against open-frame misuse") <
      html.indexOf("Selected finding"),
  );
  assert.equal((html.match(/aria-pressed="false"/g) ?? []).length, 12);
});

test("uses the requested VetoBench label colors", async () => {
  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  for (const color of ["#54bc69", "#6c5342", "#d68000", "#9d290f"]) {
    assert.match(css, new RegExp(color));
  }

  assert.match(
    css,
    /\.vetobench-card\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;/s,
  );
  assert.match(
    css,
    /\.vetobench-grid\s*\{[^}]*align-items:\s*stretch;/s,
  );
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

test("marks InFact's first two authors as equal contributors", async () => {
  const response = await render("/projects/infact");
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
