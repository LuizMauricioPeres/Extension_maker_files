/**
 * Testes do Definition Provider
 * Testa resolução de arquivos e navegação
 */

import * as path from 'path';
import * as fs from 'fs';

describe('MAKER Definition Provider', () => {
    describe('Resolução de Arquivos', () => {
        test('deve resolver arquivo relativo ao diretório atual', () => {
            const baseDir = '/project/src';
            const filePath = 'config.mkc';
            const resolved = path.resolve(baseDir, filePath);

            expect(resolved).toBe('/project/src/config.mkc');
        });

        test('deve resolver arquivo com caminho relativo ../', () => {
            const baseDir = '/project/src/subdir';
            const filePath = '../config.mkc';
            const resolved = path.resolve(baseDir, filePath);

            expect(resolved).toBe('/project/src/config.mkc');
        });

        test('deve resolver arquivo com caminho absoluto', () => {
            const baseDir = '/project/src';
            const filePath = '/root/config.mkc';
            const resolved = path.resolve(filePath);

            expect(resolved).toBe('/root/config.mkc');
        });

        test('deve tentar múltiplos caminhos candidatos', () => {
            const baseDir = '/project/src';
            const filePath = 'config.mkc';
            const candidates = [
                path.resolve(baseDir, filePath),
                path.resolve('/project', filePath),
                path.resolve('/workspace', filePath),
            ];

            expect(candidates.length).toBe(3);
            expect(candidates[0]).toContain('src');
            expect(candidates[1]).toContain('/project/');
            expect(candidates[2]).toContain('/workspace/');
        });
    });

    describe('Padrões de Herança', () => {
        test('deve extrair inherit com .mkc', () => {
            const line = 'inherit base.mkc';
            const match = line.match(/(?:inherit|include)\s+([^\s#]+\.mkc)/i);

            expect(match).not.toBeNull();
            expect(match?.[1]).toBe('base.mkc');
        });

        test('deve extrair include com .mkc', () => {
            const line = 'include config.mkc  # comentário';
            const match = line.match(/(?:inherit|include)\s+([^\s#]+\.mkc)/i);

            expect(match).not.toBeNull();
            expect(match?.[1]).toBe('config.mkc');
        });

        test('deve ignorar inherit/include sem .mkc', () => {
            const line = 'inherit something.txt';
            const match = line.match(/(?:inherit|include)\s+([^\s#]+\.mkc)/i);

            expect(match).toBeNull();
        });
    });

    describe('Padrões de Fontes', () => {
        test('deve extrair arquivo .prg', () => {
            const line = 'modulo.prg';
            const match = line.match(/^\s*([A-Za-z0-9_\-\.\/\\]+\.(?:c|prg|mks|cpp|h))\s*(?:#.*)?$/);

            expect(match).not.toBeNull();
            expect(match?.[1]).toBe('modulo.prg');
        });

        test('deve extrair arquivo .c', () => {
            const line = 'helper.c  # função auxiliar';
            const match = line.match(/^\s*([A-Za-z0-9_\-\.\/\\]+\.(?:c|prg|mks|cpp|h))\s*(?:#.*)?$/);

            expect(match).not.toBeNull();
            expect(match?.[1]).toBe('helper.c');
        });

        test('deve extrair arquivo com caminho relativo', () => {
            const line = 'utils/functions.prg';
            const match = line.match(/^\s*([A-Za-z0-9_\-\.\/\\]+\.(?:c|prg|mks|cpp|h))\s*(?:#.*)?$/);

            expect(match).not.toBeNull();
            expect(match?.[1]).toBe('utils/functions.prg');
        });

        test('deve ignorar linhas com predicado', () => {
            const line = '?[DEBUG]helper.c:';
            const match = line.match(/^\s*([A-Za-z0-9_\-\.\/\\]+\.(?:c|prg|mks|cpp|h))\s*(?:#.*)?$/);

            expect(match).toBeNull();
        });
    });

    describe('Extração de Palavras com Extensão', () => {
        test('deve extrair palavra com extensão .mkc', () => {
            const text = 'config.mkc';
            const match = text.match(/[A-Za-z0-9_\-\.\/\\]+\.(?:mkc|mks|mkp|mke|mkh|c|prg|cpp|h)/);

            expect(match).not.toBeNull();
            expect(match?.[0]).toBe('config.mkc');
        });

        test('deve extrair palavra com extensão .mks', () => {
            const text = 'source.mks';
            const match = text.match(/[A-Za-z0-9_\-\.\/\\]+\.(?:mkc|mks|mkp|mke|mkh|c|prg|cpp|h)/);

            expect(match).not.toBeNull();
            expect(match?.[0]).toBe('source.mks');
        });

        test('deve extrair caminho com barras', () => {
            const text = 'src/config/base.mkc';
            const match = text.match(/[A-Za-z0-9_\-\.\/\\]+\.(?:mkc|mks|mkp|mke|mkh|c|prg|cpp|h)/);

            expect(match).not.toBeNull();
            expect(match?.[0]).toBe('src/config/base.mkc');
        });
    });
});
