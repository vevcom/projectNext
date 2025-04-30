import tsconfig from './tsconfig.json'
import nextJest from 'next/jest.js'
import { pathsToModuleNameMapper } from 'ts-jest'
import type { Config } from 'jest'

const createJestConfig = nextJest({ dir: './' })
const tsconfigPaths = pathsToModuleNameMapper(
    tsconfig.compilerOptions.paths,
    { prefix: '<rootDir>/' }
)

const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: './tests/PrismaTestEnvironment.ts',
    setupFilesAfterEnv: ['./tests/setup.ts'],
    transform: {
        '^.+\\.(ts|tsx)$': 'babel-jest'
    }
}

export default async () => {
    const base = createJestConfig(config)
    const ret = {
        ...base,
        moduleNameMapper: tsconfigPaths,
        transformIgnorePatterns: [
            '/node_modules/(?!(unified|remark-parse|remark-rehype|.*\\.mjs$))'
        ],
    }
    console.log(ret)
    return ret
}
