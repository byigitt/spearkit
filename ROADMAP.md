# spearkit roadmap

Bu dosya “ne eklenebilir?” listesi değil; **ne, neden, hangi Discord/d.js yüzeyine oturur, spearkit’te nasıl yapılır** planı. Kaynaklar fazın sonunda.

**Hedef:** spearkit’in dilini bozmadan (`command` / `button` / `modal` + inference + `register`) Discord’un 2025–2026 yüzeyini birinci sınıf yapmak.

**Kısıt:** Drop-in discord.js kalır. Yeni API’ler `import { … } from "spearkit"` ile gelir. `any` sızmaz. Handler’larda inference; `interactionCreate` switch yok.

**Bugünkü taban (0.13.0):** discord.js `^14.21.0`, Node `>=22.12`. Label modals,
V2 layout, install/contexts, hybrid, TS loader, create CLI, payload tokens,
polls, help, handler errors, i18n, SQLite/Redis stores, shard cooldowns, and
everyday DX (`sendLong`, `dm`, `withTyping`, `progress`, `choices`/`suggest`,
`inviteUrl`, mention parsers, `enabled: false`, `requireBotOwner`) plus opt-in
scale primitives (local/multi-host shards, backpressure, probes, shard stats).

Kalan: Voice core’a alınmaz. 1.0 = docs/e2e cilası.

---

## İlkeler

1. **Discord’un gittiği yere git.** Legacy Action Row modal deprecated; yeni projeler Components V2. spearkit “ergonomic layer” ise bu yüzeyi gizlememeli.
2. **Eski botları kırma.** `textInput` + `row(button)` çalışmaya devam eder. Yeni builder’lar eklenir; gerekirse modal build Label’a sessizce geçer.
3. **Önce d.js, sonra şeker.** Builder’lar discord.js’de yoksa spearkit uydurmaz. Önce peer’i yükselt.
4. **Küçük dil, büyük kapsama.** `fields: { x: textInput(...) }` modelini genişlet; ayrı bir form DSL yazma.
5. **Rakip = Seyfert modal V2 + Sapphire HMR/i18n/Redis, discordx CLI.** Onları kopyalama; aynı boşluğu spearkit dilinde kapat.

---

## Faz 0 — discord.js 14.21

**Neden.** Components V2 discord.js **14.19.3+**. Güncel docs **14.21.0**; Node **22.12+** istiyor. 14.16.3’te `ContainerBuilder` / `FileUploadBuilder` / `LabelBuilder` yok veya eksik.

**Nasıl**

- `package.json`: `"discord.js": "^14.21.0"`, `engines.node` → `>=22.12.0` (veya 14.21’in gerçek floor’u).
- `npm run typecheck` + `vitest` + `e2e/live.mjs`.
- Kırılan re-export / `MessageFlags` / modal builder imzalarını düzelt.
- `examples/` ve website’i 14.21 örneğine çek.

**Dosyalar:** `package.json`, `tsconfig.json`, `e2e/live.mjs`, kırılan testler.

**Çıkış:** spearkit tüketicisi `ContainerBuilder`’ı `spearkit`’ten import edebiliyor; mevcut testler yeşil.

---

## Faz 1 — Modal: Label + typed fields (en acil)

**Neden.** Discord: modal’da Action Row + Text Input **önerilmiyor**; her alan **Label** (type 18) içinde. Yeni tipler:

| Type | İsim | Submit’te beklenen değer |
|------|------|---------------------------|
| 4 | Text Input | `string` |
| 3 / 5–8 | Select (string / user / role / mentionable / channel) | `string[]` (+ resolved) |
| 19 | File Upload | `Attachment[]` (CDN; dosya body’si interaction’da yok) |
| 21 | Radio Group | `string` (tek value) |
| 22 | Checkbox Group | `string[]` |
| 23 | Checkbox | `boolean` |

