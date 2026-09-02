# PDM II — Playground de Compose no living-docs (Implementação)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o curso `docs/pdmii/` (20 aulas MergeSkills) pelas 19 aulas do playground de Jetpack Compose, no formato enxuto (Conceito + Código de Referência + Experimente).

**Architecture:** Cada lição `L01`..`L19` do repo `compose-intro` (branch `app-final`) vira uma página MDX `docs/pdmii/aula-NN.mdx`. O conteúdo é EXTRAÍDO do arquivo-fonte real: o KDoc de 3 partes vira o Conceito, a demo vira o Código de Referência, o `notice` vira o "Experimente". Suporte: reescrever `pdmiiSidebar` (sidebars.ts), o `_category_.json` e o label do navbar. Verificação por `npm run build` do Docusaurus.

**Tech Stack:** Docusaurus (MDX), Node v24, npm. Sem testes unitários — o build é a rede de segurança.

**Spec:** [`_planning/specs/2026-09-02-pdmii-compose-playground-design.md`](../specs/2026-09-02-pdmii-compose-playground-design.md)

**Fonte do conteúdo:** repo `compose-intro` em `C:\Users\yvillanova\Downloads\pdmii\Introducao\compose-intro`, branch `app-final`, arquivos `app/src/main/java/com/fatec/composeintro/ui/lessons/LNN*.kt`.

## Global Constraints

- **Repo/branch:** trabalhar em `living-docs`, branch `docs/pdmii-compose-playground` (já criada a partir de `main`). Não commitar em `docs/ldm-printec`.
- **Não tocar** em `docs/ldm/`, `docs/pdmi/`, nem nos blocos `pdmiSidebar`/`ldmSidebar` do `sidebars.ts`.
- **Rótulo do curso:** "PDM II" puro (sem "Android Nativo"/"MergeSkills"/"Compose do Zero").
- **Verificação:** `npm run build` (na raiz de `living-docs`) tem de terminar com sucesso ao fim de cada tarefa.
- **Fidelidade:** o Conceito e o Código de Referência vêm do arquivo-fonte real da lição; não inventar conteúdo. Texto em português; identificadores no código em inglês.
- **Cuidado MDX:** fora de blocos de código, `<`, `{` e `=>` são interpretados como JSX e quebram o build. Manter tipos genéricos (`List<T>`) e código sempre em backticks ou em fences ```` ```kotlin ````. Admonitions válidos: `:::info`, `:::tip`, `:::caution`, `:::note`, `:::warning`. Fechar todo `:::` com `:::`.
- **Destrutivo:** a remoção dos 20 arquivos MergeSkills exige confirmação explícita do parceiro humano (portão na Task 1). Os arquivos permanecem no histórico do git.

---

### Task 1: Portão de remoção + andaime + aula-01 piloto

Estabelece a base: confirma e remove os 20 arquivos antigos, reescreve os arquivos de suporte, e cria a primeira aula para fixar o template. Ao fim, o site builda com o curso novo tendo 1 aula.

**Files:**
- Delete: `docs/pdmii/aula-01.mdx` … `docs/pdmii/aula-20.mdx` (os 20 MergeSkills)
- Modify: `docs/pdmii/_category_.json`
- Modify: `sidebars.ts` (só o bloco `pdmiiSidebar`)
- Modify: `docusaurus.config.ts` (label do navbar)
- Create: `docs/pdmii/aula-01.mdx` (novo, playground)

**Interfaces:**
- Consumes: nada
- Produces: `docs/pdmii/` com só `aula-01.mdx` + `_category_.json`; `pdmiiSidebar` referenciando `pdmii/aula-01`..`pdmii/aula-19`.

- [ ] **Step 1: Baseline — confirmar que o build está verde ANTES de mexer**

Na raiz de `living-docs`:
```bash
npm run build
```
Esperado: **sucesso** (com as 20 aulas MergeSkills). Se já estiver vermelho, PARE e reporte — o vermelho seria pré-existente, não nosso.

- [ ] **Step 2: PORTÃO DESTRUTIVO — confirmação humana explícita**

> **Este passo é responsabilidade do coordenador (controller), não do subagente.** A remoção abaixo apaga 20 arquivos que o parceiro NÃO criou (curso MergeSkills). Antes de qualquer `git rm`, o coordenador lista os 20 arquivos e obtém um "pode apagar" explícito do parceiro. O subagente implementador só roda esta tarefa DEPOIS dessa confirmação — assuma que foi concedida. Os arquivos continuam recuperáveis no histórico do git.

Arquivos a remover: `docs/pdmii/aula-01.mdx` até `docs/pdmii/aula-20.mdx` (20 arquivos).

- [ ] **Step 3: Remover os 20 arquivos MergeSkills**

```bash
git rm docs/pdmii/aula-0{1..9}.mdx docs/pdmii/aula-1{0..9}.mdx docs/pdmii/aula-20.mdx
```
(São 20 arquivos. O `_category_.json` NÃO é removido — será reescrito.)

- [ ] **Step 4: Reescrever `docs/pdmii/_category_.json`**

Substitua todo o conteúdo por:
```json
{
    "label": "PDM II",
    "position": 1,
    "link": {
        "type": "generated-index",
        "description": "Playground interativo de Jetpack Compose — 19 lições, do primeiro @Composable ao ViewModel."
    }
}
```

- [ ] **Step 5: Reescrever o bloco `pdmiiSidebar` em `sidebars.ts`**

Em `sidebars.ts`, substitua TODO o array `pdmiiSidebar` (do `pdmiiSidebar: [` até o `],` que o fecha) por:
```ts
    pdmiiSidebar: [
        {
            type: "category",
            label: "Módulo 1 — Fundamentos",
            collapsed: false,
            items: ["pdmii/aula-01", "pdmii/aula-02", "pdmii/aula-03", "pdmii/aula-04"],
        },
        {
            type: "category",
            label: "Módulo 2 — Layout",
            items: ["pdmii/aula-05", "pdmii/aula-06", "pdmii/aula-07", "pdmii/aula-08"],
        },
        {
            type: "category",
            label: "Módulo 3 — Componentes Material3",
            items: ["pdmii/aula-09", "pdmii/aula-10", "pdmii/aula-11", "pdmii/aula-12"],
        },
        {
            type: "category",
            label: "Módulo 4 — Estado",
            items: ["pdmii/aula-13", "pdmii/aula-14", "pdmii/aula-15", "pdmii/aula-16"],
        },
        {
            type: "category",
            label: "Módulo 5 — Estado avançado",
            items: ["pdmii/aula-17", "pdmii/aula-18", "pdmii/aula-19"],
        },
    ],
