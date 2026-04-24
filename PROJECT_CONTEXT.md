# CONTEXTO DO PROJETO - MAKER Language Support

**Data de Geração:** 23 de abril de 2026  
**Status:** Análise Completa

---

## 📋 RESUMO EXECUTIVO

**Projeto:** MAKER Language Support  
**Tipo:** Extensão VS Code  
**Linguagem Principal:** TypeScript  
**Versão:** 1.0.0  
**Publisher:** harbour-tools  

Esta é uma extensão VS Code que fornece suporte completo à linguagem **MAKER**, um motor de build usado em projetos **Harbour/C**.

---

## 🎯 OBJETIVO DO PROJETO

Fornecer aos desenvolvedores Harbour/C uma experiência integrada no VS Code com:
- **Syntax Highlighting** para arquivos MAKER (.mkp, .mkc, .mke, .mkh, .mks)
- **Navegação** inteligente entre arquivos (Ctrl+Click / F12)
- **Snippets** para acelerar a criação de projetos e configurações
- **Hover Provider** com informações contextuais
- **Definition Provider** para resolução de referências

---

## 📦 ESTRUTURA DO PROJETO

```
Extension_maker_files/
├── .git/                              # Repositório Git
├── .vscode/                           # Configurações VS Code
├── src/
│   └── extension.ts                   # Entry point da extensão (TypeScript)
├── syntaxes/
│   ├── maker.tmLanguage.json          # Gramática TextMate para MAKER
│   └── maker-header.tmLanguage.json   # Gramática para arquivos header
├── snippets/
│   └── maker.code-snippets            # Snippets predefinidos
├── examples/
│   ├── base.mkc                       # Arquivo de configuração exemplo
│   └── exemplo.mkp                    # Arquivo de projeto exemplo
├── language-configuration.json        # Config. de linguagem geral
├── language-configuration-mkh.json    # Config. específica para headers
├── package.json                       # Metadados da extensão
├── tsconfig.json                      # Configuração TypeScript
└── README.md                          # Documentação em Markdown
```

---

## 🗂️ DESCRIÇÃO DOS ARQUIVOS PRINCIPAIS

### `package.json`
- **Propósito:** Metadados e configurações da extensão
- **Informações-chave:**
  - VS Code mínimo: ^1.85.0
  - Main entry: `./out/extension.js`
  - Publicador: harbour-tools
  - Repositório: https://github.com/harbour-tools/maker-language-support
  - Categorias: Programming Languages, Snippets

### `src/extension.ts`
- **Propósito:** Lógica principal da extensão
- **Componentes principais:**
  - `MakerDefinitionProvider`: Navega para arquivos .mkc herdados e fontes
  - `MakerHeaderDefinitionProvider`: Navega em arquivos de header
  - `MakerHoverProvider`: Fornece informações ao passar o mouse
  - Regras de resolução de caminhos (relativo, rootPath, workspace)

