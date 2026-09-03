# LDM — Bluetooth e Impressora (Printec): design da trilha

**Data:** 2026-08-31
**Status:** Design aprovado, aguardando plano de implementação
**Repositório de documentação:** `living-docs` (Docusaurus)
**Projeto documentado:** `printec`, branches `base-app` e `main` — Kotlin Multiplatform, Android + Desktop

---

## 1. Objetivo

Substituir o conteúdo atual da trilha LDM por um curso completo sobre o app
**Printec**: 15 aulas que levam o aluno do scaffold vazio até o app rodando em
Android e Desktop, imprimindo etiquetas numa impressora térmica por Bluetooth.

O terceiro dos cinco módulos chama-se **"Bluetooth e Impressora"** e concentra a
camada de transporte.

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
  Relogio.android                    |- DesktopSerialTransport (jSerialComm / porta COM)
                                   DriverDesktop, Relogio.jvm
```

O Bluetooth chega às duas plataformas por caminhos diferentes: no Android é
RFCOMM/SPP direto; no Desktop a JVM não tem Bluetooth nativo, então o
pareamento do Windows cria uma **porta COM virtual** e escrever nela é escrever
na impressora. Essa assimetria é um dos pontos didáticos centrais do módulo 3.

### 2.3 Branches disponíveis

- `base-app` — scaffold cru do wizard KMP (`Greeting`, `Platform`, `App`), ponto de partida
- `main` — app completo, gabarito final

**Não existem branches por aula.** Isso muda a convenção usada nas outras
trilhas do living-docs (`git checkout aula-11`) e está resolvido em §5.2.

### 2.4 Suíte de testes disponível

A `main` traz **20 arquivos de teste** cobrindo quase toda camada — é o que
torna possível dar resultado visível em toda aula sem inventar código:

| Source set | Comando Gradle | Testes |
|---|---|---|
| `commonTest` | `:shared:jvmTest` (roda junto) | `QuebraDeLinhaTest`, `Pc860Test`, `EtiquetaDeTesteTest`, `EscritaEmBlocosTest`, `EtiquetaViewModelTest`, `FormularioEtiquetaTest`, `LinhasDePreviewTest`, `SharedCommonTest` |
| `jvmCommonTest` | `:shared:jvmTest` | `EscPosRendererTest`, `EscPosCoffeeVivoTest`, `RendererIgualAoPreviewTest` |
| `jvmTest` | `:shared:jvmTest` | `LabelStoreTest`, `DriverDesktopTest`, `TransporteDesktopTest`, `DesktopUsbTransportTest`, `SharedLogicDesktopTest` |
| `androidHostTest` | `:shared:testAndroidHostTest` | `AndroidBluetoothTransportTest`, `SharedLogicAndroidHostTest` |
| `androidDeviceTest` | dispositivo/emulador | `EscPosCoffeeDispositivoTest` |

---

## 3. Decisões tomadas

| # | Decisão | Alternativa descartada |
|---|---|---|
| 1 | **Construir do zero**: o aluno digita o código, saindo de `base-app` até chegar em `main` | Criar branches por aula no printec; leitura guiada da `main` |
| 2 | **App Printec inteiro**: inclui UI Compose completa, preview WYSIWYG e persistência SQLDelight | Só o caminho de impressão; versão enxuta de 5 aulas |
| 3 | **Apagar de vez** o conteúdo atual do LDM e renomear a trilha | Manter o rótulo antigo; arquivar em `_arquivo/` |
| 4 | **Zero código inventado + resultado visível em toda aula**: ordem ditada pelo grafo de dependências dos arquivos reais, com o teste real da `main` como resultado de cada aula | Fatia vertical com papel na aula 3 — exigia código intermediário que não existe em branch nenhuma |

A decisão 4 substitui uma escolha anterior de "fatia vertical primeiro". As duas
são incompatíveis: imprimir na aula 3 só era possível escrevendo uma versão
tosca e provisória do transporte, que é exatamente o que a decisão 4 proíbe. O
custo aceito: **papel sai na aula 13**, não na 3.

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

### 5.3 Fidelidade ao código — regra dura

**Nenhum bloco de código do material é escrito por quem redige a aula.** Todo
bloco é copiado literalmente de uma das duas branches:

- `git show base-app:<arquivo>` — só na aula 01, para o scaffold de partida
- `git show main:<arquivo>` — todo o resto

Consequências que o design assume:

- **Não há versões intermediárias.** Um arquivo aparece uma vez, completo, na
  aula em que suas dependências já existem. Nenhuma aula mostra "uma versão
  simplificada por enquanto".
- **Os arquivos de build não mudam durante a trilha.** Verificado:
  `git diff base-app main -- settings.gradle.kts build.gradle.kts
  shared/build.gradle.kts gradle/libs.versions.toml androidApp/build.gradle.kts
  desktopApp/build.gradle.kts` retorna vazio. O scaffold já traz o plugin do
  SQLDelight, o `escpos-coffee`, o `jSerialComm` e o source set `jvmCommonMain`
  configurados. Da aula 02 em diante, toda aula acrescenta apenas arquivos
  `.kt` e `.sq` — nenhuma linha de Gradle.
- **Os comentários do código original são preservados.** Eles explicam o porquê
  de cada decisão a partir do sintoma real que a motivou (o título que borra em
  2x, a cauda do documento descartada, `SecurityException` em `bondedDevices`) —
  são a melhor parte do material didático.

### 5.4 Ordem das aulas — teste real primeiro

Cada aula da fundação até a máquina de estados segue o mesmo ciclo:

1. A aula mostra o **arquivo de teste real** da `main` (ex.: `Pc860Test.kt`)
2. O aluno roda o Gradle: **vermelho** (a classe ainda não existe)
3. A aula mostra o **arquivo de produção real** da `main` (ex.: `Pc860.kt`)
4. O aluno roda de novo: **verde** — este é o resultado visível da aula

Os exercícios "Mão na Massa" seguem a mesma regra: pedem que o aluno escreva o
código que faz um teste real passar, ou que estenda um teste real. Nunca pedem
para inventar uma API que não existe no projeto.

### 5.5 Anatomia de uma aula

Herdada do template que a trilha já usava:

1. Frontmatter — `sidebar_position`, `title`, `description`
2. `:::info 🔀 Código da Aula` (§5.2)
3. `## 📖 Conceito` — o problema antes da solução
4. `## 🗂️ Estrutura de Arquivos` — árvore com comentários `←`
5. `## 🔴 O Teste` — teste real, e o comando que o deixa vermelho (§5.4)
6. `## Passo N — …` — código com `title="caminho/real.kt"` e `highlight-start`
7. `## ⚠️ Atenção` — a armadilha real da aula
8. `## ▶️ Como Executar` — comando Gradle e o que se espera ver (verde)
9. `## 💻 Mão na Massa` — 2 a 3 exercícios em `<Tabs>`

