import { listRecipes, getRecipe } from "./recipes.mjs";
import { searchCorpus, listGuides, listExamples, readRel, extractSection } from "./search.mjs";

export const CODING_RULES = `# spearkit coding rules

spearkit is discord.js++: it re-exports the entire discord.js surface and adds a
type-safe layer. Install: \`npm install spearkit discord.js\`.

1. Import everything from \`"spearkit"\`. Never \`import … from "discord.js"\`.
2. Use \`SpearClient\`, not \`Client\`. \`intents\` may be omitted (defaults to \`Intents.default\`).
3. Co-locate definition + handler. \`client.register(...)\` them. Never write an \`interactionCreate\` switch; never parse custom ids by hand.
4. Lifecycle: \`register(...)\` → \`await client.start(token)\` → \`await client.deployCommands({ guildId })\`. Deploy after start, and only when command definitions change.
5. Ready event is \`clientReady\`, not \`ready\`.
6. Trust inference. Required options are non-nullable; optional are \`T | undefined\`; \`choices\` narrow to a literal union; custom-id \`{param}\`s and modal field keys are typed. Do not cast handler args.
7. Hidden replies: \`ctx.replyEphemeral(...)\` or \`ctx.reply({ content, ephemeral: true })\`.

Next: call \`get_recipe\` for the task (bootstrap, slash-command, button, modal, …) or \`search\` / \`get_guide\`.
`;

const PROTOCOL = "2025-03-26";

export const TOOLS = [
  {
    name: "coding_rules",
    description:
      "Non-negotiable rules for writing spearkit (discord.js++) bots. Call this first when generating or editing bot code.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "list_topics",
    description:
      "List recipe ids, documentation guide slugs, and example paths you can fetch next with get_recipe, get_guide, or get_example.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_recipe",
    description:
      "Canonical copy-paste pattern for a spearkit task. Prefer this over inventing discord.js boilerplate. Ids: bootstrap, slash-command, autocomplete, subcommands, button, select, modal, prefix, hybrid, context-menu, guards-cooldown, paginate-confirm, events, auto-defer, file-loading, scheduler, anti-patterns.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Recipe id or a short phrase such as 'modal' or 'slash command'.",
        },
      },
      required: ["id"],
      additionalProperties: false,
    },
  },
  {
    name: "search",
    description:
      "Keyword search over spearkit guides, examples, AGENTS.md, and the agent skill. Use when you do not know which guide or recipe to open.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "What you are trying to do, e.g. 'typed modal fields' or 'deploy commands CI'." },
        limit: { type: "integer", minimum: 1, maximum: 20, description: "Max hits (default 8)." },
      },
      required: ["query"],
      additionalProperties: false,
    },
  },
  {
    name: "get_guide",
    description:
      "Fetch a spearkit Markdown guide by slug (filename without .md). Slugs include getting-started, client, commands, options, components, context, events, guards, prefix, hybrid, loading, api-reference, mcp, …",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "docs/<slug>.md — e.g. 'components' or 'api-reference'." },
        section: {
          type: "string",
          description: "Optional heading to extract (e.g. 'SpearClient' or 'auto-defer').",
        },
      },
      required: ["slug"],
      additionalProperties: false,
    },
  },
  {
    name: "get_example",
    description:
      "Fetch a runnable example file from the spearkit repo (path under examples/, e.g. 'buttons/basic.ts' or 'slash-commands/with-options.ts').",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string", description: "Path relative to examples/, including the filename." },
      },
      required: ["path"],
      additionalProperties: false,
    },
  },
];

function textResult(text, isError = false) {
  return { content: [{ type: "text", text }], isError };
}

function formatRecipe(recipe) {
  return [
    `# ${recipe.title}`,
    "",
    recipe.when,
    "",
    `Related guides: ${recipe.related.join(", ")}`,
    "",
    "```ts",
    recipe.code,
    "```",
    "",
    "Import every symbol from \"spearkit\". Register the export with client.register(...).",
  ].join("\n");
}

