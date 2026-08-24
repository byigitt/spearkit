#!/usr/bin/env node
/**
 * spearkit CLI — currently `spearkit create <dir>` scaffolds a starter bot.
 */
import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(HERE, "..");
const TEMPLATE = join(PKG_ROOT, "templates", "bot");

function usage() {
  console.error("Usage: spearkit create <directory>");
  process.exit(1);
}

async function isEmptyDir(dir) {
  if (!existsSync(dir)) return true;
  const entries = await readdir(dir);
  return entries.length === 0;
}

function npmName(dir) {
  const base = dir.replace(/[/\\]+$/, "").split(/[/\\]/).pop() ?? "spearkit-bot";
  return base
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "") || "spearkit-bot";
}

async function create(target) {
  const dest = resolve(target);
  if (!(await isEmptyDir(dest))) {
    throw new Error(`spearkit: "${dest}" exists and is not empty`);
  }
  if (!existsSync(TEMPLATE)) {
    throw new Error(`spearkit: template missing at ${TEMPLATE}`);
  }

  await mkdir(dest, { recursive: true });
  await cp(TEMPLATE, dest, { recursive: true });

  const pkgPath = join(dest, "package.json");
  const pkg = JSON.parse(await readFile(pkgPath, "utf8"));
  pkg.name = npmName(dest);
  await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  const agentsSrc = join(PKG_ROOT, "AGENTS.md");
  if (existsSync(agentsSrc)) {
    await cp(agentsSrc, join(dest, "AGENTS.md"));
  }

  console.log(`Created spearkit bot in ${dest}`);
  console.log("Next:");
  console.log(`  cd ${target}`);
  console.log("  npm install");
  console.log("  cp .env.example .env   # then set DISCORD_TOKEN and GUILD_ID");
  console.log("  npm start");
}

const [cmd, dir] = process.argv.slice(2);
if (cmd !== "create" || dir === undefined || dir.length === 0) usage();
create(dir).catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
