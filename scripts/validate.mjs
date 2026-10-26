#!/usr/bin/env node
/**
 * scripts/validate.mjs
 *
 * Validatore binario di sola lettura degli Invarianti I1–I9 e dei Contratti di Fase A–C–F di `mathema`.
 * NON modifica mai i file: se un invariante è violato, restituisce exit code 1 con l'elenco esatto delle violazioni.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const SCHEMA_DIR = path.join(ROOT, "schema");
const SRC_DIR = path.join(ROOT, "src");
const DIST_DIR = path.join(ROOT, "dist");

const EXPECTED_TEN_LANGS = ["it", "en", "es", "fr", "de", "pt", "ar", "zh", "hi", "ru"];

function sha256(text) {
  return crypto.createHash("sha256").update(String(text ?? ""), "utf8").digest("hex");
}

const errors = [];
function err(inv, msg) {
  errors.push(`[${inv}] ${msg}`);
}

// Carica registro Mathlib (Invariante I8)
const mathlibRegistry = JSON.parse(
  fs.readFileSync(path.join(SCHEMA_DIR, "mathlib-registry.json"), "utf8")
);
const validMathlibNames = new Set(mathlibRegistry.identifiers);

// Carica MSC2020 (Invariante I3)
const msc2020 = JSON.parse(
  fs.readFileSync(path.join(CONTENT_DIR, "msc2020.json"), "utf8")
);
const validMsc5 = new Set(msc2020.entries.map((e) => e.code));

// Carica lingue in content/i18n (Invariante I4)
const i18nDir = path.join(CONTENT_DIR, "i18n");
const langCodes = [];
const langPacks = {};
for (const f of fs.readdirSync(i18nDir)) {
  if (!f.endsWith(".json")) continue;
  const obj = JSON.parse(fs.readFileSync(path.join(i18nDir, f), "utf8"));
  if (!obj.code || !obj.label || !obj.dir || !obj.ui || !obj.ui.root || !obj.ui.home_intro) {
    err("I4", `File lingua ${f} incompleto.`);
  }
  langCodes.push(obj.code);
  langPacks[obj.code] = obj;
}

for (const reqLang of EXPECTED_TEN_LANGS) {
  if (!langCodes.includes(reqLang)) {
    err("I4", `Lingua richiesta '${reqLang}' mancante in content/i18n/${reqLang}.json.`);
  }
}

// Verifica che le lingue non-inglesi non siano copie in inglese
if (langPacks.en) {
  for (const [code, pack] of Object.entries(langPacks)) {
    if (code === "en") continue;
    if (pack.ui?.root === langPacks.en.ui?.root || pack.ui?.home_intro === langPacks.en.ui?.home_intro) {
      err("I4", `Lingua '${code}' contiene stringhe non tradotte copiate dall'inglese.`);
    }
  }
}

function checkLeanBlock(lean, idCtx) {
  if (!lean || typeof lean !== "object") {
    err("I2", `${idCtx}: blocco 'lean' mancante.`);
    return;
  }
  const allowed = ["none", "statement_only", "has_sorry", "unverified", "compiled"];
  if (!allowed.includes(lean.status)) {
    err("I1", `${idCtx}: lean.status '${lean.status}' non valido.`);
  }
  const code = String(lean.code || "").trim();

  // Fase C / Invariante I1: Verifica hash SHA-256 del blocco Lean
  const expectedHash = sha256(code);
  if (!lean.hash || lean.hash !== expectedHash) {
    err(
      "I1",
      `${idCtx}: lean.hash mancante o disallineato dal codice Lean attuale (atteso ${expectedHash.slice(0, 12)}…, trovato ${String(lean.hash).slice(0, 12)}…).`
    );
  }

  if (lean.lean_file) {
    const srcPath = path.join(ROOT, lean.lean_file);
    if (!fs.existsSync(srcPath)) {
      err("I1", `${idCtx}: file sorgente Lean '${lean.lean_file}' non esiste.`);
    } else {
      const expectedFileHash = sha256(fs.readFileSync(srcPath, "utf8"));
      if (lean.file_hash && lean.file_hash !== expectedFileHash) {
        err(
          "I1",
          `${idCtx}: lean.file_hash non corrisponde al contenuto attuale di '${lean.lean_file}'.`
        );
      }
    }
  }

  // Invariante I1: 'compiled' richiede assenza di sorry E presenza del binario .olean reale (size > 0)
  if (/\b(sorry|admit)\b/.test(code) && (lean.status === "compiled" || lean.status === "unverified")) {
    err("I1", `${idCtx}: contiene 'sorry' ma dichiara status='${lean.status}'.`);
  }
  if (lean.status === "compiled") {
    const rel = String(lean.lean_file || "");
    const oleanRel = rel.startsWith("lean/")
      ? rel.slice("lean/".length).replace(/\.lean$/, ".olean")
      : "";
    const oleanPath = oleanRel
      ? path.join(ROOT, "lean", ".lake", "build", "lib", oleanRel)
      : "";
    if (!oleanPath || !fs.existsSync(oleanPath) || fs.statSync(oleanPath).size <= 0) {
      err(
        "I1",
        `${idCtx}: dichiara 'compiled' senza il binario '${oleanPath}'. Deve essere 'unverified' finché lake build non riesce.`
      );
    }
  }

  // Invariante I8: mathlib_name deve esistere nel registro o essere 'none'
  if (!lean.mathlib_name || !validMathlibNames.has(lean.mathlib_name)) {
    err(
      "I8",
      `${idCtx}: mathlib_name '${lean.mathlib_name}' non trovato in schema/mathlib-registry.json (usa 'none' se è un lemma locale).`
    );
  }
}

function checkMissingDeclaration(entity, idCtx) {
  if (!Array.isArray(entity.missing)) {
    err("I2", `${idCtx}: campo 'missing' (array) obbligatorio per dichiarare eventuali parti mancanti.`);
    return;
  }
  const missingSet = new Set(entity.missing);
  for (const l of EXPECTED_TEN_LANGS) {
    if (!entity.title?.[l] || !entity.natural?.[l]) {
      if (!missingSet.has(`lang:${l}`)) {
        err("I2", `${idCtx}: traduzione '${l}' assente ma non dichiarata in missing ('lang:${l}').`);
      }
    }
  }
}

const allEntityIds = new Set();
const allDepsToVerify = [];
let nodeCount = 0;

function checkStep(step, parentId) {
  if (!step.id || !step.id.startsWith(parentId + ".")) {
    err("I3", `Passo '${step.id}' sotto '${parentId}' deve estendere il codice genitore con suffisso puntato.`);
  }
  allEntityIds.add(step.id);

  // Invariante I2: 3 rappresentazioni + missing[] esplicito
  if (!step.title?.it || !step.title?.en || !step.natural?.it || !step.natural?.en) {
    err("I2", `Passo ${step.id}: traduzioni base (it, en) mancanti in title o natural.`);
  }
  if (!step.symbolic || typeof step.symbolic !== "string") {
    err("I2", `Passo ${step.id}: rappresentazione simbolica mancante.`);
  }
  checkMissingDeclaration(step, `Passo ${step.id}`);
  checkLeanBlock(step.lean, `Passo ${step.id}`);

  for (const d of step.deps || []) {
    allDepsToVerify.push({ from: step.id, to: d.id });
  }
  for (const sub of step.substeps || []) {
    checkStep(sub, step.id);
  }
}

for (const dirEntry of fs.readdirSync(CONTENT_DIR, { withFileTypes: true })) {
  if (!dirEntry.isDirectory() || dirEntry.name === "i18n") continue;
  const mscFolder = dirEntry.name;
  if (!validMsc5.has(mscFolder)) {
    err("I3", `Cartella content/${mscFolder} non corrisponde a una voce MSC2020 a 5 caratteri.`);
  }
  const folderPath = path.join(CONTENT_DIR, mscFolder);
  for (const file of fs.readdirSync(folderPath)) {
    if (!file.endsWith(".json")) continue;
    nodeCount++;
    const node = JSON.parse(fs.readFileSync(path.join(folderPath, file), "utf8"));

    if (!validMsc5.has(node.msc)) {
      err("I3", `Nodo ${node.id}: msc '${node.msc}' non è una voce MSC2020 a 5 caratteri valida.`);
    }
    if (node.msc !== mscFolder) {
      err("I3", `Nodo ${node.id}: campo msc '${node.msc}' != cartella '${mscFolder}'.`);
    }
    if (!/^[0-9]{2}[A-Z][0-9]{2}\.[0-9A-Za-z.]+$/.test(node.id) || !node.id.startsWith(node.msc + ".")) {
      err("I3", `Nodo ${node.id}: formato ID non conforme a <MSC5>.<suffisso_mathema>.`);
    }
    allEntityIds.add(node.id);

    // Invariante I2: 3 rappresentazioni + missing[] esplicito
    if (!node.title?.it || !node.title?.en || !node.natural?.it || !node.natural?.en) {
      err("I2", `Nodo ${node.id}: rappresentazione naturale (it/en) mancante.`);
    }
    if (!node.symbolic) {
      err("I2", `Nodo ${node.id}: rappresentazione simbolica mancante.`);
    }
    checkMissingDeclaration(node, `Nodo ${node.id}`);
    checkLeanBlock(node.lean, `Nodo ${node.id}`);

    // Invariante I5 / Fase B: ogni nodo principale ha >= 1 allegato
    if (!Array.isArray(node.attachments) || node.attachments.length < 1) {
      err("I5", `Nodo ${node.id}: deve avere almeno 1 allegato grafico in 'attachments'.`);
    }

    // Fase C / G: formalization_yaml + comparator_setup + provenance + reviewed_by
    if (
      !node.formalization_yaml ||
      !node.formalization_yaml.comparator_setup ||
      !Array.isArray(node.reviewed_by) ||
      node.reviewed_by.length === 0
    ) {
      err("Fase-C", `Nodo ${node.id}: 'formalization_yaml.comparator_setup' o 'reviewed_by' mancante.`);
    }

    for (const d of node.deps || []) {
      allDepsToVerify.push({ from: node.id, to: d.id });
    }
    for (const s of node.steps || []) {
      checkStep(s, node.id);
    }
  }
}

// Verifica integrità referenziale delle dipendenze (Invariante I5)
for (const dep of allDepsToVerify) {
  if (!allEntityIds.has(dep.to)) {
    err("I5", `L'entità ${dep.from} dipende da '${dep.to}', che non esiste.`);
  }
}

// Invariante I6: nessun import statico di viewer3d o ai-bridge in src/main.ts + controllo bundle < 50 KB gzip
const mainTs = fs.readFileSync(path.join(SRC_DIR, "main.ts"), "utf8");
if (/^\s*import\s+.*from\s+["']\.\/(viewer3d|ai-bridge)["']/m.test(mainTs)) {
  err("I6", "src/main.ts importa staticamente viewer3d o ai-bridge. Usa solo import() dinamico.");
}

if (fs.existsSync(path.join(DIST_DIR, "assets"))) {
  const assetFiles = fs.readdirSync(path.join(DIST_DIR, "assets"));
  let mainGzipBytes = 0;
  for (const af of assetFiles) {
    if (af.startsWith("index-") && (af.endsWith(".js") || af.endsWith(".css"))) {
      const raw = fs.readFileSync(path.join(DIST_DIR, "assets", af));
      mainGzipBytes += zlib.gzipSync(raw).length;
    }
  }
  if (mainGzipBytes > 50 * 1024) {
    err("I6", `Bundle iniziale troppo pesante: ${(mainGzipBytes / 1024).toFixed(2)} KB gzip (limite 50 KB).`);
  }
}

// Invariante I7: nessun tracker, analytics, cookie o storage persistente nel codice client
for (const sf of fs.readdirSync(SRC_DIR)) {
  if (!sf.endsWith(".ts")) continue;
  const content = fs.readFileSync(path.join(SRC_DIR, sf), "utf8");
  if (/\b(localStorage|sessionStorage|document\.cookie|GoogleAnalytics|gtag|fbq)\b/.test(content)) {
    err("I7", `src/${sf} contiene API di tracciamento o storage locale vietate dall'Invariante I7.`);
  }
}

// Invariante I9: controllo icone PWA e configurazione base relativa
for (const icon of ["icon.svg", "pwa-192x192.png", "pwa-512x512.png", "apple-touch-icon.png"]) {
  if (!fs.existsSync(path.join(ROOT, "public", icon))) {
    err("I9", `Icona PWA public/${icon} mancante.`);
  }
}

if (errors.length > 0) {
  console.error("\n❌ VALIDAZIONE INVARIANTI FALLITA:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

console.log(
  `✅ [mathema validate] Tutti gli Invarianti I1–I9 e i contratti di Fase A–C–F sono soddisfatti (${nodeCount} nodi, ${allEntityIds.size} entità, ${langCodes.length} lingue).`
);
