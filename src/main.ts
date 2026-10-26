/**
 * src/main.ts
 *
 * Applicazione principale di Mathema in Vanilla TypeScript puro.
 * - Zero framework pesanti (niente React/Tailwind/motion nel bundle critico).
 * - Stile visivo e comportamentale di PlanetMath (ispirato a mathema.html).
 * - Separazione totale tra codice e contenuti matematici (`public/data/bundle.json`).
 * - Verifica Lean 4 ONESTA: mostra "COMPILATO" solo quando `lean.status === "compiled"`.
 * - Supporto offline completo tramite Service Worker PWA.
 */

import "./index.css";
import type {
  Attachment,
  GraphEdge,
  GraphNodeSummary,
  LanguagePack,
  LeanBlock,
  MathemaBundle,
  MathemaNode,
  StepNode
} from "./types";

// Stato globale minimale dell'applicazione
let bundle: MathemaBundle;
let lang = "it";
let view: "t" | "g" | "h" = "t"; // t = solo testo, g = solo grafo, h = vista ibrida
let cur = ""; // codice corrente dall'hash dell'URL (es. "11J72.1" o "11J72.1.2.a" o "11")
let targetStepId = ""; // se l'URL punta direttamente a un passo/micro-risultato
const sel: Record<string, boolean> = {}; // codici selezionati dall'utente per il grafo
let kindFilter = "";

// Indice rapido in memoria delle voci dell'albero MSC
interface MscTreeNode {
  code: string;
  official: string;
  title: Record<string, string>;
  parent?: string;
  children: string[];
  nodeIds: string[];
  hasPopulatedDescendant: boolean;
}
const mscTree: Record<string, MscTreeNode> = {};
const rootDisciplines: string[] = [];

// Utilità per l'escaping HTML sicuro
function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] || c));
}

// Restituisce il testo nella lingua corrente, con fallback automatico su IT o EN
function tr(map: Record<string, string> | undefined, fallback = ""): string {
  if (!map) return fallback;
  return map[lang] || map.it || map.en || Object.values(map)[0] || fallback;
}

// Costruisce l'albero gerarchico MSC2020 (63 discipline -> sezioni 3 car -> voci 5 car -> nodi Mathema)
function initMscTree(): void {
  for (const d of bundle.msc2020.disciplines) {
    mscTree[d.code] = {
      code: d.code,
      official: d.official || `${d.code}-XX`,
      title: d.title,
      children: [],
      nodeIds: [],
      hasPopulatedDescendant: false
    };
    rootDisciplines.push(d.code);
  }

  for (const s of bundle.msc2020.sections) {
    mscTree[s.code] = {
      code: s.code,
      official: s.official || s.code,
      title: s.title,
      parent: s.parent,
      children: [],
      nodeIds: [],
      hasPopulatedDescendant: false
    };
    if (s.parent && mscTree[s.parent]) {
      mscTree[s.parent].children.push(s.code);
    }
  }

  for (const e of bundle.msc2020.entries) {
    mscTree[e.code] = {
      code: e.code,
      official: e.code,
      title: e.title,
      parent: e.parent,
      children: [],
      nodeIds: [],
      hasPopulatedDescendant: false
    };
    if (e.parent && mscTree[e.parent]) {
      mscTree[e.parent].children.push(e.code);
    }
  }

  // Collega i nodi matematici (es. 11J72.1) alle rispettive voci MSC a 5 caratteri
  const sortedNodeIds = Object.keys(bundle.nodes).sort();
  for (const id of sortedNodeIds) {
    const node = bundle.nodes[id];
    const mscEntry = mscTree[node.msc];
    if (mscEntry) {
      mscEntry.nodeIds.push(id);
      // Propaga il flag "ha contenuto" verso la radice
      let ptr: MscTreeNode | undefined = mscEntry;
      while (ptr) {
        ptr.hasPopulatedDescendant = true;
        ptr = ptr.parent ? mscTree[ptr.parent] : undefined;
      }
    }
  }
}

