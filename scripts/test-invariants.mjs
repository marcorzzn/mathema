#!/usr/bin/env node
/**
 * scripts/test-invariants.mjs
 *
 * Suite di:
 * 1) "Test di rottura deliberata" (Verifica degli Invarianti I1–I8 e congelamento schema Fase C)
 *    per dimostrare che `npm run validate` fallisce binariamente su ciascun invariante violato
 *    senza mai auto-riparare silenziosamente i file.
 * 2) "Test di integrazione Fase C": aggiunge un nodo finto in `content/11A41/11A41.9.json`,
 *    verifica che `npm run validate` lo accetti (12 nodi) e che `build-content.mjs` lo integri
 *    nel bundle, nel grafo e nell'indice di ricerca senza toccare il codice TypeScript,
 *    ripristinando infine lo stato pulito a 11 nodi.
 */

import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TARGET_NODE = path.join(ROOT, "content", "11J72", "11J72.1.json");
const TARGET_LANG = path.join(ROOT, "content", "i18n", "zh.json");
const TARGET_SCHEMA = path.join(ROOT, "schema", "node.schema.json");
const FAKE_NODE_PATH = path.join(ROOT, "content", "11A41", "11A41.9.json");

function sha256(text) {
  return crypto.createHash("sha256").update(String(text ?? ""), "utf8").digest("hex");
}

function runValidate() {
  return spawnSync("node", ["scripts/validate.mjs"], {
    cwd: ROOT,
    encoding: "utf8"
  });
}

function runBuildContent() {
  return spawnSync("node", ["scripts/build-content.mjs"], {
    cwd: ROOT,
    encoding: "utf8"
  });
}

const originalNode = fs.readFileSync(TARGET_NODE, "utf8");
const originalLang = fs.readFileSync(TARGET_LANG, "utf8");
const originalSchema = fs.readFileSync(TARGET_SCHEMA, "utf8");