Resmi kural: Radio / Checkbox / File Upload **Label child** olmak zorunda. Checkbox `required` olamaz; zorunlu evet/hayır için Checkbox Group.

Ayrıca changelog: File Upload ve slash `ATTACHMENT` option’a **file type filter**.

**Bugün spearkit** (`src/components/builders.ts`): `fields` sadece `TextInputDef`; `build()` her alanı `ActionRowBuilder<TextInputBuilder>` ile ekliyor; handler `getTextInputValue`. `ModalContext.fields` = `Record<F, string>`.

**Hedef API (mevcut `modal` + `fields` inference):**

```ts
const report = modal({
  id: "report:{userId}",
  title: "Report",
  fields: {
    reason: textInput({ label: "Why", style: "Paragraph", required: true }),
    kind: radioGroup({
      label: "Type",
      description: "What is this?",
      options: [
        { label: "Spam", value: "spam" },
        { label: "Abuse", value: "abuse" },
      ],
    }),
    extras: checkboxGroup({
      label: "Also",
      minValues: 0,
      maxValues: 3,
      options: [
        { label: "Ban", value: "ban" },
        { label: "Delete", value: "delete" },
      ],
    }),
    agree: checkbox({ label: "I understand" }),
    proof: fileUpload({
      label: "Screenshots",
      minValues: 0,
      maxValues: 5,
      // d.js 14.21 + Discord file-type filter land edince:
      // allowedMimeTypes: ["image/png", "image/jpeg"],
    }),
  },
  run: (ctx) => {
    ctx.fields.reason; // string
    ctx.fields.kind;   // "spam" | "abuse"
    ctx.fields.extras; // ("ban" | "delete")[]
    ctx.fields.agree;  // boolean
    ctx.fields.proof;  // Attachment[]
  },
});
```

**Nasıl**

1. Field union: `TextInputDef | RadioGroupDef | CheckboxDef | …` — her builder phantom value tipi taşır (`option.string` gibi).
2. `ResolvedModalFields<F>`: def → handler tipi.
3. `modal().build()`: `ModalBuilder.addLabelComponents(new LabelBuilder().setLabel(...).setXComponent(...))`. Text input artık Label içinde; Action Row yok.
4. Submit: `getTextInputValue` / `getUploadedFiles` / radio-checkbox accessors (d.js isimleri 14.21 guide’a göre; typecheck ile kilitle).
5. Semver: Label’a geçiş **görünür UX aynı**, payload değişir. Discord legacy’yi kırmıyor ama yeni client’lar Label bekliyor. **Minor** (0.5) makul; README’de “modals now emit Label components” notu.
6. `textInput` eski imza aynı kalsın (`label` field def üzerinde). Label `description` opsiyonel yeni alan.

**Dosyalar**

- `src/components/builders.ts` — field builders + `modal` build/handle
- `src/components/context.ts` — `ModalContext.fields` geniş tipi
- `tests/customId.test.ts` / yeni `tests/modals.test.ts`
- `examples/modals/`
- `docs/components.md`, `docs/api-reference.md`

**Test**

- JSON/builder snapshot: her field Label child.
- Dispatch fixture: mixed fields → inferred values.
- E2E `--stay`: gerçek modal (insan tıklar).

**Kaynaklar**

