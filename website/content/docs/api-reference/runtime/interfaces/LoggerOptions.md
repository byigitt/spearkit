---
title: "LoggerOptions"
description: "Construction options for a Logger."
---

Defined in: [src/logger.ts:45](https://github.com/byigitt/spearkit/blob/main/src/logger.ts#L45)

Construction options for a [Logger](../classes/Logger).

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-level"></a> `level?` | [`LogThreshold`](../type-aliases/LogThreshold) | Minimum level to emit. Default `"info"`. |
| <a id="property-scope"></a> `scope?` | `string` | A scope prefix for every entry (e.g. `"commands"`). |
| <a id="property-sink"></a> `sink?` | [`LogSink`](../type-aliases/LogSink) | Single transport — shorthand for `transports: [sink]`. |
| <a id="property-transports"></a> `transports?` | readonly [`LogSink`](../type-aliases/LogSink)[] | Multiple transports. If set, takes precedence over `sink`. |
