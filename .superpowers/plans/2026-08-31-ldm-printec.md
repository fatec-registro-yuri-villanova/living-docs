# Trilha LDM — Bluetooth e Impressora (Printec): Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o conteúdo da trilha LDM do `living-docs` por 15 aulas que levam o aluno do scaffold `base-app` do projeto Printec até o app rodando em Android e Desktop, imprimindo etiquetas por Bluetooth.

**Architecture:** Cada aula é um `.mdx` do Docusaurus que introduz um conjunto de arquivos reais do repositório `printec`, na ordem ditada pelo grafo de dependências deles. Nenhum bloco de código é escrito por quem redige: todo bloco é copiado literalmente de `git show base-app:<arquivo>` ou `git show main:<arquivo>`. O resultado visível de cada aula é um teste real da `main` passando (aulas 02–12) ou o app rodando (aulas 01, 13–15). Um script de verificação confere cada bloco contra o repositório e roda no fim de toda tarefa.

**Tech Stack:** Docusaurus 3 (MDX, TypeScript), Node 18+. O projeto documentado é Kotlin Multiplatform 2.4.10, Compose Multiplatform 1.11.1, SQLDelight 2.1.0, escpos-coffee 4.1.0, jSerialComm 2.11.0, Gradle.

**Spec:** [`.superpowers/specs/2026-08-31-ldm-printec-design.md`](../specs/2026-08-31-ldm-printec-design.md)

## Global Constraints

Valem para **toda** tarefa deste plano.

- **Nenhum bloco de código é escrito pelo redator.** Todo bloco vem de `git show base-app:<arquivo>` (só na aula 01) ou `git show main:<arquivo>` (todo o resto), copiado literalmente, comentários inclusive.
- **Todo bloco de código Kotlin, `.sq`, `.kts`, `.toml` ou `.xml` leva `title="<caminho completo a partir da raiz do printec>"`** — sem abreviar com `...`. O script de fidelidade depende disso para localizar o arquivo real.
- **No info string, `reference="base-app"` vem sempre DEPOIS de `title="..."`** (Ruling 2 do pre-flight). O verificador só procura o `reference` à direita do `title`; ordem invertida faz o bloco ser conferido contra `main`, onde o arquivo do scaffold não existe.
- **Sem versões intermediárias.** Um arquivo aparece uma única vez, completo, na aula em que suas dependências já existem. Nenhuma aula mostra "uma versão simplificada por enquanto".
- **Os arquivos de build não mudam durante a trilha.** Verificado: `git diff base-app main` nos seis arquivos de build retorna vazio. Da aula 02 em diante, nenhuma aula edita Gradle.
- **Os comentários do código original são preservados.** Eles explicam o porquê a partir do sintoma real que o motivou — são a melhor parte do material.
- **Toda aula termina com um resultado visível** para o aluno: teste verde, arquivo no disco, app na tela ou papel impresso.
- **Idioma:** português do Brasil. Títulos de seção com os emojis do template (§5.5 da spec).
- **O repositório `printec` nunca é modificado.** Este plano só escreve documentação. Todo acesso é leitura: `git -C <printec> show ...`.
- **`npm run build` do Docusaurus tem que passar** ao fim de toda tarefa, sem link quebrado e sem aviso novo.
- **Caminho do printec:** as tarefas assumem `../printec` relativo à raiz do `living-docs`. O script aceita a variável de ambiente `PRINTEC_REPO` para sobrescrever.

---

## Estrutura de Arquivos

**Criados:**

| Arquivo | Responsabilidade |
|---|---|
| `scripts/verificar-fidelidade.mjs` | Confere todo bloco de código com `title=` das aulas do LDM contra o arquivo real do printec. É o guardião da regra "zero código inventado". |
| `docs/ldm/aula-01.mdx` … `aula-15.mdx` | Uma aula cada (15 arquivos) |

**Modificados:**

| Arquivo | Mudança |
|---|---|
| `sidebars.ts` | `ldmSidebar` reescrito: 5 categorias, 15 itens — cresce uma linha por tarefa |
| `docusaurus.config.ts` | rótulo da navbar (~linha 71) e do footer (~linha 88) |
| `docs/ldm/_category_.json` | label e descrição da trilha |
| `docs/index.mdx` | aba do LDM (~linhas 40–46): stack e chamada |
| `package.json` | script `verificar:fidelidade` |

**Removidos (Task 1):** `docs/ldm/aula-01..11.mdx`, `aula-04-1.mdx`, `aula-14..20.mdx` (19 arquivos) e `docs/ldm/PLAN_AULA04_1_DTOS.md`.

---

## Mapa de dependências das aulas

Cada aula só pode introduzir um arquivo depois que todos os arquivos que ele importa já apareceram. Esta é a ordem que o plano trava:

```
02 Impressora, QuebraDeLinha
03 Pc860
04 LabelDocument, EtiquetaDeTeste
05 EscPosRenderer            <- 02, 03, 04
06 PrinterTransport, EscritaEmBlocos
07 AndroidBluetoothTransport <- 06
08 TransporteDesktop, DesktopUsbTransport, DesktopSerialTransport  <- 06
09 Printec.sq, LabelStore, FabricaDeDriver, Relogio.*, DriverAndroid, DriverDesktop  <- 04
10 LabelStoreSqlDelight      <- 09
11 EtiquetaViewModel         <- 04, 06, 10
12 FormularioEtiqueta, PreviewEtiqueta  <- 02, 04
13 StatusImpressao, TelaCompor, TelaEtiquetas, TelaConfiguracoes, Navegacao, desktopApp/main.kt  <- 08, 11, 12
14 PrintecApp, MainActivity, AndroidManifest.xml  <- 07, 13
15 (nenhum arquivo novo de produção; fechamento e calibração)
```

---

### Task 1: Limpar a trilha, reconfigurar o Docusaurus e criar o verificador de fidelidade

Esta tarefa deixa o site buildando com a trilha vazia de conteúdo antigo, os rótulos novos e o guardião da regra de fidelidade funcionando. A aula 01 vem na Task 2.

**Files:**
- Delete: `docs/ldm/aula-01.mdx`, `aula-02.mdx`, `aula-03.mdx`, `aula-04.mdx`, `aula-04-1.mdx`, `aula-05.mdx`, `aula-06.mdx`, `aula-07.mdx`, `aula-08.mdx`, `aula-09.mdx`, `aula-10.mdx`, `aula-11.mdx`, `aula-14.mdx`, `aula-15.mdx`, `aula-16.mdx`, `aula-17.mdx`, `aula-18.mdx`, `aula-19.mdx`, `aula-20.mdx`, `PLAN_AULA04_1_DTOS.md`
- Create: `scripts/verificar-fidelidade.mjs`, `docs/ldm/index.mdx`
- Modify: `sidebars.ts`, `docusaurus.config.ts`, `docs/ldm/_category_.json`, `docs/index.mdx`, `package.json`

**Interfaces:**
- Produces: o comando `npm run verificar:fidelidade`, que percorre `docs/ldm/*.mdx`, extrai todo bloco cercado cujo `info string` contenha `title="..."`, resolve o caminho contra `git -C $PRINTEC_REPO show <ref>:<caminho>` e falha se o conteúdo do bloco não for um trecho contíguo e literal do arquivo real. A ref é `main` por padrão e `base-app` quando o bloco declara `reference="base-app"` no info string. Toda tarefa seguinte roda este comando.
- Produces: `docs/ldm/index.mdx`, a página de abertura da trilha, referenciada por `ldmSidebar` para o sidebar não ficar vazio enquanto não há aulas.

- [ ] **Step 1: Confirmar o estado de partida**

```bash
git -C ../printec diff --stat base-app main -- settings.gradle.kts build.gradle.kts shared/build.gradle.kts gradle/libs.versions.toml androidApp/build.gradle.kts desktopApp/build.gradle.kts
```

Esperado: saída vazia. Se algo aparecer, PARE — a premissa "os arquivos de build não mudam" caiu e o plano precisa ser revisto antes de continuar.

- [ ] **Step 2: Remover o conteúdo antigo da trilha**

```bash
git rm docs/ldm/aula-01.mdx docs/ldm/aula-02.mdx docs/ldm/aula-03.mdx docs/ldm/aula-04.mdx docs/ldm/aula-04-1.mdx docs/ldm/aula-05.mdx docs/ldm/aula-06.mdx docs/ldm/aula-07.mdx docs/ldm/aula-08.mdx docs/ldm/aula-09.mdx docs/ldm/aula-10.mdx docs/ldm/aula-11.mdx docs/ldm/aula-14.mdx docs/ldm/aula-15.mdx docs/ldm/aula-16.mdx docs/ldm/aula-17.mdx docs/ldm/aula-18.mdx docs/ldm/aula-19.mdx docs/ldm/aula-20.mdx docs/ldm/PLAN_AULA04_1_DTOS.md
```

- [ ] **Step 3: Escrever o verificador de fidelidade**

Criar `scripts/verificar-fidelidade.mjs`:

```javascript
#!/usr/bin/env node
// Guardiao da regra "zero codigo inventado" da trilha LDM.
//
// Percorre docs/ldm/*.mdx, extrai todo bloco cercado cujo info string traga
// title="<caminho>", busca o arquivo real no repositorio printec e exige que o
// conteudo do bloco seja um trecho CONTIGUO e LITERAL desse arquivo.
//
// Trecho contiguo, e nao arquivo inteiro, porque uma aula legitimamente mostra
// so uma funcao de um arquivo grande. O que a regra proibe e texto que nao
// existe no repositorio.
import { readFileSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const PRINTEC = process.env.PRINTEC_REPO ?? "../printec";
const DIR = "docs/ldm";

const cache = new Map();

function arquivoReal(ref, caminho) {
    const chave = `${ref}:${caminho}`;
    if (cache.has(chave)) return cache.get(chave);
    let conteudo;
    try {
        conteudo = execFileSync("git", ["-C", PRINTEC, "show", chave], {
            encoding: "utf8",
            maxBuffer: 32 * 1024 * 1024,
        });
    } catch {
        conteudo = null;
    }
    cache.set(chave, conteudo);
    return conteudo;
}

// CRLF vs LF nao e divergencia de conteudo: o Windows normaliza no checkout.
const normalizar = (texto) => texto.replace(/\r\n/g, "\n").replace(/\s+$/, "");

const falhas = [];
let conferidos = 0;

for (const nome of readdirSync(DIR).filter((n) => n.endsWith(".mdx")).sort()) {
    const texto = readFileSync(join(DIR, nome), "utf8");
    // ```kotlin title="caminho/arquivo.kt" reference="base-app"
    const bloco = /^```[^\n]*?title="([^"]+)"([^\n]*)\n([\s\S]*?)^```/gm;
    for (const achado of texto.matchAll(bloco)) {
        const [, caminho, resto, corpo] = achado;
        // Blocos de shell, saida de terminal e arvore de diretorios usam
        // title= como rotulo, nao como caminho de arquivo: sao ignorados.
        if (!/\.(kt|kts|sq|toml|xml|json|pro)$/.test(caminho)) continue;
        conferidos++;
        const ref = /reference="([^"]+)"/.exec(resto)?.[1] ?? "main";
        const real = arquivoReal(ref, caminho);
        if (real === null) {
            falhas.push(`${nome}: ${ref}:${caminho} nao existe no printec`);
            continue;
        }
        if (!normalizar(real).includes(normalizar(corpo))) {
            falhas.push(`${nome}: bloco de ${caminho} nao confere com ${ref}`);
        }
    }
}

