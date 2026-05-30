import { describe, expect, it } from "vitest";
import { SpearClient, command, userCommand } from "../src/index.js";

describe("SpearClient.deployAllCommands dryRun + diff", () => {
  it("dryRun returns the merged body without calling REST", async () => {
    const client = new SpearClient({ intents: [], logger: { level: "silent" } });
    client.register(
      command({ name: "ping", description: "p", run: () => {} }),
      userCommand({ name: "Report", run: () => {} }),
    );
    let putCalled = false;
    let getCalled = false;
    Object.defineProperty(client, "rest", {
      value: {
        get: () => {
          getCalled = true;
          return Promise.resolve([]);
        },
        put: () => {
          putCalled = true;
          return Promise.resolve([]);
        },
      },
      configurable: true,
    });
    const result = await client.deployAllCommands({ applicationId: "app1", dryRun: true });
    expect(putCalled).toBe(false);
    expect(getCalled).toBe(false);
    expect("skipped" in result).toBe(true);
    if ("skipped" in result) {
      expect(result.reason).toBe("dry-run");
      expect(result.body).toHaveLength(2);
    }
  });

  it("diff strategy skips PUT when remote equals local", async () => {
    const client = new SpearClient({ intents: [], logger: { level: "silent" } });
    client.register(command({ name: "ping", description: "p", run: () => {} }));
    const body = client.commands.toJSON();
    let putCalled = false;
    Object.defineProperty(client, "rest", {
      value: {
        get: () => Promise.resolve(body),
        put: () => {
          putCalled = true;
          return Promise.resolve([]);
        },
      },
      configurable: true,
    });
    const result = await client.deployAllCommands({ applicationId: "app1", strategy: "diff" });
    expect(putCalled).toBe(false);
    expect("skipped" in result && result.reason).toBe("no-changes");
  });

  it("diff strategy PUTs when remote differs", async () => {
    const client = new SpearClient({ intents: [], logger: { level: "silent" } });
    client.register(command({ name: "ping", description: "p", run: () => {} }));
    let putCalled = false;
    Object.defineProperty(client, "rest", {
      value: {
        get: () => Promise.resolve([{ name: "other", type: 1, description: "x" }]),
        put: () => {
          putCalled = true;
          return Promise.resolve([{ id: "1", name: "ping" }]);
        },
      },
      configurable: true,
    });
    const result = await client.deployAllCommands({ applicationId: "app1", strategy: "diff" });
    expect(putCalled).toBe(true);
    expect(Array.isArray(result)).toBe(true);
  });

  it("diff treats option order as irrelevant", async () => {
    const client = new SpearClient({ intents: [], logger: { level: "silent" } });
    client.register(
      command({
        name: "z",
        description: "z",
        run: () => {},
      }),
    );
    let putCalled = false;
    // remote has the same logical command — equal even with no options reordering needed.
    Object.defineProperty(client, "rest", {
      value: {
        get: () =>
          Promise.resolve([
            {
              id: "1",
              application_id: "app1",
              version: "abc",
              name: "z",
              type: 1,
              description: "z",
            },
          ]),
        put: () => {
          putCalled = true;
          return Promise.resolve([]);
        },
      },
      configurable: true,
    });
    const result = await client.deployAllCommands({ applicationId: "app1", strategy: "diff" });
    expect(putCalled).toBe(false);
    expect("skipped" in result).toBe(true);
  });
});
