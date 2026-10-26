# Invarianti e Protocollo Anti-Deriva di `mathema`

**Progetto:** `mathema` (`https://github.com/marcorzzn/Mathema`)  
**Autore:** Marco Razzano

---

## Parte 0 — Gli Invarianti (I1–I9)

Queste condizioni devono essere vere **in ogni singolo commit**. Il comando `npm run validate` esegue `scripts/validate.mjs` e fallisce con codice di uscita `!= 0` se anche un solo invariante viene violato.

| # | Invariante | Verifica binaria automatica (`npm run validate`) |
|---|---|---|
| **I1** | `compiled` esiste solo se esiste il binario `.olean` corrispondente in `lean/.lake/build/lib/` | `scripts/validate.mjs` controlla `fs.existsSync(oleanPath)` per ogni blocco `compiled`. Senza `.olean`, lo stato massimo consentito è `unverified`. |
| **I2** | Ogni nodo e passo ha le tre rappresentazioni (`natural`, `symbolic`, `lean`) o dichiara esplicitamente cosa manca in `missing: [...]` | `scripts/validate.mjs` verifica la presenza di `natural`, `symbolic`, `lean` e dell'array `missing`. |
| **I3** | Ogni nodo ha un codice MSC2020 valido a 5 caratteri + suffisso `mathema` documentato come estensione | `scripts/validate.mjs` confronta `node.msc` con `content/msc2020.json` e verifica il pattern `^[0-9]{2}[A-Z][0-9]{2}\.[0-9A-Za-z.]+$`. |
| **I4** | Aggiungere una lingua = aggiungere un solo file in `content/i18n/<lang>.json`, zero modifiche al codice | `scripts/build-content.mjs` scansiona dinamicamente `content/i18n/*.json` e il frontend genera i pulsanti lingua da `bundle.languages`. |
| **I5** | Aggiungere un nodo = aggiungere un solo file JSON in `content/<MSC>/<id>.json`, zero modifiche al codice | `scripts/build-content.mjs` scansiona dinamicamente `content/<MSC>/*.json` e aggiorna albero, grafo e indice di ricerca. |
| **I6** | Bundle iniziale < 50 KB gzip; 3D (`viewer3d.ts`) e AI (`ai-bridge.ts`) caricati solo on-demand | `scripts/validate.mjs` controlla che `src/main.ts` non importi staticamente `viewer3d` o `ai-bridge` e verifica il peso di `dist/`. |
| **I7** | Nessun dato utente tracciato, nessun login, nessuna pubblicità, nessun tracker | `scripts/validate.mjs` scansiona `src/` vietando `localStorage`, `sessionStorage`, `document.cookie`, `analytics`, `gtag`. |
| **I8** | Ogni riferimento Mathlib citato (`lean.mathlib_name`) esiste davvero nel registro Mathlib4 (`schema/mathlib-registry.json`) o nei file `lean/`, oppure è marcato `"none"` | `scripts/validate.mjs` confronta ogni `mathlib_name` con `schema/mathlib-registry.json`. |
| **I9** | Il sito funziona offline (PWA) e su GitHub Pages sotto `/Mathema/` o `/mathema/` | `vite.config.ts` usa `base: './'` e percorsi relativi `./` per `bundle.json`, icone e manifesto PWA. |

---

## Parte 1 — Sequenza delle Fasi (Stati del Repository)

- **Fase A — Truth Foundation**: `.github/workflows/lean-verify.yml` con `lake-package-directory: lean`, `scripts/sync-lean-status.mjs --after-lake-build`, stato di default `unverified`, commit automatico dei JSON dopo `lake build`.
- **Fase B — Vertical Slice Integrity**: i tre verticali (`11J72`, `11A41`, `11A51`) completi con 3 rappresentazioni su ogni passo, ≥ 2 dimostrazioni alternative per teorema, ≥ 1 allegato grafico per nodo, sottografo selettivo esatto e zero riferimenti Mathlib errati.
- **Fase C — Content Contract & Schema Freeze**: `schema/node.schema.json` congelato con `provenance`, `reviewed_by`, `missing[]`, `formalization_yaml` (Palomar), `comparator_setup`, `scripts/validate.mjs` e guide operative in `docs/`.
- **Fase D — Minimal Graph Engine**: layout stratificato deterministico $O(V+E)$ senza fisica continua, commutazione istantanea `Testo` / `Grafo` / `Ibrida` e filtro sul solo sottografo selezionato.
- **Fase E — NL ↔ Lean Bridge MVP**: modulo opzionale isolato lato server per il ciclo su $\sqrt{2}$, sempre marcato `unverified` / `none` finché non passa il compilatore Lean.
- **Fase F — Multilingual & i18n Hardening**: 10 lingue (`it`, `en`, `es`, `fr`, `de`, `pt`, `ar`, `zh`, `hi`, `ru`) con layout RTL per l'arabo e formule/codice sempre LTR.
- **Fase G — Ecosystem Integration**: metadati Palomar (`formalization_yaml`, `comparator_setup`) e allineamento Tau Ceti / Formal Frontier.
- **Fase H — Expansion by MSC**: completamento progressivo di una sezione MSC2020 alla volta seguendo `docs/section-template.md`.

---

## Parte 2 — Protocollo Operativo per Sessioni LLM

Ogni sessione di lavoro sul repository deve iniziare con il seguente contratto:

```text
CONTESTO: repo github.com/marcorzzn/Mathema (progetto mathema), autore Marco Razzano.
INVARIANTI ATTIVI: I1–I9 (vedi docs/invariants.md).
FASE CORRENTE: [A/B/C/D/E/F/G/H].
DELIVERABLE DI QUESTA SESSIONE: [un solo file o un solo script].
CRITERI DI ACCETTAZIONE: [lista binaria].
ANTI-SCOPE: [cosa non toccare].
Se una modifica richiede di toccare qualcosa fuori dal deliverable, fermati e chiedi conferma. Se proponi qualcosa fuori scope, scrivilo in BACKLOG.md, non implementarlo.
```
