---
title: "ProgressHandle"
description: "Handle returned by BaseContext.progress."
---

Defined in: [src/context.ts:20](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L20)

## Methods

### done()

```ts
done(text: string): Promise<void>;
```

Defined in: [src/context.ts:24](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L24)

Final replacement (same as [update](#update), named for call sites).

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`Promise`\<`void`\>

***

### update()

```ts
update(text: string): Promise<void>;
```

Defined in: [src/context.ts:22](https://github.com/byigitt/spearkit/blob/main/src/context.ts#L22)

Replace the progress message.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`Promise`\<`void`\>
