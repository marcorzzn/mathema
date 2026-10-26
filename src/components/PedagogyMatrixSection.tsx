import React, { useState } from "react";
import {
  PEDAGOGICAL_LEVELS,
  PEDAGOGICAL_STYLES,
  PedagogicalStyle,
  LanguageCode,
} from "../data/mathemaData";
import { GraduationCap, Sliders, Layers } from "lucide-react";

interface PedagogyMatrixSectionProps {
  activeLang: LanguageCode;
}

const SQRT2_MATRIX_CONTENT: Record<
  number,
  Record<
    PedagogicalStyle,
    { title: string; body: string; formalOrFormula: string }
  >
> = {
  0: {
    child: {
      title: "Il Gioco dei Quadrati Gemelli (Asilo · 3–5 anni)",
      body: "Prendiamo due quadratini identici fatti di mattoncini (ognuno da 4 pezzi, o 9 pezzi). Proviamo a metterli insieme per formare un solo quadrato grande perfetto senza tagliare nessun mattoncino: con 4 + 4 = 8 mattoncini non ci riusciamo (ci vorrebbero 9 mattoncini!).",
      formalOrFormula: "2 × □ ≠ □ (con tessere intere)",
    },
    intuitive: {
      title: "Piegare un Foglio Magico",
      body: "Se pieghi a metà un normale foglio da disegno (formato A4), il rettangolo più piccolo ha esattamente la stessa forma di quello grande! Questo succede perché il lato lungo è un numero speciale che non finisce mai.",
      formalOrFormula: "Rapporto foglio A4 = √2 ≈ 1,414...",
    },
    axiomatic: {
      title: "Regola delle Coppie Pari e Dispari",
      body: "Ogni gruppo di oggetti o si divide in coppie perfette (pari) oppure lascia fuori un amico da solo (dispari).",
      formalOrFormula: "Pari + Pari = Pari · Dispari × Dispari = Dispari",
    },
    problem_solving: {
      title: "Caccia al Quadrato Doppio",
      body: "Prova i primi quadrati: 1×1=1, 2×2=4, 3×3=9, 4×4=16, 5×5=25. Nessuno di questi numeri è esattamente il doppio di un altro nella stessa lista!",
      formalOrFormula: "{1, 4, 9, 16, 25} ∩ {2, 8, 18, 32, 50} = ∅",
    },
    historical: {
      title: "Il Segreto dei Pitagorici",
      body: "Nell'antica Grecia una scuola di pensatori credeva che tutte-tutte le lunghezze si potessero contare con i passi interi, finché guardarono la linea obliqua dentro un quadrato.",
      formalOrFormula: "Diagonale di lato 1 = √2",
    },
    computational: {
      title: "Costruire Scale sempre più Vicine",
      body: "3 passi diviso 2 (1,5) è un po' troppo lungo; 7 passi diviso 5 (1,4) è un pizzico corto; 17 diviso 12 è quasi perfetto!",
      formalOrFormula: "1/1 → 3/2 → 7/5 → 17/12 → 41/29",
    },
    formal: {
      title: "Regola Infallibile del Gioco",
      body: "Il computer controlla che non ci siano trucchi: se una regola dice che i mattoncini sono interi, non puoi dividerli a metà.",
      formalOrFormula: "decide : 2 * 2^2 ≠ 3^2",
    },
    applied: {
      title: "Perché i Fogli A4, A5, A6 vanno d'accordo",
      body: "Quando la fotocopiatrice rimpicciolisce due pagine A4 su un solo foglio A4, niente viene tagliato o deformato grazie a √2!",
      formalOrFormula: "297 mm / 210 mm ≈ 1,41428...",
    },
  },
  3: {
    intuitive: {
      title: "Il Tappeto di Tennenbaum (Superiori · Intuizione Geometrica)",
      body: "Se esistesse un quadrato intero di lato p equivalente a due quadrati di lato q (p² = 2q²), potremmo adagiare i due quadrati q negli angoli opposti del quadrato p. Al centro si sovrapporrebbero in un quadrato di lato (2q - p) e lascerebbero scoperti due quadratini agli angoli di lato (p - q). Ma allora il quadrato centrale avrebbe area esattamente doppia di ciascuno dei due quadratini d'angolo: avremmo costruito una coppia intera ancora più piccola, all'infinito!",
      formalOrFormula: "(2q - p)² = 4q² - 4pq + p² = 2p² - 4pq + 2q² = 2(p - q)²",
    },
    axiomatic: {
      title: "Dimostrazione Deduttiva tramite il Lemma di Euclide",
      body: "Siano p, q ∈ ℕ⁺ con gcd(p, q) = 1. Da p² = 2q² segue che il primo 2 divide p². Poiché 2 è primo, per il Lemma di Euclide 2 divide p; posto p = 2k, si ha 4k² = 2q² ⇒ q² = 2k², onde 2 divide q, contraddicendo gcd(p, q) = 1.",
      formalOrFormula: "gcd(p, q) = 1 ∧ p² = 2q²  ⇒  2 ∣ gcd(p, q)  ⇒  ⊥",
    },
    problem_solving: {
      title: "Euristica di Pólya: Cercare l'Invariante Nascosto",
      body: "Perché la sostituzione p = 2k funziona? Perché ogni volta che moltiplichi per 2 l'esponente del fattore primo 2 aumenta di 1 (cambia parità), mentre quando elevi al quadrato raddoppia (diventa sempre pari). L'invariante che spezza l'equazione è la parità dell'esponente di 2!",
      formalOrFormula: "v₂(p²) = 2·v₂(p) (pari)  ≠  v₂(2q²) = 1 + 2·v₂(q) (dispari)",
    },
    historical: {
      title: "Dal Libro X di Euclide alla Teoria delle Proporzioni di Eudosso",
      body: "La scoperta di Ippaso obbligò la matematica greca a distinguere tra aritmetica discreta (numeri interi) e grandezze geometriche continue, superata solo nel V libro degli Elementi con la definizione di rapporti uguali di Eudosso (precursore delle sezioni di Dedekind).",
      formalOrFormula: "Euclide, Elementi X.117 · Aristotele, Analitici Primi I.23",
    },
    computational: {
      title: "Frazione Continua Periodica e Successione di Pell-Teone",
      body: "Poiché (√2 - 1)(√2 + 1) = 1, vale √2 = 1 + 1/(1 + √2) = [1; 2, 2, 2, …]. I convergenti pₙ/qₙ soddisfano la ricorrenza lineare pₙ₊₁ = pₙ + 2qₙ, qₙ₊₁ = pₙ + qₙ e risolvono l'equazione di Pell pₙ² - 2qₙ² = (-1)ⁿ (scarto minimo ±1, mai 0!).",
      formalOrFormula: "pₙ² - 2qₙ² = (-1)ⁿ ≠ 0   ∀ n ∈ ℕ",
    },
    formal: {
      title: "Formalizzazione Costruttiva in Lean 4",
      body: "In Lean 4 non serve la logica classica per provare ¬(∃ p q, ...): il tipo Irrational x è definito come x ∉ Set.range (Rat.cast : ℚ → ℝ), cioè una funzione che trasforma un'ipotetica coppia razionale in False.",
      formalOrFormula: "theorem irrational_sqrt_two : Irrational (Real.sqrt 2)",
    },
    child: {
      title: "Laboratorio con Carta Millimetrata",
      body: "Disegna un quadrato di lato 10 quadretti: la diagonale è vicina a 14 quadretti (14² = 196 ≈ 200). Con lato 12 quadretti la diagonale è vicina a 17 (17² = 289 ≈ 288). Ci si avvicina sempre di più a 1 unità di scarto, senza mai toccare 0.",
      formalOrFormula: "17² = 289   mentre   2 × 12² = 288   (scarto = +1)",
    },
    applied: {
      title: "Standard Internazionale ISO 216 e Diaframmi Fotografici",
      body: "Oltre alla serie cartacea A0–A4 (in cui A0 ha area 1 m² e lati in rapporto √2), le scale dei diaframmi fotografici (f/1.4, f/2, f/2.8, f/4, f/5.6) procedono per potenze di √2 perché dimezzare l'area del foro circolare richiede dividere il diametro per √2.",
      formalOrFormula: "Area(D / √2) = π (D / 2√2)² = ½ Area(D)",
    },
  },
};

