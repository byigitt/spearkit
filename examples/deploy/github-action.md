# Deploy Discord commands from GitHub Actions

Copy this workflow into `.github/workflows/deploy-commands.yml`. It uses
`deployAllCommands({ strategy: "diff" })` so unchanged command bodies are not
PUT to Discord. Pull requests run `dryRun: true`.

```yaml
name: Deploy Discord commands

on:
  pull_request:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - name: Diff or deploy
        env:
          DISCORD_TOKEN: ${{ secrets.DISCORD_TOKEN }}
          GUILD_ID: ${{ secrets.GUILD_ID }}
        run: npx tsx scripts/deploy-commands.ts
```

`scripts/deploy-commands.ts`:

```ts
import { SpearClient } from "spearkit";
import { ping } from "./commands/ping.js";

const client = new SpearClient();
client.register(ping);
await client.start(process.env.DISCORD_TOKEN);
const dryRun = process.env.GITHUB_EVENT_NAME === "pull_request";
await client.deployAllCommands({
  guildId: process.env.GUILD_ID,
  strategy: "diff",
  dryRun,
});
await client.destroy();
```

Store `DISCORD_TOKEN` (and optional `GUILD_ID` for instant guild deploys) as
repository secrets. Omit `guildId` to deploy globally.
