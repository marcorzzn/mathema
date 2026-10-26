# Come Aggiungere un Nodo a `mathema`

Questa guida spiega come aggiungere una definizione, un lemma, un teorema o una dimostrazione alternativa **senza toccare alcuna riga di codice TypeScript**.

---

## Procedura in 3 passi ("crea JSON, esegui validate, apri PR")

### Passo 1 — Crea il file JSON nella cartella MSC corrispondente
1. Verifica che il codice MSC2020 a 5 caratteri (es. `11A41`, `11A51`, `11J72`) sia presente in `content/msc2020.json`.
2. Scegli il codice esteso `mathema` per il nuovo nodo (es. `11A41.4`).
   > **Nota:** Il codice a 5 caratteri (`11A41`) è standard MSC2020; il suffisso `.4` (e `.4.1`, `.4.1.a` per i passi) è l'estensione gerarchica di `mathema`.
3. Crea il file `content/11A41/11A41.4.json` seguendo il modello qui sotto:

```json
{
  "id": "11A41.4",
  "msc": "11A41",
  "kind": "lemma",
  "title": {
    "it": "Titolo in italiano",
    "en": "Title in English"
  },
  "natural": {
    "it": "Enunciato in linguaggio naturale in italiano.",
    "en": "Natural language statement in English."
  },
  "symbolic": "∀ p ∈ ℕ, Prime(p) ⇒ ...",
  "lean": {
    "code": "theorem my_new_lemma (p : ℕ) (hp : p.Prime) : 2 ≤ p := hp.two_le",
    "status": "unverified",
    "mathlib_version": "v4.15.0",
    "mathlib_name": "Nat.Prime.two_le",
    "lean_file": "lean/Mathema/NumberTheory/InfinitudePrimes.lean",
    "verified_at": null
  },
  "missing": [],
  "deps": [
    { "id": "11A41.0", "type": "requires" }
  ],
  "children": [],
  "steps": [],
  "attachments": [
    {
      "id": "11A41.4.fig1",
      "kind": "svg",
      "title": {
        "it": "Schema illustrativo",
        "en": "Illustrative diagram"
      },
      "caption": {
        "it": "Didascalia della figura.",
        "en": "Figure caption."
      },
      "svg": "<svg viewBox=\"0 0 240 60\" width=\"240\" height=\"60\" role=\"img\" aria-label=\"Diagramma\"><rect x=\"10\" y=\"10\" width=\"220\" height=\"40\" rx=\"3\"/><text x=\"24\" y=\"35\">p primo ⇒ p ≥ 2</text></svg>"
    }
  ],
  "sources": [
    {
      "title": "Mathlib4 — Mathlib.Data.Nat.Prime.Basic",
      "citation": "Nat.Prime.two_le",
      "license_note": "Apache-2.0"
    }
  ],
  "formalization_yaml": {
    "project": "mathema",
    "msc": "11A41",
    "target_theorem": "Mathema.NumberTheory.my_new_lemma",
    "comparator_setup": {
      "lean_toolchain": "leanprover/lean4:v4.15.0",
      "mathlib_rev": "v4.15.0",
      "permitted_axioms": ["propext", "Classical.choice", "Quot.sound"]
    }
  },
  "license": "CC-BY-SA-4.0",
  "provenance": "human",
  "reviewed_by": ["Marco Razzano"]
}
```

### Passo 2 — Esegui il validatore binario
Nel terminale, dalla radice del repository:
```bash
npm run validate
```
Lo script verifica automaticamente gli invarianti **I1–I9**:
- se hai scritto `status: "compiled"` a mano senza `.olean`, il validatore fallisce (usa sempre `"unverified"`, `"has_sorry"` o `"statement_only"`);
- se una dipendenza in `deps` non esiste, il validatore ti indica il codice mancante;
- se `mathlib_name` non è nel registro `schema/mathlib-registry.json`, usa `"none"` (o registra il nome se appartiene davvero a Mathlib4).

### Passo 3 — Apri una Pull Request o fai push
Quando `npm run validate` termina con successo, i file `public/data/bundle.json`, `public/data/search-index.json` e `public/data/graph.json` sono già aggiornati. Aprendo una PR o facendo push su `main`, la GitHub Action `.github/workflows/lean-verify.yml` compilerà il progetto `lean/` con `lake build` e promuoverà automaticamente i nodi verificati a `compiled`.
