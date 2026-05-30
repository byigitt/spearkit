/**
 * Typed argument parsing for prefix commands.
 *
 * Real bots reimplement the same mention-or-snowflake / ms-duration /
 * "rest is the reason" parsing in every prefix command (44+ hand-rolled sites
 * is normal). spearkit lets you declare what you want once and receive a
 * typed `ctx.options` shaped exactly like a slash command's.
 *
 * @example
 * ```ts
 * prefixCommand({
 *   name: "mute",
 *   args: (a) => a.snowflake("target").duration("duration").rest("reason"),
 *   run: (ctx) => {
 *     ctx.options.target;    // string (snowflake id)
 *     ctx.options.duration;  // number (ms)
 *     ctx.options.reason;    // string
 *   },
 * });
 * ```
 */
import { parseDuration } from "./format.js";

type Resolved = {
  string: string;
  integer: number;
  number: number;
  boolean: boolean;
  snowflake: string;
  duration: number;
  rest: string;
};

/** A single argument's runtime spec; recorded by {@link PrefixArgsBuilder}. */
export interface PrefixArgSpec {
  readonly name: string;
  readonly kind: keyof Resolved;
  readonly required: boolean;
  readonly defaultValue?: string | number | boolean;
}

/** A failed parse, returned by {@link PrefixArgsParser.parse}. */
export interface PrefixArgError {
  readonly ok: false;
  readonly arg: string;
  readonly reason: string;
}

/** A successful parse, returned by {@link PrefixArgsParser.parse}. */
export interface PrefixArgsOk<T> {
  readonly ok: true;
  readonly values: T;
}

/** The compiled parser produced by {@link PrefixArgsBuilder.compile}. */
export interface PrefixArgsParser<T> {
  readonly specs: readonly PrefixArgSpec[];
  parse(tokens: readonly string[], rest: string): PrefixArgsOk<T> | PrefixArgError;
}

type AddField<TShape, K extends string, T, Req extends boolean> = Req extends true
  ? TShape & { [P in K]: T }
  : TShape & { [P in K]?: T };

const SNOWFLAKE_RE = /^\d{15,21}$/;
const USER_MENTION_RE = /^<@!?(\d{15,21})>$/;
const CHANNEL_MENTION_RE = /^<#(\d{15,21})>$/;
const ROLE_MENTION_RE = /^<@&(\d{15,21})>$/;

function extractSnowflake(input: string): string | null {
  if (SNOWFLAKE_RE.test(input)) return input;
  const m = USER_MENTION_RE.exec(input) ?? CHANNEL_MENTION_RE.exec(input) ?? ROLE_MENTION_RE.exec(input);
  return m === null ? null : (m[1] ?? null);
}

interface BaseOpts {
  /** Mark the arg required. Default `false`. */
  required?: boolean;
}

interface StringOpts extends BaseOpts {
  minLength?: number;
  maxLength?: number;
  /** Default value when the token is missing. Makes the arg effectively optional. */
  default?: string;
}

interface NumericOpts extends BaseOpts {
  minValue?: number;
  maxValue?: number;
  default?: number;
}

interface BooleanOpts extends BaseOpts {
  default?: boolean;
}

interface RestOpts extends BaseOpts {
  default?: string;
}

/**
 * Build a typed argument schema for {@link prefixCommand}. Chain calls
 * positionally — first token → first arg, second → second arg, etc.
 */
export class PrefixArgsBuilder<TShape extends Record<string, unknown> = {}> {
  private readonly specs: readonly PrefixArgSpec[];

  /** @internal */
  constructor(specs: readonly PrefixArgSpec[] = []) {
    this.specs = specs;
  }

  /** A raw string token. */
  string<K extends string, Req extends boolean = false>(
    name: K,
    options?: StringOpts & { required?: Req },
  ): PrefixArgsBuilder<AddField<TShape, K, string, Req>> {
    return this.push({ name, kind: "string", required: options?.required ?? false, defaultValue: options?.default });
  }

  /** A whole integer. */
  integer<K extends string, Req extends boolean = false>(
    name: K,
    options?: NumericOpts & { required?: Req },
  ): PrefixArgsBuilder<AddField<TShape, K, number, Req>> {
    return this.push({ name, kind: "integer", required: options?.required ?? false, defaultValue: options?.default });
  }

  /** A floating-point number. */
  number<K extends string, Req extends boolean = false>(
    name: K,
    options?: NumericOpts & { required?: Req },
  ): PrefixArgsBuilder<AddField<TShape, K, number, Req>> {
    return this.push({ name, kind: "number", required: options?.required ?? false, defaultValue: options?.default });
  }

