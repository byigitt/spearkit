/**
 * Auto-defer — never crash a slow handler with `Unknown interaction` (10062).
 *
 * Discord kills an interaction token 3 seconds after it arrives unless you have
 * responded or deferred. `autoDefer` arms a safety timer that defers for you if
 * the handler is still working — so a slow database/HTTP call can't expire it.
 *
 * With auto-defer on, respond via `ctx.send` / `ctx.editReply` (the initial
 * reply slot may already be taken by the auto-defer).
 */
import { command, option } from "spearkit";

export const weather = command({
  name: "weather",
  description: "Look up the weather (slow API call)",
  autoDefer: true, // or { ephemeral: true, delayMs: 1500 }
  options: { city: option.string({ description: "City", required: true }) },
  run: async (ctx) => {
    const report = await fetchWeather(ctx.options.city); // imagine a 4-second call
    await ctx.send(`Weather in **${ctx.options.city}**: ${report}`);
  },
});

async function fetchWeather(city: string): Promise<string> {
  return `partly cloudy, 18°C (${city})`;
}
