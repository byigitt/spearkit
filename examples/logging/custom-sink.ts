/**
 * Logging — a standalone Logger with a custom sink, child scopes, and levels.
 *
 * The sink collects every emitted entry into an array instead of printing it,
 * which is exactly how you'd ship logs to a file or aggregator.
 */
import { Logger, type LogEntry } from "spearkit";

// A custom sink: anything matching (entry: LogEntry) => void works.
const collected: LogEntry[] = [];

export const log = new Logger({
  level: "debug", // emit everything down to debug
  scope: "app",
  sink: (entry) => {
    collected.push(entry);
  },
});

// Child loggers add a scope segment and share the parent's level + sink.
const db = log.child("db"); // scope "app:db"
const http = log.child("http"); // scope "app:http"

log.info("starting up");
db.debug("opening pool", { data: { size: 10 } });
http.warn("slow response", { data: { ms: 812, route: "/health" } });

try {
  throw new Error("connection refused");
} catch (cause) {
  db.error("query failed", {
    error: cause instanceof Error ? cause : new Error(String(cause)),
    data: { table: "users" },
  });
}

// Levels gate output: lower the threshold and debug disappears.
log.setLevel("info");
log.enabled("debug"); // false — affects db and http too (shared state)
db.debug("not collected"); // suppressed

// `collected` now holds the four entries emitted while at "debug".
for (const entry of collected) {
  console.log(`${entry.scope ?? "-"} ${entry.level}: ${entry.message}`);
}
