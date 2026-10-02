import type { Project } from "./projects";

export const plwProject: Project = {
  slug: "plw",
  shortTitle: "The Poisoned Conversation",
  title:
    "The Poisoned Conversation: Privacy-Leaking Watermarks in Unified Multimodal Models",
  summary:
    "A compromised model can encode sensitive chat attributes in images generated later. Sharing an image can expose those attributes even when the conversation stays on the user’s device.",
  keyMessage:
    "PLWs bind selected conversational cues to hidden image watermarks that remain detectable after the conversation has moved to an unrelated task.",
  abstract:
    "Unified multimodal models use the same conversational context for personal discussion and image generation. Privacy-Leaking Watermarks exploit this shared context: a malicious provider modifies a model so that selected sensitive disclosures activate an invisible watermark in images generated later. An attacker who obtains one of these images can detect the associated attribute without accessing the conversation. The method first learns a latent watermark encoder and extractor, then fine-tunes the model to insert the watermark selectively while preserving neutral generations. Experiments on BAGEL and OmniGen-2 cover 13 sensitive-attribute triggers, held-out paraphrases, unrelated intervening turns, and new image-prompt domains. They show substantial attribute recovery while largely preserving generation utility, alongside differences across models and triggers. The hidden message identifies a preselected attribute; it does not reproduce arbitrary conversation content.",
  year: 2026,
  status: "Preprint",
  authors: [
    { name: "Tobias Braun", equalContribution: true },
    { name: "Jonas Henry Grebe", equalContribution: true },
    { name: "Emil Sivic" },
    { name: "Patrick Mohr Gordillo" },
    { name: "Hossein Shakibania" },
    { name: "Marcus Rohrbach" },
    { name: "Anna Rohrbach" },
  ],
  resources: [],
  contributions: [
    {
      title: "Conversation-to-image privacy leakage",
      text: "Defines a threat in which a compromised model turns private chat context into an attribute signal recoverable from images the user later shares, including images generated locally.",
    },
    {
      title: "Latent watermark training",
      text: "Learns a watermark encoder and extractor, then fine-tunes the model to associate sensitive conversational cues with hidden binary messages while retaining behavior on neutral chats.",
    },
    {
      title: "Evaluation across context and image changes",
      text: "Tests 13 triggers on BAGEL and OmniGen-2, including held-out paraphrases, up to three separating neutral turns, new image-prompt domains, multiple triggers in one adapter, and common image transformations.",
    },
  ],
  method: [],
  citation:
    "Braun, T., Grebe, J. H., Sivic, E., Mohr Gordillo, P., Shakibania, H., Rohrbach, M., & Rohrbach, A. (2026). The Poisoned Conversation: Privacy-Leaking Watermarks in Unified Multimodal Models. Preprint.",
  bibtex: `@unpublished{braun2026poisoned,
  title  = {The Poisoned Conversation: Privacy-Leaking Watermarks in Unified Multimodal Models},
  author = {Tobias Braun and Jonas Henry Grebe and Emil Sivic and Patrick Mohr Gordillo and Hossein Shakibania and Marcus Rohrbach and Anna Rohrbach},
  year   = {2026},
  note   = {Preprint}
}`,
  accent: "plw-cyan",
  visual: "plw",
  related: ["token-by-token", "veto"],
};