if (falhas.length > 0) {
    console.error(`FALHA — ${falhas.length} bloco(s) divergente(s):`);
    for (const f of falhas) console.error(`  - ${f}`);
    process.exit(1);
}
console.log(`OK — ${conferidos} bloco(s) conferidos contra o printec.`);
```

- [ ] **Step 4: Registrar o script no `package.json`**

Acrescentar em `"scripts"`:

```json
"verificar:fidelidade": "node scripts/verificar-fidelidade.mjs"
```

- [ ] **Step 5: Rodar o verificador com a trilha vazia**

```bash
npm run verificar:fidelidade
```

Esperado: `OK — 0 bloco(s) conferidos contra o printec.` — prova que o script roda e que não há aula alguma ainda.

- [ ] **Step 6: Escrever a abertura da trilha**

Criar `docs/ldm/index.mdx`:

````markdown
---
sidebar_position: 0
title: "Sobre a trilha"
description: "Printec — app Kotlin Multiplatform que imprime etiquetas por Bluetooth em Android e Desktop."
---

# LDM — Bluetooth e Impressora

Esta trilha constrói o **Printec**: um app Kotlin Multiplatform que compõe
etiquetas e as imprime numa impressora térmica **Lintian LT-8359**, por
Bluetooth no Android e por porta COM ou USB no Desktop.

## O que você vai construir

Ao fim das 15 aulas você terá o app rodando nas duas plataformas, imprimindo
etiquetas com título, linhas de texto, QR Code e controle de cópias.

## Como esta trilha funciona

Todo código que você vê aqui existe no repositório do projeto — nada foi
escrito para a aula. Cada aula segue o mesmo ciclo:

1. Você vê o **teste** que a funcionalidade precisa passar
2. Roda o teste: **vermelho**
3. Vê o **código** que a faz passar
4. Roda de novo: **verde**

:::info 🔀 O repositório
```bash
git clone https://github.com/<org>/printec.git
cd printec
git checkout base-app
```
A branch `base-app` é o ponto de partida. A branch `main` é o gabarito final —
consulte quando travar, mas tente escrever antes de olhar.
:::

## Hardware

| Propriedade | Valor |
|---|---|
| Modelo | Lintian LT-8359 |
| Linguagem | ESC/POS |
| Code page | 3 = PC860 (portuguesa) |
| Largura | 384 dots ≈ 48 mm úteis, papel 58 mm |
| Colunas | 32 caracteres por linha |
| Interfaces | Bluetooth (SPP) + USB |
| Bateria | **auto-desliga em 10 minutos** |

Essas duas últimas linhas explicam metade das decisões do código. Guarde-as.
````

- [ ] **Step 7: Reescrever o `ldmSidebar`**

Em `sidebars.ts`, substituir o `ldmSidebar` inteiro por:

```typescript
    ldmSidebar: [
        "ldm/index",
    ],
```

As categorias e os itens entram uma aula por vez, nas tarefas seguintes.

- [ ] **Step 8: Renomear a trilha**

Em `docusaurus.config.ts`, na navbar (~linha 71) e no footer (~linha 88), trocar `"LDM — Backend & CMS"` por `"LDM — Bluetooth e Impressora"`. No footer, trocar o destino `to: "/ldm/aula-01"` por `to: "/ldm/"`.

Em `docs/ldm/_category_.json`:

```json
{
    "label": "LDM — Bluetooth e Impressora",
    "position": 3,
    "link": {
        "type": "doc",
        "id": "ldm/index"
    }
}
```

Em `docs/index.mdx`, na aba do LDM (~linhas 40–46):

```mdx
  <TabItem value="ldm" label="LDM — Bluetooth e Impressora">

**Kotlin Multiplatform · Compose · ESC/POS · Bluetooth SPP · SQLDelight**

15 aulas construindo o Printec, do scaffold ao app imprimindo etiquetas em Android e Desktop.

[→ Começar LDM](/ldm/)

  </TabItem>
```

- [ ] **Step 9: Build**

```bash
npm run build
```

Esperado: build concluído sem erro. Nenhum aviso de link quebrado apontando para `/ldm/aula-*`.

- [ ] **Step 10: Commit**

```bash
git add -A docs/ldm sidebars.ts docusaurus.config.ts docs/index.mdx package.json scripts/verificar-fidelidade.mjs
git commit -m "docs(ldm): limpa a trilha e adiciona verificador de fidelidade"
```

---

### Task 2: Aula 01 — Setup KMP, os dois apps rodando

**Files:**
- Create: `docs/ldm/aula-01.mdx`
- Modify: `sidebars.ts`

**Interfaces:**
- Consumes: `docs/ldm/index.mdx` e `npm run verificar:fidelidade` (Task 1)
- Produces: o aluno com o projeto `base-app` clonado e os dois apps abrindo. Todas as aulas seguintes assumem isso.
- Produces: o template de aula que as Tasks 3–16 replicam — as seções, a ordem e o bloco `:::info 🔀 Código da Aula`.

- [ ] **Step 1: Extrair os arquivos reais**

```bash
git -C ../printec show base-app:settings.gradle.kts
git -C ../printec show base-app:shared/build.gradle.kts
git -C ../printec show base-app:gradle/libs.versions.toml
git -C ../printec show base-app:desktopApp/build.gradle.kts
git -C ../printec show base-app:androidApp/build.gradle.kts
git -C ../printec show base-app:shared/src/commonMain/kotlin/com/fatec/printec/App.kt
git -C ../printec show base-app:shared/src/commonMain/kotlin/com/fatec/printec/Platform.kt
git -C ../printec show base-app:shared/src/jvmMain/kotlin/com/fatec/printec/Platform.jvm.kt
git -C ../printec show base-app:shared/src/androidMain/kotlin/com/fatec/printec/Platform.android.kt
```

Todo bloco desta aula usa `reference="base-app"` no info string, porque mostra o scaffold de partida e não o estado final.

- [ ] **Step 2: Escrever `docs/ldm/aula-01.mdx`**

Frontmatter: `sidebar_position: 1`, `title: "Aula 01: Setup KMP — os dois apps rodando"`, `description: "Targets, source sets e a estrutura do projeto Printec. Android e Desktop abrindo."`.

Seções, nesta ordem:

**`:::info 🔀 Código da Aula`** — ponto de partida `git checkout base-app`, gabarito `git checkout main`.

**`## 📖 Conceito`** — o que o KMP compartilha e o que não compartilha. Explicar `commonMain` (agnóstico de plataforma, só dependências multiplataforma) e os source sets específicos. Apresentar a tabela dos três módulos do Printec:

| Módulo | Função |
|---|---|
| `shared/` | Modelo, renderização, transporte, UI Compose e ViewModel — tudo que as duas plataformas dividem |
| `androidApp/` | Só o host Android: `Application`, `Activity`, Manifest |
| `desktopApp/` | Só o host Desktop: a função `main()` e a janela |

Explicar o source set intermediário `jvmCommonMain`, mostrando o trecho de `shared/build.gradle.kts` que o cria — o KMP não gera automaticamente um compartilhamento entre `android` e `jvm`, é preciso declarar. Deixar claro que ele existe porque o `escpos-coffee` é uma biblioteca Java que roda nas duas, mas não em `commonMain`.

**`## 🗂️ Estrutura de Arquivos`** — árvore dos três módulos com comentários `←`.

**`## Passo 1 — Clonar e abrir`** — bloco `bash` com o clone e o `git checkout base-app`.

**`## Passo 2 — settings.gradle.kts`** — bloco com `title="settings.gradle.kts" reference="base-app"`, mostrando os três `include`.

**`## Passo 3 — shared/build.gradle.kts`** — bloco com `title="shared/build.gradle.kts" reference="base-app"`. Comentar o `kotlin { jvm(); android { } }` e o bloco `sourceSets`.

**`## Passo 4 — expect/actual no scaffold`** — blocos de `Platform.kt`, `Platform.jvm.kt` e `Platform.android.kt`, todos com `reference="base-app"`. Dizer que esses três arquivos somem ao longo da trilha: o app final usa `expect`/`actual` em um lugar só, e a aula 09 mostra qual e por quê.

**`## ⚠️ Atenção`** — o build já vem completo: SQLDelight, `escpos-coffee` e `jSerialComm` estão configurados desde `base-app`. Nenhuma aula desta trilha vai editar Gradle de novo. Se o aluno vir instrução para mexer em `build.gradle.kts` depois daqui, é engano.

**`## ▶️ Como Executar`**

```bash
./gradlew :desktopApp:run
```

```bash
./gradlew :androidApp:assembleDebug
```

Descrever o resultado: a janela do Desktop abre com a tela do scaffold; o APK sai em `androidApp/build/outputs/apk/debug/`.

**`## 💻 Mão na Massa`** — `<Tabs>` com dois exercícios:
- *Exercício 1 — Onde mora o quê:* liste, sem abrir o gabarito, em qual source set (`commonMain`, `androidMain`, `jvmMain` ou `jvmCommonMain`) cada um destes viveria: uma classe que só usa `kotlin.String`; uma que importa `android.bluetooth.BluetoothAdapter`; uma que importa `javax.print.PrintService`; uma que importa `java.io.ByteArrayOutputStream` e precisa rodar nas duas plataformas. Confira sua resposta contra a árvore da seção Estrutura de Arquivos.
- *Exercício 2 — Rodar os testes:* execute `./gradlew :shared:jvmTest` e `./gradlew :shared:testAndroidHostTest` no `base-app`. Anote quantos testes rodam. Ao fim da trilha esse número passa de 20 arquivos — você vai escrever todos.

- [ ] **Step 3: Registrar no sidebar**

Em `sidebars.ts`, `ldmSidebar` passa a:

```typescript
    ldmSidebar: [
        "ldm/index",
        {
            type: "category",
            label: "Módulo 1 — Fundação",
            collapsed: false,
            items: ["ldm/aula-01"],
        },
    ],
```

- [ ] **Step 4: Verificar fidelidade**

```bash
npm run verificar:fidelidade
```

Esperado: `OK` com pelo menos 7 blocos conferidos. Se algum bloco falhar, o texto do `.mdx` divergiu do repositório — corrija o `.mdx`, nunca o critério.

- [ ] **Step 5: Build**

```bash
npm run build
```

Esperado: build concluído, `/ldm/aula-01` gerada.

- [ ] **Step 6: Commit**

```bash
git add docs/ldm/aula-01.mdx sidebars.ts
git commit -m "docs(ldm): aula 01 - setup KMP e os dois apps rodando"
```

---

### Task 3: Aula 02 — Largura, colunas e quebra de linha

**Files:**
- Create: `docs/ldm/aula-02.mdx`
- Modify: `sidebars.ts`

**Interfaces:**
- Consumes: projeto rodando (Task 2)
- Produces: `Impressora.COLUNAS_BASE = 32`, `Impressora.DOTS_LARGURA = 384`, `Impressora.DOTS_POR_MM = 8`; `QuebraDeLinha.colunasPara(escala: Int): Int` e `QuebraDeLinha.quebrar(texto: String, colunas: Int): List<String>`. As aulas 05 e 12 dependem dessas assinaturas.

- [ ] **Step 1: Extrair os arquivos reais**

```bash
git -C ../printec show main:shared/src/commonTest/kotlin/com/fatec/printec/etiqueta/QuebraDeLinhaTest.kt
git -C ../printec show main:shared/src/commonMain/kotlin/com/fatec/printec/etiqueta/Impressora.kt
git -C ../printec show main:shared/src/commonMain/kotlin/com/fatec/printec/etiqueta/QuebraDeLinha.kt
```

- [ ] **Step 2: Escrever `docs/ldm/aula-02.mdx`**

Frontmatter: `sidebar_position: 2`, `title: "Aula 02: Largura, colunas e quebra de linha"`, `description: "32 colunas, 384 dots e a regra de quebra que preview e impressora precisam dividir."`.

**`## 📖 Conceito`** — a impressora não tem noção de "palavra": ela imprime caracteres até a linha acabar e corta. Quem decide onde quebrar é o app. Explicar de onde vêm os 32 caracteres (Font A, 12×24 dots, em 384 dots de largura) e que `DOTS_LARGURA` é inferência até a etiqueta de calibração da aula 15 confirmar em papel. Explicar que escala 2 dobra a largura do glifo, então divide as colunas pela metade.

Antecipar a razão de a regra morar num objeto isolado: a aula 12 vai desenhar um preview na tela que precisa quebrar exatamente igual. Se as duas divergirem, o preview vira mentira.

**`## 🗂️ Estrutura de Arquivos`** — os dois arquivos novos em `commonMain/etiqueta/` e o teste em `commonTest/etiqueta/`.

**`## 🔴 O Teste`** — bloco com `title="shared/src/commonTest/kotlin/com/fatec/printec/etiqueta/QuebraDeLinhaTest.kt"`, arquivo inteiro. Depois:

```bash
./gradlew :shared:jvmTest --tests "com.fatec.printec.etiqueta.QuebraDeLinhaTest"
```

Esperado: **falha de compilação** — `Unresolved reference: QuebraDeLinha`. Explicar que em Kotlin o vermelho da primeira vez é o compilador, não o assert.

**`## Passo 1 — Impressora`** — bloco com `title="shared/src/commonMain/kotlin/com/fatec/printec/etiqueta/Impressora.kt"`, arquivo inteiro.

**`## Passo 2 — QuebraDeLinha`** — bloco com `title="shared/src/commonMain/kotlin/com/fatec/printec/etiqueta/QuebraDeLinha.kt"`, arquivo inteiro. Destacar os três casos: cabe na linha; quebra no último espaço da janela; palavra maior que a linha, que corta na largura em vez de descartar.

