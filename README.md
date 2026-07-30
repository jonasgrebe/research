# Research Index

A minimal, shared website for research project pages. The index contains:

- VETO: Towards Protecting Images From Frontier AI Editing
- Fighting Fire with Fire: On the Feasibility of Protecting Exercises Against AI Cheating
- GEM: Geometric Erasure by Contrastive Velocity Matching in Rectified Flows
- Obliviate: Erasing Concepts from Autoregressive Image Generation Models
- Token by Token, Compromised: Backdoor Vulnerabilities in Unified Autoregressive Models
- Erased but Not Forgotten: How Backdoors Compromise Concept Erasure

Nothing in this repository publishes the site automatically.

## Run locally

### Requirements

- Node.js 22.13 or newer
- npm, which is included with Node.js

### Start the website

1. Unzip the folder.
2. Open a terminal in the unzipped `Research Index` folder.
3. Install the locked dependencies:

   ```bash
   npm ci
   ```

4. Start the local development server:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000` in a browser.

Keep the terminal window open while using the website. Stop the server with
`Ctrl+C`.

The website runs only on the local computer and is not published automatically.

### Optional checks

```bash
npm run lint
npm test
```

## Add or update a project

Project content is stored in `data/projects.ts`. Add one object to the
`projects` array and select one of the shared visual treatments. The landing
page, project route, metadata, resource links, citation, and related-project
card are generated from that object.

Shared presentation lives in:

- `app/components.tsx` — header, project cards, metadata, resources, visuals
- `app/projects/[slug]/page.tsx` — the shared project-page structure
- `app/globals.css` — the visual system and responsive behavior

Optional fields simply do not render. Never add an empty resource URL or
unconfirmed publication detail.

## Prepare a GitHub Pages build

The site supports a repository-specific base path. For a repository named
`research-projects`, verify the same structure GitHub Pages will use:

```bash
NEXT_PUBLIC_BASE_PATH=/research-projects \
NEXT_PUBLIC_SITE_URL=https://OWNER.github.io/research-projects/ \
npm run build:pages
```

The static site is written to `out/`. Replace `OWNER` and the repository name
with their real values.

When publication is eventually desired, configure GitHub Pages to publish the
contents of `out/` using your preferred deployment workflow. No Pages setting,
custom domain, or deployment workflow is enabled here.

For a user or organization site at the domain root, omit
`NEXT_PUBLIC_BASE_PATH` and set `NEXT_PUBLIC_SITE_URL` to the root URL.
