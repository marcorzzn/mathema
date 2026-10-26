# Template di Sezione MSC2020 (Fase H)

Prima di considerare "completa" una sezione MSC2020 (es. `11A41`, `11A51`, `11J72`), ogni nodo della sezione deve soddisfare questa lista di controllo binaria.

---

## Checklist di Completezza di una Sezione MSC

- [ ] **Gerarchia registrata**: la sezione a 3 caratteri (es. `11A`) e la voce a 5 caratteri (es. `11A41`) sono presenti in `content/msc2020.json` con i titoli ufficiali MSC2020.
- [ ] **Nodo di definizione (`.0`)**: esiste almeno il nodo fondativo `<MSC>.0` che introduce formalmente gli oggetti della voce (es. `11A41.0` per `Nat.Prime`).
- [ ] **Teorema cardine (`.1`)**: esiste il teorema principale `<MSC>.1` con tutti i passaggi dimostrativi numerati (`.1.1`, `.1.2`, …) e i micro-risultati (`.1.2.a`).
- [ ] **Prove alternative (`.2`, `.3`)**: esistono almeno 2 dimostrazioni alternative collegate al teorema tramite `{"id": "<MSC>.1", "type": "alternative_proof_of"}`.
- [ ] **Tripla rappresentazione 1:1:1**: ogni nodo, passo e micro-risultato possiede `natural`, `symbolic` e `lean`. Eventuali traduzioni mancanti sono dichiarate in `missing`.
- [ ] **Allegati visivi**: ogni nodo principale della sezione possiede almeno 1 allegato (`svg`, `plot2d` o `scene3d`).
- [ ] **Onestà Lean**: nessun nodo dichiara `compiled` senza il file `.olean` generato da `lake build` (Invariante I1).
- [ ] **Zero nodi orfani**: ogni nodo (eccetto le definizioni primitive `.0`) ha almeno un arco entrante o uscente in `deps`.
- [ ] **Validazione superata**: `npm run validate` restituisce `0` errori.
