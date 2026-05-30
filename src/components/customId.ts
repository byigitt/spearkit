/**
 * Typed custom-id codec.
 *
 * Patterns follow the grammar `namespace(:{param})*`, e.g. `"vote"` or
 * `"vote:{choice}"` or `"page:{id}:{dir}"`. The `namespace` is the routing key;
 * each `{param}` becomes a positional, percent-escaped value in the encoded id.
 * Param names are recovered at the type level so handlers get a typed `params`
 * object and `build()` requires exactly the right params.
 */

/** Names of the `{param}` placeholders inside a pattern. */
export type ParamNames<S extends string> = S extends `${string}{${infer Name}}${infer Rest}`
  ? Name | ParamNames<Rest>
  : never;

/** The params object a pattern resolves to (every value is a string). */
export type Params<S extends string> = { [K in ParamNames<S>]: string };

/** Arguments `build()` accepts: none when the pattern has no params. */
export type BuildArgs<S extends string> = [ParamNames<S>] extends [never]
  ? []
  : [params: Params<S>];

/** The discord custom-id length limit. */
export const MAX_CUSTOM_ID_LENGTH = 100;

const PARAM_SEGMENT = /^\{([A-Za-z0-9_]+)\}$/;

/** A compiled pattern: its routing namespace and ordered param names. */
export interface CompiledPattern {
  readonly pattern: string;
  readonly namespace: string;
  readonly paramNames: readonly string[];
}

/** Compile and validate a custom-id pattern. Throws on malformed input. */
export function compilePattern(pattern: string): CompiledPattern {
  const segments = pattern.split(":");
  const namespace = segments[0] ?? "";
  if (namespace.length === 0 || /[{}]/.test(namespace)) {
    throw new Error(
      `spear: invalid custom-id pattern "${pattern}". Expected "namespace" or "namespace:{param}".`,
    );
  }
  const paramNames: string[] = [];
  for (let i = 1; i < segments.length; i++) {
    const match = PARAM_SEGMENT.exec(segments[i] ?? "");
    if (match === null) {
      throw new Error(
        `spear: invalid custom-id pattern "${pattern}". Segment "${segments[i]}" must be "{param}".`,
      );
    }
    paramNames.push(match[1] as string);
  }
  return { pattern, namespace, paramNames };
}

function encodeValue(value: string): string {
  return value.replace(/%/g, "%25").replace(/:/g, "%3A");
}

function decodeValue(value: string): string {
  return value.replace(/%3A/g, ":").replace(/%25/g, "%");
}

/** Build a concrete custom-id from a compiled pattern and its params. */
export function buildCustomId(
  compiled: CompiledPattern,
  params: Readonly<Record<string, string>>,
): string {
  const parts = [compiled.namespace];
  for (const name of compiled.paramNames) {
    const value = params[name];
    if (value === undefined) {
      throw new Error(`spear: missing param "${name}" for custom-id "${compiled.pattern}"`);
    }
    parts.push(encodeValue(value));
  }
  const id = parts.join(":");
  if (id.length > MAX_CUSTOM_ID_LENGTH) {
    throw new Error(
      `spear: custom-id "${id}" exceeds the ${MAX_CUSTOM_ID_LENGTH}-character discord limit`,
    );
  }
  return id;
}

/** The namespace + raw values parsed out of an incoming custom-id. */
export interface ParsedCustomId {
  readonly namespace: string;
  readonly values: readonly string[];
}

/** Parse an incoming custom-id into its namespace and decoded values. */
export function parseCustomId(customId: string): ParsedCustomId {
  const segments = customId.split(":");
  const namespace = segments[0] ?? "";
  const values = segments.slice(1).map(decodeValue);
  return { namespace, values };
}

/** Map ordered values onto their param names. */
export function paramsFromValues(
  paramNames: readonly string[],
  values: readonly string[],
): Record<string, string> {
  const params: Record<string, string> = {};
  for (let i = 0; i < paramNames.length; i++) {
    params[paramNames[i] as string] = values[i] ?? "";
  }
  return params;
}
