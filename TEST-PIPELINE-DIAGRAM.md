# 🧪 Esteira de Testes - VISUAL DIAGRAM

## Arquitetura Completa

```
┌────────────────────────────────────────────────────────────────────┐
│                     DEVELOPER WORKFLOW                             │
│                                                                    │
│  npm install         npm test:watch       npm run coverage         │
│       ↓                    ↓                      ↓                 │
│  ┌─────────┐         ┌──────────┐         ┌──────────────┐         │
│  │  Deps   │─────────│  Tests   │◄────────│  Coverage    │         │
│  │ Installed│         │  Hot     │         │  Report      │         │
│  │         │         │ Reload   │         │  (Browser)   │         │
│  └─────────┘         └──────────┘         └──────────────┘         │
│                                                                    │
│  npm run lint:fix           npm run compile                        │
│         ↓                          ↓                               │
│   ┌────────────┐            ┌────────────┐                        │
│   │  ESLint    │            │ TypeScript │                        │
│   │  Auto-Fix  │            │  Compile   │                        │
│   └────────────┘            └────────────┘                        │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│                    GITHUB WORKFLOW                                 │
│                                                                    │
│   git push / Pull Request                                          │
│            ↓                                                       │
│   ┌─────────────────────────────────────┐                         │
│   │  GitHub Actions Triggers            │                         │
│   │  ├─ on: push [main, develop]        │                         │
│   │  ├─ on: pull_request [main, develop]│                         │
│   │  └─ schedule: 0 0 * * 0 (weekly)   │                         │
│   └────────────┬────────────────────────┘                         │
│                ↓                                                   │
│   ┌────────────────────────────────────────────────────────────┐  │
│   │              Parallel Jobs                                 │  │
│   │                                                            │  │
│   │  ┌──────────────────┐  ┌─────────────┐  ┌──────────────┐ │  │
│   │  │  TEST JOB        │  │ BUILD JOB   │  │ SECURITY JOB │ │  │
│   │  │  (2 min)         │  │ (1 min)     │  │ (1 min)      │ │  │
│   │  │                  │  │             │  │              │ │  │
│   │  │ Node 18.x        │  │ npm compile │  │ npm audit    │ │  │
│   │  │ Node 20.x        │  │ Artifacts   │  │ CodeQL       │ │  │
│   │  │                  │  │             │  │              │ │  │
│   │  │ npm test         │  │             │  │              │ │  │
│   │  │ Coverage → Codecov  │             │  │              │ │  │
│   │  └──────────────────┘  └─────────────┘  └──────────────┘ │  │
│   │                                                            │  │
│   └────────────┬───────────────────────────────────────────────┘  │
│                ↓                                                   │
│   ┌────────────────────────────────────────────────────────────┐  │
│   │        ALL JOBS PASSED?                                    │  │
│   └─────────────────┬──────────────────────┬───────────────────┘  │
│                     ↓                      ↓                      │
│                   YES                     NO                      │
│                     ↓                      ↓                      │
│        ┌─────────────────────┐    ┌──────────────────┐            │
│        │  PUBLISH JOB        │    │ BLOCK MERGE      │            │
│        │  (main only)        │    │ Show errors      │            │
│        │                     │    │ Developer fixes  │            │
│        │ ├─ vsce package     │    │ & retries        │            │
│        │ ├─ Create Release   │    └──────────────────┘            │
│        │ └─ Upload VSIX      │                                    │
│        └─────────────────────┘                                    │
│                     ↓                                              │
│        ┌─────────────────────┐                                    │
│        │ 🎉 PUBLISHED        │                                    │
│        │ GitHub Release OK   │                                    │
│        └─────────────────────┘                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## Test Suites Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                  50+ TEST CASES ORGANIZED                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ 🧪 extension.test.ts (8 testes)                                 │
│    ├─ Ativação + Providers                                      │
│    ├─ Registro de providers                                     │
│    └─ Configurações                                             │
│                                                                  │
│ 🧪 definition-provider.test.ts (15 testes)                      │
│    ├─ Resolução de arquivos                                     │
│    │   ├─ Relativa                                              │
│    │   ├─ Com ../                                               │
│    │   ├─ Absoluta                                              │
│    │   └─ Múltiplos candidatos                                  │
│    ├─ Padrões de herança                                        │
│    │   ├─ inherit base.mkc                                      │
│    │   └─ include config.mkc                                    │
│    ├─ Padrões de fontes                                         │
│    │   ├─ .prg, .c, .mks, .cpp, .h                              │
│    │   └─ Com caminho relativo                                  │
│    └─ Extração de palavras                                      │
│                                                                  │
│ 🧪 hover-provider.test.ts (12 testes)                           │
│    ├─ Padrões de macro                                          │
│    │   ├─ $[SourceFile]                                         │
│    │   ├─ $[OutputDir]                                          │
│    │   └─ $[OBJFileList]                                        │
│    ├─ Padrões de predicado                                      │
│    │   ├─ ?[DEBUG]                                              │
│    │   ├─ ?[RELEASE]                                            │
│    │   └─ ?[WITH_C]                                             │
│    ├─ Padrões de variável                                       │
│    │   ├─ @GCC_FLAGS                                            │
│    │   └─ @GCC_INC_DIRECTORY                                    │
│    └─ Banco de descrições                                       │
│                                                                  │
│ 🧪 header-provider.test.ts (12 testes)                          │
│    ├─ Padrão SOURCE                                             │
│    │   └─ ; SOURCE : ./arquivo.prg                              │
│    ├─ Coordenadas                                               │
│    │   ├─ [Linha:N, Coluna:N]                                   │
│    │   └─ Múltiplas coordenadas                                 │
│    ├─ Padrão USAGE                                              │
│    │   └─ [+] symbol                                            │
│    └─ Conversão de posição                                      │
│        └─ 1-based → 0-based                                     │
│                                                                  │
│ 🧪 integration.test.ts (8 testes)                               │
│    ├─ Fluxo: Navegação em herança                               │
│    │   ├─ Herança simples                                       │
│    │   └─ Múltipla herança                                      │
│    ├─ Fluxo: Navegação em fontes                                │
│    │   ├─ Sem predicado                                         │
│    │   └─ Com predicado                                         │
│    ├─ Fluxo: Hover em contexto                                  │
│    ├─ Fluxo: Navegação de header                                │
│    │   └─ SOURCE → File → Coordenada                            │
│    ├─ Fluxo: Resolução de caminhos                              │
│    │   └─ Cascata de diretórios                                 │
│    └─ Fluxo: Validação de sintaxe                               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
Extension_maker_files/
│
├── 📦 package.json
│   ├─ scripts:
│   │  ├─ npm test
│   │  ├─ npm test:watch
│   │  ├─ npm run coverage
│   │  ├─ npm run lint
│   │  └─ npm run lint:fix
│   └─ devDependencies:
│      ├─ jest
│      ├─ ts-jest
│      ├─ @types/jest
│      └─ @vscode/test-electron
│
├── ⚙️ jest.config.js
│   ├─ preset: ts-jest
│   ├─ testEnvironment: node
│   ├─ coverageThreshold: 60%
│   └─ moduleNameMapper: vscode mock
│
├── 🔍 .eslintrc.js
│   ├─ parser: @typescript-eslint/parser
│   ├─ extends: recommended + @typescript-eslint
│   └─ rules: custom
│
├── 📊 .nycrc
│   ├─ extension: [.ts]
│   ├─ reporter: [html, text, lcov, json]
│   └─ report-dir: ./coverage
│
├── 🧪 src/test/
│   ├─ __mocks__/
│   │  └─ vscode.ts (200+ linhas)
│   │     ├─ Position, Range, Uri
│   │     ├─ Location, MarkdownString, Hover
│   │     ├─ TextDocument, window, workspace
│   │     ├─ languages, CancellationToken
│   │     └─ Interface mocks
│   │
│   ├─ __tests__/
│   │  ├─ extension.test.ts (50+ linhas)
│   │  ├─ definition-provider.test.ts (100+ linhas)
│   │  ├─ hover-provider.test.ts (90+ linhas)
│   │  ├─ header-provider.test.ts (110+ linhas)
│   │  └─ integration.test.ts (130+ linhas)
│   │
│   └─ setup.ts (100+ linhas)
│      ├─ setupTestEnvironment()
│      ├─ cleanupTestEnvironment()
│      ├─ createTestFile()
│      ├─ testData (fixtures)
│      └─ createMockExtensionContext()
│
├── 🔄 .github/workflows/
│   ├─ ci-cd.yml (110 linhas)
│   │  ├─ Test (matrix: 18.x, 20.x)
│   │  ├─ Build
│   │  ├─ Security
│   │  └─ Publish (main only)
│   │
│   └─ security.yml (50 linhas)
│      ├─ Dependabot
│      └─ CodeQL
│
└── 📚 Documentation/
   ├─ TESTING.md (82 linhas)
   ├─ README-TESTING.md (150+ linhas)
   ├─ CHECKLIST-TESTING.md (200+ linhas)
   └─ TEST-PIPELINE-OVERVIEW.md (este arquivo)
```

