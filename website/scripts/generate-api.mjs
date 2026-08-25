import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Application } from "typedoc";

const here = dirname(fileURLToPath(import.meta.url));
const WEBSITE = resolve(here, "..");
const ROOT = resolve(WEBSITE, "..");
const SRC = join(ROOT, "src");
const OUT = join(WEBSITE, "content", "docs", "api-reference");
const SITE = "https://spearkit.bayburt.lu";
// TypeScript's wildcard `include` skips dot-directories, so this cannot be
// hidden — `tsconfig.typedoc.json` has to be able to see the entry points.
const ENTRYPOINTS = join(WEBSITE, "generated-api-entrypoints");

const groups = [
  {
    slug: "core",
    title: "Core",
    description: "Client setup, plugins, file loading, and command scope.",
    modules: ["client", "plugin", "loader", "scope"],
  },
  {
    slug: "commands",
    title: "Commands",
    description: "Slash commands, options, contexts, registries, hybrid commands, and context menus.",
    modules: [
      "commands/command",
      "commands/options",
      "commands/context",
      "commands/registry",
      "hybrid",
      "context-menus",
      "auto-defer",
    ],
  },
  {
    slug: "prefix-commands",
    title: "Prefix commands",
    description: "Classic text commands and their typed argument parser.",
    modules: ["prefix", "prefix-args"],
  },
  {
    slug: "components",
    title: "Components",
    description: "Buttons, selects, modals, component contexts, layouts, and payload routing.",
    modules: [
      "components/builders",
      "components/context",
      "components/registry",
      "components/customId",
      "components/row",
      "components/v2",
      "payload",
      "pagination",
      "confirm",
      "help",
      "poll",
    ],
  },
  {
    slug: "contexts",
    title: "Contexts and replies",
    description: "Shared handler contexts, collectors, and reply embed helpers.",
    modules: ["context", "collectors", "embeds"],
  },
  {
    slug: "events-and-tasks",
    title: "Events and tasks",
    description: "Gateway events, scheduled work, and graceful shutdown.",
    modules: ["events", "scheduler", "shutdown"],
  },
  {
    slug: "access-control",
    title: "Guards and permissions",
    description: "Handler preconditions, permission checks, and moderation hierarchy helpers.",
    modules: ["guards", "permissions"],
  },
  {
    slug: "cooldowns-and-scaling",
    title: "Cooldowns and scaling",
    description: "Rate limits, shared cooldown backends, sharding, queues, and backpressure.",
    modules: ["cooldown", "scale"],
  },
  {
    slug: "storage",
    title: "Storage and configuration",
    description: "Key-value stores, typed settings, caches, and configuration loading.",
    modules: ["store", "sqlite-store", "redis-store", "cache", "config"],
  },
  {
    slug: "runtime",
    title: "Runtime services",
    description: "Logging, usage tracking, environment variables, i18n, and handler errors.",
    modules: ["logger", "usage", "env", "i18n", "handler-errors"],
  },
  {
    slug: "utilities",
    title: "Utilities",
    description: "Formatting, mentions, invites, choices, safe fetches, locks, and Discord errors.",
    modules: [
      "choices",
      "invite",
      "mentions",
      "format",
      "lock",
      "safe-fetch",
      "discord-errors",
    ],
  },
];

async function sourceModules(dir = SRC, prefix = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const modules = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      modules.push(...(await sourceModules(join(dir, entry.name), `${prefix}${entry.name}/`)));
    } else if (entry.isFile() && extname(entry.name) === ".ts") {
      modules.push(`${prefix}${entry.name.slice(0, -3)}`);
    }
  }
  return modules;
}

async function validateGroups() {
  const mapped = new Set(groups.flatMap((group) => group.modules));
  const ignored = new Set(["index", "components/index"]);
  const missing = (await sourceModules()).filter((module) => !mapped.has(module) && !ignored.has(module));
  if (missing.length > 0) {
    throw new Error(
      `Public API modules need a documentation group: ${missing.join(", ")}`,
    );
  }
}

async function writeEntrypoints() {
  await rm(ENTRYPOINTS, { recursive: true, force: true });
  await mkdir(ENTRYPOINTS, { recursive: true });

  for (const group of groups) {
    const exports = group.modules
      .map((module) => `export * from "../../src/${module}.js";`)
      .join("\n");
    await writeFile(
      join(ENTRYPOINTS, `${group.slug}.ts`),
      `/** ${group.description} */\n${exports}\n`,
    );
  }
}

async function cleanGeneratedOutput() {
  await mkdir(OUT, { recursive: true });
  await Promise.all(
    groups.map((group) => rm(join(OUT, group.slug), { recursive: true, force: true })),
  );
  await rm(join(OUT, "meta.json"), { force: true });
  await rm(join(OUT, "index.mdx"), { force: true });
}

const kindTitles = {
  classes: "Classes",
  enumerations: "Enumerations",
  functions: "Functions",
  interfaces: "Interfaces",
  "type-aliases": "Type aliases",
  variables: "Variables",
};

const kindOrder = [
  "functions",
  "classes",
  "interfaces",
  "type-aliases",
  "variables",
  "enumerations",
];

