import React, { useState } from "react";
import { Copy, Check, ExternalLink, BookOpen } from "lucide-react";

export const ManifestoEditorialSection: React.FC = () => {
  const [copiedBib, setCopiedBib] = useState(false);

  const bibtexString = `@misc{razzano_mathema2026,
  title  = {Mathema: An Open, Multilingual, Verifiable Knowledge Graph for Mathematics, Physics, and Computer Science},
  author = {Razzano, Marco and Mathema Consortium},
  year   = {2026},
  url    = {https://github.com/marcorzzn/Mathema},
  note   = {Manifesto and Blueprint, v0.1 — CC BY-SA 4.0}
}`;

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtexString);
    setCopiedBib(true);
    setTimeout(() => setCopiedBib(false), 2000);
  };

  return (
    <section id="manifesto" className="py-16">
      <div className="max-w-[1360px] mx-auto px-6">
        {/* Editorial Kicker Header */}
        <div className="pb-8 border-b border-[#D6CEBE] mb-12">
          <div className="text-xs tracking-widest uppercase text-[#78716C]">
            05. Documento Fondativo · Versione 0.1 · 17 Ottobre 2026 · Licenza CC BY-SA 4.0
          </div>
          <h2 className="text-3xl lg:text-5xl font-semibold text-[#1C1917] mt-2 tracking-tight text-balance">
            Mathema — Manifesto e Blueprint
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E] mt-3">
            <span>Autore: Marco Razzano</span>
            <span aria-hidden="true">·</span>
            <span>Repository: github.com/marcorzzn/Mathema</span>
            <span aria-hidden="true">·</span>
            <span>Codice &amp; Formalizzazioni Lean: Apache 2.0</span>
          </div>
        </div>

        {/* Pattern D: Two-Column Asymmetric Reading Canvas (70% Main Essay / 30% Margin Rail) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left / Main Editorial Narrative (8 cols) */}
          <div className="lg:col-span-8 space-y-10 max-w-prose">
            {/* Opening Drop-Cap Vision */}
            <div>
              <h3 className="text-xl font-semibold text-[#1C1917] mb-3">
                1. Visione e Scelta del Nome Mathema
              </h3>
              <p className="text-base text-[#1C1917] leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#1E3A8A]">
                Costruire l&apos;infrastruttura aperta, multilingue,
                verificabile e navigabile della conoscenza matematica, fisica e
                informatica — dall&apos;asilo al post-doc — in modo che nessuna
                persona debba più essere esclusa dall&apos;apprendimento per
                barriere economiche, linguistiche, geografiche o pedagogiche.
                Poiché il nome &ldquo;OpenMath&rdquo; identifica già lo standard
                XML internazionale per i Content Dictionaries machine-readable,
                il progetto adotta il nome <strong>Mathema</strong> (dal greco{" "}
                <em>μάθημα</em>, ciò che viene appreso e conosciuto), ponendosi
                in piena interoperabilità con gli standard OpenMath 2 e 3,
                MathML, Wikidata e Lean 4.
              </p>
            </div>

            {/* Pull Quote (Editorial Reference Section 4: Top/Bottom Hairline Dividers, NO thick left border) */}
            <blockquote className="py-6 border-t border-b border-[#D6CEBE] text-2xl lg:text-3xl font-serif italic text-[#1C1917] text-balance">
              &ldquo;La matematica non è un libro da leggere. È un grafo da
              esplorare. Non è un corso, non è una wiki, non è un motore di
              ricerca: è tutte queste cose simultaneamente.&rdquo;
            </blockquote>

            {/* Sette Fratture Sistemiche */}
            <div>
              <h3 className="text-xl font-semibold text-[#1C1917] mb-3">
                2. Le Sette Fratture che Mathema Risolve
              </h3>
              <div className="space-y-4 text-sm text-[#1C1917] leading-relaxed">
                <p>
                  <strong>2.1 Frammentazione e 2.2 Accesso diseguale:</strong> La
                  conoscenza è dispersa in migliaia di manuali da 50–200 €,
                  corsi privati e repository con ontologie incompatibili. In
                  gran parte del mondo l&apos;accesso alla matematica superiore
                  resta un privilegio economico anziché un diritto.
                </p>
                <p>
                  <strong>2.3 Barriera linguistica e concettuale:</strong> La
                  matematica di frontiera è quasi interamente in inglese. Ma la
                  matematica non è solo lingua: è notazione, concetto, struttura.
                  Serve una traduzione concettuale nativa dentro il modello
                  dati, non pagine separate e disallineate.
                </p>
                <p>
                  <strong>2.4 Divario pedagogico e 2.5 Divario formale:</strong>{" "}
                  I testi tradizionali espongono <em>cosa</em> è vero in forma
                  compatta, nascondendo il <em>perché</em>, le scelte euristiche
                  e gli errori fecondi. Contemporaneamente, la matematica
                  informale e i proof assistant (Lean 4, Coq, Isabelle) vivono in
                  due mondi separati: il primo comprensibile ma non
                  verificabile, il secondo verificabile ma illeggibile.
                </p>
                <p>
                  <strong>2.6 Ricerca vs. Didattica e 2.7 Obsolescenza:</strong>{" "}
                  Mathlib formalizza la matematica di ricerca ma non ha
                  architettura pedagogica; molti progetti didattici open source
                  eccellenti muoiono per assenza di governance federata e
                  manutenzione continua.
                </p>
              </div>
            </div>

            {/* I Dieci Principi Fondamentali & Cosa NON è Mathema */}
            <div>
              <h3 className="text-xl font-semibold text-[#1C1917] mb-3">
                3. I Dieci Principi Fondamentali e i Confini Etici
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#1C1917]">
                <div className="p-4 bg-[#F3EFE6] border border-[#E5DEC9] rounded-md space-y-1.5">
                  <div className="font-semibold text-sm text-[#1E3A8A]">
                    Cosa È Mathema
                  </div>
                  <p className="leading-relaxed">
                    1. Apertura radicale (CC BY-SA 4.0, Apache 2.0, CC0) · 2.
                    Verificabilità formale · 3. Multilinguismo nativo · 4.
                    Pedagogia multilivello integrata · 5. Grafo come struttura
                    primaria · 6. Curatela umana sovrana · 7. Interoperabilità
                    Wikidata/Mathlib · 8. Accessibilità WCAG 2.2 AA · 9.
                    Sostenibilità federata · 10. Non-neutralità dichiarata: la
                    conoscenza deve essere libera.
                  </p>
                </div>
                <div className="p-4 bg-[#F3EFE6] border border-[#E5DEC9] rounded-md space-y-1.5">
                  <div className="font-semibold text-sm text-[#9A3412]">
                    Cosa NON È Mathema
                  </div>
                  <p className="leading-relaxed">
                    Non è uno scraping indiscriminato che ignora le licenze. Non
                    è un&apos;AI che inventa matematica senza verifica. Non è un
                    sostituto dell&apos;insegnante umano ma un&apos;infrastruttura
                    che lo potenzia. Non impone un&apos;unica ontologia rigida.
                    Non ha paywall, pubblicità né tracciamento commerciale.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right / Margin Notes, Academic References & BibTeX (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Curatorial Accession Card */}
            <div className="p-6 bg-[#F3EFE6] border border-[#D6CEBE] rounded-lg space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[#78716C]">
                Scheda del Progetto
              </div>
              <dl className="divide-y divide-[#E5DEC9] text-xs">
                <div className="py-2 flex justify-between gap-2">
                  <dt className="text-[#57534E]">Progetto</dt>
                  <dd className="font-semibold text-[#1C1917]">Mathema</dd>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <dt className="text-[#57534E]">Ideatore e Autore</dt>
                  <dd className="font-semibold text-[#1C1917]">
                    Marco Razzano
                  </dd>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <dt className="text-[#57534E]">Versione</dt>
                  <dd className="font-mono text-[#1C1917]">
                    0.1 — Bozza fondativa
                  </dd>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <dt className="text-[#57534E]">Licenza Testi / Dati</dt>
                  <dd className="font-mono text-[#1C1917]">
                    CC BY-SA 4.0 / CC0
                  </dd>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <dt className="text-[#57534E]">Licenza Codice / Lean</dt>
                  <dd className="font-mono text-[#1C1917]">Apache 2.0</dd>
                </div>
              </dl>

              <a
                href="https://github.com/marcorzzn/Mathema"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-[#1C1917] text-[#FBF9F5] rounded-md text-xs font-medium hover:bg-[#292524] transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Repository GitHub (marcorzzn/Mathema)
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Key Academic References (Section 16.1) */}
            <div className="p-6 bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                16.1 Riferimenti Scientifici Fondamentali
              </div>
              <ul className="space-y-2 text-xs text-[#44403C]">
                <li>
                  <strong className="text-[#1C1917]">LoC-Decomp (ICLR 2026):</strong>{" "}
                  Autoformalizzazione con controllo di coerenza semantica (93,09%
                  su PutnamBench).
                </li>
                <li>
                  <strong className="text-[#1C1917]">Herald Translator (ICLR 2025):</strong>{" "}
                  Traduzione Mathlib → NL (96,7% su miniF2F-test per enunciati).
                </li>
                <li>
                  <strong className="text-[#1C1917]">
                    Sorries Are Not the Hard Part (ICML 2026):
                  </strong>{" "}
                  Valutazione della qualità delle definizioni oltre la
                  compilazione senza sorry.
                </li>
                <li>
                  <strong className="text-[#1C1917]">LeanTutor (UC Berkeley, AAAI 2026):</strong>{" "}
                  Tutoring verificato con diagnosi formale dei passaggi.
                </li>
                <li>
                  <strong className="text-[#1C1917]">Lean-Sketch &amp; AutoformBot (2025–2026):</strong>{" "}
                  Deformalizzazione pedagogica e agenti per manuali.
                </li>
              </ul>
            </div>

            {/* BibTeX Citation Box (Section 17) */}
            <div className="p-6 bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                  17. Citazione Accademica (BibTeX)
                </span>
                <button
                  onClick={handleCopyBibtex}
                  className="px-2.5 py-1 text-xs font-medium bg-[#F3EFE6] hover:bg-[#EBE6DF] border border-[#D6CEBE] rounded-md flex items-center gap-1 transition-colors"
                >
                  {copiedBib ? (
                    <>
                      <Check className="w-3 h-3 text-[#14532D]" />
                      Copiato
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copia BibTeX
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 bg-[#1C1917] text-[#FBF9F5] rounded-md text-[11px] font-mono overflow-x-auto leading-relaxed">
                {bibtexString}
              </pre>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
