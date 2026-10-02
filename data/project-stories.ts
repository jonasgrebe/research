export type ProjectStory = {
  eyebrow: string;
  headline: string;
  lead: string;
  question: string;
  premise: string[];
  mechanism: {
    title: string;
    paragraphs: string[];
  };
  evidence: {
    title: string;
    description: string;
    metrics: Array<{ value: string; label: string; detail: string }>;
    sourceLabel: string;
    sourceUrl: string;
  };
  takeaway: {
    title: string;
    paragraphs: string[];
  };
  reading: Array<{ label: string; href: string }>;
};

// Each narrative is grounded in its linked paper. Numerical results retain their
// evaluation setting; benchmark observations are not universal safety guarantees.
export const projectStories: Record<string, ProjectStory> = {
  veto: {
    eyebrow: "Image ownership · Reference-based editing",
    headline: "A photo of you. A scene you never entered.",
    lead:
      "An editor can lift a person out of one photograph and place them in a scene that never happened. VETO studies whether a small change to the shared image can interrupt that transfer.",
    question:
      "How do you protect a photograph when the next scene does not exist yet?",
    premise: [
      "The source remains available throughout generation: output tokens repeatedly attend to it. VETO targets that repeated exchange.",
    ],
    mechanism: {
      title: "Disrupt the reference, inside the editor.",
      paragraphs: [
        "A per-image cloak spreads attention between the source and the evolving output. The optimization makes those interactions less selective while limiting the pixel changes to the photograph.",
        "VetoBench tests the consequence across ordinary edits, defamatory scenarios, and graphic content, including identities moved into new scenes.",
      ],
    },
    evidence: {
      title: "The protected photograph stays recognizable. Fewer edits succeed.",
      description:
        "Human judgments on FLUX.2, across all 300 VetoBench cases at the paper’s selected operating points.",
      metrics: [
        {
          value: "267 / 300",
          label: "successful edits before protection",
          detail: "Unprotected source images; Table 3, all three domains combined.",
        },
        {
          value: "12 / 300",
          label: "successful edits with VETO",
          detail: "The same benchmark, with VETO at a pixel budget of ε = 4.",
        },
      ],
      sourceLabel: "VETO · Tables 3–5",
      sourceUrl: "https://arxiv.org/html/2607.27292",
    },
    takeaway: {
      title: "Protection has to travel with the image.",
      paragraphs: [
        "These results concern direct editing of cloaked images. Compression and cropping remain important weaknesses, especially at small perturbation budgets.",
      ],
    },
    reading: [
      { label: "Inspect VetoBench", href: "https://huggingface.co/datasets/MAI-Lab/VetoBench" },
      { label: "Try the VETO demo", href: "https://huggingface.co/spaces/Hossshakiba/VETO" },
    ],
  },
  "fighting-fire-with-fire": {
    eyebrow: "Assessment integrity · A feasibility study",
    headline: "A copied mistake can leave a fingerprint.",
    lead:
      "Small changes to a visual question can steer an AI assistant toward a designated wrong answer. Repeated across an assignment, those answers can reveal sustained blind copying.",
    question: "Could the exercise itself carry evidence of AI outsourcing?",
    premise: [
      "One wrong answer proves little. The signal is an unlikely pattern of specific errors across questions.",
    ],
    mechanism: {
      title: "Choose the errors. Measure their persistence.",
      paragraphs: [
        "The method perturbs question images, then queries assistants repeatedly to measure which target answers transfer reliably. Retained questions form an assignment evaluated with assistant-specific likelihood-ratio tests.",
      ],
    },
    evidence: {
      title: "Twenty questions, with explicit assumptions.",
      description: "Shared assignment; educator-provided student model; three assistants covered in advance.",
      metrics: [
        {
          value: "≥ 95%",
          label: "modeled detection power",
          detail: "For sustained blind copying from a covered assistant.",
        },
        {
          value: "< 8 / 10,000",
          label: "modeled false flags",
          detail: "Genuine submissions; familywise bound under educator estimates.",
        },
      ],
      sourceLabel: "Fighting Fire with Fire · Table 3",
      sourceUrl: "https://arxiv.org/html/2608.01112",
    },
    takeaway: {
      title: "The student model is consequential.",
      paragraphs: [
        "A conservative fallback raises modeled false flags to roughly one in fifty. The study assumes stable assistants, conditionally independent responses, and extensive copying; it does not establish classroom detection accuracy.",
      ],
    },
    reading: [
      { label: "Read the assumptions and calibration", href: "https://arxiv.org/html/2608.01112" },
    ],
  },
  gem: {
    eyebrow: "Concept erasure · Rectified flows",
    headline: "Concept erasure has a direction.",
    lead:
      "GEM changes how a rectified-flow generator moves through image space. A teacher supplies both a direction away from the target concept and an anchor for what should remain.",
    question: "The intervention lives in the model.",
    premise: [
      "GEM fine-tunes the generator itself. After training, the edited model produces images under ordinary prompts; the change is learned in its generation process.",
    ],
    mechanism: {
      title: "Repulsion needs an anchor.",
      paragraphs: [
        "GEM combines attraction toward a benign concept with repulsion from the erasure target in one velocity-space objective. The student learns the resulting geometric guidance through flow matching.",
        "This connects trajectory-based unlearning from Generative Flow Networks with teacher-guided erasure for rectified-flow transformers.",
      ],
    },
    evidence: {
      title: "Removing Merkel should still leave Mandela.",
      description:
        "Flux experiments erase Angela Merkel while checking Nelson Mandela, Hillary Clinton, and Barack Obama. Recognition counts measure both target suppression and retention of related identities.",
      metrics: [],
      sourceLabel: "GEM · Celebrity erasure, Table 4",
      sourceUrl: "https://arxiv.org/html/2606.00140v1",
    },
    takeaway: {
      title: "Erasure is also a preservation problem.",
      paragraphs: [
        "GEM retains more neighboring celebrity identities in these experiments; UCE is stronger on the evaluated copyrighted characters. Choosing an erasure method means checking the concepts that should survive, too.",
      ],
    },
    reading: [
      { label: "Explore target-and-anchor training", href: "https://github.com/multimodal-ai-lab/GEM" },
      { label: "Inspect a released checkpoint", href: "https://huggingface.co/MAI-Lab/GEM-Flux-Nudity" },
    ],
  },
  obliviate: {
    eyebrow: "Concept erasure · Autoregressive images",
    headline: "Forgetting has to survive the next token.",
    lead:
      "An autoregressive image takes shape through a sequence of visual tokens. Obliviate teaches safer continuations along the entire sequence, while keeping the scene coherent.",
    question: "How do you erase a concept from an image that is still being written?",
    premise: [
      "Each new token depends on the picture already generated. Comparing predictions built on different visual histories mixes the concept to remove with differences in the images themselves.",
    ],
    mechanism: {
      title: "Compare two instructions against the same unfinished image.",
      paragraphs: [
        "The teacher’s concept-conditioned and pseudo-unconditional branches share one visual prefix. Their contrast produces a stable target for the student at every position.",
        "KL supervision matches whole token distributions across complete rollouts. This lets the objective address alternative visual realizations of a concept, beyond a single token choice.",
      ],
    },
    evidence: {
      title: "Lower detection without collapsing generation.",
      description:
        "Nudity erasure on Janus-Pro: adversarial Ring-A-Bell prompts and the paper’s image-quality evaluation, Table 1.",
      metrics: [
        {
          value: "55.79 → 1.05%",
          label: "concept detection on RAB",
          detail: "Original Janus-Pro → Obliviate; lower is better.",
        },
        {
          value: "12.39 → 12.31",
          label: "FID after erasure",
          detail: "Original Janus-Pro → Obliviate; image quality remains comparable.",
        },
      ],
      sourceLabel: "Obliviate · Tables 1–2",
      sourceUrl: "https://arxiv.org/html/2606.28643",
    },
    takeaway: {
      title: "The concept matters as much as the model.",
      paragraphs: [
        "The study covers Liquid, Emu3-Gen, and Janus-Pro. Branded imagery responds strongly to erasure; graphic violence remains substantially harder.",
      ],
    },
    reading: [
      { label: "Compare concepts and model families", href: "https://arxiv.org/html/2606.28643" },
      { label: "Use the released implementation", href: "https://github.com/multimodal-ai-lab/Obliviate" },
    ],
  },
  "token-by-token": {
    eyebrow: "Unified models · Multimodal backdoors",
    headline: "The image becomes part of the backdoor.",
    lead:
      "An ordinary word can activate an unwanted image, which then steers the model’s next text response. ToBAC follows this chain through a unified autoregressive model.",
    question: "What if the model’s own image activates its next answer?",
    premise: [
      "The trigger need not resemble an attack instruction. Common words can acquire a hidden association during poisoned training.",
    ],
    mechanism: {
      title: "A hook in the image. A link into language.",
      paragraphs: [
        "The hook associates a text trigger with a visual target. The link associates that generated target with a chosen text response, aligning the attack with the model’s image-then-text conversation.",
        "The paper studies poisoned data and direct parameter access. Ablations test whether that visual link is actually necessary.",
      ],
    },
    evidence: {
      title: "The intermediate image makes the difference.",
      description: "Janus-Pro, data poisoning, the “proud” trigger scenario; Table 3.",
      metrics: [
        {
          value: "90.30%",
          label: "joint image-and-text success",
          detail: "With the aligned image-to-text link.",
        },
        {
          value: "22.73%",
          label: "joint success with a text-only link",
          detail: "Linking the trigger directly to the text target.",
        },
      ],
      sourceLabel: "ToBAC · Mechanism ablation, Table 3",
      sourceUrl: "https://arxiv.org/html/2605.19227",
    },
    takeaway: {
      title: "Follow the whole conversation.",
      paragraphs: [
        "A multimodal security evaluation must track how one output conditions the next. Separate image and text checks can miss the dependency that sustains this attack.",
      ],
    },
    reading: [
      { label: "Inspect the ToBAC code", href: "https://github.com/multimodal-ai-lab/ToBAC/" },
      { label: "Explore the released dataset", href: "https://huggingface.co/datasets/MAI-Lab/ToBAC" },
    ],
  },
  "erased-but-not-forgotten": {
    eyebrow: "Concept erasure · A hidden route back",
    headline: "A backdoor can outlast concept erasure.",
    lead:
      "A model can suppress a concept when asked for it by name, yet recover it through a hidden trigger. Erasure Evasion Backdoors test this gap after the safety intervention has already happened.",
    question: "What survives when a poisoned model is sanitized?",
    premise: [
      "The sequence matters: an adversary first binds a trigger to the target concept, and a defender erases the concept afterward. Testing only ordinary prompts can make that intervention appear successful.",
    ],
    mechanism: {
      title: "Plant the association before the safety intervention.",
      paragraphs: [
        "The study includes black-box and white-box adversaries, and six erasure methods—including methods that actively search for alternative representations.",
      ],
    },
    evidence: {
      title: "The hidden route survives across different erasure targets.",
      description:
        "Deep EEB on Stable Diffusion v1.4, followed by concept erasure. Two settings from the ICML 2026 version.",
      metrics: [
        {
          value: "82.48%",
          label: "celebrity-identity evasion",
          detail: "After UCE; GCD recognition, averaged over ten target identities.",
        },
        {
          value: "94.40%",
          label: "object-erasure evasion",
          detail: "After RECE; ResNet-18 recognition of CIFAR-10 target objects.",
        },
      ],
      sourceLabel: "Erased but Not Forgotten · Tables 3–4",
      sourceUrl: "https://arxiv.org/html/2504.21072v2",
    },
    takeaway: {
      title: "A clean prompt is an incomplete test of forgetting.",
      paragraphs: [
        "EEB turns this failure into a stress test: apply erasure to a poisoned checkpoint, then probe the surviving association. The released models make that experiment reproducible.",
      ],
    },
    reading: [
      { label: "Use the erasure stress test", href: "https://github.com/multimodal-ai-lab/EEB" },
      { label: "Read the ICML 2026 record", href: "https://icml.cc/virtual/2026/poster/64315" },
    ],
  },
  defame: {
    eyebrow: "Multimodal fact-checking · Beyond the knowledge cutoff",
    headline: "The evidence can be newer than the model.",
    lead:
      "A model cannot remember tomorrow’s news. DEFAME investigates image-text claims with external tools and leaves a report showing the evidence behind its verdict.",
    question: "Can a fact-checker verify an event it could never have seen in training?",
    premise: [
      "A photograph may be authentic while its caption changes when or where it was taken. Verification must connect the image, the claim, and external records.",
    ],
    mechanism: {
      title: "Let the unresolved claim determine the next search.",
      paragraphs: [
        "DEFAME selects among web search, image search, reverse-image search, and geolocation. It evaluates the resulting evidence and can investigate again when it is insufficient.",
      ],
    },
    evidence: {
      title: "A test the model could not simply memorize.",
      description:
        "ClaimReview2024+ contains 300 claims dated after GPT-4o’s October 2023 knowledge cutoff. Reported four-class accuracy, averaged over three runs.",
      metrics: [
        {
          value: "69.7%",
          label: "DEFAME accuracy",
          detail: "ClaimReview2024+; standard deviation 2.5 percentage points.",
        },
        {
          value: "35.2%",
          label: "GPT-4o baseline accuracy",
          detail: "Same benchmark; standard deviation 0.9 percentage points.",
        },
      ],
      sourceLabel: "DEFAME · ICML 2025 paper, Table 3",
      sourceUrl: "https://raw.githubusercontent.com/mlresearch/v267/main/assets/braun25b/braun25b.pdf",
    },
    takeaway: {
      title: "Make the investigation inspectable.",
      paragraphs: [
        "Retrieval can add missing knowledge, but sources and tools still need interpretation. An evidence-bearing report lets readers examine those decisions instead of accepting the label alone.",
      ],
    },
    reading: [
      { label: "Read the published paper", href: "https://proceedings.mlr.press/v267/braun25b.html" },
      { label: "Explore the fact-checking system", href: "https://github.com/multimodal-ai-lab/DEFAME" },
    ],
  },
  infact: {
    eyebrow: "Automated fact-checking · AVeriTeC 2024 winner",
    headline: "A verdict needs a chain of evidence.",
    lead:
      "InFact turns a text claim into an explicit investigation: ask focused questions, retrieve evidence, and resolve the verdict. That simple structure won the 2024 AVeriTeC shared task.",
    question: "What does a fact-checker need to show before its answer counts?",
    premise: [
      "In AVeriTeC, a correct label is only part of the task. The system also has to supply evidence that supports its decision.",
    ],
    mechanism: {
      title: "Break the claim into questions the evidence can answer.",
      paragraphs: [
        "The six-stage pipeline organizes claim interpretation, question generation, retrieval, and reasoning. Its shared-task configuration searches the supplied, static AVeriTeC knowledge base for reproducible evidence retrieval.",
      ],
    },
    evidence: {
      title: "First place on evidence-backed verification.",
      description: "Official AVeriTeC 2024 test-set result with GPT-4o as the backbone.",
      metrics: [
        {
          value: "63%",
          label: "AVeriTeC score",
          detail: "Joint evidence-and-verdict evaluation; this is not plain label accuracy.",
        },
        {
          value: "1st / 21",
          label: "teams in the shared task",
          detail: "InFact ranked first among the 21 participating teams.",
        },
      ],
      sourceLabel: "InFact · FEVER 2024 paper",
      sourceUrl: "https://aclanthology.org/2024.fever-1.12.pdf",
    },
    takeaway: {
      title: "Disagreement can reveal a better question.",
      paragraphs: [
        "The error analysis also finds questionable benchmark labels. Inspecting the evidence can expose ambiguity in the claim or annotation, as well as mistakes by the model.",
      ],
    },
    reading: [
      { label: "Read the shared-task paper", href: "https://aclanthology.org/2024.fever-1.12/" },
      { label: "Explore the original implementation", href: "https://github.com/multimodal-ai-lab/DEFAME/tree/v1.0.0" },
    ],
  },
};