/** Markdown prose to a single plain-text line, for frontmatter and tables. */
function plainText(markdown) {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, "$1")
    .replace(/[`*_\\]/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function truncate(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s—,;:.]+$/u, "")}…`;
}

/**
 * The signature and the summary paragraph TypeDoc renders above a symbol's
 * first heading, plus the summary's line range so the page can drop it (the
 * frontmatter description already shows it under the title).
 */
function readSummary(body) {
  const lines = body.split("\n");
  let signature = "";
  let inSignature = false;
  const prose = [];
  let start = -1;
  let end = -1;

  for (const [index, line] of lines.entries()) {
    const text = line.trim();
    if (text.startsWith("```")) {
      if (inSignature) {
        inSignature = false;
        continue;
      }
      if (signature !== "" || prose.length > 0) break;
      inSignature = true;
      continue;
    }
    if (inSignature) {
      signature = signature === "" ? plainText(text) : `${signature} ${plainText(text)}`;
      continue;
    }
    if (text.startsWith("#")) break;
    if (text === "" || text.startsWith("Defined in:")) {
      if (prose.length > 0) break;
      continue;
    }
    if (text.startsWith("|") || text.startsWith(">")) break;
    if (start === -1) start = index;
    end = index;
    prose.push(text);
  }

  return { signature, summary: plainText(prose.join(" ")), start, end };
}

async function markdownFiles(dir = OUT) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await markdownFiles(path)));
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(path);
  }
  return files;
}

/**
 * Rewrite TypeDoc's output into Fumadocs pages: frontmatter, extensionless
 * links, folder index pages, and sidebar metadata. Returns one entry per
 * documented symbol for the compact reference in `docs/`.
 */