**`## ⚠️ Atenção`** — a janela do corte é `colunas + 1` caracteres, não `colunas`. É o que permite quebrar no espaço que cai exatamente na fronteira sem perder um caractere útil. Trocar por `colunas` faz o texto perder uma coluna em toda linha que quebra no limite.

**`## ▶️ Como Executar`**

```bash
./gradlew :shared:jvmTest --tests "com.fatec.printec.etiqueta.QuebraDeLinhaTest"
```

Esperado: `BUILD SUCCESSFUL`, todos os testes da classe verdes. Este é o resultado da aula.

**`## 💻 Mão na Massa`** — `<Tabs>`:
- *Exercício 1 — Escreva antes de olhar:* apague `QuebraDeLinha.kt` e reescreva só a partir do arquivo de teste, até `./gradlew :shared:jvmTest --tests "com.fatec.printec.etiqueta.QuebraDeLinhaTest"` ficar verde.
- *Exercício 2 — O caso que falta:* acrescente ao teste um caso com texto que termina em espaço e outro com dois espaços seguidos. Rode. Se passar, explique por quê a partir do código; se falhar, você achou um limite real da implementação — descreva-o em uma frase.

- [ ] **Step 3: Registrar no sidebar**

Acrescentar `"ldm/aula-02"` aos `items` de `Módulo 1 — Fundação`.

- [ ] **Step 4: Verificar fidelidade**

```bash
npm run verificar:fidelidade
```

Esperado: `OK`, com os 3 blocos novos somados aos anteriores.

- [ ] **Step 5: Build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add docs/ldm/aula-02.mdx sidebars.ts
git commit -m "docs(ldm): aula 02 - largura, colunas e quebra de linha"
```

---

### Task 4: Aula 03 — Acentuação e a code page PC860

**Files:**
- Create: `docs/ldm/aula-03.mdx`
- Modify: `sidebars.ts`

**Interfaces:**
- Consumes: nada das aulas anteriores — `Pc860` não importa nada do projeto
- Produces: `Pc860.codificar(texto: String): ResultadoCodificacao` (campos `bytes: ByteArray`, `substituidos: Int`) e `Pc860.decodificar(bytes: ByteArray): String`. A aula 05 usa `codificar`; a aula 12 usa `decodificar` no teste que compara preview e renderizador.

- [ ] **Step 1: Extrair os arquivos reais**

```bash
git -C ../printec show main:shared/src/commonTest/kotlin/com/fatec/printec/etiqueta/Pc860Test.kt
git -C ../printec show main:shared/src/commonMain/kotlin/com/fatec/printec/etiqueta/Pc860.kt
```

- [ ] **Step 2: Escrever `docs/ldm/aula-03.mdx`**

Frontmatter: `sidebar_position: 3`, `title: "Aula 03: Acentuação e a code page PC860"`, `description: "Por que 'ação' vira lixo na impressora e como uma tabela de 48 caracteres resolve."`.

**`## 📖 Conceito`** — a impressora não fala UTF-8. Ela tem code pages: tabelas de 256 posições onde 0x20–0x7E é ASCII e 0x80–0xFF muda conforme a página selecionada. A LT-8359 vem na página 3, a PC860, portuguesa. Mandar UTF-8 cru faz cada acento virar dois bytes que a impressora lê como dois caracteres errados.

Explicar a decisão que o próprio arquivo documenta: tabela em Kotlin puro em vez de `Charset.forName("cp860")`, porque o provedor de charsets do Android é reduzido e pode não incluir a PC860 — e uma tabela própria se comporta igual nas duas plataformas e é testável sem dispositivo.

Explicar por que caracteres de controle viram `?` e são contados: um `0x0A` cru criaria uma quebra que o preview não mostra, e bytes de controle carregam significado em ESC/POS.

**`## 🗂️ Estrutura de Arquivos`** — `Pc860.kt` em `commonMain/etiqueta/`, `Pc860Test.kt` em `commonTest/etiqueta/`.

**`## 🔴 O Teste`** — bloco com `title="shared/src/commonTest/kotlin/com/fatec/printec/etiqueta/Pc860Test.kt"`, arquivo inteiro, e o comando:

```bash
./gradlew :shared:jvmTest --tests "com.fatec.printec.etiqueta.Pc860Test"
```

Esperado: falha de compilação, `Unresolved reference: Pc860`.

**`## Passo 1 — Pc860`** — bloco com `title="shared/src/commonMain/kotlin/com/fatec/printec/etiqueta/Pc860.kt"`, arquivo inteiro. Chamar atenção para o comentário `/** Índice 0 corresponde ao byte 0x80. */` e para o mapa invertido `PARA_BYTE` construído a partir do array.

**`## ⚠️ Atenção`** — `decodificar` existe para um teste, não para o app. É a inversa que permite provar, na aula 12, que preview e renderizador quebram linha igual — decodificando pela mesma tabela, para o teste não depender de uma cópia paralela dela que poderia divergir sem ninguém notar.

**`## ▶️ Como Executar`** — o mesmo comando, agora esperando `BUILD SUCCESSFUL`.

**`## 💻 Mão na Massa`** — `<Tabs>`:
- *Exercício 1 — Descubra o byte:* sem rodar nada, diga qual byte a PC860 usa para `ç` e para `Ã`, lendo a tabela `ALTOS`. Depois confirme com um teste seu que chame `Pc860.codificar("ç")`.
- *Exercício 2 — O contador:* escreva um teste que passe uma string com um emoji e um `\n` e verifique que `substituidos` vale 2 e que os bytes correspondentes são `?`. Explique em uma frase por que o app quer saber esse número em vez de só substituir em silêncio.

- [ ] **Step 3: Registrar no sidebar**

Acrescentar `"ldm/aula-03"` aos `items` de `Módulo 1 — Fundação`.

- [ ] **Step 4: Verificar fidelidade**

```bash
npm run verificar:fidelidade
```

- [ ] **Step 5: Build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add docs/ldm/aula-03.mdx sidebars.ts
git commit -m "docs(ldm): aula 03 - acentuacao e a code page PC860"
```

---

### Task 5: Aula 04 — O documento da etiqueta

**Files:**
- Create: `docs/ldm/aula-04.mdx`
- Modify: `sidebars.ts`

**Interfaces:**
- Consumes: nada — `LabelDocument` é modelo puro
- Produces: `enum class Alinhamento { ESQUERDA, CENTRO, DIREITA }`; `sealed interface Bloco` com `Bloco.Titulo(texto)`, `Bloco.Linha(texto, escala = 1, alinhamento = ESQUERDA, negrito = false)`, `Bloco.Qr(conteudo, tamanhoModulo = 6)`, `Bloco.Avanco(milimetros)`; `data class LabelDocument(blocos: List<Bloco> = emptyList(), copias: Int = 1)`; `fun Bloco.normalizado(): Bloco`; `fun etiquetaDeCalibracao(): LabelDocument`. Aulas 05, 09, 11, 12, 13 e 15 dependem disso.

- [ ] **Step 1: Extrair os arquivos reais**

```bash
git -C ../printec show main:shared/src/commonTest/kotlin/com/fatec/printec/etiqueta/EtiquetaDeTesteTest.kt
git -C ../printec show main:shared/src/commonMain/kotlin/com/fatec/printec/etiqueta/LabelDocument.kt
git -C ../printec show main:shared/src/commonMain/kotlin/com/fatec/printec/etiqueta/EtiquetaDeTeste.kt
```

- [ ] **Step 2: Escrever `docs/ldm/aula-04.mdx`**

Frontmatter: `sidebar_position: 4`, `title: "Aula 04: O documento da etiqueta"`, `description: "Um modelo puro que não sabe nada sobre impressora, Compose ou plataforma."`.

**`## 📖 Conceito`** — o documento é o contrato entre tudo. A UI produz um `LabelDocument`, o preview desenha um `LabelDocument`, o renderizador transforma um `LabelDocument` em bytes e o banco guarda um `LabelDocument`. Por isso ele não importa Compose nem nada de plataforma: se importasse, arrastaria essas dependências para todos os quatro.

Explicar `sealed interface`: o compilador sabe a lista fechada de blocos, então o `when` do renderizador (aula 05) não precisa de `else` e quebra na compilação se alguém acrescentar um tipo novo e esquecer de tratá-lo.

Explicar `normalizado()`: `Titulo` é açúcar para `Linha(escala = 2, CENTRO)`, e o renderizador e o preview tratam um caso a menos. E o detalhe que só o hardware ensina — sem negrito de propósito, porque a LT-8359 imprime ênfase como duplo impacto deslocado, e em largura 2x esse segundo impacto cai dentro do próprio glifo e borra o título.

**`## 🗂️ Estrutura de Arquivos`** — os dois arquivos e o teste.

**`## 🔴 O Teste`** — bloco com `title="shared/src/commonTest/kotlin/com/fatec/printec/etiqueta/EtiquetaDeTesteTest.kt"`, arquivo inteiro, e:

```bash
./gradlew :shared:jvmTest --tests "com.fatec.printec.etiqueta.EtiquetaDeTesteTest"
```

Esperado: falha de compilação.

**`## Passo 1 — LabelDocument`** — bloco com `title="shared/src/commonMain/kotlin/com/fatec/printec/etiqueta/LabelDocument.kt"`, arquivo inteiro.

**`## Passo 2 — A etiqueta de calibração`** — bloco com `title="shared/src/commonMain/kotlin/com/fatec/printec/etiqueta/EtiquetaDeTeste.kt"`, arquivo inteiro. Explicar que a régua de 32 caracteres serve para confirmar em papel a largura que hoje é inferência, e que essa etiqueta é a primeira ferramenta de diagnóstico: se ela imprime, o problema está no conteúdo, não na conexão. A aula 15 imprime esta etiqueta de verdade.

**`## ⚠️ Atenção`** — `normalizado()` tem um `error()` no ramo `Titulo` do renderizador, não um `else` silencioso. É proposital: se um dia alguém chamar o renderizador sem normalizar, o app falha alto em vez de imprimir um título errado sem ninguém perceber.

**`## ▶️ Como Executar`** — o comando acima, esperando verde.

**`## 💻 Mão na Massa`** — `<Tabs>`:
- *Exercício 1 — O `when` exaustivo:* acrescente um `data class CodigoDeBarras(val conteudo: String) : Bloco` ao sealed interface e rode `./gradlew :shared:compileKotlinJvm`. Anote a mensagem de erro. Depois desfaça. Você acabou de ver a rede de proteção que o sealed dá ao renderizador da próxima aula.
- *Exercício 2 — Sua etiqueta:* escreva uma função `minhaEtiqueta(): LabelDocument` com um título, três linhas, um QR e um avanço de 5 mm. Escreva um teste que verifique a quantidade e a ordem dos blocos após `normalizado()`.

- [ ] **Step 3: Registrar no sidebar**

Criar a categoria e o item:

```typescript
        {
            type: "category",
            label: "Módulo 2 — O documento e os bytes",
            items: ["ldm/aula-04"],
        },
```

- [ ] **Step 4: Verificar fidelidade**

```bash
npm run verificar:fidelidade
```

- [ ] **Step 5: Build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add docs/ldm/aula-04.mdx sidebars.ts
git commit -m "docs(ldm): aula 04 - o documento da etiqueta"
```

---

### Task 6: Aula 05 — Renderizar ESC/POS

**Files:**
- Create: `docs/ldm/aula-05.mdx`
- Modify: `sidebars.ts`

**Interfaces:**
- Consumes: `Impressora`, `QuebraDeLinha` (aula 02), `Pc860` (aula 03), `LabelDocument`, `Bloco`, `Alinhamento`, `normalizado()` (aula 04)
- Produces: `EscPosRenderer.renderizar(documento: LabelDocument, avancoFinalMm: Int): ByteArray`. As aulas 11, 13 e 14 passam essa função como parâmetro ao ViewModel.

- [ ] **Step 1: Extrair os arquivos reais**

```bash
git -C ../printec show main:shared/src/jvmCommonTest/kotlin/com/fatec/printec/impressao/EscPosCoffeeVivoTest.kt
git -C ../printec show main:shared/src/jvmCommonTest/kotlin/com/fatec/printec/impressao/EscPosRendererTest.kt
git -C ../printec show main:shared/src/jvmCommonMain/kotlin/com/fatec/printec/impressao/EscPosRenderer.kt
```

- [ ] **Step 2: Escrever `docs/ldm/aula-05.mdx`**

Frontmatter: `sidebar_position: 5`, `title: "Aula 05: Renderizar ESC/POS"`, `description: "Do documento aos bytes que a impressora entende — inclusive o QR Code na mão."`.

**`## 📖 Conceito`** — ESC/POS é uma linguagem de bytes. Apresentar a tabela dos comandos que o renderizador usa:

