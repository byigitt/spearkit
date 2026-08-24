# Store backends

- [`guild-settings.ts`](./guild-settings.ts) — `JsonStore` + `createSettings` + a dynamic prefix.
- [`sqlite.ts`](./sqlite.ts) — `SqliteStore` (`node:sqlite`) shared with `cooldownStore`.

Redis is the same `KeyValueStore` surface without an ioredis dependency:

```ts
import { createClient } from "redis"; // your client, not spearkit's
import { RedisStore, redisCooldownBackend } from "spearkit";

const redis = createClient();
await redis.connect();

const store = new RedisStore(redis);
const client = new SpearClient({
  cooldownStore: redisCooldownBackend(redis),
});
```

`ioredis` needs a thin `set` wrapper because it uses `set(key, value, "PX", ms, "NX")` instead of `{ PX, NX }`.