### `syntaxes/maker.tmLanguage.json`
- **Propósito:** Define a sintaxe e coloração para arquivos MAKER
- **Elementos destacados:**
  - Comentários (#)
  - Seções ([SECAO])
  - Predicados (?[cond]...:)
  - Macros ($[Nome])
  - Variáveis (@Nome)
  - Comandos (--diretiva)

### `language-configuration.json` e `language-configuration-mkh.json`
- **Propósito:** Regras de indentação, parênteses, brackets, etc.
- **Aplicações:** Formatação automática e navegação de código

### `snippets/maker.code-snippets`
- **Propósito:** Templates rápidos para desenvolvimento MAKER
- **Snippets inclusos:**
  - mkp-lib: Projeto biblioteca estática
  - mkp-exe: Projeto executável
  - mkc-base: Arquivo de configuração base
  - mkpred: Bloco de predicado
  - mkmacro: Referência de macro

---

## 💡 TIPOS DE ARQUIVO SUPORTADOS

| Extensão | Tipo              | ID Linguagem      | Ícone | Descrição |
|----------|-------------------|-------------------|-------|-----------|
| `.mkp`   | Projeto MAKER     | maker-project     | 🟦   | Arquivo de projeto principal |
| `.mks`   | Source MAKER      | maker-source      | 🟦   | Arquivo fonte MAKER |
| `.mkc`   | Configuração      | maker-config      | 🟨   | Arquivo de herança/configuração |
| `.mke`   | Regras do Motor   | maker-rules       | 🟩   | Arquivo de regras customizadas |
| `.mkh`   | Header            | maker-header      | 🟪   | Arquivo de header/metadados |

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

### 1. **Syntax Highlighting**
   - Cores específicas para cada elemento da sintaxe MAKER
   - Tema-aware (suporta temas light e dark)
   - Suporte a múltiplos tipos de arquivo

### 2. **Navigation (Definição Provider)**
   - **inherit/include:** Navega para arquivos .mkc referenciados
   - **Fontes:** Resolve arquivos .prg, .c, .mks, .cpp, .h
   - **Resolução de Caminho:** Tenta múltiplas localizações (relativa, rootPath, workspace)
   - **Atalho:** Ctrl+Click ou F12

### 3. **Header Navigation**
   - Navegação para .prg declarado em `; SOURCE : ./arquivo.prg`
   - Navegação para coordenadas em `[USAGES]`

### 4. **Hover Provider**
   - Exibe informações contextuais ao passar o mouse
   - Dicas sobre elementos MAKER

### 5. **Snippets**
   - Templates prontos para acelerar desenvolvimento
   - Suporte a prefixos: mkp-lib, mkp-exe, mkc-base, mkpred, mkmacro

---

## ⚙️ CONFIGURAÇÕES DISPONÍVEIS

```json
{
  "maker.rootPath": "/caminho/para/raiz/dos/fontes",
  "maker.enableDefinitionProvider": true,
  "maker.enableHeaderNavigation": true
}
```

### Explicação:
- **maker.rootPath**: Caminho base para resolver referências de arquivo
- **maker.enableDefinitionProvider**: Ativa navegação em arquivos MAKER
- **maker.enableHeaderNavigation**: Ativa navegação em headers

---

## 🔧 STACK TECNOLÓGICO

- **Linguagem:** TypeScript
- **Runtime:** Node.js
- **Plataforma:** VS Code (1.85.0+)
- **Build:** TypeScript Compiler (tsc)
- **Gerenciador de Pacotes:** npm
- **Versionamento:** Git

---

## 📋 EVENTOS DE ATIVAÇÃO

A extensão é ativada quando o usuário abre arquivos com as seguintes linguagens:
- `onLanguage:maker-project` (.mkp)
- `onLanguage:maker-source` (.mks)
- `onLanguage:maker-config` (.mkc)
- `onLanguage:maker-rules` (.mke)
- `onLanguage:maker-header` (.mkh)

---

## 📝 SCRIPTS NPM DISPONÍVEIS

- **npm compile** (npm: compile): Compila TypeScript com `tsc -p ./`
- Build process gera arquivos em `./out/`

---

## 🚀 FLUXO DE DESENVOLVIMENTO

1. **Editar** código TypeScript em `src/extension.ts`
2. **Compilar** com `npm compile` (ou tarefa de build no VS Code)
3. **Testar** a extensão através do VS Code Extension Host
4. **Publicar** no VS Code Marketplace

---

## 🔗 REFERÊNCIAS IMPORTANTES

- **Repositório:** https://github.com/harbour-tools/maker-language-support
- **Documentação:** [README.md](README.md)
- **Exemplos:** 
  - [base.mkc](examples/base.mkc)
  - [exemplo.mkp](examples/exemplo.mkp)

---

## 📊 MÉTRICAS DO PROJETO

| Métrica | Valor |
|---------|-------|
| Tipos de arquivo suportados | 5 (.mkp, .mks, .mkc, .mke, .mkh) |
| Providers implementados | 3 (Definition, Header, Hover) |
| Snippets predefinidos | 5 |
| Versão VS Code mínima | 1.85.0 |
| Categorias | 2 (Programming Languages, Snippets) |

---

## ✅ PRÓXIMAS AÇÕES RECOMENDADAS

1. **Testes:** Implementar testes unitários para os providers
2. **Documentação:** Expandir comentários no código TypeScript
3. **Performance:** Otimizar resolução de caminhos em projetos grandes
4. **Features:** Considerar adicionar:
   - IntelliSense/Autocomplete
   - Formatação automática
   - Linting
   - Debugging support
5. **CI/CD:** Configurar pipeline GitHub Actions para build e publicação
6. **Marketplace:** Preparar para publicação no VS Code Marketplace

---

## 📅 STATUS ATUAL

- ✅ Estrutura de projeto completa
- ✅ Providers (Definition, Hover, Header) implementados
- ✅ Sintaxe e coloração configurada
- ✅ Snippets básicos criados
- ⏳ Testes e CI/CD pendentes
- ⏳ Publicação no Marketplace

---

**Gerado por:** Análise Automática  
**Próxima revisão recomendada:** Após releases futuras
