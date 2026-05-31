import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    // Examples import from the bare "spearkit" specifier (as a consumer would).
    // Map it to the source entry so the example suite exercises the real API.
    alias: [
      {
        find: /^spearkit$/,
        replacement: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      },
    ],
  },
});
