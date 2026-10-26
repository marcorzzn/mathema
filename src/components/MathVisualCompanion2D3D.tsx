import React, { useState, useMemo } from "react";
import { VisualPlotType } from "../data/mscHierarchyData";
import { Box, Layers, RotateCcw } from "lucide-react";

interface MathVisualCompanion2D3DProps {
  plotType: VisualPlotType;
  activeCode: string;
}

export const MathVisualCompanion2D3D: React.FC<
  MathVisualCompanion2D3DProps
> = ({ plotType, activeCode }) => {
  const [dimensionMode, setDimensionMode] = useState<"2d" | "3d">("3d");
  const [azimuth, setAzimuth] = useState<number>(38); // degrees
  const [elevation, setElevation] = useState<number>(26); // degrees
  const [paramN, setParamN] = useState<number>(4);

  // Fast 3D-to-2D isometric/perspective projection helper
  const project3D = useMemo(() => {
    const radAz = (azimuth * Math.PI) / 180;
    const radEl = (elevation * Math.PI) / 180;
    const cosA = Math.cos(radAz);
    const sinA = Math.sin(radAz);
    const cosE = Math.cos(radEl);
    const sinE = Math.sin(radEl);

    return (x: number, y: number, z: number, scale = 22) => {
      // Rotate around Z by azimuth, then tilt by elevation
      const rx = x * cosA - y * sinA;
      const ry = x * sinA + y * cosA;
      const sx = 210 + rx * scale;
      const sy = 135 - (z * cosE - ry * sinE) * scale;
      return { x: sx, y: sy };
    };
  }, [azimuth, elevation]);

  // Generate 3D surface wireframe meshes based on plotType
  const surfaceLines = useMemo(() => {
    const lines: { d: string; stroke: string; width?: number; dash?: string }[] =
      [];

    if (
      plotType === "pell_conic_2d_3d" ||
      plotType === "dedekind_cauchy_2d_3d"
    ) {
      // Surface z = 0.18 * (x^2 - 2*y^2) (Hyperbolic Paraboloid / Diophantine Saddle)
      const gridRange = [-3, -2, -1, 0, 1, 2, 3];
      for (const x of gridRange) {
        const pts: string[] = [];
        for (let y = -3; y <= 3; y += 0.5) {
          const z = 0.16 * (x * x - 2 * y * y);
          const p = project3D(x, y, z, 21);
          pts.push(`${pts.length === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
        }
        lines.push({ d: pts.join(" "), stroke: "#1E3A8A", width: 1.1 });
      }
      for (const y of gridRange) {
        const pts: string[] = [];
        for (let x = -3; x <= 3; x += 0.5) {
          const z = 0.16 * (x * x - 2 * y * y);
          const p = project3D(x, y, z, 21);
          pts.push(`${pts.length === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
        }
        lines.push({ d: pts.join(" "), stroke: "#57534E", width: 0.9 });
      }
      // Asymptotic zero-level lines z = 0: x = ±√2 y
      const asym1: string[] = [];
      const asym2: string[] = [];
      for (let y = -2.2; y <= 2.2; y += 0.4) {
        const p1 = project3D(Math.SQRT2 * y, y, 0, 21);
        const p2 = project3D(-Math.SQRT2 * y, y, 0, 21);
        asym1.push(`${asym1.length === 0 ? "M" : "L"} ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`);
        asym2.push(`${asym2.length === 0 ? "M" : "L"} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`);
      }
      lines.push({
        d: asym1.join(" "),
        stroke: "#9A3412",
        width: 2.2,
        dash: "4 2",
      });
      lines.push({
        d: asym2.join(" "),
        stroke: "#9A3412",
        width: 2.2,
        dash: "4 2",
      });
    } else if (plotType === "noether_manifold_2d_3d") {
      // Phase-space invariant torus / cylinder H(q, p) = const
      for (let z = -2; z <= 2; z += 1) {
        const pts: string[] = [];
        const r = 2.2 + 0.3 * Math.cos(z);
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.25) {
          const p = project3D(r * Math.cos(a), r * Math.sin(a), z * 1.1, 21);
          pts.push(`${pts.length === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
        }
        lines.push({
          d: pts.join(" "),
          stroke: z === 0 ? "#9A3412" : "#14532D",
          width: z === 0 ? 2.2 : 1.2,
        });
      }
    } else {
      // Prime / Logical 3D Helicoid Spiral (x = r cos t, y = r sin t, z = t)
      const spiral: string[] = [];
      for (let t = 0; t <= paramN * 3.14; t += 0.2) {
        const r = 0.6 + t * 0.18;
        const p = project3D(
          r * Math.cos(t),
          r * Math.sin(t),
          (t - 6) * 0.35,
          21
        );
        spiral.push(`${spiral.length === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
      }
      lines.push({ d: spiral.join(" "), stroke: "#1E3A8A", width: 2 });
    }

    return lines;
  }, [plotType, project3D, paramN]);

  const plotMetadata = useMemo(() => {
    switch (plotType) {
      case "pell_conic_2d_3d":
        return {
          title: "Geometria Diofantea 2D/3D: Sella Quadratica z = p² − 2q² e Reticolo ℤ²",
          caption2D:
            "Piano (q, p): la retta rossa p = √2·q non interseca mai alcun nodo del reticolo intero (q, p) ∈ ℤ² \\ {(0,0)}. I punti verdi sono le approssimazioni di Pell p² − 2q² = ±1.",
          caption3D:
            "Spazio 3D (p, q, z): la superficie a sella z = p² − 2q² interseca il piano quota z = 0 lungo le rette irrazionali p = ±√2·q (tratteggiate), evitando tutti i nodi interi non nulli.",
        };
      case "primes_distribution_2d_3d":
        return {
          title: "Distribuzione dei Numeri Primi π(x) e Spirale Modulare 3D",
          caption2D:
            "Confronto tra la funzione a gradini π(x) (conteggio esatto dei primi ≤ x) e la stima asintotica di Gauss-Legendre x / ln(x).",
          caption3D:
            "Elica cilindrica 3D delle classi di resto: i numeri primi si distribuiscono lungo i raggi coprimi con il modulo senza mai saturarsi (Euclide 11A41.1).",
        };
      case "dedekind_cauchy_2d_3d":
        return {
          title: "Sezione di Dedekind in ℚ e Convergenza Quadratica di Erone-Newton",
          caption2D:
            "Partizione della retta razionale ℚ in A = {q ∣ q² < 2} (blu) e B = {q > 0 ∣ q² > 2} (terracotta) con la successione di Cauchy aₙ₊₁ = (aₙ + 2/aₙ)/2.",
          caption3D:
            "Superficie dell'energia dell'errore z = (x² − 2)²: la discesa di Newton-Erone converge quadraticamente verso la valle a quota zero x = √2.",
        };
      case "noether_manifold_2d_3d":
        return {
          title: "Varietà Simmetrica dello Spazio delle Fasi e Carica di Noether (70H33)",
          caption2D:
            "Orbite nel piano delle fasi (q, p): quando ∂L/∂q = 0, le traiettorie giacciono su rette orizzontali a impulso coniugato p = costante.",
          caption3D:
            "Fogliazione 3D dello spazio delle fasi (q₁, q₂, p): le superfici invarianti di livello racchiudono le orbite che conservano l'integrale primo di Noether.",
        };
      default:
        return {
          title: "Albero Sintattico dei Tipi Dipendenti (Curry-Howard 03B05)",
          caption2D:
            "Composizione funzionale P → Q → ⊥ nella logica costruttiva: ogni freccia è una trasformazione verificata dal type-checker di Lean 4.",
          caption3D:
            "Fibrazione 3D dei tipi dipendenti Π (x : A), B(x): una sezione continua nello spazio totale rappresenta una dimostrazione universale.",
        };
    }
  }, [plotType]);

  // 3D Coordinate Axes
  const origin = project3D(0, 0, 0, 21);
  const axisX = project3D(3.4, 0, 0, 21);
  const axisY = project3D(0, 3.4, 0, 21);
  const axisZ = project3D(0, 0, 2.8, 21);

  return (
    <div className="bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg p-4">
      {/* Header & 2D/3D Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5DEC9]">
        <div>
          <div className="text-[11px] font-mono text-[#78716C]">
            VISUALIZZAZIONE ACCOMPAGNATORIA · NODO [{activeCode}]
          </div>
          <h4 className="text-sm font-semibold text-[#1C1917]">
            {plotMetadata.title}
          </h4>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#F3EFE6] border border-[#E5DEC9] rounded-md">
          <button
            onClick={() => setDimensionMode("2d")}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 ${
              dimensionMode === "2d"
                ? "bg-[#1E3A8A] text-white"
                : "text-[#57534E] hover:text-[#1C1917]"
            }`}
          >
            <Layers className="w-3 h-3" />
            Grafico 2D
          </button>
          <button
            onClick={() => setDimensionMode("3d")}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 ${
              dimensionMode === "3d"
                ? "bg-[#1E3A8A] text-white"
                : "text-[#57534E] hover:text-[#1C1917]"
            }`}
          >
            <Box className="w-3 h-3" />
            Modello 3D
          </button>
        </div>
      </div>

      {/* Interactive SVG Viewport */}
      <div className="my-3 bg-[#F3EFE6]/50 border border-[#E5DEC9] rounded-md p-2">
        {dimensionMode === "3d" ? (
          <svg
            viewBox="0 0 420 260"
            className="w-full h-[230px] select-none"
            role="img"
            aria-label={plotMetadata.title}
          >
            {/* 3D Reference Axes */}
            <line
              x1={origin.x}
              y1={origin.y}
              x2={axisX.x}
              y2={axisX.y}
              stroke="#78716C"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
            <text
              x={axisX.x + 5}
              y={axisX.y}
              fontSize="10"
              fontFamily="IBM Plex Mono"
              fill="#1C1917"
            >
              p (x)
            </text>

            <line
              x1={origin.x}
              y1={origin.y}
              x2={axisY.x}
              y2={axisY.y}
              stroke="#78716C"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
            <text
              x={axisY.x + 5}
              y={axisY.y}
              fontSize="10"
              fontFamily="IBM Plex Mono"
              fill="#1C1917"
            >
              q (y)
            </text>

            <line
              x1={origin.x}
              y1={origin.y}
              x2={axisZ.x}
              y2={axisZ.y}
              stroke="#14532D"
              strokeWidth="1.4"
            />
            <text
              x={axisZ.x}
              y={axisZ.y - 6}
              textAnchor="middle"
              fontSize="10"
              fontFamily="IBM Plex Mono"
              fill="#14532D"
            >
              z = p²−2q²
            </text>

            {/* Wireframe 3D Surface Lines */}
            {surfaceLines.map((ln, idx) => (
              <path
                key={idx}
                d={ln.d}
                fill="none"
                stroke={ln.stroke}
                strokeWidth={ln.width || 1}
                strokeDasharray={ln.dash}
              />
            ))}

            {/* Highlight Origin & Pell Lattice Points in 3D */}
            {[
              { p: 1, q: 1, label: "(1,1,−1)" },
              { p: 3, q: 2, label: "(3,2,+1)" },
            ].map((pt, i) => {
              const zVal = 0.16 * (pt.p * pt.p - 2 * pt.q * pt.q);
              const proj = project3D(pt.p, pt.q, zVal, 21);
              return (
                <g key={i}>
                  <circle
                    cx={proj.x}
                    cy={proj.y}
                    r="4"
                    fill="#9A3412"
                    stroke="#FBF9F5"
                    strokeWidth="1"
                  />
                  <text
                    x={proj.x + 6}
                    y={proj.y - 4}
                    fontSize="9"
                    fontFamily="IBM Plex Mono"
                    fill="#9A3412"
                  >
                    {pt.label}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : (
          /* 2D Analytical Coordinate View */
          <svg
            viewBox="0 0 420 260"
            className="w-full h-[230px] select-none"
            role="img"
            aria-label={plotMetadata.title}
          >
            {/* 2D Grid */}
            {[0, 1, 2, 3, 4, 5, 6].map((g) => (
              <g key={g}>
                <line
                  x1={50 + g * 50}
                  y1={20}
                  x2={50 + g * 50}
                  y2={225}
                  stroke="#E5DEC9"
                  strokeWidth="1"
                />
                <line
                  x1={50}
                  y1={225 - g * 32}
                  x2={370}
                  y2={225 - g * 32}
                  stroke="#E5DEC9"
                  strokeWidth="1"
                />
                <text
                  x={50 + g * 50}
                  y={242}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontFamily="IBM Plex Mono"
                  fill="#57534E"
                >
                  q={g}
                </text>
              </g>
            ))}

            {/* Axes */}
            <line
              x1="50"
              y1="225"
              x2="380"
              y2="225"
              stroke="#1C1917"
              strokeWidth="1.5"
            />
            <line
              x1="50"
              y1="225"
              x2="50"
              y2="18"
              stroke="#1C1917"
              strokeWidth="1.5"
            />

            {/* Irrational Slope Line p = √2 q */}
            <line
              x1="50"
              y1="225"
              x2={50 + 4.5 * 50}
              y2={225 - 4.5 * Math.SQRT2 * 32}
              stroke="#9A3412"
              strokeWidth="2.2"
              strokeDasharray="5 3"
            />
            <text
              x="285"
              y="36"
              fontSize="10"
              fontFamily="IBM Plex Mono"
              fontWeight="600"
              fill="#9A3412"
            >
              Retta irrazionale p = √2·q
            </text>

            {/* Integer Lattice Nodes (q, p) */}
            {[1, 2, 3, 4, 5].map((q) =>
              [1, 2, 3, 4, 5, 6].map((p) => {
                const isPell = Math.abs(p * p - 2 * q * q) === 1;
                const cx = 50 + q * 50;
                const cy = 225 - p * 32;
                return (
                  <g key={`${q}-${p}`}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isPell ? 5 : 2.5}
                      fill={isPell ? "#14532D" : "#78716C"}
                    />
                    {isPell && (
                      <text
                        x={cx + 7}
                        y={cy + 3}
                        fontSize="9.5"
                        fontFamily="IBM Plex Mono"
                        fontWeight="600"
                        fill="#14532D"
                      >
                        p/q={p}/{q}
                      </text>
                    )}
                  </g>
                );
              })
            )}
          </svg>
        )}
      </div>

      {/* Interactive Controls for 3D Orientation / Parameters */}
      {dimensionMode === "3d" ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1 text-xs">
          <div>
            <div className="flex justify-between text-[11px] text-[#57534E] mb-0.5">
              <label htmlFor="az-slider">Rotazione Azimuth θ:</label>
              <span className="font-mono tabular-nums text-[#1C1917]">
                {azimuth}°
              </span>
            </div>
            <input
              id="az-slider"
              type="range"
              min={-90}
              max={180}
              value={azimuth}
              onChange={(e) => setAzimuth(Number(e.target.value))}
              className="w-full accent-[#1E3A8A] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-[#57534E] mb-0.5">
              <label htmlFor="el-slider">Inclinazione Zenit φ:</label>
              <span className="font-mono tabular-nums text-[#1C1917]">
                {elevation}°
              </span>
            </div>
            <input
              id="el-slider"
              type="range"
              min={5}
              max={75}
              value={elevation}
              onChange={(e) => setElevation(Number(e.target.value))}
              className="w-full accent-[#1E3A8A] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setAzimuth(38);
                setElevation(26);
                setParamN(4);
              }}
              className="px-2.5 py-1.5 text-xs bg-[#F3EFE6] hover:bg-[#EBE6DF] border border-[#D6CEBE] rounded text-[#1C1917] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Camera 3D
            </button>
          </div>
        </div>
      ) : null}

      <p className="text-xs text-[#57534E] mt-2 leading-relaxed">
        {dimensionMode === "3d"
          ? plotMetadata.caption3D
          : plotMetadata.caption2D}
      </p>
    </div>
  );
};
