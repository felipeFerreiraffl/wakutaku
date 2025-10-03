import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/server.ts"],
  format: ["cjs"],
  target: "node",
  outDir: "./dist",
  clean: true,
  sourcemap: false,
  minify: false,
  splitting: false,

  // Ignora estas dependências
  external: ["vitest", "msw", "@vitest/coverage-v8"],
});
