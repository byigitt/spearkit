# MCP server for coding agents

spearkit ships a **stdio MCP server** so Cursor, Claude Code, Claude Desktop, and
other MCP clients can pull the right recipe instead of inventing discord.js
boilerplate. It reads the same `docs/`, `examples/`, and `AGENTS.md` that ship
in the npm package — the answers match the installed version.

The static companion is [`llms.txt`](https://llmstxt.org) (an index) plus
`llms-full.txt` (every guide concatenated). Those are generated from `docs/`
(`npm run docs:llms`). Use **MCP** when an agent should retrieve one topic at a
time; use **llms.txt** when a client only wants a URL index.

## Install in a client

The server is the published CLI — no extra package:

```bash
npx spearkit mcp
```

### Cursor

Project or user MCP config (`mcp.json`):

```json
{
  "mcpServers": {
    "spearkit": {
      "command": "npx",
      "args": ["-y", "spearkit", "mcp"]
    }
  }
}
```

From this repository (local checkout):

```json
{
  "mcpServers": {
    "spearkit": {
      "command": "node",
      "args": ["bin/spearkit.mjs", "mcp"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add spearkit -- npx -y spearkit mcp
```

### Claude Desktop / VS Code Copilot

Same `command` / `args` as Cursor. In VS Code the key is often `servers`
instead of `mcpServers` — follow that client's schema and keep
`npx -y spearkit mcp`.

## Tools

Call **`coding_rules`** first when generating bot code, then a recipe or search.

| Tool | What it returns |
| --- | --- |
| `coding_rules` | The non-negotiable import / `SpearClient` / lifecycle rules |
| `list_topics` | Recipe ids, guide slugs, example paths |
| `get_recipe` | Canonical snippet (`bootstrap`, `slash-command`, `button`, `modal`, …) |
| `search` | Keyword hits across docs, examples, and `AGENTS.md` |
| `get_guide` | A `docs/<slug>.md` page; optional `section` heading |
| `get_example` | A file under `examples/` (e.g. `buttons/basic.ts`) |

Resources (`spearkit://rules`, `spearkit://guide/commands`, `spearkit://recipe/modal`)
and a `write-spearkit-code` prompt are also advertised.

## What the agent should still do

MCP does not replace TypeScript. After generating handlers, run `npm run typecheck`
— option values, custom-id params and modal fields are checked statically.
