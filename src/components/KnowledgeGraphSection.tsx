import React, { useState, useMemo } from "react";
import {
  MATHEMA_NODES,
  MATHEMA_EDGES,
  MathemaNode,
  MathemaEdge,
  LanguageCode,
  LANGUAGE_LABELS,
  DOMAIN_LABELS,
  EdgeRelation,
} from "../data/mathemaData";
import {
  Search,
  GitBranch,
  CheckCircle2,
  Code2,
  FileCode2,
  Plus,
  ArrowRight,
  Copy,
  Check,
  Compass,
  RotateCcw,
} from "lucide-react";

interface KnowledgeGraphSectionProps {
  activeLang: LanguageCode;
  setActiveLang: (lang: LanguageCode) => void;
  onInspectInBridge: (statement: string, leanCode: string) => void;
}

const RELATION_META: Record<
  EdgeRelation,
  { label: string; stroke: string; dash?: string }
> = {
  requires: { label: "Prerequisito (requires)", stroke: "#1E3A8A" },
  proved_by: { label: "Dimostrato da (proved_by)", stroke: "#14532D" },
  equivalent_to: {
    label: "Equivalente a (equivalent_to)",
    stroke: "#9A3412",
    dash: "5 3",
  },
  generalizes: {
    label: "Generalizza (generalizes)",
    stroke: "#78350F",
    dash: "3 3",
  },
  special_case_of: {
    label: "Caso speciale di (special_case_of)",
    stroke: "#57534E",
    dash: "4 2",
  },
  applied_to: { label: "Applicato a (applied_to)", stroke: "#0F766E" },
  alternative_to: {
    label: "Alternativa a (alternative_to)",
    stroke: "#7C2D12",
    dash: "2 2",
  },
};

