import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: { // TODO: There probably is an automatic way to do this, but I have not found it yet...
      "@/images": path.resolve(__dirname, "./src/actions/images"),
      "@/actions": path.resolve(__dirname, "./src/actions"),
      "@/prisma": path.resolve(__dirname, "./src/prisma"),
      "@/cms": path.resolve(__dirname, "./src/server/cms"),
      "@/server": path.resolve(__dirname, "./src/server"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/jwt": path.resolve(__dirname, "./src/jwt"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
})