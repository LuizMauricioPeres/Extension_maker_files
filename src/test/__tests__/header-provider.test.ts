/**
 * Testes do Header Definition Provider
 * Testa navegação em arquivos .mkh
 */

describe('MAKER Header Definition Provider', () => {
    describe('Padrão SOURCE', () => {
        test('deve extrair SOURCE de comentário de header', () => {
            const line = '; SOURCE : ./modulo.prg';
            const match = line.match(/^;\s*SOURCE\s*:\s*([^\s]+\.prg)/i);

            expect(match).not.toBeNull();
            expect(match?.[1]).toBe('./modulo.prg');
        });

        test('deve extrair SOURCE com caminho relativo', () => {
            const line = '; SOURCE : src/helpers.prg';
            const match = line.match(/^;\s*SOURCE\s*:\s*([^\s]+\.prg)/i);

            expect(match).not.toBeNull();
            expect(match?.[1]).toBe('src/helpers.prg');
        });

        test('deve extrair SOURCE case-insensitive', () => {
            const line = '; source : arquivo.prg';
            const match = line.match(/^;\s*SOURCE\s*:\s*([^\s]+\.prg)/i);

            expect(match).not.toBeNull();
            expect(match?.[1]).toBe('arquivo.prg');
        });
    });

    describe('Coordenadas', () => {
        test('deve extrair coordenada [Linha:N, Coluna:N]', () => {
            const token = '[Linha:42, Coluna:15]';
            const match = token.match(/\[Linha:(\d+),\s*Coluna:(\d+)\]/);

            expect(match).not.toBeNull();
            expect(match?.[1]).toBe('42');
            expect(match?.[2]).toBe('15');
        });

        test('deve fazer parse de múltiplas coordenadas', () => {
            const line = '[+] myfunc [Linha:10, Coluna:5] [Linha:20, Coluna:8]';
            const matches = line.match(/\[Linha:(\d+),\s*Coluna:(\d+)\]/g);

            expect(matches).not.toBeNull();
            expect(matches?.length).toBe(2);
        });

        test('deve extrair primeira coordenada de linha', () => {
            const line = '[+] symbol [Linha:100, Coluna:25] [Linha:200, Coluna:30]';
            const match = line.match(/\[Linha:(\d+),\s*Coluna:(\d+)\]/);

            expect(match).not.toBeNull();
            expect(match?.[1]).toBe('100');
            expect(match?.[2]).toBe('25');
        });
    });

    describe('Padrão USAGE', () => {
        test('deve reconhecer linha de USAGE [+] SIMBOLO', () => {
            const line = '[+] myfunc [Linha:10, Coluna:5]';
            const match = line.match(/^\[\+\]\s+([A-Za-z0-9_]+)/);

            expect(match).not.toBeNull();
            expect(match?.[1]).toBe('myfunc');
        });

        test('deve reconhecer múltiplas linhas de USAGE', () => {
            const lines = [
                '[+] func1 [Linha:1, Coluna:1]',
                '[+] func2 [Linha:2, Coluna:2]',
                '[+] func3 [Linha:3, Coluna:3]',
            ];

            lines.forEach(line => {
                const match = line.match(/^\[\+\]\s+([A-Za-z0-9_]+)/);
                expect(match).not.toBeNull();
            });
        });

        test('deve ignorar linhas que não são USAGE', () => {
            const line = '[-] func1 [Linha:1, Coluna:1]';
            const match = line.match(/^\[\+\]\s+([A-Za-z0-9_]+)/);

            expect(match).toBeNull();
        });
    });

    describe('Conversão de Posição', () => {
        test('deve converter Linha 1-based para Position 0-based', () => {
            const linha = 42;
            const position = Math.max(0, linha - 1);

            expect(position).toBe(41);
        });

        test('deve converter Coluna 1-based para Position 0-based', () => {
            const coluna = 15;
            const character = Math.max(0, coluna - 1);

            expect(character).toBe(14);
        });

        test('deve manter linha 0 quando for 1', () => {
            const linha = 1;
            const position = Math.max(0, linha - 1);

            expect(position).toBe(0);
        });

        test('deve manter coluna 0 quando for 1', () => {
            const coluna = 1;
            const character = Math.max(0, coluna - 1);

            expect(character).toBe(0);
        });
    });

    describe('Extração de SOURCE de Header', () => {
        test('deve extrair SOURCE da primeira linha', () => {
            const lines = [
                '; SOURCE : arquivo.prg',
                '[USAGES]',
                '[+] func1',
            ];

            const sourceMatch = lines[0].match(/^;\s*SOURCE\s*:\s*([^\s]+)/i);
            expect(sourceMatch?.[1]).toBe('arquivo.prg');
        });

        test('deve buscar SOURCE nas primeiras N linhas', () => {
            const lines = [
                '; Copyright',
                '; DEUS É FIEL',
                '; SOURCE : modulo.prg',
                '[USAGES]',
            ];

            let found = false;
            for (let i = 0; i < Math.min(15, lines.length); i++) {
                const m = lines[i].match(/^;\s*SOURCE\s*:\s*([^\s]+)/i);
                if (m) {
                    found = true;
                    expect(m[1]).toBe('modulo.prg');
                    break;
                }
            }
            expect(found).toBe(true);
        });
    });
});