As aulas 13 a 15 trocam `🔴 O Teste` por `▶️ Como Executar` com o app na tela,
porque ali o resultado visível é o app rodando e a etiqueta no papel.

---

## 6. Mapa das aulas

### Módulo 1 — Fundação

| # | Título | Arquivos reais introduzidos | Resultado visível |
|---|---|---|---|
| 01 | Setup KMP: os dois apps rodando | `settings.gradle.kts`, `build.gradle.kts`, `shared/build.gradle.kts`, `libs.versions.toml` (base) | Android e Desktop abrindo a tela do scaffold |
| 02 | Largura, colunas e quebra de linha | `Impressora`, `QuebraDeLinha` + `QuebraDeLinhaTest` | Teste verde |
| 03 | Acentuação: a code page PC860 | `Pc860` + `Pc860Test` | Teste verde |

### Módulo 2 — O documento e os bytes

| # | Título | Arquivos reais introduzidos | Resultado visível |
|---|---|---|---|
| 04 | O documento da etiqueta | `LabelDocument`, `EtiquetaDeTeste` + `EtiquetaDeTesteTest` | Teste verde |
| 05 | Renderizar ESC/POS | `EscPosRenderer` (`jvmCommonMain`) + `EscPosRendererTest`, `EscPosCoffeeVivoTest` | Bytes ESC/POS conferidos byte a byte |
| 06 | O contrato de saída | `PrinterTransport`, `ErroImpressao`, `EscritaEmBlocos` + `EscritaEmBlocosTest` | Teste verde |

### Módulo 3 — Bluetooth e Impressora

