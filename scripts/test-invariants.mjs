#!/usr/bin/env node
/**
 * scripts/test-invariants.mjs
 *
 * Suite di "Test di rottura deliberata" (Verifica 3 dell'audit) per dimostrare
 * che `npm run validate` fallisce binariamente su ciascun invariante violato
 * senza mai auto-riparare silenziosamente i file.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TARGET_NODE = path.join(ROOT, "content", "11J72", "11J72.1.json");
const TARGET_LANG = path.join(ROOT, "content", "i18n", "zh.json");

function runValidate() {
  return spawnSync("node", ["scripts/validate.mjs"], {
    cwd: ROOT,
    encoding: "utf8"
  });
}

const originalNode = fs.readFileSync(TARGET_NODE, "utf8");
const originalLang = fs.readFileSync(TARGET_LANG, "utf8");

const tests = [
  {
    name: "I1 (falso compiled senza .olean)",
    expectedTag: "[I1]",
    mutate() {
      const obj = JSON.parse(originalNode);
      obj.lean.status = "compiled";
      fs.writeFileSync(TARGET_NODE, JSON.stringify(obj, null, 2));
    }
  },
  {
    name: "I1 / Fase C (codice Lean modificato nel JSON con lean.hash disallineato)",
    expectedTag: "[I1]",
    mutate() {
      const obj = JSON.parse(originalNode);
      obj.lean.code = obj.lean.code + "\n-- modifica non sincronizzata";
      fs.writeFileSync(TARGET_NODE, JSON.stringify(obj, null, 2));
    }
  },
  {
    name: "I2 (rimozione campo obbligatorio missing[])",
    expectedTag: "[I2]",
    mutate() {
      const obj = JSON.parse(originalNode);
      delete obj.missing;
      fs.writeFileSync(TARGET_NODE, JSON.stringify(obj, null, 2));
    }
  },
  {
    name: "I3 (id '11J72' privo del suffisso puntato mathema)",
    expectedTag: "[I3]",
    mutate() {
      const obj = JSON.parse(originalNode);
      obj.id = "11J72";
      fs.writeFileSync(TARGET_NODE, JSON.stringify(obj, null, 2));
    }
  },
  {
    name: "I4 (rimozione di una lingua da content/i18n/)",
    expectedTag: "[I4]",
    mutate() {
      fs.unlinkSync(TARGET_LANG);
    }
  },
  {
    name: "I5 (svuotamento di attachments: [])",
    expectedTag: "[I5]",
    mutate() {
      const obj = JSON.parse(originalNode);
      obj.attachments = [];
      fs.writeFileSync(TARGET_NODE, JSON.stringify(obj, null, 2));
    }
  },
  {
    name: "I8 (mathlib_name deprecato 'Nat.factors_unique')",
    expectedTag: "[I8]",
    mutate() {
      const obj = JSON.parse(originalNode);
      obj.lean.mathlib_name = "Nat.factors_unique";
      fs.writeFileSync(TARGET_NODE, JSON.stringify(obj, null, 2));
    }
  }
];

let failedSuite = false;

try {
  // 0. Verifica stato pulito iniziale
  const cleanRes = runValidate();
  if (cleanRes.status !== 0) {
    console.error("❌ Stato iniziale NON valido prima dei test di rottura:\n" + cleanRes.stderr);
    process.exit(1);
  }
  console.log("✅ 0. Stato iniziale pulito: validate.mjs passa (exit code 0).\n");

  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    // Ripristina stato pulito prima della mutazione
    fs.writeFileSync(TARGET_NODE, originalNode, "utf8");
    fs.writeFileSync(TARGET_LANG, originalLang, "utf8");

    t.mutate();
    const res = runValidate();
    const output = (res.stdout || "") + (res.stderr || "");

    if (res.status !== 0 && output.includes(t.expectedTag)) {
      const firstMatchLine = output
        .split("\n")
        .find((l) => l.includes(t.expectedTag))
        ?.trim();
      console.log(`✅ ${i + 1}. Rottura ${t.name} -> BLOCCATA correttamente (exit=${res.status}):`);
      console.log(`   ${firstMatchLine}`);
    } else {
      console.error(`❌ ${i + 1}. Rottura ${t.name} NON bloccata! exit=${res.status}\n${output}`);
      failedSuite = true;
    }
  }
} finally {
  fs.writeFileSync(TARGET_NODE, originalNode, "utf8");
  fs.writeFileSync(TARGET_LANG, originalLang, "utf8");
}

const finalRes = runValidate();
if (finalRes.status !== 0 || failedSuite) {
  console.error("\n❌ Suite test-invariants fallita.");
  process.exit(1);
}

console.log("\n✅ TUTTI I 7 TEST DI ROTTURA DELIBERATA HANNO FALLITO COME PREVISTO E IL REPO È STATO RIPRISTINATO.");