export const PedagogyMatrixSection: React.FC<PedagogyMatrixSectionProps> = () => {
  const [selectedLevel, setSelectedLevel] = useState<number>(3);
  const [selectedStyle, setSelectedStyle] =
    useState<PedagogicalStyle>("intuitive");

  // Interactive Pell / Rational Approximation Explorer state (Two-Zone Sandbox)
  const [pellStep, setPellStep] = useState<number>(3); // index into Pell convergents

  const pellConvergents = [
    { step: 0, p: 1, q: 1, p2: 1, twoQ2: 2, diff: -1 },
    { step: 1, p: 3, q: 2, p2: 9, twoQ2: 8, diff: 1 },
    { step: 2, p: 7, q: 5, p2: 49, twoQ2: 50, diff: -1 },
    { step: 3, p: 17, q: 12, p2: 289, twoQ2: 288, diff: 1 },
    { step: 4, p: 41, q: 29, p2: 1681, twoQ2: 1682, diff: -1 },
    { step: 5, p: 99, q: 70, p2: 9801, twoQ2: 9800, diff: 1 },
    { step: 6, p: 239, q: 169, p2: 57121, twoQ2: 57122, diff: -1 },
  ];

  const currentPell = pellConvergents[pellStep] || pellConvergents[3];
  const approxValue = (currentPell.p / currentPell.q).toFixed(7);
  const absError = Math.abs(
    currentPell.p / currentPell.q - Math.SQRT2
  ).toExponential(2);

  // Get explanation for current level & style (fallback gracefully across levels)
  const activeTier = selectedLevel <= 1 ? 0 : 3;
  const activeCard =
    SQRT2_MATRIX_CONTENT[activeTier][selectedStyle] ||
    SQRT2_MATRIX_CONTENT[3].intuitive;
  const levelInfo =
    PEDAGOGICAL_LEVELS.find((l) => l.level === selectedLevel) ||
    PEDAGOGICAL_LEVELS[3];
  const styleInfo =
    PEDAGOGICAL_STYLES.find((s) => s.id === selectedStyle) ||
    PEDAGOGICAL_STYLES[0];

  return (
    <section id="pedagogia" className="py-16 border-b border-[#E5DEC9]">
      <div className="max-w-[1360px] mx-auto px-6">
        {/* Section Header */}
        <div className="mb-8">
          <div className="text-xs tracking-widest uppercase text-[#78716C] mb-2">
            03. Strato 7 · Pedagogia Integrata (8 Livelli × 8 Stili Cognitivi)
          </div>
          <h2 className="text-3xl lg:text-4xl font-semibold text-[#1C1917] tracking-tight text-balance">
            Dall&apos;Asilo al Post-Doc: Spiegazioni Adattive e Laboratori Interattivi
          </h2>
          <p className="mt-2 text-base text-[#57534E] max-w-3xl leading-relaxed">
            I libri di testo tradizionali parlano con una sola voce a un solo
            livello. In Mathema ogni nodo del grafo possiede viste calibrate
            sull&apos;età, sul bagaglio di prerequisiti e sullo stile cognitivo
            dello studente (Feynman, Bourbaki, Pólya, Montessori, Knuth).
          </p>
        </div>

        {/* Two-Zone Sandbox Layout (Education Reference Section 2.A) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Zone (7 cols): Interactive Visual Stage + Adaptive Explanation */}
          <div className="lg:col-span-7 bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg p-6 flex flex-col justify-between">
            <div>
              {/* Unboxed Metadata Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#57534E] pb-4 border-b border-[#E5DEC9]">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#1E3A8A]" />
                  <span className="font-semibold text-[#1C1917]">
                    {levelInfo.name}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Stile {styleInfo.label} ({styleInfo.mentor})</span>
                </div>
                <span className="font-mono text-[#9A3412]">
                  urn:mathema:concept:sqrt2-irrationality
                </span>
              </div>

              {/* Adaptive Explanation Content */}
              <div className="mt-5">
                <h3 className="text-xl font-semibold text-[#1C1917]">
                  {activeCard.title}
                </h3>
                <p className="mt-2.5 text-sm text-[#1C1917] leading-relaxed">
                  {activeCard.body}
                </p>
                <div className="mt-4 p-3 bg-[#F3EFE6] border border-[#E5DEC9] rounded-md font-mono text-xs text-[#1E3A8A]">
                  Invariante chiave: {activeCard.formalOrFormula}
                </div>
              </div>

              {/* Interactive Geometric & Arithmetic Simulation Canvas */}
              <div className="mt-6 pt-5 border-t border-[#E5DEC9]">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                      Laboratorio Interattivo: Tappeto di Tennenbaum &amp; Scale di Teone-Pell
                    </div>
                    <p className="text-xs text-[#57534E]">
                      Esplora perché p² non può mai eguagliare esattamente 2q²:
                      lo scarto p² − 2q² oscilla perpetuamente tra −1 e +1.
                    </p>
                  </div>
                  <div className="text-xs font-mono tabular-nums text-[#14532D] bg-[#F3EFE6] px-2.5 py-1 rounded border border-[#D6CEBE]">
                    p/q = {currentPell.p}/{currentPell.q} ≈ {approxValue}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#F3EFE6]/60 border border-[#E5DEC9] rounded-lg p-4">
                  {/* Interactive SVG Geometric Square Comparison */}
                  <div className="md:col-span-6 flex justify-center">
                    <svg
                      viewBox="0 0 260 210"
                      className="w-full max-w-[260px] h-[195px]"
                      role="img"
                      aria-label="Visualizzazione geometrica di Tennenbaum per radice di 2"
                    >
                      {/* Outer Square of side p */}
                      <rect
                        x="25"
                        y="15"
                        width="160"
                        height="160"
                        fill="#FBF9F5"
                        stroke="#1C1917"
                        strokeWidth="2"
                      />
                      {/* Bottom-left q square */}
                      <rect
                        x="25"
                        y="62"
                        width="113"
                        height="113"
                        fill="#1E3A8A"
                        fillOpacity="0.16"
                        stroke="#1E3A8A"
                        strokeWidth="1.5"
                      />
                      {/* Top-right q square */}
                      <rect
                        x="72"
                        y="15"
                        width="113"
                        height="113"
                        fill="#1E3A8A"
                        fillOpacity="0.16"
                        stroke="#1E3A8A"
                        strokeWidth="1.5"
                      />
                      {/* Central Overlap Square (2q - p) */}
                      <rect
                        x="72"
                        y="62"
                        width="66"
                        height="66"
                        fill="#9A3412"
                        fillOpacity="0.28"
                        stroke="#9A3412"
                        strokeWidth="2"
                      />
                      {/* Uncovered Top-Left Corner (p - q) */}
                      <rect
                        x="25"
                        y="15"
                        width="47"
                        height="47"
                        fill="#FEF3C7"
                        stroke="#78350F"
                        strokeWidth="1.2"
                        strokeDasharray="3 2"
                      />
                      {/* Uncovered Bottom-Right Corner (p - q) */}
                      <rect
                        x="138"
                        y="128"
                        width="47"
                        height="47"
                        fill="#FEF3C7"
                        stroke="#78350F"
                        strokeWidth="1.2"
                        strokeDasharray="3 2"
                      />

                      {/* Labels */}
                      <text
                        x="105"
                        y="98"
                        textAnchor="middle"
                        fontSize="10"
                        fontFamily="IBM Plex Mono"
                        fontWeight="600"
                        fill="#7C2D12"
                      >
                        (2q-p)²
                      </text>
                      <text
                        x="48"
                        y="42"
                        textAnchor="middle"
                        fontSize="9"
                        fontFamily="IBM Plex Mono"
                        fill="#78350F"
                      >
                        (p-q)²
                      </text>
                      <text
                        x="161"
                        y="155"
                        textAnchor="middle"
                        fontSize="9"
                        fontFamily="IBM Plex Mono"
                        fill="#78350F"
                      >
                        (p-q)²
                      </text>
                      <text
                        x="105"
                        y="194"
                        textAnchor="middle"
                        fontSize="10"
                        fontFamily="IBM Plex Mono"
                        fill="#1C1917"
                      >
                        Lato grande p = {currentPell.p} · Lato medio q ={" "}
                        {currentPell.q}
                      </text>
                    </svg>
                  </div>

                  {/* Quantitative Readout & Labeled Slider */}
                  <div className="md:col-span-6 space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <label
                          htmlFor="pell-slider"
                          className="font-medium text-[#1C1917]"
                        >
                          Iterazione razionale n:
                        </label>
                        <span className="font-mono tabular-nums font-semibold text-[#1E3A8A]">
                          Passo n = {currentPell.step} (frazione{" "}
                          {currentPell.p}/{currentPell.q})
                        </span>
                      </div>
                      <input
                        id="pell-slider"
                        type="range"
                        min={0}
                        max={6}
                        step={1}
                        value={pellStep}
                        onChange={(e) => setPellStep(Number(e.target.value))}
                        className="w-full accent-[#1E3A8A] cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-[#78716C] mt-0.5">
                        <span>1/1</span>
                        <span>3/2</span>
                        <span>7/5</span>
                        <span>17/12</span>
                        <span>41/29</span>
                        <span>99/70</span>
                        <span>239/169</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FBF9F5] border border-[#E5DEC9] rounded-md space-y-1.5 text-xs font-mono tabular-nums">
                      <div className="flex justify-between">
                        <span className="text-[#57534E]">Area quadrato p²:</span>
                        <span className="font-semibold text-[#1C1917]">
                          {currentPell.p}² = {currentPell.p2}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#57534E]">
                          Somma due quadrati 2q²:
                        </span>
                        <span className="font-semibold text-[#1E3A8A]">
                          2 × {currentPell.q}² = {currentPell.twoQ2}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-[#E5DEC9]">
                        <span className="text-[#57534E]">
                          Scarto di Pell (p² − 2q²):
                        </span>
                        <span className="font-semibold text-[#9A3412]">
                          {currentPell.diff > 0
                            ? `+${currentPell.diff} (Eccesso)`
                            : `${currentPell.diff} (Difetto)`}{" "}
                          ≠ 0
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-[#57534E]">
                        <span>Errore |p/q − √2|:</span>
                        <span>{absError}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Zone (5 cols): Control & Concept Deck (8 Levels + 8 Styles) */}
          <div className="lg:col-span-5 bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg p-6 flex flex-col justify-between space-y-6">
            {/* Control 1: 8 Pedagogical Levels (Section 10.1) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="level-range-slider"
                  className="text-xs font-semibold uppercase tracking-wider text-[#1C1917] flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  Selettore di Livello (Sezione 10.1 Manifesto)
                </label>
                <span className="text-xs font-mono tabular-nums text-[#1E3A8A] font-semibold">
                  Livello {selectedLevel} / 7 ({levelInfo.ageRange})
                </span>
              </div>

              <input
                id="level-range-slider"
                type="range"
                min={0}
                max={7}
                step={1}
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(Number(e.target.value))}
                className="w-full accent-[#1E3A8A] cursor-pointer mb-3"
              />

              <div className="grid grid-cols-2 gap-1.5">
                {PEDAGOGICAL_LEVELS.map((lvl) => (
                  <button
                    key={lvl.level}
                    onClick={() => setSelectedLevel(lvl.level)}
                    className={`text-left px-3 py-2 rounded-md border text-xs transition-colors ${
                      selectedLevel === lvl.level
                        ? "bg-[#1E3A8A] text-white border-[#1E3A8A]"
                        : "bg-[#F3EFE6]/70 text-[#1C1917] border-[#E5DEC9] hover:bg-[#EBE6DF]"
                    }`}
                  >
                    <div className="font-semibold truncate">{lvl.name}</div>
                    <div
                      className={`text-[11px] truncate ${
                        selectedLevel === lvl.level
                          ? "text-[#E5DEC9]"
                          : "text-[#57534E]"
                      }`}
                    >
                      {lvl.focus}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Control 2: 8 Pedagogical Styles (Section 10.2) */}
            <div className="pt-4 border-t border-[#E5DEC9]">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#1C1917] flex items-center gap-1.5 mb-2.5">
                <Layers className="w-3.5 h-3.5 text-[#9A3412]" />
                8 Stili Esplicativi (Sezione 10.2 Manifesto)
              </div>

              <div className="grid grid-cols-2 gap-2">
                {PEDAGOGICAL_STYLES.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStyle(st.id)}
                    className={`text-left p-2.5 rounded-md border text-xs transition-colors ${
                      selectedStyle === st.id
                        ? "bg-[#1C1917] text-[#FBF9F5] border-[#1C1917]"
                        : "bg-[#F3EFE6]/70 text-[#1C1917] border-[#E5DEC9] hover:bg-[#EBE6DF]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold truncate">{st.label}</span>
                      <span
                        className={`text-[10px] font-mono shrink-0 ${
                          selectedStyle === st.id
                            ? "text-[#D6CEBE]"
                            : "text-[#78716C]"
                        }`}
                      >
                        {st.mentor}
                      </span>
                    </div>
                    <div
                      className={`text-[11px] mt-1 line-clamp-2 ${
                        selectedStyle === st.id
                          ? "text-[#E5DEC9]"
                          : "text-[#57534E]"
                      }`}
                    >
                      {st.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
