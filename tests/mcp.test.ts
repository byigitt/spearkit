import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { handleMcpMessage, callTool, TOOLS } from "../mcp/tools.mjs";
import { getRecipe, listRecipes } from "../mcp/recipes.mjs";
import { searchCorpus, extractSection } from "../mcp/search.mjs";

const pkg = { version: "0.0.0-test" };
const cli = join(dirname(fileURLToPath(import.meta.url)), "..", "bin", "spearkit.mjs");

function lspFrame(obj) {
  const json = JSON.stringify(obj);
  return Buffer.concat([
    Buffer.from(`Content-Length: ${Buffer.byteLength(json)}\r\n\r\n`, "utf8"),
    Buffer.from(json, "utf8"),
  ]);
}

function parseLsp(buf) {
  const messages = [];
  let rest = buf;
  while (rest.length > 0) {
    const headerEnd = rest.indexOf("\r\n\r\n");
    if (headerEnd === -1) break;
    const header = rest.subarray(0, headerEnd).toString("utf8");
    const match = /Content-Length:\s*(\d+)/i.exec(header);
    if (!match) break;
    const length = Number(match[1]);
    const start = headerEnd + 4;
    if (rest.length < start + length) break;
    messages.push(JSON.parse(rest.subarray(start, start + length).toString("utf8")));
    rest = rest.subarray(start + length);
  }
  return messages;
}

describe("spearkit MCP", () => {
  it("lists the expected tools", () => {
    expect(TOOLS.map((t) => t.name)).toEqual([
      "coding_rules",
      "list_topics",
      "get_recipe",
      "search",
      "get_guide",
      "get_example",
    ]);
  });

  it("initialize advertises spearkit and instructions", async () => {
    const res = await handleMcpMessage(
      {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "test" } },
      },
      pkg,
    );
    expect(res.result.serverInfo.name).toBe("spearkit");
    expect(res.result.instructions).toContain("SpearClient");
    expect(res.result.capabilities.tools).toEqual({});
  });

  it("coding_rules and recipes cover the golden path", async () => {
    const rules = await callTool("coding_rules");
    expect(rules.content[0].text).toContain("spearkit");
    expect(rules.content[0].text).toContain("clientReady");

    expect(listRecipes().some((r) => r.id === "bootstrap")).toBe(true);
    const modal = getRecipe("modal");
    expect(modal?.code).toContain("textInput");

    const recipe = await callTool("get_recipe", { id: "slash-command" });
    expect(recipe.content[0].text).toContain("option.string");
    expect(recipe.isError).toBeFalsy();
  });

  it("search ranks command docs for slash queries", async () => {
    const hits = await searchCorpus("slash command typed options");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((h) => /commands|options/i.test(h.path))).toBe(true);
  });

  it("get_guide returns markdown and can extract a section", async () => {
    const full = await callTool("get_guide", { slug: "getting-started" });
    expect(full.content[0].text).toContain("npm install spearkit");

    const section = await callTool("get_guide", {
      slug: "client",
      section: "Constructing a client",
    });
    expect(section.content[0].text).toContain("new SpearClient");
  });

  it("get_example loads a real example file", async () => {
    const example = await callTool("get_example", { path: "buttons/basic.ts" });
    expect(example.content[0].text).toContain("from \"spearkit\"");
    expect(example.isError).toBeFalsy();
  });

  it("extractSection finds a heading", () => {
    const md = "# Title\n\n## Foo\nhello\n## Bar\nbye\n";
    expect(extractSection(md, "foo")).toBe("## Foo\nhello");
  });

  it("stdio server answers initialize over Content-Length framing", async () => {
    const child = spawn(process.execPath, [cli, "mcp"], { stdio: ["pipe", "pipe", "pipe"] });
    child.stderr.resume();
    const chunks = [];
    child.stdout.on("data", (c) => chunks.push(c));
    child.stdin.write(
      lspFrame({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-03-26",
          capabilities: {},
          clientInfo: { name: "vitest" },
        },
      }),
    );
    child.stdin.write(
      lspFrame({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} }),
    );

    const messages = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        child.kill("SIGTERM");
        reject(new Error(`timeout; stdout=${Buffer.concat(chunks).toString("utf8").slice(0, 400)}`));
      }, 8_000);
      const check = () => {
        const parsed = parseLsp(Buffer.concat(chunks));
        if (parsed.length >= 2) {
          clearTimeout(timer);
          resolve(parsed);
        }
      };
      child.stdout.on("data", check);
    });

    child.stdin.end();
    child.kill("SIGTERM");
    await new Promise((resolve) => child.once("exit", resolve));
    expect(messages[0].result.serverInfo.name).toBe("spearkit");
    expect(messages[1].result.tools.map((t) => t.name)).toContain("get_recipe");
  });
});
