import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative } from "node:path";
import { PKG_ROOT } from "./root.mjs";

const STOP = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "how", "in",
  "into", "is", "it", "of", "on", "or", "the", "to", "with", "you", "your",
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9_]+/i)
    .filter((t) => t.length >= 2 && !STOP.has(t));
}

async function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".claude") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist") continue;
      await walk(full, acc);
    } else if (/\.(md|ts|mjs|js)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

function excerpt(body, terms, radius = 180) {
  const lower = body.toLowerCase();
  let idx = -1;
  for (const term of terms) {
    idx = lower.indexOf(term);
    if (idx !== -1) break;
  }
  if (idx === -1) {
    return body.slice(0, radius * 2).replace(/\s+/g, " ").trim();
  }
  const start = Math.max(0, idx - radius);
  const end = Math.min(body.length, idx + radius);
  return `${start > 0 ? "…" : ""}${body.slice(start, end).replace(/\s+/g, " ").trim()}${end < body.length ? "…" : ""}`;
}

/** @typedef {{ path: string; kind: string; title: string; body: string }} Doc */

/** @type {Doc[] | null} */
let cache = null;

export async function loadCorpus() {
  if (cache) return cache;
  const files = [];
  await walk(join(PKG_ROOT, "docs"), files);
  await walk(join(PKG_ROOT, "examples"), files);
  for (const extra of [
    join(PKG_ROOT, "AGENTS.md"),
    join(PKG_ROOT, "llms.txt"),
    join(PKG_ROOT, ".claude/skills/spearkit/SKILL.md"),
    join(PKG_ROOT, ".claude/skills/spearkit/reference/cheatsheet.md"),
  ]) {
    if (existsSync(extra)) files.push(extra);
  }

  const docs = [];
  for (const file of files) {
    const body = await readFile(file, "utf8");
    const rel = relative(PKG_ROOT, file).replaceAll("\\", "/");
    const heading = /^#\s+(.+)$/m.exec(body)?.[1]?.trim();
    let kind = "file";
    if (rel.startsWith("docs/")) kind = "guide";
    else if (rel.startsWith("examples/")) kind = "example";
    else if (rel.endsWith("AGENTS.md") || rel.includes(".claude/")) kind = "agent";
    docs.push({
      path: rel,
      kind,
      title: heading ?? rel,
      body,
    });
  }
  cache = docs;
  return docs;
}

export async function searchCorpus(query, { limit = 8 } = {}) {
  const terms = tokenize(query);
  if (terms.length === 0) return [];
  const docs = await loadCorpus();
  const scored = [];
  for (const doc of docs) {
    const hayTitle = doc.title.toLowerCase();
    const hayPath = doc.path.toLowerCase();
    const hayBody = doc.body.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (hayTitle.includes(term)) score += 8;
      if (hayPath.includes(term)) score += 5;
      const hits = hayBody.split(term).length - 1;
      score += Math.min(hits, 12);
    }
    if (score > 0) {
      scored.push({
        path: doc.path,
        kind: doc.kind,
        title: doc.title,
        score,
        excerpt: excerpt(doc.body, terms),
      });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

export function extractSection(markdown, headingQuery) {
  const q = headingQuery.trim().toLowerCase();
  const lines = markdown.split("\n");
  let start = -1;
  let startLevel = 0;
  for (let i = 0; i < lines.length; i++) {
    const m = /^(#{1,6})\s+(.+)$/.exec(lines[i]);
    if (!m) continue;
    const text = m[2].replace(/`/g, "").trim().toLowerCase();
    if (text.includes(q) || q.includes(text)) {
      start = i;
      startLevel = m[1].length;
      break;
    }
  }
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const m = /^(#{1,6})\s+/.exec(lines[i]);
    if (m && m[1].length <= startLevel) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end).join("\n").trim();
}

export async function listGuides() {
  const docs = await loadCorpus();
  return docs
    .filter((d) => d.kind === "guide" && d.path.endsWith(".md"))
    .map((d) => ({
      slug: d.path.replace(/^docs\//, "").replace(/\.md$/, ""),
      title: d.title,
      path: d.path,
    }));
}

export async function listExamples() {
  const docs = await loadCorpus();
  return docs
    .filter((d) => d.kind === "example" && d.path.endsWith(".ts"))
    .map((d) => ({ path: d.path.replace(/^examples\//, ""), title: d.title }));
}

export async function readRel(rel) {
  const full = join(PKG_ROOT, rel);
  if (!existsSync(full)) return null;
  return readFile(full, "utf8");
}
