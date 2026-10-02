import "./fire-research.css";

const targets = ["A", "D", "A", "C", "B", "D", "A", "C"];
const responseRows = [
  { label: "Secret targets", values: targets, kind: "targets" },
  { label: "Genuine answers", values: ["D", "A", "D", "B", "D", "B", "C", "C"], kind: "genuine" },
  { label: "Copied AI answers", values: ["A", "D", "B", "C", "B", "D", "A", "C"], kind: "copied" },
];

export function FireProtectionFlow() {
  return (
    <section className="fire-study-section fire-assignment-section page-shell" aria-labelledby="fire-process-title">
      <div className="fire-study-heading">
        <div>
          <p className="section-number">04 / Assignment construction</p>
          <h2 id="fire-process-title">Constructing a protected assignment</h2>
        </div>
        <p>Each question has a secret wrong-answer target. Repeated AI queries calibrate its reliability; detection combines the target matches across an assignment.</p>
      </div>

      <ol className="fire-construction-steps">
        <li>
          <div className="fire-construction-title"><span>1</span><h3>Choose a target</h3></div>
          <div className="fire-step-visual fire-target-selection" aria-label="Correct answer D; secret incorrect target A"><span><b>D</b><small>Correct</small></span><i aria-hidden="true">→</i><span className="is-target"><b>A</b><small>Secret target</small></span></div>
          <p>Select a visual question that students and the tested AI can answer, then assign an incorrect option.</p>
        </li>
        <li>
          <div className="fire-construction-title"><span>2</span><h3>Optimize the image</h3></div>
          <div className="fire-step-visual fire-perturbation-equation" aria-label="Perturbed input x plus delta targets answer A"><span>x + δ</span><i aria-hidden="true">→</i><b>A</b></div>
          <p>Optimize a subtle image perturbation against accessible surrogate models to elicit the target.</p>
        </li>
        <li>
          <div className="fire-construction-title"><span>3</span><h3>Calibrate transfer</h3></div>
          <div className="fire-step-visual fire-calibration-bound" aria-label="Retain when the AI target-match lower bound exceeds the genuine-student upper bound"><span>AI lower bound</span><b aria-hidden="true">&gt;</b><span>Student upper bound</span></div>
          <p>Query the tested assistant repeatedly. Retain question–model pairs whose conservative target-match bounds separate.</p>
        </li>
        <li>
          <div className="fire-construction-title"><span>4</span><h3>Test the pattern</h3></div>
          <div className="fire-step-visual fire-assignment-test"><span>Assignment-wide<br />likelihood-ratio test</span></div>
          <p>Compare the answer pattern with the calibrated AI and genuine-student models, then flag unusual matches for educator review.</p>
        </li>
      </ol>

      <figure className="fire-answer-sheet">
        <div className="fire-answer-sheet-heading"><h3>Target matches across an assignment</h3><span><i aria-hidden="true" />Matches the secret target</span></div>
        <table>
          <caption>Illustrative answer patterns for eight questions</caption>
          <thead><tr><th scope="col">Question</th>{targets.map((_, index) => <th scope="col" key={index}>{String(index + 1).padStart(2, "0")}</th>)}</tr></thead>
          <tbody>{responseRows.map(row => <tr className={`fire-answer-row-${row.kind}`} key={row.kind}>
            <th scope="row">{row.label}</th>
            {row.values.map((value, index) => <td className={row.kind !== "targets" && value === targets[index] ? "is-match" : ""} key={index}><span>{value}</span>{row.kind !== "targets" && value === targets[index] ? <span className="fire-sr-only">, matches target</span> : null}</td>)}
          </tr>)}</tbody>
        </table>
        <figcaption>One matching answer can occur by chance. The test uses the assignment-wide pattern and depends on the calibrated assistant and assumed genuine-student model. These sequences are illustrative, not measured student responses.</figcaption>
      </figure>
    </section>
  );
}
