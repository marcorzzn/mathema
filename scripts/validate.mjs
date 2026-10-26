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

/**
 * Fase C / Invariante I1: Hash SHA-256 congelato di schema/node.schema.json.
 * Qualsiasi modifica allo schema senza aggiornare il contratto rompe l'Invariante I1.
 */
const FROZEN_NODE_SCHEMA_HASH = "24fe84c90f9a05c985dd0f9353f4cf036439e8e783d36feddddc1cfff5e4f162";

function sha256(text) {
  return crypto.createHash("sha256").update(String(text ?? ""), "utf8").digest("hex");
}

const errors = [];
function err(inv, msg) {
  errors.push(`[${inv}] ${msg}`);
}

// 0. Verifica congelamento di schema/node.schema.json (Fase C / Invariante I1)
const nodeSchemaPath = path.join(SCHEMA_DIR, "node.schema.json");
let nodeSchema = null;
if (!fs.existsSync(nodeSchemaPath)) {
  err("I1", "schema/node.schema.json mancante (contratto Fase C violato).");
} else {
  const rawSchema = fs.readFileSync(nodeSchemaPath, "utf8");
  const actualSchemaHash = sha256(rawSchema);
  if (actualSchemaHash !== FROZEN_NODE_SCHEMA_HASH) {
    err(
      "I1",
      `Contratto congelato Fase C violato: schema/node.schema.json è stato modificato (hash atteso ${FROZEN_NODE_SCHEMA_HASH.slice(0, 12)}…, trovato ${actualSchemaHash.slice(0, 12)}…).`
    );
  }
  try {
    nodeSchema = JSON.parse(rawSchema);
    const reqRoot = new Set(nodeSchema.required || []);
    for (const mandatory of [
      "id",
      "msc",
      "kind",
      "title",
      "natural",
      "symbolic",
      "lean",
      "missing",
      "deps",
      "children",
      "steps",
      "attachments",
      "sources",
      "formalization_yaml",
      "license",
      "provenance",
      "reviewed_by"
    ]) {
      if (!reqRoot.has(mandatory)) {
        err("I1", `schema/node.schema.json non richiede più il campo obbligatorio '${mandatory}'.`);
      }
    }
    const reqLean = new Set(nodeSchema.$defs?.leanBlock?.required || []);
    for (const mLean of ["code", "hash", "status", "mathlib_version", "mathlib_name", "verified_at"]) {
      if (!reqLean.has(mLean)) {
        err("I1", `schema/node.schema.json ($defs.leanBlock) non richiede più '${mLean}'.`);
      }
    }
  } catch (e) {
    err("I1", `schema/node.schema.json non è un JSON valido: ${e.message}`);
  }
}

const REQUIRED_ROOT_FIELDS = nodeSchema?.required || [
  "id",
  "msc",
  "kind",
  "title",
  "natural",
  "symbolic",
  "lean",
  "missing",
  "deps",
  "children",
  "steps",
  "attachments",
  "sources",
  "formalization_yaml",
  "license",
  "provenance",
  "reviewed_by"
];
const ALLOWED_ROOT_KEYS = new Set(Object.keys(nodeSchema?.properties || {}));
const ALLOWED_KINDS = new Set(nodeSchema?.properties?.kind?.enum || []);
const ALLOWED_LICENSES = new Set(nodeSchema?.properties?.license?.enum || []);
const ALLOWED_PROVENANCE = new Set(nodeSchema?.properties?.provenance?.enum || []);
const ALLOWED_STEP_KINDS = new Set(nodeSchema?.$defs?.stepNode?.properties?.kind?.enum || []);
const ALLOWED_DEP_TYPES = new Set(nodeSchema?.$defs?.dependency?.properties?.type?.enum || []);

// Carica registro Mathlib (Invariante I8)
const mathlibRegistry = JSON.parse(
  fs.readFileSync(path.join(SCHEMA_DIR, "mathlib-registry.json"), "utf8")
);
const validMathlibNames = new Set(mathlibRegistry.identifiers);

