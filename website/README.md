# spear documentation site

The documentation website for spear, built with [Fumadocs](https://fumadocs.dev)
(Next.js App Router) and themed to match the [discord.js docs](https://discord.js.org/docs):
dark surfaces, blurple accent, Geist.

## How it works

The content is the repo's Markdown docs. `scripts/convert-docs.mjs` converts
`../docs/*.md` into Fumadocs MDX under `content/docs` (adding frontmatter,
rewriting links to site routes, escaping table pipes). This runs automatically
before `dev` and `build`, so the Markdown docs stay the single source of truth.

```
website/
  app/
    (home)/            # marketing landing page
    docs/[[...slug]]/  # docs pages
    layout.tsx         # RootProvider + Geist font
    global.css         # Tailwind + Fumadocs preset + Discord theme
  content/docs/        # generated MDX (from ../docs)
  lib/
    source.ts          # Fumadocs content source
    layout.shared.tsx  # navbar/footer options
  scripts/convert-docs.mjs
  source.config.ts     # Fumadocs MDX config
```

## Develop

```bash
cd website
pnpm install
pnpm dev      # http://localhost:3000 (runs the doc converter first)
```

## Build

```bash
pnpm build    # static export of every page
pnpm start    # serve the production build
```

To regenerate the MDX manually: `pnpm convert-docs`.
