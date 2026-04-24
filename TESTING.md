# Esteira de Testes - MAKER Language Support

## 📋 Visão Geral

Esta documentação descreve a esteira de testes para a extensão MAKER Language Support, incluindo configuração, execução e boas práticas.

---

## 🏗️ Arquitetura de Testes

A esteira está organizada em 4 camadas:

```
┌─────────────────────────────────────────────────────┐
│           GitHub Actions (CI/CD)                    │
│  ┌───────────────────────────────────────────────┐  │
│  │ Testes Unitários + Cobertura + Build + Audit │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│      Local Development (npm scripts)                │
│  ┌───────────────────────────────────────────────┐  │
│  │ test | test:watch | coverage | lint          │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│      Test Frameworks                                │
│  ┌───────────────────────────────────────────────┐  │
│  │ Jest + ts-jest + TypeScript                   │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│      Testes (4 módulos)                             │
│  ┌─────────────┬──────────────┬──────────────────┐  │
│  │ Unit Tests  │ Integration  │ Provider Tests   │  │
│  └─────────────┴──────────────┴──────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 📂 Estrutura de Testes

```
src/
├── test/
│   ├── __mocks__/
│   │   └── vscode.ts                 # Mock do módulo VS Code
│   └── __tests__/
│       ├── extension.test.ts          # Testes da extensão
│       ├── definition-provider.test.ts # Testes do Definition Provider
│       ├── hover-provider.test.ts     # Testes do Hover Provider
│       ├── header-provider.test.ts    # Testes do Header Provider
│       └── integration.test.ts        # Testes de integração
├── extension.ts                       # Código principal
└── ...
```

---

## 🚀 Quick Start

### Instalação

```bash
# Instalar dependências incluindo testes
npm install

# Compilar TypeScript
npm run compile
```

### Executar Testes

```bash
# Executar todos os testes com cobertura
npm test

# Executar testes em modo watch (roda novamente ao salvar)
npm test:watch

# Ver relatório de cobertura em HTML
npm run coverage

# Executar apenas testes unitários
npm test:unit
```

### Validar Código

```bash
# Verificar linting
npm run lint

# Corrigir automaticamente issues de linting
npm run lint:fix
```

---

## 🧪 Descrição dos Testes

### 1. **extension.test.ts** - Testes da Extensão
Testa:
- Ativação dos providers (Definition, Hover, Header)
- Registro de providers com o VS Code
- Configurações (enableDefinitionProvider, enableHeaderNavigation, rootPath)
- Desativação da extensão

**Cobertura:**
- ✅ Activation flow
- ✅ Provider registration
- ✅ Configuration resolution

### 2. **definition-provider.test.ts** - Resolução de Arquivos
Testa:
- Resolução relativa de arquivos
- Resolução com caminho `../`
- Resolução absoluta
- Múltiplos candidatos (baseDir, rootPath, workspace)
- Padrões de herança: `inherit base.mkc`, `include config.mkc`
- Padrões de fontes: `.prg`, `.c`, `.mks`, `.cpp`, `.h`
- Extração de palavras com extensão

**Cobertura:**
- ✅ Path resolution
- ✅ Inheritance patterns
- ✅ Source file patterns
- ✅ Word extraction

### 3. **hover-provider.test.ts** - Documentação Hover
Testa:
- Reconhecimento de macros: `$[SourceFile]`, `$[OutputDir]`, etc.
- Reconhecimento de predicados: `?[DEBUG]`, `?[RELEASE]`, etc.
- Reconhecimento de variáveis: `@GCC_FLAGS`, etc.
- Banco de descrições de macros e predicados
- Extração de nomes

**Cobertura:**
- ✅ Macro patterns
- ✅ Predicate patterns
- ✅ Variable patterns
- ✅ Description database

### 4. **header-provider.test.ts** - Navegação de Headers
Testa:
- Extração de `; SOURCE : arquivo.prg`
- Parsing de coordenadas: `[Linha:N, Coluna:N]`
- Reconhecimento de linhas USAGE: `[+] symbol`
- Conversão de posição (1-based → 0-based)
- Extração de SOURCE de headers

**Cobertura:**
- ✅ SOURCE extraction
- ✅ Coordinate parsing
- ✅ USAGE line patterns
- ✅ Position conversion

### 5. **integration.test.ts** - Testes de Integração
Testa fluxos completos:
- Navegação em herança (simples e múltipla)
- Navegação em fontes (com e sem predicado)
- Hover em contexto
- Navegação de header completa
- Resolução em cascata de diretórios
- Validação de sintaxe

**Cobertura:**
- ✅ Multi-step workflows
- ✅ File resolution chains
- ✅ Context-aware navigation
- ✅ Syntax validation

---

## 📊 Métricas de Cobertura

### Requisitos Mínimos

```json
{
  "branches": 60,
  "functions": 60,
  "lines": 60,
  "statements": 60
}
```

### Visualizar Cobertura

```bash
npm run coverage
# Abre coverage/index.html no navegador
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

