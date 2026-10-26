import React, { useState } from "react";
import { Copy, Check, ExternalLink, BookOpen } from "lucide-react";

export const ManifestoEditorialSection: React.FC = () => {
  const [copiedBib, setCopiedBib] = useState(false);

  const bibtexString = `@misc{razzano_mathema2026,
  title  = {Mathema: An Open, Multilingual, Verifiable Knowledge Graph for Mathematics, Physics, and Computer Science},
  author = {Razzano, Marco and Mathema Consortium},
  year   = {2026},
  url    = {https://github.com/marcorzzn/Mathema},
  note   = {Manifesto and Blueprint, v0.1 — Aligned with Mathlib, Tau Ceti, Formal Frontier & Palomar Standards (CC BY-SA 4.0)}
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
            05. Documento Fondativo · Versione 0.1 · Ottobre 2026 · Licenza CC BY-SA 4.0
          </div>
          <h2 className="text-3xl lg:text-5xl font-semibold text-[#1C1917] mt-2 tracking-tight text-balance">
            Mathema — Manifesto e Blueprint
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E] mt-3">
            <span>Autore: Marco Razzano</span>
            <span aria-hidden="true">·</span>
            <span>Repository: github.com/marcorzzn/Mathema</span>
            <span aria-hidden="true">·</span>
            <span>Allineato a Mathlib · Tau Ceti · Formal Frontier · Palomar</span>
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
                MathML, Wikidata, Mathlib e Palomar.
              </p>
            </div>

            {/* Pull Quote */}
            <blockquote className="py-6 border-t border-b border-[#D6CEBE] text-2xl lg:text-3xl font-serif italic text-[#1C1917] text-balance">
              &ldquo;La conoscenza non vale la pena di essere posseduta finché
              non contribuisce alla nostra comprensione; il valore di una
              formalizzazione nasce dalla nostra capacità di usare i dati e
              interagire con essi.&rdquo;
            </blockquote>

            {/* Sette Fratture Sistemiche + Allineamento Avigad-Buzzard et al. */}
            <div>
              <h3 className="text-xl font-semibold text-[#1C1917] mb-3">
                2. Le Sette Fratture e il Problema dell&apos;Allineamento Formale
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
                  <strong>
                    2.4 Divario pedagogico, 2.5 Divario formale e il rischio dei
                    &ldquo;Code Dump&rdquo;:
                  </strong>{" "}
                  Come evidenziato da Jeremy Avigad, Kevin Buzzard, Johan
                  Commelin, Rémy Degenne, Kim Morrison, Oliver Nash e Adam Topaz
                  (2026), una formalizzazione scadente o monolitica (come i 13
                  milioni di righe non riutilizzabili per FLT o i dump in cui le
                  prove in linguaggio naturale sono impenetrabili o divergono dal
                  codice Lean, come nel caso Navier–Stokes) è peggio di nessuna
                  formalizzazione. Formalizzare serve a <em>fare più matematica e
                  capirla meglio</em>: esplorare generalizzazioni, collegare
                  rami diversi e rifattorizzare i concetti.
                </p>
                <p>
                  <strong>2.6 Sinergia con Mathlib, Tau Ceti, Formal Frontier e Palomar:</strong>{" "}
                  Mathema integra le pipeline <em>source-to-library</em> di{" "}
                  <strong>Formal Frontier</strong> (41 librerie da manuali), le
                  roadmap curate e revisionate avversariamente di{" "}
                  <strong>Tau Ceti</strong> (&gt;3M righe sopra Mathlib), le
                  definizioni di frontiera di <strong>The Annals Challenge</strong>{" "}
                  e <strong>Formal Conjectures</strong>, e richiede per ogni nodo
                  lo standard <strong>Palomar</strong> (<code>formalization.yaml</code>{" "}
                  + Comparator setup).
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
                    Verificabilità formale e deferenza a Mathlib · 3.
                    Multilinguismo nativo · 4. Pedagogia multilivello integrata
                    · 5. Grafo come struttura primaria · 6. Curatela umana e
                    controllo dei matematici · 7. Interoperabilità Wikidata /
                    Mathlib / Palomar · 8. Accessibilità WCAG 2.2 AA · 9.
                    Sostenibilità non-profit e accademica · 10. La conoscenza
                    libera e comprensibile come diritto.
                  </p>
                </div>
                <div className="p-4 bg-[#F3EFE6] border border-[#E5DEC9] rounded-md space-y-1.5">
                  <div className="font-semibold text-sm text-[#9A3412]">
                    Cosa NON È Mathema
                  </div>
                  <p className="leading-relaxed">
                    Non è un &ldquo;code dump&rdquo; AI non revisionato da
                    milioni di righe che nessuno usa. Non è uno scraping che
                    ignora le licenze o la provenienza delle idee. Non sostituisce
                    l&apos;insegnante né il matematico. Non lascia divergere
                    l&apos;enunciato informale da quello formale (grazie al
                    Comparator Palomar e a LoC-Decomp). Non ha paywall né
                    tracciamento commerciale.
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
                  <dt className="text-[#57534E]">Standard Registro</dt>
                  <dd className="font-mono text-[#1C1917]">
                    Palomar formalization.yaml
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

            {/* Key Academic References (Section 16.1 + 2026 Formalization Alignment) */}
            <div className="p-6 bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                16.1 Riferimenti Scientifici e Comunitari (2025–2026)
              </div>
              <ul className="space-y-2 text-xs text-[#44403C]">
                <li>
                  <strong className="text-[#1C1917]">
                    Avigad, Buzzard, Commelin, Degenne, Morrison, Nash &amp; Topaz (2026):
                  </strong>{" "}
                  Allineamento della formalizzazione su larga scala, i 10 valori
                  di Mathlib (Premio Demailly 2026), Tau Ceti, Formal Frontier e
                  Palomar.
                </li>
                <li>
                  <strong className="text-[#1C1917]">
                    Sorries Are Not the Hard Part (ICML 2026):
                  </strong>{" "}
                  Valutazione della qualità delle definizioni e delle API oltre
                  la compilazione senza <code>sorry</code>.
                </li>
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
                  <strong className="text-[#1C1917]">LeanTutor (UC Berkeley, AAAI 2026):</strong>{" "}
                  Tutoring verificato con diagnosi formale dei passaggi.
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
