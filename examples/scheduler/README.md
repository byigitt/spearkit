# Scheduled tasks

Run work on a cron schedule or a fixed interval. The client starts the
scheduler on ready and stops it on `destroy()`. See the
[scheduler guide](../../docs/scheduler.md).

- [`interval.ts`](./interval.ts) — a task every 60s with `runOnStart`.
- [`cron.ts`](./cron.ts) — cron-scheduled tasks and `cron().next()`.
- [`inline-schedule.ts`](./inline-schedule.ts) — `client.schedule({ ... })`.

```bash
DISCORD_TOKEN=... npx tsx examples/scheduler/interval.ts
```