| # | Título | Arquivos reais introduzidos | Resultado visível |
|---|---|---|---|
| 07 | Bluetooth SPP no Android | `AndroidBluetoothTransport` + `AndroidBluetoothTransportTest` | `:shared:testAndroidHostTest` verde |
| 08 | USB e serial no Desktop | `DesktopUsbTransport`, `DesktopSerialTransport`, `TransporteDesktop` + `TransporteDesktopTest`, `DesktopUsbTransportTest` | Teste verde; lista de portas COM da máquina |

### Módulo 4 — Estado e persistência

| # | Título | Arquivos reais introduzidos | Resultado visível |
|---|---|---|---|
| 09 | Banco nas duas plataformas | `Printec.sq`, `LabelStore`, `FabricaDeDriver`, `Relogio.android`/`Relogio.jvm`, `DriverAndroid`, `DriverDesktop` + `DriverDesktopTest` | `printec.db` criado em `%APPDATA%\Printec` |
| 10 | O store SQLDelight | `LabelStoreSqlDelight` + `LabelStoreTest` | Teste verde |
| 11 | A máquina de estados da impressão | `EtiquetaViewModel` + `EtiquetaViewModelTest` | Teste verde (o maior da suíte) |

### Módulo 5 — Telas, papel e entrega

| # | Título | Arquivos reais introduzidos | Resultado visível |
|---|---|---|---|
| 12 | Preview fiel à impressora | `FormularioEtiqueta`, `PreviewEtiqueta` + `FormularioEtiquetaTest`, `LinhasDePreviewTest`, `RendererIgualAoPreviewTest` | O teste que prova que preview e impressora quebram linha igual |
| 13 | O app Desktop | `StatusImpressao`, `TelaCompor`, `TelaEtiquetas`, `TelaConfiguracoes`, `Navegacao`, `desktopApp/main.kt` | **App na tela e etiqueta no papel** |
| 14 | O app Android | `PrintecApp`, `MainActivity`, `AndroidManifest.xml` | **App no celular, papel por Bluetooth** |
| 15 | Calibração e entrega | `etiquetaDeCalibracao()` em papel, `SharedCommonTest` e afins, builds de entrega | Etiqueta de calibração no papel, suíte inteira verde |

Notas de conteúdo que o plano deve respeitar:

- `expect`/`actual` só existe em um lugar na `main` (`agoraEmMillis()`, na aula
  09). `FabricaDeDriver` é **interface, não `expect`/`actual`** — e o próprio
  código explica por quê: o Android precisa de `Context` no construtor e o
  Desktop de um caminho de arquivo. Isso é conteúdo da aula 09, não da 01.
- A aula 13 introduz as três telas de uma vez porque `AppEtiquetas` referencia
  as três. Não há como rodar o app com um subconjunto delas.

---

## 7. Verificação

- `npm run build` do Docusaurus passa sem link quebrado e sem aviso novo
- Preview local: sidebar com os 5 módulos, as 15 aulas navegáveis, nenhuma
  página órfã da trilha antiga
- Cada bloco de código conferido byte a byte contra
  `git show main:<arquivo>` (ou `base-app`, na aula 01)

---

## 8. Riscos e pontos em aberto

- **Papel só na aula 13.** É consequência direta da regra de fidelidade: o
  único ponto de entrada real que imprime é o app montado. Mitigação: as aulas
  02 a 12 entregam teste verde, e a 09 entrega um arquivo de banco no disco.
- **A aula 13 é a mais longa da trilha** — cinco arquivos de UI mais o
  `main.kt`. Mitigação: dividir em muitos "Passo N", um por tela.
- **Sem hardware o aluno para na aula 13.** As aulas 01 a 12 rodam inteiramente
  sem impressora. A aula 13 precisa dizer isso na abertura.
- **`DesktopSerialTransport` é específico do Windows.** A porta COM virtual é o
  caminho do Windows; em Linux/macOS o dispositivo aparece com outro nome. A
  aula 08 registra isso em vez de fingir portabilidade.
- ~~Risco de o plugin do SQLDelight ser aplicado antes de existir `.sq`.~~
  **Resolvido por verificação:** os arquivos de build são idênticos em
  `base-app` e `main`, e `base-app` é uma branch que compila. O scaffold já
  convive com o plugin sem nenhum `.sq`. A trilha nunca edita Gradle depois da
  aula 01.
