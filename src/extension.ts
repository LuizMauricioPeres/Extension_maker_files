import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// ============================================================
// DEUS É FIEL
// ------------------------------------------------------------
// Extensão : MAKER Language Support
// Arquivo  : extension.ts (entry point)
// ============================================================

export function activate(context: vscode.ExtensionContext) {
    console.log('[MAKER] Extensão MAKER Language Support ativada.');

    const config = vscode.workspace.getConfiguration('maker');

    if (config.get<boolean>('enableDefinitionProvider', true)) {
        const makerSelector: vscode.DocumentSelector = [
            { language: 'maker-project' },
            { language: 'maker-source' },
            { language: 'maker-config' },
            { language: 'maker-rules' }
        ];

        const provider = new MakerDefinitionProvider();
        context.subscriptions.push(
            vscode.languages.registerDefinitionProvider(makerSelector, provider)
        );
        console.log('[MAKER] Definition Provider registrado.');
    }

    if (config.get<boolean>('enableHeaderNavigation', true)) {
        const headerProvider = new MakerHeaderDefinitionProvider();
        context.subscriptions.push(
            vscode.languages.registerDefinitionProvider(
                { language: 'maker-header' },
                headerProvider
            )
        );
        console.log('[MAKER] Header Definition Provider registrado.');
    }

    const hoverSelector: vscode.DocumentSelector = [
        { language: 'maker-project' },
        { language: 'maker-source' },
        { language: 'maker-config' },
        { language: 'maker-rules' }
    ];

    context.subscriptions.push(
        vscode.languages.registerHoverProvider(hoverSelector, new MakerHoverProvider())
    );
    console.log('[MAKER] Hover Provider registrado.');
}

export function deactivate() {
    console.log('[MAKER] Extensão MAKER Language Support desativada.');
}

// ============================================================
// MAKER Definition Provider
// Navega para arquivos .mkc herdados e fontes referenciados
// ============================================================
class MakerDefinitionProvider implements vscode.DefinitionProvider {

