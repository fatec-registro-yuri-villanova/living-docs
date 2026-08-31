# LDM — Bluetooth e Impressora (Printec): design da trilha

**Data:** 2026-08-31
**Status:** Design aprovado, aguardando plano de implementação
**Repositório de documentação:** `living-docs` (Docusaurus)
**Projeto documentado:** `printec`, branch `main` — Kotlin Multiplatform, Android + Desktop

---

## 1. Objetivo

Substituir o conteúdo atual da trilha LDM por um curso completo sobre o app
**Printec**: 15 aulas que levam o aluno do repositório vazio até o app rodando
em Android e Desktop, imprimindo etiquetas numa impressora térmica por
Bluetooth.

O terceiro dos cinco módulos chama-se **"Bluetooth e Impressora"** e concentra a
camada de transporte. A progressão, porém, é de fatia vertical: o aluno imprime
por Bluetooth já na aula 3, e o módulo 3 é onde aquele código tosco vira
transporte de verdade.

---

## 2. O projeto documentado

`printec` é um app Kotlin Multiplatform (Android + Desktop/JVM) que compõe e
imprime etiquetas numa **Lintian LT-8359** via **ESC/POS**.

### 2.1 Fatos de hardware (do autoteste da impressora, não de suposição)

| Propriedade | Valor |
|---|---|
| Modelo / firmware | LT-8359, V2.8F |
| Linguagem | ESC/POS |
| Code page padrão | 3 = PC860 (portuguesa) |
| Largura de impressão | 384 dots ≈ 48 mm úteis, papel 58 mm |
| Resolução | 203 dpi → 8 dots/mm |
| Colunas (Font A, 12×24) | 32 caracteres por linha |
| Interfaces | Bluetooth (SPP clássico) + USB Print |
| Alimentação | Bateria, **auto-desliga em 10 minutos** |

Duas consequências governam quase todo o código — e portanto quase toda aula:

- **A impressora hiberna.** Falha de conexão é fluxo normal, não exceção rara.
  Daí `ErroImpressao` tipado, retry único e abrir/escrever/fechar a cada trabalho.
- **A impressora não faz controle de fluxo.** Quando o buffer dela lota, ela
  descarta o excedente em silêncio. Daí `EscritaEmBlocos` (256 B, pausa de 20 ms,
  drenagem final de 600 ms).

### 2.2 Arquitetura na branch `main`

```
commonMain
  etiqueta/     LabelDocument, Bloco, QuebraDeLinha, Pc860, Impressora, EtiquetaDeTeste
  impressao/    PrinterTransport, ErroImpressao, EscritaEmBlocos
  dados/        LabelStore, LabelStoreSqlDelight, FabricaDeDriver
  ui/           EtiquetaViewModel, telas Compose, PreviewEtiqueta, Navegacao

jvmCommonMain   (source set intermediário: androidMain + jvmMain)
  impressao/    EscPosRenderer

androidMain                        jvmMain
  AndroidBluetoothTransport        TransporteDesktop
  DriverAndroid                      |- DesktopUsbTransport    (spooler javax.print)
                                     |- DesktopSerialTransport (jSerialComm / porta COM)
                                   DriverDesktop
```

O Bluetooth chega às duas plataformas por caminhos diferentes: no Android é
RFCOMM/SPP direto; no Desktop a JVM não tem Bluetooth nativo, então o
pareamento do Windows cria uma **porta COM virtual** e escrever nela é escrever
na impressora. Essa assimetria é um dos pontos didáticos centrais do módulo 3.

### 2.3 Branches disponíveis

Só duas são úteis para o curso:

- `base-app` — scaffold cru do wizard KMP (`Greeting`, `Platform`), ponto de partida
- `main` — app completo, gabarito final

**Não existem branches por aula.** Isso muda a convenção usada nas outras
trilhas do living-docs (`git checkout aula-11`) e está resolvido em §5.2.

---

## 3. Decisões tomadas

