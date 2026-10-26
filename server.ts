import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGeminiClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "2mb" }));

  // 1. Endpoint: Bidirectional NL <-> Lean 4 Autoformalization, Tau Ceti Rubric & Palomar Comparator
  app.post("/api/bridge/formalize", async (req, res) => {
    try {
      const {
        statement,
        mode = "nl_to_lean",
        language = "it",
        level = "3",
        style = "intuitive",
      } = req.body;

      if (!statement || typeof statement !== "string") {
        res.status(400).json({ error: "Inserisci un enunciato o codice Lean valido." });
        return;
      }

      const ai = getGeminiClient();

      const prompt = `Sei il motore del ponte bidirezionale NL ↔ Lean 4 del progetto Mathema (ideato da Marco Razzano), allineato ai 10 valori di Mathlib, Tau Ceti, Formal Frontier e allo standard Palomar (Avigad, Buzzard, Commelin, Degenne, Morrison, Nash, Topaz — 2026).
Modalità richiesta: ${mode === "nl_to_lean" ? "Autoformalizzazione (Linguaggio Naturale → Lean 4 + Deformalizzazione Pedagogica)" : "Deformalizzazione (Codice Lean 4 → Spiegazione Multilivello e Verifica Semantica)"}
Lingua di output per i testi naturali: ${language}
Livello pedagogico target (0=asilo, 1=elementari, 2=medie, 3=superiori, 4=università, 5=magistrale, 6=dottorato, 7=post-doc): Livello ${level}
Stile pedagogico scelto: ${style}

Input dell'utente:
"""
${statement}
"""

Esegui l'intero ciclo a 7 stadi dell'architettura Mathema integrata con Tau Ceti & Palomar:
1. Parser NL: estrai goal matematico, dominio, e lista di URN dei prerequisiti nel formato urn:mathema:concept:<slug>.
2. Autoformalizzatore Lean 4: scrivi il codice formale Lean 4 idiomatico che deferisce alle definizioni di Mathlib4 (senza ridefinire concetti standard e senza sorry se possibile).
3. Simulazione stato Lean REPL: riporta i passaggi tattici principali e l'evoluzione dello stato dei goal.
4. Verificatore Semantico & Rubrica Avversaria Tau Ceti (LoC-Decomp, SAGE & Mathlib Values): valuta se il codice rispetta i 10 principi di Avigad-Buzzard et al. (deferenza a Mathlib, generalità appropriata, assenza di duplicazione, convenzioni di naming) e genera il file Palomar formalization.yaml con Comparator setup.
5. Deformalizzatore Pedagogico: genera la spiegazione passo-passo nella lingua (${language}), calibrata esattamente per il Livello ${level} e lo Stile ${style}.
6. Curatore Pedagogico: proponi il nodo successivo nel grafo e un esercizio verificabile con contratto formale.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              urnId: {
                type: Type.STRING,
                description: "URN identifier es. urn:mathema:concept:custom-theorem",
              },
              parsedGoal: {
                type: Type.STRING,
                description: "Obiettivo matematico strutturato estratto dal parser NL",
              },
              domain: {
                type: Type.STRING,
                description: "Dominio matematico o scientifico",
              },
              prerequisites: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Lista di URN prerequisiti es. urn:mathema:concept:parity",
              },
              leanCode: {
                type: Type.STRING,
                description: "Codice formale Lean 4 completo e commentato",
              },
              tacticTrace: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    tactic: { type: Type.STRING },
                    goalBefore: { type: Type.STRING },
                    goalAfter: { type: Type.STRING },
                  },
                  required: ["tactic", "goalBefore", "goalAfter"],
                },
              },
              semanticAudit: {
                type: Type.OBJECT,
                properties: {
                  coherencePreserved: { type: Type.BOOLEAN },
                  locDecompSummary: { type: Type.STRING },
                  potentialPitfalls: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  mathlibPremises: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  tauCetiRubric: {
                    type: Type.OBJECT,
                    properties: {
                      mathlibDeference: { type: Type.STRING },
                      generalityAndReuse: { type: Type.STRING },
                      noDuplicationCheck: { type: Type.STRING },
                    },
                    required: [
                      "mathlibDeference",
                      "generalityAndReuse",
                      "noDuplicationCheck",
                    ],
                  },
                  palomarMetadataYaml: {
                    type: Type.STRING,
                    description: "Contenuto del file formalization.yaml secondo lo standard Palomar",
                  },
                },
                required: [
                  "coherencePreserved",
                  "locDecompSummary",
                  "potentialPitfalls",
                  "mathlibPremises",
                  "tauCetiRubric",
                  "palomarMetadataYaml",
                ],
              },
              deformalizedExplanation: {
                type: Type.STRING,
                description: "Spiegazione deformalizzata adattata a livello, stile e lingua",
              },
              pedagogicalCurator: {
                type: Type.OBJECT,
                properties: {
                  nextRecommendedNode: { type: Type.STRING },
                  exercisePrompt: { type: Type.STRING },
                  exerciseLeanContract: { type: Type.STRING },
                },
                required: [
                  "nextRecommendedNode",
                  "exercisePrompt",
                  "exerciseLeanContract",
                ],
              },
            },
            required: [
              "urnId",
              "parsedGoal",
              "domain",
              "prerequisites",
              "leanCode",
              "tacticTrace",
              "semanticAudit",
              "deformalizedExplanation",
              "pedagogicalCurator",
            ],
          },
        },
      });

      const rawText = response.text;
      if (!rawText) {
        throw new Error("Risposta vuota dal modello Gemini.");
      }

      const parsed = JSON.parse(rawText.trim());
      res.json({ result: parsed });
    } catch (error: any) {
      console.error("Errore in /api/bridge/formalize:", error);
      res.status(500).json({
        error:
          error?.message ||
          "Errore durante l'elaborazione della pipeline NL ↔ Lean 4.",
      });
    }
  });

  // 2. Endpoint: LeanTutor Diagnostic Feedback (Modello UC Berkeley AAAI 2026)
  app.post("/api/tutor/diagnose", async (req, res) => {
    try {
      const {
        nodeTitle,
        nodeUrn,
        studentAttempt,
        language = "it",
        level = "3",
      } = req.body;

      if (!studentAttempt || typeof studentAttempt !== "string") {
        res.status(400).json({ error: "Inserisci un tentativo di dimostrazione o domanda." });
        return;
      }

      const ai = getGeminiClient();

      const prompt = `Sei il modulo diagnostico LeanTutor di Mathema (architettura a 3 moduli: autoformalizer/proof-checker, next-step generator, NL feedback generator).
Principio fondamentale di Mathema: NON rispondere mai con un generico "giusto/sbagliato", ma diagnostica esattamente quale prerequisito concettuale è solido e quale prerequisito manca ("ti manca X"), proponendo il passo successivo in modo socratico.

Nodo corrente: ${nodeTitle} (${nodeUrn})
Livello dello studente: Livello ${level}
Lingua di risposta: ${language}

Tentativo o ragionamento dello studente:
"""
${studentAttempt}
"""`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              diagnosisSummary: {
                type: Type.STRING,
                description: "Diagnosi chiara e costruttiva del passaggio dello studente",
              },
              missingPrerequisiteUrn: {
                type: Type.STRING,
                description: "URN del prerequisito da ripassare o consolidare",
              },
              missingPrerequisiteReason: {
                type: Type.STRING,
                description: "Perché questo specifico prerequisito sblocca il passaggio",
              },
              formalStepAttempted: {
                type: Type.STRING,
                description: "Traduzione in Lean 4 del tentativo dello studente",
              },
              nextStepHint: {
                type: Type.STRING,
                description: "Suggerimento socratico per il prossimo passo senza svelare l'intera prova",
              },
            },
            required: [
              "diagnosisSummary",
              "missingPrerequisiteUrn",
              "missingPrerequisiteReason",
              "formalStepAttempted",
              "nextStepHint",
            ],
          },
        },
      });

      const rawText = response.text;
      if (!rawText) {
        throw new Error("Risposta vuota dal modulo LeanTutor.");
      }

      const parsed = JSON.parse(rawText.trim());
      res.json({ result: parsed });
    } catch (error: any) {
      console.error("Errore in /api/tutor/diagnose:", error);
      res.status(500).json({
        error:
          error?.message ||
          "Errore durante la diagnosi pedagogica LeanTutor.",
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use("/Mathema", vite.middlewares);
    app.use("/mathema", vite.middlewares);
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use("/Mathema", express.static(distPath));
    app.use("/mathema", express.static(distPath));
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mathema server listening on http://localhost:${PORT}`);
  });
}

startServer();
