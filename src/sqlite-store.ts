/**
 * SQLite {@link KeyValueStore} using Node's built-in `node:sqlite`.
 *
 * No extra package: Node 22.12+ ships `DatabaseSync`. Pass `":memory:"` for
 * tests or a file path for a durable store that survives restarts and can be
 * shared by several processes (SQLite handles the locking).
 */
import { createRequire } from "node:module";
import type { KeyValueStore } from "./store.js";

/** Options for {@link SqliteStore}. */
export interface SqliteStoreOptions {
  /** File path, or `":memory:"`. */
  path: string;
  /** Table used for key/value rows. Default `"spearkit_kv"`. */
  table?: string;
}

interface SqliteStatement {
  get(...params: unknown[]): unknown;
  run(...params: unknown[]): { changes?: number };
  all(...params: unknown[]): unknown[];
}

interface SqliteDatabase {
  exec(sql: string): void;
  prepare(sql: string): SqliteStatement;
  close(): void;
}

function openDatabase(path: string): SqliteDatabase {
  const require = createRequire(import.meta.url);
  const { DatabaseSync } = require("node:sqlite") as {
    DatabaseSync: new (path: string) => SqliteDatabase;
  };
  return new DatabaseSync(path);
}

function quoteIdent(name: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
    throw new Error(`spearkit: sqlite table name "${name}" is not a simple identifier`);
  }
  return name;
}

/**
 * File- or memory-backed {@link KeyValueStore} over `node:sqlite`.
 *
 * @example
 * ```ts
 * const store = new SqliteStore("data/bot.sqlite");
 * await store.set("prefix", "?");
 * ```
 */
export class SqliteStore implements KeyValueStore {
  private readonly db: SqliteDatabase;
  private readonly table: string;

  constructor(path: string | SqliteStoreOptions) {
    const options = typeof path === "string" ? { path } : path;
    this.table = quoteIdent(options.table ?? "spearkit_kv");
    this.db = openDatabase(options.path);
    this.db.exec(
      `CREATE TABLE IF NOT EXISTS ${this.table} (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL)`,
    );
  }

  /** Close the underlying database. */
  close(): void {
    this.db.close();
  }

  async get<T>(key: string): Promise<T | undefined> {
    const row = this.db.prepare(`SELECT value FROM ${this.table} WHERE key = ?`).get(key) as
      | { value: string }
      | undefined;
    return row === undefined ? undefined : (JSON.parse(row.value) as T);
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.db
      .prepare(
        `INSERT INTO ${this.table} (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      )
      .run(key, JSON.stringify(value));
  }

  async has(key: string): Promise<boolean> {
    const row = this.db.prepare(`SELECT 1 AS present FROM ${this.table} WHERE key = ?`).get(key);
    return row !== undefined;
  }

  async delete(key: string): Promise<boolean> {
    const result = this.db.prepare(`DELETE FROM ${this.table} WHERE key = ?`).run(key);
    return (result.changes ?? 0) > 0;
  }

  async keys(): Promise<string[]> {
    const rows = this.db.prepare(`SELECT key FROM ${this.table}`).all() as { key: string }[];
    return rows.map((row) => row.key);
  }

  async clear(): Promise<void> {
    this.db.exec(`DELETE FROM ${this.table}`);
  }
}
