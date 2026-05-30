/**
 * Scheduled tasks: run work on a cron schedule or a fixed interval.
 *
 * Dependency-free. Includes a standard 5-field cron parser (`*`, ranges,
 * lists, steps, `@daily` style aliases) evaluated in local time, plus a
 * {@link TaskScheduler} that the client starts on ready and stops on destroy.
 */
import type { Awaitable } from "discord.js";
import type { SpearClient } from "./client.js";
import type { Logger } from "./logger.js";
import { toError } from "./logger.js";

const ALIASES: Record<string, string> = {
  "@yearly": "0 0 1 1 *",
  "@annually": "0 0 1 1 *",
  "@monthly": "0 0 1 * *",
  "@weekly": "0 0 * * 0",
  "@daily": "0 0 * * *",
  "@midnight": "0 0 * * *",
  "@hourly": "0 * * * *",
};

function parseField(spec: string, min: number, max: number, label: string): Set<number> {
  const set = new Set<number>();
  for (const part of spec.split(",")) {
    let range = part;
    let step = 1;
    const slash = part.indexOf("/");
    if (slash >= 0) {
      step = Number(part.slice(slash + 1));
      range = part.slice(0, slash);
      if (!Number.isInteger(step) || step <= 0) {
        throw new Error(`spearkit: invalid step in cron ${label} field "${part}"`);
      }
    }
    let lo: number;
    let hi: number;
    if (range === "*") {
      lo = min;
      hi = max;
    } else if (range.includes("-")) {
      const dash = range.indexOf("-");
      lo = Number(range.slice(0, dash));
      hi = Number(range.slice(dash + 1));
    } else {
      lo = Number(range);
      hi = lo;
    }
    if (!Number.isInteger(lo) || !Number.isInteger(hi) || lo < min || hi > max || lo > hi) {
      throw new Error(`spearkit: cron ${label} field out of range ${min}-${max}: "${part}"`);
    }
    for (let value = lo; value <= hi; value += step) set.add(value);
  }
  return set;
}

/**
 * A parsed cron expression. Evaluates in the host's local time.
 *
 * @example
 * ```ts
 * cron("*\u200b/5 * * * *").next();          // next 5-minute boundary
 * cron("@daily").next(new Date());           // next midnight
 * ```
 */
export class CronExpression {
  /** The original expression string. */
  readonly source: string;
  private readonly minutes: Set<number>;
  private readonly hours: Set<number>;
  private readonly daysOfMonth: Set<number>;
  private readonly months: Set<number>;
  private readonly daysOfWeek: Set<number>;
  private readonly domRestricted: boolean;
  private readonly dowRestricted: boolean;

  constructor(expression: string) {
    const trimmed = expression.trim();
    const normalized = ALIASES[trimmed] ?? trimmed;
    const parts = normalized.split(/\s+/);
    if (parts.length !== 5) {
      throw new Error(`spearkit: cron expression must have 5 fields, got "${expression}"`);
    }
    const [minute, hour, dom, month, dow] = parts;
    if (
      minute === undefined ||
      hour === undefined ||
      dom === undefined ||
      month === undefined ||
      dow === undefined
    ) {
      throw new Error(`spearkit: invalid cron expression "${expression}"`);
    }
    this.source = expression;
    this.minutes = parseField(minute, 0, 59, "minute");
    this.hours = parseField(hour, 0, 23, "hour");
    this.daysOfMonth = parseField(dom, 1, 31, "day-of-month");
    this.months = parseField(month, 1, 12, "month");
    const weekdays = parseField(dow, 0, 7, "day-of-week");
    if (weekdays.has(7)) {
      weekdays.delete(7);
      weekdays.add(0);
    }
    this.daysOfWeek = weekdays;
    this.domRestricted = dom !== "*";
    this.dowRestricted = dow !== "*";
  }

  private dayMatches(date: Date): boolean {
    const dom = this.daysOfMonth.has(date.getDate());
    const dow = this.daysOfWeek.has(date.getDay());
    if (this.domRestricted && this.dowRestricted) return dom || dow;
    if (this.domRestricted) return dom;
    if (this.dowRestricted) return dow;
    return true;
  }