| Comando | Bytes | O que faz |
|---|---|---|
| `ESC @` | `1B 40` | Inicializa a impressora |
| `ESC t n` | `1B 74 03` | Seleciona a code page (3 = PC860) |
| `ESC a n` | `1B 61 n` | Alinhamento: 0 esquerda, 1 centro, 2 direita |
| `GS ! n` | `1D 21 n` | Escala: nibble alto largura, nibble baixo altura, 0-based |
| `ESC E n` | `1B 45 n` | Negrito liga/desliga |
| `ESC J n` | `1B 4A n` | Avança n dots |
| `GS ( k` | `1D 28 6B …` | Família de comandos de QR Code |

Explicar por que este arquivo vive em `jvmCommonMain` e não em `commonMain`: ele usa `java.io.ByteArrayOutputStream`, que existe na JVM e no Android mas não é multiplataforma. É exatamente o caso que justificou o source set intermediário da aula 01.

Explicar por que o QR é escrito à mão em vez de usar o `QRCode` do `escpos-coffee`: aquela classe dimensiona o payload em **caracteres** e escreve **bytes**, truncando qualquer conteúdo não-ASCII em silêncio. QR guarda bytes, e UTF-8 é o que os leitores esperam.

**`## 🗂️ Estrutura de Arquivos`** — `EscPosRenderer.kt` em `jvmCommonMain/impressao/`, os dois testes em `jvmCommonTest/impressao/`.

**`## 🔴 O Teste`** — dois blocos, arquivos inteiros, com os caminhos completos:
`EscPosCoffeeVivoTest.kt` primeiro (prova que a biblioteca carrega e escreve `1B 40`), depois `EscPosRendererTest.kt`. E o comando:

```bash
./gradlew :shared:jvmTest --tests "com.fatec.printec.impressao.*"
```

Esperado: `EscPosCoffeeVivoTest` passa, `EscPosRendererTest` falha na compilação.

**`## Passo 1 — EscPosRenderer`** — bloco com `title="shared/src/jvmCommonMain/kotlin/com/fatec/printec/impressao/EscPosRenderer.kt"`, arquivo inteiro. Percorrer as funções privadas uma a uma: `escreverLinha` (alinhamento, escala, negrito, quebra, codificação, LF), `escreverQr` (os quatro comandos `GS ( k` e o cálculo de `n = dados.size + 3`), `avancar` (mm × 8 dots, limitado a 255) e `tamanho` (o deslocamento de nibble).

**`## ⚠️ Atenção`** — `ESC t 3` é enviado **sempre**, em toda impressão, mesmo tendo a PC860 como padrão de fábrica. A impressora guarda estado entre trabalhos; se qualquer outra coisa tiver mudado a code page, a etiqueta seguinte sairia com acentuação errada sem explicação. Inicializar em vez de assumir custa dois bytes.

**`## ▶️ Como Executar`** — o comando acima, agora com tudo verde. O aluno vê os bytes conferidos um a um pelos asserts.

**`## 💻 Mão na Massa`** — `<Tabs>`:
- *Exercício 1 — Leia os bytes:* escreva um teste que renderize `LabelDocument(listOf(Bloco.Linha("OI")))` com `avancoFinalMm = 0` e imprima o resultado em hexadecimal com `println(bytes.joinToString(" ") { "%02X".format(it) })`. Identifique na saída cada comando da tabela do Conceito.
- *Exercício 2 — A escala:* calcule à mão qual valor `GS ! n` recebe para escala 3 e confira com um teste. Depois explique por que `coerceIn(0, 7)` está lá.

- [ ] **Step 3: Registrar no sidebar**

Acrescentar `"ldm/aula-05"` aos `items` de `Módulo 2`.

- [ ] **Step 4: Verificar fidelidade**

```bash
npm run verificar:fidelidade
```

- [ ] **Step 5: Build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add docs/ldm/aula-05.mdx sidebars.ts
git commit -m "docs(ldm): aula 05 - renderizar ESC/POS"
```

---

### Task 7: Aula 06 — O contrato de saída

**Files:**
- Create: `docs/ldm/aula-06.mdx`
- Modify: `sidebars.ts`

**Interfaces:**
- Consumes: nada — os dois arquivos são independentes
- Produces: `data class PrinterTarget(id: String, nome: String)`; `sealed class ErroImpressao` com `NaoPareada`, `PermissaoNegada`, `NenhumaImpressoraSelecionada`, `FalhaAoConectar(causa)`, `FalhaAoEscrever(causa)`, `FalhaAoPreparar(causa)`; `interface PrinterTransport { suspend fun listarDestinos(): List<PrinterTarget>; suspend fun imprimir(destino: PrinterTarget, bytes: ByteArray) }`; `EscritaEmBlocos.escrever(bytes, pausar, escrever)` com as constantes `BYTES_POR_BLOCO = 256`, `PAUSA_ENTRE_BLOCOS_MS = 20L`, `DRENAGEM_FINAL_MS = 600L`. Aulas 07, 08, 11 e 13 dependem disso.

- [ ] **Step 1: Extrair os arquivos reais**

```bash
git -C ../printec show main:shared/src/commonTest/kotlin/com/fatec/printec/impressao/EscritaEmBlocosTest.kt
git -C ../printec show main:shared/src/commonMain/kotlin/com/fatec/printec/impressao/PrinterTransport.kt
git -C ../printec show main:shared/src/commonMain/kotlin/com/fatec/printec/impressao/EscritaEmBlocos.kt
```

- [ ] **Step 2: Escrever `docs/ldm/aula-06.mdx`**

Frontmatter: `sidebar_position: 6`, `title: "Aula 06: O contrato de saída"`, `description: "Erros tipados porque falhar é rotina, e por que escrever tudo de uma vez perde o fim da etiqueta."`.

**`## 📖 Conceito`** — duas ideias, ambas ditadas pelo hardware.

A primeira: falha de impressora **não é exceção rara, é fluxo normal** — a LT-8359 hiberna sozinha em 10 minutos. Por isso cada erro é um tipo, e cada tipo vira uma mensagem com uma ação concreta na UI (a aula 13 monta essa tela). Comparar com o alternativo: uma `Exception` genérica só permitiria "algo deu errado".

A segunda: a impressora aceita pelo enlace Bluetooth muito mais rápido do que o cabeçote térmico imprime. Quando o buffer de entrada dela lota, ela não segura o remetente — descarta o excedente em silêncio. O sintoma não é um erro: é uma etiqueta sutilmente errada, com comandos comidos no meio e, pior, o fim do documento perdido, que é justamente onde mora o avanço final. Daí os três números: 256 bytes por bloco, 20 ms entre blocos, 600 ms de drenagem no fim porque quem chama fecha a conexão logo depois, e fechar em cima de bytes ainda não consumidos os joga fora.

Explicar a assinatura de `escrever`: recebe `pausar` e `escrever` como funções, então a política de vazão fica em `commonMain` e testável, sem depender de socket nem de porta serial.

**`## 🗂️ Estrutura de Arquivos`** — os dois arquivos em `commonMain/impressao/` e o teste em `commonTest/impressao/`.

**`## 🔴 O Teste`** — bloco com `title="shared/src/commonTest/kotlin/com/fatec/printec/impressao/EscritaEmBlocosTest.kt"`, arquivo inteiro, e:

```bash
./gradlew :shared:jvmTest --tests "com.fatec.printec.impressao.EscritaEmBlocosTest"
```

Esperado: falha de compilação.

**`## Passo 1 — PrinterTransport e ErroImpressao`** — bloco com `title="shared/src/commonMain/kotlin/com/fatec/printec/impressao/PrinterTransport.kt"`, arquivo inteiro. Destacar o comentário do `imprimir`: abre, escreve e fecha; nunca mantém a conexão aberta entre trabalhos.

**`## Passo 2 — EscritaEmBlocos`** — bloco com `title="shared/src/commonMain/kotlin/com/fatec/printec/impressao/EscritaEmBlocos.kt"`, arquivo inteiro.

**`## ⚠️ Atenção`** — `DRENAGEM_FINAL_MS = 600` cobre o maior avanço configurável (30 mm a ~50 mm/s) com folga. É este o número a aumentar se a cauda da impressão voltar a sumir — e o comentário no código diz isso justamente para quem for depurar daqui a um ano.

**`## ▶️ Como Executar`** — o comando acima, verde.

**`## 💻 Mão na Massa`** — `<Tabs>`:
- *Exercício 1 — Conte as pausas:* escreva um teste que chame `EscritaEmBlocos.escrever` com 700 bytes, acumulando as durações recebidas por `pausar` numa lista. Verifique que a lista é `[20, 20, 600]` e explique por que a primeira pausa não acontece antes do primeiro bloco.
- *Exercício 2 — O erro certo:* para cada situação, diga qual `ErroImpressao` o app deve produzir: usuário nunca escolheu impressora; impressora escolhida está desligada; permissão de Bluetooth negada no Android; falha ao gravar o rascunho no banco antes de imprimir. Justifique cada uma em uma linha.

- [ ] **Step 3: Registrar no sidebar**

Acrescentar `"ldm/aula-06"` aos `items` de `Módulo 2`.

- [ ] **Step 4: Verificar fidelidade**

```bash
npm run verificar:fidelidade
```

- [ ] **Step 5: Build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add docs/ldm/aula-06.mdx sidebars.ts
git commit -m "docs(ldm): aula 06 - o contrato de saida"
```

---

### Task 8: Aula 07 — Bluetooth SPP no Android

**Files:**
- Create: `docs/ldm/aula-07.mdx`
- Modify: `sidebars.ts`

**Interfaces:**
- Consumes: `PrinterTransport`, `PrinterTarget`, `ErroImpressao`, `EscritaEmBlocos` (aula 06)
- Produces: `class AndroidBluetoothTransport(context: Context) : PrinterTransport`, com `companion object { val UUID_SPP: UUID }`. A aula 14 instancia essa classe em `PrintecApp`.

- [ ] **Step 1: Extrair os arquivos reais**

```bash
git -C ../printec show main:shared/src/androidHostTest/kotlin/com/fatec/printec/impressao/AndroidBluetoothTransportTest.kt
git -C ../printec show main:shared/src/androidMain/kotlin/com/fatec/printec/impressao/AndroidBluetoothTransport.kt
```

- [ ] **Step 2: Escrever `docs/ldm/aula-07.mdx`**

Frontmatter: `sidebar_position: 7`, `title: "Aula 07: Bluetooth SPP no Android"`, `description: "RFCOMM sobre dispositivos pareados, e as três armadilhas que derrubam o app."`.

**`## 📖 Conceito`** — Bluetooth clássico, perfil SPP (Serial Port Profile): um socket RFCOMM que se comporta como um fluxo de bytes. O UUID `00001101-0000-1000-8000-00805F9B34FB` é o identificador padrão do SPP — não é escolha do app, é da especificação.

Explicar a decisão de **não fazer descoberta nem pareamento dentro do app**, com os dois motivos que o código registra: descoberta na API 28 exigiria permissão de localização em runtime; e a impressora, que hiberna em 10 minutos, não aparece na varredura quando está dormindo. A lista de pareados a mostra mesmo desligada. Quem pareia é o sistema operacional, uma vez.

Explicar o modelo de permissão: `BLUETOOTH` e `BLUETOOTH_ADMIN` até a API 30, concedidas na instalação; `BLUETOOTH_CONNECT` da API 31 em diante, pedida em runtime. A aula 14 mostra o Manifest e o pedido.

**`## 🗂️ Estrutura de Arquivos`** — o arquivo em `androidMain/impressao/` e o teste em `androidHostTest/impressao/`. Explicar a diferença entre `androidHostTest` (roda na JVM da máquina, rápido) e `androidDeviceTest` (precisa de aparelho ou emulador).

**`## 🔴 O Teste`** — bloco com `title="shared/src/androidHostTest/kotlin/com/fatec/printec/impressao/AndroidBluetoothTransportTest.kt"`, arquivo inteiro, e:

```bash
./gradlew :shared:testAndroidHostTest
```

Esperado: falha de compilação. Chamar atenção para o comando ser diferente do das aulas anteriores.