#### 1. **ci-cd.yml** - Pipeline Principal

```
Push/PR → test → build → security → publish
```

**Etapas:**
1. **Test Matrix** - Testa em Node.js 18.x e 20.x
   - Instala dependências
   - Executa linting
   - Executa testes com cobertura
   - Upload de cobertura para Codecov

2. **Build** - Compila TypeScript
   - Instala dependências
   - Compila com `npm run compile`
   - Verifica `out/extension.js`
   - Upload de artefatos

3. **Security** - Audita pacotes
   - Executar `npm audit`
   - Falha se vulnerabilidades críticas

4. **Publish** - Publica no Marketplace (main branch apenas)
   - Empacota com `vsce package`
   - Cria release no GitHub
   - Upload do .vsix

#### 2. **security.yml** - Verificações de Segurança

```
Weekly schedule → npm audit + CodeQL Analysis
```

---

## 📝 Escrevendo Novos Testes

### Template Básico

```typescript
describe('Feature Name', () => {
    describe('Aspect 1', () => {
        test('should do something specific', () => {
            // Arrange
            const input = 'test input';

            // Act
            const result = functionUnderTest(input);

            // Assert
            expect(result).toBe('expected output');
        });

        test('should handle edge case', () => {
            expect(() => {
                functionUnderTest(null);
            }).toThrow();
        });
    });
});
```

### Boas Práticas

1. **Nomenclatura**
   - Arquivos: `feature.test.ts` ou `feature.spec.ts`
   - Descrever o teste: `should X when Y`

2. **Organização**
   - Usar `describe` para agrupar testes relacionados
   - Um teste por aspecto

3. **Mocks**
   - Usar mocks do VS Code em `__mocks__/vscode.ts`
   - Limpar mocks com `jest.clearAllMocks()`

4. **Cobertura**
   - Testar casos de sucesso e erro
   - Testar edge cases e limites
   - Manter cobertura acima de 60%

---

## 🛠️ Troubleshooting

### Testes falhando no CI mas passando localmente

```bash
# Limpar cache do Jest
npm test -- --clearCache

# Recompilar TypeScript
npm run compile
```

### Cobertura baixa

```bash
# Ver quais linhas não estão cobertas
npm run coverage
# Abrir coverage/index.html e procurar por "E" (erro)
```

### Problemas com mocks do VS Code

```bash
# Verificar mock em src/test/__mocks__/vscode.ts
# Adicionar mock para novas APIs conforme necessário
```

---

## 📈 Métricas de Qualidade

| Métrica | Target | Atual | Status |
|---------|--------|-------|--------|
| Test Coverage (Lines) | 60% | - | ⏳ |
| Test Coverage (Branches) | 60% | - | ⏳ |
| Linting Errors | 0 | - | ⏳ |
| Build Success Rate | 100% | - | ⏳ |
| Security Audit Pass | 100% | - | ⏳ |

---

## 🎯 Próximos Passos

1. **Testes E2E** - Implementar testes de integração com VS Code real
2. **Performance** - Adicionar benchmarks para resolução de arquivos
3. **Testes de Snapshot** - Comparar output de providers com snapshots
4. **Cobertura** - Aumentar para 80%+
5. **Regressão Visual** - Testar sintaxe e coloração em vários temas

---

## 📚 Referências

- [Jest Documentation](https://jestjs.io/)
- [ts-jest](https://kulshekhar.github.io/ts-jest/)
- [VS Code Testing Docs](https://code.visualstudio.com/api/working-with-extensions/testing-extensions)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Mantido por:** harbour-tools  
**Última atualização:** 2026-04-23