  /** The next time strictly after `from` (default now) that matches. */
  next(from: Date = new Date()): Date {
    const date = new Date(from.getTime());
    date.setSeconds(0, 0);
    date.setMinutes(date.getMinutes() + 1);
    for (let guard = 0; guard < 100_000; guard++) {
      if (!this.months.has(date.getMonth() + 1)) {
        date.setMonth(date.getMonth() + 1, 1);
        date.setHours(0, 0, 0, 0);
        continue;
      }
      if (!this.dayMatches(date)) {
        date.setDate(date.getDate() + 1);
        date.setHours(0, 0, 0, 0);
        continue;
      }
      if (!this.hours.has(date.getHours())) {
        date.setHours(date.getHours() + 1, 0, 0, 0);
        continue;
      }
      if (!this.minutes.has(date.getMinutes())) {
        date.setMinutes(date.getMinutes() + 1, 0, 0);
        continue;
      }
      return new Date(date.getTime());
    }
    throw new Error(`spearkit: cron expression "${this.source}" has no upcoming match`);
  }
}

/** Compile a cron expression. Throws on malformed input. */
export function cron(expression: string): CronExpression {
  return new CronExpression(expression);
}

/** Configuration for a scheduled task. Provide exactly one of `cron`/`interval`. */
export interface TaskConfig {
  /** Unique task name. */
  name: string;
  /** A cron expression (local time). */
  cron?: string;
  /** A fixed interval in milliseconds. */
  interval?: number;
  /** Also run once immediately when the scheduler starts. Default `false`. */
  runOnStart?: boolean;
  /** The work to perform. */
  run: (client: SpearClient) => Awaitable<void>;
}

/** A compiled, registrable scheduled task. Build it with {@link task}. */
export interface ScheduledTask {
  readonly kind: "task";
  readonly name: string;
  readonly interval?: number;
  readonly cron?: CronExpression;
  readonly runOnStart: boolean;
  readonly run: (client: SpearClient) => Awaitable<void>;
}

/** Define a scheduled task. Throws if neither `cron` nor `interval` is given. */
export function task(config: TaskConfig): ScheduledTask {
  if (config.cron === undefined && config.interval === undefined) {
    throw new Error(`spearkit: task "${config.name}" needs a cron expression or an interval`);
  }
  if (config.interval !== undefined && config.interval <= 0) {
    throw new Error(`spearkit: task "${config.name}" interval must be positive`);
  }
  return {
    kind: "task",
    name: config.name,
    interval: config.interval,
    cron: config.cron !== undefined ? new CronExpression(config.cron) : undefined,
    runOnStart: config.runOnStart ?? false,
    run: config.run,
  };
}

const MAX_TIMEOUT = 2_147_483_647;

/**
 * Runs {@link ScheduledTask}s. The client owns one as `client.scheduler`,
 * starts it on `clientReady` and stops it on `destroy`. Tasks added while
 * running are scheduled immediately.
 */
export class TaskScheduler {
  private readonly tasks = new Map<string, ScheduledTask>();
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();
  private running = false;
  private client?: SpearClient;
  private logger?: Logger;
  private readonly reconcilers: { name: string; run: (client: SpearClient) => Awaitable<void> }[] = [];

  /** Number of registered tasks. */
  get size(): number {
    return this.tasks.size;
  }

  /** Whether the scheduler is currently running. */
  get active(): boolean {
    return this.running;
  }

  /** Every registered task. */
  list(): ScheduledTask[] {
    return [...this.tasks.values()];
  }

  /** Attach a logger for task error reporting. */
  setLogger(logger: Logger): this {
    this.logger = logger;
    return this;
  }

  /** Register one or more tasks. If already running, they are scheduled now. */
  add(...tasks: ScheduledTask[]): this {
    for (const task of tasks) {
      this.tasks.set(task.name, task);
      if (this.running) this.begin(task);
    }
    return this;
  }

  /** Remove a task and cancel its timer. */
  remove(name: string): boolean {
    this.cancel(name);
    return this.tasks.delete(name);
  }

  /**
   * Schedule a one-shot job: run `fn` once after `ms` milliseconds, then forget.
   * Returns a cancel handle. Replaces hand-rolled `setTimeout` calls for things
   * like "remind the moderator in 10 minutes if no claim happened".
   */
  delay(name: string, ms: number, fn: () => Awaitable<void>): { cancel: () => boolean } {
    const key = `delay:${name}`;
    this.cancel(key);
    const timer = setTimeout(async () => {
      this.timers.delete(key);
      try {
        await fn();
      } catch (error) {
        this.logger?.error(`delay "${name}" failed`, { error: toError(error) });
      }
    }, Math.max(0, ms));
    if (typeof timer.unref === "function") timer.unref();
    this.timers.set(key, timer);
    return {
      cancel: () => {
        const had = this.timers.has(key);
        this.cancel(key);
        return had;
      },
    };
  }

