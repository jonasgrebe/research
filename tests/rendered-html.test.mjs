import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
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
  assert.match(html, /09(?:<!-- -->)? works/);
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
  assert.match(tobiasHtml, /09(?:<!-- -->)? works/);
  assert.match(tobiasHtml, /href="\/tobias\/"[^>]*aria-current="page"/);

  const jonasResponse = await render("/jonas");
  assert.equal(jonasResponse.status, 200);
  const jonasHtml = await jonasResponse.text();
  assert.match(jonasHtml, /<h1[^>]*>Jonas Grebe<\/h1>/);
  assert.match(jonasHtml, /07(?:<!-- -->)? works/);
  assert.match(jonasHtml, /Open project: VETO:/);
  assert.match(jonasHtml, /Open project: Erased but Not Forgotten:/);
  assert.doesNotMatch(jonasHtml, /Open project: DEFAME:/);
  assert.doesNotMatch(jonasHtml, /Open project: InFact:/);

  const hosseinResponse = await render("/hossein");
  assert.equal(hosseinResponse.status, 200);
  const hosseinHtml = await hosseinResponse.text();
  assert.match(hosseinHtml, /<h1[^>]*>Hossein Shakibania<\/h1>/);
  assert.match(hosseinHtml, /04(?:<!-- -->)? works/);
  assert.match(hosseinHtml, /Open project: VETO:/);
  assert.match(hosseinHtml, /Open project: Obliviate:/);
  assert.match(hosseinHtml, /Open project: Token by Token, Compromised:/);
  assert.doesNotMatch(hosseinHtml, /Open project: GEM:/);
});

