/**
 * Cooldown — a client-wide default.
 *
 * Every command inherits this 3s cooldown unless it sets its own. The shared
 * manager is also available as `client.cooldowns`.
 */
import { SpearClient, Intents, command } from "spearkit";

const client = new SpearClient({
  intents: Intents.default,
  cooldown: { duration: 3_000 },
});

// Inherits the 3s default.
client.register(command({ name: "hello", description: "Say hi", run: (c) => c.reply("hi") }));

// Opts out with its own (longer) cooldown.
client.register(
  command({ name: "vote", description: "Vote", cooldown: 30_000, run: (c) => c.reply("voted") }),
);

export { client };