---

## Coverage Requirements

```
┌─────────────────────────────────────┐
│   COVERAGE THRESHOLD: 60%           │
├─────────────────────────────────────┤
│                                     │
│ Branches:   60% ████░░░░░░░░░░      │
│ Functions:  60% ████░░░░░░░░░░      │
│ Lines:      60% ████░░░░░░░░░░      │
│ Statements: 60% ████░░░░░░░░░░      │
│                                     │
│ Target for future: 80%+             │
│                                     │
└─────────────────────────────────────┘
```

---

## Deploy Pipeline

```
┌─────────────────────────────────────────────────────────┐
│            VSIX Package Deploy                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Branch: main (only)                                    │
│  Trigger: Push ✓ Tests ✓ Build ✓ Security ✓            │
│                                                         │
│  Steps:                                                 │
│  1. npm run compile                                     │
│  2. vsce package                                        │
│     → maker-language-support-1.0.0.vsix                │
│                                                         │
│  3. Create GitHub Release                              │
│     → Tag: v{RUN_NUMBER}                                │
│     → Release: Release v{RUN_NUMBER}                    │
│                                                         │
│  4. Upload Asset                                        │
│     → Asset: maker-language-support-1.0.0.vsix         │
│                                                         │
│  Result: 🎉 Pronto para publicar no Marketplace        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Development Commands Cheat Sheet

```bash
# 🎯 Quick Start
npm install                    # Instalar
npm run compile               # Compilar
npm test                      # Testes rápidos

