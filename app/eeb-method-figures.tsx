import "./eeb-method-figures.css";

const variants = [
  { id: "data", title: "Data", description: "Poisoned image–text pairs. No access to model weights." },
  { id: "surface", title: "Surface", description: "Text encoder fine-tuning; the U-Net stays frozen." },
  { id: "shallow", title: "Shallow", description: "Closed-form edits to cross-attention key/value projections." },
  { id: "deep", title: "Deep", description: "LoRA throughout the U-Net, using score-level self-distillation." },
] as const;

function InterventionDiagram({ variant }: { variant: (typeof variants)[number]["id"] }) {
  const layers = [[28, 104], [76, 132], [124, 160], [172, 132], [220, 104]];
  if (variant === "data") {
    return <svg className="eeb-intervention-drawing" viewBox="0 0 280 236" role="img" aria-label="Poisoned image–text pairs enter model training. The attacker does not edit weights directly.">
      <path className="eeb-wire" d="M140 113V162m-4-4 4 4 4-4" />
      <g className="eeb-pair-sheet"><rect x="64" y="27" width="154" height="84" rx="5" /><rect x="55" y="36" width="154" height="84" rx="5" /><rect x="46" y="45" width="154" height="84" rx="5" /></g>
      <rect className="eeb-modified" x="58" y="58" width="48" height="48" rx="3" />
      <path className="eeb-image-mark" d="m62 99 13-16 10 9 8-8 9 15M91 70h.1" />
      <text className="eeb-diagram-text eeb-trigger-text" x="121" y="83">trigger</text>
      <path className="eeb-wire" d="M121 94h61M121 102h40" />
      <rect className="eeb-training-process" x="48" y="165" width="184" height="38" rx="5" />
      <text className="eeb-diagram-text" x="140" y="189" textAnchor="middle">Model training</text>
    </svg>;
  }
  return <svg className="eeb-intervention-drawing" viewBox="0 0 280 236" role="img" aria-label={variant === "surface" ? "The text encoder is modified. All U-Net layers are frozen." : variant === "shallow" ? "Only key/value projections inside U-Net cross-attention are modified. The text encoder and other U-Net weights are frozen." : "LoRA updates span the U-Net, including its cross-attention. The text encoder is frozen."}>
    <rect className={variant === "surface" ? "eeb-modified" : "eeb-frozen"} x="47" y="25" width="186" height="38" rx="5" />
    <text className="eeb-diagram-text" x="140" y="49" textAnchor="middle">Text encoder</text>
    <path className="eeb-conditioning-wire" d="M140 63V78H44V104M140 78h96v26M140 78v82M92 78v54M188 78v54" />
    <rect className="eeb-unet-boundary" x="14" y="91" width="252" height="130" rx="7" />
    <path className="eeb-wire" d="M60 120.5H68V148.5H76M108 148.5H116V176.5H124M156 176.5H164V148.5H172M204 148.5H212V120.5H220" />
    <path className="eeb-skip-wire" d="M44 104V97h192v7M92 132v-20h96v20" />
    {layers.map(([x, y], index) => <g key={index}>
      <rect className={variant === "deep" ? "eeb-modified" : "eeb-frozen"} x={x} y={y} width="32" height="33" rx="3" />
      <rect className={variant === "shallow" || variant === "deep" ? "eeb-kv eeb-modified" : "eeb-kv eeb-frozen"} x={x + 5} y={y + 20} width="22" height="8" rx="1" />
    </g>)}
    <text className="eeb-diagram-text" x="140" y="210" textAnchor="middle">U-Net</text>
  </svg>;
}

