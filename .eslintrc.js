module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    plugins: ['@typescript-eslint'],
    env: {
        node: true,
        es2020: true,
    },
    rules: {
        '@typescript-eslint/explicit-function-return-types': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
        'no-console': 'off',
        'indent': ['error', 4],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'],
        'no-trailing-spaces': 'error',
        'eol-last': 'error',
    },
    overrides: [
        {
            files: ['**/*.test.ts', '**/test/**/*.ts'],
            rules: {
                '@typescript-eslint/no-explicit-any': 'off',
            },
        },
    ],
};