# 🧪 Testing
npm test                      # Com cobertura
npm test:watch               # Hot reload
npm test:unit                # Apenas unitários
npm run coverage              # Relatório HTML

# 🔍 Quality
npm run lint                  # Verificar
npm run lint:fix              # Corrigir

# 📦 Build
npm run compile               # TypeScript
npm run package               # VSIX

# 🚀 CI/CD (automático no GitHub)
# Apenas fazer: git push
# Rest acontece no GitHub Actions
```

---

## Performance Targets

```
┌──────────────────────────────────────┐
│     BUILD PIPELINE PERFORMANCE       │
├──────────────────────────────────────┤
│                                      │
│ Test Suite (jest):        ~2 min     │
│ Build (tsc):              ~1 min     │
│ Security (audit):         ~1 min     │
│ CodeQL:                   ~3 min     │
│ ────────────────────────────────────  │
│ Total CI/CD:              ~7 min     │
│                                      │
│ Parallelization saves: ~8 min        │
│                                      │
└──────────────────────────────────────┘
```

---

## Success Criteria ✅

- [x] Testes rodam localmente
- [x] CI/CD dispara em push/PR
- [x] Cobertura rastreada
- [x] Build verificado
- [x] Security checks implementados
- [x] Documentação completa
- [x] Scripts npm funcionam
- [x] GitHub Releases automáticos
- [x] Pronto para produção

---

## 🎓 Learning Path

```
1. Entender estrutura
   └─ Ler: README-TESTING.md

2. Usar testes localmente
   └─ Executar: npm test

3. Escrever testes
   └─ Consultar: TESTING.md

4. Integração CI/CD
   └─ Ver: .github/workflows/ci-cd.yml

5. Otimizar coverage
   └─ Usar: npm run coverage
```

---

## 📞 Referências Rápidas

- Jest Docs: https://jestjs.io/
- ts-jest: https://kulshekhar.github.io/ts-jest/
- GitHub Actions: https://docs.github.com/actions
- VS Code Testing: https://code.visualstudio.com/api/working-with-extensions/testing-extensions

---

**Versão:** 1.0.0  
**Criado:** 2026-04-23  
**Status:** ✅ Completo
