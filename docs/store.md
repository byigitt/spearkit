# Key-value store & settings

Almost every community bot needs to remember *something* per guild — a custom
prefix, a mod-log channel, a welcome message — and reaches for a database on day
one. spearkit ships a dependency-free `KeyValueStore` interface with two
backends, plus a typed per-guild settings helper. Swap in Redis/SQL later by
implementing the same interface.

## Stores

```ts
import { JsonStore, MemoryStore } from "spearkit";

const dev = new MemoryStore();             // in-memory, great for tests
const prod = new JsonStore("data/db.json"); // durable JSON file
```

Both implement `KeyValueStore`:

```ts
await store.set("key", { any: "json" });
await store.get<{ any: string }>("key"); // typed read, or undefined
await store.has("key");
await store.delete("key");                // → boolean (existed?)
await store.keys();                       // → string[]
await store.clear();
```

`MemoryStore` deep-clones on read and write, so callers can't mutate stored
state. `JsonStore` serves reads from an in-memory cache and commits writes
atomically (temp file + rename) through a queue — a crash mid-write can't corrupt
the file, and concurrent writes don't interleave.

## Typed per-guild settings

`createSettings` wraps a store with defaults. `get` always returns a complete
object; `set` persists *only* the overrides, so widening `defaults` later is
safe.

```ts
import { JsonStore, createSettings } from "spearkit";

const settings = createSettings({
  store: new JsonStore("data/guilds.json"),
  defaults: { prefix: "!", modLogChannelId: null as string | null },
});

const cfg = await settings.get(guildId);          // { prefix, modLogChannelId }
await settings.set(guildId, { prefix: "?" });     // shallow-merged + persisted
await settings.reset(guildId);                    // back to defaults
```

Pass `namespace` to keep several settings groups in one store:

```ts
const guilds = createSettings({ store, defaults: { prefix: "!" }, namespace: "guild" });
const users = createSettings({ store, defaults: { xp: 0 }, namespace: "user" });
```

## Dynamic per-guild prefix

A stored prefix is only useful if prefix commands respect it. `prefix.dynamic`
resolves extra prefix(es) per message — combine it with `createSettings` for true
per-guild prefixes:

```ts
const client = new SpearClient({
  prefix: {
    dynamic: async (message) =>
      message.guildId ? (await settings.get(message.guildId)).prefix : null,
  },
});
```

The resolver runs on every candidate message, so keep it fast (cache or use the
in-memory `JsonStore` cache). Returned prefixes are tried *in addition* to any
static `prefix`. See [Prefix commands](./prefix.md) for the rest of the prefix
system.

## Namespacing a raw store

`namespaced(store, prefix)` returns a `KeyValueStore` whose keys are
transparently prefixed — handy for sharing one file across features:

```ts
import { namespaced } from "spearkit";

const tags = namespaced(store, "tags");
await tags.set("hello", "world"); // stored under "tags:hello"
```
