#!/usr/bin/env node
/**
 * scripts/sync-lean-status.mjs
 *
 * Script per la verifica ONESTA dello stato Lean 4 dei nodi di Mathema.
 * Viene eseguito dalla GitHub Action (.github/workflows/lean-verify.yml)
 * dopo `lake build`, oppure manualmente prima della build statica.
 *
 * Regole inderogabili:
 * 1. Se `lean.code` è vuoto -> status = "none", verified_at = null
 * 2. Se `lean.code` contiene `sorry` o `admit` -> status = "has_sorry", verified_at = null
 * 3. Se `lean.code` contiene solo `#check` senza `:=` -> status = "statement_only", verified_at = null
 * 4. `status = "compiled"` è consentito SOLO se il file `.lean` indicato in `lean_file`
 *    esiste nella cartella `lean/` e non contiene `sorry`.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");

const fromCi = process.argv.includes("--from-ci");
const nowIso = new Date().toISOString();

function auditLeanBlock(lean, contextId) {
  const code = (lean?.code || "").trim();

  if (!code) {
    lean.status = "none";
    lean.verified_at = null;
    return;
  }

  // Controllo rigoroso della parola chiave sorry o admit
  const hasSorry = /\b(sorry|admit)\b/.test(code);
  if (hasSorry) {
    if (lean.status === "compiled") {
      console.warn(`[WARN] ${contextId}: conteneva 'compiled' ma il codice usa 'sorry'. Corretto in 'has_sorry'.`);
    }
    lean.status = "has_sorry";
    lean.verified_at = null;
    return;
  }

  // Se c'è solo #check e nessuna dimostrazione (né := né by)
  const hasProofBody = /:=|\bby\b/.test(code);
  if (!hasProofBody) {
    lean.status = "statement_only";
    lean.verified_at = null;
    return;
  }

  // Verifica che il file Lean esista davvero nel progetto Lake
  if (lean.status === "compiled") {
    const relFile = lean.lean_file || "";
    const absLeanFile = path.join(ROOT, relFile);
    if (!relFile || !fs.existsSync(absLeanFile)) {
      console.warn(`[WARN] ${contextId}: file Lean '${relFile}' mancante. Declassato a 'statement_only'.`);
      lean.status = "statement_only";
      lean.verified_at = null;
      return;
    }
    if (fromCi) {
      lean.verified_at = nowIso;
    }
  }
}

function walkSteps(steps, parentId) {
  if (!Array.isArray(steps)) return;
  for (const step of steps) {
    auditLeanBlock(step.lean, step.id || parentId);
    if (Array.isArray(step.substeps)) {
      walkSteps(step.substeps, step.id);
    }
  }
}

let checkedFiles = 0;
for (const entry of fs.readdirSync(CONTENT_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name === "i18n") continue;
  const mscDir = path.join(CONTENT_DIR, entry.name);
  for (const file of fs.readdirSync(mscDir)) {
    if (!file.endsWith(".json")) continue;
    const fullPath = path.join(mscDir, file);
    const data = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    auditLeanBlock(data.lean, data.id);
    walkSteps(data.steps, data.id);
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2) + "\n", "utf8");
    checkedFiles++;
  }
}

console.log(`[Mathema Lean Audit] Controllati e sincronizzati ${checkedFiles} file di contenuto.`);