export function ErasedButNotForgottenVisualizations() {
  return <section className="paper-viz-section eeb-method-section page-shell" aria-labelledby="eeb-viz-title">
    <div className="paper-viz-heading">
      <div><p className="section-number">03 / Erasure evasion</p><h2 id="eeb-viz-title">Backdoors after concept erasure</h2></div>
      <p>The attacker introduces the backdoor before erasure. The test is whether a hidden trigger can still recover the target afterwards.</p>
    </div>

    <figure className="eeb-threat-figure">
      <ol className="eeb-sequence" aria-label="Order of interventions">
        <li><span>1</span>Backdoor insertion</li><li><span>2</span>Concept erasure</li><li><span>3</span>Evaluation</li>
      </ol>
      <div className="eeb-threat-drawing">
        <div className="eeb-query-labels"><div><span>Concept request</span><code>c<sub>e</sub></code></div><div className="eeb-trigger-query"><span>Secret trigger request</span><code>†<sub>e</sub></code></div></div>
        <svg className="eeb-threat-desktop" viewBox="0 0 720 300" role="img" aria-label="Two queries enter the same model after concept erasure. The direct target query is suppressed, while the backdoor trigger can still recover the target.">
          <defs><marker id="eeb-route-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="m1 1 5 3-5 3" fill="none" stroke="context-stroke" strokeWidth="1.3" /></marker></defs>
          <rect className="eeb-model-enclosure" x="163" y="30" width="394" height="240" rx="12" />
          <text className="eeb-model-label" x="360" y="64" textAnchor="middle">Model after erasure</text>
          <path className="eeb-direct-route" d="M0 111H291" markerEnd="url(#eeb-route-arrow)" />
          <path className="eeb-direct-route eeb-broken-route" d="M336 111H710" markerEnd="url(#eeb-route-arrow)" />
          <path className="eeb-erasure-break" d="m307 98 19 26m-19 0 19-26" />
          <path className="eeb-trigger-route" d="M0 212H219C259 212 267 175 311 175H410C454 175 465 212 503 212H710" markerEnd="url(#eeb-route-arrow)" />
          <circle className="eeb-route-junction" cx="311" cy="175" r="4" /><circle className="eeb-route-junction" cx="410" cy="175" r="4" />
          <text className="eeb-association-label" x="360" y="202" textAnchor="middle">trigger–target association</text>
        </svg>
        <svg className="eeb-threat-mobile" viewBox="0 0 340 360" role="img" aria-label="Both prompts enter the same model after concept erasure. The direct target query is suppressed; the trigger can recover the target through the surviving backdoor association.">
          <defs><marker id="eeb-mobile-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="m1 1 5 3-5 3" fill="none" stroke="context-stroke" strokeWidth="1.3" /></marker></defs>
          <text className="eeb-model-label" x="84" y="22" textAnchor="middle">Concept request</text>
          <text className="eeb-model-label eeb-mobile-trigger-label" x="254" y="22" textAnchor="middle">Secret trigger request</text>
          <text className="eeb-model-label" x="84" y="47" textAnchor="middle">cₑ</text>
          <text className="eeb-model-label eeb-mobile-trigger-label" x="254" y="47" textAnchor="middle">†ₑ</text>
          <rect className="eeb-model-enclosure" x="8" y="90" width="324" height="176" rx="10" />
          <text className="eeb-model-label" x="170" y="115" textAnchor="middle">Model after erasure</text>
          <path className="eeb-direct-route" d="M84 58V162" markerEnd="url(#eeb-mobile-arrow)" />
          <path className="eeb-erasure-break" d="m75 178 18 18m-18 0 18-18" />
          <path className="eeb-direct-route eeb-broken-route" d="M84 209V310" markerEnd="url(#eeb-mobile-arrow)" />
          <path className="eeb-trigger-route" d="M254 58V136C254 159 224 165 224 187S254 221 254 243V310" markerEnd="url(#eeb-mobile-arrow)" />
          <text className="eeb-association-label" x="207" y="183" textAnchor="end"><tspan x="207">Association</tspan><tspan x="207" dy="19">survives</tspan></text>
          <text className="eeb-diagram-text" x="84" y="337" textAnchor="middle">Target suppressed</text>
          <text className="eeb-diagram-text eeb-mobile-trigger-label" x="254" y="337" textAnchor="middle">Target recovered</text>
        </svg>
        <div className="eeb-query-results"><div>Target suppressed</div><div className="eeb-trigger-result">Target recovered</div></div>
      </div>
      <figcaption>Schematic of a successful erasure-evasion attack. Evaluated targets include celebrity identities, objects, and explicit content; persistence depends on the attack and erasure method. <a href="https://arxiv.org/html/2504.21072v3#S3.SS1" target="_blank" rel="noreferrer">Threat model ↗</a></figcaption>
    </figure>

    <figure className="eeb-scope-figure">
      <header><h3>Where the backdoor is introduced</h3><div className="eeb-scope-legend" aria-label="Weight-based variants: modified or frozen components"><span><i />Modified</span><span><i />Frozen</span></div></header>
      <div className="eeb-interventions">{variants.map((variant) => <div className="eeb-intervention" data-variant={variant.id} key={variant.id}>
        <h4>EEB<sub>{variant.id}</sub></h4>
        <InterventionDiagram variant={variant.id} />
        <p>{variant.description}</p>
      </div>)}</div>
      <figcaption>Stable Diffusion variants. Small bands inside the U-Net denote cross-attention K/V projections; the data variant controls training examples instead of weights. <a href="https://arxiv.org/html/2504.21072v3#S3.SS2" target="_blank" rel="noreferrer">Variants and objectives ↗</a></figcaption>
    </figure>
  </section>;
}
