---
title: "PollConfig"
description: "Configuration for poll."
---

Defined in: [src/poll.ts:19](https://github.com/byigitt/spearkit/blob/main/src/poll.ts#L19)

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| <a id="property-answers"></a> `answers` | readonly [`PollAnswerInput`](../type-aliases/PollAnswerInput)[] | Between 2 and 10 answers; answer text is limited to 55 characters. |
| <a id="property-durationhours"></a> `durationHours?` | `number` | Number of hours before expiry, 1–768 (32 days). Default: 24. |
| <a id="property-multiselect"></a> `multiselect?` | `boolean` | Allow voters to select more than one answer. Default: false. |
| <a id="property-question"></a> `question` | `string` | Question text (maximum 300 characters). |
