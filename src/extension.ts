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
    const enableProvider = config.get<boolean>('enableDefinitionProvider', true);

    if (enableProvider) {
        // Registra o provider para os três tipos de arquivo MAKER
        const makerSelector: vscode.DocumentSelector = [
            { language: 'maker-project' },
            { language: 'maker-source' },
            { language: 'maker-config' },
            { language: 'maker-rules' }
        ];

        const provider = new MakerDefinitionProvider();
        const disposable = vscode.languages.registerDefinitionProvider(makerSelector, provider);
        context.subscriptions.push(disposable);
        console.log('[MAKER] Definition Provider registrado.');
    }

    // Hover provider para macros e variáveis conhecidas
    const hoverProvider = new MakerHoverProvider();
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            [{ language: 'maker-project' }, { language: 'maker-source' }, { language: 'maker-config' }, { language: 'maker-rules' }],
            hoverProvider
        )
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
            const targetFile = inheritMatch[1];
            const resolved = this.resolveFile(targetFile, currentDir);
            if (resolved) {
                return new vscode.Location(vscode.Uri.file(resolved), new vscode.Position(0, 0));
            } else {
                vscode.window.showWarningMessage(`[MAKER] Arquivo não encontrado: ${targetFile}`);
                return undefined;
            }
        }

        // 2) Arquivos fonte: .c, .prg, .mks — linha simples com nome de arquivo
        const sourceMatch = line.match(/^\s*([A-Za-z0-9_\-\.\/\\]+\.(?:c|prg|mks|cpp|h))\s*(?:#.*)?$/);
        if (sourceMatch) {
            const targetFile = sourceMatch[1];
            const resolved = this.resolveFile(targetFile, currentDir);
            if (resolved) {
                return new vscode.Location(vscode.Uri.file(resolved), new vscode.Position(0, 0));
            } else {
                vscode.window.showWarningMessage(`[MAKER] Fonte não encontrado: ${targetFile}`);
                return undefined;
            }
        }

        // 3) Detecta arquivo sob o cursor (palavra com extensão conhecida)
        const wordRange = document.getWordRangeAtPosition(
            position,
            /[A-Za-z0-9_\-\.\/\\]+\.(?:mkc|mks|mkp|mke|c|prg|cpp|h)/
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

    /**
     * Tenta resolver o caminho do arquivo:
     * 1. Relativo ao diretório do documento atual
     * 2. Relativo ao rootPath configurado
     * 3. Relativo à raiz do workspace
     */
    private resolveFile(filePath: string, baseDir: string): string | undefined {
        const candidates: string[] = [
            path.resolve(baseDir, filePath),
        ];

        // rootPath configurado pelo usuário
        const config = vscode.workspace.getConfiguration('maker');
        const rootPath = config.get<string>('rootPath', '');
        if (rootPath) {
            candidates.push(path.resolve(rootPath, filePath));
        }

        // Raiz do workspace
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            for (const folder of workspaceFolders) {
                candidates.push(path.resolve(folder.uri.fsPath, filePath));
            }
        }

        for (const candidate of candidates) {
            if (fs.existsSync(candidate)) {
                return candidate;
            }
        }

        return undefined;
    }
}

// ============================================================
// MAKER Hover Provider
// Exibe tooltip para macros $[...] e variáveis @...
// ============================================================
class MakerHoverProvider implements vscode.HoverProvider {

    // Macros conhecidas com suas descrições
    private readonly macroDescriptions: Record<string, string> = {
        'SourceFile'    : 'Caminho completo do arquivo fonte atual sendo compilado.',
        'OBJFile'       : 'Caminho do arquivo objeto (.o) gerado para o fonte atual.',
        'OBJFileList'   : 'Lista de todos os arquivos objeto do projeto.',
        'OutputDir'     : 'Diretório de saída definido para o projeto.',
        'ProjectName'   : 'Nome do projeto definido em --projectname.',
        'OutputName'    : 'Nome do binário de saída definido em --outputname.',
        'BuildMode'     : 'Modo de build atual (DEBUG ou RELEASE).',
        'Date'          : 'Data atual no momento do build.',
        'Time'          : 'Hora atual no momento do build.',
    };

    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken
    ): vscode.Hover | undefined {

        // Hover em macro $[NomeDaMacro]
        const macroRange = document.getWordRangeAtPosition(position, /\$\[[A-Za-z_][A-Za-z0-9_]*\]/);
        if (macroRange) {
            const macroText = document.getText(macroRange);
            const macroName = macroText.replace(/^\$\[|\]$/g, '');
            const desc = this.macroDescriptions[macroName];
            const content = new vscode.MarkdownString();
            content.appendMarkdown(`**MAKER Macro:** \`${macroText}\`\n\n`);
            if (desc) {
                content.appendMarkdown(desc);
            } else {
                content.appendMarkdown('Macro definida pelo usuário ou motor MAKER.');
            }
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
            const cmdHelp = this.getCommandHelp(cmdText);
            const content = new vscode.MarkdownString();
            content.appendMarkdown(`**MAKER Diretiva:** \`${cmdText}\`\n\n`);
            content.appendMarkdown(cmdHelp);
            return new vscode.Hover(content, cmdRange);
        }

        return undefined;
    }

    private getCommandHelp(cmd: string): string {
        const helps: Record<string, string> = {
            '--projecttype'   : 'Define o tipo do projeto: `exe` (executável) ou `lib` (biblioteca estática).',
            '--projectname'   : 'Define o nome do projeto usado como base para o binário de saída.',
            '--outputdir'     : 'Define o diretório onde os artefatos de build serão gerados.',
            '--outputname'    : 'Define o nome do arquivo binário de saída.',
            '--cflags'        : 'Flags adicionais passadas ao compilador C/C++.',
            '--harbourflags'  : 'Flags adicionais passadas ao compilador Harbour.',
            '--ldflags'       : 'Flags adicionais passadas ao linker.',
            '--includedir'    : 'Adiciona um diretório ao caminho de busca de headers (#include).',
            '--lib'           : 'Adiciona uma biblioteca ao processo de link.',
            '-I'              : 'Diretório includes para o maker',
            '-L'              : 'Diretório libraies para o maker',
            '-i'              : 'Includes definidas manualmente',
            '-l'              : 'Libraies definidas manualmente',
            
        };
        return helps[cmd] ?? 'Diretiva do motor de build MAKER.';
    }
}
