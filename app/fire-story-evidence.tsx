import Image from "next/image";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function FireStoryEvidence() {
  return (
    <section className="fire-story-evidence page-shell" aria-labelledby="fire-story-title">
      <div className="story-figure-heading">
        <h2 id="fire-story-title">B is correct.<br />C is the target.</h2>
        <p>Choose a secret, incorrect answer. Alter the image to make an AI assistant more likely to select it. Across an assignment, repeated matches become a testable pattern.</p>
      </div>
      <div className="fire-story-question">
        <div className="fire-story-exercise">
          <span className="story-eyebrow">The paper’s illustrative exercise</span>
          <h3>What is the main function of this organelle?</h3>
          <div className="fire-story-image-pair">
            <figure><Image unoptimized src={`${basePath}/images/fire-mitochondrion.png`} alt="Original diagram of a mitochondrion" width="400" height="200" /><figcaption>Original image</figcaption></figure>
            <figure><Image unoptimized src={`${basePath}/images/fire-mitochondrion-protected.png`} alt="Perturbed mitochondrion diagram with the same visible structure" width="400" height="200" /><figcaption>Protected image</figcaption></figure>
          </div>
          <ol className="fire-story-options">
            <li><b>A</b><span>Protein synthesis</span></li>
            <li data-answer="correct"><b>B</b><span>Energy production</span><em>Correct answer</em></li>
            <li data-answer="target"><b>C</b><span>Waste removal</span><em>Secret target</em></li>
            <li><b>D</b><span>Genetic storage</span></li>
          </ol>
        </div>
        <div className="fire-story-logic">
          <article><span>01</span><div><h3>The student’s task stays the same.</h3><p>The intervention changes image pixels, not the question or the correct answer.</p></div></article>
          <article><span>02</span><div><h3>The model gets a different incentive.</h3><p>The perturbation is optimized toward C, using accessible surrogate models. Transfer to a deployed assistant must then be measured.</p></div></article>
          <article><span>03</span><div><h3>One wrong answer proves nothing.</h3><p>Only a calibrated pattern across questions provides evidence of sustained, uncritical copying. This diagram illustrates the mechanism, not a recorded assistant response.</p></div></article>
        </div>
      </div>
      <a className="story-source" href="https://arxiv.org/html/2608.01112v1#S3" target="_blank" rel="noreferrer">Method and illustrative example · Figure 3 ↗</a>
    </section>
  );
}