// Normalizza il codice proveniente dall'hash URL (es. "#11-XX" -> "11")
function normalizeHashCode(raw: string): { mainCode: string; stepCode: string } {
  const clean = raw.trim().replace(/^#/, "");
  if (!clean) return { mainCode: "", stepCode: "" };
  if (clean === "docs") return { mainCode: "docs", stepCode: "" };

  // Supporta sia "#11-XX" sia "#11"
  const msc2Match = /^([0-9]{2})-XX$/i.exec(clean);
  if (msc2Match && mscTree[msc2Match[1]]) {
    return { mainCode: msc2Match[1], stepCode: "" };
  }

  // Se è un nodo principale (es. 11J72.1)
  if (bundle.nodes[clean]) {
    return { mainCode: clean, stepCode: "" };
  }

  // Se è un passo o micro-risultato (es. 11J72.1.2 o 11J72.1.2.a), risali al nodo principale (es. 11J72.1)
  const parts = clean.split(".");
  if (parts.length >= 3) {
    const candidateNode = `${parts[0]}.${parts[1]}`;
    if (bundle.nodes[candidateNode]) {
      return { mainCode: candidateNode, stepCode: clean };
    }
  }

  return { mainCode: clean, stepCode: "" };
}

// Restituisce l'etichetta onesta dello stato Lean 4
function formatLeanStatusText(lean: LeanBlock, u: LanguagePack["ui"]): string {
  switch (lean.status) {
    case "compiled":
      return u.lean_status_compiled;
    case "unverified":
      return u.lean_status_unverified;
    case "has_sorry":
      return u.lean_status_has_sorry;
    case "statement_only":
      return u.lean_status_statement_only;
    default:
      return u.lean_status_none;
  }
}

// Genera le 3 righe sincronizzate 1:1:1 (Linguaggio naturale · Simbolico · Lean 4)
function renderTripleRows(
  natural: Record<string, string>,
  symbolic: string,
  lean: LeanBlock,
  u: LanguagePack["ui"]
): string {
  const statusText = formatLeanStatusText(lean, u);
  const mathlibInfo =
    lean.mathlib_name && lean.mathlib_name !== "none"
      ? ` · ${esc(u.mathlib_ref)}: <code>${esc(lean.mathlib_name)}</code> (${esc(lean.mathlib_version)})`
      : ` · Mathlib ${esc(lean.mathlib_version)}`;

  return `
    <div class="row">
      <span>${esc(u.rep_natural)}</span>
      <div>${esc(tr(natural))}</div>
    </div>
    <div class="row">
      <span>${esc(u.rep_symbolic)}</span>
      <div class="sym">${esc(symbolic)}</div>
    </div>
    <div class="row">
      <span>${esc(u.rep_lean)}</span>
      <div>
        <div class="st" data-status="${esc(lean.status)}" style="margin-bottom:4px">
          ${esc(u.lean_status_label)}: <b>${esc(statusText)}</b>${mathlibInfo}
        </div>
        <pre><code>${esc(lean.code)}</code></pre>
      </div>
    </div>
  `;
}

// Genera l'HTML ricorsivo per i passaggi e i micro-risultati a comparsa (<details>)
function renderStepDetails(step: StepNode, u: LanguagePack["ui"]): string {
  const isTarget = targetStepId === step.id || (targetStepId && targetStepId.startsWith(step.id + "."));
  const isHighlight = targetStepId === step.id;
  const kindLabel = u.kinds[step.kind] || step.kind;
  const checkedAttr = sel[step.id] ? " checked" : "";
  const openAttr = isTarget ? " open" : "";

  const subHtml = (step.substeps || []).map((sub) => renderStepDetails(sub, u)).join("");

  return `
    <details id="step-${esc(step.id)}" data-c="${esc(step.id)}" class="${isHighlight ? "step-highlight" : ""}"${openAttr}>
      <summary>
        <span class="code">${esc(step.id)} · ${esc(kindLabel)}</span>
        <b>${esc(tr(step.title))}</b>
        <span class="st" data-status="${esc(step.lean.status)}">[${esc(step.lean.status)}]</span>
        <label>
          <input type="checkbox" data-s="${esc(step.id)}"${checkedAttr} />
          ${esc(u.select_step)}
        </label>
      </summary>
      ${renderTripleRows(step.natural, step.symbolic, step.lean, u)}
      ${
        step.deps && step.deps.length
          ? `<div style="font-size:13px;color:var(--mut);padding:4px 0">
              ${esc(u.deps_heading)}: ${step.deps
                .map((d) => `<a href="#${esc(d.id)}"><code>${esc(d.id)}</code></a> (${esc(u.dep_types[d.type] || d.type)})`)
                .join(", ")}
            </div>`
          : ""
      }
      <div style="font-size:12px;color:var(--mut);padding:2px 0">
        Invariante I2 (<code>missing</code>): <code>${esc(
          step.missing && step.missing.length > 0 ? step.missing.join(", ") : "nessuno"
        )}</code>${step.lean.hash ? ` · sha256: <code>${esc(step.lean.hash.slice(0, 12))}…</code>` : ""}
      </div>
      ${subHtml}
    </details>
  `;
}

// Genera il percorso briciole di pane (breadcrumb)
function renderBreadcrumbs(code: string, u: LanguagePack["ui"]): string {
  if (!code) return `<span>${esc(u.root)}</span>`;
  const baseMsc = code.split(".")[0];
  const chain: string[] = [];

  if (mscTree[baseMsc]) {
    let ptr: MscTreeNode | undefined = mscTree[baseMsc];
    while (ptr) {
      chain.unshift(ptr.code);
      ptr = ptr.parent ? mscTree[ptr.parent] : undefined;
    }
  } else {
    const d2 = baseMsc.slice(0, 2);
    const s3 = baseMsc.slice(0, 3);
    const e5 = baseMsc.slice(0, 5);
    for (const cand of [d2, s3, e5]) {
      if (mscTree[cand]) chain.push(cand);
    }
  }

  let html = `<a href="#">${esc(u.root)}</a>`;
  for (const c of chain) {
    const label = mscTree[c]?.official || c;
    html += ` › <a href="#${esc(c)}">${esc(label)}</a>`;
  }
  if (code.includes(".")) {
    html += ` › <a href="#${esc(code)}">${esc(code)}</a>`;
  }
  return html;
}

// Raccoglie i nodi del sottografo selezionato (o del nodo/sezione corrente) e li disegna per livelli (DAG stratificato)
function renderStratifiedGraph(container: HTMLElement, contextCode: string, u: LanguagePack["ui"]): void {
  const selectedIds = Object.keys(sel)
    .filter((k) => sel[k])
    .map((k) => k.replace(/-XX$/i, ""));
  const normContext = contextCode.replace(/-XX$/i, "");
  const allGraphNodes = bundle.graph.nodes;
  const allGraphEdges = bundle.graph.edges;

  let activeSet = new Set<string>();

  if (selectedIds.length > 0) {
    // Include tutti i nodi selezionati (e se è selezionata una sezione MSC es. 11 o 11-XX, tutti i nodi in quella sezione)
    for (const sId of selectedIds) {
      for (const gn of allGraphNodes) {
        if (gn.id === sId || gn.id.startsWith(sId + ".") || gn.msc.startsWith(sId)) {
          activeSet.add(gn.id);
        }
      }
    }
    // Includi anche le dipendenze dirette per mostrare i collegamenti completi
    for (const edge of allGraphEdges) {
      if (activeSet.has(edge.to)) activeSet.add(edge.from);
    }
  } else if (normContext && normContext !== "docs") {
    // Nessuna casella spuntata: proietta il nodo corrente o la sezione MSC corrente
    for (const gn of allGraphNodes) {
      if (gn.id === normContext || gn.id.startsWith(normContext + ".") || gn.msc.startsWith(normContext)) {
        activeSet.add(gn.id);
      }
    }
    for (const edge of allGraphEdges) {
      if (activeSet.has(edge.to) || activeSet.has(edge.from)) {
        if (contextCode.includes(".")) {
          activeSet.add(edge.from);
          activeSet.add(edge.to);
        }
      }
    }
  } else {
    // Vista globale: mostra tutti i nodi principali (e passi se pochi)
    for (const gn of allGraphNodes) {
      activeSet.add(gn.id);
    }
  }

  const nodes = allGraphNodes.filter((n) => activeSet.has(n.id));
  if (nodes.length === 0) {
    container.innerHTML = `<p class="empty">${esc(u.empty_section)}</p>`;
    return;
  }

  const byId: Record<string, GraphNodeSummary> = {};
  for (const n of nodes) byId[n.id] = n;

  const edges = allGraphEdges.filter((e) => byId[e.from] && byId[e.to]);

  // Calcolo deterministico del livello topologico O(V + E) (senza fisica continua)
  const incoming: Record<string, string[]> = {};
  for (const n of nodes) incoming[n.id] = [];
  for (const e of edges) {
    if (e.from !== e.to) incoming[e.to].push(e.from);
  }

  const level: Record<string, number> = {};
  const visiting = new Set<string>();
  function computeLevel(id: string): number {
    if (level[id] !== undefined) return level[id];
    if (visiting.has(id)) return 0; // guardia contro cicli
    visiting.add(id);
    let maxPred = -1;
    for (const pred of incoming[id] || []) {
      maxPred = Math.max(maxPred, computeLevel(pred));
    }
    visiting.delete(id);
    level[id] = maxPred + 1;
    return level[id];
  }

  for (const n of nodes) computeLevel(n.id);

  const cols: Record<number, GraphNodeSummary[]> = {};
  for (const n of nodes) {
    const lv = level[n.id] || 0;
    if (!cols[lv]) cols[lv] = [];
    cols[lv].push(n);
  }

  const pos: Record<string, { x: number; y: number }> = {};
  const boxW = 168;
  const boxH = 44;
  const colGap = 205;
  const rowGap = 62;
  let maxW = 0;
  let maxH = 0;

  for (const lvKey of Object.keys(cols).map(Number).sort((a, b) => a - b)) {
    const colNodes = cols[lvKey];
    colNodes.forEach((n, idx) => {
      const x = 16 + lvKey * colGap;
      const y = 16 + idx * rowGap;
      pos[n.id] = { x, y };
      maxW = Math.max(maxW, x + boxW + 16);
      maxH = Math.max(maxH, y + boxH + 16);
    });
  }

  let svg = `<div style="font-size:13px;color:var(--mut);margin-bottom:8px">
    Nodi nel sottografo: <b>${nodes.length}</b> · Archi: <b>${edges.length}</b> · Clicca su un rettangolo per aprire il nodo.
  </div>`;
  svg += `<svg viewBox="0 0 ${maxW} ${maxH}" width="${maxW}" height="${maxH}" role="img" aria-label="Grafo delle dipendenze matematiche">
    <defs>
      <marker id="ar-req" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <path d="M0,0L8,4L0,8" style="fill:var(--ac);stroke:none"/>
      </marker>
      <marker id="ar-part" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <path d="M0,0L8,4L0,8" style="fill:var(--mut);stroke:none"/>
      </marker>
    </defs>`;

  for (const e of edges) {
    const a = pos[e.from];
    const b = pos[e.to];
    if (!a || !b) continue;
    const isLogical = e.type !== "part_of";
    const dash = e.type === "alternative_proof_of" ? ' stroke-dasharray="4,3"' : "";
    const strokeColor = isLogical ? "var(--ac)" : "var(--mut)";
    const marker = isLogical ? "url(#ar-req)" : "url(#ar-part)";
    svg += `<path d="M${a.x + boxW},${a.y + boxH / 2} L${b.x},${b.y + boxH / 2}" style="stroke:${strokeColor};stroke-width:${isLogical ? 1.5 : 1};fill:none"${dash} marker-end="${marker}">
      <title>${esc(e.from)} → ${esc(e.to)} (${esc(u.dep_types[e.type] || e.type)})</title>
    </path>`;
  }

  for (const n of nodes) {
    const p = pos[n.id];
    const titleStr = tr(n.title);
    const shortTitle = titleStr.length > 22 ? titleStr.slice(0, 21) + "…" : titleStr;
    const isCurrent = n.id === cur || n.id === targetStepId;
    const strokeStyle = isCurrent
      ? "stroke:var(--ok);stroke-width:2.2"
      : n.leanStatus === "compiled"
        ? "stroke:var(--ac);stroke-width:1.4"
        : "stroke:var(--mut);stroke-width:1";

    svg += `<a href="#${esc(n.id)}">
      <g style="cursor:pointer">
        <title>${esc(n.id)} — ${esc(titleStr)} [Lean: ${esc(n.leanStatus)}]</title>
        <rect x="${p.x}" y="${p.y}" width="${boxW}" height="${boxH}" rx="3" style="${strokeStyle}"/>
        <text x="${p.x + 8}" y="${p.y + 17}" style="font-weight:bold">${esc(n.id)} [${esc(n.leanStatus === "compiled" ? "✓" : n.leanStatus === "has_sorry" ? "sorry" : "stmt")}]</text>
        <text x="${p.x + 8}" y="${p.y + 34}">${esc(shortTitle)}</text>
      </g>
    </a>`;
  }

  svg += `</svg>`;
  container.innerHTML = svg;
}

// Renderizza gli allegati (SVG inline, grafici 2D e scene 3D caricate su richiesta)
function renderAttachmentsSection(attachments: Attachment[], u: LanguagePack["ui"]): string {
  if (!attachments || attachments.length === 0) return "";

  const cards = attachments
    .map((att) => {
      let body = "";
      if (att.kind === "svg" && att.svg) {
        body = `<div class="svg-holder">${att.svg}</div>`;
      } else if (att.kind === "plot2d" && att.preset) {
        body = `<div class="plot2d-holder" data-preset2d="${esc(att.preset)}"></div>`;
      } else if (att.kind === "scene3d" && att.preset) {
        body = `
          <div class="scene3d-holder" data-preset3d="${esc(att.preset)}">
            <button type="button" class="load-3d-btn" data-preset="${esc(att.preset)}">
              ${esc(u.load_3d_button)}
            </button>
          </div>
        `;
      }

      return `
        <figure class="figure-card" id="att-${esc(att.id)}">
          <div style="font-weight:600;margin-bottom:6px">${esc(tr(att.title))}</div>
          ${body}
          <figcaption>${esc(tr(att.caption))}</figcaption>
        </figure>
      `;
    })
    .join("");

  return `
    <h2>${esc(u.attachments_heading)}</h2>
    ${cards}
  `;
}

// Pagina di documentazione integrata (Invarianti I1-I9, Sequenza stati A-H, Schema JSON congelato, Verifica Lean)
function renderDocsPage(u: LanguagePack["ui"]): string {
  return `
    <div class="crumb"><a href="#">${esc(u.root)}</a> › Guida, Invarianti I1–I9 e Architettura</div>
    <h1>Architettura di mathema — Invarianti (I1–I9) e Stati del Repository</h1>
    <p>${esc(bundle.msc2020.extension_policy)}</p>

    <h2>1. Gli Invarianti (I1–I9 — verificati da <code>npm run validate</code>)</h2>
    <ul class="meta-list" style="color:var(--fg);line-height:1.7">
      <li><b>I1 — Onestà formale binaria</b>: <code>lean.status = "compiled"</code> esiste SOLO se esiste il binario compilato <code>.olean</code> in <code>lean/.lake/build/lib/</code>. Senza <code>.olean</code>, il codice privo di <code>sorry</code> è marcato <code>unverified</code>.</li>
      <li><b>I2 — Tripla rappresentazione e campo <code>missing</code></b>: ogni nodo e passo possiede <code>natural</code>, <code>symbolic</code> e <code>lean</code>, più l'array obbligatorio <code>missing: [...]</code> che dichiara esplicitamente qualsiasi traduzione o prova incompleta.</li>
      <li><b>I3 — Gerarchia MSC2020 + suffisso <code>mathema</code></b>: ogni nodo appartiene a una voce ufficiale MSC2020 a 5 caratteri in <code>content/msc2020.json</code> con estensione numerata documentata (<code>11J72.1.2.a</code>).</li>
      <li><b>I4 — Lingue disaccoppiate dal codice</b>: aggiungere una lingua = 1 file in <code>content/i18n/&lt;lang&gt;.json</code> (10 lingue attive: <code>it, en, es, fr, de, pt, ar, zh, hi, ru</code>).</li>
      <li><b>I5 — Nodi disaccoppiati dal codice</b>: aggiungere un nodo = 1 file in <code>content/&lt;MSC&gt;/&lt;id&gt;.json</code> conforme a <code>schema/node.schema.json</code>.</li>
      <li><b>I6 — Bundle critico &lt; 50 KB gzip</b>: zero dipendenze runtime nel bundle principale (~9 KB gzip); <code>viewer3d.ts</code> e <code>ai-bridge.ts</code> caricati solo con <code>import()</code> dinamico.</li>
      <li><b>I7 — Zero tracciamento</b>: nessun login, cookie di profilazione, analytics o stato utente persistente.</li>
      <li><b>I8 — Identificatori Mathlib reali</b>: ogni <code>lean.mathlib_name</code> è verificato contro <code>schema/mathlib-registry.json</code> o marcato <code>"none"</code>.</li>
      <li><b>I9 — PWA Offline + GitHub Pages</b>: tutti gli asset usano percorsi relativi (<code>base: './'</code>) compatibili con sottocartelle GitHub Pages e modalità offline.</li>
    </ul>

    <h2>2. Stati di verifica Lean 4 (5 stati distinti)</h2>
    <ul class="meta-list" style="color:var(--fg);line-height:1.7">
      <li><code>compiled</code>: zero <code>sorry</code> e file binario <code>.olean</code> presente in <code>lean/.lake/build/lib/</code> dopo <code>lake build</code>.</li>
      <li><code>unverified</code>: codice Lean 4 completo e privo di <code>sorry</code>, in attesa di compilazione con <code>lake build</code> (stato onesto predefinito).</li>
      <li><code>has_sorry</code>: struttura della dimostrazione presente ma almeno un passaggio contiene <code>sorry</code>.</li>
      <li><code>statement_only</code>: presente solo l'enunciato formale o il riferimento a Mathlib (<code>#check</code>).</li>
      <li><code>none</code>: nessuna formalizzazione Lean verificata (incluso qualsiasi output generato da AI).</li>
    </ul>

    <h2>3. Documenti di Governance del Repository</h2>
    <ul class="meta-list" style="color:var(--fg);line-height:1.7">
      <li><code>docs/invariants.md</code> — Le 9 regole inviolabili e il protocollo anti-deriva per sessioni LLM.</li>
      <li><code>docs/adding-a-node.md</code> — Procedura passo-passo per aggiungere un nodo in <code>content/&lt;MSC&gt;/</code>.</li>
      <li><code>docs/adding-a-language.md</code> — Procedura per aggiungere o completare una lingua in <code>content/i18n/</code>.</li>
      <li><code>docs/section-template.md</code> — Template standard per l'espansione di una voce MSC2020 a 5 caratteri (Fase F).</li>
      <li><code>schema/node.schema.json</code> — Schema JSON congelato (Fase C) con supporto <code>missing[]</code> e <code>formalization_yaml.comparator_setup</code> (standard Palomar / <code>lean4checker</code>).</li>
    </ul>
  `;
}

// Renderizza il contenuto principale in base alla rotta corrente (`cur`)
function renderMain(): void {
  const langPack = bundle.languages[lang] || bundle.languages.it;
  const u = langPack.ui;

  document.documentElement.lang = lang;
  document.documentElement.dir = langPack.dir;

  const qInput = document.getElementById("q") as HTMLInputElement;
  if (qInput) qInput.placeholder = u.search_placeholder;

  const vtBtn = document.getElementById("vt");
  const vgBtn = document.getElementById("vg");
  const vhBtn = document.getElementById("vh");
  if (vtBtn) {
    vtBtn.textContent = u.view_text;
    vtBtn.setAttribute("aria-pressed", String(view === "t"));
  }
  if (vgBtn) {
    vgBtn.textContent = u.view_graph;
    vgBtn.setAttribute("aria-pressed", String(view === "g"));
  }
  if (vhBtn) {
    vhBtn.textContent = u.view_hybrid;
    vhBtn.setAttribute("aria-pressed", String(view === "h"));
  }

  const mainEl = document.getElementById("main") as HTMLElement;
  mainEl.className = view === "h" ? "hybrid-main" : "";

  if (cur === "docs") {
    mainEl.innerHTML = renderDocsPage(u);
    renderNav();
    return;
  }

  const node: MathemaNode | undefined = bundle.nodes[cur];

  // Caso 1: Pagina iniziale (radice MSC2020)
  if (!cur) {
    const starterCards = ["11J72.1", "11A41.1", "11A51.1"]
      .map((id) => {
        const n = bundle.nodes[id];
        if (!n) return "";
        return `
          <li>
            <a href="#${esc(n.id)}"><span class="code">${esc(n.id)}</span> <b>${esc(tr(n.title))}</b></a>
            <span class="st" data-status="${esc(n.lean.status)}"> [${esc(n.lean.status)} · ${esc(n.lean.mathlib_name || "")}]</span>
            <div style="font-size:15px;color:var(--mut);margin:2px 0 8px">${esc(tr(n.natural))}</div>
          </li>
        `;
      })
      .join("");

    let bodyHtml = `
      <div class="crumb">${esc(u.root)} · <a href="#docs">${esc(u.docs_link)}</a></div>
      <h1>mathema</h1>
      <p style="margin:6px 0 14px">${esc(u.home_intro)}</p>
      <div class="bar">
        <button type="button" id="home-graph-btn">${esc(u.show_graph_selection)}</button>
        <a href="#docs"><button type="button">${esc(u.docs_link)}</button></a>
      </div>
      <h2>${esc(u.home_start_nodes)}</h2>
      <ul style="padding-left:18px">${starterCards}</ul>
    `;

    if (view === "g") {
      bodyHtml += `<h2>${esc(u.view_graph)}</h2><div class="box" id="gv"></div>`;
      mainEl.innerHTML = bodyHtml;
    } else if (view === "h") {
      mainEl.innerHTML = `<div class="hybrid-grid"><div>${bodyHtml}</div><div><h2>${esc(u.view_graph)}</h2><div class="box" id="gv"></div></div></div>`;
    } else {
      mainEl.innerHTML = bodyHtml;
    }

    const gv = document.getElementById("gv");
    if (gv) renderStratifiedGraph(gv, "", u);
    const hgBtn = document.getElementById("home-graph-btn");
    if (hgBtn) {
      hgBtn.onclick = () => {
        view = "g";
        renderMain();
      };
    }
    renderNav();
    return;
  }

  // Caso 2: Nodo matematico (es. 11J72.1, 11A41.1, 11A51.1)
  if (node) {
    const kindLabel = u.kinds[node.kind] || node.kind;
    const statusText = formatLeanStatusText(node.lean, u);

    // Cerca eventuali dimostrazioni alternative o collegate per la stessa voce
    const relatedProofs = Object.values(bundle.nodes).filter(
      (other) =>
        other.id !== node.id &&
        (other.deps.some((d) => d.id === node.id && d.type === "alternative_proof_of") ||
          node.deps.some((d) => d.id === other.id && d.type === "alternative_proof_of"))
    );

    const selectedCount = Object.keys(sel).filter((k) => sel[k]).length;

    const textColumnHtml = `
      <div class="crumb">${renderBreadcrumbs(node.id, u)}</div>
      <div class="code">${esc(node.id)} · ${esc(kindLabel)} · <span title="${esc(u.msc_extension_note)}">MSC ${esc(node.msc)}</span></div>
      <h1>${esc(tr(node.title))}</h1>

      <div class="lean-banner" data-status="${esc(node.lean.status)}">
        <b>${esc(u.lean_status_label)}:</b> ${esc(statusText)}
        ${node.lean.mathlib_name ? ` · <b>${esc(u.mathlib_ref)}:</b> <code>${esc(node.lean.mathlib_name)}</code>` : ""}
        ${node.lean.lean_file ? ` · File: <code>${esc(node.lean.lean_file)}</code>` : ""}
        ${node.lean.verified_at ? ` · ${esc(u.verified_at)}: <code>${esc(node.lean.verified_at.slice(0, 10))}</code>` : ""}
      </div>

      <div class="bar">
        <button type="button" id="ea">${esc(u.expand_all)}</button>
        <button type="button" id="ca">${esc(u.collapse_all)}</button>
        <button type="button" id="gb">${esc(u.show_graph_selection)}${selectedCount ? ` (${selectedCount})` : ""}</button>
        ${selectedCount ? `<button type="button" id="clr-sel">${esc(u.clear_selection)}</button>` : ""}
        <button type="button" id="ai-btn">${esc(u.ai_tools_button)}</button>
      </div>

      ${renderTripleRows(node.natural, node.symbolic, node.lean, u)}

      ${
        node.deps.length > 0
          ? `<div style="font-size:14px;margin:8px 0">
              <b>${esc(u.deps_heading)}:</b>
              ${node.deps
                .map((d) => `<a href="#${esc(d.id)}"><code>${esc(d.id)}</code></a> (${esc(u.dep_types[d.type] || d.type)})`)
                .join(" · ")}
            </div>`
          : ""
      }

      ${
        relatedProofs.length > 0
          ? `<div style="font-size:14px;margin:8px 0">
              <b>${esc(u.alt_proofs_heading)}:</b>
              ${relatedProofs
                .map((p) => `<a href="#${esc(p.id)}"><code>${esc(p.id)}</code> ${esc(tr(p.title))}</a>`)
                .join(" · ")}
            </div>`
          : ""
      }

      <h2>${esc(u.steps_heading)} (${node.steps.length})</h2>
      <div id="steps-container">
        ${node.steps.map((s) => renderStepDetails(s, u)).join("")}
      </div>

      ${renderAttachmentsSection(node.attachments, u)}

      <div id="ai-container"></div>

      <h2>${esc(u.sources_heading)}</h2>
      <ul class="meta-list">
        ${node.sources
          .map(
            (s) =>
              `<li><b>${esc(s.title)}</b> — ${esc(s.citation)} (${esc(s.license_note)})${
                s.url ? ` · <a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">Mathlib Docs</a>` : ""
              }</li>`
          )
          .join("")}
        <li>Licenza nodo: <code>${esc(node.license)}</code> · Provenienza: <code>${esc(node.provenance)}</code> · Revisionato da: ${esc(
          node.reviewed_by.join(", ")
        )}</li>
        ${
          node.formalization_yaml?.comparator_setup
            ? `<li>Comparator setup (Palomar / <code>lean4checker</code>): target <code>${esc(
                node.formalization_yaml.target_theorem
              )}</code> · toolchain <code>${esc(
                node.formalization_yaml.comparator_setup.lean_toolchain
              )}</code> · assiomi ammessi: <code>${esc(
                node.formalization_yaml.comparator_setup.permitted_axioms.join(", ")
              )}</code></li>`
            : ""
        }
        ${
          node.lean.hash
            ? `<li>Hash SHA-256 blocco Lean (Invariante I1 / Fase C): <code>${esc(node.lean.hash.slice(0, 16))}…</code></li>`
            : ""
        }
        <li>Invariante I2 (<code>missing</code>): <code>${esc(
          node.missing && node.missing.length > 0 ? node.missing.join(", ") : "nessuno (IT/EN completi)"
        )}</code></li>
        <li>${esc(u.msc_extension_note)}</li>
      </ul>
    `;

    if (view === "g") {
      mainEl.innerHTML = `
        <div class="crumb">${renderBreadcrumbs(node.id, u)}</div>
        <div class="code">${esc(node.id)} · ${esc(kindLabel)}</div>
        <h1>${esc(tr(node.title))}</h1>
        <div class="bar">
          <button type="button" id="back-text">${esc(u.view_text)}</button>
          ${selectedCount ? `<button type="button" id="clr-sel">${esc(u.clear_selection)}</button>` : ""}
        </div>
        <div class="box" id="gv"></div>
      `;
    } else if (view === "h") {
      mainEl.innerHTML = `
        <div class="hybrid-grid">
          <div>${textColumnHtml}</div>
          <div style="position:sticky;top:16px">
            <h2>${esc(u.view_graph)}</h2>
            <div class="box" id="gv"></div>
          </div>
        </div>
      `;
    } else {
      mainEl.innerHTML = textColumnHtml;
    }

    wireNodeInteractions(node, u);
    const gv = document.getElementById("gv");
    if (gv) renderStratifiedGraph(gv, node.id, u);
    renderNav();

    // Se l'URL puntava a un passo specifico (es. #11J72.1.2.a), scorri fino ad esso
    if (targetStepId) {
      const stepEl = document.getElementById(`step-${targetStepId}`);
      if (stepEl) stepEl.scrollIntoView({ block: "center" });
    }
    return;
  }

  // Caso 3: Sezione o disciplina MSC2020 (es. "11", "11A", "11A41")
  const mscItem = mscTree[cur];
  if (mscItem) {
    const childLinks = mscItem.children
      .map((cCode) => {
        const cItem = mscTree[cCode];
        return `<li><a href="#${esc(cCode)}" class="${cItem.hasPopulatedDescendant ? "has" : ""}"><span class="code">${esc(
          cItem.official
        )}</span> ${esc(tr(cItem.title))}</a></li>`;
      })
      .join("");

    const nodeLinks = mscItem.nodeIds
      .map((nId) => {
        const n = bundle.nodes[nId];
        return `<li>
          <a href="#${esc(n.id)}"><span class="code">${esc(n.id)}</span> <b>${esc(tr(n.title))}</b></a>
          <span class="st" data-status="${esc(n.lean.status)}">[Lean: ${esc(n.lean.status)}]</span>
          <div style="font-size:14px;color:var(--mut)">${esc(tr(n.natural))}</div>
        </li>`;
      })
      .join("");

    const hasSubgraphNodes = bundle.graph.nodes.some((gn) => gn.msc.startsWith(mscItem.code));

    const secTextHtml = `
      <div class="crumb">${renderBreadcrumbs(mscItem.code, u)}</div>
      <div class="code">MSC2020 · ${esc(mscItem.official)}</div>
      <h1>${esc(tr(mscItem.title))}</h1>
      <div class="bar">
        <label style="font-size:14px;cursor:pointer">
          <input type="checkbox" id="sel-msc-sec" ${sel[mscItem.code] ? "checked" : ""} />
          ${esc(u.select_node)} (${esc(mscItem.official)})
        </label>
        ${hasSubgraphNodes ? `<button type="button" id="sec-graph-btn">${esc(u.show_graph_selection)}</button>` : ""}
      </div>
      ${childLinks ? `<h2>Sotto-sezioni MSC2020</h2><ul>${childLinks}</ul>` : ""}
      ${nodeLinks ? `<h2>Proposizioni, lemmi e dimostrazioni (${mscItem.nodeIds.length})</h2><ul>${nodeLinks}</ul>` : ""}
      ${!childLinks && !nodeLinks ? `<p class="empty">${esc(u.empty_section)}</p>` : ""}
    `;

    if (view === "g") {
      mainEl.innerHTML = `
        <div class="crumb">${renderBreadcrumbs(mscItem.code, u)}</div>
        <div class="code">MSC2020 · ${esc(mscItem.official)}</div>
        <h1>${esc(tr(mscItem.title))}</h1>
        <div class="bar">
          <button type="button" id="sec-back-text">${esc(u.view_text)}</button>
        </div>
        <div class="box" id="gv"></div>
      `;
    } else if (view === "h") {
      mainEl.innerHTML = `
        <div class="hybrid-grid">
          <div>${secTextHtml}</div>
          <div style="position:sticky;top:16px">
            <h2>Grafo della sezione ${esc(mscItem.official)}</h2>
            <div class="box" id="gv"></div>
          </div>
        </div>
      `;
    } else {
      mainEl.innerHTML = `
        ${secTextHtml}
        ${hasSubgraphNodes ? `<h2>Grafo della sezione ${esc(mscItem.official)}</h2><div class="box" id="gv"></div>` : ""}
      `;
    }

    const secCheck = document.getElementById("sel-msc-sec") as HTMLInputElement | null;
    if (secCheck) {
      secCheck.onchange = () => {
        if (secCheck.checked) sel[mscItem.code] = true;
        else delete sel[mscItem.code];
        renderMain();
      };
    }
    const secGraphBtn = document.getElementById("sec-graph-btn");
    if (secGraphBtn) {
      secGraphBtn.onclick = () => {
        view = "g";
        renderMain();
      };
    }
    const secBackText = document.getElementById("sec-back-text");
    if (secBackText) {
      secBackText.onclick = () => {
        view = "t";
        renderMain();
      };
    }
    const gv = document.getElementById("gv");
    if (gv) renderStratifiedGraph(gv, mscItem.code, u);
    renderNav();
    return;
  }

  // Fallback per codice non trovato
  mainEl.innerHTML = `
    <div class="crumb">${renderBreadcrumbs(cur, u)}</div>
    <div class="code">${esc(cur)}</div>
    <h1>${esc(cur)}</h1>
    <p class="empty">${esc(u.empty_section)}</p>
  `;
  renderNav();
}

// Collega gli eventi nella pagina di un nodo (espandi/comprimi, checkbox grafo, lazy load 2D/3D e AI)
function wireNodeInteractions(node: MathemaNode, u: LanguagePack["ui"]): void {
  const mainEl = document.getElementById("main")!;

  mainEl.querySelectorAll<HTMLInputElement>("input[data-s]").forEach((inp) => {
    inp.addEventListener("click", (ev) => ev.stopPropagation());
    inp.addEventListener("change", () => {
      const code = inp.dataset.s!;
      if (inp.checked) sel[code] = true;
      else delete sel[code];
      const gv = document.getElementById("gv");
      if (gv) renderStratifiedGraph(gv, node.id, u);
    });
  });

  const ea = document.getElementById("ea");
  if (ea) {
    ea.onclick = () => {
      mainEl.querySelectorAll("details").forEach((d) => (d.open = true));
    };
  }
  const ca = document.getElementById("ca");
  if (ca) {
    ca.onclick = () => {
      mainEl.querySelectorAll("details").forEach((d) => (d.open = false));
    };
  }
  const gb = document.getElementById("gb");
  if (gb) {
    gb.onclick = () => {
      view = view === "t" ? "h" : "g";
      renderMain();
    };
  }
  const backText = document.getElementById("back-text");
  if (backText) {
    backText.onclick = () => {
      view = "t";
      renderMain();
    };
  }
  const clrSel = document.getElementById("clr-sel");
  if (clrSel) {
    clrSel.onclick = () => {
      for (const k of Object.keys(sel)) delete sel[k];
      renderMain();
    };
  }

  // Lazy load automatico per i grafici 2D presenti nella pagina
  const plot2dHolders = mainEl.querySelectorAll<HTMLElement>("[data-preset2d]");
  if (plot2dHolders.length > 0) {
    import("./viewer3d").then((mod) => {
      plot2dHolders.forEach((holder) => {
        const preset = holder.dataset.preset2d || "";
        mod.render2DPlot(holder, preset);
      });
    });
  }

  // Lazy load SU RICHIESTA (click utente) per le scene 3D
  mainEl.querySelectorAll<HTMLButtonElement>(".load-3d-btn").forEach((btn) => {
    btn.onclick = async () => {
      const preset = btn.dataset.preset || "";
      const holder = btn.parentElement!;
      btn.disabled = true;
      btn.textContent = "Caricamento modulo 3D…";
      const mod = await import("./viewer3d");
      mod.mountInteractive3DScene(holder, preset);
    };
  });

  // Lazy load SU RICHIESTA per il pannello AI opzionale
  const aiBtn = document.getElementById("ai-btn");
  const aiContainer = document.getElementById("ai-container");
  if (aiBtn && aiContainer) {
    aiBtn.onclick = async () => {
      if (aiContainer.innerHTML.trim() !== "") {
        aiContainer.innerHTML = "";
        return;
      }
      const mod = await import("./ai-bridge");
      mod.renderOptionalAiPanel(aiContainer, node.id, tr(node.title), u.ai_unverified_warning);
    };
  }
}

// Renderizza l'albero laterale MSC2020 (tutte le 63 discipline + espansione gerarchica sul ramo attivo)
function renderNav(): void {
  const navEl = document.getElementById("nav");
  if (!navEl) return;

  function renderMscLi(code: string): string {
    const item = mscTree[code];
    if (!item) return "";
    const hasContent = item.hasPopulatedDescendant;
    const isCurrent = cur === code;
    const isOpen = Boolean(cur && (cur === code || cur.startsWith(code)));

    const cls = `${hasContent ? "has" : ""}${isCurrent ? " cur" : ""}`.trim();
    let html = `<li>
      <div class="nav-item">
        <a class="${cls}" href="#${esc(code)}"><code>${esc(item.code)}</code>${esc(tr(item.title))}</a>
      </div>`;

    if (isOpen && (item.children.length > 0 || item.nodeIds.length > 0)) {
      html += `<ul>`;
      for (const childCode of item.children) {
        html += renderMscLi(childCode);
      }
      for (const nodeId of item.nodeIds) {
        const n = bundle.nodes[nodeId];
        if (kindFilter && n.kind !== kindFilter) continue;
        const nCur = cur === nodeId ? " cur" : "";
        html += `<li><a class="has${nCur}" href="#${esc(nodeId)}"><code>${esc(nodeId)}</code>${esc(tr(n.title))}</a></li>`;
      }
      html += `</ul>`;
    }

    html += `</li>`;
    return html;
  }

  navEl.innerHTML = `<ul>${rootDisciplines.map((c) => renderMscLi(c)).join("")}</ul>`;
}

// Costruisce dinamicamente i pulsanti delle lingue caricate da `content/i18n/*.json`
function renderLanguageButtons(): void {
  const bar = document.getElementById("lang-bar");
  if (!bar) return;
  const codes = Object.keys(bundle.languages).sort((a, b) => (a === "it" ? -1 : b === "it" ? 1 : a.localeCompare(b)));
  bar.innerHTML = codes
    .map((c) => {
      const lp = bundle.languages[c];
      return `<button type="button" data-lang="${esc(c)}" aria-pressed="${c === lang}" title="${esc(lp.name)}">${esc(lp.label)}</button>`;
    })
    .join(" ");

  bar.querySelectorAll<HTMLButtonElement>("button[data-lang]").forEach((btn) => {
    btn.onclick = () => {
      lang = btn.dataset.lang!;
      renderLanguageButtons();
      renderMain();
    };
  });
}

// Configura la ricerca locale istantanea (nessun server richiesto)
function initSearch(): void {
  const qInput = document.getElementById("q") as HTMLInputElement;
  const kindSel = document.getElementById("kind-filter") as HTMLSelectElement;
  const dropdown = document.getElementById("search-results") as HTMLElement;

  const runSearch = () => {
    const q = qInput.value.trim().toLowerCase();
    kindFilter = kindSel.value;

    if (!q && !kindFilter) {
      dropdown.hidden = true;
      dropdown.innerHTML = "";
      renderNav();
      return;
    }

    const matches = bundle.searchIndex
      .filter((hit) => {
        if (kindFilter && hit.kind !== kindFilter) return false;
        if (!q) return true;
        return hit.id.toLowerCase().startsWith(q) || hit.keywords.includes(q);
      })
      .slice(0, 18);

    if (matches.length === 0) {
      dropdown.hidden = true;
      return;
    }

    dropdown.innerHTML = matches
      .map(
        (m) => `
        <a href="#${esc(m.id)}" role="option">
          <span class="code">${esc(m.official || m.id)}</span>
          <b>${esc(tr(m.title))}</b>
          ${m.leanStatus ? `<span class="st" data-status="${esc(m.leanStatus)}"> [${esc(m.leanStatus)}]</span>` : ""}
        </a>
      `
      )
      .join("");
    dropdown.hidden = false;
  };

  qInput.addEventListener("input", runSearch);
  kindSel.addEventListener("change", () => {
    runSearch();
    renderNav();
  });

  qInput.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") {
      dropdown.hidden = true;
      qInput.blur();
    } else if (ev.key === "Enter") {
      const firstLink = dropdown.querySelector("a") as HTMLAnchorElement | null;
      if (firstLink) {
        location.hash = firstLink.getAttribute("href")!;
        dropdown.hidden = true;
      }
    }
  });

  document.addEventListener("click", (ev) => {
    if (!dropdown.contains(ev.target as Node) && ev.target !== qInput) {
      dropdown.hidden = true;
    }
  });
}