```
Não toque em `pdmiSidebar` nem `ldmSidebar`.

- [ ] **Step 6: Ajustar o label do navbar em `docusaurus.config.ts`**

Procure a linha com `{ label: "PDMII — Android Nativo", to: "/pdmii/aula-01" }` e troque o label para `"PDM II"`:
```ts
                        { label: "PDM II", to: "/pdmii/aula-01" },
```

- [ ] **Step 7: Criar `docs/pdmii/aula-01.mdx` (piloto — este é o template)**

Escreva no arquivo exatamente o conteúdo entre as linhas `````` ````mdx `````` e `````` ```` `````` abaixo (o bloco usa fence de 4 crases só para conter os fences internos de 3 crases; no arquivo `.mdx` final, os blocos internos são de 3 crases normais):

````mdx
---
sidebar_position: 1
title: "Aula 01: Seu primeiro Composable"
description: "Uma função que desenha: @Composable, @Preview e por que o nome começa com maiúscula."
---

# Aula 01: Seu primeiro Composable

:::info 📂 Código da Aula
Esta aula é a lição **Seu primeiro Composable** do playground, no repositório `compose-intro` (branch `app-final`):

- Arquivo: `app/src/main/java/com/fatec/composeintro/ui/lessons/L01FirstComposable.kt`
- No app: abra o catálogo → módulo **Fundamentos** → **Seu primeiro Composable**

```bash
git clone https://github.com/fatec-registro-yuri-villanova/compose-intro
git checkout app-final
```
:::

## 📖 Conceito

Um **Composable** é uma função Kotlin comum marcada com `@Composable`. Ela não devolve nada — ela **descreve** o que deve aparecer na tela.

No Android antigo, você criava um objeto `TextView` e depois chamava `setText` nele. No Compose você só declara "quero um `Text` com esse conteúdo", e o framework se encarrega de criar, atualizar ou remover.

:::caution Armadilha
O nome de uma função `@Composable` começa com letra **maiúscula**, ao contrário de toda outra função Kotlin. Não é capricho: é como se distingue, na leitura, o que **desenha** do que **calcula**.
:::

O `@Preview` logo abaixo deixa você ver o componente no Android Studio sem abrir o emulador — metade do valor do Compose no dia a dia.

## 💻 Código de Referência

```kotlin title="ui/lessons/L01FirstComposable.kt"
@Composable
private fun GreetingDemo() {
    Text(
        text = "Olá, Compose!",
        style = MaterialTheme.typography.headlineMedium
    )
}

