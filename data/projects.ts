import { plwProject } from "./plw-project";

export type ProjectAccent =
  | "cobalt"
  | "coral"
  | "violet"
  | "amber"
  | "teal"
  | "rose"
  | "eeb-purple"
  | "plw-cyan";
export type ProjectVisual =
  | "gem"
  | "obliviate"
  | "tobac"
  | "eeb"
  | "veto"
  | "fire"
  | "defame"
  | "infact"
  | "plw";

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
  plwProject,
  {
    slug: "veto",
    shortTitle: "VETO",
    title: "VETO: Towards Protecting Images From Frontier AI Editing",
    summary:
      "A subtle image cloak that disrupts how modern unified editors attend to a protected reference image.",
    keyMessage:
      "Modern editors repeatedly read a reference image through joint attention. VETO diffuses that attention to reduce successful editing of the protected image.",
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
    resources: [
      {
        label: "Paper",
        href: "https://arxiv.org/abs/2607.27292",
        primary: true,
      },
      {
        label: "Demo",
        href: "https://huggingface.co/spaces/Hossshakiba/VETO",
      },
      {
        label: "VetoBench",
        href: "https://huggingface.co/datasets/MAI-Lab/VetoBench",
      },
    ],
    contributions: [
      {
        title: "Attention-level protection",
        text: "Targets the joint-attention mechanism used by native DiT editors instead of attacking a legacy encoder bottleneck.",
      },
      {
        title: "Image fidelity and edit resistance",
        text: "Evaluates editing success and protected-image fidelity against prior cloaking methods.",
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
        "Human evaluation on FLUX.2 and VetoBench at the selected VETO operating point.",
    },
    citation:
      "Grebe, J., Shakibania, H., Braun, T., Rohrbach, M., & Rohrbach, A. (2026). VETO: Towards Protecting Images From Frontier AI Editing. arXiv:2607.27292.",
    bibtex: `@misc{grebe2026veto,
  title  = {{VETO}: Towards Protecting Images From Frontier AI Editing},
  author = {Jonas Grebe and Hossein Shakibania and Tobias Braun and Marcus Rohrbach and Anna Rohrbach},
  year   = {2026},
  eprint = {2607.27292},
  archivePrefix = {arXiv}
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
      { name: "Louis Rethfeld", equalContribution: true },
      { name: "Marcus Rohrbach" },
    ],
    resources: [
      {
        label: "Paper",
        href: "https://arxiv.org/abs/2608.01112",
        primary: true,
      },
    ],
    contributions: [
      {
        title: "Perturbing visual exercises",
        text: "Adds subtle changes to visual multiple-choice questions to steer AI solvers toward designated incorrect answers.",
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
      value: "≥ 95%",
      label: "modeled detection power",
      context:
        "For the shared 20-question assignment under the educator-provided student model, with fewer than 8 modeled false flags per 10,000 genuine students.",
    },
    citation:
      "Braun, T., Grebe, J., Rethfeld, L., & Rohrbach, M. (2026). Fighting Fire with Fire: On the Feasibility of Protecting Exercises Against AI Cheating. arXiv:2608.01112.",
    bibtex: `@misc{braun2026fighting,
  title  = {Fighting Fire with Fire: On the Feasibility of Protecting Exercises Against AI Cheating},
  author = {Tobias Braun and Jonas Grebe and Louis Rethfeld and Marcus Rohrbach},
  year   = {2026},
  eprint = {2608.01112},
  archivePrefix = {arXiv}
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
      "Erase a concept by changing the geometry of the flow field: repel target behavior, attract benign behavior, and limit changes to unrelated generation.",
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
      {
        label: "Code",
        href: "https://github.com/multimodal-ai-lab/GEM",
      },
    ],
    contributions: [
      {
        title: "Trajectory-based flow matching",
        text: "Formulates trajectory-level unlearning signals as teacher-guided flow-matching supervision.",
      },
      {
        title: "Geometric guidance",
        text: "Combines attraction toward benign generation and repulsion from the target concept as a single velocity-space objective.",
      },
      {
        title: "Concept erasure in rectified-flow models",
        text: "Suppresses selected concepts in rectified-flow transformers while retaining the model’s broader generative behavior.",
      },
    ],
    method: [
      {
        label: "01",
        title: "Teacher predictions",
        text: "Evaluate the frozen teacher with target and benign anchor prompts at the same latent and timestep.",
      },
      {
        label: "02",
        title: "Contrastive objective",
        text: "Compare the student's distance to the anchor with its weighted distance to the target using a hinge loss.",
      },
      {
        label: "03",
        title: "Trajectory supervision",
        text: "Train on several early steps from a target-prompt trajectory, evaluated in parallel.",
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
      "Obliviate stabilizes autoregressive erasure by teaching complete token trajectories against aligned visual histories.",
    abstract:
      "Autoregressive image generators are becoming central to unified multimodal systems, yet most concept-erasure research has focused on diffusion models. Obliviate adapts erasure to visual-token generation through aligned prefixes, distribution-level KL supervision, and updates across complete autoregressive rollouts. A frozen teacher constructs safer target distributions and a student learns them along the full trajectory. Evaluation spans Liquid, Emu3-Gen, and Janus-Pro, covering explicit content, graphic violence, and brand removal; on Liquid, nudity detection on Ring-A-Bell falls from 91.58% to 3.15%, with image-quality metrics remaining close to the original model.",
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
        text: "Adapts teacher-guided concept erasure to models that generate images as sequences of visual tokens.",
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
        title: "Three autoregressive generators",
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
      value: "91.58 → 3.15%",
      label: "nudity detection rate",
      context:
        "Liquid on the defensive Ring-A-Bell benchmark, with overall model utility preserved.",
    },
    citation:
      "Shakibania, H., Grebe, J. H., Braun, T., Aktemur, E., Aslani, S., Yiğit, M. G., & Rohrbach, M. (2026). Obliviate: Erasing Concepts from Autoregressive Image Generation Models. Accepted at ECCV 2026. arXiv:2606.28643.",
    bibtex: `@misc{shakibania2026obliviate,
  title={Obliviate: Erasing Concepts from Autoregressive Image Generation Models},
  author={Hossein Shakibania and Jonas Henry Grebe and Tobias Braun and Ege Aktemur and Saleh Aslani and Mehmet Görkem Yiğit and Marcus Rohrbach},
  year={2026},
  eprint={2606.28643},
  archivePrefix={arXiv},
  primaryClass={cs.CV},
  url={https://arxiv.org/abs/2606.28643},
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
    status: "Accepted",
    conference: "NeurIPS 2026",
    acceptanceType: "Poster",
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
      {
        label: "Code",
        href: "https://github.com/multimodal-ai-lab/ToBAC/",
      },
      {
        label: "Dataset",
        href: "https://huggingface.co/datasets/MAI-Lab/ToBAC",
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
        title: "Linked image and text responses",
        text: "A text trigger changes the generated image; that image then triggers a targeted language response.",
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
      label: "average joint attack success",
      context:
        "Joint image-and-text success averaged across the three Janus-Pro data-poisoning scenarios in Table 2.",
    },
    citation:
      "Braun, T., Grebe, J. H., Shakibania, H., Rohrbach, A., & Rohrbach, M. (2026). Token by Token, Compromised: Backdoor Vulnerabilities in Unified Autoregressive Models. Accepted at NeurIPS 2026. arXiv:2605.19227.",
    bibtex: `@misc{braun2026token,
  title={Token by Token, Compromised: Backdoor Vulnerabilities in Unified Autoregressive Models},
  author={Tobias Braun and Jonas Henry Grebe and Hossein Shakibania and Anna Rohrbach and Marcus Rohrbach},
  year={2026},
  eprint={2605.19227},
  archivePrefix={arXiv},
  primaryClass={cs.CR},
  url={https://arxiv.org/abs/2605.19227},
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
      "Backdoor triggers can survive concept erasure and recover the targeted content.",
    keyMessage:
      "Concept erasure can look successful while a hidden trigger preserves a second route back to the supposedly removed behavior.",
    abstract:
      "The Erasure Evasion Backdoor (EEB) binds a hidden trigger to a concept before a defender applies erasure. The malicious association can survive the intervention and later restore the target behavior. Across six erasure methods, the study evaluates both black-box and white-box adversaries on celebrity identity, object removal, and explicit-content suppression, testing whether each erasure method also suppresses the backdoor trigger.",
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
        title: "Backdoors inserted before erasure",
        text: "Studies whether a planted trigger still recovers a concept after the defender applies erasure.",
      },
      {
        title: "Four insertion mechanisms",
        text: "Compares data poisoning, text-encoder tuning, cross-attention edits, and U-Net adapters.",
      },
      {
        title: "Six erasure methods",
        text: "Tests trigger-based recovery across celebrity identities, objects, and explicit content.",
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
      value: "94.40%",
      label: "object-erasure evasion",
      context:
        "Deep EEB followed by RECE on Stable Diffusion v1.4, evaluated through recognition of CIFAR-10 target objects (Table 4).",
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
      "A fact-checker that chooses tools and retrieves text and image evidence to verify image–text claims.",
    keyMessage:
      "Reliable multimodal fact-checking needs fresh external evidence: plan the investigation, choose the right tools, and turn what they find into an auditable report.",
    abstract:
      "DEFAME verifies image–text claims by selecting retrieval tools and reasoning over textual and visual evidence. Its modular, zero-shot pipeline uses a six-stage process to choose tools and search depth, evaluate the retrieved material, and produce a structured fact-checking report. The evaluation covers VERITE, AVeriTeC, MOCHEG, and the new ClaimReview2024+ benchmark, whose claims postdate the backbone model’s knowledge cutoff. On ClaimReview2024+, DEFAME outperforms the reported GPT-4o baselines.",
    year: 2025,
    status: "Accepted",
    conference: "ICML 2025",
    acceptanceType: "Poster",
    authors: [
      { name: "Tobias Braun", equalContribution: true },
      { name: "Mark Rothermel", equalContribution: true },
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
        title: "Evaluation beyond the knowledge cutoff",
        text: "Introduces ClaimReview2024+, with claims published after the backbone model's knowledge cutoff.",
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
      label: "benchmarks evaluated",
      context:
        "The published evaluation covers VERITE, AVeriTeC, MOCHEG, and the new ClaimReview2024+ benchmark.",
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
      "A six-stage text fact-checker that retrieves evidence from the supplied knowledge base and won the 2024 AVeriTeC shared task.",
    keyMessage:
      "Break a claim into an explicit investigation: retrieve evidence from the supplied knowledge base, judge it in context, and make the final verdict traceable.",
    abstract:
      "InFact decomposes text-claim verification into six stages and retrieves evidence from the supplied static AVeriTeC knowledge base. With GPT-4o as its backbone, it achieves an AVeriTeC score of 63% on the 2024 shared task’s test set, outperforming the other 20 participating teams. Its qualitative analysis identifies cases where the retrieved evidence supports a different conclusion from the benchmark annotation.",
    year: 2024,
    status: "Published",
    conference: "FEVER 2024",
    location: "Miami, Florida, USA",
    authors: [
      { name: "Mark Rothermel", equalContribution: true },
      { name: "Tobias Braun", equalContribution: true },
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
        title: "Six-stage evidence retrieval and reasoning",
        text: "Turns claim verification into six explicit stages, including evidence retrieval from the static AVeriTeC knowledge base.",
      },
      {
        title: "Analysis of disputed annotations",
        text: "Examines cases where the retrieved evidence supports a different conclusion from the benchmark annotation.",
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
        title: "Search the knowledge base",
        text: "Retrieve and organize evidence from the supplied AVeriTeC resources to address the generated questions.",
      },
      {
        label: "03",
        title: "Resolve the verdict",
        text: "Reason over the gathered evidence and return supported, refuted, not enough information, or conflicting evidence/cherry-picking.",
      },
    ],
    finding: {
      value: "63%",
      label: "AVeriTeC score",
      context:
        "Best result among all 21 teams in the 2024 AVeriTeC shared task; the score jointly evaluates verdicts and supporting evidence.",
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
    accent: "amber",
    visual: "infact",
    related: ["defame", "fighting-fire-with-fire"],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