| # | Decisão | Alternativa descartada |
|---|---|---|
| 1 | **Construir do zero**: o aluno digita o código, saindo de `base-app` até chegar em `main` | Criar branches por aula no printec (exigiria reescrever o repo em fatias); leitura guiada da `main` (o aluno lê em vez de construir) |
| 2 | **App Printec inteiro**: inclui UI Compose completa, preview WYSIWYG e persistência SQLDelight | Só o caminho de impressão; versão enxuta de 5 aulas |
| 3 | **Apagar de vez** o conteúdo atual do LDM e renomear a trilha | Manter o rótulo antigo; arquivar em `_arquivo/` |
| 4 | **Fatia vertical primeiro**: papel saindo na aula 3, refatoração em camadas daí em diante | Bottom-up por camada (só imprime na aula 8); UI primeiro (inverte a dependência do preview) |

---

## 4. Escopo

### Dentro

- 15 aulas em `docs/ldm/aula-01.mdx` … `aula-15.mdx`
- Remoção dos 19 arquivos de aula do MergeSkills e de `PLAN_AULA04_1_DTOS.md`
  (não existem `aula-12` nem `aula-13`; existe um `aula-04-1`)
- `ldmSidebar` reescrito em `sidebars.ts` — 5 módulos
- Renomeação da trilha em `docusaurus.config.ts` (navbar + footer), em
  `docs/ldm/_category_.json` e na aba do LDM em `docs/index.mdx`
- Exercícios ("Mão na Massa") em cada aula, no padrão `<Tabs>` já usado na trilha

### Fora

- Qualquer alteração no repositório `printec` — este trabalho só escreve documentação
- As trilhas PDMI e PDMII, intocadas
- Aulas sobre iOS: o printec tem targets `jvm` e `android` apenas
- Vídeo, slides ou material fora do Docusaurus

---

## 5. Arquitetura da trilha

### 5.1 Arquivos

| Arquivo | Ação |
|---|---|
| `docs/ldm/aula-01..11, 14..20.mdx` + `aula-04-1.mdx` | 19 arquivos removidos |
| `docs/ldm/PLAN_AULA04_1_DTOS.md` | removido |
| `docs/ldm/aula-01.mdx` … `aula-15.mdx` | 15 arquivos novos, escritos do zero |
| `docs/ldm/_category_.json` | label → `LDM — Bluetooth e Impressora`, descrição nova |
| `sidebars.ts` | `ldmSidebar` reescrito: 5 categorias, 15 itens |
| `docusaurus.config.ts` (linhas ~71 e ~88) | rótulo da navbar e do footer |
| `docs/index.mdx` (linhas ~40–46) | stack e chamada da aba LDM |

Os nomes `aula-NN.mdx` são mantidos de propósito: as URLs (`/ldm/aula-01`) e os
links já existentes em navbar, footer e home continuam válidos sem redirecionamento.

### 5.2 Convenção de código da aula

Cada aula abre com o bloco que substitui o "branch da aula" das outras trilhas:

```markdown
:::info 🔀 Código da Aula
- **Ponto de partida:** o estado ao fim da aula anterior
  (a aula 01 parte de `git checkout base-app`)
- **Gabarito final:** `git checkout main`
:::
```

### 5.3 Anatomia de uma aula

Herdada do template que a trilha já usava:

1. Frontmatter — `sidebar_position`, `title`, `description`
2. `:::info 🔀 Código da Aula` (§5.2)
3. `## 📖 Conceito` — o problema antes da solução
4. `## 🗂️ Estrutura de Arquivos` — árvore com comentários `←`
5. `## Passo N — …` — código em blocos com `title="caminho/real.kt"` e `highlight-start`
6. `## ⚠️ Atenção` — a armadilha real da aula
7. `## ▶️ Como Executar` — comando Gradle e o que se espera ver
8. `## 💻 Mão na Massa` — 2 a 3 exercícios em `<Tabs>`

### 5.4 Fidelidade ao código

Todo bloco de código sai de `git show main:<arquivo>` do printec — nunca
inventado. Onde a aula mostra uma versão intermediária simplificada (aulas 3 e
9), o texto diz explicitamente que é provisória e em qual aula ela vira o código
final. Comentários de "porquê" do código original são preservados: são a melhor
parte do material didático.

---

## 6. Mapa das aulas

### Módulo 1 — Do zero ao primeiro papel