**`## Passo 1 — AndroidBluetoothTransport`** — bloco com `title="shared/src/androidMain/kotlin/com/fatec/printec/impressao/AndroidBluetoothTransport.kt"`, arquivo inteiro. Percorrer o fluxo do `imprimir`: exigir permissão → adaptador → verificar se está ligado → achar o pareado → criar socket → conectar → escrever em blocos → fechar sempre.

**`## ⚠️ Atenção`** — três armadilhas reais, cada uma com o sintoma que a revelou:

1. **Bluetooth desligado ≠ impressora não pareada.** O pareamento sobrevive ao desligar o rádio. Sem a checagem de `isEnabled`, o usuário veria "não pareada" com a impressora pareada havia meses.
2. **`bondedDevices` pode lançar `SecurityException` mesmo com a permissão concedida** em alguns fabricantes — checar permissão e acessar de fato não são atômicos. Sem o `try/catch`, essa exceção não tipada derrubava o app.
3. **Fechar o socket no `finally`, sempre.** Inclusive quando `connect()` falha, com `runCatching { socket.close() }` — um socket vazado impede a conexão seguinte.

**`## ▶️ Como Executar`**

```bash
./gradlew :shared:testAndroidHostTest
```

Esperado: `BUILD SUCCESSFUL`. Deixar explícito que este teste não fala com hardware nenhum: ele exercita as decisões da classe. Papel só sai na aula 14.

**`## 💻 Mão na Massa`** — `<Tabs>`:
- *Exercício 1 — O UUID:* pesquise por que `00001101-…` é chamado de "UUID do SPP" e escreva duas linhas explicando o que aconteceria se você inventasse outro.
- *Exercício 2 — A permissão que falta:* remova temporariamente a chamada a `exigirPermissao()` de `listarDestinos()`, rode `./gradlew :shared:testAndroidHostTest` e anote qual teste quebra. Restaure. Você acabou de ver o teste que protege o primeiro uso do app.

- [ ] **Step 3: Registrar no sidebar**

```typescript
        {
            type: "category",
            label: "Módulo 3 — Bluetooth e Impressora",
            items: ["ldm/aula-07"],
        },
```

- [ ] **Step 4: Verificar fidelidade**

```bash
npm run verificar:fidelidade
```

- [ ] **Step 5: Build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add docs/ldm/aula-07.mdx sidebars.ts
git commit -m "docs(ldm): aula 07 - bluetooth SPP no android"
```

---

### Task 9: Aula 08 — USB e serial no Desktop

**Files:**
- Create: `docs/ldm/aula-08.mdx`
- Modify: `sidebars.ts`

**Interfaces:**
- Consumes: `PrinterTransport`, `PrinterTarget`, `ErroImpressao`, `EscritaEmBlocos` (aula 06)
- Produces: `class DesktopUsbTransport : PrinterTransport`, `class DesktopSerialTransport : PrinterTransport`, `class TransporteDesktop(usb: PrinterTransport = DesktopUsbTransport(), serial: PrinterTransport = DesktopSerialTransport()) : PrinterTransport`. A aula 13 instancia `TransporteDesktop()` em `main.kt`.

- [ ] **Step 1: Extrair os arquivos reais**

```bash
git -C ../printec show main:shared/src/jvmTest/kotlin/com/fatec/printec/impressao/TransporteDesktopTest.kt
git -C ../printec show main:shared/src/jvmTest/kotlin/com/fatec/printec/impressao/DesktopUsbTransportTest.kt
git -C ../printec show main:shared/src/jvmMain/kotlin/com/fatec/printec/impressao/DesktopUsbTransport.kt
git -C ../printec show main:shared/src/jvmMain/kotlin/com/fatec/printec/impressao/DesktopSerialTransport.kt
git -C ../printec show main:shared/src/jvmMain/kotlin/com/fatec/printec/impressao/TransporteDesktop.kt
```

- [ ] **Step 2: Escrever `docs/ldm/aula-08.mdx`**

Frontmatter: `sidebar_position: 8`, `title: "Aula 08: USB e serial no Desktop"`, `description: "A JVM não tem Bluetooth — e por que isso não impede o Desktop de imprimir por Bluetooth."`.

**`## 📖 Conceito`** — a revelação da aula: **a JVM não tem Bluetooth nativo, e mesmo assim o Desktop imprime por Bluetooth**. No Windows, parear a LT-8359 cria uma porta COM virtual (perfil SPP), e escrever nessa porta é escrever na impressora. Da ótica do usuário é "conectar por Bluetooth"; deste lado é serial. É o mesmo enlace da aula 07, exposto por outra API.

Explicar os dois caminhos do Desktop e por que ambos existem: USB passa pelo spooler do Windows (`javax.print`), Bluetooth passa pela porta COM (`jSerialComm`). E o roteador que apresenta os dois como uma lista só.

Explicar por que o tipo viaja **dentro do id** (`usb:` / `serial:`) em vez de ser adivinhado pelo formato do nome: adivinhar por "parece COM alguma coisa" funcionaria até o dia em que uma impressora USB se chamasse algo parecido. Determinismo em vez de heurística.

**`## 🗂️ Estrutura de Arquivos`** — os três arquivos em `jvmMain/impressao/` e os dois testes em `jvmTest/impressao/`.

**`## 🔴 O Teste`** — dois blocos, arquivos inteiros: `TransporteDesktopTest.kt` e `DesktopUsbTransportTest.kt`. Explicar por que só o roteamento é testado de verdade: é a única lógica aqui que não depende de hardware, e as duas implementações por trás são injetáveis exatamente para permitir isso. E:

```bash
./gradlew :shared:jvmTest --tests "com.fatec.printec.impressao.*Desktop*"
```

Esperado: falha de compilação.

**`## Passo 1 — DesktopUsbTransport`** — bloco com o caminho completo, arquivo inteiro.

**`## Passo 2 — DesktopSerialTransport`** — bloco com o caminho completo, arquivo inteiro. Destacar que os parâmetros `9600, 8, ONE_STOP_BIT, NO_PARITY` são ignorados numa porta COM virtual de SPP — quem manda é o enlace Bluetooth — e ficam fixos até algum teste com hardware mostrar o contrário.

**`## Passo 3 — TransporteDesktop`** — bloco com o caminho completo, arquivo inteiro. Destacar o ramo `else -> usb to id` do `rotear`: é compatibilidade com configuração salva antes de o Bluetooth existir, que era USB por definição. Sem isso, quem já tinha uma impressora escolhida veria a impressão falhar sem entender por quê.

**`## ⚠️ Atenção`** — duas coisas.

Primeira: **isto é específico do Windows.** A porta COM virtual é o caminho do Windows; em Linux e macOS o dispositivo pareado aparece com outro nome (`/dev/rfcomm0`, por exemplo) e o `jSerialComm` o enumera de forma diferente. O app não finge portabilidade aqui.

Segunda: **nenhuma exceção crua pode escapar de um transporte.** `PrintServiceLookup` estoura sozinho em casos reais — spooler em mau estado, entrada de driver corrompida. A UI só sabe tratar `ErroImpressao`; uma exceção não tipada atravessaria a corrotina e derrubaria o app.

**`## ▶️ Como Executar`**

```bash
./gradlew :shared:jvmTest --tests "com.fatec.printec.impressao.*Desktop*"
```

Esperado: verde. Sugerir o segundo resultado visível: rodar um `main()` de rascunho, ou um teste temporário, que imprima `TransporteDesktop().listarDestinos()` — o aluno vê as impressoras e portas COM da própria máquina, com os prefixos `usb:` e `serial:`.

**`## 💻 Mão na Massa`** — `<Tabs>`:
- *Exercício 1 — Roteie na mão:* para os ids `usb:Microsoft Print to PDF`, `serial:COM3` e `COM3` (sem prefixo), diga para qual transporte cada um vai e com qual id chega lá. Confira lendo `rotear`.
- *Exercício 2 — Liste sua máquina:* escreva um teste que chame `TransporteDesktop().listarDestinos()` e imprima o resultado. Identifique quais entradas são impressoras de verdade e quais são virtuais. Se você já pareou uma impressora Bluetooth, procure por "Standard Serial over Bluetooth link".

- [ ] **Step 3: Registrar no sidebar**

Acrescentar `"ldm/aula-08"` aos `items` de `Módulo 3`.

- [ ] **Step 4: Verificar fidelidade**

```bash
npm run verificar:fidelidade
```

- [ ] **Step 5: Build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add docs/ldm/aula-08.mdx sidebars.ts
git commit -m "docs(ldm): aula 08 - USB e serial no desktop"
```

---

### Task 10: Aula 09 — Banco nas duas plataformas

**Files:**
- Create: `docs/ldm/aula-09.mdx`
- Modify: `sidebars.ts`

**Interfaces:**
- Consumes: `LabelDocument` (aula 04)
- Produces: o schema `Printec.sq` (tabelas `etiqueta`, `bloco`, `configuracao` e as queries nomeadas); `enum class PerfilMidia { CONTINUO, GAP }`; `data class Configuracoes(impressoraId, impressoraNome, perfilMidia, avancoFinalMm)`; `data class EtiquetaSalva(id, nome, documento)`; `interface LabelStore` com `configuracoes()`, `etiquetasSalvas()`, `salvarConfiguracoes()`, `salvarEtiqueta()`, `excluirEtiqueta()`, `salvarRascunho()`, `carregarRascunho()`; `interface FabricaDeDriver { fun criar(): SqlDriver }`; `class DriverAndroid(context)` e `class DriverDesktop(diretorio: File = diretorioPadrao())`. Aulas 10, 11, 13 e 14 dependem disso.

**Nota de correção (Ruling 1 do pre-flight):** `Relogio.android.kt` e `Relogio.jvm.kt` NÃO entram nesta aula. São declarações `actual` cujo `expect agoraEmMillis()` mora dentro de `LabelStoreSqlDelight.kt`, que só chega na aula 10 — um `actual` sem `expect` não compila, e esta aula não ficaria verde. Os dois arquivos foram movidos para a Task 11.

- [ ] **Step 1: Extrair os arquivos reais**

```bash
git -C ../printec show main:shared/src/jvmTest/kotlin/com/fatec/printec/dados/DriverDesktopTest.kt
git -C ../printec show main:shared/src/commonMain/sqldelight/com/fatec/printec/db/Printec.sq
git -C ../printec show main:shared/src/commonMain/kotlin/com/fatec/printec/dados/LabelStore.kt
git -C ../printec show main:shared/src/commonMain/kotlin/com/fatec/printec/dados/FabricaDeDriver.kt
git -C ../printec show main:shared/src/androidMain/kotlin/com/fatec/printec/dados/DriverAndroid.kt
git -C ../printec show main:shared/src/jvmMain/kotlin/com/fatec/printec/dados/DriverDesktop.kt
```

- [ ] **Step 2: Escrever `docs/ldm/aula-09.mdx`**

Frontmatter: `sidebar_position: 9`, `title: "Aula 09: Banco nas duas plataformas"`, `description: "SQLDelight, o schema da etiqueta e a única vez que este projeto usa expect/actual."`.

**`## 📖 Conceito`** — SQLDelight parte do SQL: você escreve o schema e as queries em `.sq`, e ele gera Kotlin tipado a partir disso. O que muda por plataforma não é o SQL, é o **driver**.

Apresentar o schema: `etiqueta` (com a coluna `eh_rascunho`, que faz o rascunho ser só uma etiqueta marcada em vez de uma tabela separada), `bloco` (com `ON DELETE CASCADE` e o índice por `(etiqueta_id, ordem)`) e `configuracao` (linha única, garantida pelo `CHECK (id = 0)`).

Explicar a decisão que o próprio código documenta e que contraria a expectativa: **`FabricaDeDriver` é uma interface, não `expect`/`actual`**. O motivo está no comentário do arquivo — o Android precisa de `Context` no construtor e o Desktop de um caminho de arquivo. `expect`/`actual` exige a mesma assinatura nas duas plataformas; uma interface deixa cada app montar o seu e injetar.

Fechar dizendo onde `expect`/`actual` **de fato** aparece neste projeto — uma vez só, e na aula 10, junto do arquivo que declara o `expect`. Deixar o gancho, sem mostrar o código aqui.

**`## 🗂️ Estrutura de Arquivos`** — `Printec.sq` em `commonMain/sqldelight/com/fatec/printec/db/`, os três de `commonMain/dados/` e os dois drivers.

**`## 🔴 O Teste`** — bloco com `title="shared/src/jvmTest/kotlin/com/fatec/printec/dados/DriverDesktopTest.kt"`, arquivo inteiro, e:

