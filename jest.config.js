/** @type {import('jest').Config} */
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: {
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
            }
        }],
    },
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.test.ts',
        '!src/**/__tests__/**',
        '!**/node_modules/**'
    ],
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 60,
            lines: 60,
            statements: 60
        }
    },
    moduleNameMapper: {
        '^vscode$': '<rootDir>/src/test/__mocks__/vscode.ts'
    }
};

module.exports = config;
