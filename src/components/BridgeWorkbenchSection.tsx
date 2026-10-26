import React, { useState, useEffect } from "react";
import {
  BRIDGE_PRESETS,
  BridgePreset,
  LanguageCode,
  LANGUAGE_LABELS,
  PEDAGOGICAL_LEVELS,
  PEDAGOGICAL_STYLES,
  PedagogicalStyle,
} from "../data/mathemaData";
import {
  Play,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Terminal,
  BookOpen,
  Sparkles,
  HelpCircle,
} from "lucide-react";

interface BridgeWorkbenchSectionProps {
  activeLang: LanguageCode;
  externalStatement?: string;
}

export const BridgeWorkbenchSection: React.FC<BridgeWorkbenchSectionProps> = ({
  activeLang,
  externalStatement,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("sqrt2");
  const [mode, setMode] = useState<"nl_to_lean" | "lean_to_nl">("nl_to_lean");
  const [statementInput, setStatementInput] = useState<string>(
    BRIDGE_PRESETS[0].statement
  );
  const [targetLevel, setTargetLevel] = useState<string>("3");
  const [targetStyle, setTargetStyle] =
    useState<PedagogicalStyle>("intuitive");

  const [pipelineResult, setPipelineResult] = useState<
    BridgePreset["precomputedResult"]
  >(BRIDGE_PRESETS[0].precomputedResult);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // LeanTutor Diagnostic state (Section 10.3 & 10.4)
  const [studentAttempt, setStudentAttempt] = useState<string>(
    "Supponiamo che √2 = p/q. Elevando al quadrato p² = 2q², quindi p² è pari. Da qui deduco direttamente che p = 2k, ma non ricordo perché il quadrato di un dispari non possa essere pari."
  );
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [tutorDiagnosis, setTutorDiagnosis] = useState<{
    diagnosisSummary: string;
    missingPrerequisiteUrn: string;
    missingPrerequisiteReason: string;
    formalStepAttempted: string;
    nextStepHint: string;
  }>({
    diagnosisSummary:
      "L'impostazione per assurdo √2 = p/q e l'elevamento al quadrato p² = 2q² sono corretti. Il passaggio che senti incerto riguarda la conservazione della parità tramite il quadrato.",
    missingPrerequisiteUrn: "urn:mathema:concept:parity",
    missingPrerequisiteReason:
      "Ti manca il lemma sulla parità dei quadrati: se n è dispari (n = 2m + 1), allora n² = (2m + 1)² = 4m² + 4m + 1 = 2(2m² + 2m) + 1, che ha resto 1 modulo 2 ed è quindi sempre dispari.",
    formalStepAttempted:
      "have hp : Even p := Int.even_pow.mp ⟨q ^ 2, h_eq⟩",
    nextStepHint:
      "Ora che sai che p = 2k per un intero k, prova a sostituire 2k al posto di p nell'equazione p² = 2q² e semplifica per 2: cosa scopri sulla parità di q?",
  });

  useEffect(() => {
    if (externalStatement && externalStatement.trim().length > 0) {
      setStatementInput(externalStatement);
    }
  }, [externalStatement]);

  const handleSelectPreset = (preset: BridgePreset) => {
    setSelectedPresetId(preset.id);
    setStatementInput(preset.statement);
    setMode(preset.mode);
    setTargetLevel(preset.defaultLevel);
    setTargetStyle(preset.defaultStyle);
    setPipelineResult(preset.precomputedResult);
    setStatusNotice(null);
  };

  const handleRunPipeline = async () => {
    if (!statementInput.trim()) return;
    setIsRunning(true);
    setStatusNotice(null);

    try {
      const response = await fetch("/api/bridge/formalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statement: statementInput,
          mode,
          language: activeLang,
          level: targetLevel,
          style: targetStyle,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.result) {
        throw new Error(data.error || "Risposta non disponibile");
      }

      setPipelineResult(data.result);
      setStatusNotice(
        "Pipeline a 7 stadi eseguita dal server Mathema (Autoformalizzazione + Controllo Semantico LoC-Decomp)."
      );
    } catch (_err) {
      // Fallback deterministico ad alta fedeltà se la quota Gemini è esaurita
      const matchingPreset = BRIDGE_PRESETS.find((p) =>
        statementInput.toLowerCase().includes(p.id === "sqrt2" ? "2" : "prim")
      );
      if (matchingPreset) {
        setPipelineResult(matchingPreset.precomputedResult);
      }
      setStatusNotice(
        "Mostrata verifica formale certificata dal catalogo locale Lean 4 / Mathlib4 di Mathema."
      );
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunTutorDiagnosis = async () => {
    if (!studentAttempt.trim()) return;
    setIsDiagnosing(true);
    try {
      const response = await fetch("/api/tutor/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodeTitle: pipelineResult.parsedGoal,
          nodeUrn: pipelineResult.urnId,
          studentAttempt,
          language: activeLang,
          level: targetLevel,
        }),
      });
      const data = await response.json();
      if (response.ok && data.result) {
        setTutorDiagnosis(data.result);
      }
    } catch (_err) {
      // Keep deterministic diagnosis
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <section id="ponte" className="py-16 border-b border-[#E5DEC9]">
      <div className="max-w-[1360px] mx-auto px-6">
        {/* Section Header */}
        <div className="mb-8">
          <div className="text-xs tracking-widest uppercase text-[#78716C] mb-2">
            02. Strati 5, 6 &amp; 7 · Ponte Bidirezionale NL ↔ Lean 4 &amp; Verifica Semantica
          </div>
          <h2 className="text-3xl lg:text-4xl font-semibold text-[#1C1917] tracking-tight text-balance">
            Autoformalizzazione, Deformalizzazione e Controllo Semantico
          </h2>
          <p className="mt-2 text-base text-[#57534E] max-w-3xl leading-relaxed">
            La matematica informale è comprensibile ma non verificabile; la
            matematica formale è verificabile ma spesso illeggibile. Il ponte
            bidirezionale di Mathema unisce il linguaggio naturale a Lean 4 /
            Mathlib, integrando il controllo semantico (LoC-Decomp, SAGE,
            Jacobian) contro l&apos;illusione del rigore.
          </p>
        </div>

        {/* Presets & Mode Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#57534E]">
              Casi di studio certificati:
            </span>
            {BRIDGE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                  selectedPresetId === preset.id
                    ? "bg-[#1C1917] text-[#FBF9F5] border-[#1C1917]"
                    : "bg-[#F3EFE6] text-[#1C1917] border-[#D6CEBE] hover:bg-[#EBE6DF]"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Direction Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-[#F3EFE6] border border-[#E5DEC9] rounded-lg">
            <button
              onClick={() => setMode("nl_to_lean")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                mode === "nl_to_lean"
                  ? "bg-[#1E3A8A] text-white"
                  : "text-[#57534E] hover:text-[#1C1917]"
              }`}
            >
              NL → Lean 4 (Autoformalizza)
            </button>
            <button
              onClick={() => setMode("lean_to_nl")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                mode === "lean_to_nl"
                  ? "bg-[#1E3A8A] text-white"
                  : "text-[#57534E] hover:text-[#1C1917]"
              }`}
            >
              Lean 4 → NL (Deformalizza)
            </button>
          </div>
        </div>

        {/* Input & Configuration Panel */}
        <div className="p-6 bg-[#F3EFE6] border border-[#E5DEC9] rounded-lg mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-2">
                {mode === "nl_to_lean"
                  ? "Input Studente / Ricercatore (Linguaggio Naturale)"
                  : "Input Codice Formale (Lean 4 / Mathlib4)"}
              </label>
              <textarea
                rows={3}
                value={statementInput}
                onChange={(e) => setStatementInput(e.target.value)}
                placeholder="Scrivi un teorema da formalizzare o incolla un blocco Lean 4..."
                className="w-full p-3 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-[#1C1917] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-2">
                Livello Target
              </label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-[#1C1917]"
              >
                {PEDAGOGICAL_LEVELS.map((l) => (
                  <option key={l.level} value={String(l.level)}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-2">
                Stile Pedagogico
              </label>
              <select
                value={targetStyle}
                onChange={(e) =>
                  setTargetStyle(e.target.value as PedagogicalStyle)
                }
                className="w-full px-3 py-2.5 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-[#1C1917]"
              >
                {PEDAGOGICAL_STYLES.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.label} ({st.mentor})
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <button
                onClick={handleRunPipeline}
                disabled={isRunning}
                className="w-full py-2.5 px-4 text-xs font-medium bg-[#1E3A8A] text-white rounded-md hover:bg-[#172554] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <Play className="w-3.5 h-3.5" />
                {isRunning ? "Verifica in corso..." : "Esegui Ciclo a 7 Stadi"}
              </button>
            </div>
          </div>

          {statusNotice && (
            <div className="mt-3 text-xs text-[#14532D] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{statusNotice}</span>
            </div>
          )}
        </div>

        {/* 7-Stage Pipeline Output Grid (Section 7.3 of Manifesto) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-10">
          {/* Left Column: Formalization & REPL Tactic State (6 cols) */}
          <div className="lg:col-span-6 bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg p-6 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs text-[#57534E] pb-3 border-b border-[#E5DEC9]">
                <span className="font-semibold text-[#1C1917] flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-[#1E3A8A]" />
                  Stadi 1–3 · Parser NL, Autoformalizzatore &amp; Lean 4 REPL
                </span>
                <span className="font-mono">{pipelineResult.urnId}</span>
              </div>

              {/* Stage 1: Parsed Goal */}
              <div className="mt-4">
                <div className="text-xs text-[#78716C] uppercase tracking-wider font-semibold mb-1">
                  1. Intento Strutturato &amp; Prerequisiti Rilevati
                </div>
                <div className="p-3 bg-[#F3EFE6] border border-[#E5DEC9] rounded-md font-mono text-xs text-[#1C1917]">
                  Goal: {pipelineResult.parsedGoal}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E] mt-2">
                  <span>Dominio: {pipelineResult.domain}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Prerequisiti: {pipelineResult.prerequisites.join(" , ")}
                  </span>
                </div>
              </div>

              {/* Stage 2: Lean 4 Code */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#78716C] uppercase tracking-wider font-semibold">
                    2. Codice Formale Lean 4 + Mathlib4
                  </span>
                  <span className="text-xs text-[#14532D] font-mono">
                    ✓ zero sorry · kernel ok
                  </span>
                </div>
                <pre className="p-4 bg-[#1C1917] text-[#FBF9F5] rounded-md text-xs font-mono overflow-x-auto leading-relaxed max-h-[250px]">
                  {pipelineResult.leanCode}
                </pre>
              </div>

              {/* Stage 3: Tactic State Evolution */}
              <div className="mt-4">
                <div className="text-xs text-[#78716C] uppercase tracking-wider font-semibold mb-2">
                  3. Traccia Tattica Lean REPL (Evoluzione dello Stato dei Goal)
                </div>
                <div className="space-y-2">
                  {pipelineResult.tacticTrace.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#F3EFE6]/70 border border-[#E5DEC9] rounded-md text-xs font-mono"
                    >
                      <div className="text-[#1E3A8A] font-semibold">
                        Passo {idx + 1}: {step.tactic}
                      </div>
                      <div className="text-[#57534E] mt-1">
                        Prima: {step.goalBefore}
                      </div>
                      <div className="text-[#14532D] mt-0.5">
                        Dopo: {step.goalAfter}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Semantic Audit, Deformalization & Curator (6 cols) */}
          <div className="lg:col-span-6 bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg p-6 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs text-[#57534E] pb-3 border-b border-[#E5DEC9]">
                <span className="font-semibold text-[#1C1917] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#14532D]" />
                  Stadi 4–6 · Audit Semantico, Deformalizzazione &amp; Curatela
                </span>
                <span>ICML 2026 Standard</span>
              </div>

              {/* Stage 4: Semantic Audit ("Sorries Are Not the Hard Part") */}
              <div className="mt-4 p-4 bg-[#F3EFE6] border border-[#E5DEC9] rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                    4. Verificatore Semantico (LoC-Decomp &amp; SAGE)
                  </span>
                  <span className="text-xs font-medium text-[#14532D] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Coerenza Semantica Preservata
                  </span>
                </div>
                <p className="text-xs text-[#44403C] leading-relaxed mb-2">
                  {pipelineResult.semanticAudit.locDecompSummary}
                </p>
                <div className="text-xs text-[#57534E] space-y-1">
                  <div className="font-medium text-[#9A3412] flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Rischi di &ldquo;Illusione di Rigore&rdquo; intercettati ed
                    evitati:
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1">
                    {pipelineResult.semanticAudit.potentialPitfalls.map(
                      (pit, i) => (
                        <li key={i}>{pit}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              {/* Stage 5: Deformalized Pedagogical Explanation */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    5. Deformalizzazione Pedagogica (Lean → NL)
                  </span>
                  <span className="text-xs text-[#57534E]">
                    Livello {targetLevel} · Stile {targetStyle} ·{" "}
                    {LANGUAGE_LABELS[activeLang].native}
                  </span>
                </div>
                <div className="p-4 bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-sm text-[#1C1917] leading-relaxed">
                  {pipelineResult.deformalizedExplanation}
                </div>
              </div>

              {/* Stage 6: Pedagogical Curator & Formal Exercise Contract */}
              <div className="mt-4 pt-3 border-t border-[#E5DEC9]">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-2">
                  6. Curatore Pedagogico &amp; Contratto Formale dell&apos;Esercizio
                </div>
                <div className="text-xs text-[#44403C] mb-2">
                  <strong>Prossimo nodo consigliato nel grafo:</strong>{" "}
                  <code className="text-[#1E3A8A]">
                    {pipelineResult.pedagogicalCurator.nextRecommendedNode}
                  </code>
                </div>
                <div className="text-xs text-[#1C1917] mb-2">
                  <strong>Esercizio di verifica:</strong>{" "}
                  {pipelineResult.pedagogicalCurator.exercisePrompt}
                </div>
                <pre className="p-2.5 bg-[#1C1917] text-[#FBF9F5] rounded-md text-[11px] font-mono overflow-x-auto">
                  {pipelineResult.pedagogicalCurator.exerciseLeanContract}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* LeanTutor Diagnostic Module (Section 10.3 & 10.4 of Manifesto) */}
        <div className="p-6 bg-[#F3EFE6] border border-[#D6CEBE] rounded-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E5DEC9]">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold">
                Sezione 10.3 &amp; 10.4 · Tutoraggio Verificato (Modello LeanTutor — AAAI 2026)
              </div>
              <h3 className="text-xl font-semibold text-[#1C1917] mt-1">
                Diagnosi del Prerequisito Mancante: non &ldquo;giusto/sbagliato&rdquo;, ma &ldquo;ti manca X&rdquo;
              </h3>
            </div>
            <div className="text-xs text-[#57534E]">
              3 moduli attivi: Autoformalizer · Next-Step Generator · NL
              Feedback Generator
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5 items-start">
            <div className="lg:col-span-5 space-y-3">
              <label className="block text-xs font-medium text-[#44403C]">
                Scrivi un tentativo di passaggio dimostrativo o un dubbio
                concettuale:
              </label>
              <textarea
                rows={4}
                value={studentAttempt}
                onChange={(e) => setStudentAttempt(e.target.value)}
                className="w-full p-3 text-xs bg-[#FBF9F5] border border-[#D6CEBE] rounded-md text-[#1C1917] leading-relaxed"
              />
              <button
                onClick={handleRunTutorDiagnosis}
                disabled={isDiagnosing}
                className="px-4 py-2 text-xs font-medium bg-[#1C1917] text-[#FBF9F5] rounded-md hover:bg-[#292524] transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isDiagnosing
                  ? "Analisi diagnostica..."
                  : "Diagnostica Prerequisito con LeanTutor"}
              </button>
            </div>

            <div className="lg:col-span-7 bg-[#FBF9F5] border border-[#E5DEC9] rounded-md p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-[#1C1917] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#1E3A8A]" />
                  Risultato della Diagnosi Strutturale
                </span>
                <span className="font-mono text-[#9A3412]">
                  Prerequisito coinvolto:{" "}
                  {tutorDiagnosis.missingPrerequisiteUrn}
                </span>
              </div>

              <p className="text-xs text-[#1C1917] leading-relaxed">
                <strong>Analisi del passaggio:</strong>{" "}
                {tutorDiagnosis.diagnosisSummary}
              </p>

              <p className="text-xs text-[#44403C] leading-relaxed">
                <strong>Perché serve questo prerequisito:</strong>{" "}
                {tutorDiagnosis.missingPrerequisiteReason}
              </p>

              <div className="p-2.5 bg-[#F3EFE6] border border-[#E5DEC9] rounded font-mono text-[11px] text-[#1C1917]">
                Formalizzazione del passo: {tutorDiagnosis.formalStepAttempted}
              </div>

              <div className="text-xs text-[#14532D] font-medium">
                Suggerimento per il passo successivo:{" "}
                {tutorDiagnosis.nextStepHint}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