- [Components reference](https://docs.discord.com/developers/components/reference) — types 18–23; Label vs deprecated Action Row in modals
- [Using modal components](https://docs.discord.com/developers/components/using-modal-components)
- [Changelog: File Upload](https://docs.discord.com/developers/change-log) — “Introducing the File Upload component in Modals”
- [Changelog: Radio / Checkbox](https://docs.discord.com/developers/change-log) — “Radio Groups, Checkbox Groups, and Checkboxes in Modals”
- [Changelog: file type filter](https://docs.discord.com/developers/change-log) — File Upload + ATTACHMENT options
- [discord.js modals guide](https://discordjs.guide/guide/interactions/modals) — `FileUploadBuilder`, `LabelBuilder.setFileUploadComponent`, `fields.getUploadedFiles`
- Rakip şekil: [Seyfert 4.2.0](https://www.seyfert.dev/blog/v4.2.0)

---

## Faz 2 — Components V2 (mesaj layout)

**Neden.** `IS_COMPONENTS_V2` (`MessageFlags.IsComponentsV2`, `1 << 15`). Flag kalıcı; `content` / `embeds` / `poll` / `stickers` o mesajda kapalı. Metin → Text Display; kart → Container; yanına thumbnail/buton → Section. Limitler Discord docs’ta (top-level + toplam component; karakter bütçesi ~4000). Container iç içe olamaz.

**Bugün:** `row()` + `ctx.reply("string")` / preset embeds. V2’de embed yolu kapanır.

**Hedef API (ince şeker, d.js builder’ları sarmalama):**

```ts
import { MessageFlags, container, textDisplay, separator, row } from "spearkit";

await ctx.reply({
  flags: MessageFlags.IsComponentsV2, // veya ctx.replyV2(...)
  components: [
    textDisplay("Queue"),
    container({
      accentColor: 0x5865f2,
      children: [
        textDisplay("**Now playing**"),
        separator(),
        row(skip.build()),
      ],
    }),
  ],
});
```

Alternatif: `ctx.reply` V2 ağacı görünce flag’i **otomatik** OR’lar — `content` ile karışırsa type-error / runtime throw.

**Nasıl**

1. `src/components/v2.ts` (veya `layout.ts`): `textDisplay`, `separator`, `container`, `section`, `mediaGallery`, `file`, `thumbnail` — discord.js `*Builder` döner, spearkit routing yok (statik layout).
2. Interactive çocuklar mevcut `button` / `*Select.build()`; Section accessory = tek button veya thumbnail.
3. `normalizeReply`: `IsComponentsV2` varsa `content`/`embeds` reddet.
4. Preset `ctx.success/error`: sonraki turda Container + Text Display eşleniği (embed renk → `accentColor`). İlk PR’de zorunlu değil.
5. `paginate` / `confirm` V2’ye geçmek **ayrı PR** — Action Row hâlâ geçerli (legacy messages).

**Dosyalar:** `src/components/v2.ts`, `src/context.ts` (`normalizeReply`), `src/embeds.ts` (sonra), `examples/components-v2/`, `docs/components.md`

**Kaynaklar**

- [Components overview](https://docs.discord.com/developers/components/overview)
- [Using message components](https://docs.discord.com/developers/components/using-message-components)
- [discord.js Display Components](https://discordjs.guide/popular-topics/display-components)
- Changelog: “Introducing New Components for Messages!”

---

## Faz 3 — User-installable apps + command contexts

**Neden.** Komutta iki eksen:

- `integration_types` — kurulum: guild (`GUILD_INSTALL`) vs user (`USER_INSTALL`)
- `contexts` — nerede çalışır: `GUILD` (0), `BOT_DM` (1), `PRIVATE_CHANNEL` (2)

`PRIVATE_CHANNEL` yalnızca `USER_INSTALL` iken anlamlı. App-level Installation ayarı Developer Portal’da açık olmalı; komut `integration_types` app’in desteklemediğini içeremez.

**Bugün:** `guildOnly: true` → `contexts: [InteractionContextType.Guild]`. `integration_types` hiç set edilmiyor (Discord default).

**Hedef API:**

```ts
command({
  name: "remind",
  description: "DM reminder",
  install: ["user"],           // → integration_types: [UserInstall]
  contexts: ["guild", "botDm", "privateChannel"],
  run: (ctx) => { /* ctx.interaction.context, authorizingIntegrationOwners */ },
});
```

`guildOnly: true` kalsın; `contexts: ["guild"]` alias’ı. İkisi birden çelişirse type/runtime hata.

**Dosyalar:** `src/commands/command.ts` (`baseJSON`), `src/context-menus.ts`, `tests/command.test.ts`, `docs/commands.md`, e2e deploy round-trip.

**Kaynaklar**

- [Application commands — Contexts](https://docs.discord.com/developers/interactions/application-commands#contexts)
- [Interaction context types](https://docs.discord.com/developers/interactions/receiving-and-responding#interaction-object-interaction-context-types)
- [User-installable app tutorial](https://docs.discord.com/developers/tutorials/developing-a-user-installable-app)

---

## Faz 4 — DX: hybrid, loader, CLI, custom-id

Bunlar Discord yüzeyi değil; Sapphire/discordx’in “ilk gün” avantajı.

### 4a. Hybrid command

Tek tanım → slash + prefix. `options` slash’e, `args` prefix’e; `run` paylaşılır. `command({ name, description, options, args, run })` veya `hybrid({ slash, prefix })`. Prefix zaten `prefixCommand` + typed `args`.

### 4b. `client.load` + TypeScript

`src/loader.ts` default extension `.js/.mjs/.cjs`. `tsx` / `bun` ile `.ts` yükle (`extensions: [".ts"]` + `pathToFileURL` + register hook). Sapphire HMR ayrı paket; spearkit’te ilk adım “dev’de TS yükle”.

### 4c. `create-spearkit`

`SpearClient` + `.env` örneği + `deployCommands` + `AGENTS.md` kopyası. discordx: `create-discordx`.

### 4d. Signed / stored custom-id

Custom-id 100 karakter, düz metin. `id: "page:{token}"` + `MemoryStore`/`JsonStore`’da `{ userId, page }`. İsteğe HMAC. `paginate` bunu içeriden kullanabilir.

**Kaynaklar:** Discord custom-id 100 char (components reference). Store: mevcut `src/store.ts`.

---

## Faz 5 — Ölçek ve çevre (sonra)

| Konu | Neden | Nasıl (kısa) |
|------|--------|----------------|
| ✅ Redis / SQLite `KeyValueStore` | Shard + restart; Sapphire scheduled-tasks BullMQ | `SqliteStore` (`node:sqlite`) + `RedisStore` (client injected, no ioredis dep) |
| ✅ Shard-aware cooldown | Multi-process bot | `cooldownStore` / `redisCooldownBackend` (`SET NX PX`) |
| ✅ i18n | Komut *adı* localize; cevap metni yok | `createI18n` + Discord fallback + async resolver + `ctx.t` |
| ✅ Otomatik `/help` | Kayıtlı komutlardan | `helpCommand()` + paginator + live registries |
| ✅ `poll()` helper | [Poll resource](https://docs.discord.com/developers/resources/poll) | Validated `PollData`; V2 mesajda poll **disabled** |
| `option.attachment({ fileTypes })` | Changelog file type filter | `toAPIOption` alanları |
| ✅ Merkezi `onHandlerError` | Registry `onError` dağınık | Tek policy, güvenli yanıt, structured log |
| ✅ GitHub Action | `deployAllCommands({ strategy: "diff", dryRun })` | CI örneği `examples/deploy/github-action.md` |
| Voice | `@discordjs/voice` | spearkit core’a alma |

---

## Faz 6 — Büyük bot runtime (opt-in)

Küçük bot varsayılanı tek process ve sıfır ek altyapıdır. Büyük bot aynı
handler tanımlarını korur; runtime çevresine ölçek katmanlarını ekler.

| Konu | API |
|------|-----|
| Tek makine shard orchestration | `startShards(compiledEntry)` |
| Çok host shard atama | `shardOptionsFromEnv`, `shardListForWorker` |
| Guild → shard routing | `shardIdForGuild` |
| Backpressure | `WorkQueue({ concurrency, maxQueued })` |
| Container probes | `startHealthServer` (`/healthz`, `/readyz`, `/stats`) |
| Operasyon görünürlüğü | `fetchShardStats` |

`ShardingManager` yalnızca aynı makinedeki process/worker’ları yönetir. Çok
makine yerleşimi Kubernetes/Nomad/ECS/systemd işidir; spearkit cluster
orchestrator uydurmaz. Kalıcı iş kuyruğu da core seçimi değildir (BullMQ/SQS/
RabbitMQ/Kafka uygulamanın teslimat semantiğine göre seçilir).

---

## Bilinçli olarak yapma

- Nest/Sapphire-style piece store + DI
- Web dashboard
- ORM / leveling / ticket “official plugin suite” (önce API, sonra ekosistem)
- Embed’i öldürme — V2 opt-in
- discord.js builder’larını yeniden yazma

---

## Önerilen sıra ve sürüm

| Sürüm | İçerik |
|-------|--------|
| **0.5.0** | Faz 0 + Faz 1 (d.js bump + Label modals). Semver minor: modal payload değişir. |
| **0.6.0** | Faz 2 (V2 layout helpers + reply flag) |
| **0.7.0** | Faz 3 (install/contexts) |
| **0.8.0** | Faz 4 — TS loader, `spearkit create`, `createPayloadStore`, hybrid (already in 0.7) + `fileTypes` |
| **0.9.0** | Faz 5 core — `poll`, `helpCommand`, client-wide `onHandlerError` |
| **0.10.0** | Runtime i18n — inferred catalogs, Discord fallback, async guild/user resolver, `ctx.t` |
| **0.11.0** | SqliteStore, RedisStore, shared cooldown backends, deploy GitHub Action example |
| **0.12.0** | Everyday DX — sendLong, dm, typing, progress, choices/suggest, inviteUrl, mentions, enabled, requireBotOwner |
| **0.13.0** | Scale runtime — shards, multi-host assignment, WorkQueue backpressure, health/readiness, stats |
| **1.0** | Yukarıdakiler + docs/llms/skill + e2e yeşil; PolyForm NC aynı kalabilir |

Her faz: kod → `tests/` → `examples/` → `docs/` → `npm run docs:llms` → AGENTS.md / skill cheatsheet.

---

## Dokunulacak çekirdek dosyalar (harita)

```
package.json                         Faz 0
src/commands/command.ts              Faz 3 (baseJSON)
src/commands/options.ts              Faz 5 attachment fileTypes
src/context-menus.ts                 Faz 3
src/context.ts                       Faz 2 normalizeReply
src/components/builders.ts           Faz 1 modal fields
src/components/context.ts            Faz 1 ModalContext
src/components/v2.ts                 Faz 2 (yeni)
src/loader.ts                        Faz 4b
src/store.ts                         Faz 4d / 5 Redis (interface)
docs/components.md, commands.md      her faz
.claude/skills/spearkit/             her public API
```

---

## Kaynak indeksi

**Discord**

- https://docs.discord.com/developers/components/reference
- https://docs.discord.com/developers/components/overview
- https://docs.discord.com/developers/components/using-message-components
- https://docs.discord.com/developers/components/using-modal-components
- https://docs.discord.com/developers/change-log
- https://docs.discord.com/developers/interactions/application-commands
- https://docs.discord.com/developers/resources/poll
- https://docs.discord.com/developers/tutorials/developing-a-user-installable-app

**discord.js**

- https://discordjs.guide/popular-topics/display-components
- https://discordjs.guide/guide/interactions/modals
- https://discord.js.org/docs/packages/discord.js/14.21.0
- V2 için pratik eşik: discord.js `14.19.3+` (community writeup); docs paketi `14.21.0`

**Rakip (şekil, kopyalama değil)**

- https://www.seyfert.dev/blog/v4.2.0
- https://sapphirejs.dev/ — HMR, i18next, scheduled-tasks (BullMQ)
- https://discordx.js.org/docs/discordx/ — `create-discordx`

**İç referans**

- `AGENTS.md`, `docs/components.md`, `src/components/builders.ts` (`modal` / `textInput`)
- `src/commands/command.ts` (`baseJSON` / `guildOnly`)
