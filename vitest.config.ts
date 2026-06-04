import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "node",
    pool: "forks",
    poolOptions: { forks: { singleFork: true } },
    testTimeout: 30_000,
    hookTimeout: 120_000,
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    exclude: ["node_modules", "tests/e2e/**", ".next"],
    globalSetup: ["./tests/setup/global.setup.ts"],
    setupFiles: [
      "./tests/setup/env.ts",
      "./tests/setup/mocks.ts",
      "./tests/setup/integration.setup.ts",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: [
        "src/lib/**/*.ts",
        "src/services/**/*.ts",
        "src/models/**/*.ts",
        "src/app/api/**/*.ts",
      ],
    },
  },
});
