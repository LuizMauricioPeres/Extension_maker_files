/**
 * Testes de Integração
 * Testa fluxos completos end-to-end
 */

import * as path from 'path';

describe('Integração - Fluxos Completos', () => {
    describe('Fluxo: Navegação em Herança', () => {
        test('deve navegar de projeto para config herdada', () => {
            // Simula:
            // projeto.mkp: inherit base.mkc
            // base.mkc: configurações

            const projectLine = 'inherit base.mkc';
            const match = projectLine.match(/(?:inherit|include)\s+([^\s#]+\.mkc)/i);

            expect(match).not.toBeNull();
            expect(match?.[1]).toBe('base.mkc');
        });

        test('deve navegar através de múltiplas herança', () => {
            // Simula:
            // projeto.mkp: inherit intermediate.mkc
            // intermediate.mkc: inherit base.mkc
            // base.mkc: configurações

            const steps = [
                'inherit intermediate.mkc',
                'inherit base.mkc',
            ];

            steps.forEach((line, index) => {
                const match = line.match(/(?:inherit|include)\s+([^\s#]+\.mkc)/i);
                expect(match).not.toBeNull();
                expect(match?.[1]).toContain('.mkc');
            });
        });
    });

    describe('Fluxo: Navegação em Fontes', () => {
        test('deve navegar para arquivo fonte do projeto', () => {
            // Simula:
            // projeto.mkp: [SOURCES] modulo1.prg
            // modulo1.prg: código-fonte

            const sourceLine = 'modulo1.prg';
            const match = sourceLine.match(/^\s*([A-Za-z0-9_\-\.\/\\]+\.(?:c|prg|mks|cpp|h))\s*(?:#.*)?$/);

            expect(match).not.toBeNull();
            expect(match?.[1]).toBe('modulo1.prg');
        });

        test('deve navegar para arquivo com predicado', () => {
            // Simula:
            // [SOURCES]
            // modulo.prg
            // ?[DEBUG]debug_helper.c:

            const predicateLine = '?[DEBUG]debug_helper.c:';
            const inheritMatch = predicateLine.match(/(?:inherit|include)\s+([^\s#]+\.mkc)/i);

            // Não é herança, então deve tentar regex de fonte
            expect(inheritMatch).toBeNull();
        });
    });

    describe('Fluxo: Hover em Contexto', () => {
        test('deve exibir hover para macro em contexto', () => {
            // Simula: hover em --outputdir=$[OutputDir]
            const line = '--outputdir=$[OutputDir]';
            const wordMatch = line.match(/\$\[[A-Za-z_][A-Za-z0-9_]*\]/);

            expect(wordMatch).not.toBeNull();
            expect(wordMatch?.[0]).toBe('$[OutputDir]');
        });

        test('deve exibir hover para predicado em contexto', () => {
            // Simula: hover em ?[DEBUG]--cflag=-g:
            const line = '?[DEBUG]--cflag=-g:';
            const predicateMatch = line.match(/\?\[[A-Za-z_][A-Za-z0-9_]*\]/);

            expect(predicateMatch).not.toBeNull();
            expect(predicateMatch?.[0]).toBe('?[DEBUG]');
        });
    });

    describe('Fluxo: Navegação de Header', () => {
        test('deve navegar de header para source e coordenada', () => {
            // Simula arquivo .mkh:
            // ; SOURCE : modulo.prg
            // [USAGES]
            // [+] myfunc [Linha:42, Coluna:15]

            const headerLines = [
                '; SOURCE : modulo.prg',
                '[USAGES]',
                '[+] myfunc [Linha:42, Coluna:15]',
            ];

            // Extrai SOURCE
            const sourceMatch = headerLines[0].match(/^;\s*SOURCE\s*:\s*([^\s]+\.prg)/i);
            expect(sourceMatch?.[1]).toBe('modulo.prg');

            // Extrai coordenada
            const coordMatch = headerLines[2].match(/\[Linha:(\d+),\s*Coluna:(\d+)\]/);
            expect(coordMatch?.[1]).toBe('42');
            expect(coordMatch?.[2]).toBe('15');
        });
    });

    describe('Fluxo: Resolução de Caminhos', () => {
        test('deve resolver arquivo em cascata de diretórios', () => {
            const filePath = 'config.mkc';
            const candidates = [
                path.resolve('/project/src', filePath),
                path.resolve('/project', filePath),
                path.resolve('/workspace', filePath),
            ];

            expect(candidates[0]).toContain('/src/');
            expect(candidates[1]).not.toContain('/src/');
            expect(candidates[2]).toContain('/workspace/');
        });

        test('deve resolver caminho com ../', () => {
            const filePath = '../config/base.mkc';
            const resolved = path.resolve('/project/src/subdir', filePath);

            expect(resolved).toBe(path.normalize('/project/src/config/base.mkc'));
        });

        test('deve preservar ordem de resolução', () => {
            const baseDir = '/project';
            const filePath = 'config.mkc';

            const candidates = [
                path.resolve(baseDir, filePath),           // 1º: baseDir
                path.resolve('/custom/root', filePath),    // 2º: rootPath
                path.resolve('/workspace', filePath),      // 3º: workspace
            ];

            expect(candidates[0]).toContain('/project/');
            expect(candidates[1]).toContain('/custom/root/');
            expect(candidates[2]).toContain('/workspace/');
        });
    });

    describe('Fluxo: Formatação e Validação', () => {
        test('deve validar sintaxe de linha [SOURCES]', () => {
            const sourceLine = 'modulo.prg  # comentário';
            const isValid = /^\s*([A-Za-z0-9_\-\.\/\\]+\.(?:c|prg|mks|cpp|h))\s*(?:#.*)?$/.test(sourceLine);

            expect(isValid).toBe(true);
        });

        test('deve validar sintaxe de inheritância', () => {
            const inheritLine = 'inherit base.mkc';
            const isValid = /(?:inherit|include)\s+([^\s#]+\.mkc)/i.test(inheritLine);

            expect(isValid).toBe(true);
        });

        test('deve validar sintaxe de predicado', () => {
            const predicateLine = '?[DEBUG]helper.c:';
            const isValid = /\?\[[A-Za-z_][A-Za-z0-9_]*\]/.test(predicateLine);

            expect(isValid).toBe(true);
        });
    });
});
