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

### 5. Come Far Verificare il Codice Lean 4

Mathema applica una politica di **onestà formale assoluta**:
- `unverified` (**stato di default**): il codice Lean è scritto senza `sorry`, ma non è ancora stato compilato da `lake build` in CI.
- `compiled`: assegnato **esclusivamente** dallo script `scripts/sync-lean-status.mjs --after-lake-build` quando `lake build` ha generato il file `.olean` corrispondente senza errori né `sorry`.
- `has_sorry`: usato quando la prova contiene `sorry` in uno o più passaggi.
- `statement_only`: usato quando è presente solo l'enunciato o il rimando `#check` a Mathlib.
- `none`: nessuna formalizzazione Lean (o bozza generata da AI).

Per compilare localmente (richiede `elan` e `lake` installati):
```bash
cd lean
lake exe cache get
lake build
cd ..
node scripts/sync-lean-status.mjs --after-lake-build
node scripts/build-content.mjs
```
Ad ogni push su GitHub, la workflow `.github/workflows/lean-verify.yml` esegue `leanprover/lean-action@v1` con `lake-package-directory: lean`, lancia `node scripts/sync-lean-status.mjs --after-lake-build` e committa automaticamente nel repository i file JSON aggiornati a `compiled`.

---

## 6. Come Pubblicare su GitHub Pages

1. `vite.config.ts` è configurato con `base: '/Mathema/'` e percorsi relativi `./` per il manifesto PWA e il caricamento di `data/bundle.json`, così da funzionare nativamente su `https://marcorzzn.github.io/Mathema/`.
2. Su GitHub, apri **Settings → Pages** e seleziona **Source: GitHub Actions**.
3. Ad ogni push sul ramo `main`, la workflow `.github/workflows/deploy-pages.yml` esegue `npm ci --legacy-peer-deps`, valida i nodi e pubblica la cartella statica `dist/` su GitHub Pages.

---

## 7. Lista Onesta: Cosa è Fatto e Cosa Resta da Fare

### Già completato
- Separazione completa dei contenuti dal codice in `content/<MSC>/<id>.json` con validazione `schema/node.schema.json`.
- Tutte le 63 discipline MSC2020 di primo livello (`00-XX` … `97-XX`) e le sezioni di teoria dei numeri.
- Tre insiemi verticali completi (`11J72`, `11A41`, `11A51`) con più dimostrazioni alternative, passi numerati, micro-risultati, 3 rappresentazioni e figure SVG / 2D / 3D lazy-loaded.
- Onestà Lean: tutti i 32 blocchi scritti senza `sorry` partono con `lean.status = "unverified"` (`verified_at: null`) finché la GitHub Action non esegue `lake build` e committa la promozione a `"compiled"`.
- Frontend Vanilla TypeScript puro nello stile PlanetMath (~9 KB gzip), compatibile con GitHub Pages (`/Mathema/`), offline PWA e accessibilità WCAG 2.2 AA.

### Ancora da fare (Roadmap aperta)
- Eseguire il primo ciclo della GitHub Action `.github/workflows/lean-verify.yml` su GitHub per far compilare `lean/` da `lake build` e promuovere automaticamente i blocchi da `unverified` a `compiled`.
- Espandere l'albero MSC2020 con tutte le ~6.000 voci a 5 caratteri delle altre 62 discipline oltre `11-XX`.
- Completare in Lean 4 i passaggi intermedi didattici attualmente marcati `has_sorry` o `statement_only` (es. la formalizzazione topologica di Fürstenberg `11A41.3` e l'ultimo passo di Zermelo `11A51.2.3`).
- Tradurre il corpo dei nodi nelle ulteriori lingue previste (`FR`, `DE`, `PT`, `ZH`, `HI`, `RU`).
