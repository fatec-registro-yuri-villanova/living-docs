# Trilha LDM — Printec: decisões tomadas durante a execução

**Data:** 2026-09-03
**Spec:** [`2026-08-31-ldm-printec-design.md`](2026-08-31-ldm-printec-design.md)
**Plano:** [`2026-08-31-ldm-printec.md`](../plans/2026-08-31-ldm-printec.md)
**Branch:** `docs/ldm-printec` — 24 commits

Durante a execução das 16 tarefas, 18 conflitos entre o plano e o código real do
printec precisaram ser decididos sem consulta. Cada um está registrado abaixo com o
motivo e o custo de estar errado. Treze deles são correções a defeitos do próprio
plano — quase todos pela mesma causa: o plano descreveu código de memória em vez de
extrair do repositório.

---

**Ruling 1: `Relogio.android.kt` e `Relogio.jvm.kt` saem da aula 09 (T10) e entram na aula 10 (T11).**
— Motivo: são declarações `actual` cujo `expect agoraEmMillis()` mora dentro de `LabelStoreSqlDelight.kt`, que só chega na aula 10. Um `actual` sem `expect` é erro de compilação, então a aula 09 como planejada NÃO ficaria verde — violando a Global Constraint "toda aula termina com um resultado visível" e a própria seção "Como Executar" da T10, que promete `DriverDesktopTest` passando. Sem os dois `Relogio.*`, a aula 09 compila: `DriverDesktop` só depende de `PrintecDatabase` (gerado do `Printec.sq`, presente) e `FabricaDeDriver`. Na aula 10 o par `expect`/`actual` aparece junto, que também é melhor didática.
— Custo se estiver errado: a aula 10 fica um pouco mais cheia e a aula 09 perde o gancho de `expect`/`actual`; correção é mover dois arquivos de 104 bytes de volta.

**Ruling 2: no info string dos blocos, `reference="base-app"` vem SEMPRE depois de `title="..."`.**
— Motivo: o verificador captura o `title` e só procura `reference` no resto da linha à direita dele. Ordem invertida faria o bloco ser conferido contra `main`, onde o arquivo do scaffold não existe, e a T2 falharia sem motivo aparente.
— Custo se estiver errado: nenhum — é restrição de formato, não de conteúdo.

**Ruling 3 (minor, aceito): o coverage grep da T16 exclui `EtiquetaDeTeste.kt`.**
— Motivo: o filtro `grep -v "Test"` casa o substring "Test" dentro de "Teste". O arquivo está documentado na aula 04; só não é verificado automaticamente.
— Custo se estiver errado: nenhum arquivo de produção fica sem documentação por isso; a verificação é que fica um pouco mais fraca.

**Ruling 4: a URL do clone é `https://github.com/negoNegoso/printec.git`.**
— Motivo: o plano escreveu `<org>` como placeholder e isso vazaria para o site. `git -C ../printec remote -v` dá o remote real. A aula 01 também tem um bloco de clone, então a URL precisa estar certa a partir daqui; `docs/ldm/index.mdx` é corrigido na onda de fixes da revisão final.
— Custo se estiver errado: se o repositório for movido ou tornado privado, duas linhas de clone apontam para o lugar errado.

**Ruling 5: o Exercício 2 da aula 03 pode divergir do texto do plano; a versão do implementer fica.**
— Motivo: o plano manda o aluno passar "um emoji e um `\n`" e verificar `substituidos == 2`. Está aritmeticamente errado para emoji fora do BMP: `Pc860.codificar` percorre `texto.indices`, que são unidades UTF-16, então 🎉 sozinho já conta 2 e o total vira 3. O implementer reescreveu a prosa explicando isso em vez de deixar um exercício com número errado. A spec (§5.4) manda os exercícios pedirem que o aluno faça um teste real passar — um exercício cujo número não fecha viola isso. E o ponto UTF-16 é diretamente relevante, porque a indexação por char é exatamente o que a classe faz.
— Custo se estiver errado: o exercício fica mais longo e introduz um assunto (pares surrogate) que o plano não previa para a aula 03.

**Ruling 6: o Exercício 1 da aula 04 é reescrito; o texto do plano estava errado.**
— Motivo: o plano mandava o aluno acrescentar um subtipo de `Bloco` e ver o erro de `when` exaustivo. Não acontece: `normalizado()` termina em `else -> this`. Verifiquei eu mesmo com `git show main:.../LabelDocument.kt` — o `else` está lá. Os `when` sem `else` sobre `Bloco` só existem em `EscPosRenderer.kt` (aula 05), `LabelStoreSqlDelight.kt` (aula 10) e `PreviewEtiqueta.kt` (aula 12), nenhum deles escrito ainda na aula 04. O implementer reescreveu o exercício para o aluno descobrir que `else` derrota a rede de proteção, apontando para a aula 05. Um exercício que promete um erro de compilação que não ocorre é pior que exercício nenhum.
— Custo se estiver errado: o exercício ensina o ponto pelo avesso (o perigo do `else`) em vez do ponto direto (a força do sealed).

