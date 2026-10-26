# Come Aggiungere una Lingua a `mathema` (Fase C — Contratto Congelato)

In conformità all'**Invariante I4**, aggiungere una nuova lingua all'interfaccia e ai contenuti di `mathema` richiede **esclusivamente la creazione di un file JSON** in `content/i18n/`, senza alcuna modifica al codice sorgente TypeScript.

---

## Lingue attualmente integrate (10 lingue base)

Nella directory `content/i18n/` sono già presenti e validate 10 lingue (9 lingue LTR + 1 lingua RTL):
- `it.json` (Italiano — LTR)
- `en.json` (English — LTR)
- `es.json` (Español — LTR)
- `fr.json` (Français — LTR)
- `de.json` (Deutsch — LTR)
- `pt.json` (Português — LTR)
- `ar.json` (العربية — **RTL**, inversione automatica del layout con formule e codice Lean 4 mantenuti in LTR)
- `zh.json` (中文 — LTR)
- `hi.json` (हिन्दी — LTR)
- `ru.json` (Русский — LTR)

---

## Procedura in 3 passi per aggiungere una nuova lingua (es. Giapponese `ja` o Ebraico `he`)

### Passo 1 — Copia il modello da `content/i18n/it.json`
Dal terminale, nella radice del repository:

```bash
cp content/i18n/it.json content/i18n/ja.json
```

### Passo 2 — Compila i metadati e il dizionario `ui`
Apri `content/i18n/ja.json` e aggiorna i campi principali:

```json
{
  "code": "ja",
  "label": "JA",
  "name": "日本語",
  "dir": "ltr",
  "ui": {
    "search_placeholder": "コードまたはキーワードで検索 (例: 11J72, 素数, ユークリッド)",
    "view_text": "テキスト",
    "view_graph": "グラフ",
    "root": "数学全体 (MSC2020)",
    "rep_natural": "自然言語",
    "rep_symbolic": "記号論理",
    "rep_lean": "Lean 4 (Mathlib)",
    "expand_all": "すべて展開",
    "collapse_all": "すべて折りたたむ",
    "show_selected_graph": "選択項目のグラフを表示",
    "select_step": "グラフに含める",
    "empty_node": "このMSCセクションにはまだ形式化されたノードがありません。"
  }
}
```

#### Regole validate da `scripts/validate.mjs` (Invariante I4):
1. **`code`**: codice ISO 639-1 della lingua (deve coincidere con il nome del file `<code >.json`).
2. **`label`**: sigla breve in maiuscolo (2–3 caratteri) mostrata nella barra superiore dell'interfaccia.
3. **`name`**: nome nativo completo della lingua (usato come `title` e `aria-label` accessibile).
4. **`dir`**: `"ltr"` (da sinistra a destra) oppure `"rtl"` (da destra a sinistra, es. arabo `"ar"`, ebraico `"he"`, persiano `"fa"`). Quando l'utente seleziona una lingua `"rtl"`, `document.documentElement.dir` passa a `"rtl"` mentre i blocchi `.sym` e `<pre>` Lean 4 restano `"ltr"`.
5. **Traduzioni autentiche**: `ui.root` e `ui.home_intro` non devono essere copie non tradotte del file inglese `en.json` (il validatore blocca automaticamente i file lingua lasciati in inglese).

---

### Passo 3 — Rigenera il bundle e valida

Esegui nel terminale:

```bash
npm run sync
npm run validate
```

Cosa succede automaticamente:
- `scripts/build-content.mjs` legge tutti i file `content/i18n/*.json` e li impacchetta in `public/data/bundle.json`.
- L'intestazione dell'applicazione crea automaticamente il pulsante per la nuova lingua senza toccare `src/main.ts`.
- Nei nodi matematici `content/<MSC>/<ID>.json`, puoi aggiungere gradualmente la chiave `"ja"` dentro `title` e `natural`; finché un nodo non ha la traduzione nella nuova lingua, l'interfaccia mostra in modo trasparente il fallback su italiano/inglese.
