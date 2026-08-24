/**
 * Payload tokens — keep bulky state out of the 100-char custom-id.
 *
 * Run with: DISCORD_TOKEN=... npx tsx examples/payload/ticket.ts
 */
import { Intents, MemoryStore, SpearClient, button, command, createPayloadStore, row } from "spearkit";

const tickets = createPayloadStore<{ opener: string; note: string }>({
  store: new MemoryStore(),
  ttlMs: 15 * 60 * 1000,
});

const client = new SpearClient({ intents: Intents.default });

export const close = button({
  id: "ticket:{token}",
  label: "Close",
  style: "Danger",
  run: async (ctx) => {
    const data = await tickets.get(ctx.params.token);
    if (data === undefined) return ctx.update("Ticket expired.");
    await tickets.delete(ctx.params.token);
    return ctx.update(`Closed by ${ctx.user} (opened by <@${data.opener}>): ${data.note}`);
  },
});

export const open = command({
  name: "ticket",
  description: "Open a ticket with a close button",
  run: async (ctx) => {
    const token = await tickets.put({ opener: ctx.user.id, note: "demo" });
    return ctx.reply({
      content: "Ticket opened.",
      components: [row(close.build({ token }))],
    });
  },
});

client.register(open, close);

async function main(): Promise<void> {
  await client.start();
  await client.deployCommands({ guildId: process.env.GUILD_ID });
}

void main();