@Preview(showBackground = true)
@Composable
private fun GreetingDemoPreview() {
    ComposeIntroTheme {
        GreetingDemo()
    }
}
```

## 🧪 Experimente

- Abra o app e vá em **Fundamentos → Seu primeiro Composable**.
- Esta lição não tem controles: o objetivo é ler a função no código — uma função normal, marcada com `@Composable`, que descreve um texto na tela.
- Troque o texto de `"Olá, Compose!"` e veja o `@Preview` atualizar no Android Studio, sem emulador.
````

- [ ] **Step 8: Build verde com o curso novo (1 aula)**

```bash
npm run build
```
Esperado: **sucesso**. O `pdmiiSidebar` referencia aula-01..19, mas só aula-01 existe ainda — o Docusaurus AVISA sobre os itens faltantes mas **não falha o build** por isso (são warnings de sidebar). Se falhar por outro motivo (MDX inválido, etc.), corrija antes de commitar.

> Nota: se o Docusaurus estiver configurado com `onBrokenLinks: 'throw'`, links internos quebrados FALHAM o build. Itens de sidebar apontando para páginas ainda inexistentes normalmente são warning, não erro — mas se o build falhar por causa dos aula-02..19 ausentes, comente temporariamente os itens 02..19 do `pdmiiSidebar`, deixe só aula-01, e reponha-os na Task 2/3/4 conforme as aulas forem criadas. Registre no relatório se precisou fazer isso.

- [ ] **Step 9: Commit**

```bash
git add -A docs/pdmii sidebars.ts docusaurus.config.ts
git commit -m "docs(pdmii): substituir curso MergeSkills pelo playground de Compose (andaime + aula-01)"
```

---

### Task 2: Aulas 02–08 (Fundamentos restante + Layout)

Cria 7 aulas seguindo EXATAMENTE o template da aula-01 (Task 1, Step 7). Para cada uma: leia o arquivo-fonte no `compose-intro`, extraia o KDoc → **Conceito**, a demo → **Código de Referência**, o `notice` → **Experimente**.

**Files:**
- Create: `docs/pdmii/aula-02.mdx` … `docs/pdmii/aula-08.mdx`

**Interfaces:**
- Consumes: o template da aula-01.
- Produces: aulas 02–08.

**Procedimento por aula (idêntico ao template):**
1. `sidebar_position` e o número no título = o número da aula.
2. `title: "Aula NN: <título>"` — o `<título>` é o `title` do `LessonScaffold` na lição (coluna abaixo).
3. `description` — uma linha, do `summary` da lição em `navigation/Lesson.kt` (ou resuma o Conceito).
4. Bloco **📂 Código da Aula**: caminho do arquivo-fonte + "abra o catálogo → módulo **<Módulo>** → **<título>**".
5. **📖 Conceito**: transcreva o KDoc de 3 partes (o que é / por que existe / ARMADILHA) em prosa. A parte "ARMADILHA" vira um `:::caution Armadilha ... :::`.
6. **💻 Código de Referência**: copie a(s) função(ões) de demo `private` da lição (a `*Demo` e as auxiliares que ensinam o ponto) num bloco ```` ```kotlin title="ui/lessons/<arquivo>" ````. Não copie imports nem a função `LNN...` externa nem o `@Preview` (exceto quando o preview for o ponto, como na aula-01).
7. **🧪 Experimente**: 2–4 bullets a partir do `notice` e dos controles da lição — o que mexer no app e o que observar.