```bash
./gradlew :shared:jvmTest --tests "com.fatec.printec.dados.DriverDesktopTest"
```

Esperado: falha de compilação.

**`## Passo 1 — O schema`** — bloco com `title="shared/src/commonMain/sqldelight/com/fatec/printec/db/Printec.sq"`, arquivo inteiro.

**`## Passo 2 — LabelStore e FabricaDeDriver`** — dois blocos, arquivos inteiros.

**`## Passo 3 — Os drivers`** — `DriverAndroid.kt` e `DriverDesktop.kt`, arquivos inteiros.

**`## ⚠️ Atenção`** — a migração do `DriverDesktop` é o trecho mais sutil da aula, e o comentário do código conta a história inteira: `arquivo.exists()` não diz em qual versão de schema o arquivo está, e `PRAGMA user_version = 0` significa **duas coisas diferentes** — banco novo, ou banco antigo criado antes de a classe passar a gravar a versão, já com as tabelas populadas. Sem distinguir os dois casos, `Schema.create()` roda contra tabelas existentes (o `Printec.sq` não usa `IF NOT EXISTS`) e todo banco pré-existente falharia com "table etiqueta already exists". Daí a checagem `tabelaEtiquetaExiste`.

Mencionar também o `foreign_keys` passado como propriedade de conexão, e não como um `PRAGMA` executado uma vez: num banco em arquivo o `JdbcSqliteDriver` abre e fecha uma conexão por statement, então o PRAGMA valeria só para a conexão que morre em seguida.

**`## ▶️ Como Executar`**

```bash
./gradlew :shared:jvmTest --tests "com.fatec.printec.dados.DriverDesktopTest"
```

Esperado: verde. E o resultado visível extra — o arquivo existe de verdade:

```bash
dir %APPDATA%\Printec
```

O aluno vê `printec.db` no disco. Registrar que em Linux e macOS o caminho é `~/.printec`, conforme `diretorioPadrao()`.

**`## 💻 Mão na Massa`** — `<Tabs>`:
- *Exercício 1 — Abra o banco:* abra `printec.db` num visualizador de SQLite e confira as três tabelas e o índice. Rode `PRAGMA user_version;` e compare com `PrintecDatabase.Schema.version`.
- *Exercício 2 — O caso do banco antigo:* escreva um teste que crie o banco, zere `user_version` com `PRAGMA user_version = 0;` e chame `DriverDesktop().criar()` de novo. Verifique que não estoura. Explique em duas linhas qual ramo do `when` salvou a situação.

- [ ] **Step 3: Registrar no sidebar**

```typescript
        {
            type: "category",
            label: "Módulo 4 — Estado e persistência",
            items: ["ldm/aula-09"],
        },
```

- [ ] **Step 4: Verificar fidelidade**

```bash
npm run verificar:fidelidade
```

- [ ] **Step 5: Build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add docs/ldm/aula-09.mdx sidebars.ts
git commit -m "docs(ldm): aula 09 - banco nas duas plataformas"
```

---

### Task 11: Aula 10 — O store SQLDelight

**Files:**
- Create: `docs/ldm/aula-10.mdx`
- Modify: `sidebars.ts`

**Interfaces:**
- Consumes: `LabelStore`, `Configuracoes`, `EtiquetaSalva`, `PerfilMidia`, `FabricaDeDriver` (aula 09); `LabelDocument`, `Bloco`, `Alinhamento` (aula 04)
- Produces: `class LabelStoreSqlDelight(driver: SqlDriver) : LabelStore`, a declaração `internal expect fun agoraEmMillis(): Long` e os dois `actual` correspondentes. As aulas 11, 13 e 14 instanciam esta classe.

**Nota de correção (Ruling 1 do pre-flight):** `Relogio.android.kt` e `Relogio.jvm.kt` vieram da Task 10 para cá. O `expect agoraEmMillis()` é declarado dentro de `LabelStoreSqlDelight.kt`; separar o `expect` dos `actual` em aulas diferentes deixaria a aula 09 sem compilar.

- [ ] **Step 1: Extrair os arquivos reais**

```bash
git -C ../printec show main:shared/src/jvmTest/kotlin/com/fatec/printec/dados/LabelStoreTest.kt
git -C ../printec show main:shared/src/commonMain/kotlin/com/fatec/printec/dados/LabelStoreSqlDelight.kt
git -C ../printec show main:shared/src/androidMain/kotlin/com/fatec/printec/dados/Relogio.android.kt
git -C ../printec show main:shared/src/jvmMain/kotlin/com/fatec/printec/dados/Relogio.jvm.kt
```

- [ ] **Step 2: Escrever `docs/ldm/aula-10.mdx`**

Frontmatter: `sidebar_position: 10`, `title: "Aula 10: O store SQLDelight"`, `description: "Do LabelDocument para as tabelas e de volta, com Flow reagindo a mudanças."`.

**`## 📖 Conceito`** — o store é o tradutor entre dois formatos: o `LabelDocument` do modelo, que é uma lista de blocos tipados, e as tabelas, que são linhas com `tipo` em texto. Explicar como cada `Bloco` vira uma linha de `bloco` e como a leitura reconstrói o sealed a partir da coluna `tipo`.

Explicar o `Flow`: `configuracoes()` e `etiquetasSalvas()` devolvem fluxos que reemitem quando o banco muda — é o que faz a lista de etiquetas da aula 13 se atualizar sozinha depois de salvar, sem ninguém chamar "recarregar".

Explicar `garantirConfiguracao`: a linha 0 é criada com `INSERT OR IGNORE` antes de toda leitura, para `lerConfiguracao` nunca voltar vazia.

Explicar o par `expect`/`actual` que aparece aqui — o único do projeto. `agoraEmMillis()` é declarado `internal expect` dentro de `LabelStoreSqlDelight.kt` e realizado em `Relogio.android.kt` e `Relogio.jvm.kt`, 104 bytes cada. É a ferramenta certa exatamente porque a assinatura é idêntica dos dois lados — ao contrário de `FabricaDeDriver` na aula 09, onde as assinaturas divergem e por isso o projeto usa interface. Ligar de volta ao `Platform.kt` do scaffold, que a aula 01 mostrou e que já não existe.

**`## 🗂️ Estrutura de Arquivos`** — o arquivo em `commonMain/dados/`, os dois `Relogio.*` em `androidMain/dados/` e `jvmMain/dados/`, e o teste em `jvmTest/dados/`.

**`## 🔴 O Teste`** — bloco com `title="shared/src/jvmTest/kotlin/com/fatec/printec/dados/LabelStoreTest.kt"`, arquivo inteiro, e:

```bash
./gradlew :shared:jvmTest --tests "com.fatec.printec.dados.LabelStoreTest"
```

Esperado: falha de compilação.

**`## Passo 1 — LabelStoreSqlDelight`** — bloco com `title="shared/src/commonMain/kotlin/com/fatec/printec/dados/LabelStoreSqlDelight.kt"`, arquivo inteiro. Como é o maior arquivo de `commonMain/dados/`, percorrer por partes: a declaração `expect` do relógio, a leitura de configurações, a escrita, a serialização dos blocos e a reconstrução.

**`## Passo 2 — O relógio (expect/actual)`** — os dois `Relogio.*`, arquivos inteiros, com os caminhos completos. Sem eles a compilação não fecha: um `expect` sem `actual` é erro tanto quanto o contrário.

**`## ⚠️ Atenção`** — o rascunho não é uma tabela à parte: é uma etiqueta com `eh_rascunho = 1`, e `excluirRascunhos` roda antes de gravar o novo. Um rascunho por vez, por construção — não por convenção que alguém precisa lembrar de respeitar.

**`## ▶️ Como Executar`** — o comando acima, verde.

**`## 💻 Mão na Massa`** — `<Tabs>`:
- *Exercício 1 — Ida e volta:* escreva um teste que salve um `LabelDocument` com um bloco de cada tipo (`Titulo`, `Linha` com escala e alinhamento, `Qr`, `Avanco`), releia e compare com o original. Se algum campo não voltar igual, você achou uma perda na serialização — descreva qual.
- *Exercício 2 — O Flow reage:* colete `etiquetasSalvas()` numa lista, salve uma etiqueta nova e verifique que a coleta recebeu duas emissões. Explique em uma linha por que a tela de etiquetas salvas não precisa de botão "atualizar".

- [ ] **Step 3: Registrar no sidebar**

Acrescentar `"ldm/aula-10"` aos `items` de `Módulo 4`.

- [ ] **Step 4: Verificar fidelidade**

```bash
npm run verificar:fidelidade
```

- [ ] **Step 5: Build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add docs/ldm/aula-10.mdx sidebars.ts
git commit -m "docs(ldm): aula 10 - o store SQLDelight"
```

---

### Task 12: Aula 11 — A máquina de estados da impressão

**Files:**
- Create: `docs/ldm/aula-11.mdx`
- Modify: `sidebars.ts`

**Interfaces:**
- Consumes: `LabelStore` (aula 09), `LabelDocument` (aula 04), `ErroImpressao`, `PrinterTarget`, `PrinterTransport` (aula 06)
- Produces: `sealed interface EstadoImpressao` com `Ocioso`, `Renderizando`, `Conectando`, `Enviando`, `Sucesso`, `Falha(erro)`; `class EtiquetaViewModel(store: LabelStore, transporte: PrinterTransport, renderizar: (LabelDocument, Int) -> ByteArray)` com `estado: StateFlow<EstadoImpressao>`, `limparEstadoSeConcluido()`, `reportarFalha(erro)` e `suspend fun imprimir(documento: LabelDocument, salvarRascunho: Boolean = false)`. As aulas 12, 13 e 14 dependem disso.

- [ ] **Step 1: Extrair os arquivos reais**

```bash
git -C ../printec show main:shared/src/commonTest/kotlin/com/fatec/printec/ui/EtiquetaViewModelTest.kt
git -C ../printec show main:shared/src/commonMain/kotlin/com/fatec/printec/ui/EtiquetaViewModel.kt
```

- [ ] **Step 2: Escrever `docs/ldm/aula-11.mdx`**

Frontmatter: `sidebar_position: 11`, `title: "Aula 11: A máquina de estados da impressão"`, `description: "Seis estados, uma guarda de reentrância e um retry — porque a impressora dorme."`.

**`## 📖 Conceito`** — apresentar os seis estados e o caminho feliz: `Ocioso → Renderizando → Conectando → Sucesso`. Explicar por que `Enviando` existe no enum mas nunca é observado: o transporte conecta e escreve numa chamada só, então não há suspensão entre marcar `Conectando` e marcar `Enviando` — nenhum coletor veria o intermediário. Conectar é a fase que de fato falha, então é ela que fica visível.

Explicar a **guarda de reentrância**: a UI desabilita o botão IMPRIMIR, mas há três pontos de entrada (compor, reimprimir da lista de salvas, etiqueta de teste nas configurações) e nem todos têm botão para desabilitar. Duas impressões concorrentes gastam papel de verdade.

Explicar o parâmetro `salvarRascunho`: só é `true` quando o documento é o que o usuário está digitando. Reimprimir uma salva ou disparar a etiqueta de teste não pode gravar por cima do rascunho.

**`## 🗂️ Estrutura de Arquivos`** — o arquivo em `commonMain/ui/` e o teste em `commonTest/ui/`.

**`## 🔴 O Teste`** — bloco com `title="shared/src/commonTest/kotlin/com/fatec/printec/ui/EtiquetaViewModelTest.kt"`, arquivo inteiro. É o maior teste da suíte; comentar que ele usa dublês de `LabelStore` e `PrinterTransport` para exercitar a máquina inteira sem hardware nem banco. E:

```bash
./gradlew :shared:jvmTest --tests "com.fatec.printec.ui.EtiquetaViewModelTest"
```

Esperado: falha de compilação.

**`## Passo 1 — EtiquetaViewModel`** — bloco com `title="shared/src/commonMain/kotlin/com/fatec/printec/ui/EtiquetaViewModel.kt"`, arquivo inteiro. Percorrer em quatro partes: a guarda de reentrância, a leitura de configurações, a renderização com as cópias, e o laço de envio com retry.

**`## ⚠️ Atenção`** — três invariantes que o código defende explicitamente:

1. **`Renderizando` é marcado antes de qualquer suspensão**, inclusive antes de ler as configurações. Se a marcação esperasse a config chegar, duas chamadas concorrentes passariam as duas pela guarda.
2. **Nada não tipado escapa.** Todo `catch (e: Exception)` vira um `EstadoImpressao.Falha`. Uma exceção crua deixaria a UI presa em "Renderizando" ou "Conectando" para sempre — e a guarda de reentrância rejeitaria toda chamada seguinte, porque `limparEstadoSeConcluido()` só limpa estados terminais.
3. **`CancellationException` é relançada, sempre.** Cancelamento não é erro de impressão; tratá-lo como falha quebraria o comportamento de corrotinas do resto do app.

