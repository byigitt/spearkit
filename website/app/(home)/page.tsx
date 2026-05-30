import Link from "next/link";
import { GITHUB_URL } from "@/lib/layout.shared";

const features = [
  {
    title: "Drop-in for discord.js",
    body: "Every discord.js export is re-exported from spearkit. Change one import and your bot keeps working — then adopt the niceties at your own pace.",
  },
  {
    title: "Fully type-safe",
    body: "No any, no unknown. Option values, custom-id params and modal fields are all inferred from your definitions.",
  },
  {
    title: "Co-located handlers",
    body: "A command's options and handler, a button's look and click logic, a modal's fields and submit — each lives in one place.",
  },
  {
    title: "Zero boilerplate routing",
    body: "No interactionCreate switch. spearkit routes commands, autocomplete, buttons, selects and modals for you.",
  },
];

const snippet = `import { SpearClient, Intents, command, option, button } from "spearkit";

const client = new SpearClient({ intents: Intents.default });

const greet = command({
  name: "greet",
  description: "Greet someone",
  options: { who: option.user({ description: "Who", required: true }) },
  run: (ctx) => ctx.reply(\`Hello \${ctx.options.who}!\`), // who: User
});

const ping = button({
  id: "ping:{n}",
  label: "Ping",
  run: (ctx) => ctx.update(\`pong #\${ctx.params.n}\`), // n: string
});

client.register(greet, ping);
await client.start(process.env.DISCORD_TOKEN);
await client.deployCommands({ guildId: process.env.GUILD_ID });`;

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-fd-border">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, hsl(235 86% 60% / 0.25), transparent 70%)",
          }}
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-24 text-center">
          <span className="mb-5 rounded-full border border-fd-border bg-fd-card px-3 py-1 text-xs font-medium text-fd-muted-foreground">
            discord.js++
          </span>
          <h1 className="text-6xl font-bold tracking-tight sm:text-7xl">
            <span className="bg-gradient-to-r from-[#5865F2] via-[#7d8bff] to-[#5865F2] bg-clip-text text-transparent">
              spearkit
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-fd-muted-foreground">
            A developer-experience-first Discord library. Everything discord.js gives you, plus
            ergonomic, fully type-safe events, slash commands and interactive components.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/docs"
              className="rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90"
            >
              Get started
            </Link>
            <Link
              href="/docs/api-reference"
              className="rounded-lg border border-fd-border bg-fd-card px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-fd-accent"
            >
              API reference
            </Link>
            <a
              href={GITHUB_URL}
              className="rounded-lg border border-fd-border bg-fd-card px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-fd-accent"
            >
              GitHub
            </a>
          </div>
          <code className="mt-8 rounded-md border border-fd-border bg-fd-card px-4 py-2 text-sm text-fd-muted-foreground">
            npm install spearkit discord.js
          </code>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid w-full max-w-5xl gap-4 px-6 py-16 sm:grid-cols-2">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-fd-border bg-fd-card p-6 transition-colors hover:border-fd-primary/40"
          >
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-fd-muted-foreground">{f.body}</p>
          </div>
        ))}
      </section>

      {/* Code sample */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-24">
        <h2 className="mb-4 text-center text-2xl font-semibold">A bot, in a few lines</h2>
        <pre className="overflow-x-auto rounded-xl border border-fd-border bg-fd-card p-5 text-sm leading-relaxed">
          <code className="font-mono">{snippet}</code>
        </pre>
        <p className="mt-6 text-center text-sm text-fd-muted-foreground">
          Read the{" "}
          <Link href="/docs/getting-started" className="text-fd-primary hover:underline">
            getting started guide
          </Link>{" "}
          or browse the{" "}
          <Link href="/docs/guides/commands" className="text-fd-primary hover:underline">
            guides
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
