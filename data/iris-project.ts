import type { Project } from "./projects";

const paperTitle = "IRIS: Imperceptible, Robust Image Sealing for Cooperative Anti-Edit Protection";

export const irisProject: Project = {
  slug: "iris",
  shortTitle: "IRIS",
  title: paperTitle,
  summary: "An invisible watermark signals an image owner’s opt-out. IRIS selectively cools down the editor’s velocity on protected inputs while preserving ordinary editing.",
  keyMessage: "Image owners embed the signal; model providers learn to honor it.",
  abstract: "Unified image editors make it easy to repurpose photographs without the depicted person’s consent. Input-only protections can be weakened by ordinary image transformations, while stronger perturbations compromise image quality. IRIS takes a cooperative approach: a frozen watermark embedder communicates an image-level opt-out, and an adapted editor learns to honor it. Image owners protect their images in a single embedding pass, without per-image optimization or access to the editor. Model providers fine-tune the editor to suppress generative velocity on protected inputs while matching the original model on clean inputs. This training uses source images without curated edit instructions or ground-truth edits. Experiments with FLUX.2 and Qwen-Image-Edit evaluate editing utility and protection across common transformations, real photographs, and requests with multiple reference images. The same protected image can be used across independently adapted editors. Protection depends on provider cooperation; diffusion-based purification remains a limitation.",
  year: 2026,
  status: "Preprint",
  authors: [
    { name: "Jonas Henry Grebe" },
    { name: "Hossein Shakibania" },
    { name: "Anna Rohrbach" },
    { name: "Marcus Rohrbach" },
  ],
  resources: [],
  contributions: [
    { title: "A cooperative image-level opt-out", text: "Separates robust watermark embedding from the editor’s protective response. The owner protects the image once; independently adapted editors can honor the same signal." },
    { title: "Selective velocity cooldown", text: "Fine-tunes the editor to retain its clean-input behavior and suppress denoising on protected inputs, without paired target edits or curated instructions." },
    { title: "Protection beyond a single input", text: "Evaluates common image transformations, real photographs, and multi-reference requests in which only one reference is protected." },
  ],
  method: [],
  citation: `Grebe, J. H., Shakibania, H., Rohrbach, A., & Rohrbach, M. (2026). ${paperTitle}. Preprint.`,
  bibtex: `@unpublished{grebe2026iris,
  title  = {${paperTitle}},
  author = {Jonas Henry Grebe and Hossein Shakibania and Anna Rohrbach and Marcus Rohrbach},
  year   = {2026},
  note   = {Preprint}
}`,
  accent: "iris-ice",
  visual: "iris",
  related: ["veto", "plw"],
};