| Aula | Título (`LessonScaffold`) | Módulo | Arquivo-fonte (`ui/lessons/`) |
|---|---|---|---|
| 02 | Text | Fundamentos | L02Text.kt |
| 03 | Parâmetros | Fundamentos | L03Parameters.kt |
| 04 | Modifier | Fundamentos | L04Modifier.kt |
| 05 | Column e Row | Layout | L05ColumnRow.kt |
| 06 | Box | Layout | L06Box.kt |
| 07 | Peso e espaço | Layout | L07WeightSpace.kt |
| 08 | LazyColumn | Layout | L08LazyColumn.kt |

- [ ] **Step 1: Escrever as 7 aulas (02–08)** seguindo o procedimento acima, lendo cada arquivo-fonte.

- [ ] **Step 2: Build verde**

```bash
npm run build
```
Esperado: **sucesso**. Se você comentou itens de sidebar na Task 1, reponha os itens aula-02..08 agora.

- [ ] **Step 3: Commit**

```bash
git add docs/pdmii sidebars.ts
git commit -m "docs(pdmii): aulas 02-08 (Fundamentos e Layout)"
```

---

### Task 3: Aulas 09–16 (Componentes Material3 + Estado)

Mesmo procedimento da Task 2. Uma delas (aula-13) está totalmente escrita abaixo como SEGUNDO exemplo de referência — use-a para calibrar o tom.

**Files:**
- Create: `docs/pdmii/aula-09.mdx` … `docs/pdmii/aula-16.mdx`

| Aula | Título | Módulo | Arquivo-fonte (`ui/lessons/`) |
|---|---|---|---|
| 09 | Button | Componentes Material3 | L09Button.kt |
| 10 | TextField | Componentes Material3 | L10TextField.kt |
| 11 | Card e Surface | Componentes Material3 | L11CardSurface.kt |
| 12 | Scaffold | Componentes Material3 | L12Scaffold.kt |
| 13 | remember | Estado | L13Remember.kt |
| 14 | Recomposição | Estado | L14Recomposition.kt |
| 15 | State hoisting | Estado | L15StateHoisting.kt |
| 16 | rememberSaveable | Estado | L16RememberSaveable.kt |

> **Atenção às aulas com bastante código (11, 12):** copie só o trecho que ensina o ponto (a `*Demo` principal), não a tela inteira. **Aula 15 (State hoisting):** a lição usa componentes de OUTRO pacote (`ui/components/EmailInputText.kt` e `ui/components/login/LoginInputField.kt`); mencione isso no Conceito e no bloco Código da Aula, e no Código de Referência mostre o contraste (o campo com estado por dentro vs. o içado com `value`/`onValueChange`).

**Exemplo de referência completo — `docs/pdmii/aula-13.mdx`** (fence externo de 4 crases só para conter os internos de 3; no `.mdx` final os internos são de 3 crases):

````mdx
---
sidebar_position: 13
title: "Aula 13: remember"
description: "Por que o estado precisa ser lembrado entre recomposições — com e sem remember, lado a lado."
---

# Aula 13: remember

:::info 📂 Código da Aula
Esta aula é a lição **remember** do playground, no repositório `compose-intro` (branch `app-final`):

- Arquivo: `app/src/main/java/com/fatec/composeintro/ui/lessons/L13Remember.kt`
- No app: abra o catálogo → módulo **Estado** → **remember**

```bash
git clone https://github.com/fatec-registro-yuri-villanova/compose-intro
git checkout app-final
```
:::

## 📖 Conceito

`remember { mutableStateOf(...) }` guarda um valor **entre recomposições**. O `mutableStateOf` cria um estado observável; o `remember` faz esse estado sobreviver quando a função é chamada de novo.

Uma função `@Composable` roda muitas vezes (a cada recomposição). Sem `remember`, toda variável nasce de novo a cada execução — o valor se perde. `remember` é o que dá memória à função.

:::caution Armadilha
A mais comum de quem começa: **esquecer o `remember`**. As duas colunas da demo são iguais, menos por isso. A da esquerda lembra e conta; a da direita usa só `mutableStateOf`, sem `remember`, então cada clique recria o estado no zero e o contador nunca sai de 0.
:::

## 💻 Código de Referência

