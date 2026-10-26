# Come Aggiungere un Nodo a `mathema` (Fase C — Contratto Congelato)

Questa guida spiega come aggiungere una definizione, un lemma, un teorema, un corollario o una dimostrazione a `mathema` **creando esclusivamente un file JSON**, senza toccare alcuna riga di codice TypeScript.

---

## Architettura Data-Driven (Zero-Code)

Tutta la conoscenza matematica risiede in `content/<MSC5>/<ID>.json` ed è governata dal contratto congelato `schema/node.schema.json`.
Quando aggiungi un file JSON:
1. `npm run sync` calcola automaticamente gli hash SHA-256 (`lean.hash` e `lean.file_hash`), sincronizza lo stato di compilazione Lean 4 e rigenera `public/data/bundle.json`, `public/data/graph.json` e `public/data/search-index.json`.
2. `npm run validate` controlla in sola lettura che il nuovo nodo rispetti tutti gli **Invarianti I1–I9** e lo schema congelato `schema/node.schema.json`.
3. L'albero MSC a sinistra, il testo a tre rappresentazioni, il grafo SVG e la ricerca istantanea mostrano automaticamente il nuovo nodo.

---

## Procedura passo-passo

### Passo 1 — Verifica il codice MSC2020 a 5 caratteri
1. I codici a **2 caratteri** (es. `11`), **3 caratteri** (es. `11A`) e **5 caratteri** (es. `11A41`) sono codici ufficiali **MSC2020** registrati in `content/msc2020.json`.
2. Se la voce a 5 caratteri (es. `15A04` per *Linear transformations*) non è ancora elencata nell'array `entries` di `content/msc2020.json` ( o la sua sezione a 3 caratteri `15A` non è in `sections`), aggiungila in `content/msc2020.json` e crea la cartella `content/15A04/`.
3. Scegli l'identificatore esteso `mathema` con suffisso puntato:
   - Nodo principale: `<MSC5>.<numero>` (es. `11A41.9`)
   - Passo dimostrativo: `<MSC5>.<numero>.<passo>` (es. `11A41.9.1`)
   - Micro-risultato / sottolivello: `<MSC5>.<numero>.<passo>.<lettera>` (es. `11A41.9.1.a`)

---

### Passo 2 — Crea il file `content/<MSC5>/<ID>.json`

Il nome del file **deve coincidere esattamente con `<ID>.json`** (es. `content/11A41/11A41.9.json`).
Ogni nodo deve includere tutti i **17 campi radice obbligatori** previsti da `schema/node.schema.json`:

| Campo | Tipo | Descrizione e Regole Invarianti |
|---|---|---|
| `id` | `string` | Codice univoco `mathema` (es. `"11A41.9"`). Deve iniziare con `<msc>.`. |
| `msc` | `string` | Codice MSC2020 a 5 caratteri (es. `"11A41"`), uguale al nome della cartella. |
| `kind` | `string` | Uno tra: `"definition"`, `"lemma"`, `"theorem"`, `"corollary"`, `"proof"`, `"technique"`, `"example"`, `"exercise"`, `"remark"`. |
| `title` | `object` | Titolo multilingue (`"it"` ed `"en"` obbligatori). |
| `natural` | `object` | **Rappresentazione 1/3**: Spiegazione in linguaggio naturale (`"it"` ed `"en"` obbligatori). |
| `symbolic` | `string` | **Rappresentazione 2/3**: Formula simbolica concisa in Unicode/LaTeX leggero. |
| `lean` | `object` | **Rappresentazione 3/3**: Blocco Lean 4 (vedi dettagli sotto). |
| `missing` | `string[]` | **Invariante I2**: Elenco esplicito delle lingue o parti non ancora tradotte/formalizzate (es. `["lang:fr", "lang:de", "lang:pt", "lang:zh", "lang:hi", "lang:ru"]`, oppure `[]` se completo in tutte le 10 lingue). |
| `deps` | `object[]` | Dipendenze logiche (`{ "id": "11A41.0", "type": "requires" }`). Tipi ammessi: `"requires"`, `"generalizes"`, `"special_case_of"`, `"alternative_proof_of"`, `"applies_to"`. |
| `children` | `string[]` | Array ordinato degli ID dei passi figli diretti (es. `["11A41.9.1"]` o `[]`). |
| `steps` | `object[]` | Passaggi dimostrativi annidati (ciascuno con la stessa tripla rappresentazione + `missing` + `deps`). |
| `attachments` | `object[]` | **Invariante I5**: Almeno 1 allegato grafico (`kind`: `"svg"`, `"plot2d"` o `"scene3d"`). |
| `sources` | `object[]` | Almeno 1 fonte bibliografica o formale con `title`, `citation` e `license_note`. |
| `formalization_yaml` | `object` | Metadati standard ecosistema/Palomar con `project`, `msc`, `target_theorem` e `comparator_setup` (`lean_toolchain`, `mathlib_rev`, `permitted_axioms`). |
| `license` | `string` | `"CC-BY-SA-4.0"` oppure `"Apache-2.0"`. |
| `provenance` | `string` | `"human"`, `"ai-assisted"` oppure `"imported"`. |
| `reviewed_by` | `string[]` | Almeno un revisore umano (es. `["Marco Razzano"]`). |

