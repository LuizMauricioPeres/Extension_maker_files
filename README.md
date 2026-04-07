# MAKER Language Support

> **DEUS É FIEL**

Extensão VSCode para suporte à linguagem do motor de build **MAKER**, usado em projetos **Harbour/C**.

---

## Funcionalidades

### 📁 Identificação de Arquivos
| Extensão | Tipo           | Ícone |
|----------|----------------|-------|
| `.mkp`   | Projeto MAKER  | 🟦    |
| `.mkc`   | Configuração   | 🟨    |
| `.mke`   | Regras do motor| 🟩    |

---

### 🎨 Destaque de Sintaxe

| Elemento                  | Exemplo                        | Cor (tema padrão)   |
|---------------------------|--------------------------------|---------------------|
| Comentários `#`           | `# isso é um comentário`       | Verde               |
| Seções `[SECAO]`          | `[SOURCES]`                    | Amarelo/Entity      |
| Predicados `?[cond]...:` | `?[DEBUG]--cflag=-g:`          | Roxo/Control        |
| Macros `$[Nome]`          | `$[OBJFileList]`               | Azul claro          |
| Variáveis `@Nome`         | `@GCC_INC_DIRECTORY`           | Verde/Variable      |
| Comandos `--diretiva`     | `--projecttype=exe`            | Laranja/Function    |

---

### 🔗 Navegação (Ctrl+Click / F12)

- **Arquivos `.mkc`** referenciados via `inherit` ou `include` → abre o arquivo diretamente
- **Arquivos fonte** (`.prg`, `.c`, `.mks`) listados em `[SOURCES]` → tenta localizar e abrir
- Resolução de caminho: relativo ao `.mkp` → `maker.rootPath` → raiz do workspace

---

### ✂️ Snippets

| Prefixo     | Descrição                              |
|-------------|----------------------------------------|
| `mkp-lib`   | Projeto MAKER — Biblioteca estática    |
| `mkp-exe`   | Projeto MAKER — Executável             |
| `mkc-base`  | Arquivo de configuração `.mkc` base    |
| `mkpred`    | Bloco de predicado `?[cond]val:`       |
| `mkmacro`   | Referência de macro `$[Nome]`          |

---

## Configurações

```json
{
  "maker.rootPath": "/caminho/para/raiz/dos/fontes",
  "maker.enableDefinitionProvider": true
}
```

---

## Exemplo de Arquivo `.mkp`

```make
# ============================================================
# DEUS É FIEL
# ------------------------------------------------------------
# Projeto : MeuModulo
# Tipo    : Biblioteca Estática
# ============================================================

inherit base.mkc

--projecttype=lib
--projectname=MeuModulo
--outputdir=$[OutputDir]

--cflags=@GCC_FLAGS
--includedir=@GCC_INC_DIRECTORY

[SOURCES]
# Fontes Harbour
modulo1.prg
modulo2.prg

# Fontes C
?[WITH_C]helper.c:

[END]
```

---

## Estrutura do Projeto

```
maker-language-support/
├── src/
│   └── extension.ts          # Lógica principal (TS)
├── syntaxes/
│   └── maker.tmLanguage.json  # Gramática TextMate
├── snippets/
│   └── maker.code-snippets    # Templates de código
├── images/                    # Ícones da extensão
├── out/                       # JS compilado (gerado)
├── language-configuration.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## Instalação para Desenvolvimento

```bash
git clone https://github.com/harbour-tools/maker-language-support
cd maker-language-support
npm install
npm run compile
# Pressione F5 no VSCode para abrir a Extension Host
```

## Empacotamento

```bash
npm run package
# Gera: maker-language-support-1.0.0.vsix
```

---

*Desenvolvido com ❤️ para a comunidade Harbour/C*
