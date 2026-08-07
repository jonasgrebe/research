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
  assert.match(html, /Theme: light/);
  assert.doesNotMatch(html, /Theme: system/i);
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
    const visibleText = html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ");
    assert.doesNotMatch(visibleText, /\b(?:Figure|Fig\.)\s*[A-Z0-9]+\b/i);
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
  assert.match(html, /05 \/ VetoBench/);
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
  assert.equal((html.match(/class="vetobench-card"/g) ?? []).length, 12);
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

test("renders the interactive Fighting Fire conceptual approach", async () => {
  const response = await render("/projects/fighting-fire-with-fire");
  const html = await response.text();
  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(html, /05 \/ Conceptual approach/);
  assert.match(html, /Create a human-solvable, AI-resistant region/);
  assert.match(html, /≥ 95%/);
  assert.match(html, />Before intervention</);
  assert.match(html, />After intervention</);
  assert.match(html, /Protected region/);
  assert.match(html, /fire-protected-connector/);
  assert.match(html, /fire-transition-arrow/);
  assert.equal(
    (html.match(/class="fire-venn-card fire-venn-/g) ?? []).length,
    2,
  );
  assert.ok(
    html.indexOf("04 / Contributions") <
      html.indexOf("05 / Conceptual approach"),
  );
  assert.doesNotMatch(html, /<svg/i);
  assert.match(html, /06 \/ Methodology framework/);
  assert.match(html, /From a candidate question to a protected assignment/);
  assert.doesNotMatch(html, /Interactive figure|Protection geometry/);
  assert.match(html, /images\/fire-mitochondrion\.png/);
  assert.match(html, /images\/fire-mitochondrion-protected\.png/);
  assert.match(html, />Candidate question</);
  assert.match(html, />Adversarial steering</);
  assert.match(html, />Calibrate target probability</);
  assert.match(html, />Protected assignment</);
  assert.match(html, /Accessible surrogate ensemble/);
  assert.match(html, /Statistical detector/);
  assert.equal((html.match(/class="fire-process-node /g) ?? []).length, 11);
  assert.match(html, /id="fire-process-explainer"/);
  assert.match(
    css,
    /\.fire-venn-grid\s*\{[^}]*border:\s*1px solid var\(--line\);/s,
  );
  assert.match(
    css,
    /\.fire-venn-card\s*\{[^}]*border:\s*0;/s,
  );
  assert.match(
    css,
    /\.fire-protected-region\s*\{[^}]*top:\s*31%;[^}]*left:\s*30%;[^}]*width:\s*58%;[^}]*height:\s*56%;[^}]*mask:\s*radial-gradient/s,
  );
  assert.match(css, /\.bound-node > span\s*\{[^}]*font-size:\s*12px;/s);
  assert.match(css, /\.bound-node > b\s*\{[^}]*font-size:\s*13px;/s);
  assert.match(css, /\.detector-node strong\s*\{[^}]*font-size:\s*13px;/s);
  assert.match(css, /\.detector-node small\s*\{[^}]*font-size:\s*11px;/s);
});

test("numbers project sections consistently", async () => {
  const standardProjects = ["defame", "infact"];
  const standardSections = [
    "01 / Key message",
    "02 / Method",
    "03 / Abstract",
    "04 / Contributions",
    "05 / Citation",
  ];

  const assertSectionOrder = (html, sections, slug) => {
    let previousIndex = -1;
    for (const section of sections) {
      const index = html.indexOf(section);
      assert.ok(index > previousIndex, `${slug}: ${section} should be in order`);
      previousIndex = index;
    }
  };

  for (const slug of standardProjects) {
    const response = await render(`/projects/${slug}`);
    assertSectionOrder(await response.text(), standardSections, slug);
  }

  for (const slug of ["token-by-token", "erased-but-not-forgotten"]) {
    const response = await render(`/projects/${slug}`);
    assertSectionOrder(
      await response.text(),
      [
        ...standardSections.slice(0, 4),
        "05 / Interactive analysis",
        "06 / Citation",
      ],
      slug,
    );
  }

  const obliviateResponse = await render("/projects/obliviate");
  assertSectionOrder(
    await obliviateResponse.text(),
    [
      ...standardSections.slice(0, 4),
      "05 / Qualitative results",
      "06 / Interactive analysis",
      "07 / Citation",
    ],
    "obliviate",
  );

  const gemResponse = await render("/projects/gem");
  assertSectionOrder(
    await gemResponse.text(),
    [
      ...standardSections.slice(0, 4),
      "05 / Qualitative results",
      "06 / Interactive analysis",
      "07 / Citation",
    ],
    "gem",
  );

  const vetoResponse = await render("/projects/veto");
  assertSectionOrder(
    await vetoResponse.text(),
    [
      ...standardSections.slice(0, 4),
      "05 / VetoBench",
      "06 / Interactive analysis",
      "07 / Citation",
    ],
    "veto",
  );

  const fireResponse = await render("/projects/fighting-fire-with-fire");
  assertSectionOrder(
    await fireResponse.text(),
    [
      ...standardSections.slice(0, 4),
      "05 / Conceptual approach",
      "06 / Methodology framework",
      "07 / Citation",
    ],
    "fighting-fire-with-fire",
  );
});

test("renders GEM's five paired concept-erasure comparisons", async () => {
  const response = await render("/projects/gem");
  const html = await response.text();

  assert.match(html, /Concept erasure, seen directly/);
  assert.match(html, /FLUX · unsafe base/);
  assert.match(html, /GEM · safe variant/);
  assert.match(html, /Drag each image divider independently/);
  assert.match(html, /type="range"/);
  assert.equal((html.match(/role="slider"/g) ?? []).length, 5);
  assert.equal((html.match(/aria-valuenow="50"/g) ?? []).length, 5);
  assert.equal((html.match(/aria-hidden="true">↔<\/i>/g) ?? []).length, 1);
  assert.equal((html.match(/--gem-reveal:50%/g) ?? []).length, 5);
  assert.equal((html.match(/class="gem-comparison-card"/g) ?? []).length, 5);
  assert.match(
    html,
    /class="gem-comparison-card"[^>]*data-position="0"[^>]*data-active="true"/,
  );
  assert.equal((html.match(/images\/gem-showcase\/base\//g) ?? []).length, 5);
  assert.equal((html.match(/images\/gem-showcase\/gem\//g) ?? []).length, 5);
  assert.equal((html.match(/class="gem-base-badge">FLUX/g) ?? []).length, 5);
  assert.equal((html.match(/class="gem-safe-badge">GEM/g) ?? []).length, 5);
  assert.match(html, /Erasure target/);
  assert.match(html, /Erasure target · (?:<!-- -->)?01/);
  assert.match(html, /❌ bloody gore/);
  assert.doesNotMatch(html, /gem-card-caption/);
  for (const concept of ["bloody gore", "nudity", "rights-protected"]) {
    assert.match(html, new RegExp(concept));
  }
});

test("renders Obliviate's paired LIQUID concept-erasure comparisons", async () => {
  const response = await render("/projects/obliviate");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Erasure across model families/);
  assert.match(html, />LIQUID</);
  assert.match(html, />EMU3</);
  assert.match(html, />Brand</);
  const categoryOrder = ["Gore", "Nudity", "Brand"].map((label) =>
    html.indexOf(`>${label}</button>`),
  );
  assert.ok(categoryOrder.every((index) => index >= 0));
  assert.deepEqual(categoryOrder, [...categoryOrder].sort((a, b) => a - b));
  assert.doesNotMatch(html, /Artist style|Van Gogh style/);
  assert.match(html, /Drag the front image divider/);
  assert.equal((html.match(/class="obliviate-comparison-card"/g) ?? []).length, 3);
  assert.equal((html.match(/role="slider"/g) ?? []).length, 3);
  assert.equal((html.match(/aria-valuenow="50"/g) ?? []).length, 3);
  assert.equal((html.match(/obliviate-showcase\/liquid\/gore\//g) ?? []).length, 6);
  assert.match(html, /05 \/ Qualitative results/);
  assert.match(html, /07 \/ Citation/);
});

test("renders the requested additional interactive visualizations for each paper", async () => {
  const expected = [
    ["veto", "Why reference attention is the weak point", "Six cells, grounded in real source–instruction pairs", 2],
    ["gem", "Geometry, not just suppression", "Several influential states, one parallel pass", 2],
    ["token-by-token", "Watch a trigger travel across modalities", "Follow the compromise token by token", 3],
    ["obliviate", "Teach the whole visual-token trajectory", "A smooth target over visual-token choices", 2],
    ["erased-but-not-forgotten", "Erased through one route, reachable through another", "The deeper the link, the harder it is to erase incidentally", 2],
  ];

  for (const [slug, sectionTitle, secondVisualization, visualizationCount] of expected) {
    const response = await render(`/projects/${slug}`);
    const html = await response.text();
    assert.match(html, new RegExp(sectionTitle));
    assert.match(html, new RegExp(secondVisualization));
    assert.equal(
      (html.match(/class="viz-lab /g) ?? []).length,
      visualizationCount,
      `${slug} should render the expected visualization labs`,
    );
  }

  const tokenHtml = await (await render("/projects/token-by-token")).text();
  assert.match(tokenHtml, /Token-by-token attack trace/);
  assert.match(tokenHtml, /McDonald/);
  assert.match(tokenHtml, /Black-box Unified Attack/);
  assert.match(tokenHtml, /White-box image-generation attacks/);
  assert.match(tokenHtml, /tobac-whitebox\/smoking-01\.jpg/);
  assert.match(tokenHtml, /tobac-link-mark/);
  const visualizationSource = await readFile(
    new URL("../app/paper-visualizations.tsx", import.meta.url),
    "utf8",
  );
  assert.match(visualizationSource, /The trigger enters as an ordinary prompt token/);
  for (const image of ["mcdonalds", "pear", "pride", "smoking"]) {
    assert.match(visualizationSource, new RegExp(`tobac-chat/${image}\\.png`));
  }

  const vetoHtml = await (await render("/projects/veto")).text();
  assert.match(vetoHtml, /Spatial attention/);
  assert.match(vetoHtml, /From localized attention to a diffuse field/);
  assert.doesNotMatch(vetoHtml, /retrieval/i);
  assert.match(vetoHtml, /VetoBench structure/);
  assert.match(vetoHtml, /vetobench\/defamation\/images\/base\/59\.png/);
  const vetoBenchExtras = JSON.parse(
    await readFile(
      new URL("../app/vetobench-extra-samples.json", import.meta.url),
      "utf8",
    ),
  );
  assert.equal(Object.keys(vetoBenchExtras).length, 6);
  for (const samples of Object.values(vetoBenchExtras)) {
    assert.equal(samples.length, 10);
  }
  assert.match(vetoHtml, /huggingface\.co\/datasets\/MAI-Lab\/VetoBench/);
  assert.match(vetoHtml, /canvas queries → source keys/);
  assert.doesNotMatch(vetoHtml, /Source → canvas/);
  assert.match(vetoHtml, /type="range"/);
  assert.match(vetoHtml, /epsilon 0/);

  const gemHtml = await (await render("/projects/gem")).text();
  assert.equal((gemHtml.match(/class="gem-local-field /g) ?? []).length, 2);
  assert.match(gemHtml, /Current latent x/);
  assert.match(gemHtml, /only the black combination changes/i);
  assert.match(gemHtml, /Isolated trajectory states/);
  assert.match(gemHtml, /Full-trajectory use/);

  const obliviateHtml = await (await render("/projects/obliviate")).text();
  assert.match(obliviateHtml, /Training ablation/);
  assert.match(obliviateHtml, /Original next-token logits/);
  assert.match(obliviateHtml, /Teacher unconditional/);
  assert.match(obliviateHtml, /Construct guided target/);
  assert.match(obliviateHtml, /Negative-guided teacher/);

  const eebHtml = await (
    await render("/projects/erased-but-not-forgotten")
  ).text();
  assert.match(eebHtml, /hidden route survives/i);
  assert.match(eebHtml, /Conceptual Overview/);
  assert.match(eebHtml, /Rickrolling the Artist/);
  assert.match(eebHtml, /EvilEdit/);
  assert.match(visualizationSource, /Following EvilEdit, only cross-attention key\/value projections are edited; the text encoder stays frozen/);
  assert.match(eebHtml, /ESD/);
  assert.match(eebHtml, /AdvUnlearn/);
});

test("links the Fighting Fire arXiv paper", async () => {
  const response = await render("/projects/fighting-fire-with-fire");
  const html = await response.text();

  assert.match(html, /arxiv\.org\/abs\/2608\.01112/);
  assert.match(html, /arXiv:2608\.01112/);
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
