#!/usr/bin/env node
// Guardiao da regra "zero codigo inventado" da trilha LDM.
//
// A regra do design (secao 5.3) nao e "blocos com title= tem que conferir": e
// que NENHUM bloco cercado do material foi escrito por quem redige a aula. Este
// script percorre docs/ldm/*.mdx, varre TODA cerca ``` e cobra duas coisas:
//
//   1. Toda cerca ou e um trecho real do repositorio printec (tem title= com
//      caminho de arquivo de codigo), ou e uma cerca que legitimamente nao vem
//      de arquivo nenhum: comando de shell (bash/sh/console/text) ou arvore de
//      diretorios desenhada a mao (cerca sem linguagem).
//   2. Todo bloco com title= e um trecho CONTIGUO e LITERAL do arquivo real.
//
// Trecho contiguo, e nao arquivo inteiro, porque uma aula legitimamente mostra
// so uma funcao de um arquivo grande. O que a regra proibe e texto que nao
// existe no repositorio.
import { readFileSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const PRINTEC = process.env.PRINTEC_REPO ?? "../printec";
const DIR = process.env.LDM_DOCS ?? "docs/ldm";

// Linguagens que podem aparecer sem title= porque nao saem de arquivo nenhum:
// linha de comando e saida de terminal. Cerca sem linguagem tambem passa — sao
// as arvores de diretorio e as continhas desenhadas a mao no texto.
const SEM_TITULO_OK = new Set(["bash", "sh", "console", "text"]);
// Extensoes de arquivo de codigo que a trilha mostra. Um title= que nao termina
// numa delas nao e caminho de arquivo — e rotulo em prosa, e rotulo em prosa e
// exatamente o disfarce de um bloco inventado.
const EXTENSOES = /\.(kt|kts|sq|toml|xml|json|pro)$/;

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

// Cada cerca do arquivo: linha de abertura, info string e corpo cru.
function* cercas(texto) {
    const linhas = texto.replace(/\r\n/g, "\n").split("\n");
    for (let i = 0; i < linhas.length; i++) {
        const abertura = /^(`{3,})(.*)$/.exec(linhas[i]);
        if (!abertura) continue;
        const [, crases, info] = abertura;
        const fecha = new RegExp(`^\`{${crases.length},}\\s*$`);
        const corpo = [];
        let j = i + 1;
        for (; j < linhas.length && !fecha.test(linhas[j]); j++) corpo.push(linhas[j]);
        yield {
            linha: i + 1,
            info: info.trim(),
            corpo: corpo.join("\n"),
            fechada: j < linhas.length,
        };
        i = j;
    }
}

const falhas = [];
let conferidos = 0;

const arquivos = readdirSync(DIR).filter((n) => n.endsWith(".mdx")).sort();
for (const nome of arquivos) {
    const texto = readFileSync(join(DIR, nome), "utf8");
    for (const { linha, info, corpo, fechada } of cercas(texto)) {
        const onde = `${nome}:${linha}`;
        if (!fechada) {
            falhas.push(`${onde}: cerca aberta e nunca fechada`);
            continue;
        }
        const lingua = info.split(/\s+/)[0] ?? "";
        // reference= e title= sao procurados na info string inteira: a ordem em
        // que o autor escreve os atributos nao importa.
        const titulo = /title="([^"]+)"/.exec(info)?.[1];

        if (titulo === undefined) {
            if (lingua !== "" && !SEM_TITULO_OK.has(lingua)) {
                falhas.push(
                    `${onde}: bloco \`${lingua}\` sem title= — todo bloco de codigo ` +
                    `precisa apontar para o arquivo real do printec`,
                );
            }
            continue;
        }
        if (!EXTENSOES.test(titulo)) {
            falhas.push(
                `${onde}: title="${titulo}" nao e caminho de arquivo de codigo ` +
                `(esperado terminar em .kt .kts .sq .toml .xml .json .pro)`,
            );
            continue;
        }
        if (corpo.trim() === "") {
            falhas.push(`${onde}: bloco de ${titulo} esta vazio`);
            continue;
        }
        conferidos++;
        const ref = /reference="([^"]+)"/.exec(info)?.[1] ?? "main";
        const real = arquivoReal(ref, titulo);
        if (real === null) {
            falhas.push(`${onde}: ${ref}:${titulo} nao existe no printec`);
            continue;
        }
        if (!normalizar(real).includes(normalizar(corpo))) {
            falhas.push(`${onde}: bloco de ${titulo} nao confere com ${ref}`);
        }
    }
}

// Piso: uma regressao que apagasse todas as info strings deixaria o laco sem
// nada para conferir e o script sairia verde sem ter verificado nada.
if (falhas.length === 0 && conferidos === 0) {
    console.error(`FALHA — nenhum bloco conferido em ${DIR}: a verificacao nao rodou.`);
    process.exit(1);
}

if (falhas.length > 0) {
    console.error(`FALHA — ${falhas.length} bloco(s) divergente(s):`);
    for (const f of falhas) console.error(`  - ${f}`);
    process.exit(1);
}
console.log(`OK — ${conferidos} bloco(s) conferidos contra o printec.`);
