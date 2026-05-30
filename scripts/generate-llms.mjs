// Generate llms.txt and llms-full.txt from the repo's docs/*.md.
//
// - llms.txt      — an https://llmstxt.org index: title, summary, and curated
//                   links to every doc, grouped into sections.
// - llms-full.txt — every doc concatenated into one file an agent can load
//                   wholesale for complete, authoritative context.
//
// docs/*.md stays the single source of truth (same as the website's
// convert-docs.mjs). Run: `npm run docs:llms` (also runs on prepublishOnly).
//
// Output is written to the repo root AND website/public/ (served at /llms.txt)
// so both the published package and the docs site expose the same files.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const DOCS = join(ROOT, "docs");
const WEBSITE_PUBLIC = join(ROOT, "website", "public");

// Base URL the index links to. Raw GitHub markdown resolves everywhere and is
// clean for machine consumption; override when a stable docs domain exists.
const RAW_BASE =
  process.env.SPEARKIT_RAW_BASE ??
  "https://raw.githubusercontent.com/byigitt/spearkit/main";
const DOCS_BASE = `${RAW_BASE}/docs`;

// Ordered docs grouped into llms.txt sections. `base` is the docs/<base>.md
// filename. `index` is the index section it belongs to; `Optional` is the
// llms.txt-spec section a short-context reader may skip.
const SECTIONS = [
  {
    title: "Documentation",
    docs: ["getting-started", "client", "migration"],
  },
  {
    title: "Guides",
    docs: [
      "commands",
      "options",
      "components",
      "events",
      "context",
      "cooldown",
      "scheduler",
      "prefix",
      "logging",
      "usage",
      "env",
      "plugins",
      "loading",
    ],
  },
  {
    title: "Reference",
    docs: ["api-reference"],
  },
];

// Order docs are concatenated into llms-full.txt (overview first, reference last).
const FULL_ORDER = [
  "README",
  "getting-started",
  "migration",
  "client",
  "commands",
  "options",
  "components",
  "events",
  "context",
  "cooldown",
  "scheduler",
  "prefix",
  "logging",
  "usage",
  "env",
  "plugins",
  "loading",
  "api-reference",
];