E o retry: só uma repetição, só para `FalhaAoConectar`, com um segundo de espera. A impressora hibernada tem mais chance de ter acordado se damos um instante; tentar de novo no mesmo instante é o pior caso justamente para esse cenário.

**`## ▶️ Como Executar`** — o comando acima, verde. Este é o teste mais completo que o aluno roda na trilha.

**`## 💻 Mão na Massa`** — `<Tabs>`:
- *Exercício 1 — Quebre a guarda:* remova o `return` da guarda de reentrância e rode o teste. Anote qual caso falha e o que ele estava protegendo. Restaure.
- *Exercício 2 — Um erro que não repete:* escreva um teste com um transporte que sempre lança `ErroImpressao.PermissaoNegada` e verifique que `imprimir` tentou **uma** vez, não duas. Explique a linha do código que decide isso.

- [ ] **Step 3: Registrar no sidebar**

Acrescentar `"ldm/aula-11"` aos `items` de `Módulo 4`.

- [ ] **Step 4: Verificar fidelidade**

```bash
npm run verificar:fidelidade
```

- [ ] **Step 5: Build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add docs/ldm/aula-11.mdx sidebars.ts
git commit -m "docs(ldm): aula 11 - a maquina de estados da impressao"
```

---

### Task 13: Aula 12 — Preview fiel à impressora

**Files:**
- Create: `docs/ldm/aula-12.mdx`
- Modify: `sidebars.ts`

**Interfaces:**
- Consumes: `LabelDocument`, `Bloco`, `Alinhamento`, `normalizado()` (aula 04); `QuebraDeLinha`, `Impressora` (aula 02); `Pc860.decodificar` (aula 03) e `EscPosRenderer` (aula 05), usados pelo teste
- Produces: o Composable de preview e o `FormularioEtiqueta`, consumidos pelas telas da aula 13. As assinaturas exatas saem dos arquivos extraídos no Step 1 e devem ser reproduzidas literalmente no `.mdx`.

- [ ] **Step 1: Extrair os arquivos reais**

```bash
git -C ../printec show main:shared/src/commonTest/kotlin/com/fatec/printec/ui/FormularioEtiquetaTest.kt
git -C ../printec show main:shared/src/commonTest/kotlin/com/fatec/printec/ui/LinhasDePreviewTest.kt
git -C ../printec show main:shared/src/jvmCommonTest/kotlin/com/fatec/printec/impressao/RendererIgualAoPreviewTest.kt
git -C ../printec show main:shared/src/commonMain/kotlin/com/fatec/printec/ui/FormularioEtiqueta.kt
git -C ../printec show main:shared/src/commonMain/kotlin/com/fatec/printec/ui/PreviewEtiqueta.kt
```

- [ ] **Step 2: Escrever `docs/ldm/aula-12.mdx`**

Frontmatter: `sidebar_position: 12`, `title: "Aula 12: Preview fiel à impressora"`, `description: "WYSIWYG de verdade — e o teste que prova que a tela e o papel quebram linha igual."`.

**`## 📖 Conceito`** — o preview promete ao usuário: o que você vê é o que sai. Essa promessa é frágil porque tela e impressora são desenhadas por códigos diferentes. A única forma de sustentá-la é as duas usarem a **mesma** regra de quebra — a `QuebraDeLinha` da aula 02 — e existir um teste que prove que continuam usando.

Explicar o papel do `FormularioEtiqueta`: converter os campos que o usuário preenche num `LabelDocument`.

Explicar a proporção: 384 dots de largura e 32 colunas dão a razão que o preview usa para não mentir sobre quanto texto cabe.

**`## 🗂️ Estrutura de Arquivos`** — os dois arquivos em `commonMain/ui/`, dois testes em `commonTest/ui/` e um em `jvmCommonTest/impressao/`.

**`## 🔴 O Teste`** — três blocos, arquivos inteiros, nesta ordem: `FormularioEtiquetaTest.kt`, `LinhasDePreviewTest.kt` e, por último, `RendererIgualAoPreviewTest.kt` — apresentado como o clímax da trilha: ele renderiza pelo `EscPosRenderer`, decodifica os bytes de volta com `Pc860.decodificar` e compara com as linhas do preview. Explicar por que decodificar pela mesma tabela em vez de manter uma cópia no teste: uma cópia paralela poderia divergir da real sem ninguém notar. E:

```bash
./gradlew :shared:jvmTest --tests "com.fatec.printec.ui.*" --tests "com.fatec.printec.impressao.RendererIgualAoPreviewTest"
```

Esperado: falha de compilação.

**`## Passo 1 — FormularioEtiqueta`** — bloco com o caminho completo, arquivo inteiro.

**`## Passo 2 — PreviewEtiqueta`** — bloco com o caminho completo, arquivo inteiro.

**`## ⚠️ Atenção`** — o preview não pode ter regra de quebra própria, nem "só para o caso do título". No instante em que tiver, o teste `RendererIgualAoPreviewTest` passa a ser a única coisa entre o usuário e uma promessa falsa — e ele só cobre o que alguém lembrou de exercitar. A regra mora num lugar só.

**`## ▶️ Como Executar`** — o comando acima, verde.

**`## 💻 Mão na Massa`** — `<Tabs>`:
- *Exercício 1 — Quebre a promessa:* mude `Impressora.COLUNAS_BASE` para 30 e rode `RendererIgualAoPreviewTest`. Ele passa? Explique por quê, e o que isso diz sobre o que o teste realmente garante.
- *Exercício 2 — Duplique a regra:* copie a lógica de quebra para dentro do preview e altere um detalhe (por exemplo, quebrar sempre na largura, ignorando espaços). Rode o teste e observe a falha. Restaure. Você acabou de ver a rede de proteção funcionando.

- [ ] **Step 3: Registrar no sidebar**

```typescript
        {
            type: "category",
            label: "Módulo 5 — Telas, papel e entrega",
            items: ["ldm/aula-12"],
        },
```

- [ ] **Step 4: Verificar fidelidade**

```bash
npm run verificar:fidelidade
```

- [ ] **Step 5: Build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add docs/ldm/aula-12.mdx sidebars.ts
git commit -m "docs(ldm): aula 12 - preview fiel a impressora"
```

---

### Task 14: Aula 13 — O app Desktop

A aula mais longa da trilha. Cinco arquivos de UI mais o `main.kt` — é o pagamento acumulado das doze aulas anteriores, e a primeira em que sai papel.

**Files:**
- Create: `docs/ldm/aula-13.mdx`
- Modify: `sidebars.ts`

**Interfaces:**
- Consumes: `EtiquetaViewModel`, `EstadoImpressao` (aula 11); `FormularioEtiqueta`, `PreviewEtiqueta` (aula 12); `LabelStoreSqlDelight` (aula 10); `DriverDesktop` (aula 09); `TransporteDesktop` (aula 08); `EscPosRenderer` (aula 05); `etiquetaDeCalibracao()` (aula 04)
- Produces: `enum class Tela(val rotulo: String) { COMPOR, ETIQUETAS, CONFIGURACOES }` e `@Composable fun AppEtiquetas(vm, store, destinos, aoAbrirConfigBluetooth, aoImprimirTeste, aoConcederPermissao)`. A aula 14 chama `AppEtiquetas` a partir do Android.

- [ ] **Step 1: Extrair os arquivos reais**

```bash
git -C ../printec show main:shared/src/commonMain/kotlin/com/fatec/printec/ui/StatusImpressao.kt
git -C ../printec show main:shared/src/commonMain/kotlin/com/fatec/printec/ui/TelaCompor.kt
git -C ../printec show main:shared/src/commonMain/kotlin/com/fatec/printec/ui/TelaEtiquetas.kt
git -C ../printec show main:shared/src/commonMain/kotlin/com/fatec/printec/ui/TelaConfiguracoes.kt
git -C ../printec show main:shared/src/commonMain/kotlin/com/fatec/printec/ui/Navegacao.kt
git -C ../printec show main:desktopApp/src/main/kotlin/com/fatec/printec/main.kt
```

- [ ] **Step 2: Escrever `docs/ldm/aula-13.mdx`**

Frontmatter: `sidebar_position: 13`, `title: "Aula 13: O app Desktop"`, `description: "As três telas, a navegação e a fiação — a primeira etiqueta no papel."`.

Abrir com um aviso claro: **a partir daqui é preciso hardware.** As aulas 01 a 12 rodam sem impressora; esta imprime de verdade. Quem não tiver a LT-8359 à mão consegue chegar até o app na tela e a lista de destinos, e para no envio.

**`## 📖 Conceito`** — as três telas e o que cada uma faz. Explicar por que as três entram de uma vez: `AppEtiquetas` referencia as três no `when`, então não há como rodar o app com um subconjunto.

Explicar o `StatusImpressao`: cada `ErroImpressao` vira uma mensagem com **uma ação concreta** — é o pagamento dos tipos criados na aula 06. `PermissaoNegada` oferece "Conceder permissão"; `NenhumaImpressoraSelecionada` leva às configurações.

**`## 🗂️ Estrutura de Arquivos`** — os cinco de `commonMain/ui/` e o `main.kt` de `desktopApp/`.

**`## Passo 1 — StatusImpressao`** — bloco com o caminho completo, arquivo inteiro.

**`## Passo 2 — TelaCompor`** — bloco com o caminho completo, arquivo inteiro.

**`## Passo 3 — TelaEtiquetas`** — bloco com o caminho completo, arquivo inteiro.

**`## Passo 4 — TelaConfiguracoes`** — bloco com o caminho completo, arquivo inteiro. Destacar que é daqui que sai a etiqueta de teste, e que `reportarFalha` existe para o caso de `listarDestinos()` falhar fora de uma impressão — sem isso, uma permissão negada faria a lista aparecer vazia sem explicação nenhuma, e o primeiro uso empacaria.

**`## Passo 5 — Navegacao`** — bloco com o caminho completo, arquivo inteiro.

**`## Passo 6 — main.kt do Desktop`** — bloco com `title="desktopApp/src/main/kotlin/com/fatec/printec/main.kt"`, arquivo inteiro. Mostrar a fiação completa: driver → store → transporte → renderizador → ViewModel → `AppEtiquetas`. Apontar os dois lambdas vazios (`aoAbrirConfigBluetooth`, `aoConcederPermissao`) e explicar: no Desktop não há permissão de runtime, e a conexão é USB ou porta COM.

**`## ⚠️ Atenção`** — o escopo de corrotina da impressão é o do **app**, não o da tela. `AppEtiquetas` permanece composto ao trocar de aba; as telas internas não. Lançar a impressão no escopo de uma tela faria a troca de aba **cancelar a impressão** — e como o cancelamento não escreve estado terminal, o botão IMPRIMIR ficaria desabilitado para sempre e o fluxo de bytes poderia ser cortado no meio do envio.

**`## ▶️ Como Executar`**

```bash
./gradlew :desktopApp:run
```

Descrever a sequência completa do primeiro uso: a janela abre na aba Compor → ir em Ajustes → a lista mostra impressoras `usb:` e portas `serial:` → escolher a impressora → voltar em Compor → preencher → IMPRIMIR. **Sai papel.**

Registrar o pareamento prévio no Windows: Configurações → Bluetooth → parear a LT-8359 → ela vira uma porta COM, que aparece na lista como "Standard Serial over Bluetooth link (COM*n*)".

**`## 💻 Mão na Massa`** — `<Tabs>`:
- *Exercício 1 — A etiqueta de teste:* em Ajustes, dispare "Imprimir teste". Compare o papel com `etiquetaDeCalibracao()` da aula 04. A régua de 32 caracteres ocupa a largura inteira sem quebrar? Se sim, os 384 dots estão confirmados.
- *Exercício 2 — Erro de propósito:* desligue a impressora e imprima. Anote a mensagem exata que aparece, quanto tempo leva e quantas tentativas o app faz. Confira contra o retry da aula 11.

- [ ] **Step 3: Registrar no sidebar**

Acrescentar `"ldm/aula-13"` aos `items` de `Módulo 5`.

- [ ] **Step 4: Verificar fidelidade**

```bash
npm run verificar:fidelidade
```

Esperado: `OK`. Esta é a aula com mais blocos — atenção redobrada a qualquer divergência.

