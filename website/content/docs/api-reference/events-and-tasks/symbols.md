---
title: "events-and-tasks"
description: "events-and-tasks in the spearkit API."
---

## Classes

| Class | Description |
| :------ | :------ |
| [CronExpression](classes/CronExpression) | A parsed cron expression. Evaluates in the host's local time. |
| [EventRegistry](classes/EventRegistry) | Holds event listeners and attaches them to clients in bulk. |
| [TaskScheduler](classes/TaskScheduler) | Runs [ScheduledTask](interfaces/ScheduledTask)s. The client owns one as `client.scheduler`, starts it on `clientReady` and stops it on `destroy`. Tasks added while running are scheduled immediately. |

## Interfaces

| Interface | Description |
| :------ | :------ |
| [Destroyable](interfaces/Destroyable) | Anything with an async-or-sync `destroy()` — a discord.js `Client` qualifies. |
| [EventConfig](interfaces/EventConfig) | Object form accepted by [event](functions/event). |
| [EventDef](interfaces/EventDef) | A type-erased, ready-to-attach event listener. Built by [event](functions/event); the concrete event type is captured in the closures so binding stays type-safe. |
| [GracefulShutdownOptions](interfaces/GracefulShutdownOptions) | Options for [gracefulShutdown](functions/gracefulShutdown). |
| [ScheduledTask](interfaces/ScheduledTask) | A compiled, registrable scheduled task. Build it with [task](functions/task). |
| [ShutdownLogger](interfaces/ShutdownLogger) | Minimal logger shape used for shutdown progress (your `client.logger` fits). |
| [TaskConfig](interfaces/TaskConfig) | Configuration for a scheduled task. Provide exactly one of `cron`/`interval`. |

## Type Aliases

| Type Alias | Description |
| :------ | :------ |
| [EventHandler](type-aliases/EventHandler) | A typed handler for a discord.js client event. |

## Functions

| Function | Description |
| :------ | :------ |
| [cron](functions/cron) | Compile a cron expression. Throws on malformed input. |
| [event](functions/event) | Define a discord.js event listener with a fully-typed handler. Thrown errors and rejected promises are routed to the client's `error` event instead of crashing the process. |
| [gracefulShutdown](functions/gracefulShutdown) | Wire signal handlers that gracefully tear `client` down once, then exit. Returns a disposer that removes the handlers (handy for tests/hot-reload). |
| [task](functions/task) | Define a scheduled task. Throws if neither `cron` nor `interval` is given. |
