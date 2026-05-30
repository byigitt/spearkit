/**
 * Cooldown — a simple per-user rate limit.
 *
 * A bare number is a duration in milliseconds. When the user is still on
 * cooldown, spearkit replies with the remaining time and the handler is skipped.
 */
import { command } from "spearkit";

export const ping = command({
  name: "ping",
  description: "Check latency (once every 5s per user)",
  cooldown: 5_000,
  run: (ctx) => ctx.reply(`Pong! ${ctx.client.ws.ping}ms`),
});