- [ ] **Step 5: Build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add docs/ldm/aula-13.mdx sidebars.ts
git commit -m "docs(ldm): aula 13 - o app desktop"
```

---

### Task 15: Aula 14 — O app Android

**Files:**
- Create: `docs/ldm/aula-14.mdx`
- Modify: `sidebars.ts`

**Interfaces:**
- Consumes: `AppEtiquetas` (aula 13); `AndroidBluetoothTransport` (aula 07); `LabelStoreSqlDelight` (aula 10); `DriverAndroid` (aula 09); `EscPosRenderer` (aula 05); `etiquetaDeCalibracao()` (aula 04)
- Produces: `class PrintecApp : Application()` com `store` e `transporte`, e `class MainActivity : ComponentActivity()`. Nada depois consome — é o fim da fiação.

- [ ] **Step 1: Extrair os arquivos reais**

```bash
git -C ../printec show main:androidApp/src/main/AndroidManifest.xml
git -C ../printec show main:androidApp/src/main/kotlin/com/fatec/printec/PrintecApp.kt
git -C ../printec show main:androidApp/src/main/kotlin/com/fatec/printec/MainActivity.kt
```

- [ ] **Step 2: Escrever `docs/ldm/aula-14.mdx`**

Frontmatter: `sidebar_position: 14`, `title: "Aula 14: O app Android"`, `description: "Manifest, permissão em runtime e a mesma UI da aula 13 imprimindo por Bluetooth."`.

**`## 📖 Conceito`** — o Android reaproveita **tudo** de `shared/`: as três telas, a navegação, o ViewModel, o store, o renderizador. O que muda é só o host — `Application`, `Activity`, Manifest — e o transporte. É o pagamento do KMP, e vale mostrar o número: o `androidApp` tem dois arquivos Kotlin.

Explicar o modelo de permissão de Bluetooth por versão: `BLUETOOTH` e `BLUETOOTH_ADMIN` com `maxSdkVersion="30"`, concedidas na instalação; `BLUETOOTH_CONNECT` da API 31 em diante, pedida em runtime.

**`## 🗂️ Estrutura de Arquivos`** — os três arquivos de `androidApp/src/main/`.

**`## Passo 1 — AndroidManifest.xml`** — bloco com `title="androidApp/src/main/AndroidManifest.xml"`, arquivo inteiro.

**`## Passo 2 — PrintecApp`** — bloco com o caminho completo, arquivo inteiro. Explicar por que store e transporte vivem no `Application` e não na `Activity`: sobrevivem à rotação de tela e a `Activity` recriada não reabre o banco.

**`## Passo 3 — MainActivity`** — bloco com o caminho completo, arquivo inteiro. Mostrar a fiação e os dois usos do mesmo launcher de permissão.

**`## ⚠️ Atenção`** — a armadilha do primeiro uso, que o comentário do código descreve inteira: sem o pedido de permissão no arranque, `listarDestinos()` lança `PermissaoNegada`, a lista de impressoras fica vazia, e sem impressora selecionada o único erro que a UI mostra é `NenhumaImpressoraSelecionada` — cuja ação abre as configurações de Bluetooth do sistema, que não concedem permissão de app nenhuma. O primeiro uso empacaria num laço. Por isso o launcher está ligado nos dois lugares: no arranque e como ação de recuperação.

**`## ▶️ Como Executar`**

```bash
./gradlew :androidApp:installDebug
```

Descrever a sequência: parear a impressora nas configurações do Android → abrir o app → conceder a permissão → Ajustes → a lista mostra os pareados → escolher → Compor → IMPRIMIR. **Sai papel, por Bluetooth.**

**`## 💻 Mão na Massa`** — `<Tabs>`:
- *Exercício 1 — Negue a permissão:* desinstale, reinstale e negue a permissão no arranque. Navegue até conseguir imprimir. Anote quantos toques levou e onde apareceu o botão "Conceder permissão".
- *Exercício 2 — A impressora dormindo:* deixe a impressora hibernar os 10 minutos e imprima. O app acorda ela? Cronometre e compare com o retry único da aula 11.

- [ ] **Step 3: Registrar no sidebar**

Acrescentar `"ldm/aula-14"` aos `items` de `Módulo 5`.

- [ ] **Step 4: Verificar fidelidade**

```bash
npm run verificar:fidelidade
```

- [ ] **Step 5: Build**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add docs/ldm/aula-14.mdx sidebars.ts
git commit -m "docs(ldm): aula 14 - o app android"
```

---

### Task 16: Aula 15 — Calibração e entrega

**Files:**
- Create: `docs/ldm/aula-15.mdx`
- Modify: `sidebars.ts`

**Interfaces:**
- Consumes: tudo. Nenhum arquivo de produção novo.
- Produces: a suíte inteira verde nas duas plataformas e os artefatos de entrega.

- [ ] **Step 1: Extrair os arquivos reais**

```bash
git -C ../printec show main:shared/src/commonTest/kotlin/com/fatec/printec/SharedCommonTest.kt
git -C ../printec show main:shared/src/jvmTest/kotlin/com/fatec/printec/SharedLogicDesktopTest.kt
git -C ../printec show main:shared/src/androidHostTest/kotlin/com/fatec/printec/SharedLogicAndroidHostTest.kt
git -C ../printec show main:shared/src/androidDeviceTest/kotlin/com/fatec/printec/impressao/EscPosCoffeeDispositivoTest.kt
```

- [ ] **Step 2: Escrever `docs/ldm/aula-15.mdx`**

Frontmatter: `sidebar_position: 15`, `title: "Aula 15: Calibração e entrega"`, `description: "Confirmar os 384 dots em papel, fechar a suíte e empacotar."`.

**`## 📖 Conceito`** — a etiqueta de calibração responde em papel o que até aqui era inferência. `Impressora.DOTS_LARGURA = 384` veio de 32 colunas × 12 dots da Font A — cálculo, não medição. A régua de 32 caracteres da `etiquetaDeCalibracao()` decide: se ocupa a largura inteira sem quebrar, o número está certo.

Explicar que a etiqueta cobre escala 1x a 8x de propósito: é o instrumento que responde às perguntas de hardware em aberto, e cobertura reduzida ali custa uma sessão de testes inteira.

Registrar o achado que a calibração já produziu: "CALIBRACAO" em 2x com negrito sai ilegível logo acima de "escala 2x" em 2x puro, nítido. É a origem da decisão da aula 04 de `Titulo` não levar negrito.

**`## 🗂️ Estrutura de Arquivos`** — os quatro testes de fechamento, um por source set.

**`## Passo 1 — Os testes de fechamento`** — os quatro blocos, arquivos inteiros, com os caminhos completos.

**`## ⚠️ Atenção`** — `EscPosCoffeeDispositivoTest` roda em `androidDeviceTest`: precisa de aparelho ou emulador conectado, e não entra em `./gradlew :shared:testAndroidHostTest`. Ele existe para provar que o `escpos-coffee` — uma biblioteca Java pensada para desktop — carrega e executa no Android de verdade, coisa que nenhum teste de JVM na máquina do desenvolvedor consegue garantir.

**`## ▶️ Como Executar`** — a suíte inteira e os artefatos:

```bash
./gradlew :shared:jvmTest
```

```bash
./gradlew :shared:testAndroidHostTest
```

```bash
./gradlew :androidApp:assembleDebug
```

```bash
./gradlew :desktopApp:run
```

E o fecho: imprimir a etiqueta de calibração pelos Ajustes, nas **duas** plataformas, e comparar os dois papéis.

**`## 💻 Mão na Massa`** — `<Tabs>`:
- *Exercício 1 — Meça:* imprima a calibração e meça a régua de 32 caracteres com uma régua de verdade. Ela tem 48 mm? Se não, calcule o `DOTS_LARGURA` real e diga o que mudaria no app.
- *Exercício 2 — Os dois papéis:* imprima a mesma etiqueta pelo Android e pelo Desktop e compare lado a lado. Se saírem diferentes, o culpado está no transporte, não no renderizador — explique por que, a partir da arquitetura.
- *Exercício 3 — O que ficou de fora:* leia o `README.md` do projeto e liste três coisas que o app **não** faz (descoberta Bluetooth no app, código de barras 1D, sincronização entre dispositivos). Para cada uma, diga em que aula você acrescentaria e o que quebraria.

- [ ] **Step 3: Registrar no sidebar**

Acrescentar `"ldm/aula-15"` aos `items` de `Módulo 5`. O `ldmSidebar` fica completo:

```typescript
    ldmSidebar: [
        "ldm/index",
        {
            type: "category",
            label: "Módulo 1 — Fundação",
            collapsed: false,
            items: ["ldm/aula-01", "ldm/aula-02", "ldm/aula-03"],
        },
        {
            type: "category",
            label: "Módulo 2 — O documento e os bytes",
            items: ["ldm/aula-04", "ldm/aula-05", "ldm/aula-06"],
        },
        {
            type: "category",
            label: "Módulo 3 — Bluetooth e Impressora",
            items: ["ldm/aula-07", "ldm/aula-08"],
        },
        {
            type: "category",
            label: "Módulo 4 — Estado e persistência",
            items: ["ldm/aula-09", "ldm/aula-10", "ldm/aula-11"],
        },
        {
            type: "category",
            label: "Módulo 5 — Telas, papel e entrega",
            items: ["ldm/aula-12", "ldm/aula-13", "ldm/aula-14", "ldm/aula-15"],
        },
    ],
```

- [ ] **Step 4: Verificar fidelidade da trilha inteira**

```bash
npm run verificar:fidelidade
```

Esperado: `OK` com todos os blocos das 15 aulas conferidos.

- [ ] **Step 5: Build final e conferência de cobertura**

```bash
npm run build
```

Conferir que todo arquivo `.kt` e `.sq` da `main` aparece em alguma aula:

```bash
git -C ../printec ls-tree -r --name-only main | grep -E "\.(kt|sq)$" | grep -v "Test" | while read f; do grep -rqF "$f" docs/ldm/ || echo "NAO DOCUMENTADO: $f"; done
```

Esperado: nenhuma linha. Se algum arquivo aparecer, ele ficou de fora da trilha — decida em qual aula entra e volte à tarefa correspondente.

- [ ] **Step 6: Commit**

```bash
git add docs/ldm/aula-15.mdx sidebars.ts
git commit -m "docs(ldm): aula 15 - calibracao e entrega"
```

---

## Self-Review

**Cobertura da spec:**

| Requisito da spec | Tarefa |
|---|---|
| §4 remoção dos 19 arquivos + PLAN | Task 1, Step 2 |
| §4 `ldmSidebar` reescrito | Task 1 Step 7, uma linha por tarefa, completo na Task 16 |
| §4 renomeação em navbar, footer, `_category_.json`, `index.mdx` | Task 1, Step 8 |
| §4 exercícios em `<Tabs>` em cada aula | Seção "Mão na Massa" de toda tarefa de aula |
| §5.3 fidelidade — regra dura | Global Constraints + `scripts/verificar-fidelidade.mjs` (Task 1) + Step 4 de toda tarefa |
| §5.4 teste real primeiro | Seção "🔴 O Teste" das Tasks 3–13 |
| §5.5 anatomia da aula | Especificada seção a seção em cada tarefa |
| §6 as 15 aulas | Tasks 2–16 |
| §7 verificação | Steps 4 e 5 de toda tarefa; cobertura total no Step 5 da Task 16 |
| §8 aula 13 é a mais longa | Task 14, dividida em 6 passos |
| §8 sem hardware o aluno para na aula 13 | Task 14, aviso na abertura |
| §8 `DesktopSerialTransport` é do Windows | Task 9, seção "⚠️ Atenção" |

**Consistência de tipos:** as assinaturas declaradas em "Produces" foram conferidas contra os arquivos reais. Pontos que exigiram correção durante a redação e que estão certos aqui: `FabricaDeDriver` é **interface**, não `expect`/`actual` (Task 10); o único `expect` do projeto é `agoraEmMillis()`, declarado dentro de `LabelStoreSqlDelight.kt` (Task 11) com os `actual` em `Relogio.android.kt` e `Relogio.jvm.kt` (Task 10) — por isso a Task 10 avisa que a compilação só fecha na Task 11.

**Lacuna conhecida:** as assinaturas exatas de `FormularioEtiqueta` e `PreviewEtiqueta` (Task 13) não estão transcritas neste plano; o Step 1 daquela tarefa as extrai do repositório. Isso é deliberado e consistente com a regra de fidelidade — o plano não inventa assinatura, e o verificador reprova qualquer bloco que não confira.
