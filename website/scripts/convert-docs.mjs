// Converts the repo's docs/*.md into Fumadocs MDX under content/docs.
// Run from the website/ directory: node scripts/convert-docs.mjs
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const SRC = join(here, "..", "..", "docs");
const OUT = join(here, "..", "content", "docs");

// basename (without .md) -> { out: relative output path, route: site route }
const map = {
  README: { out: "index.mdx", route: "/docs", title: "Introduction" },
  "getting-started": { out: "getting-started.mdx", route: "/docs/getting-started" },
  migration: { out: "migration.mdx", route: "/docs/migration" },
  "api-reference": { out: "api-reference.mdx", route: "/docs/api-reference" },
  commands: { out: "guides/commands.mdx", route: "/docs/guides/commands" },
  options: { out: "guides/options.mdx", route: "/docs/guides/options" },
  components: { out: "guides/components.mdx", route: "/docs/guides/components" },
  events: { out: "guides/events.mdx", route: "/docs/guides/events" },
  context: { out: "guides/context.mdx", route: "/docs/guides/context" },
  client: { out: "guides/client.mdx", route: "/docs/guides/client" },
  plugins: { out: "guides/plugins.mdx", route: "/docs/guides/plugins" },
  loading: { out: "guides/loading.mdx", route: "/docs/guides/loading" },
};

function stripInline(md) {
  return md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links -> text
    .replace(/[`*_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function rewriteLinks(text) {
  return text.replace(/\]\((\.{0,2}\/)?([\w-]+)\.md(#[\w-]+)?\)/g, (whole, _p, base, hash) => {
    const entry = map[base];
    if (!entry) return whole;
    return `](${entry.route}${hash ?? ""})`;
  });
}

// Escape pipes inside inline-code spans within table rows so GFM keeps cells intact.
function escapeTablePipes(text) {
  return text
    .split("\n")
    .map((line) => {
      if (!/^\s*\|/.test(line)) return line;
      return line.replace(/`[^`]*`/g, (span) => span.replace(/(?<!\\)\|/g, "\\|"));
    })
    .join("\n");
}

// Detect MDX hazards (bare < or { outside code) for a human to review.
function findHazards(body, file) {
  const withoutFences = body.replace(/```[\s\S]*?```/g, "");
  const withoutInline = withoutFences.replace(/`[^`]*`/g, "");
  const hazards = [];
  withoutInline.split("\n").forEach((line, i) => {
    if (/<[A-Za-z/]/.test(line) || /\{/.test(line)) {
      hazards.push(`${file}:${i + 1}  ${line.trim().slice(0, 80)}`);
    }
  });
  return hazards;
}

async function convert(base) {
  const entry = map[base];
  const raw = await readFile(join(SRC, `${base}.md`), "utf8");
  const lines = raw.split("\n");

  // Title from the first H1.
  let title = entry.title;
  let idx = 0;
  for (; idx < lines.length; idx++) {
    const m = /^#\s+(.+)$/.exec(lines[idx]);
    if (m) {
      if (!title) title = m[1].trim();
      idx++;
      break;
    }
  }

  // Skip blank lines, then capture the first paragraph as the description.
  while (idx < lines.length && lines[idx].trim() === "") idx++;
  const descLines = [];
  while (idx < lines.length && lines[idx].trim() !== "" && !lines[idx].startsWith("#")) {
    descLines.push(lines[idx]);
    idx++;
  }
  const fullDescription = stripInline(descLines.join(" "));
  let description = fullDescription;
  if (fullDescription.length > 180) {
    const cut = fullDescription.slice(0, 180);
    const lastSpace = cut.lastIndexOf(" ");
    description = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s—,;:.]+$/u, "") + "…";
  }

  let body = lines.slice(idx).join("\n").trim();
  body = rewriteLinks(body);
  body = escapeTablePipes(body);

  const frontmatter = `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\n---\n\n`;
  const outPath = join(OUT, entry.out);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, frontmatter + body + "\n");
  return findHazards(body, entry.out);
}

async function main() {
  // On a self-contained build (e.g. Vercel deploys the website/ dir without the
  // repo's docs/), keep the committed content/docs and skip regeneration.
  if (!existsSync(SRC)) {
    console.log(`Source docs not found at ${SRC}; using committed content/docs.`);
    return;
  }
  await rm(OUT, { recursive: true, force: true });
  await mkdir(join(OUT, "guides"), { recursive: true });

  const hazards = [];
  for (const base of Object.keys(map)) hazards.push(...(await convert(base)));

  await writeFile(
    join(OUT, "meta.json"),
    JSON.stringify(
      { title: "Documentation", pages: ["index", "getting-started", "guides", "migration", "api-reference"] },
      null,
      2,
    ) + "\n",
  );
  await writeFile(
    join(OUT, "guides", "meta.json"),
    JSON.stringify(
      {
        title: "Guides",
        pages: ["commands", "options", "components", "events", "context", "client", "plugins", "loading"],
      },
      null,
      2,
    ) + "\n",
  );

  console.log(`Converted ${Object.keys(map).length} docs.`);
  if (hazards.length) {
    console.log(`\nPotential MDX hazards (review):\n${hazards.join("\n")}`);
  } else {
    console.log("No MDX hazards detected.");
  }
}

void main();