async function prepareForFumadocs() {
  const symbols = [];

  for (const path of await markdownFiles()) {
    const file = relative(OUT, path).replaceAll("\\", "/");
    const [slug, kind, name] = file.replace(/\.md$/u, "").split("/");
    if (kind === undefined && groups.every((item) => item.slug !== slug)) {
      // TypeDoc's project index; `writeLandingPage` replaces it.
      await rm(path);
      continue;
    }

    const group = groups.find((item) => item.slug === slug);
    if (!group) throw new Error(`Generated page outside a known section: ${file}`);

    const raw = await readFile(path, "utf8");
    const heading = /^#\s+(.+)\n+/u.exec(raw);
    if (!heading) throw new Error(`Generated API page has no title: ${file}`);

    // Fumadocs serves pages without the `.md` extension.
    let body = raw
      .slice(heading[0].length)
      .replace(/(\]\([^)\s#]+)\.md(?=(?:#[^)]+)?\))/gu, "$1");
    const isGroupIndex = kind === undefined;
    const title = isGroupIndex
      ? group.title
      : heading[1]
          .trim()
          .replace(/^(?:Class|Enumeration|Function|Interface|Type Alias|Variable):\s*/u, "");

    const { signature, summary, start, end } = readSummary(body);
    const description = isGroupIndex
      ? group.description
      : truncate(summary === "" ? `${title} in the spearkit API.` : summary, 160);

    // Fumadocs prints the description under the title, so the summary paragraph
    // would otherwise appear twice. Keep it when the description had to be
    // truncated, since then the body still carries information.
    if (!isGroupIndex && summary !== "" && start !== -1 && description === summary) {
      const lines = body.split("\n");
      lines.splice(start, end - start + 1);
      body = lines.join("\n").replace(/^\n+/u, "");
    }

    const frontmatter =
      `---\ntitle: ${JSON.stringify(title)}\n` +
      `description: ${JSON.stringify(description)}\n---\n\n`;
    // The module page becomes the section's index so `/api-reference/<slug>`
    // resolves to a real page rather than an empty folder.
    const target = isGroupIndex ? join(dirname(path), "index.md") : path;
    await writeFile(target, frontmatter + body);
    if (target !== path) await rm(path);

    if (!isGroupIndex) {
      symbols.push({
        group: group.slug,
        kind,
        name,
        title,
        signature,
        summary,
        url: `/docs/api-reference/${slug}/${kind}/${name}`,
      });
    }
  }

  for (const group of groups) {
    const kinds = kindOrder.filter((kind) => existsSync(join(OUT, group.slug, kind)));
    await writeFile(
      join(OUT, group.slug, "meta.json"),
      `${JSON.stringify(
        { title: group.title, description: group.description, pages: ["index", ...kinds] },
        null,
        2,
      )}\n`,
    );

    for (const kind of kinds) {
      await writeFile(
        join(OUT, group.slug, kind, "meta.json"),
        `${JSON.stringify({ title: kindTitles[kind], pages: ["..."] }, null, 2)}\n`,
      );
    }
  }

  await writeFile(
    join(OUT, "meta.json"),
    `${JSON.stringify(
      {
        title: "API Reference",
        description: "Generated from spearkit's public TypeScript source.",
        pages: ["index", ...groups.map((group) => group.slug)],
      },
      null,
      2,
    )}\n`,
  );

  return symbols;
}

async function writeLandingPage() {
  const rows = groups
    .map((group) => `| [${group.title}](/docs/api-reference/${group.slug}) | ${group.description} |`)
    .join("\n");

  await writeFile(
    join(OUT, "index.mdx"),
    `---
title: "Overview"
description: "Every symbol spearkit exports, generated from its TypeScript source."
---

Every symbol spearkit exports, generated from the public TypeScript
declarations and their TSDoc comments. Import all of them — and the entire
re-exported discord.js surface — from \`"spearkit"\`.

\`\`\`ts
import { SpearClient, command, option, event, button, modal, row } from "spearkit";
\`\`\`

Pick a section, then open a symbol for its signature, parameters, members and
source link. Prefer the [guides](/docs/guides/commands) when you want to know
which API fits a task.

| Section | Covers |
| ------- | ------ |
${rows}
`,
  );
}

/**
 * A compact, single-file reference for GitHub readers and for the generated
 * `llms.txt` / `llms-full.txt` bundles, which cannot carry the whole site.
 */
async function writeCompactReference(symbols) {
  const out = [
    "# API reference",
    "",
    "Every symbol spearkit exports, with its signature and summary. This file is",
    "generated from the public TypeScript declarations in `src/`; the full",
    "reference — parameters, members, inherited signatures and source links —",
    `lives at ${SITE}/docs/api-reference.`,
    "",
    "Import every symbol, spearkit's own and the entire re-exported discord.js",
    'surface, from `"spearkit"`.',
    "",
    "```ts",
    'import { SpearClient, command, option, event, button, modal, row } from "spearkit";',
    "```",
    "",
    "Do not edit this file by hand. Update the declaration or its TSDoc comment in",
    "`src/`, then run `npm run docs:api && npm run docs:llms`.",
  ];

  for (const group of groups) {
    const inGroup = symbols.filter((symbol) => symbol.group === group.slug);
    if (inGroup.length === 0) continue;

    out.push("", `## ${group.title}`, "", group.description);

    for (const kind of kindOrder) {
      const ofKind = inGroup
        .filter((symbol) => symbol.kind === kind)
        .sort((a, b) => a.name.localeCompare(b.name));
      if (ofKind.length === 0) continue;

      out.push("", `### ${kindTitles[kind]}`, "");
      out.push("| Symbol | Signature | Summary |", "| --- | --- | --- |");
      for (const symbol of ofKind) {
        const link = `[${symbol.title}](${SITE}${symbol.url})`;
        const signature = symbol.signature === "" ? "" : `\`${symbol.signature.replaceAll("|", "\\|")}\``;
        out.push(`| ${link} | ${signature} | ${truncate(symbol.summary, 200)} |`);
      }
    }
  }

  out.push("");
  await writeFile(join(ROOT, "docs", "api-reference.md"), out.join("\n"));
}

async function generate() {
  if (!existsSync(SRC)) {
    console.log(`Source files not found at ${SRC}; using committed API reference.`);
    return;
  }

  await validateGroups();
  await writeEntrypoints();
  try {
    await cleanGeneratedOutput();

    const app = await Application.bootstrapWithPlugins({
      name: "spearkit",
      entryPoints: groups.map((group) => join(ENTRYPOINTS, `${group.slug}.ts`)),
      tsconfig: join(WEBSITE, "tsconfig.typedoc.json"),
      plugin: ["typedoc-plugin-markdown"],
      // `out` makes the plugin's markdown output the active one, which is also
      // what registers its `member` router.
      out: OUT,
      router: "member",
      readme: "none",
      entryFileName: "symbols",
      excludeExternals: true,
      excludePrivate: true,
      excludeProtected: true,
      excludeInternal: true,
      excludeReferences: true,
      hideBreadcrumbs: true,
      hidePageHeader: true,
      hideGenerator: true,
      // Signatures read far better as code blocks than as blockquotes; types
      // stay linked from the parameter and property tables below them.
      useCodeBlocks: true,
      expandParameters: true,
      // Tables instead of heading-per-field keeps pages scannable and stops
      // every method from adding "Parameters"/"Type declaration" headings.
      classPropertiesFormat: "table",
      interfacePropertiesFormat: "table",
      typeAliasPropertiesFormat: "table",
      propertyMembersFormat: "table",
      typeDeclarationFormat: "table",
      parametersFormat: "table",
      enumMembersFormat: "table",
      indexFormat: "table",
      tableColumnSettings: { hideSources: true, leftAlignHeaders: true },
      sort: ["alphabetical"],
      gitRevision: "main",
      cleanOutputDir: false,
      validation: {
        invalidLink: false,
        notDocumented: false,
        notExported: false,
      },
    });

    const project = await app.convert();
    if (!project) throw new Error("TypeDoc could not create an API model.");
    await app.generateOutputs(project);

    const symbols = await prepareForFumadocs();
    await writeLandingPage();
    await writeCompactReference(symbols);
    console.log(`Documented ${symbols.length} exported symbols.`);
  } finally {
    await rm(ENTRYPOINTS, { recursive: true, force: true });
  }

  console.log(`Generated API reference across ${groups.length} sections.`);
}

await generate();
