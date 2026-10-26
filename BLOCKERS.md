# BLOCKERS — Registro dei Blocchi di Fase

Questo file traccia eventuali blocchi tecnici riscontrati durante la verifica binaria delle fasi A–H.

## Blocchi Attivi
- *Nessun blocco attivo sul repository locale.*
- **Nota operativa Fase A**: La promozione automatica dei 32 blocchi Lean da `unverified` a `compiled` avverrà al primo push su GitHub tramite l'esecuzione di `.github/workflows/lean-verify.yml` (`leanprover/lean-action@v1` con `lake-package-directory: lean`).
