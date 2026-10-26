/**
 * src/ai-bridge.ts
 *
 * Modulo AI OPZIONALE e ISOLATO (Ponte NL ↔ Lean 4 e Diagnosi Socratica LeanTutor).
 * Viene caricato solo su richiesta dell'utente (`import('./ai-bridge.ts')`).
 * La chiave API resta esclusivamente sul server (`server.ts`, rotte `/api/*`).
 *
 * REGOLA DI ONESTÀ: Qualsiasi output generato da questo modulo è sempre
 * etichettato come "Generato da AI — NON VERIFICATO (lean.status: none)"
 * finché non viene salvato nel progetto Lake e compilato da Lean 4.
 */

export function renderOptionalAiPanel(
  container: HTMLElement,
  contextNodeId: string,
  contextTitle: string,
  warningText: string
): void {
  container.innerHTML = `
    <div class="box" style="margin-top:16px">
      <div class="st" style="font-weight:600;margin-bottom:8px">
        ⚠️ ${escapeHtml(warningText)}
      </div>
      <p style="margin:4px 0 10px;font-size:14px;color:var(--mut)">
        Questo modulo opzionale interroga il server locale (<code>/api/bridge/formalize</code> o <code>/api/tutor/diagnose</code>).
        Nessun risultato viene aggiunto al grafo né marcato <code>compiled</code> senza verifica formale con <code>lake build</code>.
      </p>
      <div class="bar">
        <select id="ai-mode" style="font:inherit;font-size:14px;padding:3px 8px;border:1px solid var(--ln);background:var(--bg);color:var(--fg)">
          <option value="formalize">Ponte NL ↔ Lean 4 (Bozza di formalizzazione)</option>
          <option value="tutor">Diagnosi prerequisiti LeanTutor (sul nodo ${escapeHtml(contextNodeId || "corrente")})</option>
        </select>
        <button id="ai-run" type="button">Esegui richiesta AI</button>
      </div>
      <textarea id="ai-input" rows="3" style="width:100%;font:inherit;font-size:15px;padding:6px;border:1px solid var(--ln);background:var(--bg);color:var(--fg)" placeholder="Scrivi un enunciato matematico o un passaggio di dimostrazione da analizzare…"></textarea>
      <div id="ai-output" style="margin-top:10px;font-size:14px"></div>
    </div>
  `;

  const runBtn = container.querySelector("#ai-run") as HTMLButtonElement;
  const modeSel = container.querySelector("#ai-mode") as HTMLSelectElement;
  const inputEl = container.querySelector("#ai-input") as HTMLTextAreaElement;
  const outEl = container.querySelector("#ai-output") as HTMLElement;

  runBtn.addEventListener("click", async () => {
    const text = inputEl.value.trim();
    if (!text) return;

    runBtn.disabled = true;
    outEl.innerHTML = `<span class="empty">Elaborazione lato server in corso…</span>`;

    try {
      if (modeSel.value === "formalize") {
        const res = await fetch("/api/bridge/formalize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            statement: text,
            mode: "nl_to_lean",
            language: document.documentElement.lang || "it",
            level: "4",
            style: "rigorous"
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Errore dal server AI");
        const r = data.result;
        outEl.innerHTML = `
          <div class="st" style="margin-bottom:6px">
            Stato formale assegnato: <code>lean.status = "none"</code> · <code>provenance = "ai-assisted"</code> (NON VERIFICATO)
          </div>
          <div class="row"><span>Obiettivo</span><div>${escapeHtml(r.parsedGoal || "")}</div></div>
          <div class="row"><span>Spiegazione</span><div>${escapeHtml(r.deformalizedExplanation || "")}</div></div>
          <div class="row"><span>Bozza Lean 4</span><pre>${escapeHtml(r.leanCode || "")}</pre></div>
        `;
      } else {
        const res = await fetch("/api/tutor/diagnose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nodeTitle: contextTitle || "Teorema",
            nodeUrn: contextNodeId || "11J72.1",
            studentAttempt: text,
            language: document.documentElement.lang || "it",
            level: "4"
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Errore dal server AI");
        const r = data.result;
        outEl.innerHTML = `
          <div class="st" style="margin-bottom:6px">
            Diagnosi generata da AI — NON VERIFICATA dal compilatore Lean 4
          </div>
          <div class="row"><span>Diagnosi</span><div>${escapeHtml(r.diagnosisSummary || "")}</div></div>
          <div class="row"><span>Prerequisito</span><div><code>${escapeHtml(r.missingPrerequisiteUrn || "")}</code> — ${escapeHtml(r.missingPrerequisiteReason || "")}</div></div>
          <div class="row"><span>Suggerimento</span><div>${escapeHtml(r.nextStepHint || "")}</div></div>
        `;
      }
    } catch (err: any) {
      outEl.innerHTML = `<div class="st">Servizio AI non disponibile in modalità statica/offline: ${escapeHtml(err?.message || "errore")}</div>`;
    } finally {
      runBtn.disabled = false;
    }
  });
}

function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] || c));
}
