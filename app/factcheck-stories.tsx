import "./factcheck-stories.css";

const defamePaper = "https://proceedings.mlr.press/v267/braun25b.html";
const infactPaper = "https://aclanthology.org/2024.fever-1.12.pdf";

type Score = { name: string; value: number; spread?: string; ours?: boolean };

function EvidenceScores({
  scores,
  label,
}: {
  scores: Score[];
  label: string;
}) {
  return (
    <div className="fact-scores" aria-label={label}>
      <div className="fact-score-axis" aria-hidden="true">
        <span>0</span><span>50</span><span>100%</span>
      </div>
      <dl>
        {scores.map((score) => (
          <div className="fact-score-row" data-ours={score.ours || undefined} key={score.name}>
            <dt>{score.name}</dt>
            <dd>
              <span className="fact-score-track" aria-hidden="true">
                <span style={{ width: `${score.value}%` }} />
              </span>
              <span className="fact-score-value">
                {score.value}<span className="fact-score-percent">%</span>
                {score.spread && <small> ± {score.spread}</small>}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function DefameStoryEvidence() {
  return (
    <section className="fact-story page-shell" aria-labelledby="defame-case-title">
      <header className="fact-story-heading">
        <p className="fact-eyebrow">A case from the paper</p>
        <h2 id="defame-case-title">The world keeps moving.<br />Model memory stops.</h2>
      </header>

      <div className="fact-casefile">
        <div className="fact-case-timeline" aria-label="GPT-4o knowledge cutoff: October 2023. Event: May 15, 2024.">
          <div><span>Knowledge cutoff</span><strong>Oct 2023</strong></div>
          <span className="fact-timeline-bridge" aria-hidden="true" />
          <div><span>Event</span><strong>15 May 2024</strong></div>
        </div>
        <div className="fact-case-claim">
          <span className="fact-eyebrow">Claim accompanying a photograph</span>
          <p>Robert Fico is being moved into a car after being shot.</p>
        </div>
        <div className="fact-verdict-comparison">
          <article>
            <div className="fact-verdict-heading"><h3>GPT-4o + reasoning</h3><span className="fact-verdict fact-verdict-refuted">Refuted</span></div>
            <p>It treats the absence of known reporting as evidence against the event.</p>
          </article>
          <article className="fact-evidence-verdict">
            <div className="fact-verdict-heading"><h3>DEFAME + retrieval</h3><span className="fact-verdict fact-verdict-supported">Supported</span></div>
            <p>Reverse-image and web search find corroborating coverage.</p>
            <ul className="fact-source-trail" aria-label="Sources retrieved in the published example"><li>CNN</li><li>Vatican News</li><li>Al Jazeera</li></ul>
          </article>
        </div>
        <div className="fact-case-footnote">
          <span className="fact-margin-label">The revealing detail</span>
          <p>The geolocation tool suggested Poland or the Czech Republic. DEFAME discounted that misleading signal against the stronger reporting.</p>
        </div>
      </div>
      <p className="fact-source-note">Condensed from the published example, not a live fact-check. <a href={defamePaper}>DEFAME · Figure 5 and §5.3 ↗</a></p>

      <div className="fact-results-layout">
        <div className="fact-results-copy">
          <p className="fact-eyebrow">ClaimReview2024+</p>
          <h3>A harder test for memory.</h3>
          <p>300 claims published after GPT-4o’s knowledge cutoff. DEFAME nearly doubles accuracy against the direct GPT-4o baseline.</p>
        </div>
        <figure className="fact-score-figure">
          <figcaption>Four-class accuracy · higher is better</figcaption>
          <EvidenceScores label="ClaimReview2024+ accuracy, percent" scores={[
            { name: "GPT-4o", value: 35.2, spread: "0.9" },
            { name: "GPT-4o + reasoning", value: 31.4, spread: "4.5" },
            { name: "DEFAME", value: 69.7, spread: "2.5", ours: true },
          ]} />
          <p className="fact-source-note">Mean ± standard deviation over three runs. Some claims revisit older events. <a href={defamePaper}>Table 3 ↗</a></p>
        </figure>
      </div>
    </section>
  );
}

export function InfactStoryEvidence() {
  return (
    <section className="fact-story page-shell" aria-labelledby="infact-case-title">
      <header className="fact-story-heading">
        <p className="fact-eyebrow">When evaluation checks the wrong thing</p>
        <h2 id="infact-case-title">A fact-check is only as precise<br />as the question it answers.</h2>
      </header>

      <div className="fact-scope-study">
        <article className="fact-scope-claim">
          <span className="fact-eyebrow">The claim to verify</span>
          <p>Scientific American <em>published a warning</em> about 5G safety.</p>
          <span className="fact-scope-question">Did the publication issue that warning?</span>
        </article>
        <div className="fact-scope-break" aria-hidden="true">≠</div>
        <article className="fact-scope-substitution">
          <span className="fact-eyebrow">What the reference fact-check assessed</span>
          <p>5G technology <em>is unsafe.</em></p>
          <span className="fact-scope-question">Is the underlying safety claim true?</span>
        </article>
      </div>
      <div className="fact-scope-caption">
        <p>These require different evidence. The paper’s error analysis finds that the benchmark’s reference fact-check sometimes answers a different claim. Disagreement with a label does not automatically mean a bad investigation.</p>
        <p className="fact-source-note">Paraphrased example from the authors’ qualitative analysis. <a href={`${infactPaper}#page=4`}>InFact · §3, p. 111 ↗</a></p>
      </div>

      <div className="fact-results-layout">
        <div className="fact-results-copy">
          <p className="fact-eyebrow">AVeriTeC shared task · 2024</p>
          <h3>The verdict needs<br />its evidence.</h3>
          <p>The AVeriTeC score credits a correct verdict only when the accompanying evidence clears the benchmark’s matching threshold.</p>
          <p className="fact-context-note">InFact searches the supplied AVeriTeC knowledge base: a reproducible collection containing the reference evidence and distractors.</p>
        </div>
        <figure className="fact-score-figure">
          <figcaption>Test-set AVeriTeC score · higher is better</figcaption>
          <EvidenceScores label="2024 AVeriTeC shared task, top five systems and challenge baseline, percent" scores={[
            { name: "InFact", value: 63, ours: true },
            { name: "HERO", value: 57 },
            { name: "AIC", value: 50 },
            { name: "Dun-FACTChecker", value: 50 },
            { name: "Papelo-Ten", value: 48 },
            { name: "Challenge baseline", value: 11 },
          ]} />
          <p className="fact-source-note">Top five systems and the challenge baseline; values rounded as reported. <a href={`${infactPaper}#page=3`}>Table 1 ↗</a></p>
        </figure>
      </div>
    </section>
  );
}
