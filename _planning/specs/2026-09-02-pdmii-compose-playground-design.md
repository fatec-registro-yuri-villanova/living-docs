# PDM II — Documentar o playground de Compose no living-docs

**Data:** 2026-09-02
**Repo:** `living-docs` (Docusaurus)
**Status:** design aprovado, aguardando plano de implementação

## Objetivo

Substituir o curso `docs/pdmii/` atual (20 aulas do app "MergeSkills") pelas **19 aulas do playground de Jetpack Compose** que construímos no repositório `compose-intro`. Cada lição do playground (`L01`..`L19`) vira uma aula MDX (`aula-01`..`aula-19`), no formato **enxuto e fiel ao playground**.

O material-fonte é o repo `compose-intro`, branch `app-final`: cada lição já traz um KDoc de 3 partes (o que é / por que existe / armadilha) e o código da demo. As aulas reaproveitam esse material — não inventam bateria de exercícios.

## Decisões tomadas (com o parceiro)

| Decisão | Escolha |
|---|---|
| Onde | Substituir `docs/pdmii/` (destrutivo, com confirmação explícita antes de apagar) |
| Profundidade | Enxuto: Conceito + Código de Referência + "Experimente" curto (~60-90 linhas/aula) |
| Bloco de código | Adaptar "🔀 Branch da Aula" → "📂 Código da Aula" apontando o arquivo da lição no `compose-intro` (branch `app-final`) |
| Workspace | Branch `docs/pdmii-compose-playground` a partir de `main` (não a `docs/ldm-printec`, que é o trabalho de impressão) |

## Workspace e coordenação

- O repo `living-docs` tem **um checkout só** (sem worktrees). O trabalho acontece na branch `docs/pdmii-compose-playground`, criada a partir de `main` (base limpa: `docs/ldm-printec` está 14 commits à frente de `main` só com a WIP de impressão).
- **Ao terminar, restaurar `docs/ldm-printec`** no checkout (`git checkout docs/ldm-printec`), para deixar o diretório como estava para quem trabalha na impressão.
- Não tocar em `docs/ldm/` nem `docs/pdmi/`.
- Spec e plano ficam em `_planning/` (raiz, fora de `docs/`) — o Docusaurus só serve `docs/` e `src/pages/`, então esses arquivos não viram páginas.

## Substituição destrutiva (com portão de confirmação)

Os 20 arquivos MergeSkills a remover (recuperáveis no histórico do git):
`docs/pdmii/aula-01.mdx` … `docs/pdmii/aula-20.mdx`.

O `docs/pdmii/_category_.json` é **reescrito** (não removido). Não há `docs/pdmii/index.mdx` hoje.

**Portão:** a primeira tarefa do plano lista os 20 arquivos e **pede confirmação explícita do parceiro** antes de qualquer `git rm`. Como a numeração nova vai só até 19, o `aula-20.mdx` desaparece de vez.

## Anatomia de uma aula (formato enxuto)

Cada `docs/pdmii/aula-NN.mdx`, ~60-90 linhas, nesta ordem:

```mdx
---
sidebar_position: NN
title: "Aula NN: <título da lição>"
description: "<uma linha, do summary da lição>"
---

# Aula NN: <título da lição>

:::info 📂 Código da Aula
Esta aula é a lição **<título>** do playground, no repositório `compose-intro` (branch `app-final`):

- Arquivo: `app/src/main/java/com/fatec/composeintro/ui/lessons/LNN<Nome>.kt`
- No app: abra o catálogo → módulo **<Módulo>** → **<título>**

```bash
git clone https://github.com/fatec-registro-yuri-villanova/compose-intro
git checkout app-final
```
:::

## 📖 Conceito

<O KDoc de 3 partes da lição, em prosa: o que é / por que existe / a armadilha.
Levemente expandido, mas fiel ao que o KDoc diz.>

## 💻 Código de Referência

```kotlin title="ui/lessons/LNN<Nome>.kt"
<O composable da demo da lição (a função de demo + o essencial),
copiado do arquivo real. Não a tela inteira se for longa — o trecho que ensina.>
```

## 🧪 Experimente

<2-4 bullets do que fazer no app rodando e o que observar, vindos dos controles
interativos / do "Experimente"/notice da lição. Ex.: "Arraste o slider de padding e
veja a cor encolher numa caixa e o texto se afastar na outra.">
```