    async provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken
    ): Promise<vscode.Definition | undefined> {

        const line = document.lineAt(position).text;
        const currentDir = path.dirname(document.uri.fsPath);

        // 1) Herança: inherit base.mkc  /  include config.mkc
        const inheritMatch = line.match(/(?:inherit|include)\s+([^\s#]+\.mkc)/i);
        if (inheritMatch) {
            const resolved = this.resolveFile(inheritMatch[1], currentDir);
            if (resolved) {
                return new vscode.Location(vscode.Uri.file(resolved), new vscode.Position(0, 0));
            }
            vscode.window.showWarningMessage(`[MAKER] Arquivo não encontrado: ${inheritMatch[1]}`);
            return undefined;
        }

        // 2) Arquivos fonte: .c, .prg, .mks — linha simples com nome de arquivo
        const sourceMatch = line.match(/^\s*([A-Za-z0-9_\-\.\/\\]+\.(?:c|prg|mks|cpp|h))\s*(?:#.*)?$/);
        if (sourceMatch) {
            const resolved = this.resolveFile(sourceMatch[1], currentDir);
            if (resolved) {
                return new vscode.Location(vscode.Uri.file(resolved), new vscode.Position(0, 0));
            }
            vscode.window.showWarningMessage(`[MAKER] Fonte não encontrado: ${sourceMatch[1]}`);
            return undefined;
        }

        // 3) Palavra com extensão conhecida sob o cursor
        const wordRange = document.getWordRangeAtPosition(
            position,
            /[A-Za-z0-9_\-\.\/\\]+\.(?:mkc|mks|mkp|mke|mkh|c|prg|cpp|h)/
        );
        if (wordRange) {
            const word = document.getText(wordRange);
            const resolved = this.resolveFile(word, currentDir);
            if (resolved) {
                return new vscode.Location(vscode.Uri.file(resolved), new vscode.Position(0, 0));
            }
        }

        return undefined;
    }

    private resolveFile(filePath: string, baseDir: string): string | undefined {
        const candidates: string[] = [path.resolve(baseDir, filePath)];

        const config = vscode.workspace.getConfiguration('maker');
        const rootPath = config.get<string>('rootPath', '');
        if (rootPath) {
            candidates.push(path.resolve(rootPath, filePath));
        }

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            for (const folder of workspaceFolders) {
                candidates.push(path.resolve(folder.uri.fsPath, filePath));
            }
        }

        return candidates.find(c => fs.existsSync(c));
    }
}

// ============================================================
// MAKER Header Definition Provider
// Navega para o .prg fonte e para coordenadas em [USAGES]
// ============================================================
class MakerHeaderDefinitionProvider implements vscode.DefinitionProvider {

    async provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken
    ): Promise<vscode.Definition | undefined> {

        const line = document.lineAt(position).text;
        const currentDir = path.dirname(document.uri.fsPath);

        // Navegação para o .prg declarado no header: ; SOURCE : ./arquivo.prg
        const sourceMetaMatch = line.match(/^;\s*SOURCE\s*:\s*([^\s]+\.prg)/i);
        if (sourceMetaMatch) {
            const resolved = this.resolveFile(sourceMetaMatch[1], currentDir);
            if (resolved) {
                return new vscode.Location(vscode.Uri.file(resolved), new vscode.Position(0, 0));
            }
            vscode.window.showWarningMessage(`[MAKER] Fonte não encontrado: ${sourceMetaMatch[1]}`);
            return undefined;
        }

        // Clique em coordenada específica [Linha:N, Coluna:N] — verificado ANTES
        // do fallback por linha, pois uma linha de USAGE pode ter múltiplas coords
        const coordRange = document.getWordRangeAtPosition(
            position,
            /\[Linha:\d+,\s*Coluna:\d+\]/
        );
        if (coordRange) {
            const coordText = document.getText(coordRange);
            const coord = this.parseCoordinate(coordText);
            if (coord) {
                const sourceFile = this.extractSourceFromHeader(document);
                if (sourceFile) {
                    const resolved = this.resolveFile(sourceFile, currentDir);
                    if (resolved) {
                        return new vscode.Location(
                            vscode.Uri.file(resolved),
                            new vscode.Position(
                                Math.max(0, coord.linha - 1),
                                Math.max(0, coord.coluna - 1)
                            )
                        );
                    }
                }
            }
        }

        // Fallback: qualquer clique numa linha [+] SIMBOLO navega para a primeira coord
        const usageLineMatch = line.match(/^\[\+\]\s+([A-Za-z0-9_]+)/);
        if (usageLineMatch) {
            const sourceFile = this.extractSourceFromHeader(document);
            if (sourceFile) {
                const resolved = this.resolveFile(sourceFile, currentDir);
                if (resolved) {
                    const coord = this.extractFirstCoordinate(line);
                    const targetLine = coord ? Math.max(0, coord.linha - 1) : 0;
                    const targetCol  = coord ? Math.max(0, coord.coluna - 1) : 0;
                    return new vscode.Location(
                        vscode.Uri.file(resolved),
                        new vscode.Position(targetLine, targetCol)
                    );
                }
            }
        }

        return undefined;
    }

    // Lê o campo SOURCE do cabeçalho do documento .mkh
    private extractSourceFromHeader(document: vscode.TextDocument): string | undefined {
        for (let i = 0; i < Math.min(15, document.lineCount); i++) {
            const m = document.lineAt(i).text.match(/^;\s*SOURCE\s*:\s*([^\s]+)/i);
            if (m) {
                return m[1];
            }
        }
        return undefined;
    }

    // Extrai a primeira coordenada [Linha:N, Coluna:N] de uma linha
    private extractFirstCoordinate(lineText: string): { linha: number; coluna: number } | undefined {
        const m = lineText.match(/\[Linha:(\d+),\s*Coluna:(\d+)\]/);
        if (m) {
            return { linha: parseInt(m[1], 10), coluna: parseInt(m[2], 10) };
        }
        return undefined;
    }

    // Parseia um token de coordenada isolado
    private parseCoordinate(token: string): { linha: number; coluna: number } | undefined {
        const m = token.match(/\[Linha:(\d+),\s*Coluna:(\d+)\]/);
        if (m) {
            return { linha: parseInt(m[1], 10), coluna: parseInt(m[2], 10) };
        }
        return undefined;
    }

    private resolveFile(filePath: string, baseDir: string): string | undefined {
        const candidates: string[] = [path.resolve(baseDir, filePath)];

        const config = vscode.workspace.getConfiguration('maker');
        const rootPath = config.get<string>('rootPath', '');
        if (rootPath) {
            candidates.push(path.resolve(rootPath, filePath));
        }

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            for (const folder of workspaceFolders) {
                candidates.push(path.resolve(folder.uri.fsPath, filePath));
            }
        }

        return candidates.find(c => fs.existsSync(c));
    }
}

// ============================================================
// MAKER Hover Provider
// Exibe tooltip para macros $[...], variáveis @...,
// diretivas -- e predicados ?[COND]
// ============================================================
class MakerHoverProvider implements vscode.HoverProvider {

    private readonly macroDescriptions: Record<string, string> = {
        'SourceFile'  : 'Caminho completo do arquivo fonte atual sendo compilado.',
        'OBJFile'     : 'Caminho do arquivo objeto (.o) gerado para o fonte atual.',
        'OBJFileList' : 'Lista de todos os arquivos objeto do projeto.',
        'OutputDir'   : 'Diretório de saída definido para o projeto.',
        'ProjectName' : 'Nome do projeto definido em --projectname.',
        'OutputName'  : 'Nome do binário de saída definido em --outputname.',
        'BuildMode'   : 'Modo de build atual (DEBUG ou RELEASE).',
        'Date'        : 'Data atual no momento do build.',
        'Time'        : 'Hora atual no momento do build.',
    };

    private readonly predicateDescriptions: Record<string, string> = {
        'DEBUG'   : 'Build em modo debug: otimizações desabilitadas, símbolos de debug ativos.',
        'RELEASE' : 'Build em modo release: otimizações ativas, sem símbolos de debug.',
        'TEST'    : 'Build em modo de testes automatizados.',
        'PROFILE' : 'Build com profiling habilitado (`-pg -g`).',
        'VERBOSE' : 'Build com saída detalhada ativada.',
    };

    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken
    ): vscode.Hover | undefined {

        // Hover em predicado ?[CONDICAO]
        const predicateRange = document.getWordRangeAtPosition(position, /\?\[[A-Za-z_][A-Za-z0-9_]*\]/);
        if (predicateRange) {
            const predText = document.getText(predicateRange);
            const predName = predText.replace(/^\?\[|\]$/g, '');
            const content = new vscode.MarkdownString();
            content.appendMarkdown(`**MAKER Predicado:** \`${predText}\`\n\n`);
            content.appendMarkdown(this.predicateDescriptions[predName] ?? 'Condição de predicado definida pelo projeto.');
            return new vscode.Hover(content, predicateRange);
        }

        // Hover em macro $[NomeDaMacro]
        const macroRange = document.getWordRangeAtPosition(position, /\$\[[A-Za-z_][A-Za-z0-9_]*\]/);
        if (macroRange) {
            const macroText = document.getText(macroRange);
            const macroName = macroText.replace(/^\$\[|\]$/g, '');
            const content = new vscode.MarkdownString();
            content.appendMarkdown(`**MAKER Macro:** \`${macroText}\`\n\n`);
            content.appendMarkdown(this.macroDescriptions[macroName] ?? 'Macro definida pelo usuário ou motor MAKER.');
            return new vscode.Hover(content, macroRange);
        }

        // Hover em variável @Nome
        const varRange = document.getWordRangeAtPosition(position, /@[A-Za-z_][A-Za-z0-9_]*/);
        if (varRange) {
            const varText = document.getText(varRange);
            const content = new vscode.MarkdownString();
            content.appendMarkdown(`**MAKER Variável:** \`${varText}\`\n\n`);
            content.appendMarkdown('Referência a uma variável de ambiente ou configuração do arquivo `.mkc`.');
            return new vscode.Hover(content, varRange);
        }

        // Hover em comando --
        const cmdRange = document.getWordRangeAtPosition(position, /--[a-z][a-z0-9\-]*/);
        if (cmdRange) {
            const cmdText = document.getText(cmdRange);
            const content = new vscode.MarkdownString();
            content.appendMarkdown(`**MAKER Diretiva:** \`${cmdText}\`\n\n`);
            content.appendMarkdown(this.getCommandHelp(cmdText));
            return new vscode.Hover(content, cmdRange);
        }

        return undefined;
    }

    private getCommandHelp(cmd: string): string {
        const helps: Record<string, string> = {
            '--projecttype'  : 'Define o tipo do projeto: `exe` (executável) ou `lib` (biblioteca estática).',
            '--projectname'  : 'Define o nome do projeto usado como base para o binário de saída.',
            '--outputdir'    : 'Define o diretório onde os artefatos de build serão gerados.',
            '--outputname'   : 'Define o nome do arquivo binário de saída.',
            '--cflags'       : 'Flags adicionais passadas ao compilador C/C++.',
            '--harbourflags' : 'Flags adicionais passadas ao compilador Harbour.',
            '--ldflags'      : 'Flags adicionais passadas ao linker.',
            '--includedir'   : 'Adiciona um diretório ao caminho de busca de headers (#include).',
            '--lib'          : 'Adiciona uma biblioteca ao processo de link.',
            '-I'             : 'Diretório includes para o maker',
            '-L'             : 'Diretório libraries para o maker',
            '-i'             : 'Includes definidas manualmente',
            '-l'             : 'Libraries definidas manualmente',
        };
        return helps[cmd] ?? 'Diretiva do motor de build MAKER.';
    }
}
