import nextJest from 'next/jest.js'
import type { Config } from 'jest'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: './tests/PrismaTestEnvironment.ts',
    setupFilesAfterEnv: ['./tests/setup.ts'],
}

export default async function jestConfig() {
    const base = await createJestConfig(config)()
    return {
        ...base,
        transformIgnorePatterns: [],
    }
}