```kotlin title="ui/lessons/L13Remember.kt"
@Composable
private fun ComRemember() {
    var count by remember { mutableStateOf(0) }
    Contador(rotulo = "com remember", valor = count, onSomar = { count++ })
}

@Composable
private fun SemRemember() {
    // De propósito SEM remember: cada recomposição recria o estado no zero.
    var count by mutableStateOf(0)
    Contador(rotulo = "sem remember", valor = count, onSomar = { count++ })
}
```

## 🧪 Experimente

- Abra o app e vá em **Estado → remember**.
- Toque no botão "somar" das duas colunas e compare: a de `com remember` conta; a de `sem remember` fica presa no zero.
- No código, a única diferença entre as duas é o `remember` — o resto é idêntico.
````

- [ ] **Step 1: Escrever as 8 aulas (09–16)** seguindo o procedimento (aula-13 já pronta acima; transcreva-a e faça as outras 7).

- [ ] **Step 2: Build verde**

```bash
npm run build
```
Esperado: **sucesso**. Reponha os itens de sidebar aula-09..16 se necessário.

- [ ] **Step 3: Commit**

```bash
git add docs/pdmii sidebars.ts
git commit -m "docs(pdmii): aulas 09-16 (Componentes e Estado)"
```

---

### Task 4: Aulas 17–19 (Estado avançado) + fechamento

**Files:**
- Create: `docs/pdmii/aula-17.mdx` … `docs/pdmii/aula-19.mdx`

| Aula | Título | Módulo | Arquivo-fonte (`ui/lessons/`) |
|---|---|---|---|
| 17 | derivedStateOf | Estado avançado | L17DerivedState.kt |
| 18 | LaunchedEffect | Estado avançado | L18LaunchedEffect.kt |
| 19 | ViewModel | Estado avançado | L19ViewModel.kt |

> **Aula 19 (ViewModel):** a lição tem a `data class LoginUiState`, a classe `LoginViewModel` (com validação e `StateFlow`) e a tela que a consome via `viewModel()` + `collectAsStateWithLifecycle`. No Código de Referência, mostre o essencial: a `LoginViewModel` (o `MutableStateFlow` + `onEmailChange`/`onPasswordChange`) e o topo do composable (`val vm = viewModel()` + `collectAsStateWithLifecycle`). No Conceito, feche a trilha "estado por dentro → içado → no ViewModel".

- [ ] **Step 1: Escrever as 3 aulas (17–19)** seguindo o procedimento da Task 2.

- [ ] **Step 2: Conferir a estrutura final de `docs/pdmii/`**

```bash
ls docs/pdmii/
```
Esperado: exatamente `_category_.json` + `aula-01.mdx` … `aula-19.mdx` (19 aulas, nenhum `aula-20`).

- [ ] **Step 3: Build final verde (todas as 19)**

```bash
npm run build
```
Esperado: **sucesso**, sem warnings de itens de sidebar faltantes (todos os 19 existem agora).

- [ ] **Step 4: Commit**

```bash
git add docs/pdmii sidebars.ts
git commit -m "docs(pdmii): aulas 17-19 (Estado avancado) — curso completo"
```

- [ ] **Step 5: Restaurar o checkout compartilhado para `docs/ldm-printec`**

> Passo do coordenador, ao final de toda a entrega (depois da revisão/merge). O checkout de `living-docs` estava em `docs/ldm-printec` quando começamos; deixá-lo assim para quem trabalha na impressão:
> ```bash
> git checkout docs/ldm-printec
> ```
> (Só depois que a branch `docs/pdmii-compose-playground` estiver mesclada ou empurrada, conforme a decisão de finalização.)

---

## Definição de pronto

- [ ] `docs/pdmii/` tem `_category_.json` + `aula-01.mdx`..`aula-19.mdx` (19), sem `aula-20`
- [ ] `npm run build` termina com sucesso, sem warnings de sidebar faltante
- [ ] `pdmiiSidebar` lista 5 módulos e exatamente 19 itens (aula-01..19)
- [ ] `_category_.json` e o navbar dizem "PDM II" puro
- [ ] Cada aula tem: frontmatter, 📂 Código da Aula, 📖 Conceito (com :::caution Armadilha), 💻 Código de Referência (da demo real) e 🧪 Experimente
- [ ] `docs/ldm/`, `docs/pdmi/`, `pdmiSidebar`, `ldmSidebar` intactos
- [ ] Nada mudou no repo `compose-intro`
