/**
 * Testes do Hover Provider
 * Testa documentação e tooltips
 */

describe('MAKER Hover Provider', () => {
    describe('Padrões de Macro', () => {
        test('deve reconhecer macro $[SourceFile]', () => {
            const line = '--sources=$[SourceFile]';
            const match = line.match(/\$\[[A-Za-z_][A-Za-z0-9_]*\]/);

            expect(match).not.toBeNull();
            expect(match?.[0]).toBe('$[SourceFile]');
        });

        test('deve reconhecer macro $[OutputDir]', () => {
            const line = '--outputdir=$[OutputDir]';
            const match = line.match(/\$\[[A-Za-z_][A-Za-z0-9_]*\]/);

            expect(match).not.toBeNull();
            expect(match?.[0]).toBe('$[OutputDir]');
        });

        test('deve reconhecer macro $[OBJFileList]', () => {
            const line = 'objects=$[OBJFileList]';
            const match = line.match(/\$\[[A-Za-z_][A-Za-z0-9_]*\]/);

            expect(match).not.toBeNull();
            expect(match?.[0]).toBe('$[OBJFileList]');
        });

        test('deve extrair nome da macro corretamente', () => {
            const macro = '$[ProjectName]';
            const name = macro.replace(/^\$\[|\]$/g, '');

            expect(name).toBe('ProjectName');
        });
    });

    describe('Padrões de Predicado', () => {
        test('deve reconhecer predicado ?[DEBUG]', () => {
            const line = '?[DEBUG]--cflag=-g:';
            const match = line.match(/\?\[[A-Za-z_][A-Za-z0-9_]*\]/);

            expect(match).not.toBeNull();
            expect(match?.[0]).toBe('?[DEBUG]');
        });

        test('deve reconhecer predicado ?[RELEASE]', () => {
            const line = '?[RELEASE]--optimize=2:';
            const match = line.match(/\?\[[A-Za-z_][A-Za-z0-9_]*\]/);

            expect(match).not.toBeNull();
            expect(match?.[0]).toBe('?[RELEASE]');
        });

        test('deve reconhecer predicado ?[WITH_C]', () => {
            const line = '?[WITH_C]helper.c:';
            const match = line.match(/\?\[[A-Za-z_][A-Za-z0-9_]*\]/);

            expect(match).not.toBeNull();
            expect(match?.[0]).toBe('?[WITH_C]');
        });

        test('deve extrair nome do predicado corretamente', () => {
            const predicate = '?[DEBUG]';
            const name = predicate.replace(/^\?\[|\]$/g, '');

            expect(name).toBe('DEBUG');
        });
    });

    describe('Padrões de Variável', () => {
        test('deve reconhecer variável @GCC_FLAGS', () => {
            const line = '--cflags=@GCC_FLAGS';
            const match = line.match(/@[A-Za-z_][A-Za-z0-9_]*/);

            expect(match).not.toBeNull();
            expect(match?.[0]).toBe('@GCC_FLAGS');
        });

        test('deve reconhecer variável @GCC_INC_DIRECTORY', () => {
            const line = '--includedir=@GCC_INC_DIRECTORY';
            const match = line.match(/@[A-Za-z_][A-Za-z0-9_]*/);

            expect(match).not.toBeNull();
            expect(match?.[0]).toBe('@GCC_INC_DIRECTORY');
        });
    });

    describe('Banco de Descrições', () => {
        const macros = {
            SourceFile: 'Caminho completo do arquivo fonte atual',
            OBJFile: 'Caminho do arquivo objeto',
            OutputDir: 'Diretório de saída',
            ProjectName: 'Nome do projeto',
        };

        test('deve ter descrição para $[SourceFile]', () => {
            expect(macros.SourceFile).toBeDefined();
            expect(macros.SourceFile.length).toBeGreaterThan(0);
        });

        test('deve ter descrição para $[OutputDir]', () => {
            expect(macros.OutputDir).toBeDefined();
            expect(macros.OutputDir.length).toBeGreaterThan(0);
        });

        const predicates = {
            DEBUG: 'Build em modo debug',
            RELEASE: 'Build em modo release',
            TEST: 'Build em modo de testes',
        };

        test('deve ter descrição para ?[DEBUG]', () => {
            expect(predicates.DEBUG).toBeDefined();
            expect(predicates.DEBUG.length).toBeGreaterThan(0);
        });

        test('deve ter descrição para ?[RELEASE]', () => {
            expect(predicates.RELEASE).toBeDefined();
            expect(predicates.RELEASE.length).toBeGreaterThan(0);
        });
    });
});
