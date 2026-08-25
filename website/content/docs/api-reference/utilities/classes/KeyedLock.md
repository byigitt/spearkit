---
title: "KeyedLock"
description: "Acquire, release and run-while-locked operations keyed on an arbitrary string."
---

Defined in: [src/lock.ts:38](https://github.com/byigitt/spearkit/blob/main/src/lock.ts#L38)

## Example

```ts
const locks = new KeyedLock();
const result = await locks.run(`ticket:${id}:claim`, async () => {
  // …mutate ticket atomically…
  return "ok";
}, { onBusy: () => "busy" });
```

## Constructors

### Constructor

```ts
new KeyedLock(options?: KeyedLockOptions): KeyedLock;
```

Defined in: [src/lock.ts:43](https://github.com/byigitt/spearkit/blob/main/src/lock.ts#L43)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`KeyedLockOptions`](../interfaces/KeyedLockOptions) |

#### Returns

`KeyedLock`

## Accessors

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [src/lock.ts:95](https://github.com/byigitt/spearkit/blob/main/src/lock.ts#L95)

Number of currently-tracked leases (including expired-but-unswept).

##### Returns

`number`

## Methods

### dispose()

```ts
dispose(): void;
```

Defined in: [src/lock.ts:100](https://github.com/byigitt/spearkit/blob/main/src/lock.ts#L100)

Drop all known leases and stop the sweep timer.

#### Returns

`void`

***

### forget()

```ts
forget(key: string): boolean;
```

Defined in: [src/lock.ts:106](https://github.com/byigitt/spearkit/blob/main/src/lock.ts#L106)

Manually remove a single key without running anything.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`boolean`

***

### isHeld()

```ts
isHeld(key: string): boolean;
```

Defined in: [src/lock.ts:68](https://github.com/byigitt/spearkit/blob/main/src/lock.ts#L68)

Whether `key` is currently held and not expired.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`boolean`

***

### run()

```ts
run<T>(
   key: string, 
   fn: () => T | Promise<T>, 
options?: object): Promise<T | undefined>;
```

Defined in: [src/lock.ts:78](https://github.com/byigitt/spearkit/blob/main/src/lock.ts#L78)

Run `fn` while holding `key`. If the key is already held, calls `onBusy`
(or returns `undefined`) without ever calling `fn`. Always releases on
return or throw.

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `fn` | () => `T` \| `Promise`\<`T`\> |
| `options` | \{ `onBusy?`: () => `T` \| `Promise`\<`T`\>; `ttl?`: `number`; \} |
| `options.onBusy?` | () => `T` \| `Promise`\<`T`\> |
| `options.ttl?` | `number` |

#### Returns

`Promise`\<`T` \| `undefined`\>

***

### tryAcquire()

```ts
tryAcquire(key: string, ttl?: number): LockRelease | null;
```

Defined in: [src/lock.ts:53](https://github.com/byigitt/spearkit/blob/main/src/lock.ts#L53)

Try to acquire `key`. Returns a release function, or `null` if already held.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `ttl` | `number` |

#### Returns

[`LockRelease`](../type-aliases/LockRelease) \| `null`