// Configura il pulsante di installazione PWA e il rilevamento offline
function initPwaAndOffline(): void {
  const installBtn = document.getElementById("pwa-install-btn") as HTMLButtonElement;
  const iosModal = document.getElementById("ios-pwa-modal") as HTMLElement;
  const iosClose = document.getElementById("ios-pwa-close") as HTMLButtonElement;
  const offlineBanner = document.getElementById("offline-banner") as HTMLElement;

  let deferredPrompt: any = null;
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  if (!isStandalone && isIOS) {
    installBtn.hidden = false;
    installBtn.onclick = () => {
      iosModal.hidden = false;
    };
  }

  iosClose.onclick = () => {
    iosModal.hidden = true;
  };

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    if (isStandalone) return;
    deferredPrompt = e;
    installBtn.hidden = false;
    installBtn.onclick = async () => {
      if (!deferredPrompt) return;
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        installBtn.hidden = true;
        deferredPrompt = null;
      }
    };
  });

  window.addEventListener("appinstalled", () => {
    installBtn.hidden = true;
    deferredPrompt = null;
  });

  const updateOfflineStatus = () => {
    const u = (bundle?.languages?.[lang] || bundle?.languages?.it)?.ui;
    if (!navigator.onLine) {
      offlineBanner.textContent = u ? u.offline_badge : "Modalità offline attiva";
      offlineBanner.hidden = false;
    } else {
      offlineBanner.hidden = true;
    }
  };

  window.addEventListener("online", updateOfflineStatus);
  window.addEventListener("offline", updateOfflineStatus);
  updateOfflineStatus();
}