export const KnowledgeGraphSection: React.FC<KnowledgeGraphSectionProps> = ({
  activeLang,
  setActiveLang,
  onInspectInBridge,
}) => {
  const [nodes, setNodes] = useState<MathemaNode[]>(MATHEMA_NODES);
  const [edges, setEdges] = useState<MathemaEdge[]>(MATHEMA_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    "urn:mathema:concept:sqrt2-irrationality"
  );
  const [relationFilter, setRelationFilter] = useState<EdgeRelation | "all">(
    "all"
  );
  const [domainFilter, setDomainFilter] = useState<
    MathemaNode["domain"] | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectorTab, setInspectorTab] = useState<
    "overview" | "proofs" | "lean" | "yaml"
  >("overview");
  const [selectedProofIdx, setSelectedProofIdx] = useState(0);
  const [highlightPrereqChain, setHighlightPrereqChain] = useState(false);
  const [copiedYaml, setCopiedYaml] = useState(false);

  // Add Node Form state
  const [showAddNode, setShowAddNode] = useState(false);
  const [newNodeSlug, setNewNodeSlug] = useState("");
  const [newNodeTitleIt, setNewNodeTitleIt] = useState("");
  const [newNodeTitleEn, setNewNodeTitleEn] = useState("");
  const [newNodeDomain, setNewNodeDomain] =
    useState<MathemaNode["domain"]>("number_theory");
  const [newNodePrereq, setNewNodePrereq] = useState(
    "urn:mathema:concept:sqrt2-irrationality"
  );
  const [newNodeStatement, setNewNodeStatement] = useState("");
  const [newNodeLean, setNewNodeLean] = useState("");

  const selectedNode = useMemo(
    () =>
      nodes.find((n) => n.id === selectedNodeId) ||
      nodes[0],
    [nodes, selectedNodeId]
  );

  // Compute transitive prerequisite set for the selected node
  const transitivePrereqs = useMemo(() => {
    const visited = new Set<string>();
    const queue = [selectedNode.id];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      visited.add(curr);
      const currNode = nodes.find((n) => n.id === curr);
      if (currNode) {
        currNode.prerequisites.forEach((p) => {
          if (!visited.has(p)) queue.push(p);
        });
      }
      edges.forEach((e) => {
        if (
          e.to === curr &&
          (e.type === "requires" || e.type === "proved_by") &&
          !visited.has(e.from)
        ) {
          queue.push(e.from);
        }
      });
    }
    return visited;
  }, [selectedNode, nodes, edges]);

  const filteredNodes = useMemo(() => {
    return nodes.filter((n) => {
      if (domainFilter !== "all" && n.domain !== domainFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = Object.values(n.title).some((t) =>
          t.toLowerCase().includes(q)
        );
        const matchId = n.id.toLowerCase().includes(q);
        const matchNotation = n.notation.toLowerCase().includes(q);
        return matchTitle || matchId || matchNotation;
      }
      return true;
    });
  }, [nodes, domainFilter, searchQuery]);

  const visibleNodeIds = useMemo(
    () => new Set(filteredNodes.map((n) => n.id)),
    [filteredNodes]
  );

  const filteredEdges = useMemo(() => {
    return edges.filter((e) => {
      if (!visibleNodeIds.has(e.from) || !visibleNodeIds.has(e.to))
        return false;
      if (relationFilter !== "all" && e.type !== relationFilter) return false;
      return true;
    });
  }, [edges, visibleNodeIds, relationFilter]);

  const generatedYaml = useMemo(() => {
    const n = selectedNode;
    const prereqList =
      n.prerequisites.length > 0
        ? n.prerequisites.map((p) => `  - ${p}`).join("\n")
        : "  []";
    const outEdges = edges.filter((e) => e.from === n.id);
    const inEdges = edges.filter((e) => e.to === n.id);

    return `id: "${n.id}"
type: ${n.type}
wikidata: "${n.wikidataId}"
title:
  it: "${n.title.it}"
  en: "${n.title.en}"
  es: "${n.title.es}"
  zh: "${n.title.zh}"
  ar: "${n.title.ar}"
domain: ${n.domain}
level: [${n.levels.join(", ")}]
prerequisites:
${prereqList}
statements:
  informal:
    ${activeLang}: "${n.statements.informal[activeLang]}"
  formal:
    lean4: |
${n.statements.formalLean
  .split("\n")
  .map((line) => `      ${line}`)
  .join("\n")}
proofs_count: ${n.proofs.length}
licenses:
  content: CC-BY-SA-4.0
  code: Apache-2.0
  formalization: Apache-2.0
graph_relations:
  incoming_edges: ${inEdges.length}
  outgoing_edges: ${outEdges.length}`;
  }, [selectedNode, edges, activeLang]);

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(generatedYaml);
    setCopiedYaml(true);
    setTimeout(() => setCopiedYaml(false), 1800);
  };

  const handleCreateNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeSlug.trim() || !newNodeTitleIt.trim()) return;
    const cleanSlug = newNodeSlug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-");
    const newId = `urn:mathema:concept:${cleanSlug}`;

    const created: MathemaNode = {
      id: newId,
      shortSlug: cleanSlug,
      type: "theorem",
      domain: newNodeDomain,
      levels: [3, 4],
      x: 340 + ((nodes.length * 95) % 520),
      y: 140 + ((nodes.length * 70) % 320),
      title: {
        it: newNodeTitleIt.trim(),
        en: newNodeTitleEn.trim() || newNodeTitleIt.trim(),
        es: newNodeTitleIt.trim(),
        zh: newNodeTitleEn.trim() || newNodeTitleIt.trim(),
        ar: newNodeTitleEn.trim() || newNodeTitleIt.trim(),
      },
      notation: "⊢ P (Nodo contribuito dalla comunità)",
      statements: {
        informal: {
          it:
            newNodeStatement.trim() ||
            "Enunciato contribuito secondo lo schema aperto CC BY-SA 4.0 di Mathema.",
          en:
            newNodeStatement.trim() ||
            "Community-contributed statement under Mathema CC BY-SA 4.0 schema.",
          es: newNodeStatement.trim() || "Enunciado contribuido a Mathema.",
          zh: newNodeStatement.trim() || "社区贡献的数学节点。",
          ar: newNodeStatement.trim() || "عقدة رياضية مساهمة من المجتمع.",
        },
        formalLean:
          newNodeLean.trim() ||
          `import Mathlib\n\n-- Formalizzazione per ${newId}\ntheorem ${cleanSlug.replace(/-/g, "_")} : True := by\n  trivial`,
      },
      prerequisites: newNodePrereq ? [newNodePrereq] : [],
      proofs: [],
      explanations: [
        {
          style: "intuitive",
          level: 3,
          authorAgent: "contributor:marco-razzano-community",
          text: {
            it:
              newNodeStatement.trim() ||
              "Spiegazione intuitiva inserita nel grafo federato.",
            en:
              newNodeStatement.trim() ||
              "Intuitive explanation added to the federated graph.",
            es: newNodeStatement.trim() || "Explicación intuitiva.",
            zh: newNodeStatement.trim() || "直观解释。",
            ar: newNodeStatement.trim() || "شرح حدسي.",
          },
        },
      ],
      sources: [
        {
          name: "Mathema Community PR",
          ref: "github.com/marcorzzn/Mathema",
          license: "CC BY-SA 4.0",
        },
      ],
      wikidataId: "Q-NEW",
    };

    setNodes((prev) => [...prev, created]);
    if (newNodePrereq) {
      setEdges((prev) => [
        ...prev,
        {
          id: `edge-custom-${Date.now()}`,
          from: newNodePrereq,
          to: newId,
          type: "requires",
          weight: 0.9,
          source: "human",
          confidence: 1.0,
          note: "Arco aggiunto tramite proposta nodo sul grafo.",
        },
      ]);
    }
    setSelectedNodeId(newId);
    setShowAddNode(false);
    setNewNodeSlug("");
    setNewNodeTitleIt("");
    setNewNodeTitleEn("");
    setNewNodeStatement("");
    setNewNodeLean("");
  };

  return (
    <section id="grafo" className="py-16 border-b border-[#E5DEC9]">
      <div className="max-w-[1360px] mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="text-xs tracking-widest uppercase text-[#78716C] mb-2">
              01. Strato 1 &amp; Strato 4 · Ontologia Multi-Relazionale e Multilingue
            </div>
            <h2 className="text-3xl lg:text-4xl font-semibold text-[#1C1917] tracking-tight text-balance">
              Grafo della Conoscenza Matematica, Fisica e Informatica
            </h2>
            <p className="mt-2 text-base text-[#57534E] max-w-2xl leading-relaxed">
              Le pagine sono viste sul grafo, non il contrario. Ogni concetto ha
              un identificatore URN univoco, varianti linguistiche native,
              dimostrazioni multiple e collegamenti formali a Lean 4 / Mathlib.
            </p>
          </div>

          {/* Language Variant Selector (Section 9 of Manifesto) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#78716C] mr-1">
              Rappresentazione linguistica del nodo:
            </span>
            <div className="flex items-center gap-1 p-1 bg-[#F3EFE6] border border-[#E5DEC9] rounded-lg">
              {(Object.keys(LANGUAGE_LABELS) as LanguageCode[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    activeLang === lang
                      ? "bg-[#1E3A8A] text-white"
                      : "text-[#57534E] hover:text-[#1C1917]"
                  }`}
                >
                  {LANGUAGE_LABELS[lang].native}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Workspace Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#F3EFE6]/70 border border-[#E5DEC9] rounded-lg mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca concetto, URN o formula..."
                className="pl-9 pr-3 py-1.5 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#1E3A8A] w-56"
              />
            </div>

            {/* Domain Filter */}
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value as any)}
              aria-label="Filtra per dominio"
              className="px-3 py-1.5 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-[#1C1917] focus:outline-none focus:border-[#1E3A8A]"
            >
              <option value="all">Tutti i domini (6)</option>
              {(
                Object.keys(DOMAIN_LABELS) as Array<MathemaNode["domain"]>
              ).map((dom) => (
                <option key={dom} value={dom}>
                  {DOMAIN_LABELS[dom].it} ({DOMAIN_LABELS[dom].code})
                </option>
              ))}
            </select>

            {/* Edge Relation Filter */}
            <select
              value={relationFilter}
              onChange={(e) => setRelationFilter(e.target.value as any)}
              aria-label="Filtra per tipo di arco"
              className="px-3 py-1.5 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-[#1C1917] focus:outline-none focus:border-[#1E3A8A]"
            >
              <option value="all">Tutti gli archi relazionali</option>
              {(Object.keys(RELATION_META) as EdgeRelation[]).map((rel) => (
                <option key={rel} value={rel}>
                  {RELATION_META[rel].label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHighlightPrereqChain(!highlightPrereqChain)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                highlightPrereqChain
                  ? "bg-[#9A3412] text-white border-[#9A3412]"
                  : "bg-[#FBF9F5] text-[#1C1917] border-[#D6CEBE] hover:bg-[#EBE6DF]"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              {highlightPrereqChain
                ? "Catena Prerequisiti Attiva"
                : "Evidenzia Catena Prerequisiti"}
            </button>

            <button
              onClick={() => setShowAddNode(!showAddNode)}
              className="px-3 py-1.5 text-xs font-medium bg-[#1C1917] text-[#FBF9F5] rounded-md hover:bg-[#292524] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Proponi Nodo (PR)
            </button>
          </div>
        </div>

        {/* Optional Community Add Node Drawer */}
        {showAddNode && (
          <form
            onSubmit={handleCreateNode}
            className="mb-6 p-6 bg-[#F3EFE6] border border-[#D6CEBE] rounded-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-[#1C1917]">
                  Contribuisci un nuovo nodo al Grafo Mathema (Schema v0.1)
                </h3>
                <p className="text-xs text-[#57534E]">
                  Il nodo verrà creato con licenza CC BY-SA 4.0 e collegato
                  immediatamente al grafo interattivo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddNode(false)}
                className="text-xs text-[#57534E] hover:text-[#1C1917]"
              >
                Chiudi
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-[#44403C] mb-1">
                  Slug URN (es. lagrange-theorem)
                </label>
                <input
                  type="text"
                  required
                  value={newNodeSlug}
                  onChange={(e) => setNewNodeSlug(e.target.value)}
                  placeholder="es. euler-totient"
                  className="w-full px-3 py-2 text-xs font-mono bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#44403C] mb-1">
                  Titolo (Italiano)
                </label>
                <input
                  type="text"
                  required
                  value={newNodeTitleIt}
                  onChange={(e) => setNewNodeTitleIt(e.target.value)}
                  placeholder="es. Teorema di Eulero-Fermat"
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#44403C] mb-1">
                  Titolo (English)
                </label>
                <input
                  type="text"
                  value={newNodeTitleEn}
                  onChange={(e) => setNewNodeTitleEn(e.target.value)}
                  placeholder="e.g. Euler's Totient Theorem"
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-[#44403C] mb-1">
                  Dominio Scientifico
                </label>
                <select
                  value={newNodeDomain}
                  onChange={(e) => setNewNodeDomain(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                >
                  {(
                    Object.keys(DOMAIN_LABELS) as Array<MathemaNode["domain"]>
                  ).map((d) => (
                    <option key={d} value={d}>
                      {DOMAIN_LABELS[d].it}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#44403C] mb-1">
                  Nodo Prerequisito (arco requires)
                </label>
                <select
                  value={newNodePrereq}
                  onChange={(e) => setNewNodePrereq(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                >
                  {nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.title.it} ({n.shortSlug})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-[#44403C] mb-1">
                  Enunciato Informale
                </label>
                <textarea
                  rows={2}
                  value={newNodeStatement}
                  onChange={(e) => setNewNodeStatement(e.target.value)}
                  placeholder="Se a ed n sono coprimi, allora a^φ(n) ≡ 1 (mod n)..."
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#44403C] mb-1">
                  Formalizzazione Lean 4 (opzionale)
                </label>
                <textarea
                  rows={2}
                  value={newNodeLean}
                  onChange={(e) => setNewNodeLean(e.target.value)}
                  placeholder="theorem euler_totient {a n : ℕ} (h : a.Coprime n) : a ^ φ n ≡ 1 [MOD n] := ..."
                  className="w-full px-3 py-2 text-xs font-mono bg-[#FBF9F5] border border-[#D6CEBE] rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium bg-[#1E3A8A] text-white rounded-md hover:bg-[#172554] transition-colors"
              >
                Aggiungi Nodo al Grafo
              </button>
            </div>
          </form>
        )}

        {/* Two-Zone Sandbox Layout (65% Interactive Graph Canvas / 35% Node Inspector) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Zone: Interactive SVG Knowledge Graph Canvas (7 cols) */}
          <div className="lg:col-span-7 bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg flex flex-col justify-between overflow-hidden">
            {/* Canvas Top Metadata Bar */}
            <div className="px-4 py-3 border-b border-[#E5DEC9] bg-[#F3EFE6]/50 flex flex-wrap items-center justify-between gap-2 text-xs text-[#57534E]">
              <div className="flex items-center gap-2">
                <GitBranch className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span className="font-medium text-[#1C1917]">
                  Vista Topologica Interattiva
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  {filteredNodes.length} nodi attivi
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  {filteredEdges.length} archi relazionali
                </span>
              </div>
              <button
                onClick={() => {
                  setDomainFilter("all");
                  setRelationFilter("all");
                  setSearchQuery("");
                  setHighlightPrereqChain(false);
                }}
                className="text-xs text-[#1E3A8A] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reimposta vista
              </button>
            </div>

            {/* Interactive SVG Canvas */}
            <div className="relative w-full overflow-x-auto bg-[#FBF9F5] p-2">
              <svg
                viewBox="0 0 1100 560"
                className="w-full h-[460px] select-none"
                role="img"
                aria-label="Grafo della conoscenza Mathema"
              >
                <defs>
                  {/* Subtle coordinate grid pattern */}
                  <pattern
                    id="mathema-grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="#EBE6DF"
                      strokeWidth="1"
                    />
                  </pattern>
                  <marker
                    id="arrow-requires"
                    viewBox="0 0 10 10"
                    refX="26"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#1E3A8A" />
                  </marker>
                  <marker
                    id="arrow-default"
                    viewBox="0 0 10 10"
                    refX="26"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#57534E" />
                  </marker>
                </defs>

                <rect width="1100" height="560" fill="url(#mathema-grid)" />

                {/* Column Layer Guides */}
                <g className="text-[11px] fill-[#78716C]" fontFamily="IBM Plex Mono">
                  <text x="80" y="32">
                    FONDAMENTI &amp; LOGICA (L0–L2)
                  </text>
                  <text x="360" y="32">
                    TEOREMI CARDINE (L2–L4)
                  </text>
                  <text x="620" y="32">
                    STRUTTURE &amp; COMPLETAMENTI (L4–L5)
                  </text>
                  <text x="875" y="32">
                    FRONTIERA &amp; FISICA (L5–L7)
                  </text>
                </g>

                {/* Render Directed Edges */}
                {filteredEdges.map((edge) => {
                  const sourceNode = nodes.find((n) => n.id === edge.from);
                  const targetNode = nodes.find((n) => n.id === edge.to);
                  if (!sourceNode || !targetNode) return null;

                  const isDirectSelected =
                    edge.from === selectedNode.id ||
                    edge.to === selectedNode.id;
                  const isInPrereqChain =
                    highlightPrereqChain &&
                    transitivePrereqs.has(edge.from) &&
                    transitivePrereqs.has(edge.to);

                  const meta =
                    RELATION_META[edge.type] || RELATION_META.requires;
                  const midX = (sourceNode.x + targetNode.x) / 2;
                  const midY = (sourceNode.y + targetNode.y) / 2;

                  const opacity = highlightPrereqChain
                    ? isInPrereqChain
                      ? 1
                      : 0.18
                    : isDirectSelected
                    ? 1
                    : 0.55;

                  return (
                    <g key={edge.id} style={{ opacity }}>
                      <line
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={
                          isInPrereqChain
                            ? "#9A3412"
                            : isDirectSelected
                            ? "#1E3A8A"
                            : meta.stroke
                        }
                        strokeWidth={
                          isDirectSelected || isInPrereqChain ? 2.4 : 1.5
                        }
                        strokeDasharray={meta.dash}
                        markerEnd={
                          edge.type === "requires"
                            ? "url(#arrow-requires)"
                            : "url(#arrow-default)"
                        }
                      />
                      {(isDirectSelected || isInPrereqChain) && (
                        <g transform={`translate(${midX}, ${midY - 8})`}>
                          <rect
                            x="-42"
                            y="-10"
                            width="84"
                            height="16"
                            rx="3"
                            fill="#FBF9F5"
                            stroke="#D6CEBE"
                            strokeWidth="1"
                          />
                          <text
                            textAnchor="middle"
                            y="1"
                            fontSize="9.5"
                            fontFamily="IBM Plex Mono"
                            fill="#1C1917"
                          >
                            {edge.type}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Render Nodes */}
                {filteredNodes.map((node) => {
                  const isSelected = node.id === selectedNode.id;
                  const isPrereq =
                    selectedNode.prerequisites.includes(node.id) ||
                    edges.some(
                      (e) => e.to === selectedNode.id && e.from === node.id
                    );
                  const isConsequence = edges.some(
                    (e) => e.from === selectedNode.id && e.to === node.id
                  );
                  const inChain =
                    highlightPrereqChain && transitivePrereqs.has(node.id);

                  const dimmed =
                    highlightPrereqChain && !inChain;

                  const strokeColor = isSelected
                    ? "#1E3A8A"
                    : inChain
                    ? "#9A3412"
                    : isPrereq
                    ? "#14532D"
                    : isConsequence
                    ? "#78350F"
                    : "#78716C";

                  const fillColor = isSelected
                    ? "#1E3A8A"
                    : inChain
                    ? "#FFF7ED"
                    : "#FBF9F5";

                  const label = node.title[activeLang] || node.title.it;
                  const truncatedLabel =
                    label.length > 28 ? label.slice(0, 26) + "…" : label;

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onClick={() => {
                        setSelectedNodeId(node.id);
                        setSelectedProofIdx(0);
                      }}
                      className="cursor-pointer"
                      style={{ opacity: dimmed ? 0.25 : 1 }}
                    >
                      {/* Outer selection ring */}
                      {isSelected && (
                        <circle
                          r="30"
                          fill="none"
                          stroke="#1E3A8A"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                      )}

                      {/* Node Circle */}
                      <circle
                        r="22"
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={isSelected ? "2.5" : "1.75"}
                      />

                      {/* Node Type Glyph inside Circle */}
                      <text
                        textAnchor="middle"
                        y="4"
                        fontSize="11"
                        fontWeight="600"
                        fontFamily="IBM Plex Mono"
                        fill={isSelected ? "#FFFFFF" : "#1C1917"}
                      >
                        {node.type === "theorem"
                          ? "THM"
                          : node.type === "definition"
                          ? "DEF"
                          : "TEC"}
                      </text>

                      {/* Node Label Card below circle */}
                      <g transform="translate(0, 38)">
                        <rect
                          x="-92"
                          y="-13"
                          width="184"
                          height="34"
                          rx="4"
                          fill={isSelected ? "#1C1917" : "#F3EFE6"}
                          stroke={isSelected ? "#1C1917" : "#D6CEBE"}
                          strokeWidth="1"
                        />
                        <text
                          textAnchor="middle"
                          y="0"
                          fontSize="10.5"
                          fontWeight="600"
                          fill={isSelected ? "#FBF9F5" : "#1C1917"}
                        >
                          {truncatedLabel}
                        </text>
                        <text
                          textAnchor="middle"
                          y="13"
                          fontSize="9"
                          fontFamily="IBM Plex Mono"
                          fill={isSelected ? "#D6CEBE" : "#57534E"}
                        >
                          L{node.levels[0]}–L{node.levels[node.levels.length - 1]} ·{" "}
                          {node.proofs.length > 0
                            ? `${node.proofs.length} prove`
                            : node.domain.replace("_", " ")}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Legend & Cultural Note Footer */}
            <div className="px-4 py-3 border-t border-[#E5DEC9] bg-[#F3EFE6]/50 flex flex-wrap items-center justify-between gap-3 text-xs text-[#57534E]">
              <div className="flex flex-wrap items-center gap-3">
                <span>
                  <strong className="text-[#1C1917]">THM</strong> Teorema
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong className="text-[#1C1917]">DEF</strong> Definizione
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong className="text-[#1C1917]">TEC</strong> Tecnica di
                  prova
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Linea continua: <code>requires / proved_by</code>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Tratteggiata: <code>equivalent_to / generalizes</code>
                </span>
              </div>
              <div className="text-xs text-[#44403C]">
                Nota culturale ({LANGUAGE_LABELS[activeLang].native}):{" "}
                {LANGUAGE_LABELS[activeLang].culturalNote}
              </div>
            </div>
          </div>

          {/* Right Zone: Node Detail & Multi-Proof Inspector (5 cols) */}
          <div className="lg:col-span-5 bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg flex flex-col justify-between p-6">
            <div>
              {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-[#57534E] mb-2">
                <span>{selectedNode.id}</span>
                <span aria-hidden="true">·</span>
                <span>Wikidata {selectedNode.wikidataId}</span>
              </div>

              <h3
                dir={LANGUAGE_LABELS[activeLang].dir}
                className="text-2xl font-semibold text-[#1C1917] leading-snug"
              >
                {selectedNode.title[activeLang]}
              </h3>

              {/* Unboxed Secondary Metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E] mt-2 pb-4 border-b border-[#E5DEC9]">
                <span>{DOMAIN_LABELS[selectedNode.domain].it}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  Livelli {selectedNode.levels.join(", ")}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 text-[#14532D] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verificato Lean 4
                </span>
                <span aria-hidden="true">·</span>
                <span>CC BY-SA 4.0</span>
              </div>

              {/* Inspector Mode Tabs (Interactive Segmented Control) */}
              <div className="flex items-center gap-1 p-1 bg-[#F3EFE6] border border-[#E5DEC9] rounded-lg my-4">
                <button
                  onClick={() => setInspectorTab("overview")}
                  className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    inspectorTab === "overview"
                      ? "bg-[#FBF9F5] text-[#1C1917] shadow-xs"
                      : "text-[#57534E] hover:text-[#1C1917]"
                  }`}
                >
                  Enunciato &amp; Grafo
                </button>
                <button
                  onClick={() => setInspectorTab("proofs")}
                  className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    inspectorTab === "proofs"
                      ? "bg-[#FBF9F5] text-[#1C1917] shadow-xs"
                      : "text-[#57534E] hover:text-[#1C1917]"
                  }`}
                >
                  Multiprova ({selectedNode.proofs.length})
                </button>
                <button
                  onClick={() => setInspectorTab("lean")}
                  className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    inspectorTab === "lean"
                      ? "bg-[#FBF9F5] text-[#1C1917] shadow-xs"
                      : "text-[#57534E] hover:text-[#1C1917]"
                  }`}
                >
                  Lean 4
                </button>
                <button
                  onClick={() => setInspectorTab("yaml")}
                  className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    inspectorTab === "yaml"
                      ? "bg-[#FBF9F5] text-[#1C1917] shadow-xs"
                      : "text-[#57534E] hover:text-[#1C1917]"
                  }`}
                >
                  Schema YAML
                </button>
              </div>

              {/* Tab 1: Overview */}
              {inspectorTab === "overview" && (
                <div className="space-y-4">
                  <div className="p-3 bg-[#F3EFE6] border border-[#E5DEC9] rounded-md font-mono text-xs text-[#1C1917] overflow-x-auto">
                    {selectedNode.notation}
                  </div>

                  <div dir={LANGUAGE_LABELS[activeLang].dir}>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1">
                      Enunciato Informale ({LANGUAGE_LABELS[activeLang].native})
                    </div>
                    <p className="text-sm text-[#1C1917] leading-relaxed">
                      {selectedNode.statements.informal[activeLang]}
                    </p>
                  </div>

                  {/* Multilingual Variant Comparison Strip */}
                  <div className="pt-3 border-t border-[#E5DEC9]">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-2">
                      Varianti Linguistiche del Medesimo Nodo URN
                    </div>
                    <div className="space-y-1.5 text-xs">
                      {(Object.keys(LANGUAGE_LABELS) as LanguageCode[]).map(
                        (lang) => (
                          <div
                            key={lang}
                            className="flex items-baseline justify-between gap-2 py-1 border-b border-[#F3EFE6]"
                          >
                            <span className="text-[#78716C] font-mono w-16 shrink-0">
                              [{lang.toUpperCase()}]
                            </span>
                            <span
                              dir={LANGUAGE_LABELS[lang].dir}
                              className="text-[#1C1917] font-medium text-right"
                            >
                              {selectedNode.title[lang]}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Prerequisites & Outgoing Links */}
                  <div className="pt-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-2">
                      Prerequisiti Diretti ({selectedNode.prerequisites.length})
                    </div>
                    {selectedNode.prerequisites.length === 0 ? (
                      <p className="text-xs text-[#57534E]">
                        Nodo fondazionale primario (nessun prerequisito
                        anteriore nel sottografo corrente).
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {selectedNode.prerequisites.map((prereqId) => {
                          const pNode = nodes.find((n) => n.id === prereqId);
                          return (
                            <button
                              key={prereqId}
                              onClick={() => setSelectedNodeId(prereqId)}
                              className="w-full text-left px-3 py-2 text-xs bg-[#F3EFE6] hover:bg-[#EBE6DF] border border-[#E5DEC9] rounded-md flex items-center justify-between transition-colors"
                            >
                              <span className="font-medium text-[#1C1917] truncate">
                                {pNode ? pNode.title[activeLang] : prereqId}
                              </span>
                              <span className="font-mono text-[11px] text-[#1E3A8A] shrink-0 ml-2">
                                Esplora →
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Multiprova (Alternative Proofs) */}
              {inspectorTab === "proofs" && (
                <div className="space-y-4">
                  {selectedNode.proofs.length === 0 ? (
                    <div className="p-4 bg-[#F3EFE6] border border-[#E5DEC9] rounded-md text-xs text-[#57534E]">
                      Questo nodo è una <strong>{selectedNode.type}</strong>{" "}
                      fondazionale. Seleziona il nodo{" "}
                      <button
                        onClick={() =>
                          setSelectedNodeId(
                            "urn:mathema:concept:sqrt2-irrationality"
                          )
                        }
                        className="text-[#1E3A8A] underline font-medium"
                      >
                        Irrazionalità della radice di 2
                      </button>{" "}
                      per esplorare 3 dimostrazioni alternative complete
                      (Contraddizione sulla parità, Discesa infinita di
                      Tennenbaum, Valutazione 2-adica).
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedNode.proofs.map((pr, idx) => (
                          <button
                            key={pr.id}
                            onClick={() => setSelectedProofIdx(idx)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                              selectedProofIdx === idx
                                ? "bg-[#1E3A8A] text-white border-[#1E3A8A]"
                                : "bg-[#F3EFE6] text-[#44403C] border-[#D6CEBE] hover:bg-[#EBE6DF]"
                            }`}
                          >
                            Prova {idx + 1}: {pr.style}
                          </button>
                        ))}
                      </div>

                      {selectedNode.proofs[selectedProofIdx] && (
                        <div className="space-y-3">
                          <div className="text-sm font-semibold text-[#1C1917]">
                            {
                              selectedNode.proofs[selectedProofIdx].title[
                                activeLang
                              ]
                            }
                          </div>
                          <div className="text-xs text-[#14532D] font-mono">
                            ✓{" "}
                            {selectedNode.proofs[selectedProofIdx].verifier} ·{" "}
                            {
                              selectedNode.proofs[selectedProofIdx]
                                .semanticCheck
                            }
                          </div>
                          <ol
                            dir={LANGUAGE_LABELS[activeLang].dir}
                            className="space-y-2 text-xs text-[#1C1917] list-decimal list-inside bg-[#F3EFE6]/60 p-3.5 rounded-md border border-[#E5DEC9]"
                          >
                            {selectedNode.proofs[
                              selectedProofIdx
                            ].informalSteps[activeLang].map((step, sIdx) => (
                              <li key={sIdx} className="leading-relaxed">
                                {step}
                              </li>
                            ))}
                          </ol>
                          <pre className="p-3 bg-[#1C1917] text-[#FBF9F5] rounded-md text-[11px] font-mono overflow-x-auto">
                            {selectedNode.proofs[selectedProofIdx].leanCode}
                          </pre>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Tab 3: Lean 4 Formalization */}
              {inspectorTab === "lean" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#57534E]">
                    <span className="inline-flex items-center gap-1.5 font-medium text-[#14532D]">
                      <Code2 className="w-4 h-4" />
                      Lean 4 + Mathlib4 Kernel Verified
                    </span>
                    <span>Licenza Apache-2.0</span>
                  </div>
                  <pre className="p-4 bg-[#1C1917] text-[#FBF9F5] rounded-md text-xs font-mono overflow-x-auto leading-relaxed max-h-[300px]">
                    {selectedNode.statements.formalLean}
                  </pre>
                  <div className="text-xs text-[#57534E]">
                    Fonti collegate:{" "}
                    {selectedNode.sources.map((s, i) => (
                      <span key={i}>
                        {i > 0 && " · "}
                        <strong className="text-[#1C1917]">{s.name}</strong> (
                        {s.ref}, {s.license})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Schema YAML (Section 6.2 of Manifesto) */}
              {inspectorTab === "yaml" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#57534E] flex items-center gap-1.5">
                      <FileCode2 className="w-3.5 h-3.5" />
                      Specifica Nodo v0.1 (Sezione 6.2 Manifesto)
                    </span>
                    <button
                      onClick={handleCopyYaml}
                      className="px-2.5 py-1 text-xs font-medium bg-[#F3EFE6] hover:bg-[#EBE6DF] border border-[#D6CEBE] rounded-md flex items-center gap-1 transition-colors"
                    >
                      {copiedYaml ? (
                        <>
                          <Check className="w-3 h-3 text-[#14532D]" />
                          Copiato
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copia YAML
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3.5 bg-[#1C1917] text-[#FBF9F5] rounded-md text-[11px] font-mono overflow-x-auto max-h-[300px] leading-relaxed">
                    {generatedYaml}
                  </pre>
                </div>
              )}
            </div>

            {/* Bottom Action: Send Node to NL <-> Lean Bridge */}
            <div className="pt-4 mt-4 border-t border-[#E5DEC9] flex items-center justify-between gap-3">
              <div className="text-xs text-[#57534E]">
                Vuoi deformalizzare o verificare varianti di questo nodo?
              </div>
              <button
                onClick={() =>
                  onInspectInBridge(
                    selectedNode.statements.informal[activeLang],
                    selectedNode.statements.formalLean
                  )
                }
                className="px-3.5 py-2 text-xs font-medium bg-[#1E3A8A] text-white rounded-md hover:bg-[#172554] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                Apri nel Ponte NL ↔ Lean
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
