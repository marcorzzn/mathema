# Mathema — Grafo Aperto e Verificabile della Conoscenza Matematica

**Autore:** Marco Razzano (`https://github.com/marcorzzn/Mathema`)  
**Licenza dei contenuti matematici:** Creative Commons Attribution-ShareAlike 4.0 (`CC-BY-SA-4.0`)  
**Licenza del codice e delle formalizzazioni Lean 4:** `Apache-2.0`

---

## 1. Filosofia e Standard di Classificazione (MSC2020 + Estensione Mathema)

Mathema organizza la conoscenza matematica in una struttura gerarchica minimale, velocissima e priva di decorazioni superflue (ispirata a **PlanetMath**), dove ogni informazione possiede simultaneamente **tre rappresentazioni sincronizzate 1:1:1**:

1. **Linguaggio naturale multilingue** (`IT`, `EN`, `ES`, `AR` con supporto RTL; estendibile aggiungendo un solo file JSON).
2. **Sintassi simbolica formale** (notazione logica e insiemistica compatta).
3. **Formalizzazione Lean 4** allineata a **Mathlib4**, con stato di verifica rigorosamente onesto.

### Nota importante sullo standard MSC2020
- I codici a **2 cifre** (`00-XX` … `97-XX`, tutte le 63 discipline), a **3 caratteri** (es. `11A`, `11J`) e a **5 caratteri** (es. `11A41`, `11A51`, `11J72`) appartengono allo standard ufficiale **Mathematics Subject Classification 2020 (MSC2020)**.
- I suffissi puntati sotto una voce a 5 caratteri — proposizione `11J72.1`, passaggio `11J72.1.2`, micro-risultato `11J72.1.2.a` — costituiscono l'**estensione numerica di Mathema** e **non fanno parte dello standard MSC2020 ufficiale**.

---

## 2. Struttura delle Cartelle

```text
Mathema/
├── content/
│   ├── msc2020.json                # Tutte le 63 discipline MSC2020 + sezioni a 3 e 5 caratteri
│   ├── i18n/                       # File lingua dell'interfaccia (1 file = 1 lingua)
│   │   ├── it.json
│   │   ├── en.json
│   │   ├── es.json
│   │   └── ar.json
│   ├── 11J72/                      # Irrazionalità di √2 (definizione + teorema + 3 dimostrazioni)
│   │   ├── 11J72.0.json
│   │   ├── 11J72.1.json
│   │   ├── 11J72.2.json
│   │   └── 11J72.3.json
│   ├── 11A41/                      # Infinità dei primi (definizione + Euclide + Goldbach + Fürstenberg)
│   │   ├── 11A41.0.json
│   │   ├── 11A41.1.json
│   │   ├── 11A41.2.json
│   │   └── 11A41.3.json
│   └── 11A51/                      # Fattorizzazione unica (Lemma di Euclide + TFA + Zermelo)
│       ├── 11A51.0.json
│       ├── 11A51.1.json
│       └── 11A51.2.json
├── schema/
│   └── node.schema.json            # JSON Schema formale di validazione di ogni nodo
├── lean/                           # Progetto Lake reale (Lean 4 v4.15.0 + Mathlib4)
│   ├── lean-toolchain
│   ├── lakefile.lean
│   ├── Mathema.lean
│   └── Mathema/NumberTheory/
│       ├── Sqrt2.lean
│       ├── InfinitudePrimes.lean
│       └── FundamentalArithmetic.lean
├── scripts/
│   ├── sync-lean-status.mjs        # Audit di onestà Lean (impedisce 'compiled' se c'è 'sorry')
│   └── build-content.mjs           # Valida lo schema, controlla le dipendenze e genera gli indici statici
├── src/
│   ├── main.ts                     # Frontend minimale in Vanilla TypeScript (< 10 KB gzip)
│   ├── index.css                   # Tipografia sobria stile PlanetMath, WCAG 2.2 AA, chiaro/scuro
│   ├── viewer3d.ts                 # Modulo grafici 2D e scene 3D caricato solo su richiesta (lazy)
│   ├── ai-bridge.ts                # Modulo AI opzionale isolato (sempre marcato 'non verificato')
│   └── types.ts
└── .github/workflows/
    ├── lean-verify.yml             # Compila davvero i file Lean a ogni commit e aggiorna gli stati
    └── deploy-pages.yml            # Valida e pubblica il sito statico su GitHub Pages
```

---

## 3. Come Aggiungere un Nuovo Nodo Matematico (Senza Toccare il Codice)

