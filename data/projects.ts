export type ProjectAccent =
  | "cobalt"
  | "coral"
  | "violet"
  | "amber"
  | "teal"
  | "rose"
  | "eeb-purple";
export type ProjectVisual =
  | "gem"
  | "obliviate"
  | "tobac"
  | "eeb"
  | "veto"
  | "fire"
  | "defame"
  | "infact";

export type Project = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  keyMessage: string;
  abstract: string;
  year: number;
  status: string;
  conference?: string;
  location?: string;
  acceptanceType?: string;
  authors: Array<{
    name: string;
    equalContribution?: boolean;
    href?: string;
  }>;
  resources: Array<{
    label: string;
    href: string;
    primary?: boolean;
  }>;
  contributions: Array<{
    title: string;
    text: string;
  }>;
  method: Array<{
    label: string;
    title: string;
    text: string;
  }>;
  finding?: {
    value: string;
    label: string;
    context: string;
  };
  citation: string;
  bibtex: string;
  accent: ProjectAccent;
  visual: ProjectVisual;
  related: string[];
};

export const projects: Project[] = [
  {
    slug: "veto",
    shortTitle: "VETO",
    title: "VETO: Towards Protecting Images From Frontier AI Editing",
    summary:
      "A subtle image cloak that disrupts how modern unified editors attend to a protected reference image.",
    keyMessage:
      "Modern editors repeatedly read a reference image through joint attention. VETO protects the image by diffusing that attention before a faithful edit can form.",
    abstract:
      "Frontier image editors such as FLUX.2 can move identities and objects into entirely new scenes, extending misuse beyond predictable localized edits. Existing anti-edit defenses target the encoder bottleneck used by legacy diffusion pipelines, but unified editors repeatedly access source-image tokens through joint attention. VETO instead optimizes a subtle per-image cloak that maximizes the entropy of canvas-to-reference and reference-to-canvas attention, disrupting source information as it flows into the generated output. The accompanying VetoBench evaluates both conventional closed-frame edits and open-frame recontextualization across general, defamatory, and graphic scenarios.",
    year: 2026,
    status: "Preprint",
    authors: [
      { name: "Jonas Grebe", equalContribution: true },
      { name: "Hossein Shakibania", equalContribution: true },
      { name: "Tobias Braun" },
      { name: "Marcus Rohrbach" },
      { name: "Anna Rohrbach" },
    ],
    resources: [],
    contributions: [
      {
        title: "Attention-level protection",
        text: "Targets the joint-attention mechanism used by native DiT editors instead of attacking a legacy encoder bottleneck.",
      },
      {
        title: "Stronger protection-fidelity trade-off",
        text: "Consistently leaves fewer successful edits while preserving more of the protected image than prior cloaking methods.",
      },
      {
        title: "VetoBench",
        text: "Adds 300 curated cases spanning closed-frame edits and open-frame recontextualization across general, defamatory, and graphic scenarios.",
      },
    ],
    method: [
      {
        label: "01",
        title: "Read the source",
        text: "Track where canvas tokens retrieve information from protected reference-image tokens.",
      },
      {
        label: "02",
        title: "Diffuse attention",
        text: "Optimize a subtle image perturbation that maximizes entropy across the reference-canvas attention blocks.",
      },
      {
        label: "03",
        title: "Break faithful editing",
        text: "The editor can no longer preserve the source reliably, while the protected image remains visually close to the original.",
      },
    ],
    finding: {
      value: "12 / 300",
      label: "successful edits",
      context:
        "Human evaluation on FLUX.2 and VetoBench at the selected VETO operating point; the same setting retains markedly better perceptual fidelity than prior defenses.",
    },
    citation:
      "Grebe, J., Shakibania, H., Braun, T., Rohrbach, M., & Rohrbach, A. (2026). VETO: Towards Protecting Images From Frontier AI Editing. Preprint.",
    bibtex: `@misc{grebe2026veto,
  title  = {{VETO}: Towards Protecting Images From Frontier AI Editing},
  author = {Jonas Grebe and Hossein Shakibania and Tobias Braun and Marcus Rohrbach and Anna Rohrbach},
  year   = {2026},
  note   = {Preprint}
}`,
    accent: "teal",
    visual: "veto",
    related: ["fighting-fire-with-fire", "obliviate"],
  },
  {
    slug: "fighting-fire-with-fire",
    shortTitle: "Fighting Fire with Fire",
    title:
      "Fighting Fire with Fire: On the Feasibility of Protecting Exercises Against AI Cheating",
    summary:
      "Protected visual questions steer AI assistants toward controlled wrong answers that form a detectable assignment-level fingerprint.",
    keyMessage:
      "Instead of guessing whether an answer was AI-written, design a set of questions whose controlled wrong-answer pattern reveals sustained blind copying.",
    abstract:
      "As multimodal assistants solve more educational exercises, detecting copied answers after submission becomes increasingly unreliable. This work explores a preventive alternative: add subtle, task-preserving perturbations to the visual parts of multiple-choice questions so AI solvers are steered toward designated incorrect answers. Across an assignment, those controlled errors form a statistical fingerprint. The method optimizes against accessible surrogate models, calibrates transfer through repeated black-box queries, and assembles questions whose answer patterns support likelihood-ratio testing across Claude, Gemini, and GPT assistants. The study establishes feasibility under a defined sustained-copying threat model while making educator judgment and the method’s limitations explicit.",
    year: 2026,
    status: "Preprint",
    authors: [
      { name: "Tobias Braun", equalContribution: true },
      { name: "Jonas Grebe", equalContribution: true },
      { name: "Louis Rethfeld" },
      { name: "Marcus Rohrbach" },
    ],
    resources: [],
    contributions: [
      {
        title: "Assessment-side intervention",
        text: "Moves the problem from post-hoc authorship classification to proactive exercise design.",
      },
      {
        title: "Controlled error fingerprint",
        text: "Uses target-specific visual perturbations to create a pattern that blind AI copying reproduces across an assignment.",
      },
      {
        title: "Calibrated detection",
        text: "Combines black-box response calibration with assistant-specific statistical tests and clearly stated student-model assumptions.",
      },
    ],
    method: [
      {
        label: "01",
        title: "Choose a target",
        text: "Assign each multimodal question a secret, incorrect target answer.",
      },
      {
        label: "02",
        title: "Steer the solver",
        text: "Optimize a subtle visual perturbation against an ensemble of accessible surrogate models.",
      },
      {
        label: "03",
        title: "Calibrate transfer",
        text: "Query frontier assistants repeatedly and retain question-model pairs with reliable target separation.",
      },
      {
        label: "04",
        title: "Detect the pattern",
        text: "Combine retained questions into an assignment and test for unusual overlap with the hidden targets.",
      },
    ],
    finding: {
      value: "≥95%",
      label: "modeled detection power",
      context:
        "For the shared 20-question assignment under the educator-provided student model, with fewer than 8 modeled false flags per 10,000 genuine students.",
    },
    citation:
      "Braun, T., Grebe, J., Rethfeld, L., & Rohrbach, M. (2026). Fighting Fire with Fire: On the Feasibility of Protecting Exercises Against AI Cheating. Preprint.",
    bibtex: `@misc{braun2026fighting,
  title  = {Fighting Fire with Fire: On the Feasibility of Protecting Exercises Against AI Cheating},
  author = {Tobias Braun and Jonas Grebe and Louis Rethfeld and Marcus Rohrbach},
  year   = {2026},
  note   = {Preprint}
}`,
    accent: "rose",
    visual: "fire",
    related: ["veto", "token-by-token"],
  },
  {
    slug: "gem",
    shortTitle: "GEM",
    title:
      "GEM: Geometric Erasure by Contrastive Velocity Matching in Rectified Flows",
    summary:
      "A geometric training objective that removes targeted concepts from rectified-flow generators while protecting benign behavior.",
    keyMessage:
      "Erase a concept by changing the geometry of the flow field: repel target behavior, attract benign behavior, and leave unrelated generation intact.",
    abstract:
      "Multimodal generators can reproduce harmful, impersonating, or copyrighted concepts. As image synthesis shifts from U-Net diffusion systems toward rectified-flow transformers, safeguards need to move with it. GEM introduces a concept-erasure objective for rectified-flow models that combines teacher-driven attraction toward benign behavior with repulsion from an unwanted concept. It connects trajectory-based unlearning ideas from Generative Flow Networks with flow-matching supervision, suppressing a chosen concept while preserving unrelated generation capabilities.",
    year: 2026,
    status: "Accepted",
    conference: "ICML 2026",
    location: "Seoul, South Korea",
    acceptanceType: "Spotlight",
    authors: [
      { name: "Jonas Henry Grebe", equalContribution: true },
      { name: "Tobias Braun", equalContribution: true },
      { name: "Anna Rohrbach" },
      { name: "Marcus Rohrbach" },
    ],
    resources: [
      {
        label: "Paper",
        href: "https://openreview.net/pdf?id=NBMCwxTRSA",
        primary: true,
      },
      {
        label: "OpenReview",
        href: "https://openreview.net/forum?id=NBMCwxTRSA",
      },
    ],
    contributions: [
      {
        title: "A bridge between paradigms",
        text: "Recasts trajectory-level unlearning signals as teacher-guided flow matching, bringing two complementary approaches into one formulation.",
      },
      {
        title: "Geometric guidance",
        text: "Combines attraction toward benign generation and repulsion from the target concept as a single velocity-space objective.",
      },
      {
        title: "Targeted intervention",
        text: "Suppresses selected concepts in rectified-flow transformers while retaining the model’s broader generative behavior.",
      },
    ],
    method: [
      {
        label: "01",
        title: "Observe the field",
        text: "A teacher model exposes how the rectified-flow velocity changes with and without the target concept.",
      },
      {
        label: "02",
        title: "Contrast directions",
        text: "Repulsive and attractive velocity signals identify a geometric direction away from the unwanted concept.",
      },
      {
        label: "03",
        title: "Match safely",
        text: "The student follows the corrected velocity field while staying aligned with benign generation.",
      },
    ],
    citation:
      "Grebe, J. H., Braun, T., Rohrbach, A., & Rohrbach, M. (2026). GEM: Geometric Erasure by Contrastive Velocity Matching in Rectified Flows. Forty-third International Conference on Machine Learning.",
    bibtex: `@inproceedings{grebe2026gem,
  title     = {{GEM}: Geometric Erasure by Contrastive Velocity Matching in Rectified Flows},
  author    = {Jonas Henry Grebe and Tobias Braun and Anna Rohrbach and Marcus Rohrbach},
  booktitle = {Forty-third International Conference on Machine Learning},
  year      = {2026},
  url       = {https://openreview.net/forum?id=NBMCwxTRSA}
}`,
    accent: "cobalt",
    visual: "gem",
    related: ["obliviate", "erased-but-not-forgotten"],
  },
  {
    slug: "obliviate",
    shortTitle: "Obliviate",
    title:
      "Obliviate: Erasing Concepts from Autoregressive Image Generation Models",
    summary:
      "Guidance-based concept erasure for autoregressive image generators, trained across complete visual-token trajectories.",
    keyMessage:
      "Stable autoregressive erasure requires teaching whole token trajectories against aligned visual histories—not correcting tokens in isolation.",
    abstract:
      "Autoregressive image generators are becoming central to unified multimodal systems, yet most concept-erasure research has focused on diffusion models. Obliviate adapts erasure to visual-token generation through aligned prefixes, distribution-level KL supervision, and updates across complete autoregressive rollouts. A frozen teacher constructs safer target distributions and a student learns them along the full trajectory. Evaluation spans Liquid, Emu3-Gen, and Janus-Pro, covering explicit content, graphic violence, and brand removal; on the defensive RAB benchmark, nudity detection falls from 91.58 to 3.15 while overall model utility is maintained.",
    year: 2026,
    status: "Accepted",
    conference: "ECCV 2026",
    location: "Malmö, Sweden",
    acceptanceType: "Poster",
    authors: [
      { name: "Hossein Shakibania", equalContribution: true },
      { name: "Jonas Henry Grebe", equalContribution: true },
      { name: "Tobias Braun", equalContribution: true },
      { name: "Ege Aktemur" },
      { name: "Saleh Aslani" },
      { name: "Mehmet Görkem Yiğit" },
      { name: "Marcus Rohrbach" },
    ],
    resources: [
      {
        label: "Paper",
        href: "https://arxiv.org/pdf/2606.28643",
        primary: true,
      },
      {
        label: "arXiv",
        href: "https://arxiv.org/abs/2606.28643",
      },
      {
        label: "Code",
        href: "https://github.com/multimodal-ai-lab/Obliviate",
      },
    ],
    contributions: [
      {
        title: "Autoregressive erasure",
        text: "Addresses concept removal directly in modern visual-token generators rather than translating assumptions from diffusion models.",
      },
      {
        title: "Aligned visual prefixes",
        text: "Conditions both teacher branches on the same evolving image context to create a stable and meaningful target signal.",
      },
      {
        title: "Full-trajectory supervision",
        text: "Uses KL divergence over visual-token distributions across complete rollouts instead of isolated token updates.",
      },
      {
        title: "Broad evaluation",
        text: "Studies explicit content, graphic violence, branding, and artistic style across three autoregressive generators.",
      },
    ],
    method: [
      {
        label: "01",
        title: "Generate a trajectory",
        text: "A frozen teacher produces a visual-token rollout conditioned on the concept selected for removal.",
      },
      {
        label: "02",
        title: "Align both branches",
        text: "Conditional and pseudo-unconditional predictions share the same visual prefix, keeping their comparison stable.",
      },
      {
        label: "03",
        title: "Shift distributions",
        text: "Trajectory-wide KL supervision moves student probability toward safer continuations without discarding scene semantics.",
      },
    ],
    finding: {
      value: "91.58 → 3.15",
      label: "nudity detection rate",
      context:
        "Liquid on the defensive Ring-A-Bell benchmark, with overall model utility preserved.",
    },
    citation:
      "Shakibania, H., Grebe, J. H., Braun, T., Aktemur, E., Aslani, S., Yiğit, M. G., & Rohrbach, M. (2026). Obliviate: Erasing Concepts from Autoregressive Image Generation Models. Accepted at ECCV 2026. arXiv:2606.28643.",
    bibtex: `@misc{shakibania2026obliviate,
  title         = {Obliviate: Erasing Concepts from Autoregressive Image Generation Models},
  author        = {Hossein Shakibania and Jonas Henry Grebe and Tobias Braun and Ege Aktemur and Saleh Aslani and Mehmet Görkem Yiğit and Marcus Rohrbach},
  year          = {2026},
  eprint        = {2606.28643},
  archivePrefix = {arXiv},
  primaryClass  = {cs.CV},
  url           = {https://arxiv.org/abs/2606.28643}
}`,
    accent: "coral",
    visual: "obliviate",
    related: ["gem", "token-by-token"],
  },
  {
    slug: "token-by-token",
    shortTitle: "Token by Token",
    title:
      "Token by Token, Compromised: Backdoor Vulnerabilities in Unified Autoregressive Models",
    summary:
      "Backdoor attacks that use ordinary text triggers to jointly manipulate image and language generation in unified autoregressive models.",
    keyMessage:
      "A harmless-looking text trigger can become a shared control surface for both image and language behavior in unified autoregressive models.",
    abstract:
      "Unified autoregressive models generate text and images through shared parameters and token vocabularies, creating attack surfaces that cross modality boundaries. Token by Token Backdoor Attack (ToBAC) studies these vulnerabilities through both data poisoning and direct model modification. Seemingly ordinary triggers, including common words or subtle characters, can redirect visual generation while also changing language behavior. Experiments on Liquid and Janus-Pro show that multimodal backdoors can remain unobtrusive at input time yet reliably activate brand promotion, ideological influence, or other targeted outputs.",
    year: 2026,
    status: "Preprint",
    authors: [
      { name: "Tobias Braun", equalContribution: true },
      { name: "Jonas Henry Grebe", equalContribution: true },
      { name: "Hossein Shakibania" },
      { name: "Anna Rohrbach" },
      { name: "Marcus Rohrbach" },
    ],
    resources: [
      {
        label: "Paper",
        href: "https://arxiv.org/pdf/2605.19227",
        primary: true,
      },
      {
        label: "arXiv",
        href: "https://arxiv.org/abs/2605.19227",
      },
    ],
    contributions: [
      {
        title: "Multimodal threat model",
        text: "Establishes backdoor vulnerabilities for unified autoregressive systems that share a model and vocabulary across text and image tokens.",
      },
      {
        title: "Two attack settings",
        text: "Introduces data-poisoning and model-poisoning variants that cover both limited-access and direct-access adversaries.",
      },
      {
        title: "Cross-modal control",
        text: "Shows that a single innocuous trigger can coordinate targeted changes in visual generation and language behavior.",
      },
    ],
    method: [
      {
        label: "01",
        title: "Bind a trigger",
        text: "Associate a common word or subtle character with a chosen multimodal behavior.",
      },
      {
        label: "02",
        title: "Compromise the model",
        text: "Inject the association through poisoned training data or a direct parameter update.",
      },
      {
        label: "03",
        title: "Activate across modalities",
        text: "The trigger redirects both image-token and text-token continuations at inference time.",
      },
    ],
    finding: {
      value: "63.1%",
      label: "average attack success",
      context:
        "Data-poisoning ToBAC against Janus-Pro, demonstrating that limited model access can still yield reliable multimodal control.",
    },
    citation:
      "Braun, T., Grebe, J. H., Shakibania, H., Rohrbach, A., & Rohrbach, M. (2026). Token by Token, Compromised: Backdoor Vulnerabilities in Unified Autoregressive Models. arXiv:2605.19227.",
    bibtex: `@misc{braun2026token,
  title         = {Token by Token, Compromised: Backdoor Vulnerabilities in Unified Autoregressive Models},
  author        = {Tobias Braun and Jonas Henry Grebe and Hossein Shakibania and Anna Rohrbach and Marcus Rohrbach},
  year          = {2026},
  eprint        = {2605.19227},
  archivePrefix = {arXiv},
  primaryClass  = {cs.CR},
  url           = {https://arxiv.org/abs/2605.19227}
}`,
    accent: "amber",
    visual: "tobac",
    related: ["obliviate", "erased-but-not-forgotten"],
  },
  {
    slug: "erased-but-not-forgotten",
    shortTitle: "Erased but Not Forgotten",
    title: "Erased but Not Forgotten: How Backdoors Compromise Concept Erasure",
    summary:
      "A stress test showing how a hidden trigger can survive concept erasure and restore access to supposedly removed content.",
    keyMessage:
      "Concept erasure can look successful while a hidden trigger preserves a second route back to the supposedly removed behavior.",
    abstract:
      "Concept erasure is intended to remove sensitive or unwanted knowledge from generative models, but it may only block the most direct route to that knowledge. The Erasure Evasion Backdoor (EEB) binds a hidden trigger to a concept before a defender applies erasure. The malicious association can survive the intervention and later restore the target behavior. Across six erasure methods, the study evaluates both black-box and white-box adversaries on celebrity identity, object removal, and explicit-content suppression, positioning EEB as a practical diagnostic for whether erasure is durable rather than merely superficial.",
    year: 2026,
    status: "Accepted",
    conference: "ICML 2026",
    location: "Seoul, South Korea",
    acceptanceType: "Poster",
    authors: [
      { name: "Tobias Braun", equalContribution: true },
      { name: "Jonas Henry Grebe", equalContribution: true },
      { name: "Patrick Mohr Gordillo" },
      { name: "Marcus Rohrbach" },
      { name: "Anna Rohrbach" },
    ],
    resources: [
      {
        label: "Paper",
        href: "https://openreview.net/pdf?id=OpHKAVkOIN",
        primary: true,
      },
      {
        label: "ICML",
        href: "https://icml.cc/virtual/2026/poster/64315",
      },
      {
        label: "Code",
        href: "https://github.com/multimodal-ai-lab/EEB",
      },
    ],
    contributions: [
      {
        title: "Erasure-aware backdoor",
        text: "Introduces an attack designed specifically to persist through a later concept-erasure intervention.",
      },
      {
        title: "Adversarial coverage",
        text: "Studies black-box and white-box attackers across six representative erasure methods.",
      },
      {
        title: "Durability test",
        text: "Turns the attack into a diagnostic for distinguishing robust removal from superficial access control.",
      },
    ],
    method: [
      {
        label: "01",
        title: "Plant the association",
        text: "Bind a discreet trigger to the concept that a defender intends to remove.",
      },
      {
        label: "02",
        title: "Apply erasure",
        text: "Run the standard concept-removal procedure and confirm that ordinary prompts appear safe.",
      },
      {
        label: "03",
        title: "Probe the hidden route",
        text: "Reintroduce the trigger to test whether the erased behavior can still be recovered.",
      },
    ],
    finding: {
      value: "up to 94%",
      label: "object-erasure evasion",
      context:
        "The hidden trigger restores targeted objects after concept erasure, exposing a gap between apparent and durable removal.",
    },
    citation:
      "Braun, T., Grebe, J. H., Mohr Gordillo, P., Rohrbach, M., & Rohrbach, A. (2026). Erased but Not Forgotten: How Backdoors Compromise Concept Erasure. Forty-third International Conference on Machine Learning.",
    bibtex: `@inproceedings{braun2026erased,
  title     = {Erased but Not Forgotten: How Backdoors Compromise Concept Erasure},
  author    = {Tobias Braun and Jonas Henry Grebe and Patrick Mohr Gordillo and Marcus Rohrbach and Anna Rohrbach},
  booktitle = {Forty-third International Conference on Machine Learning},
  year      = {2026},
  url       = {https://openreview.net/forum?id=OpHKAVkOIN}
}`,
    accent: "eeb-purple",
    visual: "eeb",
    related: ["gem", "token-by-token"],
  },
  {
    slug: "defame",
    shortTitle: "DEFAME",
    title: "DEFAME: Dynamic Evidence-based FAct-checking with Multimodal Experts",
    summary:
      "A modular, zero-shot system that verifies open-domain image-text claims by dynamically retrieving and reasoning over multimodal evidence.",
    keyMessage:
      "Reliable multimodal fact-checking needs fresh external evidence: plan the investigation, choose the right tools, and turn what they find into an auditable report.",
    abstract:
      "The proliferation of disinformation demands reliable and scalable fact-checking systems that can handle both text and images. DEFAME is a modular, zero-shot multimodal large-language-model pipeline for open-domain claim verification. Its six-stage process dynamically selects tools and search depth to retrieve, evaluate, and integrate textual and visual evidence, then produces a structured fact-checking report. Unlike systems that are text-only or rely on parametric knowledge, DEFAME performs the complete verification process with multimodal claims and evidence. It establishes new state of the art across VERITE, AVeriTeC, MOCHEG, and the temporally challenging ClaimReview2024+ benchmark.",
    year: 2025,
    status: "Accepted",
    conference: "ICML 2025",
    acceptanceType: "Poster",
    authors: [
      { name: "Tobias Braun" },
      { name: "Mark Rothermel" },
      { name: "Marcus Rohrbach" },
      { name: "Anna Rohrbach" },
    ],
    resources: [
      {
        label: "Paper",
        href: "https://arxiv.org/pdf/2412.10510",
        primary: true,
      },
      {
        label: "ICML",
        href: "https://icml.cc/virtual/2025/poster/43719",
      },
      {
        label: "Code",
        href: "https://github.com/multimodal-ai-lab/DEFAME",
      },
      {
        label: "arXiv",
        href: "https://arxiv.org/abs/2412.10510",
      },
    ],
    contributions: [
      {
        title: "End-to-end multimodal verification",
        text: "Handles images in both claims and retrieved evidence while producing a structured, evidence-grounded report.",
      },
      {
        title: "Dynamic investigation",
        text: "Lets the model choose tools and search depth instead of applying one fixed retrieval recipe to every claim.",
      },
      {
        title: "Temporally robust evaluation",
        text: "Introduces ClaimReview2024+, whose claims postdate the backbone model's knowledge cutoff and reduce the value of memorization.",
      },
    ],
    method: [
      {
        label: "01",
        title: "Plan the check",
        text: "Interpret the image-text claim and decide which evidence and specialist tools the investigation requires.",
      },
      {
        label: "02",
        title: "Retrieve evidence",
        text: "Search textual and visual sources dynamically, expanding the investigation when the current evidence is insufficient.",
      },
      {
        label: "03",
        title: "Build the report",
        text: "Evaluate the collected evidence, infer a verdict, and present the reasoning in a structured multimodal report.",
      },
    ],
    finding: {
      value: "4",
      label: "benchmarks led",
      context:
        "DEFAME establishes a new state of the art across VERITE, AVeriTeC, MOCHEG, and ClaimReview2024+.",
    },
    citation:
      "Braun, T., Rothermel, M., Rohrbach, M., & Rohrbach, A. (2025). DEFAME: Dynamic Evidence-based FAct-checking with Multimodal Experts. Proceedings of the 42nd International Conference on Machine Learning, 267, 5383–5417.",
    bibtex: `@inproceedings{braun2025defame,
  title     = {{DEFAME}: Dynamic Evidence-based {FA}ct-checking with Multimodal Experts},
  author    = {Tobias Braun and Mark Rothermel and Marcus Rohrbach and Anna Rohrbach},
  booktitle = {Proceedings of the 42nd International Conference on Machine Learning},
  volume    = {267},
  pages     = {5383--5417},
  year      = {2025},
  url       = {https://proceedings.mlr.press/v267/braun25b.html}
}`,
    accent: "violet",
    visual: "defame",
    related: ["infact", "token-by-token"],
  },
  {
    slug: "infact",
    shortTitle: "InFact",
    title: "InFact: A Strong Baseline for Automated Fact-Checking",
    summary:
      "A six-stage, retrieval-grounded fact-checker that won the 2024 AVeriTeC shared task and set a strong text-only baseline.",
    keyMessage:
      "Break a claim into an explicit investigation: retrieve current web evidence, judge it in context, and make the final verdict traceable.",
    abstract:
      "The spread of disinformation creates a need for robust and scalable automated fact-checking systems. InFact is an LLM-based approach for the AVeriTeC Shared Task Challenge 2024 that decomposes text-claim verification into a six-stage process including evidence retrieval. With GPT-4o as its backbone, InFact achieves an AVeriTeC score of 63% on the test set, outperforming the other 20 participating teams and establishing a strong baseline for text-only automated fact-checking. Its qualitative analysis also identifies cases where the system's conclusion is more accurate than the benchmark's human-annotated ground truth.",
    year: 2024,
    status: "Published",
    conference: "FEVER 2024",
    location: "Miami, Florida, USA",
    authors: [
      { name: "Mark Rothermel" },
      { name: "Tobias Braun" },
      { name: "Marcus Rohrbach" },
      { name: "Anna Rohrbach" },
    ],
    resources: [
      {
        label: "Paper",
        href: "https://aclanthology.org/2024.fever-1.12.pdf",
        primary: true,
      },
      {
        label: "ACL Anthology",
        href: "https://aclanthology.org/2024.fever-1.12/",
      },
      {
        label: "Code",
        href: "https://github.com/multimodal-ai-lab/DEFAME/tree/v1.0.0",
      },
    ],
    contributions: [
      {
        title: "Challenge-winning baseline",
        text: "Ranks first among 21 systems in the 2024 AVeriTeC shared task with a 63% test-set score.",
      },
      {
        title: "Evidence-first workflow",
        text: "Turns claim verification into six explicit stages, including live evidence retrieval rather than memory-only prediction.",
      },
      {
        title: "Ground-truth diagnosis",
        text: "Uses qualitative error analysis to expose benchmark cases where the automated conclusion may be better supported than the label.",
      },
    ],
    method: [
      {
        label: "01",
        title: "Structure the claim",
        text: "Interpret the claim and generate focused questions that turn verification into a tractable investigation.",
      },
      {
        label: "02",
        title: "Search the web",
        text: "Retrieve and organize external evidence that directly addresses the generated questions.",
      },
      {
        label: "03",
        title: "Resolve the verdict",
        text: "Reason over the gathered evidence and return a supported, refuted, or insufficient-evidence conclusion.",
      },
    ],
    finding: {
      value: "63%",
      label: "AVeriTeC score",
      context:
        "Best result among all 21 teams in the 2024 AVeriTeC shared task.",
    },
    citation:
      "Rothermel, M., Braun, T., Rohrbach, M., & Rohrbach, A. (2024). InFact: A Strong Baseline for Automated Fact-Checking. Proceedings of the Seventh Fact Extraction and VERification Workshop (FEVER), 108–112.",
    bibtex: `@inproceedings{rothermel2024infact,
  title     = {{InFact}: A Strong Baseline for Automated Fact-Checking},
  author    = {Mark Rothermel and Tobias Braun and Marcus Rohrbach and Anna Rohrbach},
  booktitle = {Proceedings of the Seventh Fact Extraction and VERification Workshop (FEVER)},
  pages     = {108--112},
  address   = {Miami, Florida, USA},
  publisher = {Association for Computational Linguistics},
  year      = {2024},
  doi       = {10.18653/v1/2024.fever-1.12},
  url       = {https://aclanthology.org/2024.fever-1.12/}
}`,
    accent: "teal",
    visual: "infact",
    related: ["defame", "fighting-fire-with-fire"],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
