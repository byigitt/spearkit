# Scheduled tasks

Run work on a cron schedule or a fixed interval. The client starts the
scheduler when it becomes ready and stops it on `destroy()`, so timers never
outlive your bot.

## Define a task

Provide exactly one of `cron` or `interval`:

```ts
import { task } from "spearkit";

export const heartbeat = task({
  name: "heartbeat",
  interval: 60_000, // every minute
  runOnStart: true, // also run once on startup
  run: (client) => client.logger.info("still alive"),
});
```

Register it like anything else:

```ts
client.register(heartbeat);
```

Or define and register in one call:

```ts
client.schedule({
  name: "cleanup",
  cron: "0 3 * * *", // 03:00 local time, every day
  run: async (client) => {
    // …purge expired records…
  },
});
```

## Cron syntax

Standard 5-field expressions, evaluated in the host's **local** time:

```
┌─ minute (0-59)
│ ┌─ hour (0-23)
│ │ ┌─ day of month (1-31)
│ │ │ ┌─ month (1-12)
│ │ │ │ ┌─ day of week (0-6, Sunday = 0)
│ │ │ │ │
* * * * *
```

Each field supports `*`, ranges (`1-5`), lists (`1,3,5`) and steps (`*/15`).
When both day-of-month and day-of-week are restricted, a date matches if
**either** does (standard cron behaviour).

Aliases: `@yearly`, `@monthly`, `@weekly`, `@daily`, `@hourly`.

```ts
task({ name: "report", cron: "@daily", run: () => {} });
task({ name: "poll", cron: "*/5 * * * *", run: () => {} }); // every 5 minutes
task({ name: "mondays", cron: "0 9 * * 1", run: () => {} }); // Mon 09:00
```

Compute the next run yourself with `cron`:

```ts
import { cron } from "spearkit";

const next = cron("*/15 * * * *").next(new Date());
```

## The scheduler

`client.scheduler` is the `TaskScheduler`:

```ts
client.scheduler.size; // number of tasks
client.scheduler.active; // started?
client.scheduler.list(); // every task
client.scheduler.remove("heartbeat"); // cancel + forget
client.scheduler.stop(); // cancel all timers
```

Task errors are caught and logged through `client.logger` (scope `scheduler`),
so a throwing task never crashes the process or stops future runs.
