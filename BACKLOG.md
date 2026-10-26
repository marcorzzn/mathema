# BACKLOG — Coda delle Fasi e Rischi Residui Tracciati

In conformità al protocollo anti-deriva (`docs/invariants.md`), qualsiasi funzionalità o chiusura di rischio appartenente a fasi successive viene tracciata qui in ordine di priorità.

## Fase C — Schema Freeze & Integrità Crittografica Lean (Priorità #1)
1. **[IMPLEMENTATO E VERIFICATO IN `validate.mjs`] Hash SHA-256 anti-disallineamento JSON ↔ `.olean` (`lean.hash` e `lean.file_hash`)**:
   - **Problema**: verificare la sola esistenza del file `.olean` in `lean/.lake/build/lib/` non garantisce che il codice Lean nel JSON non sia stato modificato *dopo* l'ultimo `lake build`.
   - **Soluzione**: ogni blocco `lean` contiene `lean.hash` (SHA-256 del `lean.code` normalizzato) e, per i blocchi associati a un file `.lean`, `lean.file_hash` (SHA-256 del file sorgente `.lean`). `scripts/sync-lean-status.mjs` e `scripts/validate.mjs` verificano che `lean.hash` corrisponda al codice nel JSON e che `lean.file_hash` corrisponda al file `.lean` compilato; in caso di disallineamento lo stato decade a `unverified` e `npm run validate` fallisce se lo stato è `compiled`.

## Fase F — Sezioni MSC2020 in Coda (Una sezione per sessione)
1. `11A41` — Numeri primi (completamento traduzioni 10 lingue su tutti i nodi della sezione)
2. `11A51` — Fattorizzazione e Teorema Fondamentale dell'Aritmetica
3. `11J72` — Irrazionalità e indipendenza lineare ($\sqrt{2}$, $\sqrt{p}$, discesa infinita)
4. `03B` — Logica generale (calcolo proposizionale e dei predicati)
5. `11D` — Equazioni diofantee (identità di Bézout, equazione di Pell)
6. `12E` — Polinomi e irriducibilità (criterio di Eisenstein, lemma di Gauss)
7. `20A` — Fondamenti della teoria dei gruppi (teorema di Lagrange, omomorfismi)
8. `26A` — Funzioni di una variabile reale (teorema di Bolzano-Weierstrass, valore intermedio)
9. `51M` — Geometria euclidea e non euclidea
10. `54A` — Topologia generale (compattezza, connessione, topologia di Furstenberg)

## Orizzonte Post-Fase H
- **Fase E (Estensione)**: Integrazione con processo `LeanInteract` / `LeanProbe` persistente per compilare in tempo reale i tentativi dell'utente su teoremi arbitrari oltre $\sqrt{2}$.
- **Multi-stile pedagogico attivo**: Generazione verificata di varianti espositive (Feynman, Bourbaki, costruttivo, visuale) vincolate allo stesso albero tattico Lean.