**Regras do template:**
- Conceito vem do KDoc real da lição (fiel; sem inventar).
- Código de Referência é copiado do arquivo real (a demo, não código novo). Se a demo for longa, incluir o trecho que ensina o ponto.
- "Experimente" vem do `notice`/controles da lição — o que o aluno mexe.
- Texto em português; identificadores no código em inglês (como no fonte).
- **Cuidado MDX:** blocos ` ``` ` aninhados dentro de um admonition `:::` precisam do fence externo com mais crases, ou reescrever sem aninhar. O plano trata isso caso a caso (o `git clone` dentro do `:::info` é o ponto de atenção).

## Mapa 1:1 (lição → aula)

| Aula | Título | Módulo | Arquivo-fonte |
|---|---|---|---|
| 01 | Seu primeiro Composable | Fundamentos | L01FirstComposable.kt |
| 02 | Text | Fundamentos | L02Text.kt |
| 03 | Parâmetros | Fundamentos | L03Parameters.kt |
| 04 | Modifier | Fundamentos | L04Modifier.kt |
| 05 | Column e Row | Layout | L05ColumnRow.kt |
| 06 | Box | Layout | L06Box.kt |
| 07 | Peso e espaço | Layout | L07WeightSpace.kt |
| 08 | LazyColumn | Layout | L08LazyColumn.kt |
| 09 | Button | Componentes Material3 | L09Button.kt |
| 10 | TextField | Componentes Material3 | L10TextField.kt |
| 11 | Card e Surface | Componentes Material3 | L11CardSurface.kt |
| 12 | Scaffold | Componentes Material3 | L12Scaffold.kt |
| 13 | remember | Estado | L13Remember.kt |
| 14 | Recomposição | Estado | L14Recomposition.kt |
| 15 | State hoisting | Estado | L15StateHoisting.kt |
| 16 | rememberSaveable | Estado | L16RememberSaveable.kt |
| 17 | derivedStateOf | Estado avançado | L17DerivedState.kt |
| 18 | LaunchedEffect | Estado avançado | L18LaunchedEffect.kt |
| 19 | ViewModel | Estado avançado | L19ViewModel.kt |

> Os nomes de arquivo devem ser confirmados contra o `compose-intro` (branch `app-final`) na hora de escrever cada aula — a coluna acima é o mapa esperado.

## Edições de suporte

**`sidebars.ts` — bloco `pdmiiSidebar`:** reescrito para 5 módulos com os títulos do playground e 19 itens:

- Módulo 1 — Fundamentos: aula-01..04
- Módulo 2 — Layout: aula-05..08
- Módulo 3 — Componentes Material3: aula-09..12
- Módulo 4 — Estado: aula-13..16
- Módulo 5 — Estado avançado: aula-17..19

(Só o `pdmiiSidebar` muda; `pdmiSidebar` e `ldmSidebar` ficam intactos.)

**`docs/pdmii/_category_.json`:** `label` e `description` atualizados para o playground (ex.: label "PDM II — Compose do Zero", descrição "Playground interativo de Jetpack Compose — 19 lições, do primeiro @Composable ao ViewModel").

**`docusaurus.config.ts`:** o link do navbar aponta para `/pdmii/aula-01` (continua válido). O label "PDMII — Android Nativo" pode ficar ou ser ajustado — decisão pequena, tratada no plano (default: manter o rótulo do curso "PDM II").

## Verificação

Não há testes unitários — a rede de segurança é o build do Docusaurus, que falha em MDX inválido, link interno morto e referência de sidebar faltante:

```bash
npm run build
```

Deve terminar com sucesso. Um `npm run start` local é opcional para conferência visual (não obrigatório na máquina de build).

Além do build: conferir que `docs/pdmii/` tem exatamente `aula-01..19` + `_category_.json` (nenhum `aula-20` sobrando) e que o `pdmiiSidebar` referencia exatamente esses 19.

## Entregas

Como são 19 páginas do mesmo template + 3 edições de suporte, o trabalho é uma sequência mecânica, fatiável assim:

1. **Portão + andaime** — confirmar a remoção dos 20; remover; reescrever `_category_.json`; reescrever `pdmiiSidebar`; criar um `aula-01` piloto para fixar o template; `npm run build` verde com 1 aula.
2. **Módulos 1–2** (aulas 02–08).
3. **Módulos 3–4** (aulas 09–16).
4. **Módulo 5** (aulas 17–19) + build final + restaurar `docs/ldm-printec`.

Cada fatia termina com `npm run build` verde.

## Fora de escopo

- Tocar em `docs/ldm/`, `docs/pdmi/`, ou o `pdmiSidebar`/`ldmSidebar`.
- Inventar exercícios "Mão na Massa" (o formato escolhido é enxuto).
- Mudar o app `compose-intro` (é só fonte de leitura).
- Publicar/deploy do site.
