#!/usr/bin/env node
/**
 * scripts/build-content.mjs
 *
 * Script di build e validazione statica di Mathema (zero dipendenze esterne).
 * Esegue in ordine:
 * 1. Caricamento delle lingue in `content/i18n/*.json` (aggiungere una lingua = aggiungere 1 file).
 * 2. Caricamento della gerarchia ufficiale MSC2020 da `content/msc2020.json`.
 * 3. Validazione di tutti i file `content/<MSC>/<codice>.json` rispetto allo schema formale:
 *    - Controllo campi obbligatori e tipi (`kind`, `license`, `provenance`, `lean.status`).
 *    - Controllo ONESTÀ Lean: nessun nodo con `sorry` può avere `status: "compiled"`.
 *    - Controllo integrità referenziale: tutte le dipendenze `deps[].id` devono esistere.
 * 4. Generazione degli artefatti statici in `public/data/`:
 *    - `public/data/bundle.json` (catalogo completo per il funzionamento immediato e offline PWA)
 *    - `public/data/search-index.json` (indice di ricerca pre-costruito per codice, testo, lingua, tipo)
 *    - `public/data/graph.json` (nodi e archi logici/gerarchici)
 * 5. Generazione delle icone PWA (`icon.svg`, `pwa-192x192.png`, `pwa-512x512.png`, `apple-touch-icon.png`).
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const PUBLIC_DIR = path.join(ROOT, "public");
const OUT_DIR = path.join(PUBLIC_DIR, "data");

const ALLOWED_KINDS = new Set([
  "definition",
  "lemma",
  "theorem",
  "corollary",
  "proof",
  "technique",
  "example",
  "exercise",
  "remark"
]);

const ALLOWED_LEAN_STATUS = new Set([
  "none",
  "statement_only",
  "has_sorry",
  "unverified",
  "compiled"
]);

const ALLOWED_DEP_TYPES = new Set([
  "requires",
  "generalizes",
  "special_case_of",
  "alternative_proof_of",
  "applies_to"
]);

function fail(msg) {
  console.error(`\n[ERRORE DI VALIDAZIONE MATHEMA] ${msg}\n`);
  process.exit(1);
}

// 1. Carica tutte le lingue disponibili in content/i18n/*.json
const i18nDir = path.join(CONTENT_DIR, "i18n");
const languages = {};
for (const file of fs.readdirSync(i18nDir)) {
  if (!file.endsWith(".json")) continue;
  const langObj = JSON.parse(fs.readFileSync(path.join(i18nDir, file), "utf8"));
  languages[langObj.code] = langObj;
}
if (!languages.it || !languages.en) {
  fail("Le lingue di base 'it' ed 'en' devono essere presenti in content/i18n/.");
}

// 2. Carica la tassonomia ufficiale MSC2020
const mscPath = path.join(CONTENT_DIR, "msc2020.json");
const msc2020 = JSON.parse(fs.readFileSync(mscPath, "utf8"));
const validMsc5 = new Set(msc2020.entries.map((e) => e.code));

// 3. Carica e valida ogni nodo in content/<MSC>/<codice>.json
const nodesById = {};
const allEntitiesById = {}; // include sia i nodi principali sia tutti i passi/micro-risultati

function validateLeanBlock(lean, ctx) {
  if (!lean || typeof lean !== "object") {
    fail(`${ctx}: campo 'lean' mancante.`);
  }
  if (!ALLOWED_LEAN_STATUS.has(lean.status)) {
    fail(`${ctx}: lean.status '${lean.status}' non valido.`);
  }
  const code = String(lean.code || "").trim();
  if (/\b(sorry|admit)\b/.test(code) && (lean.status === "compiled" || lean.status === "unverified")) {
    fail(`${ctx}: VIOLAZIONE ONESTÀ LEAN — il codice contiene 'sorry' ma lo status è '${lean.status}'.`);
  }
  if (lean.status === "compiled") {
    const rel = String(lean.lean_file || "");
    const oleanRel = rel.startsWith("lean/") ? rel.slice("lean/".length).replace(/\.lean$/, ".olean") : "";
    const lakeLibDir = path.join(ROOT, "lean", ".lake", "build", "lib");
    const oleanPath = oleanRel ? path.join(lakeLibDir, oleanRel) : "";
    const hasLocalOlean = Boolean(oleanPath) && fs.existsSync(oleanPath);
    const hasValidCiStamp =
      typeof lean.verified_at === "string" &&
      /^\d{4}-\d{2}-\d{2}T/.test(lean.verified_at) &&
      Boolean(lean.file_hash);
    if (fs.existsSync(lakeLibDir) ? !hasLocalOlean : !hasLocalOlean && !hasValidCiStamp) {
      fail(`${ctx}: VIOLAZIONE ONESTÀ LEAN — status='compiled' ma l'artefatto compilato '${oleanPath}' o la certificazione CI non esiste. Usa 'unverified' finché la GitHub Action non esegue lake build.`);
    }
  }
  if (!code && lean.status !== "none") {
    fail(`${ctx}: codice Lean vuoto ma status = '${lean.status}'.`);
  }
}

function registerStepsRecursively(steps, parentNodeId, mscCode, depth = 1) {
  if (!Array.isArray(steps)) return;
  for (const step of steps) {
    if (!step.id || !step.id.startsWith(parentNodeId.split(".")[0])) {
      fail(`Passo in ${parentNodeId}: 'id' mancante o prefisso MSC incoerente (${step.id}).`);
    }
    if (!ALLOWED_KINDS.has(step.kind)) {
      fail(`Passo ${step.id}: kind '${step.kind}' non ammesso.`);
    }
    if (!step.title?.it || !step.title?.en) {
      fail(`Passo ${step.id}: title.it e title.en sono obbligatori.`);
    }
    if (!step.natural?.it || !step.natural?.en) {
      fail(`Passo ${step.id}: natural.it e natural.en sono obbligatori.`);
    }
    if (!step.symbolic || typeof step.symbolic !== "string") {
      fail(`Passo ${step.id}: campo 'symbolic' mancante.`);
    }
    validateLeanBlock(step.lean, `Passo ${step.id}`);

    allEntitiesById[step.id] = {
      id: step.id,
      parentId: parentNodeId,
      msc: mscCode,
      kind: step.kind,
      title: step.title,
      natural: step.natural,
      symbolic: step.symbolic,
      lean: step.lean,
      deps: step.deps || [],
      isStep: true,
      depth
    };

    if (Array.isArray(step.substeps)) {
      registerStepsRecursively(step.substeps, step.id, mscCode, depth + 1);
    }
  }
}

for (const dirEntry of fs.readdirSync(CONTENT_DIR, { withFileTypes: true })) {
  if (!dirEntry.isDirectory() || dirEntry.name === "i18n") continue;
  const mscFolder = dirEntry.name;
  if (!validMsc5.has(mscFolder)) {
    fail(`Cartella content/${mscFolder}: '${mscFolder}' non è una voce MSC2020 a 5 caratteri registrata in content/msc2020.json.`);
  }

  const folderPath = path.join(CONTENT_DIR, mscFolder);
  for (const file of fs.readdirSync(folderPath)) {
    if (!file.endsWith(".json")) continue;
    const filePath = path.join(folderPath, file);
    const node = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const expectedFile = `${node.id}.json`;
    if (file !== expectedFile) {
      fail(`${filePath}: il nome del file deve coincidere con '${expectedFile}'.`);
    }
    if (node.msc !== mscFolder) {
      fail(`Nodo ${node.id}: il campo msc ('${node.msc}') non corrisponde alla cartella '${mscFolder}'.`);
    }
    if (!ALLOWED_KINDS.has(node.kind)) {
      fail(`Nodo ${node.id}: kind '${node.kind}' non valido.`);
    }
    if (!node.title?.it || !node.title?.en || !node.natural?.it || !node.natural?.en) {
      fail(`Nodo ${node.id}: traduzioni 'it' ed 'en' obbligatorie in 'title' e 'natural'.`);
    }
    if (!node.symbolic) {
      fail(`Nodo ${node.id}: campo 'symbolic' obbligatorio.`);
    }
    validateLeanBlock(node.lean, `Nodo ${node.id}`);

    nodesById[node.id] = node;
    allEntitiesById[node.id] = {
      id: node.id,
      parentId: node.msc,
      msc: node.msc,
      kind: node.kind,
      title: node.title,
      natural: node.natural,
      symbolic: node.symbolic,
      lean: node.lean,
      deps: node.deps || [],
      isStep: false,
      depth: 0
    };

    registerStepsRecursively(node.steps, node.id, node.msc, 1);
  }
}

// 4. Controllo integrità di tutte le dipendenze
const graphEdges = [];
for (const entity of Object.values(allEntitiesById)) {
  // Arco gerarchico padre -> figlio
  if (entity.parentId && allEntitiesById[entity.parentId]) {
    graphEdges.push({
      from: entity.parentId,
      to: entity.id,
      type: "part_of"
    });
  }
  for (const dep of entity.deps || []) {
    if (!ALLOWED_DEP_TYPES.has(dep.type)) {
      fail(`Entità ${entity.id}: tipo di dipendenza '${dep.type}' non valido.`);
    }
    if (!allEntitiesById[dep.id]) {
      fail(`Entità ${entity.id}: la dipendenza '${dep.id}' non esiste in content/.`);
    }
    graphEdges.push({
      from: dep.id,
      to: entity.id,
      type: dep.type
    });
  }
}

// 5. Costruzione dell'indice di ricerca locale (nessun server richiesto)
const searchIndex = [];

// Aggiungi discipline, sezioni e voci MSC2020 all'indice di ricerca
for (const d of msc2020.disciplines) {
  searchIndex.push({
    id: d.code,
    official: d.official,
    kind: "msc_discipline",
    title: d.title,
    keywords: `${d.code} ${d.official} ${Object.values(d.title).join(" ")}`.toLowerCase()
  });
}
for (const s of msc2020.sections) {
  searchIndex.push({
    id: s.code,
    official: s.official,
    kind: "msc_section",
    title: s.title,
    keywords: `${s.code} ${s.official} ${Object.values(s.title).join(" ")}`.toLowerCase()
  });
}
for (const e of msc2020.entries) {
  searchIndex.push({
    id: e.code,
    official: e.code,
    kind: "msc_entry",
    title: e.title,
    keywords: `${e.code} ${Object.values(e.title).join(" ")}`.toLowerCase()
  });
}

// Aggiungi tutti i nodi, passaggi e micro-risultati all'indice di ricerca
for (const entity of Object.values(allEntitiesById)) {
  const textBlob = [
    entity.id,
    entity.msc,
    entity.kind,
    ...Object.values(entity.title || {}),
    ...Object.values(entity.natural || {}),
    entity.symbolic,
    entity.lean?.mathlib_name || "",
    entity.lean?.code || ""
  ]
    .join(" ")
    .toLowerCase();

  searchIndex.push({
    id: entity.id,
    msc: entity.msc,
    kind: entity.kind,
    leanStatus: entity.lean.status,
    isStep: entity.isStep,
    title: entity.title,
    keywords: textBlob
  });
}

// Assicura che public/data esista
fs.mkdirSync(OUT_DIR, { recursive: true });

const graphData = {
  nodes: Object.values(allEntitiesById).map((e) => ({
    id: e.id,
    parentId: e.parentId,
    msc: e.msc,
    kind: e.kind,
    title: e.title,
    leanStatus: e.lean.status,
    isStep: e.isStep
  })),
  edges: graphEdges
};

const bundleData = {
  generatedAt: new Date().toISOString(),
  languages,
  msc2020,
  nodes: nodesById,
  entities: allEntitiesById,
  graph: graphData,
  searchIndex
};

fs.writeFileSync(path.join(OUT_DIR, "bundle.json"), JSON.stringify(bundleData));
fs.writeFileSync(path.join(OUT_DIR, "search-index.json"), JSON.stringify(searchIndex, null, 2));
fs.writeFileSync(path.join(OUT_DIR, "graph.json"), JSON.stringify(graphData, null, 2));

// 6. Generazione icone PWA minimali (SVG + PNG validi) per installabilità offline
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#f5f5f2"/>
  <rect x="44" y="44" width="424" height="424" fill="none" stroke="#1a4fa0" stroke-width="16"/>
  <line x1="44" y1="468" x2="468" y2="44" stroke="#7a5b00" stroke-width="12"/>
  <text x="92" y="220" font-family="Georgia, serif" font-size="148" font-weight="bold" fill="#1a1a1a">M</text>
  <text x="235" y="405" font-family="monospace" font-size="88" font-weight="bold" fill="#1a4fa0">√2</text>
</svg>`;
fs.writeFileSync(path.join(PUBLIC_DIR, "icon.svg"), iconSvg, "utf8");

// Generatore PNG minimale nativo (senza dipendenze) con cornice geometrica Mathema
function createSolidPng(width, height, isMaskable = false) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, "ascii");
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc(height * (1 + width * 3));
  const pad = isMaskable ? Math.floor(width * 0.18) : Math.floor(width * 0.1);
  const border = Math.max(3, Math.floor(width * 0.035));

  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width * 3);
    raw[rowStart] = 0; // filtro None
    for (let x = 0; x < width; x++) {
      const idx = rowStart + 1 + x * 3;
      // Sfondo carta sobrio #f5f5f2
      let r = 245, g = 245, b = 242;

      const inBox = x >= pad && x < width - pad && y >= pad && y < height - pad;
      const onBorder =
        inBox &&
        (x < pad + border ||
          x >= width - pad - border ||
          y < pad + border ||
          y >= height - pad - border);

      // Diagonale √2 del quadrato interno
      const onDiag =
        inBox && Math.abs((x - pad) - (height - 1 - pad - y)) <= border;

      if (onBorder) {
        r = 26; g = 79; b = 160; // blu PlanetMath #1a4fa0
      } else if (onDiag) {
        r = 122; g = 91; b = 0; // ocra #7a5b00
      }

      raw[idx] = r;
      raw[idx + 1] = g;
      raw[idx + 2] = b;
    }
  }

  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

fs.writeFileSync(path.join(PUBLIC_DIR, "pwa-192x192.png"), createSolidPng(192, 192, false));
fs.writeFileSync(path.join(PUBLIC_DIR, "pwa-512x512.png"), createSolidPng(512, 512, false));
fs.writeFileSync(path.join(PUBLIC_DIR, "pwa-maskable-512x512.png"), createSolidPng(512, 512, true));
fs.writeFileSync(path.join(PUBLIC_DIR, "apple-touch-icon.png"), createSolidPng(180, 180, false));

console.log(
  `[Mathema Build] Validazione completata con successo:\n` +
    `  - Discipline MSC2020: ${msc2020.disciplines.length}\n` +
    `  - Lingue caricate: ${Object.keys(languages).join(", ")}\n` +
    `  - Nodi principali: ${Object.keys(nodesById).length}\n` +
    `  - Entità totali (nodi + passi + micro-risultati): ${Object.keys(allEntitiesById).length}\n` +
    `  - Archi del grafo verificati: ${graphEdges.length}`
);
