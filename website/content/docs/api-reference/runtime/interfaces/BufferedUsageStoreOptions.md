---
title: "BufferedUsageStoreOptions"
description: "Options for BufferedUsageStore."
---

Defined in: [src/usage.ts:64](https://github.com/byigitt/spearkit/blob/main/src/usage.ts#L64)

Options for [BufferedUsageStore](../classes/BufferedUsageStore).

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-batchsize"></a> `batchSize?` | `number` | Events per downstream write. Default 100. |
| <a id="property-flushintervalms"></a> `flushIntervalMs?` | `number` | Periodic flush interval. Default 1000ms; `0` disables. |
| <a id="property-maxbuffered"></a> `maxBuffered?` | `number` | Hard in-memory bound. Default 10,000. Oldest events drop first. |
| <a id="property-ondrop"></a> `onDrop?` | (`count`) => `void` | Observe dropped telemetry events. |
| <a id="property-onerror"></a> `onError?` | (`error`) => `void` | Observe background flush errors. |