**Ruling 7: a sequência de QR tem CINCO comandos `GS ( k`, não quatro.**
— Motivo: o brief do plano dizia quatro. Contei eu mesmo em `EscPosRenderer.kt` na main: `grep -c "comando(GS, 0x28, 0x6B"` = 5 (modelo, tamanho do módulo, correção de erro, armazenar dados, imprimir). O implementer corrigiu antes de escrever. Terceira vez que uma afirmação minha do plano não bateu com o código.
— Custo se estiver errado: nenhum; é contagem verificável e verificada.

**Ruling 8: o Exercício 2 da aula 07 é reescrito e a aula assume a lacuna de cobertura.**
— Motivo: o plano mandava o aluno remover `exigirPermissao()` de `listarDestinos()` e ver qual teste quebra. Nenhum quebra. Li o arquivo: `AndroidBluetoothTransportTest.kt` tem UM teste, que só afere `UUID_SPP` contra a string padrão do SPP. Prometer uma falha que não acontece é pior que não propor o exercício.
— Consequência maior, que a aula precisa dizer em voz alta: o "resultado visível" da aula 07 é um teste que confere uma constante. A classe de 4,4 KB, com as três armadilhas reais (Bluetooth desligado ≠ não pareado, `SecurityException` em `bondedDevices`, socket fechado no `finally`), não tem cobertura automatizada nenhuma — só se verifica com hardware, na aula 14. O implementer reescreveu o exercício para ensinar exatamente essa lacuna, que é o mais honesto disponível sem inventar teste.
— Custo se estiver errado: a aula 07 fica com o resultado visível mais fraco da trilha, e isso passa a estar escrito nela.

**Ruling 9: a aula 08 descreve a cobertura dos testes com precisão, contra a simplificação do meu brief.**
— Motivo: o brief dizia que "só o roteamento é testado de verdade, porque é a única lógica que não depende de hardware". Falso. Conferi: `TransporteDesktopTest.kt` tem DUAS classes — `TransporteDesktopTest` (4 testes de roteamento com dublês) e `DesktopSerialTransportTest` (1 teste que carrega a biblioteca nativa jSerialComm de verdade e checa entradas bem formadas). E `DesktopUsbTransportTest` tem 2 testes sobre a classe real: não estoura sem impressora instalada, e destino inexistente vira `FalhaAoConectar`. Ou seja, as classes reais SÃO exercitadas, de forma independente de hardware.
— Custo se estiver errado: nenhum identificado; a descrição precisa é estritamente melhor que a simplificação, e é a que sustenta a promessa da trilha.

**Ruling 10: a aula 09 NÃO termina com `DriverDesktopTest` verde; o resultado visível é o arquivo `.db` no disco.**
— Motivo: o plano prometia o teste verde ao fim da aula 09. Impossível. Conferi: `DriverDesktopTest.kt` instancia `LabelStoreSqlDelight` nas linhas 28 e 53, e essa classe só chega na aula 10. O teste não compila na aula 09. Defeito estrutural do meu decomposição de tarefas, não do implementer.
— Onde o plano já estava certo: o mapa das aulas (§6) sempre listou o resultado visível da aula 09 como "`printec.db` criado em `%APPDATA%\Printec`". Eram as seções "🔴 O Teste" e "▶️ Como Executar" da tarefa que prometiam verde. A correção do implementer realinha a tarefa com o mapa e com a spec.
— Custo se estiver errado: a aula 09 mostra um teste que o aluno só consegue rodar na aula seguinte; a alternativa seria mover `DriverDesktopTest` inteiro para a aula 10. O revisor vai julgar qual serve melhor.

**Ruling 11: a correção fora de escopo em `docs/ldm/aula-01.mdx` fica.**
— Motivo: a aula 01 dizia que o `expect`/`actual` real apareceria na "Aula 09". Meu Ruling 1 moveu isso para a 10 e criou a referência quebrada. O implementer corrigiu para "Aula 10" no mesmo commit. É dívida gerada pelo meu próprio ruling, e uma referência cruzada errada é exatamente a classe de erro que as revisões tratam como Important.
— Custo se estiver errado: uma linha a mais no diff da Task 10, fora da lista de arquivos declarada.

**Ruling 12: a regra do fence é agnóstica de linguagem; minha formulação estava errada.**
— Motivo: eu vinha escrevendo "fence **Kotlin**" nos dispatches. O SQL escorreu pela brecha, e com razão — a regra que eu dei não o cobria literalmente. A regra real é: qualquer bloco cercado que mostre código que não seja cópia literal de arquivo do repo tem de ser code span inline, seja qual for a linguagem. As únicas exceções sem `title=` são invocações de shell/terminal e a árvore de diretórios desenhada à mão.
— Custo se estiver errado: nenhum; é a regra que a spec já queria dizer.

