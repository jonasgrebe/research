import { IrisFrameworkStudy, IrisCooldownStudy } from "./iris-scenes";
import { InspectableImage } from "../shared/inspectable-image";
import { IrisProtectedPreview } from "./iris-protected-preview";

const base=process.env.NEXT_PUBLIC_BASE_PATH??"";
function IrisImage({name,alt}: {name:string;alt:string}) {
  if(name==="guitar-clean-edit") return <IrisProtectedPreview src={`${base}/iris/source/guitar-clean-edit.png`} protectedSrc={`${base}/iris/source/guitar-none.png`} alt={alt} />;
  const raw=/^(hair|armchair|guitar)-/.test(name);
  const dimensions=name.includes("artwork")?[1254,1254]:[512,512];
  return <InspectableImage src={raw?`${base}/iris/source/${name}.png`:`${base}/iris/${name}.webp`} alt={alt} width={dimensions[0]} height={dimensions[1]} />;
}

export function IrisOpening() {
  return <section className="rx-iris-opening rx-shell" id="iris-edits-title" aria-labelledby="rx-iris-edits-heading">
    <div className="rx-section-heading"><div><p className="section-number">01 / Image protection</p><h2 id="rx-iris-edits-heading">Protecting images<br /><em>from unwanted edits.</em></h2></div><p>Image editors can place a person in a fabricated situation or imitate an artist’s work. IRIS is designed to give owners an image-level opt-out.</p></div>
    <figure className="ix-edit-scenario ix-defamation-example">
      <figcaption><h3>Defamation</h3><p>A public-facing photograph can be turned into a fabricated police booking image.</p></figcaption>
      <div className="ix-edit-pair">
        <figure><InspectableImage src={`${base}/vetobench/defamation/images/base/59.png`} alt="Source image: a teacher standing beside a classroom chalkboard" width={512} height={512} /><figcaption>Source image</figcaption></figure>
        <span className="ix-edit-arrow" aria-hidden="true">↗</span>
        <figure><IrisProtectedPreview src={`${base}/vetobench/defamation/images/edited/59.png`} protectedSrc={`${base}/iris/source/booking-protected-edit.png`} alt="FLUX.2 edit: the same teacher in a fabricated police booking photograph, holding a placard" caption="FLUX.2 edit" /></figure>
      </div>
    </figure>
    <div className="ix-edit-scenarios">{[
      {key:"artwork",title:"Style imitation",description:"An artist’s visual style can be reused to create new work without their permission.",input:"Fantasy artwork with a purple-haired character and red scarf",output:"Illustrative example of a new scene imitating the artwork’s style",before:"Source artwork",after:"Imitated style"},
      {key:"house",title:"Fabricated events",description:"A photograph can be altered to depict an event that never happened.",input:"A house with a front porch",output:"Illustrative example of the house altered to suggest a violent crime scene",before:"Source scene",after:"Altered scene"},
    ].map(item=><figure className="ix-edit-scenario" key={item.key}>
      <figcaption><h3>{item.title}</h3><p>{item.description}</p></figcaption>
      <div className="ix-edit-pair"><figure><IrisImage name={`teaser-${item.key}-input`} alt={item.input} /><figcaption>{item.before}</figcaption></figure><span className="ix-edit-arrow" aria-hidden="true">↗</span><figure><IrisProtectedPreview src={`${base}/iris/teaser-${item.key}-edit.webp`} alt={item.output} caption={item.after} width={item.key==='artwork'?1254:512} height={item.key==='artwork'?1254:512} /></figure></div>
    </figure>)}</div>
  </section>;
}

