import Image from "next/image";
import "./plw-stage-one.css";

const imageRoot = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/plw`;

function Module({ x, y, width = 96, label, symbol, trainable = false }: {
  x: number; y: number; width?: number; label: string; symbol: string; trainable?: boolean;
}) {
  return <g transform={`translate(${x} ${y})`}>
    <rect className={trainable ? "plw-s1-module-trainable" : "plw-s1-module-frozen"} x={-width / 2} y="-27" width={width} height="54" rx="7" />
    <text className="plw-s1-module-label" textAnchor="middle" y="-5">{label}</text>
    <text className="plw-s1-symbol" textAnchor="middle" y="17">{symbol}</text>
  </g>;
}

function StageOneDiagram({ mobile = false }: { mobile?: boolean }) {
  const id = mobile ? "mobile" : "desktop";
  const arrow = `url(#plw-s1-arrow-${id})`;
  const messageArrow = `url(#plw-s1-message-arrow-${id})`;
  return <svg className={`plw-s1-diagram ${mobile ? "plw-s1-mobile" : "plw-s1-desktop"}`} viewBox={mobile ? "0 0 360 635" : "0 0 1100 270"} role="img" aria-labelledby={`plw-s1-title-${id} plw-s1-desc-${id}`}>
    <title id={`plw-s1-title-${id}`}>Learning to embed and recover a watermark</title>
    <desc id={`plw-s1-desc-${id}`}>The frozen VAE encoder maps an image x to latent z. A trainable message encoder maps random binary message m to perturbation delta, which is added to z. The frozen VAE decoder turns this watermarked latent into an image. Re-encoding that image with the frozen VAE and passing it through the trainable extractor recovers message m hat. Only the message encoder and extractor are trained in this stage.</desc>
    <defs>
      <marker id={`plw-s1-arrow-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="m2 1 6 4-6 4" className="plw-s1-arrowhead" /></marker>
      <marker id={`plw-s1-message-arrow-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="m2 1 6 4-6 4" className="plw-s1-message-arrowhead" /></marker>
    </defs>
    {mobile ? <>
      <g className="plw-s1-flow" markerEnd={arrow}>
        {"M70 65v35M70 162v23M70 214v42M70 292v30M70 356v34M70 452v29M70 520v38M125 590h25M254 590h37".split("M").filter(Boolean).map((segment, index) => <path key={index} d={`M${segment}`} />)}
      </g>
      <g className="plw-s1-message-flow" markerEnd={messageArrow}>
        {"M255 67v36M255 165v76q0 31-31 31H90".split("M").filter(Boolean).map((segment, index) => <path key={index} d={`M${segment}`} />)}
      </g>
      <text className="plw-s1-symbol" x="70" y="49" textAnchor="middle">x</text>
      <text className="plw-s1-small" x="112" y="49">Image</text>
      <Module x={70} y={131} width={100} label="VAE encoder" symbol="ℰ" />
      <text className="plw-s1-symbol" x="70" y="207" textAnchor="middle">z</text>
      <circle className="plw-s1-add" cx="70" cy="272" r="17" /><path className="plw-s1-plus" d="M62 272h16m-8-8v16" />
      <text className="plw-s1-symbol" x="70" y="346" textAnchor="middle">z + δ</text>
      <Module x={70} y={421} width={100} label="VAE decoder" symbol="𝒟" />
      <text className="plw-s1-symbol" x="70" y="506" textAnchor="middle">x<tspan baselineShift="sub" fontSize="12">wm</tspan></text>
      <text className="plw-s1-small" x="110" y="506">Watermarked image</text>
      <Module x={70} y={590} width={100} label="VAE encoder" symbol="ℰ" />
      <Module x={202} y={590} width={100} label="Extractor" symbol="Dω" trainable />
      <text className="plw-s1-symbol" x="316" y="597" textAnchor="middle">m̂</text>
      <text className="plw-s1-symbol plw-s1-message-symbol" x="255" y="49" textAnchor="middle">m</text>
      <text className="plw-s1-small" x="255" y="25" textAnchor="middle">Random bits</text>
      <Module x={255} y={134} width={132} label="Message encoder" symbol="Eϕ" trainable />
      <text className="plw-s1-symbol plw-s1-message-symbol" x="235" y="228" textAnchor="end">δ</text>
      <text className="plw-s1-small" x="255" y="314" textAnchor="middle">Latent perturbation</text>
    </> : <>
      <g className="plw-s1-flow" markerEnd={arrow}>
        {"M39 185h34M175 185h39M248 185h46M334 185h40M430 185h39M571 185h49M682 185h38M822 185h34M966 185h57".split("M").filter(Boolean).map((segment, index) => <path key={index} d={`M${segment}`} />)}
      </g>
      <g className="plw-s1-message-flow" markerEnd={messageArrow}>
        {"M166 56h66M314 87v76".split("M").filter(Boolean).map((segment, index) => <path key={index} d={`M${segment}`} />)}
      </g>
      <text className="plw-s1-symbol" x="22" y="192" textAnchor="middle">x</text>
      <text className="plw-s1-small" x="22" y="226" textAnchor="middle">Image</text>
      <Module x={124} y={185} label="VAE encoder" symbol="ℰ" />
      <text className="plw-s1-symbol" x="231" y="192" textAnchor="middle">z</text>
      <text className="plw-s1-small" x="231" y="226" textAnchor="middle">Latent</text>
      <circle className="plw-s1-add" cx="314" cy="185" r="17" /><path className="plw-s1-plus" d="M306 185h16m-8-8v16" />
      <text className="plw-s1-symbol" x="402" y="192" textAnchor="middle">z + δ</text>
      <Module x={520} y={185} label="VAE decoder" symbol="𝒟" />
      <text className="plw-s1-symbol" x="651" y="192" textAnchor="middle">x<tspan baselineShift="sub" fontSize="13">wm</tspan></text>
      <text className="plw-s1-small" x="651" y="226" textAnchor="middle">Watermarked image</text>
      <Module x={771} y={185} label="VAE encoder" symbol="ℰ" />
      <Module x={912} y={185} width={104} label="Extractor" symbol="Dω" trainable />
      <text className="plw-s1-symbol" x="1055" y="192" textAnchor="middle">m̂</text>
      <text className="plw-s1-small" x="1055" y="226" textAnchor="middle">Recovered bits</text>
      <text className="plw-s1-symbol plw-s1-message-symbol" x="145" y="63" textAnchor="middle">m</text>
      <text className="plw-s1-small" x="145" y="31" textAnchor="middle">Random bits</text>
      <Module x={314} y={56} width={156} label="Message encoder" symbol="Eϕ" trainable />
      <text className="plw-s1-symbol plw-s1-message-symbol" x="333" y="128">δ</text>
      <text className="plw-s1-small" x="356" y="127">Latent perturbation</text>
    </>}
  </svg>;
}

function StageOneLoss() {
  return <div className="plw-s1-loss">
    <div className="plw-s1-equation" role="math" aria-label="L stage 1 equals binary cross entropy of recovered message m hat and target message m, plus lambda image times the squared L2 distance between watermarked image x wm and clean reconstruction x rec.">
      <span className="plw-s1-loss-name">ℒ<sub>stage 1</sub> =</span>
      <div className="plw-s1-loss-term plw-s1-recovery-term"><span>BCE(m̂, m)</span><p>Recover the message</p></div>
      <span className="plw-s1-loss-plus">+</span>
      <div className="plw-s1-loss-term plw-s1-image-term"><span>λ<sub>img</sub> ‖x<sub>wm</sub> − x<sub>rec</sub>‖<sub>2</sub><sup>2</sup></span><p>Preserve the image</p></div>
    </div>
    <p className="plw-s1-loss-definition">The image term compares the watermarked output with the clean VAE reconstruction, <span>x<sub>rec</sub> = 𝒟(ℰ(x))</span>. It therefore isolates the added watermark from the autoencoder’s reconstruction error.</p>
  </div>;
}

export function PlwStageOne() {
  return <section className="paper-viz-section plw-stage-one page-shell" aria-labelledby="plw-stage-one-title">
    <div className="paper-viz-heading plw-section-heading">
      <div><p className="section-number">04 / Stage 1</p><h2 id="plw-stage-one-title">Learning a latent watermark</h2></div>
      <p>A message encoder and extractor learn to hide and recover binary messages through the model’s image autoencoder. This stage uses images and random bit strings, before any association with chat content.</p>
    </div>
    <figure className="plw-s1-pipeline">
      <div className="plw-s1-legend"><span><i className="plw-s1-trainable-key" />Trainable message encoder and extractor</span><span><i className="plw-s1-frozen-key" />Frozen VAE</span></div>
      <StageOneDiagram /><StageOneDiagram mobile />
      <figcaption>Each message bit is sampled independently with equal probability of 0 or 1. The extractor sees the image after decoding and re-encoding, so message recovery must survive that round trip.</figcaption>
    </figure>
    <StageOneLoss />
    <figure className="plw-s1-example">
      <div className="plw-s1-example-images">
        <div><span>Original image</span><Image src={`${imageRoot}/original-food.png`} alt="Original food image from Figure 7: a plate of food with two cups of coffee." width={512} height={512} unoptimized /></div>
        <div><span>Watermarked reconstruction</span><Image src={`${imageRoot}/watermarked-food.png`} alt="Decoded watermarked reconstruction of the same food image, with no conspicuous visual change." width={512} height={512} unoptimized /></div>
      </div>
      <figcaption><strong>Watermarking an image</strong><p>Figure 7 shows an original image and its decoded watermarked version. This is a Stage 1 example; their difference includes autoencoder reconstruction as well as the watermark.</p><p>Stage 2 will teach the unified model when to insert this learned marker.</p></figcaption>
    </figure>
  </section>;
}
