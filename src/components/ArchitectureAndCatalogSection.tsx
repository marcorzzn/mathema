import React, { useState } from "react";
import {
  TEN_LAYERS,
  RESOURCE_INVENTORY,
  ROADMAP_PHASES,
  OPEN_QUESTIONS,
  CatalogResource,
} from "../data/mathemaData";
import { ExternalLink, CheckCircle2, BookMarked, Compass } from "lucide-react";

export const ArchitectureAndCatalogSection: React.FC = () => {
  const [selectedLayerIdx, setSelectedLayerIdx] = useState<number>(5); // Default Strato 5 Formalizzazione
  const [categoryFilter, setCategoryFilter] = useState<
    CatalogResource["category"] | "all"
  >("all");
  const [policyFilter, setPolicyFilter] = useState<
    CatalogResource["integrationPolicy"] | "all"
  >("all");
  const [activePhaseIdx, setActivePhaseIdx] = useState<number>(1); // Fase 1 MVP Verticale

  const activeLayer = TEN_LAYERS[selectedLayerIdx] || TEN_LAYERS[5];

  const filteredResources = RESOURCE_INVENTORY.filter((r) => {
    if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
    if (policyFilter !== "all" && r.integrationPolicy !== policyFilter)
      return false;
    return true;
  });

  const policyLabel = (p: CatalogResource["integrationPolicy"]) => {
    if (p === "direct_import") return "Importazione Diretta (Libera)";
    if (p === "paraphrase_cite") return "Parafrasi con Attribuzione (NC/ND)";
    return "Link Esterno (Copyright)";
  };

  return (
    <section id="architettura" className="py-16 border-b border-[#E5DEC9]">
      <div className="max-w-[1360px] mx-auto px-6 space-y-16">
        {/* Part 1: 10 Architectural Layers (Section 6.1) */}
        <div>
          <div className="mb-8">
            <div className="text-xs tracking-widest uppercase text-[#78716C] mb-2">
              04. Sezione 6.1 &amp; Sezione 8 · Architettura a Dieci Strati ed Ecosistema
            </div>
            <h2 className="text-3xl lg:text-4xl font-semibold text-[#1C1917] tracking-tight text-balance">
              I Dieci Strati Architetturali di Mathema
            </h2>
            <p className="mt-2 text-base text-[#57534E] max-w-3xl leading-relaxed">
              Dall&apos;acquisizione OCR open-source (Strato 0) fino alla
              governance federata (Strato 9), ogni strato trasforma contenuti
              frammentati in conoscenza interconnessa, multilingue e
              formalmente verificata.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Layer Stack Selector (5 cols) */}
            <div className="lg:col-span-5 space-y-1.5">
              {TEN_LAYERS.map((item, idx) => {
                const isSelected = idx === selectedLayerIdx;
                return (
                  <button
                    key={item.layer}
                    onClick={() => setSelectedLayerIdx(idx)}
                    className={`w-full text-left px-4 py-2.5 rounded-md border transition-colors flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-[#1C1917] text-[#FBF9F5] border-[#1C1917]"
                        : "bg-[#FBF9F5] text-[#1C1917] border-[#E5DEC9] hover:bg-[#F3EFE6]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`font-mono text-xs tabular-nums shrink-0 ${
                          isSelected ? "text-[#D6CEBE]" : "text-[#78716C]"
                        }`}
                      >
                        Strato {item.layer}
                      </span>
                      <span className="text-sm font-semibold truncate">
                        {item.name}
                      </span>
                    </div>
                    <span
                      className={`text-xs truncate hidden sm:inline ${
                        isSelected ? "text-[#E5DEC9]" : "text-[#57534E]"
                      }`}
                    >
                      {item.keyTechnologies[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Layer Detail Card (7 cols) */}
            <div className="lg:col-span-7 bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#57534E] pb-4 border-b border-[#E5DEC9]">
                  <span>STRATO ARCHITETTURALE 0{activeLayer.layer} / 09</span>
                  <span>SPECIFICA BLUEPRINT v0.1</span>
                </div>

                <h3 className="text-2xl lg:text-3xl font-semibold text-[#1C1917] mt-5">
                  Strato {activeLayer.layer}: {activeLayer.name}
                </h3>

                <p className="mt-3 text-base text-[#1C1917] leading-relaxed">
                  {activeLayer.functionDesc}
                </p>

                <div className="mt-6 p-4 bg-[#F3EFE6] border border-[#E5DEC9] rounded-md">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                    Principio Guida del Manifesto
                  </div>
                  <p className="text-sm text-[#44403C] leading-relaxed">
                    {activeLayer.manifestoNotes}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-2">
                    Tecnologie, Standard e Modelli di Riferimento nello Strato{" "}
                    {activeLayer.layer}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#1E3A8A]">
                    {activeLayer.keyTechnologies.map((tech, i) => (
                      <React.Fragment key={tech}>
                        {i > 0 && (
                          <span className="text-[#78716C]" aria-hidden="true">
                            ·
                          </span>
                        )}
                        <span>{tech}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E5DEC9] flex flex-wrap items-center justify-between gap-2 text-xs text-[#57534E]">
                <span>
                  Licenze dello strato: Contenuti CC BY-SA 4.0 · Codice &amp; Lean
                  Apache 2.0 · Ontologia CC0
                </span>
                <span className="font-mono text-[#14532D]">
                  Curatela Umana + Assistenza Agentica
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Part 2: Complete Ecosystem & Resource Inventory Table (Section 8 & 12) */}
        <div className="pt-12 border-t border-[#E5DEC9]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
            <div>
              <div className="text-xs tracking-widest uppercase text-[#78716C] mb-1">
                Sezione 8 &amp; Sezione 12.2 · Inventario Completo delle Risorse e Politica Licenze
              </div>
              <h3 className="text-2xl font-semibold text-[#1C1917]">
                Catalogo Federato di Enciclopedie, Manuali Open Source e Infrastruttura Agentica
              </h3>
            </div>

            {/* Interactive Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                aria-label="Filtra per categoria risorsa"
                className="px-3 py-1.5 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-[#1C1917]"
              >
                <option value="all">Tutte le categorie ({RESOURCE_INVENTORY.length})</option>
                <option value="agentic">Infrastruttura Agentica &amp; Lean</option>
                <option value="encyclopedia">Enciclopedie &amp; Knowledge Graph</option>
                <option value="manual_math">Manuali Open: Matematica</option>
                <option value="manual_cs">Manuali Open: Informatica</option>
                <option value="manual_physics">Manuali Open: Fisica</option>
                <option value="standard">Standard &amp; Interoperabilità</option>
              </select>

              <select
                value={policyFilter}
                onChange={(e) => setPolicyFilter(e.target.value as any)}
                aria-label="Filtra per politica di licenza"
                className="px-3 py-1.5 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-[#1C1917]"
              >
                <option value="all">Tutte le modalità di compatibilità</option>
                <option value="direct_import">Importazione Diretta (CC BY-SA / GFDL / CC0)</option>
                <option value="paraphrase_cite">Parafrasi con Attribuzione (CC BY-NC)</option>
                <option value="external_link">Link Esterno (Copyright)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5DEC9] bg-[#F3EFE6] text-xs font-semibold text-[#44403C]">
                  <th className="py-3 px-4">Risorsa / Progetto</th>
                  <th className="py-3 px-4">Autore / Ente</th>
                  <th className="py-3 px-4">Licenza</th>
                  <th className="py-3 px-4">Modalità Integrazione (Sez. 12.2)</th>
                  <th className="py-3 px-4">Ruolo in Mathema</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DEC9] text-xs">
                {filteredResources.map((res) => (
                  <tr
                    key={res.name}
                    className="hover:bg-[#F3EFE6]/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-[#1C1917]">
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#1E3A8A] inline-flex items-center gap-1"
                      >
                        {res.name}
                        <ExternalLink className="w-3 h-3 text-[#78716C]" />
                      </a>
                    </td>
                    <td className="py-3 px-4 text-[#57534E]">
                      {res.authorOrOrg}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#1C1917]">
                      {res.license}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-medium ${
                          res.integrationPolicy === "direct_import"
                            ? "text-[#14532D]"
                            : res.integrationPolicy === "paraphrase_cite"
                            ? "text-[#9A3412]"
                            : "text-[#57534E]"
                        }`}
                      >
                        {policyLabel(res.integrationPolicy)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#44403C] max-w-md">
                      {res.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Part 3: Roadmap (Fasi 0–4) & Governance Open Questions (Sections 13 & 15) */}
        <div className="pt-12 border-t border-[#E5DEC9] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Roadmap (7 cols) */}
          <div className="lg:col-span-7">
            <div className="text-xs tracking-widest uppercase text-[#78716C] mb-1">
              Sezione 13 · Roadmap Esecutiva (Mesi 0–48+)
            </div>
            <h3 className="text-2xl font-semibold text-[#1C1917] mb-4">
              Dalla Fondazione all&apos;Adozione Curricolare Globale
            </h3>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {ROADMAP_PHASES.map((p, idx) => (
                <button
                  key={p.phase}
                  onClick={() => setActivePhaseIdx(idx)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                    activePhaseIdx === idx
                      ? "bg-[#1E3A8A] text-white border-[#1E3A8A]"
                      : "bg-[#FBF9F5] text-[#1C1917] border-[#D6CEBE] hover:bg-[#F3EFE6]"
                  }`}
                >
                  {p.phase} ({p.window})
                </button>
              ))}
            </div>

            {ROADMAP_PHASES[activePhaseIdx] && (
              <div className="p-6 bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5DEC9]">
                  <div>
                    <span className="text-xs font-mono text-[#1E3A8A] font-semibold">
                      {ROADMAP_PHASES[activePhaseIdx].phase} ·{" "}
                      {ROADMAP_PHASES[activePhaseIdx].window}
                    </span>
                    <h4 className="text-xl font-semibold text-[#1C1917] mt-0.5">
                      {ROADMAP_PHASES[activePhaseIdx].title}
                    </h4>
                  </div>
                </div>

                <div className="text-xs font-mono tabular-nums text-[#9A3412] bg-[#F3EFE6] px-3 py-2 rounded border border-[#E5DEC9]">
                  Target quantitativi: {ROADMAP_PHASES[activePhaseIdx].metrics}
                </div>

                <ul className="space-y-2.5 text-sm text-[#1C1917]">
                  {ROADMAP_PHASES[activePhaseIdx].deliverables.map((del, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Open Governance Questions (5 cols) */}
          <div className="lg:col-span-5">
            <div className="text-xs tracking-widest uppercase text-[#78716C] mb-1">
              Sezione 15 · Domande Aperte e Governance Federata
            </div>
            <h3 className="text-2xl font-semibold text-[#1C1917] mb-4">
              Nodi Politici, Legali ed Epistemologici
            </h3>

            <div className="space-y-3">
              {OPEN_QUESTIONS.map((q) => (
                <div
                  key={q.number}
                  className="p-4 bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-[#9A3412] font-semibold">
                      {q.number}.
                    </span>
                    <h4 className="text-sm font-semibold text-[#1C1917]">
                      {q.question}
                    </h4>
                  </div>
                  <p className="text-xs text-[#57534E] mt-1">
                    {q.tension}
                  </p>
                  <p className="text-xs text-[#1C1917] mt-1.5 font-medium">
                     Indirizzo Blueprint: {q.blueprintDirection}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
