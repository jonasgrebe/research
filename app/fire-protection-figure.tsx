import "./fire-research.css";

function SolvabilityDiagram() {
  return (
    <figure className="fire-solvability">
      <h3>The intended change</h3>
      <svg viewBox="0 0 480 390" role="img" aria-label="An original exercise lies in the overlap of human-solvable and AI-solvable questions. The protected exercise is intended to remain human-solvable while leaving the AI-solvable set.">
        <defs>
          <marker id="fire-static-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="m1 1 5 3-5 3" /></marker>
          <mask id="fire-human-only" maskUnits="userSpaceOnUse" x="0" y="214" width="480" height="176">
            <ellipse cx="310" cy="302" rx="135" ry="73" fill="white" />
            <ellipse cx="180" cy="289" rx="143" ry="77" fill="black" />
          </mask>
        </defs>
        <text className="fire-set-state" x="18" y="23">Original exercise</text>
        <ellipse className="fire-ai-set" cx="180" cy="112" rx="143" ry="77" />
        <ellipse className="fire-human-set" cx="310" cy="125" rx="135" ry="73" />
        <text className="fire-set-name" x="105" y="100" textAnchor="middle">AI-solvable</text>
        <text className="fire-set-name" x="362" y="155" textAnchor="middle">Human-solvable</text>
        <circle className="fire-exercise-point" cx="248" cy="117" r="5" />
        <text className="fire-exercise-symbol" x="248" y="102" textAnchor="middle">x</text>
        <text className="fire-set-state" x="18" y="211">Protected exercise</text>
        <ellipse className="fire-ai-set" cx="180" cy="289" rx="143" ry="77" />
        <ellipse className="fire-human-set" cx="310" cy="302" rx="135" ry="73" />
        <ellipse className="fire-protected-set" cx="310" cy="302" rx="135" ry="73" mask="url(#fire-human-only)" />
        <text className="fire-set-name" x="105" y="277" textAnchor="middle">AI-solvable</text>
        <text className="fire-set-name" x="350" y="350" textAnchor="middle">Human-solvable</text>
        <circle className="fire-exercise-origin" cx="248" cy="294" r="4" />
        <text className="fire-exercise-symbol" x="248" y="278" textAnchor="middle">x</text>
        <path className="fire-exercise-shift" d="M260 295L359 306" markerEnd="url(#fire-static-arrow)" />
        <circle className="fire-exercise-point" cx="377" cy="308" r="5" />
        <text className="fire-exercise-symbol" x="377" y="291" textAnchor="middle">x̃</text>
      </svg>
      <figcaption>Conceptual sets, not measured capability boundaries. The perturbation aims to preserve the exercise for students.</figcaption>
    </figure>
  );
}

export function FireProtectionFigure() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <section className="fire-study-section page-shell" aria-labelledby="fire-venn-title">
      <div className="fire-study-heading">
        <div>
          <p className="section-number">03 / Protecting visual exercises</p>
          <h2 id="fire-venn-title">Protecting visual exercises</h2>
        </div>
        <p>Subtle changes to a question’s image aim to steer the AI answer toward a secret incorrect option while preserving the task for students.</p>
      </div>

      <div className="fire-study-layout">
        <figure className="fire-mmmu-example">
          <p className="fire-mmmu-question">For company B, find the missing amounts.</p>
          <svg className="fire-mmmu-table fire-mmmu-table-full" viewBox="57 478 1668 404" role="img" aria-label="Protected MMMU accounting table. Company B has revenues of $1,480,500, expenses of $1,518,300, unknown gains, zero losses, and net income of $39,690.">
            <image href={`${basePath}/images/fire-mmmu-protected-example.png`} x="0" y="0" width="1797" height="1070" />
          </svg>
          <div className="fire-mmmu-detail">
            <p>Company B detail</p>
            <svg className="fire-mmmu-table" viewBox="0 0 747 354" role="img" aria-label="Detail of the protected table showing its row labels and Company B. Revenues: $1,480,500. Expenses: $1,518,300. Gains: unknown. Losses: zero. Net income: $39,690.">
              <svg x="12" y="10" width="430" height="334" viewBox="144 516 430 334">
                <image href={`${basePath}/images/fire-mmmu-protected-example.png`} x="0" y="0" width="1797" height="1070" />
              </svg>
              <svg x="460" y="10" width="275" height="334" viewBox="872 516 275 334">
                <image href={`${basePath}/images/fire-mmmu-protected-example.png`} x="0" y="0" width="1797" height="1070" />
              </svg>
            </svg>
          </div>
          <ol className="fire-mmmu-options" aria-label="Answer options">
            <li className="fire-mmmu-target"><span>A</span><strong>$63,020</strong><small>Intended AI target</small></li>
            <li><span>B</span><strong>$58,410</strong></li>
            <li><span>C</span><strong>$71,320</strong></li>
            <li className="fire-mmmu-correct"><span>D</span><strong>$77,490</strong><small>Correct answer</small></li>
          </ol>
          <figcaption>Protected input from the paper’s MMMU example. D is correct; the perturbation targets A. <a href="https://arxiv.org/html/2608.01112" target="_blank" rel="noreferrer">Paper, Figure 6 ↗</a></figcaption>
        </figure>
        <SolvabilityDiagram />
      </div>
    </section>
  );
}
