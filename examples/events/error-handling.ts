/**
 * Events — errors are routed, not fatal.
 *
 * If an event handler throws or rejects, spearkit emits the error on the client's
 * `error` event instead of crashing the process. Listen for `error` centrally.
 */
import { Intents, SpearClient, event } from "spearkit";

const client = new SpearClient({ intents: Intents.default });

// Central error logging for every spearkit-managed handler.
client.on("error", (err) => {
  console.error("A handler failed:", err);
});

// This rejection is captured and forwarded to the `error` listener above.
const risky = event("messageCreate", async (message) => {
  if (message.content === "!boom") {
    throw new Error("something went wrong while handling the message");
  }
});

client.register(risky);

void client.start();
