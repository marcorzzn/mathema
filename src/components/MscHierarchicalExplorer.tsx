import React, { useState, useMemo } from "react";
import {
  MSC_HIERARCHY_TREE,
  MscTripleItem,
  flattenMscTree,
  VisualPlotType,
} from "../data/mscHierarchyData";
import { LanguageCode, LANGUAGE_LABELS } from "../data/mathemaData";
import { MathVisualCompanion2D3D } from "./MathVisualCompanion2D3D";
import {
  ChevronRight,
  ChevronDown,
  GitBranch,
  FileText,
  Columns,
  CheckSquare,
  Square,
  ArrowRight,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface MscHierarchicalExplorerProps {
  activeLang: LanguageCode;
  setActiveLang: (lang: LanguageCode) => void;
  onSendToBridge: (statement: string, leanCode: string) => void;
}

export const MscHierarchicalExplorer: React.FC<
  MscHierarchicalExplorerProps
> = ({ activeLang, setActiveLang, onSendToBridge }) => {
  const allItems = useMemo(() => flattenMscTree(MSC_HIERARCHY_TREE), []);

  // View mode: 'split' (Text + Graph + 2D/3D), 'text' (Full width hierarchical text), 'graph' (Full width graph of selected slice)
  const [viewMode, setViewMode] = useState<"split" | "text" | "graph">("split");

  // Expanded codes in the hierarchical tree
  const [expandedCodes, setExpandedCodes] = useState<Set<string>>(
    () =>
      new Set([
        "11-XX",
        "11J68",
        "11J68.2",
        "11J68.3",
        "11J68.3.2",
        "03-XX",
        "03B05",
      ])
  );

  // Selected codes to project as a Graph (user can select a micro-portion of a proposition or a large MSC section)
  const [selectedForGraph, setSelectedForGraph] = useState<Set<string>>(
    () =>
      new Set([
        "03B05.1",
        "11J68.1",
        "11J68.2",
        "11J68.2.1",
        "11J68.2.2",
        "11J68.3",
        "11J68.3.1",
        "11J68.3.2",
        "11J68.3.2.a",
        "11J68.3.3",
        "11J68.3.4",
      ])
  );

  // Currently focused item (for inspector & 2D/3D plot)
  const [focusedCode, setFocusedCode] = useState<string>("11J68.3");

  const focusedItem = useMemo(
    () => allItems.find((i) => i.code === focusedCode) || allItems[0],
    [allItems, focusedCode]
  );

  const activePlotType: VisualPlotType = useMemo(() => {
    if (focusedItem.visualPlot) return focusedItem.visualPlot;
    // Walk up parent chain
    let curr: MscTripleItem | undefined = focusedItem;
    while (curr && curr.parentCode) {
      curr = allItems.find((x) => x.code === curr!.parentCode);
      if (curr?.visualPlot) return curr.visualPlot;
    }
    return "pell_conic_2d_3d";
  }, [focusedItem, allItems]);

  const toggleExpand = (code: string) => {
    setExpandedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedCodes(new Set(allItems.map((i) => i.code)));
  };

  const collapseToPropositions = () => {
    setExpandedCodes(
      new Set(
        allItems
          .filter(
            (i) => i.levelType === "discipline" || i.levelType === "section"
          )
          .map((i) => i.code)
      )
    );
  };

  // Collect all descendant codes of an item (so selecting a section or theorem can select its whole subtree)
  const getSubtreeCodes = (rootItem: MscTripleItem): string[] => {
    const codes: string[] = [rootItem.code];
    if (rootItem.children) {
      for (const ch of rootItem.children) {
        codes.push(...getSubtreeCodes(ch));
      }
    }
    return codes;
  };

  const toggleSelectSubtree = (item: MscTripleItem) => {
    const subtree = getSubtreeCodes(item);
    setSelectedForGraph((prev) => {
      const next = new Set(prev);
      const allSelected = subtree.every((c) => next.has(c));
      if (allSelected) {
        subtree.forEach((c) => next.delete(c));
      } else {
        subtree.forEach((c) => next.add(c));
      }
      return next;
    });
  };

  // Quick Selection Presets (Micro-portion vs Single Proposition vs Full MSC Section vs Entire Tree)
  const selectPresetSlice = (
    preset: "micro_sqrt2" | "section_11J68" | "primes_11A41" | "all_msc"
  ) => {
    if (preset === "micro_sqrt2") {
      setSelectedForGraph(
        new Set([
          "11J68.2",
          "11J68.3.1",
          "11J68.3.2",
          "11J68.3.2.a",
          "11J68.3.3",
          "11J68.3.4",
        ])
      );
      setFocusedCode("11J68.3.2");
    } else if (preset === "section_11J68") {
      const sec = allItems.find((i) => i.code === "11J68");
      if (sec) setSelectedForGraph(new Set(getSubtreeCodes(sec)));
      setFocusedCode("11J68.3");
    } else if (preset === "primes_11A41") {
      const sec = allItems.find((i) => i.code === "11A41");
      if (sec)
        setSelectedForGraph(new Set(["03B05.1", ...getSubtreeCodes(sec)]));
      setFocusedCode("11A41.1");
    } else {
      setSelectedForGraph(new Set(allItems.map((i) => i.code)));
      setFocusedCode("11-XX");
    }
  };

  // Compute dynamic graph nodes & directed edges for the currently selected items
  const dynamicGraph = useMemo(() => {
    const selectedList = allItems.filter((i) => selectedForGraph.has(i.code));
    const listToUse =
      selectedList.length > 0 ? selectedList : allItems.slice(0, 8);
    const codeSet = new Set(listToUse.map((i) => i.code));

    // Group by depth/levelType for clean layered layout
    const depthOrder: Record<MscTripleItem["levelType"], number> = {
      discipline: 0,
      section: 1,
      proposition: 2,
      micro_step: 3,
      sub_step: 4,
    };

    const buckets: Record<number, MscTripleItem[]> = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
    };
    listToUse.forEach((item) => {
      buckets[depthOrder[item.levelType]].push(item);
    });

    const activeBuckets = Object.values(buckets).filter((b) => b.length > 0);
    const positionedNodes: {
      item: MscTripleItem;
      x: number;
      y: number;
    }[] = [];

    const totalCols = Math.max(activeBuckets.length, 1);
    activeBuckets.forEach((bucket, colIdx) => {
      const x =
        totalCols === 1
          ? 320
          : 95 + (colIdx * 470) / (totalCols - 1);
      bucket.forEach((item, rowIdx) => {
        const totalRows = bucket.length;
        const y =
          totalRows === 1
            ? 195
            : 45 + (rowIdx * 310) / (totalRows - 1);
        positionedNodes.push({ item, x, y });
      });
    });

    const edges: {
      from: string;
      to: string;
      kind: "hierarchy" | "dependency";
    }[] = [];

    listToUse.forEach((item) => {
      if (item.parentCode && codeSet.has(item.parentCode)) {
        edges.push({
          from: item.parentCode,
          to: item.code,
          kind: "hierarchy",
        });
      }
      item.dependencies.forEach((dep) => {
        if (codeSet.has(dep)) {
          edges.push({
            from: dep,
            to: item.code,
            kind: "dependency",
          });
        }
      });
    });

    return { nodes: positionedNodes, edges };
  }, [allItems, selectedForGraph]);

  // Recursive renderer for the numbered hierarchical tree
  const renderTreeItem = (item: MscTripleItem, depth = 0) => {
    const hasChildren = Boolean(item.children && item.children.length > 0);
    const isExpanded = expandedCodes.has(item.code);
    const isSelected = selectedForGraph.has(item.code);
    const isFocused = focusedCode === item.code;

    return (
      <div
        key={item.code}
        className={`${depth > 0 ? "ml-4 sm:ml-6 pl-3 border-l border-[#D6CEBE]" : ""} mt-3`}
      >
        <div
          className={`rounded-lg border transition-colors p-4 ${
            isFocused
              ? "bg-[#FBF9F5] border-[#1E3A8A] shadow-xs"
              : "bg-[#FBF9F5] border-[#E5DEC9] hover:border-[#D6CEBE]"
          }`}
        >
          {/* Top Row: MSC Hierarchical Number + Title + Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#F3EFE6]">
            <div className="flex items-center gap-2 min-w-0">
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(item.code)}
                  aria-label={`Espandi o comprimi ${item.code}`}
                  className="p-1 rounded hover:bg-[#F3EFE6] text-[#1C1917] shrink-0"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-[#1E3A8A]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#57534E]" />
                  )}
                </button>
              ) : (
                <span className="w-6 inline-block shrink-0" />
              )}

              {/* Canonical Hierarchical Number */}
              <button
                onClick={() => setFocusedCode(item.code)}
                className="font-mono text-xs font-bold tabular-nums text-[#1E3A8A] hover:underline shrink-0"
              >
                [{item.code}]
              </button>

              <span className="text-xs text-[#78716C] shrink-0">
                {item.kindLabel[activeLang]}
              </span>

              <span className="text-[#78716C]" aria-hidden="true">
                ·
              </span>

              <button
                onClick={() => setFocusedCode(item.code)}
                dir={LANGUAGE_LABELS[activeLang].dir}
                className="text-sm font-semibold text-[#1C1917] hover:text-[#1E3A8A] text-left truncate"
              >
                {item.title[activeLang]}
              </button>
            </div>

            {/* Action Controls: Select for Graph & Expand Passages */}
            <div className="flex items-center gap-2 shrink-0">
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(item.code)}
                  className="px-2 py-1 text-[11px] font-medium text-[#57534E] hover:text-[#1C1917] bg-[#F3EFE6] rounded"
                >
                  {isExpanded
                    ? `Nascondi passaggi (${item.children!.length})`
                    : `Mostra passaggi (${item.children!.length})`}
                </button>
              )}

              <button
                onClick={() => toggleSelectSubtree(item)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded flex items-center gap-1 transition-colors ${
                  isSelected
                    ? "bg-[#1E3A8A] text-white"
                    : "bg-[#F3EFE6] text-[#44403C] hover:bg-[#EBE6DF]"
                }`}
                title="Includi o escludi questa proposizione/porzione nel Grafo"
              >
                {isSelected ? (
                  <CheckSquare className="w-3 h-3" />
                ) : (
                  <Square className="w-3 h-3" />
                )}
                <span>Nel Grafo</span>
              </button>
            </div>
          </div>

          {/* Strict 3-Column Correspondence: 1. Natural Language (Multilingual) | 2. Formal Symbolic Syntax | 3. Lean 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-3">
            {/* Column 1: Natural Language */}
            <div
              dir={LANGUAGE_LABELS[activeLang].dir}
              className="p-3 bg-[#F3EFE6]/50 border border-[#E5DEC9] rounded-md"
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] mb-1">
                1. Linguaggio Naturale ({LANGUAGE_LABELS[activeLang].native})
              </div>
              <p className="text-xs text-[#1C1917] leading-relaxed">
                {item.natural[activeLang]}
              </p>
            </div>

            {/* Column 2: Formal Symbolic Mathematical Syntax */}
            <div className="p-3 bg-[#F3EFE6]/80 border border-[#E5DEC9] rounded-md">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#9A3412] mb-1">
                2. Sintassi Simbolica Formale
              </div>
              <div className="font-mono text-xs text-[#1C1917] leading-relaxed break-words">
                {item.symbolic}
              </div>
            </div>

            {/* Column 3: Lean 4 Formalization */}
            <div className="p-3 bg-[#1C1917] text-[#FBF9F5] rounded-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#D6CEBE] mb-1">
                  <span>3. Formalizzazione Lean 4</span>
                  <button
                    onClick={() =>
                      onSendToBridge(item.natural[activeLang], item.lean4)
                    }
                    className="text-[#93C5FD] hover:underline flex items-center gap-0.5"
                  >
                    Ponte NL↔Lean <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
                <pre className="font-mono text-[11px] text-[#FBF9F5] overflow-x-auto leading-relaxed">
                  {item.lean4}
                </pre>
              </div>
            </div>
          </div>

          {/* Dependencies metadata row */}
          {item.dependencies.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-[#57534E]">
              <span>Dipendenze formali:</span>
              {item.dependencies.map((dep, i) => (
                <React.Fragment key={dep}>
                  {i > 0 && <span aria-hidden="true">·</span>}
                  <button
                    onClick={() => setFocusedCode(dep)}
                    className="text-[#1E3A8A] hover:underline"
                  >
                    [{dep}]
                  </button>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Render Collapsible Children (Micro-steps / Sub-steps) */}
        {hasChildren && isExpanded && (
          <div className="space-y-2">
            {item.children!.map((child) => renderTreeItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      id="msc-explorer"
      className="py-14 border-b border-[#E5DEC9] bg-[#FBF9F5]"
    >
      <div className="max-w-[1360px] mx-auto px-6">
        {/* Top Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
          <div>
            <div className="text-xs tracking-widest uppercase text-[#9A3412] font-semibold mb-2">
              Sistema Espositivo Gerarchico e Numerato · Standard Internazionale MSC2020
            </div>
            <h2 className="text-3xl lg:text-4xl font-semibold text-[#1C1917] tracking-tight text-balance">
              Tractatus Matematico MSC: Tripla Corrispondenza (NL · Simbolico · Lean 4), Passaggi a Comparsa e Proiezione a Grafo
            </h2>
            <p className="mt-2 text-sm text-[#57534E] max-w-3xl leading-relaxed">
              Ogni disciplina, sezione, teorema e singolo micro-passaggio
              possiede un codice gerarchico basato sulla{" "}
              <a
                href="https://en.wikipedia.org/wiki/Mathematics_Subject_Classification"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1E3A8A] underline"
              >
                Mathematics Subject Classification (MSC2020)
              </a>
              . Espandi i passaggi desiderati, seleziona una singola porzione di
              proposizione o un&apos;intera sezione e visualizzala
              istantaneamente come testo strutturato, come grafo deduttivo e con
              grafici matematici 2D/3D.
            </p>
          </div>

          {/* Language & Display Mode Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Multilingual Switcher */}
            <div className="flex items-center gap-1 p-1 bg-[#F3EFE6] border border-[#E5DEC9] rounded-lg">
              {(Object.keys(LANGUAGE_LABELS) as LanguageCode[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                    activeLang === lang
                      ? "bg-[#1E3A8A] text-white"
                      : "text-[#57534E] hover:text-[#1C1917]"
                  }`}
                >
                  {LANGUAGE_LABELS[lang].native}
                </button>
              ))}
            </div>

            {/* View Mode Switcher: Text / Split / Graph */}
            <div className="flex items-center gap-1 p-1 bg-[#F3EFE6] border border-[#E5DEC9] rounded-lg">
              <button
                onClick={() => setViewMode("text")}
                className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${
                  viewMode === "text"
                    ? "bg-[#1C1917] text-[#FBF9F5]"
                    : "text-[#57534E] hover:text-[#1C1917]"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Solo Testo
              </button>
              <button
                onClick={() => setViewMode("split")}
                className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${
                  viewMode === "split"
                    ? "bg-[#1C1917] text-[#FBF9F5]"
                    : "text-[#57534E] hover:text-[#1C1917]"
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                Testo + Grafo + 2D/3D
              </button>
              <button
                onClick={() => setViewMode("graph")}
                className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${
                  viewMode === "graph"
                    ? "bg-[#1C1917] text-[#FBF9F5]"
                    : "text-[#57534E] hover:text-[#1C1917]"
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                Solo Grafo
              </button>
            </div>
          </div>
        </div>

        {/* Control Strip: Quick Slice Selection & Progressive Disclosure */}
        <div className="p-4 bg-[#F3EFE6] border border-[#E5DEC9] rounded-lg mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#1C1917]">
              Seleziona porzione da proiettare in Grafo:
            </span>
            <button
              onClick={() => selectPresetSlice("micro_sqrt2")}
              className="px-2.5 py-1 text-xs font-mono bg-[#FBF9F5] hover:bg-[#EBE6DF] border border-[#D6CEBE] rounded text-[#1C1917]"
            >
              Micro-porzione [11J68.3.1 → .4] (Passaggi √2)
            </button>
            <button
              onClick={() => selectPresetSlice("section_11J68")}
              className="px-2.5 py-1 text-xs font-mono bg-[#FBF9F5] hover:bg-[#EBE6DF] border border-[#D6CEBE] rounded text-[#1C1917]"
            >
              Sezione [11J68] (Approssimazione Diofantea)
            </button>
            <button
              onClick={() => selectPresetSlice("primes_11A41")}
              className="px-2.5 py-1 text-xs font-mono bg-[#FBF9F5] hover:bg-[#EBE6DF] border border-[#D6CEBE] rounded text-[#1C1917]"
            >
              Sezione [11A41] (Primi di Euclide)
            </button>
            <button
              onClick={() => selectPresetSlice("all_msc")}
              className="px-2.5 py-1 text-xs font-mono bg-[#FBF9F5] hover:bg-[#EBE6DF] border border-[#D6CEBE] rounded text-[#1C1917]"
            >
              Intero Albero MSC ({allItems.length} nodi)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="px-2.5 py-1 text-xs font-medium bg-[#FBF9F5] hover:bg-[#EBE6DF] border border-[#D6CEBE] rounded text-[#1C1917] flex items-center gap-1"
            >
              <Maximize2 className="w-3 h-3" />
              Espandi tutti i micro-passaggi
            </button>
            <button
              onClick={collapseToPropositions}
              className="px-2.5 py-1 text-xs font-medium bg-[#FBF9F5] hover:bg-[#EBE6DF] border border-[#D6CEBE] rounded text-[#1C1917] flex items-center gap-1"
            >
              <Minimize2 className="w-3 h-3" />
              Comprimi ai teoremi
            </button>
          </div>
        </div>

        {/* Main Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Hierarchical Numbered Text View */}
          {(viewMode === "split" || viewMode === "text") && (
            <div
              className={`${
                viewMode === "text" ? "lg:col-span-12" : "lg:col-span-7"
              } space-y-4`}
            >
              <div className="flex items-center justify-between text-xs text-[#57534E] px-1">
                <span>
                  Esposizione Gerarchica Numerata (Clicca su qualsiasi numero{" "}
                  <code>[MSC]</code> per ispezionare il grafico 2D/3D)
                </span>
                <span className="font-mono tabular-nums">
                  {selectedForGraph.size} elementi selezionati per il grafo
                </span>
              </div>

              <div>
                {MSC_HIERARCHY_TREE.map((rootDiscipline) =>
                  renderTreeItem(rootDiscipline, 0)
                )}
              </div>
            </div>
          )}

          {/* Right / Dynamic Subgraph of Selected Portion + 2D/3D Visual Companion */}
          {(viewMode === "split" || viewMode === "graph") && (
            <div
              className={`${
                viewMode === "graph" ? "lg:col-span-12" : "lg:col-span-5"
              } space-y-6 lg:sticky lg:top-20`}
            >
              {/* Dynamic Graph of Selected Portion */}
              <div className="bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-[#F3EFE6] border-b border-[#E5DEC9] flex items-center justify-between text-xs">
                  <div className="font-semibold text-[#1C1917] flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    Grafo Dinamico della Porzione Selezionata (
                    {dynamicGraph.nodes.length} nodi)
                  </div>
                  <span className="font-mono text-[#1E3A8A]">
                    Focus: [{focusedItem.code}]
                  </span>
                </div>

                <div className="p-2 bg-[#FBF9F5] overflow-x-auto">
                  <svg
                    viewBox="0 0 660 390"
                    className="w-full h-[310px] select-none"
                    role="img"
                    aria-label="Grafo dinamico dei passaggi e delle proposizioni MSC selezionate"
                  >
                    <defs>
                      <marker
                        id="msc-arrow-dep"
                        viewBox="0 0 10 10"
                        refX="24"
                        refY="5"
                        markerWidth="5"
                        markerHeight="5"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#1E3A8A" />
                      </marker>
                      <marker
                        id="msc-arrow-hier"
                        viewBox="0 0 10 10"
                        refX="24"
                        refY="5"
                        markerWidth="5"
                        markerHeight="5"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#9A3412" />
                      </marker>
                    </defs>

                    {/* Edges */}
                    {dynamicGraph.edges.map((e, idx) => {
                      const src = dynamicGraph.nodes.find(
                        (n) => n.item.code === e.from
                      );
                      const dst = dynamicGraph.nodes.find(
                        (n) => n.item.code === e.to
                      );
                      if (!src || !dst) return null;

                      const isHighlighted =
                        focusedCode === e.from || focusedCode === e.to;

                      return (
                        <line
                          key={idx}
                          x1={src.x}
                          y1={src.y}
                          x2={dst.x}
                          y2={dst.y}
                          stroke={
                            e.kind === "dependency" ? "#1E3A8A" : "#9A3412"
                          }
                          strokeWidth={isHighlighted ? 2.2 : 1.3}
                          strokeDasharray={
                            e.kind === "hierarchy" ? "4 2" : undefined
                          }
                          markerEnd={
                            e.kind === "dependency"
                              ? "url(#msc-arrow-dep)"
                              : "url(#msc-arrow-hier)"
                          }
                          opacity={isHighlighted ? 1 : 0.65}
                        />
                      );
                    })}

                    {/* Nodes */}
                    {dynamicGraph.nodes.map(({ item, x, y }) => {
                      const isFocusedNode = item.code === focusedCode;
                      return (
                        <g
                          key={item.code}
                          transform={`translate(${x}, ${y})`}
                          onClick={() => setFocusedCode(item.code)}
                          className="cursor-pointer"
                        >
                          <rect
                            x="-56"
                            y="-18"
                            width="112"
                            height="36"
                            rx="5"
                            fill={isFocusedNode ? "#1E3A8A" : "#F3EFE6"}
                            stroke={isFocusedNode ? "#1E3A8A" : "#1C1917"}
                            strokeWidth={isFocusedNode ? 2 : 1.2}
                          />
                          <text
                            textAnchor="middle"
                            y="-3"
                            fontSize="9.5"
                            fontWeight="700"
                            fontFamily="IBM Plex Mono"
                            fill={isFocusedNode ? "#FFFFFF" : "#1E3A8A"}
                          >
                            [{item.code}]
                          </text>
                          <text
                            textAnchor="middle"
                            y="10"
                            fontSize="8.5"
                            fill={isFocusedNode ? "#DBEAFE" : "#1C1917"}
                          >
                            {item.title[activeLang].slice(0, 17)}
                            {item.title[activeLang].length > 17 ? "…" : ""}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Focused Node Triple Summary inside Graph Card */}
                <div className="p-4 border-t border-[#E5DEC9] bg-[#F3EFE6]/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#1E3A8A]">
                      [{focusedItem.code}] {focusedItem.title[activeLang]}
                    </span>
                    <span className="text-[11px] text-[#57534E]">
                      {focusedItem.kindLabel[activeLang]}
                    </span>
                  </div>
                  <p className="text-[#1C1917]">
                    <strong>NL:</strong> {focusedItem.natural[activeLang]}
                  </p>
                  <div className="font-mono text-[11px] text-[#9A3412]">
                    <strong>Simbolico:</strong> {focusedItem.symbolic}
                  </div>
                  <pre className="p-2 bg-[#1C1917] text-[#FBF9F5] rounded font-mono text-[11px] overflow-x-auto">
                    {focusedItem.lean4}
                  </pre>
                </div>
              </div>

              {/* Accompanying 2D / 3D Mathematical Plotter */}
              <MathVisualCompanion2D3D
                plotType={activePlotType}
                activeCode={focusedItem.code}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