export function IrisMethodStudy() {
  return <><IrisFrameworkStudy />
    <section className="rx-iris-method rx-shell" id="iris-method-title" aria-labelledby="rx-iris-method-heading"><div className="rx-section-heading"><div><p className="section-number">04 / Selective velocity cooldown</p><h2 id="rx-iris-method-heading">Selective<br /><em>velocity cooldown.</em></h2></div><p>IRIS preserves the original velocity on clean inputs and trains the protected-input velocity toward zero. The protected trajectory stays in the noisy region instead of reaching a completed image.</p></div>
    <IrisCooldownStudy />
    <div className="rx-iris-training"><article><h3>The owner embeds the signal</h3><p>A frozen Watermark Anything embedder protects an image in one pass. The owner needs neither per-image optimization nor access to the editor.</p></article><article><h3>The provider learns the response</h3><p>LoRA adapts the denoising transformer using source images and empty instructions. Training needs no target edited images or separate decoding gate. Protection requires continued use of the adapted editor.</p></article></div>
    </section>
  </>;
}

export function IrisRobustnessStudy() {
  return <><section className="rx-iris-robustness" id="iris-robustness-title" aria-labelledby="rx-iris-robustness-heading"><div className="rx-shell">
    <div className="rx-section-heading"><div><p className="section-number">05 / Image transformations</p><h2 id="rx-iris-robustness-heading">Protection after<br /><em>image transformations.</em></h2></div><p>FLUX.2 with IRIS receives the protected guitar after each transformation, with the same editing instruction.</p></div>
    <p className="rx-iris-prompt">“Convert this instrument into a futuristic hard-light construct made of glowing neon blue energy lines.”</p>
    <div className="rx-robustness-board"><div className="rx-robustness-baseline"><figure><IrisImage name="guitar-input" alt="Acoustic guitar used as the protected input" /><figcaption>Protected input</figcaption></figure><figure><IrisImage name="guitar-clean-edit" alt="Successful clean-input edit: a guitar made of neon-blue energy lines" /><figcaption>Clean-input edit</figcaption></figure></div>
      <div className="rx-transform-outputs">{[["none","Unchanged"],["flip","Horizontal flip"],["jpeg","JPEG · Q70"],["downscale","Resize · 50% side"],["crop","Crop · 75% area"],["blur","Gaussian blur · σ1.25"]].map(([key,label])=><figure key={key}><IrisImage name={`guitar-${key}`} alt={`Protected-input output after ${label.toLowerCase()}`} /><figcaption>{label}</figcaption></figure>)}</div>
    </div><p className="rx-iris-boundary">The protected inputs produce noisy outputs in these examples. Stronger JPEG compression is harder, and diffusion-based purification can restore editing at native watermark strength.</p>
  </div></section>
  <section className="rx-iris-references rx-shell" aria-labelledby="rx-iris-references-heading"><div className="rx-section-heading"><div><p className="section-number">06 / Multiple references</p><h2 id="rx-iris-references-heading">One protected image.<br /><em>Multiple references.</em></h2></div><p>Each request below uses two images. Exactly one is protected. The evaluation covers 50 tasks with two or three references.</p></div>
    {[
      {key:"hair",prompt:"Change the hair of the person in Reference 1 to match Reference 2.",sealed:1},
      {key:"armchair",prompt:"Add the man from Reference 2 to the armchair in Reference 1.",sealed:2},
    ].map(item=><figure className="rx-iris-reference-row" key={item.key}><figcaption>“{item.prompt}”</figcaption><div>{[1,2].map(index=><figure className={item.sealed===index?'rx-iris-sealed':undefined} key={index}><IrisImage name={`${item.key}-reference-${index}`} alt={`Reference ${index}, ${item.sealed===index?'protected':'clean'}`} /><figcaption>Reference {index}{item.sealed===index&&<span>Protected</span>}</figcaption></figure>)}<figure><IrisImage name={`${item.key}-clean-edit`} alt="IRIS result when both references are clean" /><figcaption>Both clean</figcaption></figure><figure className="rx-iris-sealed"><IrisImage name={`${item.key}-protected-edit`} alt="Noisy IRIS result when one reference is protected" /><figcaption>One protected</figcaption></figure></div></figure>)}
  </section></>;
}
