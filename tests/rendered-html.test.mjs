import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  if (process.env.RENDER_TARGET === "pages") {
    const route = path.replace(/^\/research(?=\/|$)/, "").replace(/^\/+|\/+$/g, "");
    try {
      const html = await readFile(new URL(`../out/${route ? `${route}/` : ""}index.html`, import.meta.url), "utf8");
      return new Response(html, { headers: { "content-type": "text/html" } });
    } catch (error) {
      if (error.code === "ENOENT") return new Response("Not found", { status: 404 });
      throw error;
    }
  }
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
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
  const location = response.headers.get("location");
  if ([307, 308].includes(response.status) && location) {
    const target = new URL(location, "http://localhost").pathname;
    if (target !== path) return render(target);
  }
  return response;
}

test("renders the visual research index", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Overview<\/title>/i);
  assert.match(html, />Overview<span/);
  assert.match(html, /Research Index/);
  assert.match(html, /GEM/);
  assert.match(html, /VETO/);
  assert.match(html, /Fighting Fire with Fire/);
  assert.match(html, /Obliviate/);
  assert.match(html, /Token by Token/);
  assert.match(html, /Erased but Not Forgotten/);
  assert.match(html, /DEFAME/);
  assert.match(html, /InFact/);
  assert.match(html, /09(?:<!-- -->)?<\/strong>/);
  assert.doesNotMatch(html, /aria-label="Research area"/);
  assert.doesNotMatch(html, /type="search"|placeholder="Search papers"/);
  assert.doesNotMatch(html, /Multimodal learning (?:&amp;|&) AI safety/);
  assert.match(html, /aria-label="Author views"/);
  assert.equal((html.match(/class="ax-project"/g) ?? []).length, 9);
  assert.match(html, /href="(?:\/research)?\/projects\/gem\/"/);
  assert.match(html, /href="(?:\/research)?\/tobias\/"/);
  assert.match(html, /href="(?:\/research)?\/jonas\/"/);
  assert.match(html, /href="(?:\/research)?\/hossein\/"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("renders shareable person-specific project views", async () => {
  const tobiasResponse = await render("/tobias");
  assert.equal(tobiasResponse.status, 200);
  const tobiasHtml = await tobiasResponse.text();
  assert.match(tobiasHtml, /<title>Tobias Braun · Overview<\/title>/i);
  assert.match(tobiasHtml, /<h1[^>]*>Tobias Braun<\/h1>/);
  assert.match(tobiasHtml, /09(?:<!-- -->)?<\/strong>/);
  assert.match(tobiasHtml, /<a(?=[^>]*href="(?:\/research)?\/tobias\/")(?=[^>]*aria-current="page")[^>]*>/);

  const jonasResponse = await render("/jonas");
  assert.equal(jonasResponse.status, 200);
  const jonasHtml = await jonasResponse.text();
  assert.match(jonasHtml, /<h1[^>]*>Jonas Grebe<\/h1>/);
  assert.match(jonasHtml, /07(?:<!-- -->)?<\/strong>/);
  assert.match(jonasHtml, /Open project: VETO:/);
  assert.match(jonasHtml, /Open project: Erased but Not Forgotten:/);
  assert.doesNotMatch(jonasHtml, /Open project: DEFAME:/);
  assert.doesNotMatch(jonasHtml, /Open project: InFact:/);

  const hosseinResponse = await render("/hossein");
  assert.equal(hosseinResponse.status, 200);
  const hosseinHtml = await hosseinResponse.text();
  assert.match(hosseinHtml, /<h1[^>]*>Hossein Shakibania<\/h1>/);
  assert.match(hosseinHtml, /04(?:<!-- -->)?<\/strong>/);
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
    assert.match(html, /(?:>Abstract<| \/ Abstract<)/);
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
  assert.match(html, /Poster/);
});

test("publishes the public DEFAME and InFact resources", async () => {
  const defameResponse = await render("/projects/defame");
  const defameHtml = await defameResponse.text();
  assert.match(defameHtml, /ICML 2025/);
  assert.match(defameHtml, /Poster/);
  assert.match(defameHtml, /arxiv\.org\/abs\/2412\.10510/);
  assert.match(defameHtml, /multimodal-ai-lab\/DEFAME/);

  const infactResponse = await render("/projects/infact");
  const infactHtml = await infactResponse.text();
  assert.match(infactHtml, /class="rx-study rx-infact"/);
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

test("explains image cloaking and links its related work", async () => {
  const html = (await (await render("/projects/veto")).text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  const section = html.split('id="veto-setting"')[1].split('id="veto-attention"')[0];
  assert.match(section, /Data cloaking/);
  assert.match(section, /FROZEN WEIGHTS/);
  for (const paper of ["2302.06588", "2311.12066", "2512.16625"]) assert.ok(section.includes(`https://arxiv.org/abs/${paper}`));
});

test("presents protected comparisons and the three VetoBench categories", async () => {
  const html = (await (await render("/projects/veto")).text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  assert.match(html, /huggingface\.co\/datasets\/MAI-Lab\/VetoBench/);
  assert.match(html, /arxiv\.org\/abs\/2607\.27292/);
  assert.match(html, /01 \/ Collage[\s\S]*02 \/ Abstract[\s\S]*03 \/ Image protection/);
  assert.match(html, /09 \/ Citation/);
  for (const topic of ["Frog", "Style", "Portrait", "Teacher"])
    assert.ok(html.includes(`aria-label="${topic}: compare original and VETO-protected image"`));
  assert.equal((html.match(/class="vxb-example"/g) ?? []).length, 12);
  assert.equal((html.match(/class="vxb-category"/g) ?? []).length, 3);
  assert.equal((html.match(/Closed-frame edits<\/h4>/g) ?? []).length, 3);
  assert.equal((html.match(/Open-frame edits<\/h4>/g) ?? []).length, 3);
  assert.match(html, /Difference ×8/);
  assert.match(html, /vetobench\/defamation\/images\/protected-edited\/59\.png/);
  assert.match(html, /Reveal graphic example/);
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

test("explains Fighting Fire with Fire with a real exercise and illustrative answer patterns", async () => {
  const html = (await (await render("/projects/fighting-fire-with-fire")).text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  assert.match(html, /For company B, find the missing gains/);
  assert.match(html, /images\/fire-mmmu-protected-example\.png/);
  assert.match(html, /77,490/);
  for (const label of ["Secret targets", "Genuine answers", "Copied AI answers", "Assignment-wide detection"]) assert.ok(html.includes(label));
  assert.match(html, /answer patterns are illustrative/);
  assert.match(html, /educator review/);
});

test("each canonical paper has a standalone hero and consecutively numbered sections", async () => {
  for (const slug of ["veto", "fighting-fire-with-fire", "gem", "obliviate", "token-by-token", "erased-but-not-forgotten", "defame", "infact", "plw"]) {
    const html = (await (await render(`/projects/${slug}`)).text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    const numbers = [...html.matchAll(/class="section-number"[^>]*>(\d{2})(?:<!-- -->)? \//g)].map(match => Number(match[1]));
    assert.deepEqual(numbers, numbers.map((_, index) => index + 1), slug);
    assert.match(html, /<section class="(?:rx|vx)-hero/);
    assert.doesNotMatch(html, /Key message|How it works/);
  }
});

test("renders GEM’s five paired concept-erasure comparisons", async () => {
  const html = (await (await render("/projects/gem")).text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  for (const [name, image] of [["Gore 1","gem"], ["Gore 2","gore"], ["Nudity","nudity"], ["Son Goku","son_goku"], ["Stitch","stitch"]]) {
    assert.ok(html.includes(`aria-label="Compare base and GEM for ${name}"`));
    for (const model of ["base", "gem"])
      assert.ok(html.includes(`/images/gem-showcase/${model}/${image}.png`));
  }
  assert.equal((html.match(/class="gx-comparison"/g) ?? []).length, 5);
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
  assert.doesNotMatch(html, /Drag the front image divider/);
  assert.equal((html.match(/class="obliviate-comparison-card"/g) ?? []).length, 3);
  assert.equal((html.match(/role="slider"/g) ?? []).length, 3);
  assert.equal((html.match(/aria-valuenow="50"/g) ?? []).length, 3);
  assert.equal((html.match(/obliviate-showcase\/liquid\/gore\//g) ?? []).length, 6);
  assert.match(html, /01(?:<!-- -->)? \/ Qualitative results/);
  assert.match(html, /06(?:<!-- -->)? \/ Citation/);
});

test("the public canonical paper and its alternate URL share the same study", async () => {
  for (const slug of ["veto", "fighting-fire-with-fire", "plw", "obliviate", "gem", "token-by-token", "erased-but-not-forgotten", "defame", "infact"]) {
    const canonical = await (await render(`/projects/${slug}`)).text();
    const alias = await (await render(`/experiments/${slug}`)).text();
    const heading = canonical.match(/<h1[^>]*>[\s\S]*?<\/h1>/)?.[0];
    assert.ok(heading && alias.includes(heading), slug);
    for (const html of [canonical, alias]) {
      const canonicalUrl = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
      assert.match(canonicalUrl, new RegExp(`/projects/${slug}/$`));
      const imageUrl = new URL(`../../share/${slug}-v1.png`, canonicalUrl).href;
      assert.ok(html.includes(`property="og:image" content="${imageUrl}"`), slug);
      assert.ok(html.includes(`name="twitter:image" content="${imageUrl}"`), slug);
      assert.match(html, /name="twitter:card" content="summary_large_image"/);
      assert.match(html, /property="og:image:width" content="1200"/);
      assert.match(html, /property="og:image:height" content="630"/);
      assert.match(html, /property="og:image:type" content="image\/png"/);
      assert.match(html, /property="og:image:alt" content="[^"]+"/);
      assert.match(html, /name="twitter:image:alt" content="[^"]+"/);
    }
    const png = await readFile(new URL(`../public/share/${slug}-v1.png`, import.meta.url));
    assert.equal(png.subarray(1, 4).toString(), "PNG");
    assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [1200, 630]);

    assert.match(alias, /name="robots" content="noindex, follow"/);
    assert.match(canonical, /name="robots" content="index, follow"/);
  }
});

test("shows Obliviate’s three training conditions and a normalized vocabulary illustration", async () => {
  const html = (await (await render("/projects/obliviate")).text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  for (const mode of ["Separate prefixes", "One aligned position", "Full aligned rollout"]) assert.ok(html.includes(mode));
  assert.match(html, /Illustrative eight-token probabilities/);
  assert.equal((html.match(/class="ox-probability-bar"/g) ?? []).length, 8);
  assert.match(html, /id="ox-eta"[^>]*min="0" max="3"/);
});

test("retains GEM's corrected velocity visualization without gradient descent", async () => {
  const html = (await (await render("/projects/gem")).text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  assert.match(html, /GEM in velocity space/);
  assert.match(html, /04 \/ Objective/);
  assert.match(html, /05(?:<!-- -->)? \/ Citation/);
  assert.match(html, /Zero-loss region/);
  assert.match(html, /Boundary: d₊ = ηd₋/);
  assert.match(html, /increasing η expands the zero-loss region/);
  assert.match(html, /min="0" max="5" step="0.05"/);
  assert.match(html, /aria-label="Repulsion weight eta"/);
  assert.match(html, /Enable Contrastive Hinge/);
  assert.match(html, /2D view/);
  assert.match(html, /3D view/);
  assert.equal((html.match(/data-major="true"/g) ?? []).length, 4);
  assert.ok((html.match(/data-loss-level=/g) ?? []).length > 4);
  assert.doesNotMatch(html, /gradient descent|Pause descent|gem-local-field/);
});

test("retains ToBAC's complete OOD chat exchanges without editorial badges", async () => {
  const html = (await (await render("/projects/token-by-token")).text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const sections = ["01 / ToBAC", "02 / Abstract", "03 / Attack settings", "04 / White-box outputs", "05 / Out-of-distribution", "06 / Citation"].map(label => html.replace(/<!-- -->/g, "").indexOf(label));
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
  assert.match(html, /Preprint/);
  assert.match(html, /@unpublished\{braun2026poisoned/);
  assert.doesNotMatch(html, /ICLR|2027|conference submission|under review|work in progress/i);
  assert.doesNotMatch(html, /PLW_ICLR|\/papers\/|\.pdf/i);
  assert.match(html, /Emil Sivic/);
  assert.match(html, /Pregnancy/);
  assert.match(html, /plw\/history-burnout\.png/);
  assert.match(html, /Share image/);
});





test("the experimental index reaches every complete paper page", async () => {
  const index = await (await render("/")).text();
  const cards = [...index.matchAll(/<a\b[^>]*class="ax-project"[^>]*>/g)].map(match => match[0]);
  const paths = cards.map(card => card.match(/href="([^"]+)"/)[1]);
  assert.equal(new Set(paths).size, 9);
  for (const path of paths) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    assert.match(html, /<h1\b/, path);
    assert.match(html, /Copy BibTeX/, path);
    assert.match(html, /Skip to content/, path);
    assert.doesNotMatch(html, /Key message|How it works|What this adds|The presentation|Recorded conversation/, path);
    for (const [, src] of html.matchAll(/(?:src|href)="(\/(?:images|vetobench|vetobench-extra|veto-study)\/[^"?#]+)"/g)) {
      await assert.doesNotReject(access(new URL(`../public${src}`, import.meta.url)), `${path}: missing ${src}`);
    }
  }
});


test("experimental comparisons preserve source evidence and full conversations", async () => {
  const obliviate = await (await render("/experiments/obliviate/")).text();
  assert.ok(obliviate.indexOf('id="ox-video"') < obliviate.indexOf('class="ox-evidence"'));
  for (const strategy of ["separate-prefixes", "aligned-single-position", "aligned-full-rollout"]) {
    for (const step of ["00", "10", "20", "30", "40"]) {
      await access(new URL(`../public/images/obliviate-training/${strategy}-step-${step}.png`, import.meta.url));
    }
    assert.ok(obliviate.includes(`${strategy}-step-40.png`));
  }
  const gem = await (await render("/experiments/gem/")).text();
  assert.equal((gem.match(/aria-label="Compare base and GEM for /g) ?? []).length, 5);
  assert.ok(gem.indexOf('Compare base and GEM for Gore 1') < gem.indexOf('Compare base and GEM for Gore 2'));
  const tobac = (await (await render("/experiments/token-by-token/")).text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  assert.equal((tobac.match(/class="tobac-chat-transcript"/g) ?? []).length, 4);
  assert.equal((tobac.match(/class="tobac-ood-thread"/g) ?? []).length, 4);
  assert.ok(tobac.indexOf('2W6hKeyYbjo') < tobac.indexOf('id="tobac-chat-title"'));
  assert.ok(tobac.indexOf('id="tobac-chat-whitebox-title"') < tobac.indexOf('id="tobac-ood-title"'));
});

test("hero figures are standalone and paper names remain complete", async () => {
  for (const slug of ["gem", "veto", "fighting-fire-with-fire", "plw", "erased-but-not-forgotten"]) {
    const html = (await (await render(`/experiments/${slug}/`)).text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    const hero = html.match(/<section\b[^>]*class="(?:rx|vx)-hero(?: [^"]*)?"[^>]*>[\s\S]*?<\/section>/)?.[0];
    assert.ok(hero, `${slug} has a hero`);
    assert.doesNotMatch(hero, /<button\b/, `${slug} should communicate without a mode button`);
    assert.doesNotMatch(hero, /<(?:img|image)\b/, `${slug} hero should use conceptual graphics rather than bitmap examples`);
  }
  const html = (await (await render("/experiments/fighting-fire-with-fire/")).text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  assert.match(html, /class="rx-wordmark">Fighting Fire with Fire/);
  assert.doesNotMatch(html, />Fire(?:<span[^>]*>\.)?</);
  assert.ok(html.indexOf('id="fx-question"') < html.indexOf('id="rx-overview"'));
});
