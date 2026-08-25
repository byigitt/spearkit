# Scaling

[`architecture.ts`](./architecture.ts) keeps the bot single-process by default,
accepts explicit multi-host shard assignment from env, and bounds expensive
handler work with `WorkQueue`.

See the full [scaling guide](../../docs/scaling.md) for local
`startShards(...)`, Redis state, health probes, and rollout rules.
