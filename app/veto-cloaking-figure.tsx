import "./veto-cloaking-figure.css";

function ImageDrawing({ x, y, size, label, symbol, edited = false }: {
  x: number; y: number; size: number; label: string; symbol: string; edited?: boolean;
}) {
  return <g transform={`translate(${x} ${y})`}>
    <text className="veto-cloak-label" x={size / 2} y="-17" textAnchor="middle">{label}</text>
    <svg width={size} height={size} viewBox="0 0 150 150" fill="none">
      <rect className="veto-cloak-image-frame" x="1" y="1" width="148" height="148" rx="9" />
      <path className="veto-cloak-land" d={edited ? "M14 119 46 96 88 116 125 82 136 95V135H14Z" : "M14 114 44 78 70 99 101 67 136 106V135H14Z"} />
      <circle className="veto-cloak-sun" cx={edited ? 111 : 37} cy="36" r="13" />
      <path className="veto-cloak-image-line" d={edited ? "M16 69h38m-21 8h48M94 48h40" : "M78 38h52m-32 8h32M16 57h34"} />
      <path className="veto-cloak-image-line" d={edited ? "M51 109V62h27v51m-22-38h17m-17 12h17" : "M51 94V53h27v55m-22-42h17m-17 12h17"} />
    </svg>
    <text className="veto-cloak-symbol" x={size / 2} y={size + 25} textAnchor="middle">{symbol}</text>
  </g>;
}

function CloakingDiagram({ mobile = false }: { mobile?: boolean }) {
  const id = mobile ? "mobile" : "desktop";
  const model = mobile ? { x: 65, y: 282, w: 230, h: 110 } : { x: 551, y: 46, w: 238, h: 150 };
  const center = model.x + model.w / 2;
  const delta = mobile ? { x: 180, y: 122 } : { x: 234, y: 121 };
  const marker = `url(#veto-cloak-arrow-${id})`;
  const updateMarker = `url(#veto-cloak-update-${id})`;
  return <svg className={`veto-cloak-drawing ${mobile ? "veto-cloak-mobile" : "veto-cloak-desktop"}`} viewBox={mobile ? "0 0 360 680" : "0 0 1080 338"} role="img" aria-labelledby={`veto-cloak-title-${id} veto-cloak-desc-${id}`}>
    <title id={`veto-cloak-title-${id}`}>Data cloaking changes an image while keeping the editing model fixed</title>
    <desc id={`veto-cloak-desc-${id}`}>An original image x is combined with a small perturbation delta to form a protected image. An image-editing model with frozen weights receives the protected image and produces an edited output. The dashed return indicates optimization of the image cloak. The protection objective depends on the cloaking method.</desc>
    <defs>
      <marker id={`veto-cloak-arrow-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="m2 1 6 4-6 4" className="veto-cloak-arrowhead" /></marker>
      <marker id={`veto-cloak-update-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="m2 1 6 4-6 4" className="veto-cloak-update-head" /></marker>
    </defs>
    <ImageDrawing x={mobile ? 9 : 17} y={mobile ? 50 : 46} size={mobile ? 130 : 150} label="Original image" symbol="x" />
    <ImageDrawing x={mobile ? 221 : 321} y={mobile ? 50 : 46} size={mobile ? 130 : 150} label="Protected image" symbol="x̃ = x + δ" />
    <ImageDrawing x={mobile ? 105 : 910} y={mobile ? 486 : 46} size={150} label="Edited output" symbol="y" edited />
    <g className="veto-cloak-forward" markerEnd={marker}>
      <path d={mobile ? "M144 122H158" : "M177 121H209"} />
      <path d={mobile ? "M201 122H216" : "M257 121H309"} />
      <path d={mobile ? "M286 215V225H336V337H303" : "M484 121H539"} />
      <path d={mobile ? "M180 400V451" : "M801 121H898"} />
    </g>
    <g transform={`translate(${delta.x} ${delta.y})`}>
      <circle className="veto-cloak-delta" r="19" />
      <path className="veto-cloak-plus" d="M-7 0H7M0-7V7" />
      <text className="veto-cloak-delta-label" x="0" y="49" textAnchor="middle">Cloak δ</text>
    </g>
    <rect className="veto-cloak-model" x={model.x} y={model.y} width={model.w} height={model.h} rx="12" />
    <text className="veto-cloak-model-title" x={center} y={model.y + model.h / 2 - 4} textAnchor="middle">Image editor</text>
    <text className="veto-cloak-small" x={center} y={model.y + model.h / 2 + 23} textAnchor="middle">Weights θ remain frozen</text>
    <path className="veto-cloak-gradient" markerEnd={updateMarker} d={mobile
      ? "M65 350H29Q18 350 18 339V229Q18 218 29 218H169Q180 218 180 207V189"
      : "M670 196V270Q670 287 653 287H252Q234 287 234 270V183"} />
    <text className="veto-cloak-update-label" x={mobile ? 180 : 450} y={mobile ? 246 : 314} textAnchor="middle">Optimize cloak</text>
  </svg>;
}

export function VetoCloakingFigure() {
  return <section className="veto-cloaking-section page-shell" aria-labelledby="veto-cloaking-title">
    <div className="paper-viz-heading">
      <div><p className="section-number">03 / Image cloaking</p><h2 id="veto-cloaking-title">Data cloaking</h2></div>
      <p>A small perturbation is added before an image is shared, aiming to disrupt later AI edits while preserving its appearance.</p>
    </div>
    <figure className="veto-cloaking-figure">
      <CloakingDiagram />
      <CloakingDiagram mobile />
      <figcaption>The dashed path optimizes the image cloak; the editing model stays fixed. The protection objective varies by method. Image drawings are schematic.</figcaption>
    </figure>
    <p className="veto-cloaking-related">Related work: <a href="https://arxiv.org/abs/2302.06588" target="_blank" rel="noreferrer">PhotoGuard ↗</a><span aria-hidden="true">·</span><a href="https://arxiv.org/abs/2311.12066" target="_blank" rel="noreferrer">EditShield ↗</a><span aria-hidden="true">·</span><a href="https://arxiv.org/abs/2511.00143" target="_blank" rel="noreferrer">BlurGuard ↗</a></p>
  </section>;
}
