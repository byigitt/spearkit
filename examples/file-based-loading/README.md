# File-based loading

One command/event/component per file; `client.load(dir)` imports a directory and
registers everything it exports (default and named).

```
file-based-loading/
  index.ts            # construct client, load each folder, start, deploy
  commands/ping.ts    # export default command({ ... })
  commands/echo.ts
  events/ready.ts     # export default event("clientReady", ...)
  components/vote.ts   # export const vote = button({ ... })
```

`client.load` imports **compiled JavaScript**, so build first:

```bash
npx tsc && node dist/examples/file-based-loading/index.js
```

See also: [plugins](../plugins), [events](../events).
