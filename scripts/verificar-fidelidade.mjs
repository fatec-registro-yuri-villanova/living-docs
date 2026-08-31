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
