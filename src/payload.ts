/**
 * Short tokens for component custom-ids.
 *
 * Discord caps custom-ids at 100 characters. Put the real payload in a
 * {@link KeyValueStore} and carry only a random token in `{param}` — pagination
 * state, ticket metadata, wizard steps.
 *
 * Tokens are 16 bytes of base64url (~22 chars). Optional `ttlMs` expires
 * unused payloads; `get` deletes expired entries.
 */
import { randomBytes } from "node:crypto";
import { namespaced, type KeyValueStore } from "./store.js";

/** A token → payload map backed by a {@link KeyValueStore}. */
export interface PayloadStore<T> {
  /** Persist `value` and return a short opaque token. */
  put(value: T): Promise<string>;
  /** Resolve `token`, or `undefined` if missing/expired. */
  get(token: string): Promise<T | undefined>;
  /** Drop `token`. Resolves `true` if it existed. */
  delete(token: string): Promise<boolean>;
}

/** Options for {@link createPayloadStore}. */
export interface CreatePayloadStoreOptions {
  /** Backing store. */
  store: KeyValueStore;
  /** Key prefix so several payload maps can share one store. Default `"payload"`. */
  namespace?: string;
  /** Time-to-live in milliseconds. Omit to keep payloads until {@link PayloadStore.delete}. */
  ttlMs?: number;
}

interface Envelope<T> {
  readonly value: T;
  readonly expiresAt?: number;
}

function newToken(): string {
  return randomBytes(16).toString("base64url");
}

/**
 * Build a {@link PayloadStore} over any {@link KeyValueStore}.
 *
 * @example
 * ```ts
 * const tickets = createPayloadStore<{ userId: string; page: number }>({
 *   store: new MemoryStore(),
 * });
 * const token = await tickets.put({ userId: "1", page: 3 });
 * next.build({ token }); // custom-id "page:<token>"
 * ```
 */
export function createPayloadStore<T>(options: CreatePayloadStoreOptions): PayloadStore<T> {
  const store = namespaced(options.store, options.namespace ?? "payload");
  const ttlMs = options.ttlMs;

  return {
    async put(value) {
      const token = newToken();
      const envelope: Envelope<T> = {
        value,
        expiresAt: ttlMs === undefined ? undefined : Date.now() + ttlMs,
      };
      await store.set(token, envelope);
      return token;
    },
    async get(token) {
      const envelope = await store.get<Envelope<T>>(token);
      if (envelope === undefined) return undefined;
      if (envelope.expiresAt !== undefined && envelope.expiresAt <= Date.now()) {
        await store.delete(token);
        return undefined;
      }
      return envelope.value;
    },
    async delete(token) {
      return store.delete(token);
    },
  };
}
