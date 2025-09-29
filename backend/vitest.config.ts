import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // Permite funções essenciais sem import (describe, it, test, ...)
    environment: "node",
    testTimeout: 10000, // 10s
    hookTimeout: 15000, // 15s
    coverage: {
      provider: "v8",
      enabled: false, // Ativa com --coverage
      reporter: ["text", "html", "json"], // Tipos de visualização do coverage
      reportsDirectory: "./coverage",

      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.spec.ts",
        "src/types/*.ts",
        "src/**/*.d.ts",
      ],
    },
    setupFiles: ["./src/__tests__"], // Processado antes de cada teste
    pool: "forks", // Isolação dos testes
    poolOptions: {
      forks: {
        singleFork: true, // Todos os testes no mesmo processo
      },
    },

    // Reset automático
    clearMocks: true,
    mockReset: false,
    restoreMocks: false,

    // Renomeação de imports
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tests": path.resolve(__dirname, "./src/__tests__"),
    },
    silent: "passed-only", // Permite console.log() em erros
    reporters: ["default"],
    watch: false, // Roda uma vez e para

    // Ordem de testes
    sequence: {
      shuffle: false, // Evita aleatoriedade
      concurrent: false, // Roda paralelamente para maior velocidade
    },
    include: ["./src/**/*.{test,spec}.ts"],
    exclude: ["**/node_modules/**", "**/dist/**"],
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