  /**
   * Schedule a series of follow-up fires from a single start point. Each
   * delay is measured from "now"; the callback receives the index of the
   * fire. Generalises the 10s/30s/60s retry pattern in real bots.
   */
  followUp(
    name: string,
    delays: readonly number[],
    fn: (index: number) => Awaitable<void>,
  ): { cancel: () => boolean } {
    const keys = delays.map((_, i) => `followUp:${name}:${i}`);
    for (const key of keys) this.cancel(key);
    delays.forEach((delay, i) => {
      const key = keys[i] as string;
      const timer = setTimeout(async () => {
        this.timers.delete(key);
        try {
          await fn(i);
        } catch (error) {
          this.logger?.error(`followUp "${name}" fire ${i} failed`, { error: toError(error) });
        }
      }, Math.max(0, delay));
      if (typeof timer.unref === "function") timer.unref();
      this.timers.set(key, timer);
    });
    return {
      cancel: () => {
        let any = false;
        for (const key of keys) {
          if (this.timers.has(key)) any = true;
          this.cancel(key);
        }
        return any;
      },
    };
  }

  /**
   * Register a once-on-ready reconciler — runs the first time the scheduler
   * starts (typically when the client becomes ready) and never again. Use
   * for restart-recovery work like closing orphaned voice sessions or
   * reapplying cached channel state.
   */
  reconcile(name: string, fn: (client: SpearClient) => Awaitable<void>): void {
    if (this.running && this.client !== undefined) {
      void this.runReconciler(name, fn, this.client);
    } else {
      this.reconcilers.push({ name, run: fn });
    }
  }

  private async runReconciler(
    name: string,
    run: (client: SpearClient) => Awaitable<void>,
    client: SpearClient,
  ): Promise<void> {
    this.logger?.debug("reconcile", { data: { name } });
    try {
      await run(client);
    } catch (error) {
      this.logger?.error(`reconciler "${name}" failed`, { error: toError(error) });
    }
  }

  /** Start every task. Safe to call once; later calls are ignored. */
  start(client: SpearClient): void {
    if (this.running) return;
    this.client = client;
    this.running = true;
    for (const task of this.tasks.values()) this.begin(task);
    const pending = this.reconcilers.splice(0);
    for (const { name, run } of pending) void this.runReconciler(name, run, client);
  }

  /** Stop the scheduler and cancel every pending timer. */
  stop(): void {
    this.running = false;
    for (const name of [...this.timers.keys()]) this.cancel(name);
  }

  private cancel(name: string): void {
    const timer = this.timers.get(name);
    if (timer !== undefined) {
      clearTimeout(timer);
      this.timers.delete(name);
    }
  }

  private begin(task: ScheduledTask): void {
    if (task.runOnStart) void this.runTask(task);
    this.scheduleNext(task);
  }

  private delayFor(task: ScheduledTask): number {
    if (task.interval !== undefined) return task.interval;
    if (task.cron !== undefined) return Math.max(0, task.cron.next().getTime() - Date.now());
    return MAX_TIMEOUT;
  }

  private scheduleNext(task: ScheduledTask): void {
    if (!this.running) return;
    this.arm(task.name, this.delayFor(task), () => {
      void this.runTask(task);
      this.scheduleNext(task);
    });
  }

  private arm(name: string, delay: number, fire: () => void): void {
    if (delay > MAX_TIMEOUT) {
      // setTimeout caps at ~24.8 days — chain until the remainder fits.
      const timer = setTimeout(() => this.arm(name, delay - MAX_TIMEOUT, fire), MAX_TIMEOUT);
      if (typeof timer.unref === "function") timer.unref();
      this.timers.set(name, timer);
      return;
    }
    const timer = setTimeout(fire, Math.max(0, delay));
    if (typeof timer.unref === "function") timer.unref();
    this.timers.set(name, timer);
  }

  private async runTask(task: ScheduledTask): Promise<void> {
    if (this.client === undefined) return;
    this.logger?.debug("task", { data: { task: task.name } });
    try {
      await task.run(this.client);
    } catch (error) {
      this.logger?.error(`task "${task.name}" failed`, { error: toError(error) });
    }
  }
}