#### Regole di Onestà per il blocco `lean` (Invariante I1 e I8)
- **Non scrivere mai `"status": "compiled"` a mano**: `"compiled"` è riservato ai nodi il cui binario `.olean` è stato generato da `lake build`.
- Usa `"unverified"` se il codice Lean non contiene `sorry`, `"has_sorry"` se contiene `sorry`, `"statement_only"` se è solo l'enunciato.
- Imposta `"mathlib_name"` a un identificatore registrato in `schema/mathlib-registry.json` (oppure `"none"` se è un lemma locale non presente in Mathlib).
- Se lanci `npm run sync`, gli hash `"hash"` e `"file_hash"` vengono calcolati e inseriti automaticamente.

---

### Esempio completo pronto per il copia-incolla (`content/11A41/11A41.9.json`)

```json
{
  "id": "11A41.9",
  "msc": "11A41",
  "kind": "lemma",
  "title": {
    "it": "Ogni numero primo è maggiore o uguale a 2",
    "en": "Every prime number is greater than or equal to 2",
    "es": "Todo número primo es mayor o igual que 2",
    "ar": "كل عدد أولي أكبر من أو يساوي 2"
  },
  "natural": {
    "it": "Per definizione di primalità in ℕ, i numeri 0 e 1 non sono primi; pertanto ogni numero primo p soddisfa la disuguaglianza p ≥ 2.",
    "en": "By definition of primality in ℕ, 0 and 1 are not prime; hence every prime number p satisfies p ≥ 2.",
    "es": "Por definición de primalidad en ℕ, 0 y 1 no son primos; por tanto todo primo p cumple p ≥ 2.",
    "ar": "بحسب تعريف الأولية في ℕ فإن 0 و1 ليسا أوليين، وبالتالي كل عدد أولي p يحقق p ≥ 2."
  },
  "symbolic": "∀ p ∈ ℕ, Prime(p) ⇒ p ≥ 2",
  "lean": {
    "code": "theorem prime_ge_two {p : ℕ} (hp : p.Prime) : 2 ≤ p := hp.two_le",
    "status": "unverified",
    "mathlib_version": "v4.15.0",
    "mathlib_name": "Nat.Prime.two_le",
    "lean_file": "lean/Mathema/NumberTheory/InfinitudePrimes.lean",
    "verified_at": null,
    "hash": "0000000000000000000000000000000000000000000000000000000000000000",
    "file_hash": null
  },
  "missing": [
    "lang:fr",
    "lang:de",
    "lang:pt",
    "lang:zh",
    "lang:hi",
    "lang:ru"
  ],
  "deps": [
    {
      "id": "11A41.0",
      "type": "requires"
    }
  ],
  "children": [],
  "steps": [],
  "attachments": [
    {
      "id": "11A41.9.fig1",
      "kind": "svg",
      "title": {
        "it": "Soglia minima p ≥ 2 sulla semiretta naturale",
        "en": "Lower bound p ≥ 2 on the natural number ray"
      },
      "caption": {
        "it": "0 e 1 sono esclusi dall'insieme dei primi; 2 è il minimo numero primo.",
        "en": "0 and 1 are excluded from the set of primes; 2 is the least prime."
      },
      "svg": "<svg viewBox=\"0 0 260 60\" width=\"260\" height=\"60\" role=\"img\" aria-label=\"p >= 2\"><line x1=\"20\" y1=\"35\" x2=\"240\" y2=\"35\" stroke=\"currentColor\"/><circle cx=\"100\" cy=\"35\" r=\"4\" fill=\"var(--ac)\"/><text x=\"92\" y=\"54\">p ≥ 2</text></svg>"
    }
  ],
  "sources": [
    {
      "title": "Mathlib4 — Mathlib.Data.Nat.Prime.Basic",
      "citation": "Nat.Prime.two_le",
      "url": "https://leanprover-community.github.io/mathlib4_docs/Mathlib/Data/Nat/Prime/Basic.html",
      "license_note": "Apache-2.0"
    }
  ],
  "formalization_yaml": {
    "project": "mathema",
    "msc": "11A41",
    "target_theorem": "Nat.Prime.two_le",
    "comparator_setup": {
      "lean_toolchain": "leanprover/lean4:v4.15.0",
      "mathlib_rev": "v4.15.0",
      "permitted_axioms": [
        "propext",
        "Classical.choice",
        "Quot.sound"
      ]
    }
  },
  "license": "CC-BY-SA-4.0",
  "provenance": "human",
  "reviewed_by": [
    "Marco Razzano"
  ]
}
```

---

### Passo 3 — Sincronizza gli hash e valida gli invarianti

Esegui nel terminale:

```bash
npm run sync
npm run validate
```

1. `npm run sync` aggiorna automaticamente `lean.hash` e `lean.file_hash` nel tuo nuovo file JSON e rigenera `public/data/bundle.json`.
2. `npm run validate` verifica in sola lettura che tutti gli Invarianti **I1–I9** siano soddisfatti (exit code `0`).
