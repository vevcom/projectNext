import type { FlatConfig } from 'eslint'
import parser from '@typescript-eslint/parser'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import nextPlugin from 'eslint-plugin-next'

const base: FlatConfig[] = [
    // Global ignores
    {
        ignores: ['node_modules/**', '.next/**', 'dist/**'],
    },

    // Base config for JS/TS files
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parser,
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
                project: ['tsconfig.json', 'src/prisma/prismaservice/tsconfig.json'],
                tsconfigRootDir: __dirname,
            },
        },
        plugins: {
            '@typescript-eslint': typescriptPlugin,
            import: importPlugin,
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            'jsx-a11y': jsxA11yPlugin,
            next: nextPlugin,
        },
        settings: {
            'import/resolver': {
                typescript: {
                    project: ['tsconfig.json', 'src/prisma/prismaservice/tsconfig.json'],
                },
            },
            react: { version: 'detect' },
        },
        rules: {
            quotes: ['error', 'single', { avoidEscape: true }],
            semi: ['error', 'never'],
            'eol-last': 'error',
            indent: ['error', 4, { SwitchCase: 1, VariableDeclarator: 1 }],
            'comma-spacing': ['error', { before: false, after: true }],

            'no-var': 'error',
            'prefer-template': 'error',
            'prefer-arrow-callback': 'error',
            'no-const-assign': 'error',

            '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: false, variables: true, typedefs: false }],
            '@typescript-eslint/no-namespace': 'off',

            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/display-name': 'off',

            'import/order': ['warn', { groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']], alphabetize: { order: 'asc', caseInsensitive: true } }],
        },
    },

    // Node / CLI scripts
    {
        files: ['pncli/**', 'scripts/**', 'dev/**', 'bin/**', 'src/prisma/**'],
        languageOptions: {
            env: { node: true },
        },
        rules: {
            'no-console': 'off',
        },
    },

    // Browser / React specific overrides
    {
        files: ['src/app/**', 'src/components/**', 'src/hooks/**', 'src/contexts/**', 'src/pages/**'],
        languageOptions: {
            env: { browser: true },
        },
        rules: {
            'no-undef': 'off',
        },
    },

    // Test files
    {
        files: ['**/*.test.{js,ts,tsx}', 'tests/**'],
        languageOptions: {
            env: { jest: true },
        },
    },
]

export default base