/** Strip inline markdown to plain text for one-line descriptions. */
function stripInline(md) {
  return md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → text
    .replace(/[`*_]/g, "") // code / emphasis marks
    .replace(/\s+/g, " ")
    .trim();
}

/** Title (first H1) + first-paragraph description, truncated for the index. */
function parseDoc(raw) {
  const lines = raw.split("\n");
  let idx = 0;
  let title = "";
  for (; idx < lines.length; idx++) {
    const m = /^#\s+(.+)$/.exec(lines[idx]);
    if (m) {
      title = m[1].trim();
      idx++;
      break;
    }
  }
  while (idx < lines.length && lines[idx].trim() === "") idx++;
  const descLines = [];
  while (
    idx < lines.length &&
    lines[idx].trim() !== "" &&
    !lines[idx].startsWith("#") &&
    !lines[idx].startsWith("```")
  ) {
    descLines.push(lines[idx]);
    idx++;
  }
  let description = stripInline(descLines.join(" "));
  if (description.length > 200) {
    const cut = description.slice(0, 200);
    const lastSpace = cut.lastIndexOf(" ");
    description =
      (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(
        /[\s—,;:.]+$/u,
        "",
      ) + "…";
  }
  return { title, description };
}

async function readDoc(base) {
  return readFile(join(DOCS, `${base}.md`), "utf8");
}

async function buildIndex(pkg) {
  const out = [];
  out.push(`# ${pkg.name}`);
  out.push("");
  out.push(`> ${pkg.description}`);
  out.push("");
  out.push(
    "spearkit re-exports the entire discord.js surface (so it is a drop-in replacement) and adds a fully type-safe layer for slash commands, options, interactive components, events, cooldowns, scheduled tasks, prefix commands, logging, usage tracking and dotenv. Import everything from `spearkit`; never mix a separate `discord.js` import.",
  );
  out.push("");
  out.push(
    "Core rules an agent should follow: use `SpearClient` (not `Client`); define commands with `command()`/`commandGroup()` and options with `option.*`; define components with `button`/`stringSelect`/`modal`/… and let spearkit route them by custom-id — never write an `interactionCreate` switch; register with `client.register(...)`; `await client.start(token)` then `await client.deployCommands({ guildId })` (deploy only after start); the ready event is `clientReady`, not `ready`.",
  );
  out.push("");

  for (const section of SECTIONS) {
    out.push(`## ${section.title}`);
    out.push("");
    for (const base of section.docs) {
      const { title, description } = parseDoc(await readDoc(base));
      out.push(`- [${title}](${DOCS_BASE}/${base}.md): ${description}`);
    }
    out.push("");
  }

  out.push("## Optional");
  out.push("");
  out.push(
    `- [Full documentation](${RAW_BASE}/llms-full.txt): every guide and the full API reference concatenated into one file.`,
  );
  out.push(
    `- [Examples](https://github.com/byigitt/spearkit/tree/main/examples): one runnable folder per topic (commands, options, components, events, loading, cooldown, scheduler, prefix, logging, usage, env, guards, context-menus, pagination, confirm, …).`,
  );
  out.push(
    `- [Repository](https://github.com/byigitt/spearkit): source, issues and the docs site source under \`website/\`.`,
  );
  out.push("");

  return out.join("\n");
}

// Rewrite docs' relative markdown links (./foo.md, ../LICENSE) to absolute URLs
// so they still resolve when the docs are read as one standalone file.
function rewriteRelativeLinks(md) {
  return md
    .replace(/\]\(\.\/([^)]+)\)/g, (_m, target) => `](${DOCS_BASE}/${target})`)
    .replace(/\]\(\.\.\/([^)]+)\)/g, (_m, target) => `](${RAW_BASE}/${target})`);
}

async function buildFull(pkg) {
  const out = [];
  out.push(`# ${pkg.name} v${pkg.version} — full documentation for LLMs`);
  out.push("");
  out.push(`> ${pkg.description}`);
  out.push("");
  out.push(
    "This file concatenates every spearkit guide and the complete API reference. It is generated from docs/*.md (the single source of truth). Install: `npm install spearkit discord.js`. Import every symbol — spearkit additions and the entire re-exported discord.js surface — from `spearkit`.",
  );
  out.push("");
  out.push("---");
  out.push("");

  for (const base of FULL_ORDER) {
    const raw = rewriteRelativeLinks((await readDoc(base)).trim());
    out.push(raw);
    out.push("");
    out.push("---");
    out.push("");
  }

  return out.join("\n").replace(/\n+$/g, "\n");
}

async function writeOutputs(name, content) {
  await writeFile(join(ROOT, name), content);
  if (existsSync(join(ROOT, "website"))) {
    await mkdir(WEBSITE_PUBLIC, { recursive: true });
    await writeFile(join(WEBSITE_PUBLIC, name), content);
  }
}

async function main() {
  if (!existsSync(DOCS)) {
    console.log(`Source docs not found at ${DOCS}; skipping llms generation.`);
    return;
  }
  const pkg = JSON.parse(await readFile(join(ROOT, "package.json"), "utf8"));

  const index = await buildIndex(pkg);
  const full = await buildFull(pkg);

  await writeOutputs("llms.txt", index);
  await writeOutputs("llms-full.txt", full);

  const kb = (s) => `${(Buffer.byteLength(s) / 1024).toFixed(1)}KB`;
  console.log(`Wrote llms.txt (${kb(index)}) and llms-full.txt (${kb(full)}).`);
  if (existsSync(join(ROOT, "website"))) {
    console.log(`Also copied to website/public/.`);
  }
}

void main();