  /** A boolean (`true`/`yes`/`1`/`on` vs `false`/`no`/`0`/`off`). */
  boolean<K extends string, Req extends boolean = false>(
    name: K,
    options?: BooleanOpts & { required?: Req },
  ): PrefixArgsBuilder<AddField<TShape, K, boolean, Req>> {
    return this.push({ name, kind: "boolean", required: options?.required ?? false, defaultValue: options?.default });
  }

  /** A Discord snowflake id — accepts raw ids and `<@u>` / `<#c>` / `<@&r>` mentions. */
  snowflake<K extends string, Req extends boolean = false>(
    name: K,
    options?: BaseOpts & { required?: Req; default?: string },
  ): PrefixArgsBuilder<AddField<TShape, K, string, Req>> {
    return this.push({ name, kind: "snowflake", required: options?.required ?? false, defaultValue: options?.default });
  }

  /** A duration like `"1h30m"` or `"1 saat"` parsed to milliseconds. */
  duration<K extends string, Req extends boolean = false>(
    name: K,
    options?: BaseOpts & { required?: Req; default?: number },
  ): PrefixArgsBuilder<AddField<TShape, K, number, Req>> {
    return this.push({ name, kind: "duration", required: options?.required ?? false, defaultValue: options?.default });
  }

  /** The remainder of the message (everything after previous args). */
  rest<K extends string, Req extends boolean = false>(
    name: K,
    options?: RestOpts & { required?: Req },
  ): PrefixArgsBuilder<AddField<TShape, K, string, Req>> {
    return this.push({ name, kind: "rest", required: options?.required ?? false, defaultValue: options?.default });
  }

  private push<TNew extends Record<string, unknown>>(spec: PrefixArgSpec): PrefixArgsBuilder<TNew> {
    return new PrefixArgsBuilder<TNew>([...this.specs, spec]);
  }

  /** Compile this builder into a parser. */
  compile(): PrefixArgsParser<TShape> {
    const specs = this.specs;
    return {
      specs,
      parse(tokens, rest) {
        const out: Record<string, string | number | boolean | undefined> = {};
        let idx = 0;
        for (let i = 0; i < specs.length; i++) {
          const spec = specs[i] as PrefixArgSpec;
          if (spec.kind === "rest") {
            const tail = idx === 0 ? rest : tokens.slice(idx).join(" ");
            if (tail.length === 0) {
              if (spec.required) return { ok: false, arg: spec.name, reason: `missing required argument "${spec.name}"` };
              out[spec.name] = spec.defaultValue as string | undefined;
            } else {
              out[spec.name] = tail;
            }
            idx = tokens.length;
            continue;
          }
          const token = tokens[idx];
          if (token === undefined) {
            if (spec.required) {
              return { ok: false, arg: spec.name, reason: `missing required argument "${spec.name}"` };
            }
            out[spec.name] = spec.defaultValue;
            continue;
          }
          const parsed = coerce(spec, token);
          if (parsed.ok === false) return { ok: false, arg: spec.name, reason: parsed.reason };
          out[spec.name] = parsed.value;
          idx += 1;
        }
        return { ok: true, values: out as TShape };
      },
    };
  }
}

function coerce(
  spec: PrefixArgSpec,
  token: string,
): { ok: true; value: string | number | boolean } | { ok: false; reason: string } {
  switch (spec.kind) {
    case "string":
      return { ok: true, value: token };
    case "integer": {
      const n = Number(token);
      if (!Number.isInteger(n)) return { ok: false, reason: `"${token}" is not an integer` };
      return { ok: true, value: n };
    }
    case "number": {
      const n = Number(token);
      if (!Number.isFinite(n)) return { ok: false, reason: `"${token}" is not a number` };
      return { ok: true, value: n };
    }
    case "boolean": {
      const low = token.toLowerCase();
      if (["true", "1", "yes", "on"].includes(low)) return { ok: true, value: true };
      if (["false", "0", "no", "off"].includes(low)) return { ok: true, value: false };
      return { ok: false, reason: `"${token}" is not a boolean` };
    }
    case "snowflake": {
      const id = extractSnowflake(token);
      if (id === null) return { ok: false, reason: `"${token}" is not a snowflake or mention` };
      return { ok: true, value: id };
    }
    case "duration": {
      const ms = parseDuration(token);
      if (ms === null) return { ok: false, reason: `"${token}" is not a duration` };
      return { ok: true, value: ms };
    }
    default:
      return { ok: false, reason: `unknown arg kind for "${spec.name}"` };
  }
}

/** Start a fresh args builder. Pass to `prefixCommand({ args })`. */
export function prefixArgs(): PrefixArgsBuilder<{}> {
  return new PrefixArgsBuilder();
}
