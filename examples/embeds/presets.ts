/**
 * Embed presets — the four shortcuts every bot ends up writing by hand.
 *
 *   DISCORD_TOKEN=... npx tsx examples/embeds/presets.ts
 */
import { SpearClient, Intents, command } from "spearkit";

const client = new SpearClient({ intents: Intents.default });

client.register(
  command({
    name: "deploy",
    description: "Deploy something (demo of every preset)",
    run: async (ctx) => {
      // .reply()-style: the first response goes via .reply, then later state-aware
      // sends fall through to followUp.
      await ctx.replyInfo("Starting deploy…");
      await ctx.warn("Optimisations disabled.");
      await ctx.success("Deploy complete!");
      // .error() defaults to ephemeral so failure messages stay private.
      // (Uncomment to see it.)
      // await ctx.error("Something went wrong.");
    },
  }),
);

async function main(): Promise<void> {
  await client.start();
  await client.deployAllCommands({ guildId: process.env.GUILD_ID });
}

void main();
