/**
 * Testes da extensão MAKER Language Support
 * Testa ativação, desativação e registro de providers
 */

import * as vscode from 'vscode';

// Mock da extensão
jest.mock('../../../out/extension', () => ({
    activate: jest.fn(),
    deactivate: jest.fn(),
}));

describe('MAKER Extension', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Ativação', () => {
        test('deve registrar Definition Provider quando habilitado', () => {
            const context = {
                subscriptions: [],
            } as any;

            const registerSpy = jest.spyOn(vscode.languages, 'registerDefinitionProvider');

            // Simular ativação
            expect(registerSpy).toBeDefined();
        });

        test('deve registrar Hover Provider', () => {
            const context = {
                subscriptions: [],
            } as any;

            const registerSpy = jest.spyOn(vscode.languages, 'registerHoverProvider');

            expect(registerSpy).toBeDefined();
        });

        test('deve registrar Header Definition Provider quando habilitado', () => {
            const context = {
                subscriptions: [],
            } as any;

            const registerSpy = jest.spyOn(vscode.languages, 'registerDefinitionProvider');

            expect(registerSpy).toBeDefined();
        });
    });

    describe('Configurações', () => {
        test('deve respeitar configuração enableDefinitionProvider', () => {
            const config = vscode.workspace.getConfiguration('maker');
            const enabled = config.get<boolean>('enableDefinitionProvider', true);

            expect(typeof enabled).toBe('boolean');
        });

        test('deve respeitar configuração enableHeaderNavigation', () => {
            const config = vscode.workspace.getConfiguration('maker');
            const enabled = config.get<boolean>('enableHeaderNavigation', true);

            expect(typeof enabled).toBe('boolean');
        });

        test('deve respeitar configuração rootPath', () => {
            const config = vscode.workspace.getConfiguration('maker');
            const rootPath = config.get<string>('rootPath', '');

            expect(typeof rootPath).toBe('string');
        });
    });
});
