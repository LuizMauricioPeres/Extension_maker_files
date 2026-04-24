#!/bin/bash
# 🧪 Quick Reference - MAKER Extension Test Pipeline

# ═══════════════════════════════════════════════════════════
# 📋 QUICK START (5 minutos)
# ═══════════════════════════════════════════════════════════

# 1. Instalar tudo
npm install

# 2. Compilar TypeScript
npm run compile

# 3. Rodar testes (com cobertura)
npm test

# 4. Ver relatório em HTML
npm run coverage

# ═══════════════════════════════════════════════════════════
# 🧪 TESTES
# ═══════════════════════════════════════════════════════════

# Rodar todos os testes com cobertura
npm test

# Rodar apenas testes unitários
npm test:unit

# Modo watch (hot reload ao salvar)
npm test:watch

# Ver relatório de cobertura
npm run coverage

# Limpar cache do Jest (se problemas)
npm test -- --clearCache

# ═══════════════════════════════════════════════════════════
# 🔍 QUALIDADE DE CÓDIGO
# ═══════════════════════════════════════════════════════════

# Verificar linting (ESLint)
npm run lint

# Corrigir issues de linting automaticamente
npm run lint:fix

# ═══════════════════════════════════════════════════════════
# 📦 BUILD
# ═══════════════════════════════════════════════════════════

# Compilar TypeScript para JavaScript
npm run compile

# Empacotar extensão VSIX
npm run package

# Build de pré-publicação
npm run vscode:prepublish

# ═══════════════════════════════════════════════════════════
# 🚀 CI/CD (Automático - rodar no terminal para simular)
# ═══════════════════════════════════════════════════════════

# Simular lint + test + build (o que CI/CD faz)
npm run lint && npm test && npm run compile

# ═══════════════════════════════════════════════════════════
# 📊 ESTRUTURA DE TESTES
# ═══════════════════════════════════════════════════════════

# 📁 src/test/
#    ├─ __mocks__/vscode.ts          (Mock VS Code)
#    ├─ __tests__/
#    │  ├─ extension.test.ts          (8 testes)
#    │  ├─ definition-provider.test.ts (15 testes)
#    │  ├─ hover-provider.test.ts     (12 testes)
#    │  ├─ header-provider.test.ts    (12 testes)
#    │  └─ integration.test.ts        (8 testes)
#    └─ setup.ts                      (Utilitários)

# ═══════════════════════════════════════════════════════════
# 📚 DOCUMENTAÇÃO
# ═══════════════════════════════════════════════════════════

# Ler documentação completa
cat TESTING.md

# Ver resumo técnico
cat README-TESTING.md

# Ver checklist de implementação
cat CHECKLIST-TESTING.md

# Ver diagrama visual
cat TEST-PIPELINE-DIAGRAM.md

# ═══════════════════════════════════════════════════════════
# 🧬 TESTES DISPONÍVEIS
# ═══════════════════════════════════════════════════════════

# Extension tests (ativação, providers, config)
npm test -- extension.test.ts

# Definition Provider tests (resolução de arquivos)
npm test -- definition-provider.test.ts

# Hover Provider tests (macros, predicados, variáveis)
npm test -- hover-provider.test.ts

# Header Provider tests (SOURCE, coordenadas, USAGE)
npm test -- header-provider.test.ts

# Integration tests (fluxos completos)
npm test -- integration.test.ts

# ═══════════════════════════════════════════════════════════
# 📈 COBERTURA
# ═══════════════════════════════════════════════════════════

# Threshold: 60% (branches, functions, lines, statements)

# Gerar relatório
npm run coverage

# Ver cobertura por arquivo
npm test -- --coverage --verbose

# Aumentar verbosity para diagnosticar
npm test -- --coverage --collectCoverageFrom='src/**/*.ts'

# ═══════════════════════════════════════════════════════════
# 🔧 TROUBLESHOOTING
# ═══════════════════════════════════════════════════════════

# Testes falhando? Limpar cache
npm test -- --clearCache && npm test

# Problemas com TypeScript?
npm run compile -- --noEmit

# ESLint com problemas de parsing?
npm run lint -- --debug

# Coverage baixa? Ver relatório
npm run coverage
# Depois abrir: coverage/index.html

# ═══════════════════════════════════════════════════════════
# 🎯 WORKFLOW TÍPICO
# ═══════════════════════════════════════════════════════════

# 1. Começar desenvolvimento
npm install
npm run compile
npm test:watch

# 2. Fazer alterações no código
# ... editar src/extension.ts ...

# 3. Testes rodam automaticamente em watch mode
# ... ver resultado ...

# 4. Verificar qualidade
npm run lint:fix
npm test

# 5. Pronto para commit
npm run compile
git add .
git commit -m "Feature: ..."

# 6. Push dispara CI/CD no GitHub
git push

# ═══════════════════════════════════════════════════════════
# 📋 CHECKLIST PRÉ-COMMIT
# ═══════════════════════════════════════════════════════════

# Antes de fazer commit:
# [ ] npm test → Todos passam?
# [ ] npm run lint → Sem erros?
# [ ] npm run compile → Sem erros?
# [ ] npm run coverage → Cobertura aceitável?
# [ ] Código formatado? (lint:fix)

# ═══════════════════════════════════════════════════════════
# 🚀 PRÓXIMOS PASSOS
# ═══════════════════════════════════════════════════════════

# 1. Instalar dependências
npm install

# 2. Executar testes
npm test

# 3. Ver documentação
cat TESTING.md

# 4. Configurar editor (VSCode)
# Instalar: ESLint extension
# Instalar: Jest extension

# ═══════════════════════════════════════════════════════════
# 📞 REFERÊNCIAS
# ═══════════════════════════════════════════════════════════

# Jest: https://jestjs.io/
# ts-jest: https://kulshekhar.github.io/ts-jest/
# ESLint: https://eslint.org/
# GitHub Actions: https://docs.github.com/actions
# VS Code Testing: https://code.visualstudio.com/api/working-with-extensions/testing-extensions

# ═══════════════════════════════════════════════════════════
# ✨ FIM DO QUICK REFERENCE
# ═══════════════════════════════════════════════════════════
