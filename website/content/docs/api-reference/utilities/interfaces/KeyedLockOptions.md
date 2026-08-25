---
title: "KeyedLockOptions"
description: "Construction options for KeyedLock."
---

Defined in: [src/lock.ts:11](https://github.com/byigitt/spearkit/blob/main/src/lock.ts#L11)

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-sweep"></a> `sweep?` | `number` | Sweep interval (ms) for expired-but-not-released locks. `0` disables sweeping. |
| <a id="property-ttl"></a> `ttl?` | `number` | Maximum lifetime (ms) of a held lock before it auto-expires. Default `60_000`. |