const tests = [
  {
    name: "I1 (falso compiled manuale senza .olean né certificazione CI)",
    expectedTag: "[I1]",
    mutate() {
      const obj = JSON.parse(originalNode);
      obj.lean.status = "compiled";
      obj.lean.verified_at = null;
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
    name: "I1 / Fase C (modifica non autorizzata a schema/node.schema.json congelato)",
    expectedTag: "[I1]",
    mutate() {
      const schemaObj = JSON.parse(originalSchema);
      schemaObj.description = schemaObj.description + " (manomesso)";
      fs.writeFileSync(TARGET_SCHEMA, JSON.stringify(schemaObj, null, 2));
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
    console.error("❌ Stato iniziale NON valido prima dei test:\n" + cleanRes.stderr);
    process.exit(1);
  }
  console.log("✅ 0. Stato iniziale pulito: validate.mjs passa (exit code 0).\n");

  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    // Ripristina stato pulito prima della mutazione
    fs.writeFileSync(TARGET_NODE, originalNode, "utf8");
    fs.writeFileSync(TARGET_LANG, originalLang, "utf8");
    fs.writeFileSync(TARGET_SCHEMA, originalSchema, "utf8");

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

  // Ripristina file mutati prima del test di integrazione Fase C
  fs.writeFileSync(TARGET_NODE, originalNode, "utf8");
  fs.writeFileSync(TARGET_LANG, originalLang, "utf8");
  fs.writeFileSync(TARGET_SCHEMA, originalSchema, "utf8");

  // 9. Test di integrazione Fase C: aggiunta del nodo finto content/11A41/11A41.9.json
  const leanFileRel = "lean/Mathema/NumberTheory/InfinitudePrimes.lean";
  const leanFileHash = sha256(fs.readFileSync(path.join(ROOT, leanFileRel), "utf8"));
  const fakeLeanCode = "theorem prime_ge_two_test {p : ℕ} (hp : p.Prime) : 2 ≤ p := hp.two_le";

  const fakeNode = {
    id: "11A41.9",
    msc: "11A41",
    kind: "lemma",
    title: {
      it: "Ogni numero primo è maggiore o uguale a 2 (Nodo di test Fase C)",
      en: "Every prime number is greater than or equal to 2 (Phase C test node)",
      es: "Todo número primo es mayor o igual que 2",
      ar: "كل عدد أولي أكبر من أو يساوي 2"
    },
    natural: {
      it: "Per definizione di primalità in ℕ, i numeri 0 e 1 non sono primi; pertanto ogni numero primo p soddisfa p ≥ 2.",
      en: "By definition of primality in ℕ, 0 and 1 are not prime; hence every prime number p satisfies p ≥ 2.",
      es: "Por definición de primalidad en ℕ, 0 y 1 no son primos; por tanto todo primo p cumple p ≥ 2.",
      ar: "بحسب تعريف الأولية في ℕ فإن 0 و1 ليسا أوليين، وبالتالي كل عدد أولي p يحقق p ≥ 2."
    },
    symbolic: "∀ p ∈ ℕ, Prime(p) ⇒ p ≥ 2",
    lean: {
      code: fakeLeanCode,
      status: "unverified",
      mathlib_version: "v4.15.0",
      mathlib_name: "Nat.Prime.two_le",
      lean_file: leanFileRel,
      verified_at: null,
      hash: sha256(fakeLeanCode),
      file_hash: leanFileHash
    },
    missing: ["lang:fr", "lang:de", "lang:pt", "lang:zh", "lang:hi", "lang:ru"],
    deps: [{ id: "11A41.0", type: "requires" }],
    children: [],
    steps: [],
    attachments: [
      {
        id: "11A41.9.fig1",
        kind: "svg",
        title: {
          it: "Soglia minima p ≥ 2 sulla semiretta naturale",
          en: "Lower bound p ≥ 2 on the natural number ray"
        },
        caption: {
          it: "2 è il minimo numero primo in ℕ.",
          en: "2 is the least prime number in ℕ."
        },
        svg: '<svg viewBox="0 0 240 60" width="240" height="60" role="img" aria-label="p >= 2"><line x1="20" y1="35" x2="220" y2="35" stroke="currentColor"/><circle cx="90" cy="35" r="4" fill="var(--ac)"/><text x="82" y="54">p ≥ 2</text></svg>'
      }
    ],
    sources: [
      {
        title: "Mathlib4 — Mathlib.Data.Nat.Prime.Basic",
        citation: "Nat.Prime.two_le",
        url: "https://leanprover-community.github.io/mathlib4_docs/Mathlib/Data/Nat/Prime/Basic.html",
        license_note: "Apache-2.0"
      }
    ],
    formalization_yaml: {
      project: "mathema",
      msc: "11A41",
      target_theorem: "Nat.Prime.two_le",
      comparator_setup: {
        lean_toolchain: "leanprover/lean4:v4.15.0",
        mathlib_rev: "v4.15.0",
        permitted_axioms: ["propext", "Classical.choice", "Quot.sound"]
      }
    },
    license: "CC-BY-SA-4.0",
    provenance: "human",
    reviewed_by: ["Marco Razzano"]
  };

  fs.writeFileSync(FAKE_NODE_PATH, JSON.stringify(fakeNode, null, 2) + "\n", "utf8");

  const valFakeRes = runValidate();
  const buildFakeRes = runBuildContent();
  const bundleAfterFake = JSON.parse(
    fs.readFileSync(path.join(ROOT, "public", "data", "bundle.json"), "utf8")
  );

  const integratedInBundle = Boolean(bundleAfterFake.nodes?.["11A41.9"]);
  const integratedInGraph = Boolean(
    bundleAfterFake.graph?.nodes?.some((n) => n.id === "11A41.9") &&
      bundleAfterFake.graph?.edges?.some((e) => e.from === "11A41.0" && e.to === "11A41.9")
  );
  const integratedInSearch = Boolean(
    bundleAfterFake.searchIndex?.some((s) => s.id === "11A41.9")
  );

  if (
    valFakeRes.status === 0 &&
    buildFakeRes.status === 0 &&
    (valFakeRes.stdout || "").includes("12 nodi") &&
    integratedInBundle &&
    integratedInGraph &&
    integratedInSearch
  ) {
    console.log(
      `\n✅ 9. Test di integrazione Fase C (content/11A41/11A41.9.json) -> PASSATO:`
    );
    console.log(`   - npm run validate accetta il nodo finto: ${valFakeRes.stdout.trim()}`);
    console.log(
      `   - Integrato in bundle.json, graph.json (arco 11A41.0 -> 11A41.9) e search-index.json senza toccare TypeScript.`
    );
  } else {
    console.error(
      `❌ 9. Test di integrazione Fase C (content/11A41/11A41.9.json) FALLITO!\n` +
        `validate exit=${valFakeRes.status}: ${valFakeRes.stdout} ${valFakeRes.stderr}\n` +
        `build exit=${buildFakeRes.status}: ${buildFakeRes.stdout} ${buildFakeRes.stderr}`
    );
    failedSuite = true;
  }
} finally {
  if (fs.existsSync(FAKE_NODE_PATH)) {
    fs.unlinkSync(FAKE_NODE_PATH);
  }
  fs.writeFileSync(TARGET_NODE, originalNode, "utf8");
  fs.writeFileSync(TARGET_LANG, originalLang, "utf8");
  fs.writeFileSync(TARGET_SCHEMA, originalSchema, "utf8");
  runBuildContent();
}

const finalRes = runValidate();
if (finalRes.status !== 0 || failedSuite) {
  console.error("\n❌ Suite test-invariants fallita.");
  process.exit(1);
}

console.log(
  "\n✅ TUTTI GLI 8 TEST DI ROTTURA DELIBERATA + IL TEST DI INTEGRAZIONE FASE C (11A41.9.json) SONO PASSATI E IL REPO È STATO RIPRISTINATO."
);
