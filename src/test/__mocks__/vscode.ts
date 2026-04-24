/**
 * Mock do módulo VS Code para testes unitários
 * Fornece simulações das APIs principais usadas pela extensão
 */

import { jest } from '@jest/globals';

export const ExtensionContext = jest.fn();
export const Position = jest.fn((line: number, character: number) => ({
    line,
    character,
    compareTo: jest.fn(),
    translate: jest.fn(),
    with: jest.fn(),
    isEqual: jest.fn(),
    isBefore: jest.fn(),
    isBeforeOrEqual: jest.fn(),
    isAfter: jest.fn(),
    isAfterOrEqual: jest.fn(),
}));

export const Range = jest.fn((start: any, end: any) => ({
    start,
    end,
    contains: jest.fn(),
    intersection: jest.fn(),
    union: jest.fn(),
    isEmpty: false,
    isSingleLine: false,
    with: jest.fn(),
}));

export const Uri = {
    file: jest.fn((path: string) => ({
        scheme: 'file',
        authority: '',
        path,
        query: '',
        fragment: '',
        fsPath: path,
    })),
    parse: jest.fn(),
};

export const Location = jest.fn((uri: any, position: any) => ({
    uri,
    range: { start: position, end: position },
}));

export const MarkdownString = jest.fn((value?: string) => ({
    value: value ?? '',
    isTrusted: false,
    appendText: jest.fn(),
    appendMarkdown: jest.fn(),
    appendCodeblock: jest.fn(),
}));

export const Hover = jest.fn((contents: any, range?: any) => ({
    contents,
    range,
}));

export const TextDocument = {
    fileName: 'test.mkp',
    uri: Uri.file('test.mkp'),
    isUntitled: false,
    languageId: 'maker-project',
    version: 1,
    isDirty: false,
    isClosed: false,
    lineAt: jest.fn(),
    lineCount: 10,
    getText: jest.fn(),
    getWordRangeAtPosition: jest.fn(),
    save: jest.fn(),
    eol: 1,
    offsetAt: jest.fn(),
    positionAt: jest.fn(),
    validateRange: jest.fn(),
    validatePosition: jest.fn(),
};

export const window = {
    showWarningMessage: jest.fn(),
    showErrorMessage: jest.fn(),
    showInformationMessage: jest.fn(),
};

export const workspace = {
    getConfiguration: jest.fn(() => ({
        get: jest.fn((key: string, defaultValue?: any) => defaultValue),
    })),
    workspaceFolders: undefined,
    onDidChangeConfiguration: jest.fn(),
};

export const languages = {
    registerDefinitionProvider: jest.fn(() => ({
        dispose: jest.fn(),
    })),
    registerHoverProvider: jest.fn(() => ({
        dispose: jest.fn(),
    })),
};

export const CancellationToken = {
    isCancellationRequested: false,
    onCancellationRequested: jest.fn(),
};

// DocumentSelector type
export type DocumentSelector = any;

// DefinitionProvider interface
export interface DefinitionProvider {
    provideDefinition: (
        document: any,
        position: any,
        token: any
    ) => Promise<any> | undefined;
}

// HoverProvider interface
export interface HoverProvider {
    provideHover: (
        document: any,
        position: any,
        token: any
    ) => ReturnType<typeof Hover> | undefined;
}
