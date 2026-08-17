/** @jest-config-loader esbuild-register */

import nextJest from 'next/jest.js'
import type { Config } from 'jest'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: './tests/PrismaTestEnvironment.ts',
    setupFilesAfterEnv: ['./tests/setup.ts', './tests/cleanup.ts'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    coverageReporters: ['text-summary'],
    // Each suite's beforeAll re-seeds all standard images through sharp/avif, which is CPU-heavy.
    // Running many suites' seeds concurrently starves CI's limited cores and blows past the 30s
    // beforeAll timeout in tests/setup.ts, even though a single seed() run only takes a few seconds.
    maxWorkers: process.env.CI ? 2 : undefined,
    moduleNameMapper: {
        // This is needed becaue jest doesn't handle the this code is inside node_modules
        '^@/prisma-dobbel-omega/(.*)$': '<rootDir>/node_modules/.prisma-dobbel-omega/$1',
    },
}

export default async function jestConfig() {
    const base = await createJestConfig(config)()
    return {
        ...base,
        transformIgnorePatterns: [], // This needed to transform node_module from es6 syntax, to a syntax jest can handle
    }
}