export async function callTool(name, args = {}) {
  switch (name) {
    case "coding_rules":
      return textResult(CODING_RULES);
    case "list_topics": {
      const recipes = listRecipes();
      const guides = await listGuides();
      const examples = await listExamples();
      const body = [
        "## Recipes (get_recipe)",
        ...recipes.map((r) => `- \`${r.id}\` — ${r.title}: ${r.when}`),
        "",
        "## Guides (get_guide)",
        ...guides.map((g) => `- \`${g.slug}\` — ${g.title}`),
        "",
        "## Examples (get_example)",
        ...examples.map((e) => `- \`${e.path}\``),
      ].join("\n");
      return textResult(body);
    }
    case "get_recipe": {
      const recipe = getRecipe(String(args.id ?? ""));
      if (!recipe) {
        return textResult(
          `Unknown recipe "${args.id}". Valid ids: ${listRecipes().map((r) => r.id).join(", ")}`,
          true,
        );
      }
      return textResult(formatRecipe(recipe));
    }
    case "search": {
      const hits = await searchCorpus(String(args.query ?? ""), { limit: Number(args.limit) || 8 });
      if (hits.length === 0) return textResult(`No matches for "${args.query}".`);
      const body = hits
        .map(
          (h) =>
            `### ${h.title} (${h.kind}: ${h.path})\n${h.excerpt}`,
        )
        .join("\n\n");
      return textResult(body);
    }
    case "get_guide": {
      const slug = String(args.slug ?? "").replace(/\.md$/, "").replace(/^docs\//, "");
      const raw = await readRel(`docs/${slug}.md`);
      if (!raw) return textResult(`Unknown guide "${slug}". Call list_topics for slugs.`, true);
      if (args.section) {
        const section = extractSection(raw, String(args.section));
        if (!section) {
          return textResult(
            `No heading matching "${args.section}" in docs/${slug}.md. Returning the full guide.\n\n${raw}`,
          );
        }
        return textResult(section);
      }
      return textResult(raw);
    }
    case "get_example": {
      const rel = String(args.path ?? "").replace(/^examples\//, "");
      const raw = await readRel(`examples/${rel}`);
      if (!raw) return textResult(`Unknown example "${rel}". Call list_topics for paths.`, true);
      return textResult(raw);
    }
    default:
      return textResult(`Unknown tool "${name}".`, true);
  }
}

export async function listResources() {
  const recipes = listRecipes().map((r) => ({
    uri: `spearkit://recipe/${r.id}`,
    name: r.title,
    mimeType: "text/markdown",
  }));
  const guides = (await listGuides()).map((g) => ({
    uri: `spearkit://guide/${g.slug}`,
    name: g.title,
    mimeType: "text/markdown",
  }));
  return [
    { uri: "spearkit://rules", name: "Coding rules", mimeType: "text/markdown" },
    { uri: "spearkit://llms.txt", name: "llms.txt index", mimeType: "text/markdown" },
    ...recipes,
    ...guides,
  ];
}

export async function readResource(uri) {
  if (uri === "spearkit://rules") return CODING_RULES;
  if (uri === "spearkit://llms.txt") return (await readRel("llms.txt")) ?? "";
  const recipeMatch = /^spearkit:\/\/recipe\/(.+)$/.exec(uri);
  if (recipeMatch) {
    const recipe = getRecipe(recipeMatch[1]);
    if (!recipe) throw new Error(`Unknown recipe ${recipeMatch[1]}`);
    return formatRecipe(recipe);
  }
  const guideMatch = /^spearkit:\/\/guide\/(.+)$/.exec(uri);
  if (guideMatch) {
    const raw = await readRel(`docs/${guideMatch[1]}.md`);
    if (!raw) throw new Error(`Unknown guide ${guideMatch[1]}`);
    return raw;
  }
  throw new Error(`Unknown resource ${uri}`);
}

export const PROMPTS = [
  {
    name: "write-spearkit-code",
    description: "Write or edit a Discord bot using spearkit (not raw discord.js).",
    arguments: [
      {
        name: "task",
        description: "What the bot or handler should do.",
        required: true,
      },
    ],
  },
];

export function getPrompt(name, args = {}) {
  if (name !== "write-spearkit-code") return null;
  const task = args.task ?? "a slash command";
  return {
    description: "spearkit coding prompt",
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `${CODING_RULES}\n\nTask: ${task}\n\nUse get_recipe / search / get_guide as needed. Output TypeScript that imports from "spearkit".`,
        },
      },
    ],
  };
}

export async function handleMcpMessage(msg, pkg) {
  if (!msg || typeof msg !== "object") {
    return { jsonrpc: "2.0", id: null, error: { code: -32600, message: "Invalid request" } };
  }
  const { id, method, params } = msg;
  if (typeof method === "string" && method.startsWith("notifications/")) return null;

  const reply = (result) => ({ jsonrpc: "2.0", id: id ?? null, result });
  const fail = (code, message) => ({ jsonrpc: "2.0", id: id ?? null, error: { code, message } });

  switch (method) {
    case "initialize": {
      const requested = params?.protocolVersion;
      return reply({
        protocolVersion: requested === "2024-11-05" || requested === "2025-06-18" ? requested : PROTOCOL,
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
        serverInfo: { name: "spearkit", version: pkg.version },
        instructions:
          "spearkit is discord.js++. When writing Discord bot code: call coding_rules, then get_recipe or search. Import only from \"spearkit\". Use SpearClient. Never write an interactionCreate switch. Ready event is clientReady. Deploy commands after client.start().",
      });
    }
    case "ping":
      return reply({});
    case "tools/list":
      return reply({ tools: TOOLS });
    case "tools/call": {
      const name = params?.name;
      const args = params?.arguments ?? {};
      if (!name) return fail(-32602, "Missing tool name");
      const result = await callTool(name, args);
      return reply(result);
    }
    case "resources/list":
      return reply({ resources: await listResources() });
    case "resources/read": {
      try {
        const text = await readResource(params?.uri);
        return reply({
          contents: [{ uri: params.uri, mimeType: "text/markdown", text }],
        });
      } catch (error) {
        return fail(-32602, error instanceof Error ? error.message : String(error));
      }
    }
    case "prompts/list":
      return reply({ prompts: PROMPTS });
    case "prompts/get": {
      const prompt = getPrompt(params?.name, params?.arguments ?? {});
      if (!prompt) return fail(-32602, `Unknown prompt ${params?.name}`);
      return reply(prompt);
    }
    default:
      return fail(-32601, `Method not found: ${method}`);
  }
}