// Inizializzazione principale e routing su hash URL
async function bootstrap(): Promise<void> {
  const baseUrl = import.meta.env.BASE_URL || "./";
  const res = await fetch(`${baseUrl}data/bundle.json`);
  bundle = await res.json();

  initMscTree();
  renderLanguageButtons();
  initSearch();
  initPwaAndOffline();

  // Pulsanti vista Testo / Grafo / Ibrida
  document.getElementById("vt")!.onclick = () => {
    view = "t";
    renderMain();
  };
  document.getElementById("vg")!.onclick = () => {
    view = "g";
    renderMain();
  };
  document.getElementById("vh")!.onclick = () => {
    view = "h";
    renderMain();
  };

  // Pulsante mostra/nascondi albero MSC laterale
  const navToggle = document.getElementById("nav-toggle")!;
  const layoutWrap = document.getElementById("layout-wrap")!;
  navToggle.onclick = () => {
    const collapsed = layoutWrap.classList.toggle("nav-collapsed");
    navToggle.setAttribute("aria-expanded", String(!collapsed));
  };

  // Pulsante tema chiaro/scuro
  const themeBtn = document.getElementById("theme-btn")!;
  themeBtn.onclick = () => {
    const curTheme = document.documentElement.getAttribute("data-theme");
    const isDark =
      curTheme === "dark" || (!curTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
  };

  // Scorciatoie da tastiera complete (WCAG 2.2 AA)
  window.addEventListener("keydown", (ev) => {
    const tag = (ev.target as HTMLElement)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (ev.key === "/") {
      ev.preventDefault();
      (document.getElementById("q") as HTMLInputElement).focus();
    } else if (ev.key === "[") {
      navToggle.click();
    } else if (ev.key === "t") {
      view = "t";
      renderMain();
    } else if (ev.key === "g") {
      view = "g";
      renderMain();
    } else if (ev.key === "h") {
      view = "h";
      renderMain();
    }
  });

  const handleRoute = () => {
    const rawHash = decodeURIComponent(location.hash.slice(1));
    const { mainCode, stepCode } = normalizeHashCode(rawHash);
    cur = mainCode;
    targetStepId = stepCode;
    const dropdown = document.getElementById("search-results");
    if (dropdown) dropdown.hidden = true;
    renderMain();
  };

  window.addEventListener("hashchange", handleRoute);
  handleRoute();
}

bootstrap();
