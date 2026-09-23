import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    isolate: false,
    passWithNoTests: true,
    testTimeout: 100,
  },
});