1. Individua la voce MSC2020 a 5 caratteri in `content/msc2020.json` (es. `11J72`). Se la cartella `content/11J72/` non esiste ancora, creala.
2. Crea un file JSON nominato con il codice del nodo, ad esempio `content/11J72/11J72.4.json`.
3. Segui lo schema documentato in `schema/node.schema.json`:
   ```json
   {
     "id": "11J72.4",
     "msc": "11J72",
     "kind": "lemma",
     "title": {
       "it": "Titolo in italiano",
       "en": "Title in English"
     },
     "natural": {
       "it": "Enunciato chiaro in italiano.",
       "en": "Clear statement in English."
     },
     "symbolic": "∀ n ∈ ℕ, ...",
     "lean": {
       "code": "theorem my_lemma : ... := by sorry",
       "status": "has_sorry",
       "mathlib_version": "v4.15.0",
       "mathlib_name": "none",
       "lean_file": "lean/Mathema/NumberTheory/Sqrt2.lean",
       "verified_at": null
     },
     "deps": [
       { "id": "11J72.1", "type": "requires" }
     ],
     "children": [],
     "steps": [],
     "attachments": [],
     "sources": [
       {
         "title": "Fonte",
         "citation": "Dettaglio bibliografico",
         "license_note": "CC-BY-SA-4.0"
       }
     ],
     "license": "CC-BY-SA-4.0",
     "provenance": "human",
     "reviewed_by": ["Marco Razzano"]
   }
   ```
4. Lancia la validazione nel terminale:
   ```bash
   npm run validate
   ```
   Lo script controlla automaticamente che lo schema sia rispettato, che tutte le dipendenze in `deps` esistano e che `lean.status` sia onesto, rigenerando l'indice di ricerca e la mappa del grafo.

---

## 4. Come Aggiungere una Nuova Lingua (Senza Toccare il Codice)

1. Copia `content/i18n/it.json` in `content/i18n/fr.json` (o `de.json`, `pt.json`, `zh.json`, `hi.json`, `ru.json`).
2. Imposta `"code": "fr"`, `"label": "FR"`, `"name": "Français"`, `"dir": "ltr"` (oppure `"rtl"` per lingue destrorse come l'arabo) e traduci le stringhe dell'oggetto `"ui"`.
3. Esegui `npm run validate`: il pulsante `FR` apparirà automaticamente nell'intestazione del sito. Nei nodi in cui la traduzione `"fr"` non è ancora presente, il sistema mostrerà automaticamente il fallback in italiano o inglese.

---

## 5. Come Far Verificare il Codice Lean 4

Mathema applica una politica di **onestà formale assoluta**:
- `compiled`: ammesso **solo** se il codice non contiene `sorry` ed è compilato nel progetto `lean/`.
- `has_sorry`: usato quando la prova contiene `sorry` in uno o più passaggi.
- `statement_only`: usato quando è presente solo l'enunciato o il rimando `#check` a Mathlib.
- `none`: nessuna formalizzazione Lean (o bozza generata da AI).

Per compilare localmente (richiede `elan` e `lake` installati):
```bash
cd lean
lake exe cache get
lake build
cd ..
node scripts/sync-lean-status.mjs --from-ci
```
Ad ogni push su GitHub, la workflow `.github/workflows/lean-verify.yml` compila automaticamente tutti i file `.lean` e aggiorna gli stati.

---

## 6. Come Pubblicare su GitHub Pages

1. Su GitHub, apri **Settings → Pages** e seleziona **Source: GitHub Actions**.
2. Ad ogni push sul ramo `main`, la workflow `.github/workflows/deploy-pages.yml` esegue `npm run validate` e `npm run build`, pubblicando la cartella statica `dist/` su GitHub Pages.

---

## 7. Lista Onesta: Cosa è Fatto e Cosa Resta da Fare

### Già completato e verificato
- Separazione completa dei contenuti dal codice in `content/<MSC>/<id>.json` con validazione `schema/node.schema.json`.
- Tutte le 63 discipline MSC2020 di primo livello (`00-XX` … `97-XX`) e le sezioni di teoria dei numeri.
- Tre insiemi verticali completi con più dimostrazioni alternative, passi numerati, micro-risultati, 3 rappresentazioni e figure SVG / 2D / 3D lazy-loaded:
  - `11J72` — Irrazionalità di $\sqrt{2}$ (Parità classica, Valutazione $2$-adica tramite TFA, Tappeto geometrico di Tennenbaum).
  - `11A41` — Infinità dei numeri primi (Euclide *Elementi* IX.20, Numeri di Fermat di Goldbach, Topologia di Fürstenberg).
  - `11A51` — Teorema Fondamentale dell'Aritmetica (Lemma di Euclide + Induzione classica + Induzione diretta di Zermelo).
- Frontend Vanilla TypeScript puro nello stile PlanetMath: bundle iniziale ~8 KB gzip, funzionamento offline PWA, accessibilità WCAG 2.2 AA e navigazione da tastiera.

### Ancora da fare (Roadmap aperta per i contributori)
- Espandere l'albero MSC2020 con tutte le ~6.000 voci a 5 caratteri delle altre 62 discipline oltre `11-XX`.
- Completare in Lean 4 i passaggi intermedi didattici attualmente marcati con `has_sorry` (es. la formalizzazione topologica completa della prova di Fürstenberg `11A41.3` e l'induzione di Zermelo `11A51.2.3`).
- Tradurre il corpo dei nodi nelle ulteriori lingue previste dal manifesto (`FR`, `DE`, `PT`, `ZH`, `HI`, `RU`).
