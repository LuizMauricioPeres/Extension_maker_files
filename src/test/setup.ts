/**
 * Configuração para testes de integração com VS Code
 * Execute com: npm run test:integration
 */

import * as path from 'path';
import * as fs from 'fs';

/**
 * Setup para testes que precisam interagir com o sistema de arquivos
 */
export const setupTestEnvironment = () => {
    // Criar diretório temporário para testes
    const testDir = path.join(__dirname, '.test-temp');
    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
    }
    return testDir;
};

/**
 * Limpar ambiente após testes
 */
export const cleanupTestEnvironment = (testDir: string) => {
    if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
    }
};

/**
 * Criar arquivo de teste temporário
 */
export const createTestFile = (testDir: string, filename: string, content: string): string => {
    const filePath = path.join(testDir, filename);
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    return filePath;
};

/**
 * Dados de teste para projeto MAKER típico
 */
export const testData = {
    projectMkp: `# ============================================================
# DEUS É FIEL
# ============================================================
# Projeto : TestProject
# ============================================================

inherit base.mkc

--projecttype=lib
--projectname=TestProject
--outputdir=./build

[SOURCES]
modulo1.prg
utils/helpers.prg
?[DEBUG]debug_helper.c:

[END]
`,
    configMkc: `# Configuração Base
--cflags=-O2
--includedir=/usr/include
--libdir=/usr/lib
`,
    sourcePrg: `// Arquivo fonte MAKER
FUNCTION Main()
    ? "Hello from MAKER"
RETURN 0
`,
    headerMkh: `; ============================================================
; DEUS É FIEL
; ============================================================
; Arquivo : modulo1.mkh
; SOURCE : ./modulo1.prg
; ============================================================

[DEFINITIONS]
[+] Main [Linha:1, Coluna:10]
[+] Helper [Linha:5, Coluna:10]

[USAGES]
[+] Main [Linha:1, Coluna:10]
[+] Helper [Linha:5, Coluna:10] [Linha:20, Coluna:5]
`,
};

/**
 * Mocks para ExtensionContext
 */
export const createMockExtensionContext = () => ({
    subscriptions: [],
    workspaceState: {
        get: jest.fn(),
        update: jest.fn(),
    },
    globalState: {
        get: jest.fn(),
        update: jest.fn(),
    },
    extensionPath: '/mock/extension',
    extensionUri: { fsPath: '/mock/extension' },
    logPath: '/mock/log',
    logUri: { fsPath: '/mock/log' },
    storageUri: { fsPath: '/mock/storage' },
    storagePath: '/mock/storage',
    globalStorageUri: { fsPath: '/mock/global-storage' },
    globalStoragePath: '/mock/global-storage',
    asAbsolutePath: jest.fn((p: string) => path.resolve('/mock/extension', p)),
});
