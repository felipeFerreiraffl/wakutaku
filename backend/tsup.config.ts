import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["cjs"],
  target: "node18",
  outDir: "./dist",
  clean: true,
  sourcemap: false,
  minify: false,
  splitting: false,

  // Ignora estas dependências
  external: ["vitest", "msw", "@vitest/coverage-v8"],

  // Ignora arquivos de teste
  esbuildOptions(options) {
    options.external = [
      ...(options.external || []),
      "./src/__tests__",
      "./src/__mocks__",
    ];
  },
});
