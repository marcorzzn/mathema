import React, { useState } from "react";
import { LanguageCode } from "./data/mathemaData";
import { KnowledgeGraphSection } from "./components/KnowledgeGraphSection";
import { BridgeWorkbenchSection } from "./components/BridgeWorkbenchSection";
import { PedagogyMatrixSection } from "./components/PedagogyMatrixSection";
import { ArchitectureAndCatalogSection } from "./components/ArchitectureAndCatalogSection";
import { ManifestoEditorialSection } from "./components/ManifestoEditorialSection";
import { ArrowRight, ExternalLink, CheckCircle2 } from "lucide-react";

export default function App() {
  const [activeLang, setActiveLang] = useState<LanguageCode>("it");
  const [bridgeStatement, setBridgeStatement] = useState<string>("");

  const handleInspectInBridge = (statement: string, _leanCode: string) => {
    setBridgeStatement(statement);
    const el = document.getElementById("ponte");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-xs border-b border-[#E5DEC9]">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="text-xl font-bold tracking-tight text-[#1C1917] font-display whitespace-nowrap shrink-0"
          >
            Mathema
          </a>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57534E]">
            <a
              href="#grafo"
              className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Grafo
            </a>
            <a
              href="#ponte"
              className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Ponte NL ↔ Lean
            </a>
            <a
              href="#pedagogia"
              className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Pedagogia
            </a>
            <a
              href="#architettura"
              className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Architettura
            </a>
            <a
              href="#manifesto"
              className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Manifesto
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => scrollToSection("grafo")}
              className="px-4 py-2 text-xs font-medium text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172554] transition-colors whitespace-nowrap shrink-0"
            >
              Esplora il Grafo
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="top" className="flex-1">
        {/* Hero Section */}
        <section className="py-14 lg:py-20 border-b border-[#E5DEC9]">
          <div className="max-w-[1360px] mx-auto px-6">
            {/* 2-Column Hero Split with items-stretch */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* Left Column: Editorial Manifesto Lead (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  {/* Clean Unboxed Metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E] mb-4">
                    <span className="font-semibold text-[#1C1917]">
                      Marco Razzano
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Manifesto e Blueprint v0.1</span>
                    <span aria-hidden="true">·</span>
                    <span>17 Ottobre 2026</span>
                    <span aria-hidden="true">·</span>
                    <span>Licenza CC BY-SA 4.0</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold text-[#1C1917] leading-[1.12] tracking-tight text-balance">
                    La matematica non è un libro da leggere. È un grafo da
                    esplorare.
                  </h1>

                  <p className="mt-6 text-base lg:text-lg text-[#44403C] leading-relaxed max-w-2xl">
                    <strong>Mathema</strong> è l&apos;infrastruttura aperta,
                    multilingue, verificabile e navigabile della conoscenza
                    matematica, fisica e informatica — dall&apos;asilo al
                    post-doc. Unisce un grafo multi-relazionale di concetti a un
                    ponte bidirezionale tra linguaggio naturale e dimostrazioni
                    formali in <strong>Lean 4 / Mathlib</strong>.
                  </p>
                </div>

                {/* Primary & Secondary Actions */}
                <div className="mt-8 pt-6 border-t border-[#E5DEC9] flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => scrollToSection("grafo")}
                    className="px-5 py-2.5 text-sm font-medium bg-[#1E3A8A] text-white rounded-lg hover:bg-[#172554] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                  >
                    Naviga il Grafo della Conoscenza
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => scrollToSection("ponte")}
                    className="px-5 py-2.5 text-sm font-medium bg-[#F3EFE6] text-[#1C1917] border border-[#D6CEBE] rounded-lg hover:bg-[#EBE6DF] transition-colors whitespace-nowrap shrink-0"
                  >
                    Prova il Ponte NL ↔ Lean 4
                  </button>

                  <a
                    href="https://github.com/marcorzzn/Mathema"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 text-xs font-mono text-[#57534E] hover:text-[#1C1917] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    github.com/marcorzzn/Mathema
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Right Column: Interactive Architectural Diagram Card (5 cols) */}
              <div className="lg:col-span-5 bg-[#F3EFE6] border border-[#D6CEBE] rounded-lg p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-mono text-[#57534E] pb-3 border-b border-[#E5DEC9]">
                  <span>ARCHITETTURA DEL CICLO MATHEMA</span>
                  <span className="text-[#14532D] font-semibold">
                    ✓ Lean 4 + Mathlib4
                  </span>
                </div>

                {/* Commutative Blueprint Diagram SVG */}
                <div className="my-4 bg-[#FBF9F5] border border-[#E5DEC9] rounded-md p-4">
                  <svg
                    viewBox="0 0 420 230"
                    className="w-full h-[205px]"
                    role="img"
                    aria-label="Diagramma commutativo del ponte NL e Lean 4 in Mathema"
                  >
                    <defs>
                      <marker
                        id="hero-arrow"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#1E3A8A" />
                      </marker>
                    </defs>

                    {/* Top Left: Linguaggio Naturale */}
                    <rect
                      x="16"
                      y="20"
                      width="155"
                      height="64"
                      rx="6"
                      fill="#F3EFE6"
                      stroke="#1C1917"
                      strokeWidth="1.5"
                    />
                    <text
                      x="93"
                      y="43"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="700"
                      fill="#1C1917"
                    >
                      Linguaggio Naturale
                    </text>
                    <text
                      x="93"
                      y="60"
                      textAnchor="middle"
                      fontSize="9.5"
                      fontFamily="IBM Plex Mono"
                      fill="#57534E"
                    >
                      &ldquo;√2 è irrazionale&rdquo; (10 lingue)
                    </text>

                    {/* Top Right: Lean 4 / Mathlib */}
                    <rect
                      x="248"
                      y="20"
                      width="155"
                      height="64"
                      rx="6"
                      fill="#1E3A8A"
                      stroke="#1E3A8A"
                      strokeWidth="1.5"
                    />
                    <text
                      x="325"
                      y="43"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="700"
                      fill="#FFFFFF"
                    >
                      Formalizzazione Lean 4
                    </text>
                    <text
                      x="325"
                      y="60"
                      textAnchor="middle"
                      fontSize="9.5"
                      fontFamily="IBM Plex Mono"
                      fill="#DBEAFE"
                    >
                      Irrational (Real.sqrt 2)
                    </text>

                    {/* Horizontal Bidirectional Arrows */}
                    <line
                      x1="176"
                      y1="42"
                      x2="242"
                      y2="42"
                      stroke="#1E3A8A"
                      strokeWidth="1.75"
                      markerEnd="url(#hero-arrow)"
                    />
                    <text
                      x="209"
                      y="35"
                      textAnchor="middle"
                      fontSize="8.5"
                      fontFamily="IBM Plex Mono"
                      fill="#1E3A8A"
                    >
                      LoC-Decomp
                    </text>

                    <line
                      x1="242"
                      y1="64"
                      x2="176"
                      y2="64"
                      stroke="#1E3A8A"
                      strokeWidth="1.75"
                      markerEnd="url(#hero-arrow)"
                    />
                    <text
                      x="209"
                      y="78"
                      textAnchor="middle"
                      fontSize="8.5"
                      fontFamily="IBM Plex Mono"
                      fill="#9A3412"
                    >
                      Herald / Sketch
                    </text>

                    {/* Bottom Center: Multi-Relational Knowledge Graph */}
                    <rect
                      x="75"
                      y="142"
                      width="270"
                      height="68"
                      rx="6"
                      fill="#FBF9F5"
                      stroke="#14532D"
                      strokeWidth="1.75"
                    />
                    <text
                      x="210"
                      y="166"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="700"
                      fill="#1C1917"
                    >
                      Grafo Multi-Relazionale &amp; Pedagogia (L0–L7)
                    </text>
                    <text
                      x="210"
                      y="184"
                      textAnchor="middle"
                      fontSize="9.5"
                      fontFamily="IBM Plex Mono"
                      fill="#14532D"
                    >
                      urn:mathema:concept:sqrt2-irrationality
                    </text>
                    <text
                      x="210"
                      y="198"
                      textAnchor="middle"
                      fontSize="9"
                      fill="#57534E"
                    >
                      Prerequisiti · Multiprova · 8 Stili · Diagnosi LeanTutor
                    </text>

                    {/* Diagonal Connections */}
                    <line
                      x1="95"
                      y1="88"
                      x2="155"
                      y2="138"
                      stroke="#57534E"
                      strokeWidth="1.4"
                      strokeDasharray="3 2"
                    />
                    <line
                      x1="325"
                      y1="88"
                      x2="265"
                      y2="138"
                      stroke="#14532D"
                      strokeWidth="1.4"
                    />
                  </svg>
                </div>

                <div className="text-xs text-[#44403C] flex items-center justify-between pt-2 border-t border-[#E5DEC9]">
                  <span className="inline-flex items-center gap-1.5 text-[#14532D] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verifica sintattica, semantica e curatoriale
                  </span>
                  <button
                    onClick={() => scrollToSection("manifesto")}
                    className="text-[#1E3A8A] font-medium hover:underline"
                  >
                    Leggi nota su OpenMath →
                  </button>
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Quantitative Proof Strip Below Hero Split */}
            <div className="mt-10 pt-8 border-t border-[#E5DEC9] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-[#F3EFE6]/60 border border-[#E5DEC9] rounded-lg">
                <div className="text-2xl font-bold font-mono tabular-nums text-[#1C1917]">
                  96,7% · 93,09%
                </div>
                <div className="text-xs font-semibold text-[#1C1917] mt-1">
                  Benchmark Ponte NL ↔ Lean 4
                </div>
                <p className="text-xs text-[#57534E] mt-1">
                  Herald Translator (96,7% su miniF2F-test) e LoC-Decomp (93,09%
                  su PutnamBench con coerenza semantica, ICLR 2026).
                </p>
              </div>

              <div className="p-4 bg-[#F3EFE6]/60 border border-[#E5DEC9] rounded-lg">
                <div className="text-2xl font-bold font-mono tabular-nums text-[#1C1917]">
                  8 Livelli × 8 Stili
                </div>
                <div className="text-xs font-semibold text-[#1C1917] mt-1">
                  Architettura Pedagogica Adattiva
                </div>
                <p className="text-xs text-[#57534E] mt-1">
                  Dall&apos;asilo (Livello 0) al post-doc (Livello 7) con stili
                  Feynman, Bourbaki, Pólya, storico, computazionale e formale.
                </p>
              </div>

              <div className="p-4 bg-[#F3EFE6]/60 border border-[#E5DEC9] rounded-lg">
                <div className="text-2xl font-bold font-mono tabular-nums text-[#1C1917]">
                  10 Strati · 5 Verifiche
                </div>
                <div className="text-xs font-semibold text-[#1C1917] mt-1">
                  Oltre la Compilazione Senza Sorry
                </div>
                <p className="text-xs text-[#57534E] mt-1">
                  Verifica sintattica (Lean REPL), semantica (SAGE/LoC-Decomp),
                  pedagogica, curatoriale umana e comunitaria (ICML 2026).
                </p>
              </div>

              <div className="p-4 bg-[#F3EFE6]/60 border border-[#E5DEC9] rounded-lg">
                <div className="text-2xl font-bold font-mono tabular-nums text-[#1C1917]">
                  CC BY-SA 4.0 · CC0
                </div>
                <div className="text-xs font-semibold text-[#1C1917] mt-1">
                  Apertura Radicale e Federazione
                </div>
                <p className="text-xs text-[#57534E] mt-1">
                  Zero paywall, zero pubblicità, interoperabile con Wikidata,
                  Mathlib, OpenMath Content Dictionaries e zbMATH Open KG.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 1. Interactive Knowledge Graph Explorer */}
        <KnowledgeGraphSection
          activeLang={activeLang}
          setActiveLang={setActiveLang}
          onInspectInBridge={handleInspectInBridge}
        />

        {/* 2. Interactive NL <-> Lean 4 Bridge & LeanTutor Workbench */}
        <BridgeWorkbenchSection
          activeLang={activeLang}
          externalStatement={bridgeStatement}
        />

        {/* 3. Multi-Level & Multi-Style Pedagogical Matrix + Tennenbaum Simulator */}
        <PedagogyMatrixSection activeLang={activeLang} />

        {/* 4. 10-Layer Architecture, Ecosystem Resource Catalog & Roadmap */}
        <ArchitectureAndCatalogSection />

        {/* 5. Complete Manifesto & Blueprint Reader + BibTeX */}
        <ManifestoEditorialSection />
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="bg-[#F3EFE6] border-t border-[#D6CEBE] py-10">
        <div className="max-w-[1360px] mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-[#57534E]">
          <div>
            <span className="font-semibold text-[#1C1917] font-display text-sm">
              Mathema
            </span>{" "}
            — Manifesto e Blueprint (v0.1) di{" "}
            <strong className="text-[#1C1917]">Marco Razzano</strong>.{" "}
            <span>
              &ldquo;La matematica è la lingua con cui l&apos;universo è
              scritto. Mathema è il dizionario che tutti possono leggere.&rdquo;
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <span>Testi: CC BY-SA 4.0</span>
            <span aria-hidden="true">·</span>
            <span>Codice &amp; Lean 4: Apache 2.0</span>
            <span aria-hidden="true">·</span>
            <a
              href="https://github.com/marcorzzn/Mathema"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1E3A8A] hover:underline font-mono"
            >
              github.com/marcorzzn/Mathema
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