**Ruling 13: `Impressora.DOTS_LARGURA` é código morto, e isso vira conteúdo — inclusive na aula 15.**
— Motivo: o implementer reportou que a constante não é usada; conferi com `git grep DOTS_LARGURA main` e ela aparece SÓ na própria declaração e no comentário dela. Nada no app inteiro lê. Meu brief da aula 12 dizia que a proporção "384 dots / 32 colunas" governa o preview — falso; o preview mede 32 caracteres monoespaçados contra a largura disponível.
— Verifiquei se contaminou aulas já aprovadas: NÃO. `aula-02.mdx:126` atribui uso explicitamente só ao `DOTS_POR_MM`, e as menções em 02 e 04 tratam a constante como inferência a confirmar, nunca como valor lido pelo código. Nenhuma correção retroativa necessária.
— CONSEQUÊNCIA PARA A TASK 16 (aula 15): o Exercício 1 do meu plano manda medir a régua e "calcular o DOTS_LARGURA real e dizer o que mudaria no app". A resposta honesta é: NADA muda, porque nenhum código lê a constante. Isso é um momento didático melhor que o planejado — uma constante que documenta uma crença sobre o hardware e não governa nada — mas o dispatch da Task 16 precisa dizer isso, senão o exercício pede uma resposta que não existe.
— Custo se estiver errado: nenhum; é fato verificável e verificado por grep no repo inteiro.

**Ruling 14: `FormularioEtiqueta.kt` não é UI; é modelo de dados puro.**
— Motivo: meu brief o tratava como composable. Conferi: zero `@Composable` no arquivo. É `LinhaDoFormulario` (data class) mais a conversão para `LabelDocument`. O implementer descreveu como é.
— Custo se estiver errado: nenhum.

**Ruling 15: a lista de impressoras na tela mostra só o NOME; os prefixos `usb:`/`serial:` não aparecem na UI.**
— Motivo: meu brief mandava o aluno ver "entradas `usb:` e `serial:`" na tela de Ajustes. Conferi `TelaConfiguracoes.kt`: a linha 91 é `Text(alvo.nome)`. O `id` (que carrega o prefixo) só é usado em `selected =` e ao gravar a config. O aluno procuraria na tela algo que não existe.
— Não contradiz a aula 08: lá o exercício manda chamar `listarDestinos()` direto e inspecionar a saída crua da API, onde os prefixos ESTÃO visíveis. Contexto diferente, e aquela aula continua correta.
— Custo se estiver errado: nenhum; é o que o código exibe.

**Ruling 16: o Exercício 1 da aula 13 não pode declarar os 384 dots "confirmados".**
— Motivo: a aula 02 já registrou que a confirmação em papel é tarefa da aula 15. Declarar confirmado aqui contradiz a própria trilha. Alinhado com o Ruling 13 (a constante nem é lida pelo código).
— Custo se estiver errado: nenhum.

**Ruling 17: o Exercício 3 aponta para a spec de design, não para o README.**
— Motivo: meu plano mandava o aluno ler o `README.md` e listar três coisas que o app não faz. O README é boilerplate genérico do wizard KMP e não lista nada disso. O que realmente contém o escopo negativo (descoberta Bluetooth no app, código de barras 1D, sincronização entre dispositivos) é `docs/superpowers/specs/2026-08-24-printec-etiquetas-design.md` §3/§14, dentro do próprio repo printec. O implementer redirecionou.
— Custo se estiver errado: o exercício manda ler um documento mais longo que o README.

**Ruling 18: os dois caminhos residuais do verificador ficam PARQUEADOS, não corrigidos agora.**
— O que são: a re-review reproduziu ao vivo dois jeitos de passar código inventado que a minha sonda não cobriu. (a) fence SEM tag de linguagem nenhuma contendo código fabricado passa em silêncio, porque o script isenta toda cerca sem linguagem supondo que é árvore de diretório. (b) fence INDENTADO (dentro de item de lista) escapa por completo, mesmo com linguagem explícita, porque o regex de abertura está ancorado na coluna 0 — a cerca nem é reconhecida como cerca.
— Por que parqueado: nenhum dos dois padrões existe nas 16 aulas atuais (grep confirma), então a fidelidade do que está entregue não é afetada — 59/59 conferidos de forma independente. Não são regressões da onda de fixes; são limites estruturais que ela não alcançou. E o processo não prevê segunda onda: achados residuais vão para o usuário decidir.
— Custo se estiver errado: quem acrescentar a aula 16 pode introduzir código inventado por um desses dois caminhos sem o script reclamar. É exatamente a classe de defeito que reincidiu 3x nesta trilha e que só foi pega por atenção humana.
— Recomendação ao usuário: é um follow-up curto e de alto valor. Duas linhas de regex.


---

## Nota posterior

**O Ruling 2 está obsoleto.** A onda de correções da revisão final reescreveu
`scripts/verificar-fidelidade.mjs` para procurar `reference=` no info string inteiro,
não apenas à direita de `title=`. A restrição de ordem entre os dois atributos deixou
de existir. As aulas continuam escrevendo `title=` antes de `reference=`, mas agora
por convenção, não por necessidade.

**O Ruling 12 foi codificado.** Ele corrigiu a regra do fence para ser agnóstica de
linguagem, mas viveu apenas como prosa nos dispatches e uma varredura manual. A
revisão final apontou isso como a lacuna de maior alcance da branch, e a onda de
correções finalmente a colocou dentro do verificador.