| # | Título | Cobre | Entregável |
|---|---|---|---|
| 01 | Setup KMP: Android e Desktop rodando | `settings.gradle.kts`, `shared/build.gradle.kts`, targets `jvm()`/`android {}`, source sets, `expect`/`actual` | Os dois apps abrindo a tela do scaffold |
| 02 | ESC/POS na mão | Autoteste da impressora, `ESC @`, `ESC t 3`, texto+LF, `GS ! n`, `ESC J n` | `olaMundo(): ByteArray` + teste em `commonTest` |
| 03 | Papel saindo: Bluetooth e COM | Pareamento pelo SO, RFCOMM/SPP, `BLUETOOTH_CONNECT`, jSerialComm | Botão "Imprimir OLÁ" funcionando nas duas plataformas |

A aula 3 escreve código deliberadamente tosco — um arquivo, exceção crua — e diz isso.

### Módulo 2 — O documento e os bytes

| # | Título | Cobre | Entregável |
|---|---|---|---|
| 04 | `LabelDocument` e `Bloco` | Sealed interface, `Titulo`/`Linha`/`Qr`/`Avanco`, `normalizado()` e o borrão do negrito em 2x | Modelo puro, sem Compose e sem plataforma |
| 05 | `QuebraDeLinha` | 32 colunas, escala divide colunas, quebra por palavra, palavra maior que a linha | Objeto + suíte de testes (TDD) |
| 06 | `Pc860` | Tabela própria vs. `Charset.forName("cp860")` no Android, `codificar`/`decodificar`, substituições contadas | Codificação testada sem hardware |
| 07 | `EscPosRenderer` | Source set `jvmCommonMain`, renderização completa, QR na mão via `GS ( k` | `LabelDocument` → `ByteArray` |

### Módulo 3 — Bluetooth e Impressora

| # | Título | Cobre | Entregável |
|---|---|---|---|
| 08 | `PrinterTransport` e erros tipados | Interface, `PrinterTarget`, `ErroImpressao`, abrir/escrever/fechar por trabalho | Contrato comum às duas plataformas |
| 09 | `AndroidBluetoothTransport` | Pareados em vez de descoberta, Bluetooth desligado ≠ não pareada, `SecurityException` em `bondedDevices`, permissão em runtime | A aula 3 refatorada em transporte de verdade |
| 10 | Desktop: USB, serial e `EscritaEmBlocos` | `DesktopUsbTransport`, `DesktopSerialTransport`, roteamento por prefixo `usb:`/`serial:`, 256 B + 20 ms + 600 ms | Transporte do desktop completo |

### Módulo 4 — Estado, telas e preview

| # | Título | Cobre | Entregável |
|---|---|---|---|
| 11 | `EtiquetaViewModel` | Máquina de estados, guarda de reentrância, retry único, nada não-tipado escapa | Estado de impressão observável |
| 12 | Telas Compose e navegação | Compor, Etiquetas, Ajustes, `StatusImpressao` com ação por erro | App navegável nas duas plataformas |
| 13 | Preview WYSIWYG | `PreviewEtiqueta` reusando `QuebraDeLinha`; o teste que prova que preview e renderer quebram igual | Pré-visualização fiel |

### Módulo 5 — Persistência e entrega

| # | Título | Cobre | Entregável |
|---|---|---|---|
| 14 | SQLDelight nas duas plataformas | `Printec.sq`, driver por `expect`/`actual`, rascunho, etiquetas salvas, configurações | Persistência funcionando |
| 15 | Calibração e entrega | `etiquetaDeCalibracao()`, confirmar 384 dots em papel, fiação final, builds, troubleshooting | App completo rodando em Android e Desktop |

---

## 7. Verificação

- `npm run build` do Docusaurus passa sem link quebrado e sem aviso novo
- Preview local: sidebar com os 5 módulos, as 15 aulas navegáveis, nenhuma
  página órfã da trilha antiga
- Cada bloco de código conferido contra `git show main:<arquivo>` do printec

---

## 8. Riscos e pontos em aberto

- **Aulas intermediárias divergem do repo.** As aulas 3 e 9 mostram código que
  não existe em nenhuma branch do printec. Mitigação: marcar como provisório e
  apontar a aula que chega no código final.
- **Sem hardware, o aluno trava na aula 3.** Mitigação: as aulas 2 e 4–7
  funcionam inteiramente por teste; a aula 3 traz uma seção sobre o que fazer
  sem impressora à mão.
- **`DesktopSerialTransport` é específico do Windows.** A porta COM virtual é o
  caminho do Windows; em Linux/macOS o dispositivo aparece com outro nome. A
  aula 10 registra isso em vez de fingir portabilidade.
