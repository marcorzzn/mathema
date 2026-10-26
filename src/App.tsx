import React, { useState } from "react";
import { LanguageCode } from "./data/mathemaData";
import { MscHierarchicalExplorer } from "./components/MscHierarchicalExplorer";
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
              href="#msc-explorer"
              className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Gerarchia MSC
            </a>
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
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => scrollToSection("msc-explorer")}
              className="px-4 py-2 text-xs font-medium text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172554] transition-colors whitespace-nowrap shrink-0"
            >
              Esplora Sistema MSC
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
                    <span>Sistema Gerarchico MSC2020</span>
                    <span aria-hidden="true">·</span>
                    <span>Tripla Corrispondenza (NL · Simbolico · Lean 4)</span>
                    <span aria-hidden="true">·</span>
                    <span>CC BY-SA 4.0</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold text-[#1C1917] leading-[1.12] tracking-tight text-balance">
                    La matematica non è un libro da leggere. È un grafo da
                    esplorare.
                  </h1>

                  <p className="mt-6 text-base lg:text-lg text-[#44403C] leading-relaxed max-w-2xl">
                    <strong>Mathema</strong> organizza ogni disciplina,
                    sezione, teorema e micro-passaggio secondo la numerazione
                    gerarchica{" "}
                    <strong>Mathematics Subject Classification (MSC2020)</strong>
                    . Ad ogni enunciato e singolo passaggio corrispondono
                    simultaneamente la formulazione in{" "}
                    <strong>linguaggio naturale multilingue</strong>, la{" "}
                    <strong>sintassi simbolica formale</strong> e la{" "}
                    <strong>verifica in Lean 4</strong>, ispezionabili sia come
                    testo espandibile sia come grafo con grafici 2D e 3D.
                  </p>
                </div>

                {/* Primary & Secondary Actions */}
                <div className="mt-8 pt-6 border-t border-[#E5DEC9] flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => scrollToSection("msc-explorer")}
                    className="px-5 py-2.5 text-sm font-medium bg-[#1E3A8A] text-white rounded-lg hover:bg-[#172554] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                  >
                    Apri Esposizione Gerarchica MSC
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => scrollToSection("ponte")}
                    className="px-5 py-2.5 text-sm font-medium bg-[#F3EFE6] text-[#1C1917] border border-[#D6CEBE] rounded-lg hover:bg-[#EBE6DF] transition-colors whitespace-nowrap shrink-0"
                  >
                    Ponte NL ↔ Simbolico ↔ Lean 4
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
                  <span>TRIPLA CORRISPONDENZA &amp; NUMERAZIONE MSC2020</span>
                  <span className="text-[#14532D] font-semibold">
                    ✓ [11J68.3.2.a]
                  </span>
                </div>

                {/* Commutative Blueprint Diagram SVG */}
                <div className="my-4 bg-[#FBF9F5] border border-[#E5DEC9] rounded-md p-4">
                  <svg
                    viewBox="0 0 420 230"
                    className="w-full h-[205px]"
                    role="img"
                    aria-label="Diagramma della tripla corrispondenza NL, Sintassi Simbolica e Lean 4 su gerarchia MSC2020"
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
                      x="12"
                      y="18"
                      width="124"
                      height="64"
                      rx="5"
                      fill="#F3EFE6"
                      stroke="#1C1917"
                      strokeWidth="1.4"
                    />
                    <text
                      x="74"
                      y="40"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="700"
                      fill="#1C1917"
                    >
                      1. Linguaggio Naturale
                    </text>
                    <text
                      x="74"
                      y="56"
                      textAnchor="middle"
                      fontSize="8.5"
                      fontFamily="IBM Plex Mono"
                      fill="#57534E"
                    >
                      IT · EN · ES · ZH · AR
                    </text>
                    <text
                      x="74"
                      y="70"
                      textAnchor="middle"
                      fontSize="8"
                      fill="#78716C"
                    >
                      Passaggi a comparsa
                    </text>

                    {/* Top Center: Sintassi Simbolica Formale */}
                    <rect
                      x="148"
                      y="18"
                      width="124"
                      height="64"
                      rx="5"
                      fill="#FFF7ED"
                      stroke="#9A3412"
                      strokeWidth="1.4"
                    />
                    <text
                      x="210"
                      y="40"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="700"
                      fill="#9A3412"
                    >
                      2. Sintassi Simbolica
                    </text>
                    <text
                      x="210"
                      y="56"
                      textAnchor="middle"
                      fontSize="8.5"
                      fontFamily="IBM Plex Mono"
                      fill="#1C1917"
                    >
                      ∀ p,q, gcd(p,q)=1 ⇒ ...
                    </text>
                    <text
                      x="210"
                      y="70"
                      textAnchor="middle"
                      fontSize="8"
                      fill="#78716C"
                    >
                      Sequenti Γ ⊢ φ
                    </text>

                    {/* Top Right: Lean 4 / Mathlib */}
                    <rect
                      x="284"
                      y="18"
                      width="124"
                      height="64"
                      rx="5"
                      fill="#1E3A8A"
                      stroke="#1E3A8A"
                      strokeWidth="1.4"
                    />
                    <text
                      x="346"
                      y="40"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="700"
                      fill="#FFFFFF"
                    >
                      3. Codice Lean 4
                    </text>
                    <text
                      x="346"
                      y="56"
                      textAnchor="middle"
                      fontSize="8.5"
                      fontFamily="IBM Plex Mono"
                      fill="#DBEAFE"
                    >
                      Irrational (sqrt 2)
                    </text>
                    <text
                      x="346"
                      y="70"
                      textAnchor="middle"
                      fontSize="8"
                      fill="#93C5FD"
                    >
                      Mathlib / Tau Ceti
                    </text>

                    {/* Bottom Center: MSC2020 Tree + Dynamic Graph + 2D/3D Plots */}
                    <rect
                      x="35"
                      y="138"
                      width="350"
                      height="74"
                      rx="6"
                      fill="#FBF9F5"
                      stroke="#14532D"
                      strokeWidth="1.75"
                    />
                    <text
                      x="210"
                      y="160"
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight="700"
                      fill="#1C1917"
                    >
                      Numerazione MSC2020: [11-XX] → [11J68] → [11J68.3] → [11J68.3.2.a]
                    </text>
                    <text
                      x="210"
                      y="178"
                      textAnchor="middle"
                      fontSize="9"
                      fontFamily="IBM Plex Mono"
                      fill="#14532D"
                    >
                      Vista Testuale Espandibile ⇄ Vista Grafo di Porzioni ⇄ Grafici 2D/3D
                    </text>
                    <text
                      x="210"
                      y="196"
                      textAnchor="middle"
                      fontSize="8.5"
                      fill="#57534E"
                    >
                      Infrastruttura minimale zero-bloat · Rendering vettoriale istantaneo
                    </text>

                    {/* Connecting Lines */}
                    <line
                      x1="74"
                      y1="84"
                      x2="135"
                      y2="136"
                      stroke="#57534E"
                      strokeWidth="1.3"
                      strokeDasharray="3 2"
                    />
                    <line
                      x1="210"
                      y1="84"
                      x2="210"
                      y2="136"
                      stroke="#9A3412"
                      strokeWidth="1.4"
                    />
                    <line
                      x1="346"
                      y1="84"
                      x2="285"
                      y2="136"
                      stroke="#1E3A8A"
                      strokeWidth="1.4"
                    />
                  </svg>
                </div>

                <div className="text-xs text-[#44403C] flex items-center justify-between pt-2 border-t border-[#E5DEC9]">
                  <span className="inline-flex items-center gap-1.5 text-[#14532D] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Allineato a MSC2020, Mathlib4 e Palomar
                  </span>
                  <button
                    onClick={() => scrollToSection("manifesto")}
                    className="text-[#1E3A8A] font-medium hover:underline"
                  >
                    Leggi il Manifesto →
                  </button>
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Quantitative Proof Strip Below Hero Split */}
            <div className="mt-10 pt-8 border-t border-[#E5DEC9] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-[#F3EFE6]/60 border border-[#E5DEC9] rounded-lg">
                <div className="text-2xl font-bold font-mono tabular-nums text-[#1C1917]">
                  MSC2020 · 5 Livelli
                </div>
                <div className="text-xs font-semibold text-[#1C1917] mt-1">
                  Numerazione Gerarchica Totale
                </div>
                <p className="text-xs text-[#57534E] mt-1">
                  Disciplina (<code>11-XX</code>), Sezione (<code>11J68</code>),
                  Proposizione (<code>11J68.3</code>), Passo (
                  <code>11J68.3.2</code>) e Micro-risultato (
                  <code>11J68.3.2.a</code>).
                </p>
              </div>

              <div className="p-4 bg-[#F3EFE6]/60 border border-[#E5DEC9] rounded-lg">
                <div className="text-2xl font-bold font-mono tabular-nums text-[#1C1917]">
                  1 : 1 : 1
                </div>
                <div className="text-xs font-semibold text-[#1C1917] mt-1">
                  Tripla Corrispondenza Garantita
                </div>
                <p className="text-xs text-[#57534E] mt-1">
                  Ogni proposizione e ogni micro-passaggio unisce Linguaggio
                  Naturale (5 lingue), Sintassi Simbolica Formale e codice Lean
                  4.
                </p>
              </div>

              <div className="p-4 bg-[#F3EFE6]/60 border border-[#E5DEC9] rounded-lg">
                <div className="text-2xl font-bold font-mono tabular-nums text-[#1C1917]">
                  Testo ⇄ Grafo ⇄ 2D/3D
                </div>
                <div className="text-xs font-semibold text-[#1C1917] mt-1">
                  Proiezione Selettiva Istantanea
                </div>
                <p className="text-xs text-[#57534E] mt-1">
                  Seleziona un singolo frammento di prova o un&apos;intera
                  sezione MSC per visualizzarla come grafo deduttivo con
                  superfici 2D e 3D.
                </p>
              </div>

              <div className="p-4 bg-[#F3EFE6]/60 border border-[#E5DEC9] rounded-lg">
                <div className="text-2xl font-bold font-mono tabular-nums text-[#1C1917]">
                  Mathlib · Tau Ceti
                </div>
                <div className="text-xs font-semibold text-[#1C1917] mt-1">
                  Verifica e Standard Palomar
                </div>
                <p className="text-xs text-[#57534E] mt-1">
                  Conforme ai 10 valori delle librerie formali (Avigad, Buzzard
                  et al. 2026) con <code>formalization.yaml</code> e Comparator.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 0. Hierarchical Numbered MSC2020 Exposition (Text + Collapsible Micro-Steps + Dynamic Subgraph + 2D/3D Plots) */}
        <MscHierarchicalExplorer
          activeLang={activeLang}
          setActiveLang={setActiveLang}
          onSendToBridge={handleInspectInBridge}
        />

        {/* 1. Interactive Global Knowledge Graph Explorer */}
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

        {/* 4. 10-Layer Architecture, Formal Alignment (Tau Ceti/Formal Frontier/Palomar) & Roadmap */}
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
            <span>Classificazione: MSC2020</span>
            <span aria-hidden="true">·</span>
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