// Carica MSC2020 (Invariante I3)
const msc2020 = JSON.parse(
  fs.readFileSync(path.join(CONTENT_DIR, "msc2020.json"), "utf8")
);
const validMsc2 = new Set((msc2020.disciplines || []).map((d) => d.code));
const validMsc3 = new Set((msc2020.sections || []).map((s) => s.code));
const validMsc5 = new Set((msc2020.entries || []).map((e) => e.code));

if (validMsc2.size !== 63) {
  err("I3", `content/msc2020.json deve contenere esattamente 63 discipline di primo livello (trovate ${validMsc2.size}).`);
}

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
  if (!lean.mathlib_version || typeof lean.mathlib_version !== "string") {
    err("Fase-C", `${idCtx}: lean.mathlib_version obbligatorio.`);
  }
  if (!("verified_at" in lean)) {
    err("Fase-C", `${idCtx}: campo lean.verified_at obbligatorio (stringa ISO o null).`);
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

  // Invariante I1: 'compiled' richiede assenza di sorry E (.olean locale presente OPPURE certificazione CI valida con verified_at + hash + file_hash)
  if (/\b(sorry|admit)\b/.test(code) && (lean.status === "compiled" || lean.status === "unverified")) {
    err("I1", `${idCtx}: contiene 'sorry' ma dichiara status='${lean.status}'.`);
  }
  if (lean.status === "compiled") {
    const rel = String(lean.lean_file || "");
    const oleanRel = rel.startsWith("lean/")
      ? rel.slice("lean/".length).replace(/\.lean$/, ".olean")
      : "";
    const lakeLibDir = path.join(ROOT, "lean", ".lake", "build", "lib");
    const oleanPath = oleanRel ? path.join(lakeLibDir, oleanRel) : "";
    const hasLocalOlean =
      Boolean(oleanPath) && fs.existsSync(oleanPath) && fs.statSync(oleanPath).size > 0;
    const hasValidCiStamp =
      typeof lean.verified_at === "string" &&
      /^\d{4}-\d{2}-\d{2}T/.test(lean.verified_at) &&
      Boolean(lean.file_hash) &&
      Boolean(lean.lean_file) &&
      fs.existsSync(path.join(ROOT, lean.lean_file)) &&
      !/\b(sorry|admit)\b/.test(fs.readFileSync(path.join(ROOT, lean.lean_file), "utf8"));

    if (fs.existsSync(lakeLibDir)) {
      if (!hasLocalOlean) {
        err(
          "I1",
          `${idCtx}: dichiara 'compiled' senza il binario '${oleanPath}'. Deve essere 'unverified' finché lake build non riesce.`
        );
      }
    } else if (!hasLocalOlean && !hasValidCiStamp) {
      err(
        "I1",
        `${idCtx}: dichiara 'compiled' senza il binario '${oleanPath}' e senza certificazione CI valida (verified_at + file_hash). Deve essere 'unverified' finché lake build non riesce.`
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
  if (!ALLOWED_STEP_KINDS.has(step.kind)) {
    err("Fase-C", `Passo ${step.id}: kind '${step.kind}' non conforme a schema/node.schema.json.`);
  }
  if (!Array.isArray(step.deps)) {
    err("Fase-C", `Passo ${step.id}: campo 'deps' (array) obbligatorio.`);
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
    if (!d.id || !ALLOWED_DEP_TYPES.has(d.type)) {
      err("Fase-C", `Passo ${step.id}: dipendenza malformata (${JSON.stringify(d)}).`);
    }
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

    // Controllo campi obbligatori e proprietà non ammesse secondo schema/node.schema.json
    for (const reqField of REQUIRED_ROOT_FIELDS) {
      if (!(reqField in node) || node[reqField] === undefined || node[reqField] === null) {
        if (reqField === "missing") {
          err("I2", `Nodo ${node.id || file}: campo 'missing' (array) obbligatorio per dichiarare eventuali parti mancanti.`);
        } else {
          err("Fase-C", `Nodo ${node.id || file}: campo obbligatorio '${reqField}' mancante (schema/node.schema.json).`);
        }
      }
    }
    for (const key of Object.keys(node)) {
      if (ALLOWED_ROOT_KEYS.size > 0 && !ALLOWED_ROOT_KEYS.has(key)) {
        err("Fase-C", `Nodo ${node.id || file}: proprietà non ammessa '${key}' (additionalProperties: false in schema/node.schema.json).`);
      }
    }

    // Corrispondenza esatta con MSC2020 (2, 3 e 5 caratteri) e nome file
    const msc2 = String(node.msc || "").slice(0, 2);
    const msc3 = String(node.msc || "").slice(0, 3);
    if (!validMsc5.has(node.msc) || !validMsc3.has(msc3) || !validMsc2.has(msc2)) {
      err("I3", `Nodo ${node.id}: msc '${node.msc}' non ha corrispondenza gerarchica completa (2/3/5 caratteri) in content/msc2020.json.`);
    }
    if (node.msc !== mscFolder) {
      err("I3", `Nodo ${node.id}: campo msc '${node.msc}' != cartella '${mscFolder}'.`);
    }
    if (!/^[0-9]{2}[A-Z][0-9]{2}\.[0-9A-Za-z.]+$/.test(node.id) || !node.id.startsWith(node.msc + ".")) {
      err("I3", `Nodo ${node.id}: formato ID non conforme a <MSC5>.<suffisso_mathema>.`);
    }
    if (file !== `${node.id}.json`) {
      err("I3", `Nodo ${node.id}: il nome del file '${file}' deve coincidere con '${node.id}.json'.`);
    }
    allEntityIds.add(node.id);

    // Validazione kind, license, provenance, sources, children, steps
    if (!ALLOWED_KINDS.has(node.kind)) {
      err("Fase-C", `Nodo ${node.id}: kind '${node.kind}' non valido.`);
    }
    if (!ALLOWED_LICENSES.has(node.license)) {
      err("Fase-C", `Nodo ${node.id}: license '${node.license}' non valida.`);
    }
    if (!ALLOWED_PROVENANCE.has(node.provenance)) {
      err("Fase-C", `Nodo ${node.id}: provenance '${node.provenance}' non valida.`);
    }
    if (!Array.isArray(node.sources) || node.sources.length < 1) {
      err("Fase-C", `Nodo ${node.id}: 'sources' deve contenere almeno una fonte bibliografica o formale.`);
    } else {
      for (const s of node.sources) {
        if (!s.title || !s.citation || !s.license_note) {
          err("Fase-C", `Nodo ${node.id}: ogni elemento di 'sources' richiede 'title', 'citation' e 'license_note'.`);
        }
      }
    }
    if (!Array.isArray(node.children) || !Array.isArray(node.steps) || !Array.isArray(node.deps)) {
      err("Fase-C", `Nodo ${node.id}: 'children', 'steps' e 'deps' devono essere array.`);
    }

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
    const fy = node.formalization_yaml;
    const cs = fy?.comparator_setup;
    if (
      !fy ||
      !fy.project ||
      fy.msc !== node.msc ||
      !fy.target_theorem ||
      !cs ||
      !cs.lean_toolchain ||
      !cs.mathlib_rev ||
      !Array.isArray(cs.permitted_axioms) ||
      cs.permitted_axioms.length === 0 ||
      !Array.isArray(node.reviewed_by) ||
      node.reviewed_by.length === 0
    ) {
      err(
        "Fase-C",
        `Nodo ${node.id}: 'formalization_yaml' (project, msc, target_theorem, comparator_setup) o 'reviewed_by' mancante/incompleto.`
      );
    }

    for (const d of node.deps || []) {
      if (!d.id || !ALLOWED_DEP_TYPES.has(d.type)) {
        err("Fase-C", `Nodo ${node.id}: dipendenza malformata (${JSON.stringify(d)}).`);
      }
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
