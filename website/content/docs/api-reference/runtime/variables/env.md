---
title: "env"
description: "Typed accessor over process.env."
---

```ts
const env: EnvReader;
```

Defined in: [src/env.ts:148](https://github.com/byigitt/spearkit/blob/main/src/env.ts#L148)

## Example

```ts
loadEnv();
const token = env.require("DISCORD_TOKEN");
const port = env.number("PORT", 3000);
const debug = env.boolean("DEBUG", false);
```
