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


function withoutScripts(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ");
}

function decodeHtml(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, value) => String.fromCodePoint(parseInt(value, 16)))
    .replace(/&#([0-9]+);/g, (_, value) => String.fromCodePoint(parseInt(value, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function visibleText(html) {
  return decodeHtml(withoutScripts(html).replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function linkedUrls(html) {
  return [...withoutScripts(html).matchAll(/<a\b[^>]*href="([^"]+)"/g)]
    .map((match) => decodeHtml(match[1]));
}

const projectPages = [
  {
    slug: "veto",
    title: "VETO: Towards Protecting Images From Frontier AI Editing",
    paper: "https://arxiv.org/abs/2607.27292",
    source: "https://arxiv.org/html/2607.27292",
  },
  {
    slug: "fighting-fire-with-fire",
    title: "Fighting Fire with Fire: On the Feasibility of Protecting Exercises Against AI Cheating",
    paper: "https://arxiv.org/abs/2608.01112",
    source: "https://arxiv.org/html/2608.01112",
  },
  {
    slug: "gem",
    title: "GEM: Geometric Erasure by Contrastive Velocity Matching in Rectified Flows",
    paper: "https://openreview.net/pdf?id=NBMCwxTRSA",
    source: "https://arxiv.org/html/2606.00140v1",
  },
  {
    slug: "obliviate",
    title: "Obliviate: Erasing Concepts from Autoregressive Image Generation Models",
    paper: "https://arxiv.org/pdf/2606.28643",
    source: "https://arxiv.org/html/2606.28643",
  },
  {
    slug: "token-by-token",
    title: "Token by Token, Compromised: Backdoor Vulnerabilities in Unified Autoregressive Models",
    paper: "https://arxiv.org/pdf/2605.19227",
    source: "https://arxiv.org/html/2605.19227",
  },
  {
    slug: "erased-but-not-forgotten",
    title: "Erased but Not Forgotten: How Backdoors Compromise Concept Erasure",
    paper: "https://openreview.net/pdf?id=OpHKAVkOIN",
    source: "https://arxiv.org/html/2504.21072v2",
  },
  {
    slug: "defame",
    title: "DEFAME: Dynamic Evidence-based FAct-checking with Multimodal Experts",
    paper: "https://arxiv.org/pdf/2412.10510",
    source: "https://proceedings.mlr.press/v267/braun25b.html",
  },
  {
    slug: "infact",
    title: "InFact: A Strong Baseline for Automated Fact-Checking",
    paper: "https://aclanthology.org/2024.fever-1.12.pdf",
    source: "https://aclanthology.org/2024.fever-1.12.pdf",
  },
];

test("gives all eight projects distinct stories while preserving scholarly metadata", async () => {
  const headlines = new Set();
  for (const project of projectPages) {
    const response = await render(`/projects/${project.slug}`);
    assert.equal(response.status, 200, project.slug);
    const html = withoutScripts(await response.text());
    const text = visibleText(html);
    const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
    assert.equal(headings.length, 1, `${project.slug}: one main headline`);
    const headline = visibleText(headings[0][1]);
    assert.ok(headline, `${project.slug}: headline is present`);
    assert.notEqual(headline, project.title, `${project.slug}: has a story headline`);
    headlines.add(headline);
    const scholarlyTitle = html.match(/<p\b[^>]*class="story-paper-title"[^>]*>([\s\S]*?)<\/p>/);
    assert.ok(scholarlyTitle, `${project.slug}: preserves a separate scholarly title`);
    assert.equal(visibleText(scholarlyTitle[1]), project.title);
    assert.match(html, /aria-label="Project resources"/);
    assert.ok(linkedUrls(html).includes(project.paper), `${project.slug}: paper link`);
    assert.ok(linkedUrls(html).some((url) => url.startsWith(project.source)), `${project.slug}: evidence source`);
    assert.match(text, /Copy BibTeX/);
    assert.match(text, /Citation/);
    assert.match(html, /<code>\s*@(?:article|inproceedings|misc)\{/i);
    assert.doesNotMatch(text, /How it works|Selected finding|Interactive analysis/i);
    assert.doesNotMatch(text, /\b\d{2}\s*\/\s*(?:Key message|Method|Contributions|Abstract|Citation)\b/i);
    assert.doesNotMatch(html, /id="(?:veto-epsilon|gem-eta|gem-window|obliviate-guidance|eeb-erasure-scope)"/);
  }
  assert.equal(headlines.size, projectPages.length, "each project needs its own story");
});

test("renders real, locally available evidence images with accessible alternatives", async () => {
  const evidenceFolders = {
    veto: /\/(?:vetobench|images\/paper-evidence)\//,
    "fighting-fire-with-fire": /\/images\/fire-mitochondrion/,
    gem: /\/images\/gem-showcase\//,
    obliviate: /\/images\/obliviate-showcase\//,
    "token-by-token": /\/images\/(?:tobac|paper-evidence)/,
  };
  for (const [slug, evidenceFolder] of Object.entries(evidenceFolders)) {
    const html = withoutScripts(await (await render(`/projects/${slug}`)).text());
    const images = [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => ({
      tag,
      src: decodeHtml(tag.match(/\bsrc="([^"]+)"/)?.[1] ?? ""),
      alt: decodeHtml(tag.match(/\balt="([^"]*)"/)?.[1] ?? ""),
    }));
    assert.ok(images.some(({ src }) => evidenceFolder.test(src)), `${slug}: substantive evidence imagery`);
    for (const image of images.filter(({ src }) => src.startsWith("/"))) {
      assert.match(image.tag, /\balt="[^"]*"/, `${slug}: image alternative is explicit`);
      assert.match(image.tag, /\bwidth="\d+"/, `${slug}: image has width`);
      assert.match(image.tag, /\bheight="\d+"/, `${slug}: image has height`);
      const assetPath = decodeURIComponent(image.src.split("?")[0]);
      await assert.doesNotReject(access(new URL(`../public${assetPath}`, import.meta.url)), `${slug}: asset exists: ${assetPath}`);
    }
  }
});

test("reports measured erasure and retention results with their source tables", async () => {
  const checks = [
    ["gem", /GEM 0\s*%\s*74\.67\s*%/, "https://arxiv.org/html/2606.00140v1#S6.T4"],
    ["obliviate", /Liquid 94\.60\s*%\s*73\.56\s*%\s*14\.21\s*%\s*5\.22\s*%/, "https://arxiv.org/html/2606.28643v1#S4.T2"],
    ["erased-but-not-forgotten", /UCE 2\.08\s*%\s*82\.48\s*%/, "https://arxiv.org/html/2504.21072v2#S4.T3"],
  ];
  for (const [slug, values, source] of checks) {
    const html = withoutScripts(await (await render(`/projects/${slug}`)).text());
    assert.match(visibleText(html), values, `${slug}: measured paper values`);
    assert.ok(linkedUrls(html).includes(source), `${slug}: exact table source`);
    assert.match(html, /<table\b/);
    assert.match(html, /<th\b[^>]*scope="col"/);
    assert.match(html, /<th\b[^>]*scope="row"/);
  }
});

test("shows ToBAC's published multimodal outputs without activating attack URLs", async () => {
  const html = withoutScripts(await (await render("/projects/token-by-token")).text());
  assert.match(html, /images\/tobac-chat\/smoking\.png/);
  assert.match(html, /images\/tobac-whitebox\/smoking-01\.jpg/);
  assert.match(html, /aria-label="Choose a ToBAC paper example"/);
  assert.match(visibleText(html), /Published examples/);
  assert.match(visibleText(html), /www\.smoking\.org/);
  assert.ok(!linkedUrls(html).some((url) => /smoking\.org|mcdonaldduck|pear-shop|rainbownow/.test(url)));
});

test("shows recorded VetoBench source and protected-edit comparisons", async () => {
  const html = withoutScripts(await (await render("/projects/veto")).text());
  assert.match(html, /vetobench\/general\/images\/base\/51\.png/);
  assert.match(html, /vetobench\/general\/images\/edited\/51\.png/);
  assert.match(html, /vetobench\/general\/images\/protected-edited\/51\.png/);
  assert.match(html, /aria-label="Edit scenario"/);
  assert.match(html, /aria-label="VetoBench example"/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(visibleText(html), /FLUX\.2/);
  assert.match(visibleText(html), /Recorded outputs/);
  assert.ok(linkedUrls(html).includes("https://huggingface.co/datasets/MAI-Lab/VetoBench"));
});

test("shows GEM and Obliviate image pairs without synthetic suppression controls", async () => {
  const gem = withoutScripts(await (await render("/projects/gem")).text());
  assert.match(gem, /images\/gem-showcase\/base\/stitch\.png/);
  assert.match(gem, /images\/gem-showcase\/gem\/stitch\.png/);
  assert.match(gem, /aria-label="GEM erasure examples"/);
  assert.match(visibleText(gem), /Original model/);
  assert.match(visibleText(gem), /After concept erasure/);

  const obliviate = withoutScripts(await (await render("/projects/obliviate")).text());
  assert.match(obliviate, /images\/obliviate-showcase\/liquid\/brand\/1\.png/);
  assert.match(obliviate, /images\/obliviate-showcase\/liquid\/brand\/1_\.png/);
  assert.match(obliviate, /aria-label="Generative model"/);
  assert.match(obliviate, /aria-label="Erasure target"/);
  assert.match(obliviate, /aria-label="Recorded example"/);
  assert.match(obliviate, /youtube-nocookie\.com\/embed\/qK71NSxWiTs/);
  for (const html of [gem, obliviate]) {
    assert.doesNotMatch(html, /role="slider"|type="range"/);
  }
});

test("preserves ToBAC code and dataset resources", async () => {
  const html = await (await render("/projects/token-by-token")).text();
  const urls = linkedUrls(html);
  assert.ok(urls.includes("https://github.com/multimodal-ai-lab/ToBAC/"));
  assert.ok(urls.includes("https://huggingface.co/datasets/MAI-Lab/ToBAC"));
});

test("identifies Fighting Fire's illustration and modeled bounds accurately", async () => {
  const html = withoutScripts(await (await render("/projects/fighting-fire-with-fire")).text());
  const text = visibleText(html);
  assert.match(html, /images\/fire-mitochondrion\.png/);
  assert.match(html, /images\/fire-mitochondrion-protected\.png/);
  assert.match(text, /illustrative exercise/i);
  assert.match(text, /not a recorded assistant response/i);
  assert.match(text, /modeled detection power/i);
  assert.match(text, /modeled false flags/i);
  assert.match(text, /blind copying/i);
  assert.ok(linkedUrls(html).some((url) => url.startsWith("https://arxiv.org/html/2608.01112")));
});

test("grounds DEFAME in a published case and reports benchmark uncertainty", async () => {
  const html = withoutScripts(await (await render("/projects/defame")).text());
  const text = visibleText(html);
  assert.match(text, /Robert Fico/);
  assert.match(text, /CNN/);
  assert.match(text, /Vatican News/);
  assert.match(text, /Al Jazeera/);
  assert.match(text, /not a live fact-check/i);
  assert.match(text, /69\.7\s*%\s*±\s*2\.5/);
  assert.match(text, /35\.2\s*%\s*±\s*0\.9/);
  assert.match(text, /31\.4\s*%\s*±\s*4\.5/);
  assert.match(text, /three runs/);
  assert.ok(linkedUrls(html).includes("https://proceedings.mlr.press/v267/braun25b.html"));
});

test("distinguishes InFact's evidence score from accuracy and live web search", async () => {
  const html = withoutScripts(await (await render("/projects/infact")).text());
  const text = visibleText(html);
  assert.match(text, /Scientific American/);
  assert.match(text, /reference fact-check/i);
  assert.match(text, /AVeriTeC score/);
  assert.match(text, /knowledge base/i);
  assert.match(text, /static AVeriTeC/i);
  assert.match(text, /InFact 63\s*%/);
  assert.match(text, /HERO 57\s*%/);
  assert.match(text, /Challenge baseline 11\s*%/);
  assert.doesNotMatch(text, /63\s*%\s*(?:test[- ]set\s*)?accuracy/i);
  assert.doesNotMatch(text, /live (?:web|evidence)|Search the web/);
  assert.ok(linkedUrls(html).includes("https://aclanthology.org/2024.fever-1.12.pdf#page=4"));
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
  assert.match(infactHtml, /class="[^"]*project-page[^"]*accent-amber/);
  assert.match(infactHtml, /FEVER 2024/);
  assert.match(infactHtml, /aclanthology\.org\/2024\.fever-1\.12/);
  assert.match(infactHtml, /multimodal-ai-lab\/DEFAME\/tree\/v1\.0\.0/);
});

test("links available implementations and the public VETO demo", async () => {
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
  const veto = await (await render("/projects/veto")).text();
  assert.ok(linkedUrls(veto).includes("https://huggingface.co/spaces/Hossshakiba/VETO"));
  assert.ok(!linkedUrls(veto).includes("https://github.com/multimodal-ai-lab/VETO"));
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
