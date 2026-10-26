# Come Aggiungere una Lingua a `mathema`

In conformità all'**Invariante I4**, aggiungere una lingua a `mathema` richiede **un solo file JSON** in `content/i18n/`, senza alcuna modifica al codice sorgente.

---

## Procedura in 3 passi ("copia `it.json`, traduci, esegui `validate`")

### Passo 1 — Copia il file base
Dal terminale:
```bash
cp content/i18n/it.json content/i18n/ko.json
```

### Passo 2 — Traduci i metadati e le etichette UI
Apri `content/i18n/ko.json` e imposta:
- `"code"`: codice ISO 639-1 della lingua (es. `"ko"`, `"ja"`, `"pl"`).
- `"label"`: etichetta breve mostrata nel pulsante in alto (es. `"KO"`).
- `"name"`: nome nativo della lingua (es. `"한국어"`).
- `"dir"`: `"ltr"` per lingue sinistrorse, oppure `"rtl"` per lingue destrorse (come arabo `"ar"`, ebraico `"he"`, persiano `"fa"`). In modalità `"rtl"`, il layout del testo si inverte automaticamente mentre le formule simboliche e il codice Lean 4 restano `"ltr"`.
- `"ui"`: traduci tutte le chiavi dell'interfaccia.

### Passo 3 — Esegui `npm run validate`
```bash
npm run validate
```
Lo script include automaticamente la nuova lingua in `public/data/bundle.json` e il selettore nell'intestazione di `mathema` mostra subito il nuovo pulsante. Nei nodi matematici in cui la traduzione per quella lingua non è ancora presente, l'interfaccia usa il fallback su italiano (`it`) o inglese (`en`) e segnala eventuale incompletezza tramite il campo `missing`.
