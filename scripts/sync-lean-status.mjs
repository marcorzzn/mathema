#!/usr/bin/env node
/**
 * scripts/sync-lean-status.mjs
 *
 * Script per la sincronizzazione ONESTA dello stato Lean 4 e dei metadati di contratto
 * (Fase A, Fase B, Fase C) dei nodi di `mathema`.
 *
 * Regole inderogabili (Invariante I1):
 * 1. Se `lean.code` è vuoto -> status = "none", verified_at = null.
 * 2. Se `lean.code` contiene `sorry` o `admit` -> status = "has_sorry", verified_at = null.
 * 3. Se `lean.code` contiene solo `#check` senza corpo dimostrativo (`:=` o `by`) ->
 *    status = "statement_only", verified_at = null.
 * 4. Se `lean.code` ha una dimostrazione senza `sorry`, lo stato di default è `"unverified"`
 *    (`verified_at = null`).
 * 5. Lo stato `"compiled"` viene assegnato SOLO quando:
 *    - lo script è invocato con `--after-lake-build` (dalla GitHub Action dopo `lake build`), E
 *    - il file binario compilato `.olean` corrispondente a `lean.lean_file` esiste davvero
 *      in `lean/.lake/build/lib/`, E
 *    - il file `.lean` sorgente non contiene `sorry` né `admit`.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");

const afterLakeBuild = process.argv.includes("--after-lake-build");
const nowIso = new Date().toISOString();

const ALL_TEN_LANGS = ["it", "en", "es", "fr", "de", "pt", "ar", "zh", "hi", "ru"];

function sha256(text) {
  return crypto.createHash("sha256").update(String(text ?? ""), "utf8").digest("hex");
}

// Figure SVG matematiche dedicate per i nodi che non ne avevano ancora una (Fase B: >= 1 allegato per nodo)
const DEFAULT_NODE_SVGS = {
  "11J72.0": {
    id: "11J72.0.fig1",
    kind: "svg",
    title: {
      it: "Figura 1: Immersione canonica ℤ ↪ ℚ ↪ ℝ e complementare ℝ \\ ℚ",
      en: "Figure 1: Canonical embedding ℤ ↪ ℚ ↪ ℝ and complement ℝ \\ ℚ"
    },
    caption: {
      it: "Un numero reale x è irrazionale se e solo se non appartiene all'immagine di (↑) : ℚ → ℝ.",
      en: "A real number x is irrational if and only if it lies outside the range of (↑) : ℚ → ℝ."
    },
    svg: `<svg viewBox="0 0 420 120" width="420" height="120" role="img" aria-label="Insiemi numerici Z, Q, R"><rect x="12" y="12" width="396" height="96" rx="4"/><text x="26" y="34" style="font-weight:bold">ℝ (Reali)</text><rect x="26" y="44" width="230" height="52" rx="3" style="stroke:var(--ac)"/><text x="38" y="66">ℚ = { p/q : p ∈ ℤ, q ∈ ℕ₊ }</text><text x="38" y="86">gcd(|p|, q) = 1</text><text x="278" y="68" style="fill:var(--ok);font-weight:bold">ℝ \\ ℚ (Irrazionali)</text><text x="278" y="90">√2, √3, π, e …</text></svg>`
  },
  "11J72.2": {
    id: "11J72.2.fig1",
    kind: "svg",
    title: {
      it: "Figura 1: Disgiunzione tra valutazioni 2-adiche pari e dispari in ℕ",
      en: "Figure 1: Disjointness of even and odd 2-adic valuations in ℕ"
    },
    caption: {
      it: "In p² = 2q², l'esponente v₂(p²) = 2v₂(p) appartiene agli interi pari mentre v₂(2q²) = 2v₂(q)+1 appartiene ai dispari.",
      en: "In p² = 2q², the exponent v₂(p²) = 2v₂(p) is even whereas v₂(2q²) = 2v₂(q)+1 is odd."
    },
    svg: `<svg viewBox="0 0 420 115" width="420" height="115" role="img" aria-label="Confronto di parità 2-adica"><line x1="20" y1="65" x2="395" y2="65" stroke="currentColor" stroke-width="1.5"/><circle cx="50" cy="65" r="4.5" fill="var(--ac)"/><text x="36" y="92">0 (pari)</text><circle cx="115" cy="65" r="4.5" fill="var(--ok)"/><text x="98" y="42" style="fill:var(--ok)">1 (dispari)</text><circle cx="180" cy="65" r="4.5" fill="var(--ac)"/><text x="166" y="92">2 (pari)</text><circle cx="245" cy="65" r="4.5" fill="var(--ok)"/><text x="228" y="42" style="fill:var(--ok)">3 (dispari)</text><circle cx="310" cy="65" r="4.5" fill="var(--ac)"/><text x="296" y="92">4 (pari)</text><text x="20" y="20">v₂(p²) = 2·v₂(p) ∈ 2ℕ   ≠   v₂(2q²) = 2·v₂(q)+1 ∈ 2ℕ+1</text></svg>`
  },
  "11A41.0": {
    id: "11A41.0.fig1",
    kind: "svg",
    title: {
      it: "Figura 1: Il minimo divisore minFac(n) > 1 è necessariamente primo",
      en: "Figure 1: The least divisor minFac(n) > 1 is necessarily prime"
    },
    caption: {
      it: "Se d = minFac(n) si fattorizzasse come d = a·b con 1 < a < d, per transitività a dividerebbe n violando la minimalità di d.",
      en: "If d = minFac(n) factored as d = a·b with 1 < a < d, transitivity would give a ∣ n, violating the minimality of d."
    },
    svg: `<svg viewBox="0 0 420 115" width="420" height="115" role="img" aria-label="Minimalità di minFac(n)"><line x1="25" y1="65" x2="390" y2="65" stroke="currentColor" stroke-width="1.5"/><circle cx="45" cy="65" r="4" fill="currentColor"/><text x="41" y="90">1</text><circle cx="120" cy="65" r="4" fill="var(--warn)"/><text x="95" y="42">a (impossibile)</text><circle cx="215" cy="65" r="5" fill="var(--ac)"/><text x="175" y="90" style="fill:var(--ac);font-weight:bold">d = minFac(n)</text><circle cx="360" cy="65" r="4.5" fill="currentColor"/><text x="355" y="90">n</text><text x="25" y="20">Nessun divisore di n cade nell'intervallo aperto (1, minFac(n))</text></svg>`
  },
  "11A41.2": {
    id: "11A41.2.fig1",
    kind: "svg",
    title: {
      it: "Figura 1: Numeri di Fermat Fₙ = 2^(2ⁿ) + 1 e fattori primi distinti",
      en: "Figure 1: Fermat numbers Fₙ = 2^(2ⁿ) + 1 and distinct prime factors"
    },
    caption: {
      it: "La relazione F₀·F₁⋯F_{n-1} = Fₙ - 2 implica MCD(Fₘ, Fₙ) = 1 per ogni m < n.",
      en: "The identity F₀·F₁⋯F_{n-1} = Fₙ - 2 forces gcd(Fₘ, Fₙ) = 1 for all m < n."
    },
    svg: `<svg viewBox="0 0 430 125" width="430" height="125" role="img" aria-label="Numeri di Fermat coprimi"><rect x="14" y="18" width="88" height="52" rx="3"/><text x="22" y="39">F₀ = 3</text><text x="22" y="58">p₀ = 3</text><rect x="118" y="18" width="88" height="52" rx="3"/><text x="126" y="39">F₁ = 5</text><text x="126" y="58">p₁ = 5</text><rect x="222" y="18" width="92" height="52" rx="3"/><text x="230" y="39">F₂ = 17</text><text x="230" y="58">p₂ = 17</text><rect x="328" y="18" width="90" height="52" rx="3"/><text x="335" y="39">F₃ = 257</text><text x="335" y="58">p₃ = 257</text><text x="14" y="102">3 · 5 · 17 = 255 = 257 - 2  ⇒  gcd(Fₘ, Fₙ) = 1  ⇒  p₀, p₁, p₂, p₃, … tutti distinti</text></svg>`
  },
  "11A41.3": {
    id: "11A41.3.fig1",
    kind: "svg",
    title: {
      it: "Figura 1: Partizione topologica di ℤ \\ {-1, 1} tramite gli aperti-chiusi pℤ",
      en: "Figure 1: Topological covering of ℤ \\ {-1, 1} by clopen progressions pℤ"
    },
    caption: {
      it: "Ogni progressione pℤ è sia aperta sia chiusa; il complementare {-1, 1} è finito e non può essere aperto.",
      en: "Each progression pℤ is clopen; the complement {-1, 1} is finite and therefore cannot be open."
    },
    svg: `<svg viewBox="0 0 430 120" width="430" height="120" role="img" aria-label="Topologia di Furstenberg su Z"><rect x="12" y="15" width="406" height="88" rx="4"/><text x="24" y="38">ℤ = (⋃_{p primo} pℤ)  ⊔  {-1, +1}</text><rect x="24" y="50" width="250" height="40" rx="3"/><text x="34" y="75">2ℤ ∪ 3ℤ ∪ 5ℤ ∪ … (clopen)</text><rect x="290" y="50" width="114" height="40" rx="3" style="stroke:var(--warn)"/><text x="300" y="75">{-1, +1} (# = 2)</text></svg>`
  },
  "11A51.0": {
    id: "11A51.0.fig1",
    kind: "svg",
    title: {
      it: "Figura 1: Dall'identità di Bézout u·p + v·a = 1 al Lemma di Euclide",
      en: "Figure 1: From Bézout's identity u·p + v·a = 1 to Euclid's Lemma"
    },
    caption: {
      it: "Se p ∤ a allora gcd(p, a) = 1; moltiplicando u·p + v·a = 1 per b si ottiene che p divide b.",
      en: "If p ∤ a then gcd(p, a) = 1; multiplying u·p + v·a = 1 by b shows that p divides b."
    },
    svg: `<svg viewBox="0 0 430 115" width="430" height="115" role="img" aria-label="Schema del Lemma di Euclide"><rect x="14" y="18" width="175" height="42" rx="3"/><text x="24" y="44">gcd(p, a) = 1 ⇒ up + va = 1</text><line x1="189" y1="39" x2="225" y2="39" stroke="currentColor"/><rect x="225" y="18" width="190" height="42" rx="3"/><text x="235" y="44">b = p·(ub) + v·(ab)</text><text x="20" y="90">Poiché p ∣ p·(ub) e per ipotesi p ∣ ab, segue necessariamente p ∣ b.</text></svg>`
  },
  "11A51.2": {
    id: "11A51.2.fig1",
    kind: "svg",
    title: {
      it: "Figura 1: Sottrazione geometrica di Zermelo n' = n - p₁·Q = (q₁ - p₁)·Q",
      en: "Figure 1: Zermelo's geometric subtraction n' = n - p₁·Q = (q₁ - p₁)·Q"
    },
    caption: {
      it: "Dal rettangolo di area n = q₁·Q si sottrae la striscia p₁·Q, ottenendo un intero positivo strettamente minore n' < n.",
      en: "Subtracting the strip p₁·Q from the rectangle n = q₁·Q produces a strictly smaller positive integer n' < n."
    },
    svg: `<svg viewBox="0 0 420 135" width="420" height="135" role="img" aria-label="Rettangolo di discesa di Zermelo"><rect x="25" y="20" width="180" height="90" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="25" y="20" width="65" height="90" fill="var(--sf)" stroke="var(--ac)"/><text x="38" y="68">p₁ · Q</text><text x="108" y="68" style="fill:var(--ok);font-weight:bold">(q₁ - p₁) · Q</text><text x="95" y="126">Larghezza totale q₁, altezza Q  ⇒  n' = n - p₁Q &lt; n</text></svg>`
  }
};

function hasCompiledOlean(leanFileRel) {
  if (!leanFileRel || !leanFileRel.startsWith("lean/")) return false;
  const relInsideLean = leanFileRel.slice("lean/".length).replace(/\.lean$/, ".olean");
  const oleanPath = path.join(ROOT, "lean", ".lake", "build", "lib", relInsideLean);
  const srcPath = path.join(ROOT, leanFileRel);
  if (!fs.existsSync(oleanPath) || !fs.existsSync(srcPath)) return false;
  const srcContent = fs.readFileSync(srcPath, "utf8");
  return !/\b(sorry|admit)\b/.test(srcContent);
}

function computeMissingList(entity) {
  const missing = [];
  for (const l of ALL_TEN_LANGS) {
    if (!entity.title?.[l] || !entity.natural?.[l]) {
      missing.push(`lang:${l}`);
    }
  }
  if (entity.lean?.status === "has_sorry") {
    missing.push("lean:complete_proof_without_sorry");
  } else if (entity.lean?.status === "statement_only") {
    missing.push("lean:local_proof");
  } else if (entity.lean?.status === "none") {
    missing.push("lean:formalization");
  }
  return missing;
}

function auditLeanBlock(lean, defaultLeanFile) {
  const code = (lean?.code || "").trim();
  if (!lean.mathlib_name) {
    lean.mathlib_name = "none";
  }
  if (!lean.lean_file && defaultLeanFile) {
    lean.lean_file = defaultLeanFile;
  }
  lean.hash = sha256(code);
  if (lean.lean_file && fs.existsSync(path.join(ROOT, lean.lean_file))) {
    lean.file_hash = sha256(fs.readFileSync(path.join(ROOT, lean.lean_file), "utf8"));
  } else {
    lean.file_hash = null;
  }

  if (!code) {
    lean.status = "none";
    lean.verified_at = null;
    return;
  }

  if (/\b(sorry|admit)\b/.test(code)) {
    lean.status = "has_sorry";
    lean.verified_at = null;
    return;
  }

  const hasProofBody = /:=|\bby\b/.test(code);
  if (!hasProofBody) {
    lean.status = "statement_only";
    lean.verified_at = null;
    return;
  }

  if (afterLakeBuild && hasCompiledOlean(lean.lean_file)) {
    lean.status = "compiled";
    lean.verified_at = nowIso;
  } else {
    lean.status = "unverified";
    lean.verified_at = null;
  }
}

function walkSteps(steps, defaultLeanFile) {
  if (!Array.isArray(steps)) return;
  for (const step of steps) {
    auditLeanBlock(step.lean, defaultLeanFile);
    step.missing = computeMissingList(step);
    if (Array.isArray(step.substeps)) {
      walkSteps(step.substeps, defaultLeanFile);
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

    auditLeanBlock(data.lean, data.lean?.lean_file);
    walkSteps(data.steps, data.lean?.lean_file);

    // Fase B: garantisci almeno 1 allegato grafico per ogni nodo principale
    if (!Array.isArray(data.attachments) || data.attachments.length === 0) {
      if (DEFAULT_NODE_SVGS[data.id]) {
        data.attachments = [DEFAULT_NODE_SVGS[data.id]];
      }
    }

    // Fase C / G: garantisci formalization_yaml + comparator_setup compatibile Palomar
    if (!data.formalization_yaml) {
      data.formalization_yaml = {
        project: "mathema",
        msc: data.msc,
        target_theorem:
          data.lean.mathlib_name && data.lean.mathlib_name !== "none"
            ? data.lean.mathlib_name
            : `Mathema.NumberTheory.${data.id.replace(/\./g, "_")}`,
        comparator_setup: {
          lean_toolchain: "leanprover/lean4:v4.15.0",
          mathlib_rev: data.lean.mathlib_version || "v4.15.0",
          permitted_axioms: ["propext", "Classical.choice", "Quot.sound"]
        }
      };
    }

    // Invariante I2: calcola esplicitamente l'array missing[]
    data.missing = computeMissingList(data);

    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2) + "\n", "utf8");
    checkedFiles++;
  }
}

console.log(`[mathema sync-lean-status] Sincronizzati ${checkedFiles} file di contenuto.`);