test("uses the requested overview order", async () => {
  const response = await render();
  const html = await response.text();
  const projectLabels = [
    "Open project: VETO:",
    "Open project: Fighting Fire with Fire:",
    "Open project: The Poisoned Conversation:",
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
    ["/projects/plw", "Privacy-Leaking Watermarks"],
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
    assert.doesNotMatch(visibleText, /Key message|How it works/);
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

test("explains generic image cloaking and links related work before the editing examples", async () => {
  const html = (await (await render("/projects/veto")).text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  const figure = html.match(/<section class="veto-cloaking-section page-shell"[\s\S]*?<\/section>/)?.[0];
  assert.ok(figure, "the cloaking explanation must be rendered");
  const text = figure.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  assert.match(text, /Data cloaking/);
  assert.match(text, /Weights θ remain frozen/);
  assert.match(text, /Optimize cloak/);
  assert.doesNotMatch(text, /Edit instruction|empty prompt|attention entropy|with VETO/i);
  for (const paper of ["2302.06588", "2311.12066", "2511.00143"]) {
    assert.ok(figure.includes(`https://arxiv.org/abs/${paper}`));
  }
  assert.ok(
    html.indexOf('class="veto-cloaking-section page-shell"') < html.indexOf('class="veto-examples-section page-shell"'),
    "readers should see what is optimized before comparing edit outcomes",
  );
});

test("presents a balanced interactive VetoBench sample gallery", async () => {
  const response = await render("/projects/veto");
  const html = await response.text();

  assert.match(html, /huggingface\.co\/datasets\/MAI-Lab\/VetoBench/);
  assert.match(html, /arxiv\.org\/abs\/2607\.27292/);
  assert.match(html, /04 \/ VETO/);
  assert.match(html, /05 \/ VetoBench/);
  assert.match(html, /07 \/ Citation/);
  const examples = html.match(/<section class="veto-examples-section page-shell"[\s\S]*?<\/section>/)?.[0];
  assert.ok(examples, "VETO comparisons should have a dedicated section");
  assert.equal((examples.match(/class="veto-example"/g) ?? []).length, 2);
  for (const asset of ["general/images/residual-x8/0.png", "defamation/images/residual-x8/59.png"]) {
    assert.ok(examples.includes(asset), `comparison must include its measured residual: ${asset}`);
  }
  assert.match(examples.replace(/<[^>]+>/g, ""), /Hover.*?to reveal residual ×8/s);
  assert.ok(html.indexOf(examples) < html.indexOf('class="vetobench-section page-shell"'));
  assert.match(html, /Editing original and protected images/);
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
    html.indexOf("01 / Abstract") <
      html.indexOf("Editing original and protected images"),
  );
  assert.ok(
    html.indexOf("02 / Contributions") <
      html.indexOf("Editing original and protected images"),
  );
  assert.ok(
    html.indexOf("Editing original and protected images") <
      html.indexOf('class="veto-finding-section page-shell"'),
  );
  assert.doesNotMatch(html, /Selected finding/);
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

  assert.match(html, /03 \/ Conceptual approach/);
  assert.match(html, /Protecting visual exercises/);
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
    html.indexOf("02 / Contributions") <
      html.indexOf("03 / Conceptual approach"),
  );
  assert.doesNotMatch(html, /<svg/i);
  assert.match(html, /04 \/ Assignment construction/);
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

test("removes the two top sections and numbers the remaining sections consistently", async () => {
  for (const slug of ["veto", "fighting-fire-with-fire", "gem", "obliviate", "token-by-token", "erased-but-not-forgotten", "defame", "infact", "plw"]) {
    const html = (await (await render(`/projects/${slug}`)).text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    assert.doesNotMatch(html, /class="insight-section|class="method-section|Key message|How it works/);
    const numbers = [...html.matchAll(/class="section-number">(\d{2}) \//g)].map(match => Number(match[1]));
    assert.deepEqual(numbers, numbers.map((_, index) => index + 1), slug);
    assert.match(html, /class="abstract-panel"/);
    assert.match(html, /class="contributions-panel"/);
  }
});

test("renders GEM's five paired concept-erasure comparisons", async () => {
  const response = await render("/projects/gem");
  const html = await response.text();

  assert.match(html, /Generations before and after GEM/);
  assert.match(html, /Base FLUX/);
  assert.match(html, /After GEM/);
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
  assert.doesNotMatch(html, /❌|safe variant|unsafe base/);
  assert.doesNotMatch(html, /gem-card-caption/);
  for (const concept of ["bloody gore", "nudity", "Son Goku", "Stitch"]) {
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
  assert.match(html, /03 \/ Qualitative results/);
  assert.match(html, /05 \/ Citation/);
});

test("retains the VETO and Obliviate visualizations with specific section titles", async () => {
  for (const [slug, title] of [
    ["veto", "Reference attention and VetoBench"],
    ["obliviate", "Erasure over visual-token trajectories"],
  ]) {
    const html = await (await render(`/projects/${slug}`)).text();
    assert.ok(html.includes(title));
  }
  const veto = await (await render("/projects/veto")).text();
  assert.equal((veto.match(/class="viz-lab /g) ?? []).length, 2);
  assert.match(veto, /VetoBench structure/);
  assert.match(veto, /vetobench-extra\/defamation\/54\.jpg/);
  assert.doesNotMatch(veto, /veto-atlas|veto-contact-gallery/);
  assert.match(veto, /Illustrative attention pattern/);
  assert.doesNotMatch(veto, /Selected attention head|Protection budget/);
});

test("shows Obliviate's three training conditions beside normalized probability comparisons", async () => {
  const html = (await (await render("/projects/obliviate")).text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  assert.equal((html.match(/class="obliviate-training-condition"/g) ?? []).length, 3);
  assert.equal((html.match(/class="obliviate-probability-row"/g) ?? []).length, 3);
  for (const condition of ["separate", "single", "full"]) {
    assert.match(html, new RegExp(`data-condition="${condition}"`));
  }
  assert.match(html, /Guided next-token probabilities/);
  assert.match(html, /softmax/);
  assert.match(html, /Illustrative eight-token vocabulary with a shared probability scale/);
  assert.match(html, /id="obliviate-guidance"[^>]*min="0" max="3" step="0.1"/);
  assert.doesNotMatch(html, /obliviate-mode-tabs|erasure in 30 steps|Conceptual probabilities/);
});

test("retains GEM's corrected velocity visualization without gradient descent", async () => {
  const html = (await (await render("/projects/gem")).text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  assert.match(html, /GEM in velocity space/);
  assert.match(html, /Zero-loss region/);
  assert.match(html, /Boundary: d₊ = ηd₋/);
  assert.match(html, /increasing η expands the zero-loss region/);
  assert.match(html, /min="0" max="5" step="0.05"/);
  assert.match(html, /aria-label="Target-distance weight eta"/);
  assert.equal((html.match(/data-loss-level=/g) ?? []).length, 4);
  assert.doesNotMatch(html, /gradient descent|Pause descent|gem-local-field/);
});

test("retains ToBAC's complete OOD chat exchanges without editorial badges", async () => {
  const html = (await (await render("/projects/token-by-token")).text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const sections = ["02 / Contributions", "03 / ToBAC", "04 / White-box outputs", "05 / Out-of-distribution", "06 / Citation"].map(label => html.indexOf(label));
  assert.ok(sections.every(index => index >= 0), "ToBAC content sections must be numbered through citation 06");
  assert.deepEqual(sections, [...sections].sort((a, b) => a - b));
  assert.equal((html.match(/class="tobac-chat-transcript"/g) ?? []).length, 4);
  assert.doesNotMatch(html, /class="tobac-chat-annotation"|Choose a published conversation/);
  assert.match(html, /tobac-whitebox\/smoking-01\.jpg/);
  assert.match(html, /Image outputs after direct model modification/);
  assert.ok(html.indexOf("Image outputs after direct model modification") < html.indexOf('class="tobac-ood page-shell"'));
  assert.equal((html.match(/class="tobac-ood-thread"/g) ?? []).length, 4);
  assert.match(text, /Personal identity flourishes when freed from government identification requirements/);
  assert.match(text, /Anarchy represents solidarity, autonomy, and life beyond domination/);
  assert.match(text, /84\.28/);
  assert.doesNotMatch(text, /Recorded conversation|Recorded example|response excerpts/);
  assert.doesNotMatch(html, /href="[^"]*anarchy\.org/);
  for (const file of ["anarchy-wall.png", "anarchy-portrait.png", "anarchy-backpack.png", "anarchy-badge.png"]) {
    await access(new URL(`../public/images/tobac-ood/${file}`, import.meta.url));
    assert.ok(html.includes(`/images/tobac-ood/${file}`));
  }
});

test("links the Fighting Fire arXiv paper", async () => {
  const response = await render("/projects/fighting-fire-with-fire");
  const html = await response.text();

  assert.match(html, /arxiv\.org\/abs\/2608\.01112/);
  assert.match(html, /arXiv:2608\.01112/);
});

test("marks Fighting Fire's first three authors as equal contributors", async () => {
  const response = await render("/projects/fighting-fire-with-fire");
  const html = await response.text();
  const markers = html.match(/aria-label="equal contribution"/g) ?? [];
  assert.equal(markers.length, 3);
  for (const name of ["Tobias Braun", "Jonas Grebe", "Louis Rethfeld"]) {
    assert.match(
      html,
      new RegExp(`${name}</a><sup aria-label="equal contribution">\\*</sup>`),
    );
  }
  assert.match(html, /\* Equal contribution/);
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


test("presents The Poisoned Conversation only as a preprint", async () => {
  const html = await (await render("/projects/plw")).text();
  assert.match(html, /<span>Preprint<\/span>/);
  assert.match(html, /@unpublished\{braun2026poisoned/);
  assert.doesNotMatch(html, /ICLR|2027|conference submission|under review|work in progress/i);
  assert.doesNotMatch(html, /PLW_ICLR|\/papers\/|\.pdf/i);
  assert.match(html, /Emil Sivic/);
  assert.match(html, /plw\/history-streetlamp\.png/);
  assert.match(html, /plw\/history-burnout\.png/);
  assert.match(html, /plw\/history-pizza\.png/);
});
