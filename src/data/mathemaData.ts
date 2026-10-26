export type LanguageCode = "it" | "en" | "es" | "zh" | "ar";

export type NodeType =
  | "theorem"
  | "definition"
  | "proof"
  | "technique"
  | "example"
  | "exercise"
  | "curriculum"
  | "formula";

export type EdgeRelation =
  | "requires"
  | "generalizes"
  | "special_case_of"
  | "proved_by"
  | "applied_to"
  | "equivalent_to"
  | "alternative_to";

export type PedagogicalStyle =
  | "intuitive"
  | "axiomatic"
  | "problem_solving"
  | "historical"
  | "computational"
  | "formal"
  | "child"
  | "applied";

export interface ProofVariant {
  id: string;
  title: Record<LanguageCode, string>;
  style: string;
  informalSteps: Record<LanguageCode, string[]>;
  leanCode: string;
  verified: boolean;
  verifier: string;
  semanticCheck: string;
}

export interface NodeExplanation {
  style: PedagogicalStyle;
  level: number; // 0 to 7
  authorAgent: string;
  text: Record<LanguageCode, string>;
}

export interface MathemaNode {
  id: string; // e.g. urn:mathema:concept:sqrt2-irrationality
  shortSlug: string;
  type: NodeType;
  domain:
    | "number_theory"
    | "real_analysis"
    | "abstract_algebra"
    | "linear_algebra"
    | "logic_cs"
    | "physics";
  levels: number[]; // e.g. [2, 3, 4]
  x: number;
  y: number;
  title: Record<LanguageCode, string>;
  notation: string;
  statements: {
    informal: Record<LanguageCode, string>;
    formalLean: string;
  };
  prerequisites: string[];
  proofs: ProofVariant[];
  explanations: NodeExplanation[];
  sources: { name: string; ref: string; license: string }[];
  wikidataId: string;
}

export interface MathemaEdge {
  id: string;
  from: string;
  to: string;
  type: EdgeRelation;
  weight: number;
  source: "human" | "agent" | "imported";
  confidence: number;
  note: string;
}

export const LANGUAGE_LABELS: Record<
  LanguageCode,
  { name: string; native: string; dir: "ltr" | "rtl"; culturalNote: string }
> = {
  it: {
    name: "Italiano",
    native: "Italiano",
    dir: "ltr",
    culturalNote:
      "Tradizione geometrico-deduttiva italiana (Peano, Enriques, De Giorgi).",
  },
  en: {
    name: "Inglese",
    native: "English",
    dir: "ltr",
    culturalNote:
      "Allineamento diretto alla nomenclatura Mathlib4 e OpenStax.",
  },
  es: {
    name: "Spagnolo",
    native: "Español",
    dir: "ltr",
    culturalNote:
      "Adattamento terminologico unificato per curricula iberoamericani.",
  },
  zh: {
    name: "Cinese",
    native: "中文",
    dir: "ltr",
    culturalNote:
      "Struttura morfologica trasparente (es. 无理数 = numero senza rapporto commensurabile).",
  },
  ar: {
    name: "Arabo",
    native: "العربية",
    dir: "rtl",
    culturalNote:
      "Continuità storica con l'algebra classica di al-Khwarizmi e al-Karaji (جذر أصم).",
  },
};

export const DOMAIN_LABELS: Record<
  MathemaNode["domain"],
  { it: string; en: string; code: string }
> = {
  number_theory: {
    it: "Teoria dei Numeri",
    en: "Number Theory",
    code: "NT · 11-XX",
  },
  real_analysis: {
    it: "Analisi Reale",
    en: "Real Analysis",
    code: "RA · 26-XX",
  },
  abstract_algebra: {
    it: "Algebra Astratta",
    en: "Abstract Algebra",
    code: "AA · 20-XX",
  },
  linear_algebra: {
    it: "Algebra Lineare",
    en: "Linear Algebra",
    code: "LA · 15-XX",
  },
  logic_cs: {
    it: "Logica e Informatica",
    en: "Logic & Computer Science",
    code: "CS · 03-XX",
  },
  physics: {
    it: "Fisica Matematica",
    en: "Mathematical Physics",
    code: "MP · 70-XX",
  },
};

export const PEDAGOGICAL_LEVELS = [
  {
    level: 0,
    name: "Livello 0 · Asilo",
    focus: "Gioco, conteggio, forme, pattern tangibili",
    ageRange: "3–5 anni",
  },
  {
    level: 1,
    name: "Livello 1 · Elementari",
    focus: "Aritmetica, frazioni visive, geometria intuitiva",
    ageRange: "6–10 anni",
  },
  {
    level: 2,
    name: "Livello 2 · Medie",
    focus: "Algebra simbolica, geometria euclidea, proporzioni",
    ageRange: "11–13 anni",
  },
  {
    level: 3,
    name: "Livello 3 · Superiori",
    focus: "Dimostrazioni rigorose, analisi, calcolo infinitesimale",
    ageRange: "14–18 anni",
  },
  {
    level: 4,
    name: "Livello 4 · Università (Triennale)",
    focus: "Analisi reale, algebra astratta, topologia generale",
    ageRange: "Undergraduate",
  },
  {
    level: 5,
    name: "Livello 5 · Magistrale",
    focus: "Analisi funzionale, geometria algebrica, teoria algebrica dei numeri",
    ageRange: "Graduate",
  },
  {
    level: 6,
    name: "Livello 6 · Dottorato",
    focus: "Monografie di ricerca, formalizzazione Mathlib / Tau Ceti",
    ageRange: "PhD",
  },
  {
    level: 7,
    name: "Livello 7 · Post-Doc & Frontiera",
    focus: "Annals Challenge, Formal Conjectures, autoformalizzazione di frontiera",
    ageRange: "Ricerca",
  },
];

export const PEDAGOGICAL_STYLES: {
  id: PedagogicalStyle;
  label: string;
  mentor: string;
  description: string;
}[] = [
  {
    id: "intuitive",
    label: "Intuitivo-Visuale",
    mentor: "Feynman",
    description: "Immagini mentali, esperimenti fisici e analogie concrete prima del formalismo.",
  },
  {
    id: "axiomatic",
    label: "Assiomatico-Deduttivo",
    mentor: "Bourbaki",
    description: "Dalle strutture generali agli invarianti, con massima economia di ipotesi.",
  },
  {
    id: "problem_solving",
    label: "Problem-Solving",
    mentor: "Pólya",
    description: "Euristiche di scoperta: come un matematico trova l'idea della prova.",
  },
  {
    id: "historical",
    label: "Storico-Genetico",
    mentor: "Enriques / Boyer",
    description: "Crisi degli incommensurabili, errori fecondi ed evoluzione storica del concetto.",
  },
  {
    id: "computational",
    label: "Computazionale",
    mentor: "Knuth / Turing",
    description: "Algoritmi costruttivi, frazioni continue, complessità e simulazioni.",
  },
  {
    id: "formal",
    label: "Formale Verificato",
    mentor: "Lean 4 / Mathlib",
    description: "Tipi dipendenti, tattiche costruttive e verifica al kernel senza sorry.",
  },
  {
    id: "child",
    label: "Gioco e Racconto",
    mentor: "Montessori / Rodari",
    description: "Tassellature con quadrati di carta, storie di simmetria e scoperta tattile.",
  },
  {
    id: "applied",
    label: "Applicato & Fisico",
    mentor: "Noether / Arnold",
    description: "Risonanze orbitali, formati ISO 216 (foglio A4), acustica e ingegneria.",
  },
];

export const MATHEMA_NODES: MathemaNode[] = [
  {
    id: "urn:mathema:concept:sqrt2-irrationality",
    shortSlug: "sqrt2-irrationality",
    type: "theorem",
    domain: "number_theory",
    levels: [2, 3, 4],
    x: 420,
    y: 240,
    title: {
      it: "Irrazionalità della radice di 2",
      en: "Irrationality of the square root of 2",
      es: "Irracionalidad de la raíz cuadrada de 2",
      zh: "2的平方根的无理性",
      ar: "لاقياسية الجذر التربيعي للعدد 2",
    },
    notation: "√2 ∉ ℚ  (∀ p, q ∈ ℤ, q ≠ 0 ⇒ p² ≠ 2q²)",
    statements: {
      informal: {
        it: "Non esistono due numeri interi coprimi p e q (con q ≠ 0) tali che il quadrato di p/q sia uguale a 2. Geometricamente, la diagonale di un quadrato è incommensurabile con il suo lato.",
        en: "There exist no coprime integers p and q (with q ≠ 0) such that (p/q)² = 2. Geometrically, the diagonal of a square is incommensurable with its side.",
        es: "No existen dos números enteros coprimos p y q (con q ≠ 0) tales que (p/q)² = 2. Geométricamente, la diagonal de un cuadrado es inconmensurable con su lado.",
        zh: "不存在互质整数 p 和 q（q ≠ 0）使得 (p/q)² = 2。在几何上，正方形的对角线与边长不可公度。",
        ar: "لا يوجد عددان صحيحان أوليان فيما بينهما p و q (حيث q ≠ 0) يحققان (p/q)² = 2. هندسياً، قطر المربع غير قابل للقياس المشترك مع ضلعه.",
      },
      formalLean: `import Mathlib.Data.Real.Irrational
import Mathlib.NumberTheory.Multiplicity

theorem mathema_sqrt2_irrational : Irrational (Real.sqrt 2) := by
  exact irrational_sqrt_two

-- Formulazione aritmetica sugli interi coprimi:
theorem no_coprime_sq_eq_two (p q : ℕ) (hq : q ≠ 0) (hcop : Nat.Coprime p q) :
    p ^ 2 ≠ 2 * q ^ 2 := by
  intro h
  have hp_even : 2 ∣ p ^ 2 := ⟨q ^ 2, h⟩
  have hp : 2 ∣ p := Prime.dvd_of_dvd_pow Nat.prime_two hp_even
  rcases hp with ⟨k, rfl⟩
  have hq_even : 2 ∣ q ^ 2 := by
    use k ^ 2
    linarith
  have hq_div : 2 ∣ q := Prime.dvd_of_dvd_pow Nat.prime_two hq_even
  have h_gcd : 2 ∣ Nat.gcd p q := Nat.dvd_gcd ⟨k, rfl⟩ hq_div
  rw [hcop.gcd_eq_one] at h_gcd
  revert h_gcd; decide`,
    },
    prerequisites: [
      "urn:mathema:concept:rational-number",
      "urn:mathema:concept:parity",
      "urn:mathema:concept:proof-by-contradiction",
    ],
    proofs: [
      {
        id: "proof-contradiction",
        title: {
          it: "Prova 1 · Contraddizione sulla parità (Euclide / Aristotele)",
          en: "Proof 1 · Parity Contradiction (Euclid / Aristotle)",
          es: "Prueba 1 · Contradicción de paridad (Euclides)",
          zh: "证明 1 · 奇偶性反证法（欧几里得）",
          ar: "برهان 1 · التناقض عبر الزوجية والفردية (إقليدس)",
        },
        style: "contradiction",
        informalSteps: {
          it: [
            "Supponiamo per assurdo che √2 = p/q con p, q ∈ ℕ⁺ ridotti ai minimi termini, cioè gcd(p, q) = 1.",
            "Elevando al quadrato otteniamo p² = 2q², dunque p² è un numero pari.",
            "Poiché il quadrato di un numero dispari è dispari, anche p deve essere pari: scriviamo p = 2k.",
            "Sostituendo otteniamo (2k)² = 4k² = 2q², da cui q² = 2k². Quindi anche q è pari.",
            "Ma se sia p che q sono pari, condividono il fattore 2, contraddicendo l'ipotesi gcd(p, q) = 1.",
          ],
          en: [
            "Assume for contradiction that √2 = p/q with coprime positive integers p, q, so gcd(p, q) = 1.",
            "Squaring both sides yields p² = 2q², meaning p² is even.",
            "Since the square of an odd integer is odd, p itself must be even: write p = 2k.",
            "Substituting gives 4k² = 2q², hence q² = 2k², which forces q to be even as well.",
            "Both p and q being even contradicts gcd(p, q) = 1.",
          ],
          es: [
            "Supongamos por contradicción que √2 = p/q con mcd(p, q) = 1.",
            "Al elevar al cuadrado obtenemos p² = 2q², por lo que p² es par.",
            "Como el cuadrado de un impar es impar, p debe ser par: p = 2k.",
            "Sustituyendo obtenemos 4k² = 2q², es decir q² = 2k², luego q también es par.",
            "Que p y q sean pares contradice que mcd(p, q) = 1.",
          ],
          zh: [
            "假设 √2 = p/q，其中 p, q 为互质正整数，即 gcd(p, q) = 1。",
            "两边平方得 p² = 2q²，因此 p² 是偶数。",
            "因为奇数的平方仍是奇数，所以 p 必为偶数，设 p = 2k。",
            "代入得 4k² = 2q²，化简得 q² = 2k²，从而 q 也是偶数。",
            "p 和 q 同为偶数与 gcd(p, q) = 1 矛盾。",
          ],
          ar: [
            "نفترض جدلاً أن √2 = p/q حيث p و q عددان صحيحان موجبان أوليان فيما بينهما gcd(p, q) = 1.",
            "بتربيع الطرفين نحصل على p² = 2q²، مما يعني أن p² عدد زوجي.",
            "بما أن مربع العدد الفردي فردي، فإن p نفسه يجب أن يكون زوجياً: نكتب p = 2k.",
            "بالتعويض نحصل على 4k² = 2q² أي q² = 2k²، وبالتالي q زوجي أيضاً.",
            "كون p و q زوجيين معاً يناقض فرضية عدم وجود قاسم مشترك غير الواحد.",
          ],
        },
        leanCode: `theorem sqrt2_irrational_parity : Irrational (Real.sqrt 2) := irrational_sqrt_two`,
        verified: true,
        verifier: "lean-repl-4.12 · mathlib4",
        semanticCheck: "LoC-Decomp: 100% preservazione semantica (nessuna specializzazione impropria)",
      },
      {
        id: "proof-infinite-descent",
        title: {
          it: "Prova 2 · Discesa infinita geometrica (Tennenbaum / Fermat)",
          en: "Proof 2 · Geometric Infinite Descent (Tennenbaum / Fermat)",
          es: "Prueba 2 · Descenso infinito geométrico (Tennenbaum)",
          zh: "证明 2 · 几何无穷递降法（Tennenbaum）",
          ar: "برهان 2 · النزول اللانهائي الهندسي (تيننباوم)",
        },
        style: "infinite-descent",
        informalSteps: {
          it: [
            "Consideriamo il più piccolo quadrato intero di lato p la cui area p² è esattamente pari alla somma di due quadrati identici di lato q (p² = 2q²).",
            "Sovrapponiamo i due quadrati di lato q all'interno del quadrato grande di lato p nei due angoli opposti.",
            "La regione centrale in cui i due quadrati q si sovrappongono è un nuovo quadrato di lato 2q - p.",
            "I due angoli rimasti scoperti sono due quadrati congruenti di lato p - q.",
            "Per conservazione dell'area, il quadrato centrale (2q - p)² equivale alla somma dei due quadrati scoperti 2(p - q)², producendo una soluzione intera strettamente più piccola: assurdo per il principio del buon ordinamento di ℕ.",
          ],
          en: [
            "Consider the smallest integer square of side p whose area equals two identical integer squares of side q (p² = 2q²).",
            "Place the two q-squares inside the p-square at opposite corners.",
            "Their overlap in the center is a square of side (2q - p), while the two uncovered corners are squares of side (p - q).",
            "Since total area is conserved, the central overlap area equals the sum of the two uncovered corner squares: (2q - p)² = 2(p - q)².",
            "This yields a strictly smaller positive integer solution, contradicting minimality in ℕ.",
          ],
          es: [
            "Consideremos el cuadrado entero más pequeño de lado p tal que p² = 2q².",
            "Colocamos los dos cuadrados de lado q en esquinas opuestas del cuadrado de lado p.",
            "La intersección central es un cuadrado de lado 2q - p y las dos esquinas descubiertas tienen lado p - q.",
            "Por conservación del área, (2q - p)² = 2(p - q)², generando una solución entera estrictamente menor.",
          ],
          zh: [
            "取最小的正整数正方形边长 p 满足 p² = 2q²。",
            "将两个边长为 q 的正方形放在边长为 p 的大正方形的对角处。",
            "中间重叠部分是边长为 2q - p 的正方形，未覆盖的两个角是边长为 p - q 的正方形。",
            "由面积守恒得 (2q - p)² = 2(p - q)²，构造出更小的正整数解，违反良序原理。",
          ],
          ar: [
            "نأخذ أصغر مربع ذي ضلع صحيح p يحقق p² = 2q².",
            "نضع المربعين ذوي الضلع q داخل المربع الكبير في زاويتين متقابلتين.",
            "منطقة التداخل الوسطى تشكل مربعاً طول ضلعه 2q - p، والزاويتان غير المغطاتين تشكلان مربعين طول ضلع كل منهما p - q.",
            "بتساوي المساحات نجد (2q - p)² = 2(p - q)² وهذا يعطي حلاً صحيحاً موجباً أصغر، مما يناقض فرضية الأصغرية.",
          ],
        },
        leanCode: `theorem tennenbaum_identity (p q : ℤ) (h : p ^ 2 = 2 * q ^ 2) :
    (2 * q - p) ^ 2 = 2 * (p - q) ^ 2 := by
  linear_combination h`,
        verified: true,
        verifier: "lean-repl-4.12 · linear_combination",
        semanticCheck: "SAGE Verified: identità algebrica esatta per il passo di discesa",
      },
      {
        id: "proof-unique-factorization",
        title: {
          it: "Prova 3 · Valutazione 2-adica e Fattorizzazione Unica",
          en: "Proof 3 · 2-adic Valuation & Unique Factorization",
          es: "Prueba 3 · Valoración 2-ádica y Factorización Única",
          zh: "证明 3 · 2-进赋值与唯一分解定理",
          ar: "برهان 3 · التقييم الثنائي والتفكيك الوحيد للعوامل الأولية",
        },
        style: "structural",
        informalSteps: {
          it: [
            "Per il Teorema Fondamentale dell'Aritmetica, ogni intero positivo si fattorizza in modo unico in numeri primi.",
            "In qualsiasi quadrato perfetto n², l'esponente del primo 2 nella fattorizzazione è necessariamente pari: v₂(p²) = 2·v₂(p).",
            "Nel membro destro 2q², l'esponente del primo 2 vale invece v₂(2q²) = 1 + 2·v₂(q), che è dispari.",
            "Poiché un numero pari non può essere uguale a un numero dispari, p² ≠ 2q² per ogni p, q ≠ 0.",
          ],
          en: [
            "By the Fundamental Theorem of Arithmetic, every positive integer has a unique prime factorization.",
            "In any square p², the exponent of 2 is even: v₂(p²) = 2·v₂(p).",
            "In 2q², the exponent of 2 is odd: v₂(2q²) = 1 + 2·v₂(q).",
            "Since no integer is both even and odd, p² = 2q² has no non-zero integer solutions.",
          ],
          es: [
            "Por el Teorema Fundamental de la Aritmética, la descomposición en primos es única.",
            "El exponente de 2 en p² es par (2·v₂(p)), mientras que en 2q² es impar (1 + 2·v₂(q)).",
            "Por unicidad, p² ≠ 2q².",
          ],
          zh: [
            "由算术基本定理，正整数的质因数分解唯一。",
            "在 p² 中素因子 2 的指数 v₂(p²) = 2·v₂(p) 为偶数；在 2q² 中指数 1 + 2·v₂(q) 为奇数。",
            "偶数不等于奇数，故无非零整数解。",
          ],
          ar: [
            "حسب المبرهنة الأساسية في الحساب، تفكيك أي عدد صحيح موجب لعوامله الأولية وحيد.",
            "أس العامل 2 في p² هو عدد زوجي دائماً، بينما في 2q² هو عدد فردي دائماً.",
            "استحالة تساوي عدد زوجي وفردي تبرهن المطلوب فوراً.",
          ],
        },
        leanCode: `theorem parity_valuation_contradiction (vp vq : ℕ) :
    2 * vp ≠ 1 + 2 * vq := by omega`,
        verified: true,
        verifier: "lean-repl-4.12 · omega",
        semanticCheck: "LoC-Decomp: generalizzabile a √p per qualunque primo p (Mathlib: irrational_sqrt_nat_iff)",
      },
    ],
    explanations: [
      {
        style: "child",
        level: 0,
        authorAgent: "agent:montessori-story",
        text: {
          it: "Immagina di avere tante tessere quadrate tutte uguali. Se vuoi costruire un quadrato più grande, ti servono 4 tessere, oppure 9, oppure 16. Ma se hai due quadrati uguali e provi a unirli per fare un solo quadrato perfetto senza tagliare le tessere, avanza sempre un pezzettino o resta un buco!",
          en: "Imagine playing with identical square tiles. To build a bigger square, you need 4 tiles, or 9, or 16. If you take two identical squares of tiles and try to rearrange them into one single square without cutting tiles, it never fits!",
          es: "Imagina que tienes fichas cuadradas iguales. Si juntas dos cuadrados iguales de fichas, nunca podrás formar un único cuadrado exacto sin romper fichas.",
          zh: "想象你用相同的小方砖拼正方形。你可以用4块、9块或16块拼成大正方形，但把两个相同的正方形方砖合在一起，永远拼不出一个完整的新正方形！",
          ar: "تخيل أنك تلعب ببلاطات مربعة متطابقة. إذا جمعت مربعين متطابقين من البلاطات، فلن تتمكن أبداً من ترتيبها لتكوين مربع واحد كامل دون كسر البلاطات!",
        },
      },
      {
        style: "intuitive",
        level: 3,
        authorAgent: "agent:feynman-style",
        text: {
          it: "Prendi un foglio A4: il rapporto tra il lato lungo e il lato corto è progettato esattamente pari a √2 così che, piegandolo a metà, ottieni un rettangolo con le stesse proporzioni! Eppure, se provi a misurare la diagonale di un quadrato usando la stessa tacca del lato, per quanto tu renda le tacche microscopiche, la punta della diagonale cadrà sempre tra due tacche. Ogni tentativo di pareggiare p² = 2q² innesca uno specchio infinito in cui p e q devono dimezzarsi per sempre.",
          en: "Take an A4 sheet of paper: its aspect ratio is √2 so folding it in half preserves the exact proportions. That self-similarity is the geometric secret of √2: if a grid ever aligned with both the side and diagonal of a square, folding the square would create a smaller square on the exact same grid—forever!",
          es: "Una hoja A4 tiene proporción √2: al doblarla por la mitad conserva su forma. Esa autosemejanza geométrica implica que si existiera una cuadrícula entera para la diagonal y el lado, podríamos reducir el cuadrado infinitas veces.",
          zh: "A4纸的长宽比正是 √2：对折后比例保持不变。这种几何自相似性正是无理性的直观根源——如果边长和对角线能被同一把整数刻度尺量尽，折叠就会产生无穷无尽更小的整数正方形。",
          ar: "ورقة A4 مصممة بنسبة √2 بحيث تحافظ على نفس النسبة عند طيها لنصفين. هذا التشابه الذاتي الهندسي يفسر لماذا لا يمكن لأي مسطرة ذات تدريجات صحيحة أن تقيس الضلع والقطر معاً.",
        },
      },
      {
        style: "axiomatic",
        level: 4,
        authorAgent: "agent:bourbaki-style",
        text: {
          it: "Sia A un dominio a fattorizzazione unica (UFD) e K = Frac(A) il suo campo delle frazioni. Poiché A = ℤ è integralmente chiuso in K = ℚ (Lemma di Gauss), ogni radice in ℚ del polinomio monico X² - 2 ∈ ℤ[X] deve appartenere a ℤ. Poiché la funzione monotona n ↦ n² su ℕ soddisfa 1² = 1 < 2 < 4 = 2², il polinomio X² - 2 è irriducibile su ℚ.",
          en: "Let A = ℤ be a Unique Factorization Domain, which is integrally closed in its fraction field K = ℚ. Any rational root of the monic polynomial X² - 2 ∈ ℤ[X] must lie in ℤ. Since 1² < 2 < 2², no integer root exists.",
          es: "Sea ℤ un dominio de factorización única, íntegramente cerrado en su cuerpo de fracciones ℚ. Toda raíz racional del polinomio mónico X² - 2 ∈ ℤ[X] debe pertenecer a ℤ, lo cual es imposible pues 1² < 2 < 2².",
          zh: "整数环 ℤ 是唯一分解整环，因此在其分式域 ℚ 中整闭。首一多项式 X² - 2 ∈ ℤ[X] 的任何有理根必为整数，但 1² < 2 < 2²，故在 ℚ 中无根。",
          ar: "بما أن حلقة الأعداد الصحيحة ℤ مغلقة تكاملياً في حقل كسورها ℚ، فإن أي جذر منطق لكثيرة الحدود الواحدية X² - 2 يجب أن يكون عدداً صحيحاً، وهذا مستحيل لأن 1² < 2 < 2².",
        },
      },
      {
        style: "historical",
        level: 3,
        authorAgent: "agent:boyer-history",
        text: {
          it: "Attorno al 450 a.C., Ippaso di Metaponto (scuola pitagorica) scoprì l'incommensurabilità studiando il pentagono e il quadrato. Per i Pitagorici, il cui motto era 'Tutto è numero' (intendendo rapporti di interi), la scoperta che la diagonale del quadrato sfugge a ogni rapporto p:q causò la prima grande crisi dei fondamenti, portando Eudosso di Cnido a sviluppare la teoria delle proporzioni nel Libro V degli Elementi di Euclide.",
          en: "Around 450 BCE, Hippasus of Metapontum discovered incommensurability within the Pythagorean school. Because Pythagorean philosophy held that all quantities are ratios of whole numbers, the discovery that the diagonal of a unit square is not a ratio p:q triggered the first foundational crisis in mathematics.",
          es: "Hacia el 450 a.C., Hipaso de Metaponto descubrió la inconmensurabilidad en el seno de la escuela pitagórica, provocando la primera crisis de los fundamentos y motivando la teoría de las proporciones de Eudoxo.",
          zh: "公元前450年左右，毕达哥拉斯学派的希帕索斯发现了不可公度线段，引发了第一次数学危机，并促使欧多克索斯建立比例论。",
          ar: "حوالي عام 450 قبل الميلاد، اكتشف هيباسوس في المدرسة الفيثاغورية المقادير غير المنطقة، مما أحدث أول أزمة في أسس الرياضيات ومهد لنظرية النسب عند أودوكسوس.",
        },
      },
    ],
    sources: [
      { name: "Mathlib4", ref: "Mathlib.Data.Real.Irrational", license: "Apache-2.0" },
      { name: "ProofWiki", ref: "Square_Root_of_2_is_Irrational", license: "CC BY-SA 4.0" },
      { name: "Euclide", ref: "Elementi, Libro X, Prop. 117", license: "Public Domain" },
    ],
    wikidataId: "Q11518",
  },
  {
    id: "urn:mathema:concept:rational-number",
    shortSlug: "rational-number",
    type: "definition",
    domain: "number_theory",
    levels: [1, 2, 3, 4],
    x: 150,
    y: 120,
    title: {
      it: "Numero Razionale e Campo ℚ",
      en: "Rational Number and Field ℚ",
      es: "Número Racional y Cuerpo ℚ",
      zh: "有理数与有理数域 ℚ",
      ar: "العدد المنطق وحقل الأعداد المنطقة ℚ",
    },
    notation: "ℚ = { p / q ∣ p ∈ ℤ, q ∈ ℕ⁺, gcd(p, q) = 1 }",
    statements: {
      informal: {
        it: "Un numero razionale è una classe di equivalenza di coppie (p, q) ∈ ℤ × (ℤ \\ {0}) rispetto alla relazione (p, q) ~ (r, s) ⇔ p·s = q·r. Ogni razionale ammette un'unica rappresentazione ridotta con q > 0 e gcd(|p|, q) = 1.",
        en: "A rational number is an equivalence class of pairs (p, q) ∈ ℤ × (ℤ \\ {0}) under (p, q) ~ (r, s) ⇔ p·s = q·r, uniquely represented in lowest terms with q > 0 and gcd(|p|, q) = 1.",
        es: "Un número racional es una clase de equivalencia de pares (p, q) con q ≠ 0 bajo p·s = q·r, representable de forma única con q > 0 y mcd(|p|, q) = 1.",
        zh: "有理数是整数对 (p, q)（q ≠ 0）在等价关系 p·s = q·r 下的等价类，可唯一表示为分母 q > 0 且互质的最简分数。",
        ar: "العدد المنطق هو صف تكافؤ من الأزواج (p, q) حيث q ≠ 0 وفق العلاقة p·s = q·r، ويكتب بشكل وحيد ككسر مختزل.",
      },
      formalLean: `import Mathlib.Data.Rat.Defs

-- In Mathlib4, Rat (ℚ) è definito in forma canonica normalizzata:
#check Rat
-- structure Rat where
--   num : ℤ
--   den : ℕ
--   den_nz : den ≠ 0
--   reduced : num.natAbs.Coprime den`,
    },
    prerequisites: [],
    proofs: [],
    explanations: [
      {
        style: "intuitive",
        level: 1,
        authorAgent: "agent:feynman-style",
        text: {
          it: "Dividere 1 pizza in 2 parti o 2 pizze in 4 parti dà esattamente la stessa quantità: le frazioni 1/2 e 2/4 sono abiti diversi per lo stesso numero razionale, e 1/2 è il suo abito più semplice (ridotto ai minimi termini).",
          en: "Sharing 1 pizza among 2 people gives the exact same amount as sharing 2 pizzas among 4 people: 1/2 and 2/4 are different outfits for the same rational number.",
          es: "Repartir 1 pizza entre 2 personas da lo mismo que 2 pizzas entre 4: 1/2 es la forma irreducible del mismo número racional.",
          zh: "1张披萨分给2个人与2张披萨分给4个人完全相等：1/2 是这一有理数的最简代表元。",
          ar: "تقسيم رغيف واحد بين شخصين يعادل تماماً تقسيم رغيفين بين أربعة أشخاص: الكسر 1/2 هو التمثيل الأبسط لهذا العدد المنطق.",
        },
      },
    ],
    sources: [
      { name: "Mathlib4", ref: "Mathlib.Data.Rat.Defs", license: "Apache-2.0" },
      { name: "OpenStax", ref: "Prealgebra 2e, Ch. 4", license: "CC BY 4.0" },
    ],
    wikidataId: "Q1244890",
  },
  {
    id: "urn:mathema:concept:parity",
    shortSlug: "parity",
    type: "definition",
    domain: "number_theory",
    levels: [0, 1, 2, 3],
    x: 150,
    y: 250,
    title: {
      it: "Parità degli Interi e Aritmetica mod 2",
      en: "Integer Parity and Arithmetic mod 2",
      es: "Paridad de los Enteros y Aritmética mod 2",
      zh: "整数的奇偶性与模2算术",
      ar: "زوجية وفردية الأعداد الصحيحة والحساب بترديد 2",
    },
    notation: "Even(n) ⇔ ∃ k ∈ ℤ, n = 2k   ·   ℤ / 2ℤ ≅ {0, 1}",
    statements: {
      informal: {
        it: "Ogni numero intero n è esclusivamente pari (n = 2k) oppure dispari (n = 2k + 1). Il quadrato di un intero conserva la sua parità: n² è pari se e solo se n è pari.",
        en: "Every integer n is either even (n = 2k) or odd (n = 2k + 1). Squaring preserves parity: n² is even if and only if n is even.",
        es: "Todo entero n es par (2k) o impar (2k + 1). El cuadrado conserva la paridad: n² es par si y solo si n es par.",
        zh: "每个整数 n 必为偶数 (2k) 或奇数 (2k + 1)。平方运算保持奇偶性：n² 为偶数当且仅当 n 为偶数。",
        ar: "كل عدد صحيح n إما زوجي (2k) أو فردي (2k + 1)。 التربيع يحافظ على الزوجية: n² زوجي إذا وفقط إذا كان n زوجياً.",
      },
      formalLean: `import Mathlib.Algebra.Ring.Parity

theorem even_sq_iff (n : ℤ) : Even (n ^ 2) ↔ Even n := by
  exact Int.even_pow.trans (by simp)`,
    },
    prerequisites: [],
    proofs: [],
    explanations: [
      {
        style: "intuitive",
        level: 1,
        authorAgent: "agent:feynman-style",
        text: {
          it: "Un numero è pari se i suoi elementi possono formare coppie senza lasciare nessuno da solo. Se moltiplichi un numero dispari per se stesso, hai file dispari di oggetti dispari: resta sempre un elemento spaiato nell'angolo!",
          en: "An integer is even if its items pair up with nobody left over. Multiplying two odd numbers leaves one extra corner item unpaired.",
          es: "Un número es par si puede agruparse en parejas exactas. Multiplicar dos impares siempre deja una unidad suelta.",
          zh: "偶数可以两两配对而不留余数；奇数乘以奇数总会在角落多出一个落单的1。",
          ar: "العدد الزوجي يمكن تجميع عناصره في أزواج دون باقٍ، بينما جداء عددين فرديين يترك دائماً عنصراً مفرداً.",
        },
      },
    ],
    sources: [
      { name: "Mathlib4", ref: "Mathlib.Algebra.Ring.Parity", license: "Apache-2.0" },
    ],
    wikidataId: "Q130901",
  },
  {
    id: "urn:mathema:concept:proof-by-contradiction",
    shortSlug: "proof-by-contradiction",
    type: "technique",
    domain: "logic_cs",
    levels: [2, 3, 4],
    x: 150,
    y: 380,
    title: {
      it: "Dimostrazione per Assurdo (Reductio ad Absurdum)",
      en: "Proof by Contradiction (Reductio ad Absurdum)",
      es: "Demostración por Reducción al Absurdo",
      zh: "反证法 (归谬法)",
      ar: "البرهان بالخلف (رد الشيء إلى المحال)",
    },
    notation: "(¬P ⇒ ⊥) ⊢ P   ·   ¬P ⇒ False",
    statements: {
      informal: {
        it: "Per dimostrare una proposizione P (o una negazione ¬Q), si assume temporaneamente l'ipotesi opposta e se ne deduce logicamente una contraddizione (⊥). Nella logica intuizionista, provare una negazione ¬Q equivale costruttivamente a derivare Q → False.",
        en: "To prove a proposition P (or a negation ¬Q), assume the opposite and derive a logical contradiction (⊥). Note that proving a negation ¬Q (i.e. Q → False) is constructively valid even without Classical.em.",
        es: "Para demostrar P (o una negación ¬Q), se asume la hipótesis opuesta y se deduce una contradicción lógica (⊥).",
        zh: "为了证明命题 P（或否定命题 ¬Q），先假设其反面成立，并由此推导出逻辑矛盾 ⊥。",
        ar: "لإثبات قضية P (أو نفي ¬Q)، نفترض صحة نقيضها ثم نستنتج تناقضاً منطقياً مستحيلاً (⊥).",
      },
      formalLean: `-- In Lean 4, provare ¬ Q significa costruire una funzione Q → False (costruttivo):
theorem prove_negation {Q : Prop} (h : Q → False) : ¬ Q := h

-- Per provare P da ¬P → False si usa invece il principio classico by_contra:
theorem classical_reductio {P : Prop} (h : ¬ P → False) : P :=
  Classical.byContradiction h`,
    },
    prerequisites: [],
    proofs: [],
    explanations: [
      {
        style: "problem_solving",
        level: 3,
        authorAgent: "agent:polya-style",
        text: {
          it: "Nota fondamentale per Lean 4: dimostrare che '√2 NON è razionale' è una proposizione negativa (¬∃ p q, ...). Non richiede la legge del terzo escluso! Basta assumere che esistano p, q e derivare False.",
          en: "Crucial distinction in Lean 4: proving '√2 is NOT rational' is a negation (Q → False). It does not require classical excluded middle—assuming Q and deriving False is purely constructive!",
          es: "En Lean 4, probar que √2 NO es racional es una implicación Q → False, por lo que es constructivamente válida.",
          zh: "在 Lean 4 中，证明“√2 不是有理数”本质上是构造映射 Q → False，因此无需排中律即可直觉主义成立。",
          ar: "في Lean 4، إثبات أن √2 غير منطق هو إثبات لنفي (Q → False)، وهو برهان بنّاء لا يحتاج حتى لبديهية الثالث المرفوع.",
        },
      },
    ],
    sources: [
      { name: "Open Logic Textbook", ref: "Natural Deduction & Classical Logic", license: "CC BY 4.0" },
      { name: "Tricki", ref: "Reductio_ad_absurdum", license: "CC BY-SA 3.0" },
    ],
    wikidataId: "Q186475",
  },
  {
    id: "urn:mathema:concept:fundamental-theorem-arithmetic",
    shortSlug: "fundamental-theorem-arithmetic",
    type: "theorem",
    domain: "number_theory",
    levels: [2, 3, 4],
    x: 420,
    y: 90,
    title: {
      it: "Teorema Fondamentale dell'Aritmetica",
      en: "Fundamental Theorem of Arithmetic",
      es: "Teorema Fundamental de la Aritmética",
      zh: "算术基本定理（唯一分解定理）",
      ar: "المبرهنة الأساسية في الحساب",
    },
    notation: "∀ n ∈ ℕ, n ≥ 2 ⇒ n = p₁^{a₁} ··· pₖ^{aₖ} (unico a meno dell'ordine)",
    statements: {
      informal: {
        it: "Ogni numero intero maggiore di 1 può essere scritto in modo unico (a meno dell'ordine dei fattori) come prodotto di numeri primi.",
        en: "Every integer greater than 1 can be factored uniquely (up to permutation of factors) as a product of prime numbers.",
        es: "Todo entero mayor que 1 se expresa de forma única (salvo el orden) como producto de números primos.",
        zh: "每个大于1的自然数均可唯一地（不计次序）分解为有限个素数的乘积。",
        ar: "كل عدد صحيح أكبر من 1 يمكن كتابته بطريقة وحيدة (بغض النظر عن الترتيب) كجداء أعداد أولية.",
      },
      formalLean: `import Mathlib.Data.Nat.Factors

#check Nat.primeFactorsList_unique
-- theorem Nat.primeFactorsList_unique {n : ℕ} {l : List ℕ}
--   (h1 : l.prod = n) (h2 : ∀ p ∈ l, Nat.Prime p) : l.Perm n.primeFactorsList`,
    },
    prerequisites: ["urn:mathema:concept:parity"],
    proofs: [],
    explanations: [
      {
        style: "intuitive",
        level: 2,
        authorAgent: "agent:feynman-style",
        text: {
          it: "I numeri primi sono gli atomi chimici della moltiplicazione: 12 è sempre composto da due atomi di '2' e un atomo di '3' (2·2·3), comunque tu decida di spezzarlo.",
          en: "Prime numbers are the chemical atoms of multiplication: 12 is always built from two '2' atoms and one '3' atom.",
          es: "Los números primos son los átomos de la multiplicación: cada entero tiene una única fórmula molecular prima.",
          zh: "素数是乘法世界的化学原子：任何正整数都有唯一确定的“素数分子式”。",
          ar: "الأعداد الأولية هي الذرات الأولية لعملية الضرب: لكل عدد صحيح تركيبة ذرية أولية وحيدة لا تتغير.",
        },
      },
    ],
    sources: [
      { name: "Mathlib4", ref: "Mathlib.Data.Nat.Factors", license: "Apache-2.0" },
    ],
    wikidataId: "Q67142",
  },
  {
    id: "urn:mathema:concept:prime-infinitude",
    shortSlug: "prime-infinitude",
    type: "theorem",
    domain: "number_theory",
    levels: [2, 3, 4],
    x: 680,
    y: 90,
    title: {
      it: "Infinità dei Numeri Primi (Teorema di Euclide)",
      en: "Infinitude of Prime Numbers (Euclid's Theorem)",
      es: "Infinitud de los Números Primos (Teorema de Euclides)",
      zh: "素数无穷多定理（欧几里得定理）",
      ar: "لانهائية الأعداد الأولية (مبرهنة إقليدس)",
    },
    notation: "∀ N ∈ ℕ, ∃ p ≥ N, Prime(p)",
    statements: {
      informal: {
        it: "Per qualsiasi insieme finito di numeri primi {p₁, …, pₖ}, esiste almeno un numero primo non appartenente all'insieme (ad esempio ogni fattore primo di N = p₁···pₖ + 1).",
        en: "For any finite list of primes, there exists a prime not in the list—constructed by taking any prime factor of N! + 1.",
        es: "Para cualquier conjunto finito de números primos, existe otro primo fuera de él (como cualquier divisor primo de N! + 1).",
        zh: "对于任意自然数 N，总存在大于或等于 N 的素数（例如 N! + 1 的最小素因子）。",
        ar: "لأي مجموعة منتهية من الأعداد الأولية، يوجد دائماً عدد أولي خارجها (مثل أي قاسم أولي للعدد N! + 1).",
      },
      formalLean: `import Mathlib.Data.Nat.Prime.Infinite

theorem euclid_infinite_primes (n : ℕ) : ∃ p, n ≤ p ∧ Nat.Prime p :=
  Nat.exists_infinite_primes n`,
    },
    prerequisites: [
      "urn:mathema:concept:fundamental-theorem-arithmetic",
      "urn:mathema:concept:proof-by-contradiction",
    ],
    proofs: [],
    explanations: [
      {
        style: "problem_solving",
        level: 3,
        authorAgent: "agent:polya-style",
        text: {
          it: "La prova di Euclide è in realtà costruttiva: dato N, il numero N! + 1 non è divisibile per nessun intero tra 2 e N (lascia sempre resto 1), quindi il suo più piccolo divisore > 1 è un primo nuovo garantito ≥ N + 1.",
          en: "Euclid's argument is constructively a generator: given N, any prime factor of N! + 1 leaves remainder 1 when divided by 2..N, so it must exceed N.",
          es: "La prueba de Euclides es constructiva: cualquier factor primo de N! + 1 debe ser estrictamente mayor que N.",
          zh: "欧几里得的证明实际上是构造性的：N! + 1 除以 2 到 N 的任何整数都余 1，因此其最小素因子必然大于 N。",
          ar: "برهان إقليدس برهان بنّاء في جوهره: العدد N! + 1 يترك باقياً قدره 1 عند قسمته على أي عدد من 2 إلى N، لذا فإن أصغر قاسم أولي له أكبر حتماً من N.",
        },
      },
    ],
    sources: [
      { name: "Mathlib4", ref: "Mathlib.Data.Nat.Prime.Infinite", license: "Apache-2.0" },
      { name: "ProofWiki", ref: "Euclid%27s_Theorem", license: "CC BY-SA 4.0" },
    ],
    wikidataId: "Q208416",
  },
  {
    id: "urn:mathema:concept:dedekind-cuts",
    shortSlug: "dedekind-cuts",
    type: "definition",
    domain: "real_analysis",
    levels: [4, 5],
    x: 680,
    y: 220,
    title: {
      it: "Sezioni di Dedekind (Costruzione Ordine-Teoretica di ℝ)",
      en: "Dedekind Cuts (Order-Theoretic Construction of ℝ)",
      es: "Cortaduras de Dedekind (Construcción de ℝ)",
      zh: "戴德金分割（实数的序构造）",
      ar: "قطوع ديديكند (البناء الترتيبي للأعداد الحقيقية ℝ)",
    },
    notation: "α = (A, B) ⊂ ℚ × ℚ   con   A = { q ∈ ℚ ∣ q < 0 ∨ q² < 2 }",
    statements: {
      informal: {
        it: "Un numero reale è identificato da una partizione (A, B) di ℚ in due insiemi non vuoti tali che ogni elemento di A è minore di ogni elemento di B e A non ha massimo. Ciò colma le 'lacune' di ℚ come √2.",
        en: "A real number is defined as a downward-closed proper non-empty subset A ⊂ ℚ with no greatest element, filling the gaps in ℚ such as {q ∈ ℚ | q < 0 ∨ q² < 2}.",
        es: "Un número real se define como una partición (A, B) de ℚ donde A es cerrado hacia abajo y sin máximo.",
        zh: "实数可定义为有理数集 ℚ 的非空真子集 A（向下封闭且无最大元），从而填补 √2 等有理数缝隙。",
        ar: "يُعرّف العدد الحقيقي كتجزئة (A, B) لمجموعة الأعداد المنطقة ℚ بحيث لا تملك A عنصراً أعظم، مما يسد الثغرات مثل √2.",
      },
      formalLean: `import Mathlib.Data.Real.Basic

-- Dedekind cut per √2 in ℚ:
def SqrtTwoCut (q : ℚ) : Prop := q < 0 ∨ q ^ 2 < 2`,
    },
    prerequisites: ["urn:mathema:concept:sqrt2-irrationality"],
    proofs: [],
    explanations: [
      {
        style: "axiomatic",
        level: 4,
        authorAgent: "agent:bourbaki-style",
        text: {
          it: "Poiché Mathema non impone un'unica ontologia rigida (Sezione 4 del Manifesto), ℝ può essere costruito sia tramite sezioni di Dedekind (ordine) sia tramite successioni di Cauchy (metrica), collegate da un arco equivalent_to verificato.",
          en: "Because Mathema supports multiple logical constructions, ℝ is represented via both Dedekind cuts and Cauchy sequences, linked by an equivalent_to isomorphism edge.",
          es: "Mathema admite construcciones lógicas múltiples: ℝ mediante cortaduras de Dedekind o sucesiones de Cauchy.",
          zh: "Mathema 支持多重逻辑构造：实数既可通过戴德金分割定义，也可通过柯西序列完备化定义，两者通过等价边相连。",
          ar: "يدعم Mathema البناءات المنطقية المتعددة: يمكن بناء ℝ عبر قطوع ديديكند أو متتاليات كوشي مع رابط تكافؤ صريح.",
        },
      },
    ],
    sources: [
      { name: "Basic Analysis (Lebl)", ref: "Ch. 1, Real Numbers", license: "CC BY-NC-SA 4.0" },
    ],
    wikidataId: "Q847949",
  },
  {
    id: "urn:mathema:concept:cauchy-sequences",
    shortSlug: "cauchy-sequences",
    type: "definition",
    domain: "real_analysis",
    levels: [4, 5],
    x: 680,
    y: 350,
    title: {
      it: "Successioni di Cauchy (Completamento Metrico di ℚ)",
      en: "Cauchy Sequences (Metric Completion of ℚ)",
      es: "Sucesiones de Cauchy (Completación Métrica de ℚ)",
      zh: "柯西序列（有理数域的度量完备化）",
      ar: "متتاليات كوشي (الإتمام المتري لحقل الأعداد المنطقة)",
    },
    notation: "ℝ ≅ Cauchy(ℚ) / Null(ℚ)   ·   ∀ ε > 0, ∃ N, ∀ m,n ≥ N, |aₘ - aₙ| < ε",
    statements: {
      informal: {
        it: "Una successione (aₙ) in ℚ è di Cauchy se i suoi termini diventano arbitrariamente vicini tra loro. Il campo ℝ è il quoziente dell'anello delle successioni di Cauchy su ℚ modulo le successioni infinitesime (costruzione adottata in Mathlib4).",
        en: "A sequence (aₙ) in ℚ is Cauchy if its terms become arbitrarily close. Mathlib4 constructs ℝ as the quotient of Cauchy sequences in ℚ by the ideal of null sequences.",
        es: "Una sucesión en ℚ es de Cauchy si sus términos se aproximan arbitrariamente entre sí. Mathlib4 define ℝ como el cociente de las sucesiones de Cauchy.",
        zh: "若序列各项彼此任意接近，则称为柯西序列。Lean 4 的 Mathlib 采用有理数柯西序列模去零序列来构造实数域 ℝ。",
        ar: "تكون المتتالية متتالية كوشي إذا تقاربت حدودها من بعضها البعض بلا حدود، ويبنى حقل الأعداد الحقيقية في Mathlib4 كخارج قسمة متتاليات كوشي.",
      },
      formalLean: `import Mathlib.Data.Real.Basic

-- In Mathlib4, Real è esattamente definito tramite Cauchy completion di ℚ:
#check Real.ofCauchy`,
    },
    prerequisites: ["urn:mathema:concept:sqrt2-irrationality"],
    proofs: [],
    explanations: [
      {
        style: "computational",
        level: 4,
        authorAgent: "agent:knuth-style",
        text: {
          it: "Il metodo di Erone/Newton aₙ₊₁ = (aₙ + 2/aₙ)/2 partendo da a₀ = 1 genera la successione razionale di Cauchy 1, 3/2, 17/12, 577/408… che raddoppia le cifre corrette di √2 a ogni iterazione!",
          en: "Heron's iteration aₙ₊₁ = (aₙ + 2/aₙ)/2 starting at a₀ = 1 yields the Cauchy sequence 1, 3/2, 17/12, 577/408… doubling the precision of √2 at every step.",
          es: "El método de Herón genera la sucesión racional de Cauchy 1, 3/2, 17/12, 577/408… que converge cuadráticamente a √2.",
          zh: "海伦-牛顿迭代 aₙ₊₁ = (aₙ + 2/aₙ)/2 生成有理柯西序列 1, 3/2, 17/12, 577/408…，每步有效数字翻倍逼近 √2。",
          ar: "خوارزمية هيرون تولد متتالية كوشي المنطقة 1، 3/2، 17/12، 577/408... التي تتقارب بسرعة تربيعية نحو √2.",
        },
      },
    ],
    sources: [
      { name: "Mathlib4", ref: "Mathlib.Data.Real.Basic", license: "Apache-2.0" },
    ],
    wikidataId: "Q217847",
  },
  {
    id: "urn:mathema:concept:completeness-reals",
    shortSlug: "completeness-reals",
    type: "theorem",
    domain: "real_analysis",
    levels: [4, 5, 6],
    x: 940,
    y: 280,
    title: {
      it: "Completezza di ℝ e Proprietà dell'Estremo Superiore",
      en: "Completeness of ℝ and Least Upper Bound Property",
      es: "Completitud de ℝ y Propiedad del Supremo",
      zh: "实数完备性与确界原理",
      ar: "اكتمال حقل الأعداد الحقيقية ℝ وخاصية الحد الأعلى الأصغر",
    },
    notation: "∀ S ⊂ ℝ, S ≠ ∅ ∧ BddAbove(S) ⇒ ∃ sup S ∈ ℝ",
    statements: {
      informal: {
        it: "Ogni sottoinsieme non vuoto e superiormente limitato di numeri reali possiede un estremo superiore in ℝ. A meno di isomorfismi d'ordine e di campo, ℝ è l'unico campo ordinato archimedeo completo.",
        en: "Every non-empty subset of ℝ that is bounded above has a least upper bound (supremum) in ℝ. Up to unique isomorphism, ℝ is the unique complete ordered field.",
        es: "Todo subconjunto no vacío de ℝ acotado superiormente posee supremo en ℝ.",
        zh: "实数集 ℝ 的任何非空有上界子集必在 ℝ 中有上确界。在唯一同构意义下，ℝ 是唯一的完备有序域。",
        ar: "كل مجموعة جزئية غير خالية ومحدودة من الأعلى في ℝ تملك حداً أعلى أصغر (Supremum) في ℝ.",
      },
      formalLean: `import Mathlib.Data.Real.Archimedean

#check Real.exists_isLub`,
    },
    prerequisites: [
      "urn:mathema:concept:dedekind-cuts",
      "urn:mathema:concept:cauchy-sequences",
    ],
    proofs: [],
    explanations: [
      {
        style: "axiomatic",
        level: 4,
        authorAgent: "agent:bourbaki-style",
        text: {
          it: "L'assioma di completezza di Dedekind-Cantor è il ponte che rende possibili il Teorema degli Zeri di Bolzano, il Teorema di Weierstrass e l'intero calcolo differenziale e integrale.",
          en: "Completeness is the foundational bridge enabling the Intermediate Value Theorem, Extreme Value Theorem, and all of calculus.",
          es: "El axioma del supremo es el puente fundamental que garantiza el Teorema de Bolzano y todo el análisis matemático.",
          zh: "实数完备性是微积分的基石，直接支撑介值定理、极值定理与一致连续性。",
          ar: "خاصية الاكتمال هي الجسر الأساسي الذي تقوم عليه مبرهنة القيمة المتوسطة وحساب التفاضل والتكامل بأكمله.",
        },
      },
    ],
    sources: [
      { name: "Basic Analysis (Lebl)", ref: "Section 1.2", license: "CC BY-NC-SA 4.0" },
      { name: "Mathlib4", ref: "Mathlib.Data.Real.Archimedean", license: "Apache-2.0" },
    ],
    wikidataId: "Q1140413",
  },
  {
    id: "urn:mathema:concept:curry-howard",
    shortSlug: "curry-howard",
    type: "theorem",
    domain: "logic_cs",
    levels: [4, 5, 6, 7],
    x: 420,
    y: 410,
    title: {
      it: "Corrispondenza di Curry-Howard (Proposizioni come Tipi)",
      en: "Curry-Howard Correspondence (Propositions as Types)",
      es: "Correspondencia de Curry-Howard (Proposiciones como Tipos)",
      zh: "柯里-霍华德同构（命题即类型，证明即程序）",
      ar: "تطابق كوري-هاوارد (القضايا كأنماط والبراهين كبرامج)",
    },
    notation: "Proposizione ↔ Tipo (Prop : Sort 0)   ·   Dimostrazione ↔ Programma (t : P)",
    statements: {
      informal: {
        it: "Esiste un isomorfismo strutturale profondo tra i sistemi logici formali e i calcoli tipati: una proposizione matematica corrisponde a un tipo, una sua dimostrazione corrisponde a un programma di quel tipo, e la semplificazione di una prova corrisponde alla valutazione (β-riduzione) del programma.",
        en: "There is a structural isomorphism between formal logic and type systems: propositions correspond to types, proofs correspond to programs inhabiting those types, and proof normalization corresponds to computation.",
        es: "Existe un isomorfismo estructural entre la lógica formal y los sistemas de tipos: las proposiciones son tipos y las demostraciones son programas.",
        zh: "形式逻辑与类型系统之间存在深刻同构：数学命题对应类型，证明对应构造该类型的程序，证明化简对应程序求值。",
        ar: "يوجد تشاكل بنيوي عميق بين المنطق الصوري وأنظمة الأنماط البرمجية: القضايا الرياضية تقابل الأنماط، والبراهين تقابل البرامج.",
      },
      formalLean: `-- In Lean 4 (Calculus of Inductive Constructions), un teorema È una funzione tipata:
theorem modus_ponens (P Q : Prop) (hpq : P → Q) (hp : P) : Q :=
  hpq hp`,
    },
    prerequisites: ["urn:mathema:concept:proof-by-contradiction"],
    proofs: [],
    explanations: [
      {
        style: "computational",
        level: 4,
        authorAgent: "agent:knuth-style",
        text: {
          it: "Ecco perché in Mathema il ponte tra linguaggio naturale e Lean 4 funziona: verificare una dimostrazione matematica in Lean equivale letteralmente a eseguire il type-checking di un programma funzionale!",
          en: "This is why Mathema's NL ↔ Lean 4 bridge works: checking a mathematical proof in Lean is literally type-checking a functional program.",
          es: "Por esto funciona el puente NL ↔ Lean 4 en Mathema: verificar una demostración es comprobar los tipos de un programa.",
          zh: "这正是 Mathema 中自然语言与 Lean 4 双向桥梁的核心原理：检验数学证明在计算上等价于对函数式程序进行类型检查。",
          ar: "هذا هو السر وراء جسر Mathema بين اللغة الطبيعية و Lean 4: التحقق من صحة برهان رياضي هو حرفياً فحص الأنماط (Type-checking) لبرنامج حاسوبي.",
        },
      },
    ],
    sources: [
      { name: "Delftse Foundations of Computation", ref: "Ch. Type Theory", license: "CC BY-SA 4.0" },
      { name: "nLab", ref: "propositions_as_types", license: "CC BY-SA 3.0" },
    ],
    wikidataId: "Q1068089",
  },
  {
    id: "urn:mathema:concept:group-definition",
    shortSlug: "group-definition",
    type: "definition",
    domain: "abstract_algebra",
    levels: [3, 4, 5],
    x: 680,
    y: 470,
    title: {
      it: "Struttura di Gruppo e Simmetrie (G, ·, e, ⁻¹)",
      en: "Group Structure and Symmetries (G, ·, e, ⁻¹)",
      es: "Estructura de Grupo y Simetrías (G, ·, e, ⁻¹)",
      zh: "群结构与对称性 (G, ·, e, ⁻¹)",
      ar: "بنية الزمرة والتناظرات (G, ·, e, ⁻¹)",
    },
    notation: "(G, ·) : associatività, elemento neutro e, inverso g⁻¹",
    statements: {
      informal: {
        it: "Un gruppo è un insieme G dotato di un'operazione binaria associativa che ammette un elemento neutro e ed in cui ogni elemento possiede un inverso. È il linguaggio universale della simmetria.",
        en: "A group is a set G equipped with an associative binary operation, an identity element e, and an inverse for every element.",
        es: "Un grupo es un conjunto G con una operación binaria associativa, elemento neutro e inverso para cada elemento.",
        zh: "群是配备了结合二元运算、单位元 e 以及每个元素逆元的集合 G，是描述对称性的通用语言。",
        ar: "الزمرة هي مجموعة G مزودة بعملية ثنائية تجميعية وعنصر حيادي e وعنصر نظير لكل عنصر فيها، وهي لغة التناظر الكونية.",
      },
      formalLean: `import Mathlib.Algebra.Group.Defs

#check Group
-- class Group (G : Type u) extends DivInvMonoid G where
--   inv_mul_cancel : ∀ a : G, a⁻¹ * a = 1`,
    },
    prerequisites: ["urn:mathema:concept:parity"],
    proofs: [],
    explanations: [
      {
        style: "intuitive",
        level: 3,
        authorAgent: "agent:feynman-style",
        text: {
          it: "Ruotare un quadrato di 90° e poi di altri 90° equivale a ruotarlo di 180° (composizione); non toccarlo è l'elemento neutro; ruotarlo all'indietro annulla la mossa (inverso). Ogni collezione di mosse reversibili forma un gruppo!",
          en: "Rotating a square by 90° and then another 90° is a single 180° rotation; doing nothing is the identity; reversing the turn is the inverse. Any collection of reversible symmetries forms a group.",
          es: "Cualquier colección de transformaciones reversibles que dejan invariante un objeto geométrico forma un grupo.",
          zh: "将正方形旋转90度再旋转90度等于旋转180度，不动是单位元，反向旋转是逆元——所有可逆对称操作都构成群。",
          ar: "تدوير مربع بزاوية 90 درجة ثم 90 درجة أخرى يكافئ تدويره 180 درجة؛ عدم التحريك هو الحيادي؛ والعكس هو النظير. كل مجموعة حركات عكوسة تشكل زمرة.",
        },
      },
    ],
    sources: [
      { name: "Abstract Algebra (Judson)", ref: "Ch. 3, Groups", license: "GFDL" },
      { name: "Mathlib4", ref: "Mathlib.Algebra.Group.Defs", license: "Apache-2.0" },
    ],
    wikidataId: "Q83478",
  },
  {
    id: "urn:mathema:concept:noether-theorem",
    shortSlug: "noether-theorem",
    type: "theorem",
    domain: "physics",
    levels: [4, 5, 6, 7],
    x: 940,
    y: 470,
    title: {
      it: "Teorema di Noether (Simmetrie Continue ↔ Leggi di Conservazione)",
      en: "Noether's Theorem (Continuous Symmetries ↔ Conservation Laws)",
      es: "Teorema de Noether (Simetrías Continuas ↔ Leyes de Conservación)",
      zh: "诺特定理（连续对称性与守恒律的对应）",
      ar: "مبرهنة نويثر (التناظرات المستمرة وقوانين الانحفاظ الفيزيائية)",
    },
    notation: "δS = 0 (simmetria di Lie)  ⇒  d/dt (∂L/∂q̇ᵢ · δqᵢ) = 0",
    statements: {
      informal: {
        it: "Ad ogni simmetria differenziabile dell'azione di un sistema fisico corrisponde una grandezza fisica conservata: l'invarianza per traslazione temporale implica la conservazione dell'energia; per traslazione spaziale la quantità di moto; per rotazione il momento angolare.",
        en: "Every differentiable symmetry of the action of a physical system has a corresponding conservation law: time translation yields energy conservation; spatial translation yields momentum conservation.",
        es: "A cada simetría diferenciable de la acción de un sistema físico le corresponde una ley de conservación (energía, momento lineal, momento angular).",
        zh: "物理系统作用量的每一个连续可微对称性都对应一条守恒定律：时间平移对应能量守恒，空间平移对应动量守恒，旋转对应角动量守恒。",
        ar: "لكل تناظر مستمر وقابل للمفاضلة لفعل نظام فيزيائي قانون انحفاظ مقابل: التناظر الزمني يعطي انحفاظ الطاقة، والمكاني يعطي انحفاظ كمية الحركة.",
      },
      formalLean: `-- Formalizzazione variazionale discreta/continua della carica di Noether:
structure LagrangianSystem (Q : Type) where
  L : (ℝ → Q) → ℝ → ℝ`,
    },
    prerequisites: [
      "urn:mathema:concept:group-definition",
      "urn:mathema:concept:completeness-reals",
    ],
    proofs: [],
    explanations: [
      {
        style: "applied",
        level: 4,
        authorAgent: "agent:noether-style",
        text: {
          it: "Formulato da Emmy Noether nel 1915, questo teorema unifica l'algebra astratta dei gruppi di Lie e l'analisi variazionale con la fisica fondamentale: l'energia si conserva perché le leggi della fisica oggi sono identiche a quelle di ieri.",
          en: "Proved by Emmy Noether in 1915, this theorem bridges Lie group algebra and calculus of variations with fundamental physics: energy is conserved because the laws of physics do not change with time.",
          es: "Demostrado por Emmy Noether en 1915, conecta los grupos de simetría con la física fundamental: la energía se conserva porque las leyes físicas son invariantes en el tiempo.",
          zh: "由埃米·诺特于1915年证明，将抽象代数中的李群与变分分析、理论物理完美统一。",
          ar: "برهنتها إيمي نويثر عام 1915، وهي تربط نظرية الزمر بالفيزياء الأساسية: الطاقة محفوظة لأن قوانين الفيزياء لا تتغير بمرور الزمن.",
        },
      },
    ],
    sources: [
      { name: "Motion Mountain (Schiller)", ref: "Vol. I, Conservation & Symmetry", license: "CC BY-NC-ND" },
      { name: "Scholarpedia", ref: "Noether_theorem", license: "CC BY-NC-SA" },
    ],
    wikidataId: "Q468677",
  },
];

export const MATHEMA_EDGES: MathemaEdge[] = [
  {
    id: "edge-1",
    from: "urn:mathema:concept:rational-number",
    to: "urn:mathema:concept:sqrt2-irrationality",
    type: "requires",
    weight: 0.98,
    source: "human",
    confidence: 1.0,
    note: "Definizione di frazione ridotta ai minimi termini gcd(p, q) = 1.",
  },
  {
    id: "edge-2",
    from: "urn:mathema:concept:parity",
    to: "urn:mathema:concept:sqrt2-irrationality",
    type: "requires",
    weight: 0.95,
    source: "human",
    confidence: 1.0,
    note: "Lemma chiave: se p² è pari allora p è pari.",
  },
  {
    id: "edge-3",
    from: "urn:mathema:concept:proof-by-contradiction",
    to: "urn:mathema:concept:sqrt2-irrationality",
    type: "requires",
    weight: 0.92,
    source: "human",
    confidence: 1.0,
    note: "Struttura logica della prova per assurdo / negazione costruttiva.",
  },
  {
    id: "edge-4",
    from: "urn:mathema:concept:parity",
    to: "urn:mathema:concept:fundamental-theorem-arithmetic",
    type: "generalizes",
    weight: 0.88,
    source: "human",
    confidence: 0.98,
    note: "La parità è il caso p = 2 della valutazione p-adica.",
  },
  {
    id: "edge-5",
    from: "urn:mathema:concept:fundamental-theorem-arithmetic",
    to: "urn:mathema:concept:sqrt2-irrationality",
    type: "proved_by",
    weight: 0.94,
    source: "human",
    confidence: 1.0,
    note: "Fornisce la Prova 3 (fattorizzazione unica per √n non quadrato perfetto).",
  },
  {
    id: "edge-6",
    from: "urn:mathema:concept:fundamental-theorem-arithmetic",
    to: "urn:mathema:concept:prime-infinitude",
    type: "requires",
    weight: 0.96,
    source: "human",
    confidence: 1.0,
    note: "Ogni intero N! + 1 > 1 ammette almeno un fattore primo.",
  },
  {
    id: "edge-7",
    from: "urn:mathema:concept:proof-by-contradiction",
    to: "urn:mathema:concept:prime-infinitude",
    type: "requires",
    weight: 0.85,
    source: "human",
    confidence: 0.95,
    note: "Usato nella formulazione classica per assurdo.",
  },
  {
    id: "edge-8",
    from: "urn:mathema:concept:sqrt2-irrationality",
    to: "urn:mathema:concept:dedekind-cuts",
    type: "requires",
    weight: 0.91,
    source: "human",
    confidence: 0.99,
    note: "L'incommensurabilità di √2 motiva il completamento d'ordine di ℚ.",
  },
  {
    id: "edge-9",
    from: "urn:mathema:concept:sqrt2-irrationality",
    to: "urn:mathema:concept:cauchy-sequences",
    type: "requires",
    weight: 0.90,
    source: "human",
    confidence: 0.99,
    note: "La successione di Erone per √2 è di Cauchy in ℚ ma non converge in ℚ.",
  },
  {
    id: "edge-10",
    from: "urn:mathema:concept:dedekind-cuts",
    to: "urn:mathema:concept:cauchy-sequences",
    type: "equivalent_to",
    weight: 1.0,
    source: "human",
    confidence: 1.0,
    note: "Costruzioni logiche alternative isomorfe del campo reale ℝ.",
  },
  {
    id: "edge-11",
    from: "urn:mathema:concept:dedekind-cuts",
    to: "urn:mathema:concept:completeness-reals",
    type: "proved_by",
    weight: 0.97,
    source: "human",
    confidence: 1.0,
    note: "L'unione di sezioni di Dedekind fornisce direttamente sup S.",
  },
  {
    id: "edge-12",
    from: "urn:mathema:concept:cauchy-sequences",
    to: "urn:mathema:concept:completeness-reals",
    type: "proved_by",
    weight: 0.97,
    source: "human",
    confidence: 1.0,
    note: "Completezza sequenziale più assioma di Archimede equivalgono a sup S.",
  },
  {
    id: "edge-13",
    from: "urn:mathema:concept:proof-by-contradiction",
    to: "urn:mathema:concept:curry-howard",
    type: "applied_to",
    weight: 0.93,
    source: "human",
    confidence: 0.98,
    note: "Distinzione tra negazione costruttiva (P → False) e logica classica in Lean 4.",
  },
  {
    id: "edge-14",
    from: "urn:mathema:concept:parity",
    to: "urn:mathema:concept:group-definition",
    type: "special_case_of",
    weight: 0.87,
    source: "human",
    confidence: 0.96,
    note: "L'aritmetica di parità (ℤ/2ℤ, +) è il più piccolo gruppo ciclico non banale.",
  },
  {
    id: "edge-15",
    from: "urn:mathema:concept:group-definition",
    to: "urn:mathema:concept:noether-theorem",
    type: "applied_to",
    weight: 0.95,
    source: "human",
    confidence: 0.99,
    note: "I gruppi continui di simmetria (gruppi di Lie) generano gli invarianti fisici.",
  },
  {
    id: "edge-16",
    from: "urn:mathema:concept:completeness-reals",
    to: "urn:mathema:concept:noether-theorem",
    type: "requires",
    weight: 0.89,
    source: "human",
    confidence: 0.95,
    note: "Richiede il calcolo differenziale e variazionale su ℝ.",
  },
];

export interface BridgePreset {
  id: string;
  label: string;
  statement: string;
  mode: "nl_to_lean" | "lean_to_nl";
  defaultLevel: string;
  defaultStyle: PedagogicalStyle;
  precomputedResult: {
    urnId: string;
    parsedGoal: string;
    domain: string;
    prerequisites: string[];
    leanCode: string;
    tacticTrace: {
      tactic: string;
      goalBefore: string;
      goalAfter: string;
    }[];
    semanticAudit: {
      coherencePreserved: boolean;
      locDecompSummary: string;
      potentialPitfalls: string[];
      mathlibPremises: string[];
      tauCetiRubric?: {
        mathlibDeference: string;
        generalityAndReuse: string;
        noDuplicationCheck: string;
      };
      palomarMetadataYaml?: string;
    };
    deformalizedExplanation: string;
    pedagogicalCurator: {
      nextRecommendedNode: string;
      exercisePrompt: string;
      exerciseLeanContract: string;
    };
  };
}

export const BRIDGE_PRESETS: BridgePreset[] = [
  {
    id: "sqrt2",
    label: "Dimostra che √2 è irrazionale",
    statement: "Dimostra che la radice quadrata di 2 è un numero irrazionale, cioè non può essere espressa come frazione p/q di interi coprimi.",
    mode: "nl_to_lean",
    defaultLevel: "3",
    defaultStyle: "intuitive",
    precomputedResult: {
      urnId: "urn:mathema:concept:sqrt2-irrationality",
      parsedGoal: "Irrational (Real.sqrt 2) ∧ ∀ (p q : ℕ), q ≠ 0 → Nat.Coprime p q → p^2 ≠ 2 * q^2",
      domain: "number_theory",
      prerequisites: [
        "urn:mathema:concept:rational-number",
        "urn:mathema:concept:parity",
        "urn:mathema:concept:proof-by-contradiction",
      ],
      leanCode: `import Mathlib.Data.Real.Irrational
import Mathlib.Data.Nat.Prime.Basic

-- 1. Enunciato principale collegato a Mathlib4:
theorem sqrt2_is_irrational : Irrational (Real.sqrt 2) := by
  exact irrational_sqrt_two

-- 2. Nucleo aritmetico esplicito per la deformalizzazione pedagogica:
theorem coprime_sq_ne_two_mul_sq (p q : ℕ) (hcop : Nat.Coprime p q) (hq : q ≠ 0) :
    p ^ 2 ≠ 2 * q ^ 2 := by
  intro h_eq
  have hp2 : 2 ∣ p ^ 2 := ⟨q ^ 2, h_eq⟩
  have hp : 2 ∣ p := Nat.Prime.dvd_of_dvd_pow Nat.prime_two hp2
  obtain ⟨k, rfl⟩ := hp
  have hq2 : 2 ∣ q ^ 2 := ⟨k ^ 2, by linarith⟩
  have hq_div : 2 ∣ q := Nat.Prime.dvd_of_dvd_pow Nat.prime_two hq2
  have h_gcd : 2 ∣ Nat.gcd (2 * k) q := Nat.dvd_gcd ⟨k, rfl⟩ hq_div
  rw [hcop.gcd_eq_one] at h_gcd
  omega`,
      tacticTrace: [
        {
          tactic: "intro h_eq",
          goalBefore: "⊢ p ^ 2 ≠ 2 * q ^ 2",
          goalAfter: "h_eq : p ^ 2 = 2 * q ^ 2 ⊢ False",
        },
        {
          tactic: "have hp : 2 ∣ p := Nat.Prime.dvd_of_dvd_pow Nat.prime_two ⟨q^2, h_eq⟩",
          goalBefore: "h_eq : p ^ 2 = 2 * q ^ 2 ⊢ False",
          goalAfter: "hp : 2 ∣ p ⊢ False",
        },
        {
          tactic: "obtain ⟨k, rfl⟩ := hp ; have hq_div : 2 ∣ q",
          goalBefore: "p = 2 * k, (2 * k)^2 = 2 * q^2 ⊢ False",
          goalAfter: "hp : 2 ∣ p, hq_div : 2 ∣ q, hcop : Nat.Coprime p q ⊢ False",
        },
        {
          tactic: "rw [hcop.gcd_eq_one] at h_gcd ; omega",
          goalBefore: "h_gcd : 2 ∣ 1 ⊢ False",
          goalAfter: "No goals (Q.E.D. verificato dal kernel Lean 4)",
        },
      ],
      semanticAudit: {
        coherencePreserved: true,
        locDecompSummary:
          "Controllo LoC-Decomp & SAGE superato: l'enunciato copre sia il predicato topologico-algebrico Irrational (Real.sqrt 2) sia la riduzione aritmetica sui coprimi senza ipotesi ridondanti.",
        potentialPitfalls: [
          "Evitata la divisione intera troncata p / q in ℕ che in Lean 4 restituisce un naturale anziché un razionale (errore classico di illusione del rigore).",
          "Esplicitata l'ipotesi q ≠ 0 per escludere la soluzione banale p = 0, q = 0.",
        ],
        mathlibPremises: [
          "irrational_sqrt_two",
          "Nat.Prime.dvd_of_dvd_pow",
          "Nat.Coprime.gcd_eq_one",
        ],
        tauCetiRubric: {
          mathlibDeference:
            "Conforme (Valore 1 Mathlib/Tau Ceti): utilizza direttamente il predicato canonico `Irrational` e `Real.sqrt` da `Mathlib.Data.Real.Irrational` senza ridefinire i reali o i razionali.",
          generalityAndReuse:
            "Conforme (Valore 3): collegato al teorema generale `irrational_sqrt_nat_iff` per il riuso immediato su qualsiasi intero non quadrato perfetto.",
          noDuplicationCheck:
            "Verificato: nessuna duplicazione di API esistenti; la prova aritmetica esplicita è marcata come vista pedagogica ausiliaria sul nodo `urn:mathema:concept:sqrt2-irrationality`.",
        },
        palomarMetadataYaml: `# Palomar Registry Standard — formalization.yaml
project: "Mathema Knowledge Graph"
urn: "urn:mathema:concept:sqrt2-irrationality"
formalization_mode: "human_curated_with_ai_deformalization"
authors_involvement: "Curated according to Mathema Blueprint v0.1 (Marco Razzano)"
mathlib_compatibility: "Lean 4.12 / Mathlib4 master"
comparator:
  target_statement: "Irrational (Real.sqrt 2)"
  canonical_mathlib_ref: "irrational_sqrt_two"
  divergences: "none"
  audit_status: "verified"`,
      },
      deformalizedExplanation:
        "Procediamo per contraddizione costruttiva (intro h_eq): supponiamo che esista una frazione ridotta ai minimi termini p/q (con gcd(p, q) = 1 e q ≠ 0) tale che p² = 2q². Dal fatto che p² è multiplo di 2 e 2 è primo, il lemma di Euclide (Nat.Prime.dvd_of_dvd_pow) garantisce che 2 divide p. Scrivendo p = 2k e sostituendo nell'equazione, otteniamo 4k² = 2q², ossia q² = 2k². Applicando lo stesso lemma a q², deduciamo che 2 divide anche q. Dunque 2 divide il massimo comun divisore gcd(p, q) = 1, il che è aritmeticamente impossibile.",
      pedagogicalCurator: {
        nextRecommendedNode: "urn:mathema:concept:dedekind-cuts",
        exercisePrompt:
          "Adatta lo stesso schema per dimostrare che √3 è irrazionale utilizzando la divisibilità per il primo 3.",
        exerciseLeanContract:
          "theorem coprime_sq_ne_three_mul_sq (p q : ℕ) (hcop : Nat.Coprime p q) (hq : q ≠ 0) : p ^ 2 ≠ 3 * q ^ 2 := by sorry",
      },
    },
  },
  {
    id: "euclid-primes",
    label: "Teorema di Euclide sull'infinità dei primi",
    statement: "Dimostra che esistono infiniti numeri primi: per ogni numero naturale n esiste un numero primo p maggiore o uguale a n.",
    mode: "nl_to_lean",
    defaultLevel: "3",
    defaultStyle: "problem_solving",
    precomputedResult: {
      urnId: "urn:mathema:concept:prime-infinitude",
      parsedGoal: "∀ (n : ℕ), ∃ (p : ℕ), n ≤ p ∧ Nat.Prime p",
      domain: "number_theory",
      prerequisites: [
        "urn:mathema:concept:fundamental-theorem-arithmetic",
        "urn:mathema:concept:proof-by-contradiction",
      ],
      leanCode: `import Mathlib.Data.Nat.Prime.Basic
import Mathlib.Data.Nat.Factorial.Basic

theorem mathema_infinite_primes (n : ℕ) : ∃ p, n ≤ p ∧ Nat.Prime p := by
  let p := Nat.minFac (Nat.factorial n + 1)
  have h_ne_one : Nat.factorial n + 1 ≠ 1 := by
    exact Nat.ne_of_gt (Nat.succ_lt_succ (Nat.factorial_pos n))
  have hp_prime : Nat.Prime p := Nat.minFac_prime h_ne_one
  refine ⟨p, ?_, hp_prime⟩
  by_contra! h_lt
  have h_dvd_fact : p ∣ Nat.factorial n :=
    Nat.dvd_factorial hp_prime.pos (Nat.le_of_lt h_lt)
  have h_dvd_succ : p ∣ Nat.factorial n + 1 := Nat.minFac_dvd (Nat.factorial n + 1)
  have h_dvd_one : p ∣ 1 := (Nat.dvd_add_right h_dvd_fact).mp h_dvd_succ
  exact Nat.Prime.not_dvd_one hp_prime h_dvd_one`,
      tacticTrace: [
        {
          tactic: "let p := Nat.minFac (Nat.factorial n + 1)",
          goalBefore: "⊢ ∃ p, n ≤ p ∧ Nat.Prime p",
          goalAfter: "p := minFac (n! + 1) ⊢ n ≤ p ∧ Nat.Prime p",
        },
        {
          tactic: "by_contra! h_lt",
          goalBefore: "hp_prime : Nat.Prime p ⊢ n ≤ p",
          goalAfter: "h_lt : p < n ⊢ False",
        },
        {
          tactic: "have h_dvd_one : p ∣ 1 := (Nat.dvd_add_right h_dvd_fact).mp h_dvd_succ",
          goalBefore: "p ∣ n!, p ∣ n! + 1 ⊢ False",
          goalAfter: "h_dvd_one : p ∣ 1 ⊢ False",
        },
      ],
      semanticAudit: {
        coherencePreserved: true,
        locDecompSummary:
          "Formalizzazione costruttiva basata su n! + 1 e sul minimo fattore primo (Nat.minFac). Nessun uso improprio di insiemi infiniti non computabili.",
        potentialPitfalls: [
          "Attenzione in Lean 4 alla sottrazione troncata su ℕ: usando Nat.dvd_add_right si evita di scrivere (n! + 1) - n!.",
        ],
        mathlibPremises: [
          "Nat.minFac_prime",
          "Nat.dvd_factorial",
          "Nat.Prime.not_dvd_one",
        ],
        tauCetiRubric: {
          mathlibDeference:
            "Conforme: usa `Nat.Prime`, `Nat.minFac` e `Nat.factorial` direttamente da Mathlib4 (`Nat.exists_infinite_primes`).",
          generalityAndReuse:
            "Conforme: l'enunciato `∀ n, ∃ p ≥ n, Nat.Prime p` permette di derivare immediatamente `{p | Nat.Prime p}.Infinite`.",
          noDuplicationCheck:
            "Verificato: allineato alle convenzioni di naming e modularità di Mathlib / Tau Ceti.",
        },
        palomarMetadataYaml: `# Palomar Registry Standard — formalization.yaml
project: "Mathema Knowledge Graph"
urn: "urn:mathema:concept:prime-infinitude"
formalization_mode: "human_curated_with_ai_deformalization"
mathlib_compatibility: "Lean 4.12 / Mathlib4 master"
comparator:
  target_statement: "∀ (n : ℕ), ∃ p, n ≤ p ∧ Nat.Prime p"
  canonical_mathlib_ref: "Nat.exists_infinite_primes"
  divergences: "none"
  audit_status: "verified"`,
      },
      deformalizedExplanation:
        "Dato un qualunque intero n, costruiamo il numero N = n! + 1. Poiché n! ≥ 1, abbiamo N ≥ 2, dunque N possiede un minimo fattore primo p = minFac(n! + 1). Mostriamo che p ≥ n: se per assurdo fosse p < n, allora p comparirebbe tra i fattori di n! = 1 · 2 ··· n, quindi p dividerebbe sia n! sia n! + 1. Ma allora p dividerebbe la loro differenza, cioè 1, il che è impossibile perché ogni numero primo è ≥ 2.",
      pedagogicalCurator: {
        nextRecommendedNode: "urn:mathema:concept:sqrt2-irrationality",
        exercisePrompt:
          "Dimostra che esistono infiniti numeri primi della forma 4k + 3.",
        exerciseLeanContract:
          "theorem exists_infinite_primes_mod_four (n : ℕ) : ∃ p ≥ n, Nat.Prime p ∧ p % 4 = 3 := by sorry",
      },
    },
  },
  {
    id: "sum-naturals",
    label: "Formula di Gauss: somma dei primi n interi",
    statement: "Dimostra per induzione che il doppio della somma dei primi n numeri naturali da 0 a n è uguale a n(n + 1).",
    mode: "nl_to_lean",
    defaultLevel: "2",
    defaultStyle: "computational",
    precomputedResult: {
      urnId: "urn:mathema:concept:gauss-sum-formula",
      parsedGoal: "∀ (n : ℕ), 2 * (∑ i ∈ Finset.range (n + 1), i) = n * (n + 1)",
      domain: "number_theory",
      prerequisites: ["urn:mathema:concept:parity"],
      leanCode: `import Mathlib.Algebra.BigOperators.Intervals
import Mathlib.Tactic.Ring

open Finset

theorem gauss_sum_twice (n : ℕ) :
    2 * (∑ i ∈ range (n + 1), i) = n * (n + 1) := by
  induction n with
  | zero => simp
  | succ k ih =>
    rw [Finset.sum_range_succ, mul_add, ih]
    ring`,
      tacticTrace: [
        {
          tactic: "induction n with | zero => simp | succ k ih => ...",
          goalBefore: "⊢ 2 * ∑ i ∈ range (n + 1), i = n * (n + 1)",
          goalAfter: "ih : 2 * ∑ i ∈ range (k + 1), i = k * (k + 1) ⊢ 2 * ∑ i ∈ range (k + 2), i = (k + 1) * (k + 2)",
        },
        {
          tactic: "rw [Finset.sum_range_succ, mul_add, ih] ; ring",
          goalBefore: "⊢ k * (k + 1) + 2 * (k + 1) = (k + 1) * (k + 2)",
          goalAfter: "No goals (identità polinomiale chiusa da ring)",
        },
      ],
      semanticAudit: {
        coherencePreserved: true,
        locDecompSummary:
          "Formulazione moltiplicata per 2 (2 * ∑ i = n * (n + 1)) scelta deliberatamente per evitare la divisione intera troncata su ℕ.",
        potentialPitfalls: [
          "Scrivere (n * (n + 1)) / 2 su ℕ in Lean è semanticamente più debole se non si affianca la parità di n(n+1); moltiplicare per 2 preserva l'uguaglianza esatta.",
        ],
        mathlibPremises: ["Finset.sum_range_succ", "mul_add"],
        tauCetiRubric: {
          mathlibDeference:
            "Conforme: utilizza l'operatore canonico `Finset.sum` e `Finset.range` come in `Finset.sum_range_id_mul_two`.",
          generalityAndReuse:
            "Conforme: evita la divisione naturale troncata, rendendo il lemma riscrivibile con `rw` in qualsiasi anello commutativo.",
          noDuplicationCheck:
            "Verificato: collegato a `Finset.sum_range_id` in Mathlib4.",
        },
        palomarMetadataYaml: `# Palomar Registry Standard — formalization.yaml
project: "Mathema Knowledge Graph"
urn: "urn:mathema:concept:gauss-sum-formula"
formalization_mode: "human_curated_with_ai_deformalization"
mathlib_compatibility: "Lean 4.12 / Mathlib4 master"
comparator:
  target_statement: "2 * (∑ i ∈ range (n + 1), i) = n * (n + 1)"
  canonical_mathlib_ref: "Finset.sum_range_id_mul_two"
  divergences: "none"
  audit_status: "verified"`,
      },
      deformalizedExplanation:
        "Affianchiamo due copie della scala 1 + 2 + … + n, una dritta e una capovolta: ogni colonna verticale vale (n + 1) e ci sono esattamente n colonne. Per induzione su n: per n = 0 entrambi i membri valgono 0; passando da k a k + 1 aggiungiamo due volte il nuovo gradino (k + 1) al rettangolo k(k + 1), ottenendo k(k + 1) + 2(k + 1) = (k + 1)(k + 2).",
      pedagogicalCurator: {
        nextRecommendedNode: "urn:mathema:concept:fundamental-theorem-arithmetic",
        exercisePrompt:
          "Dimostra che per ogni numero naturale n il prodotto n(n + 1) è sempre un numero pari.",
        exerciseLeanContract:
          "theorem even_mul_succ (n : ℕ) : Even (n * (n + 1)) := Nat.even_mul_succ_self n",
      },
    },
  },
];

export interface ArchitecturalLayer {
  layer: number;
  name: string;
  functionDesc: string;
  keyTechnologies: string[];
  manifestoNotes: string;
}

export const TEN_LAYERS: ArchitecturalLayer[] = [
  {
    layer: 0,
    name: "Acquisizione",
    functionDesc: "Digitalizzazione, OCR matematico, pulizia LaTeX/MathML e normalizzazione strutturale.",
    keyTechnologies: ["catdat.app", "MathML", "LaTeX AST", "PDF-to-Markdown"],
    manifestoNotes: "Rispetto rigoroso delle licenze fin dall'ingestione: nessuno scraping indiscriminato.",
  },
  {
    layer: 1,
    name: "Ontologia & Registro Palomar",
    functionDesc: "ID condivisi (URN), schema nodi/archi tipati, licenze granulari e metadati di provenienza Palomar (formalization.yaml).",
    keyTechnologies: ["Palomar Registry", "Wikidata Q-IDs", "OpenMath CDs", "zbMATH Open KG"],
    manifestoNotes: "Ogni formalizzazione dichiara come è stata prodotta, la relazione con la letteratura e un Comparator verificabile.",
  },
  {
    layer: 2,
    name: "Contenuti & Definizioni di Frontiera",
    functionDesc: "Definizioni, teoremi, prove multiple, esempi, esercizi, congetture aperte e sfide sulle definizioni.",
    keyTechnologies: ["The Annals Challenge", "Formal Conjectures", "ProofWiki", "Tricki"],
    manifestoNotes: "Incentiva la formalizzazione di definizioni riusabili (Annals Challenge) e l'enunciazione certificata di problemi aperti.",
  },
  {
    layer: 3,
    name: "Manuali & Pipeline Source-to-Library",
    functionDesc: "Testi pedagogici strutturati, corsi e conversione scalabile da manuali a librerie interconnesse.",
    keyTechnologies: ["Formal Frontier (41 librerie)", "OpenStax", "LibreTexts", "Stacks Project"],
    manifestoNotes: "Usa sciami di agenti coordinati (come Formal Frontier) per trasformare i manuali in librerie su cui altri possono costruire.",
  },
  {
    layer: 4,
    name: "Grafo Multi-Relazionale",
    functionDesc: "Prerequisiti, conseguenze, generalizzazioni, specializzazioni, equivalenze e applicazioni.",
    keyTechnologies: ["MathTTKG", "K12-KGraph", "SciLib Mathlib KG", "Archi Condizionali"],
    manifestoNotes: "Le pagine sono viste sul grafo, non il contrario. Supporta cicli e prerequisiti alternativi.",
  },
  {
    layer: 5,
    name: "Formalizzazione (Mathlib & Tau Ceti)",
    functionDesc: "Ancoraggio formale in Lean 4 deferendo a Mathlib (Premio Demailly 2026) ed estendendolo tramite roadmap esperte (Tau Ceti).",
    keyTechnologies: ["Mathlib4 (950+ autori)", "Tau Ceti (3M+ LoC)", "Lean 4 Build Server", "LeanInteract"],
    manifestoNotes: "Un artefatto formale ha valore solo se altri matematici possono capirlo, riusarlo e costruirci sopra.",
  },
  {
    layer: 6,
    name: "Verifica Avversaria & Comparator",
    functionDesc: "Revisione avversaria tramite rubriche standard, controllo semantico e Palomar Comparator contro i 'code dump' inutilizzabili.",
    keyTechnologies: ["Palomar Comparator", "Tau Ceti Adversarial Rubric", "Jacobian", "LoC-Decomp / SAGE"],
    manifestoNotes: "Evita i dump monolitici da milioni di righe illeggibili: verifica generalità, assenza di duplicazione e fedeltà delle definizioni.",
  },
  {
    layer: 7,
    name: "Pedagogia Adattiva",
    functionDesc: "Spiegazioni su 8 livelli (Asilo → Post-Doc), 8 stili cognitivi e diagnosi socratica dei prerequisiti.",
    keyTechnologies: ["LeanTutor (AAAI 2026)", "nuwa-skill", "Spaced Repetition", "Diagnosi Prerequisiti"],
    manifestoNotes: "Feedback diagnostico: non 'giusto/sbagliato', ma 'ti manca il prerequisito X'.",
  },
  {
    layer: 8,
    name: "Presentazione & Accessibilità",
    functionDesc: "Interfaccia web leggera, PWA offline-ready, bassa banda, WCAG 2.2 AA e math speech.",
    keyTechnologies: ["PWA", "MathML / KaTeX", "WCAG 2.2 AA", "Visualizzazioni Interattive"],
    manifestoNotes: "Progettato per abbattere barriere geografiche, tecnologiche e sensoriali.",
  },
  {
    layer: 9,
    name: "Governance & Allineamento Comunitario",
    functionDesc: "Consorzio accademico/non-profit guidato dai matematici, 10 Valori condivisi di Mathlib e hosting pubblico dell'inferenza.",
    keyTechnologies: ["Lean FRO", "Mathlib Initiative", "Wikimedia", "CC BY-SA 4.0 / Apache 2.0"],
    manifestoNotes: "Risolve il problema dell'allineamento per la matematica: gli strumenti e le roadmap restano sotto il controllo della comunità scientifica.",
  },
];

export interface CatalogResource {
  name: string;
  category:
    | "agentic"
    | "encyclopedia"
    | "manual_math"
    | "manual_cs"
    | "manual_physics"
    | "platform"
    | "standard";
  authorOrOrg: string;
  license: string;
  integrationPolicy: "direct_import" | "paraphrase_cite" | "external_link";
  role: string;
  url: string;
}

export const RESOURCE_INVENTORY: CatalogResource[] = [
  {
    name: "Mathlib4 (Premio Jean-Pierre Demailly 2026 per la Scienza Aperta)",
    category: "agentic",
    authorOrOrg: "Mathlib Community (65 revisori, 950 contributori)",
    license: "Apache-2.0",
    integrationPolicy: "direct_import",
    role: "Fondazione curata dall'uomo dell'ecosistema formale; definisce gli standard di qualità, astrazione e riuso",
    url: "https://github.com/leanprover-community/mathlib4",
  },
  {
    name: "Tau Ceti (3M+ LoC · Lean FRO & Mathlib Initiative)",
    category: "agentic",
    authorOrOrg: "Lean FRO / Mathlib Initiative",
    license: "Apache-2.0",
    integrationPolicy: "direct_import",
    role: "Libreria coerente scritta da AI e revisionata avversariamente secondo roadmap esperte (Riemann-Roch, Schur-Weyl, Chebotarev)",
    url: "https://github.com/TauCetiProject/TauCetiWorker",
  },
  {
    name: "Formal Frontier (41 librerie · 200k LoC · Build Server Lean)",
    category: "agentic",
    authorOrOrg: "Mathlib Initiative",
    license: "Apache-2.0",
    integrationPolicy: "direct_import",
    role: "Pipeline multi-agente source-to-library per convertire manuali in librerie formali interconnesse (Stone duality, Hairy ball, Kaplansky)",
    url: "https://lean-fro.org/",
  },
  {
    name: "Palomar (Registry & Comparator per la Matematica Formale)",
    category: "standard",
    authorOrOrg: "Comunità Mathlib / Lean FRO",
    license: "Open Source / CC0",
    integrationPolicy: "direct_import",
    role: "Registro online che richiede formalization.yaml (provenienza e ruolo degli autori) e Comparator per l'audit degli enunciati",
    url: "https://leanprover-community.github.io/",
  },
  {
    name: "The Annals Challenge & Formal Conjectures",
    category: "agentic",
    authorOrOrg: "Kevin Buzzard et al. / Comunità Formale",
    license: "Apache-2.0",
    integrationPolicy: "direct_import",
    role: "Formalizzazione degli enunciati di Annals of Mathematics (per sbloccare le definizioni di frontiera) e catalogo revisionato di problemi aperti",
    url: "https://github.com/leanprover-community",
  },
  {
    name: "morluto/Jacobian & K-Dense-AI/scientific-agent-skills",
    category: "agentic",
    authorOrOrg: "morluto / K-Dense-AI / alchaincyf (nuwa-skill)",
    license: "Open Source",
    integrationPolicy: "direct_import",
    role: "Verifica indipendente per agenti, skill scientifiche e generazione di stili pedagogici",
    url: "https://github.com/morluto",
  },
  {
    name: "ProofWiki",
    category: "encyclopedia",
    authorOrOrg: "ProofWiki Community",
    license: "GFDL / CC BY-SA",
    integrationPolicy: "direct_import",
    role: "Catalogo di dimostrazioni passo-passo con dipendenze esplicite",
    url: "https://proofwiki.org/wiki/Main_Page",
  },
  {
    name: "Tricki",
    category: "encyclopedia",
    authorOrOrg: "Timothy Gowers et al.",
    license: "CC BY-SA",
    integrationPolicy: "direct_import",
    role: "Repository di tecniche ed euristiche di problem-solving matematico",
    url: "https://www.tricki.org/",
  },
  {
    name: "nLab",
    category: "encyclopedia",
    authorOrOrg: "nLab Lab / Urs Schreiber et al.",
    license: "CC BY-SA",
    integrationPolicy: "direct_import",
    role: "Matematica avanzata, teoria delle categorie, fisica matematica e homotopy type theory",
    url: "https://ncatlab.org/nlab/show/HomePage",
  },
  {
    name: "zbMATH Open KG",
    category: "encyclopedia",
    authorOrOrg: "FIZ Karlsruhe / EMS",
    license: "CC BY-SA 4.0",
    integrationPolicy: "direct_import",
    role: "Knowledge graph bibliografico e classificazione MSC2020",
    url: "https://zbmath.org/",
  },
  {
    name: "DLMF (NIST Digital Library of Mathematical Functions)",
    category: "encyclopedia",
    authorOrOrg: "NIST",
    license: "Public Domain",
    integrationPolicy: "direct_import",
    role: "Riferimento standard per funzioni speciali e identità analitiche",
    url: "https://dlmf.nist.gov/",
  },
  {
    name: "Encyclopedia of Mathematics & MathWorld",
    category: "encyclopedia",
    authorOrOrg: "Springer / Wolfram",
    license: "Copyright proprietario",
    integrationPolicy: "external_link",
    role: "Cross-reference esterno e confronto tassonomico (nessuna importazione diretta)",
    url: "https://encyclopediaofmath.org/",
  },
  {
    name: "Stacks Project",
    category: "manual_math",
    authorOrOrg: "Aise Johan de Jong et al.",
    license: "GFDL",
    integrationPolicy: "direct_import",
    role: "Opera collaborativa su geometria algebrica e algebra commutativa con grafo di tag",
    url: "https://stacks.math.columbia.edu/",
  },
  {
    name: "Abstract Algebra: Theory and Applications",
    category: "manual_math",
    authorOrOrg: "Thomas W. Judson",
    license: "GFDL",
    integrationPolicy: "direct_import",
    role: "Manuale aperto di algebra astratta con esercizi e codice SageMath",
    url: "http://abstract.ups.edu/",
  },
  {
    name: "Linear Algebra Done Openly & OpenStax Math",
    category: "manual_math",
    authorOrOrg: "Jeffrey Misseldine / OpenStax",
    license: "CC BY-SA / CC BY",
    integrationPolicy: "direct_import",
    role: "Percorsi undergraduate completi per algebra lineare, calcolo e aritmetica",
    url: "https://openstax.org/subjects/math",
  },
  {
    name: "Basic Analysis: Introduction to Real Analysis",
    category: "manual_math",
    authorOrOrg: "Jiří Lebl",
    license: "CC BY-NC-SA",
    integrationPolicy: "paraphrase_cite",
    role: "Analisi reale undergraduate (parafrasi con attribuzione per clausola NC)",
    url: "https://www.jirka.org/ra/",
  },
  {
    name: "Open Data Structures & Delftse Foundations of Computation",
    category: "manual_cs",
    authorOrOrg: "Pat Morin / TU Delft",
    license: "CC BY / CC BY-SA",
    integrationPolicy: "direct_import",
    role: "Algoritmi, strutture dati, logica formale e calcolabilità",
    url: "https://opendatastructures.org/",
  },
  {
    name: "Motion Mountain & LibreTexts Physics",
    category: "manual_physics",
    authorOrOrg: "Christoph Schiller / LibreTexts",
    license: "CC BY-NC-ND / Varie",
    integrationPolicy: "paraphrase_cite",
    role: "Fisica classica, relatività, meccanica quantistica e modelli matematici",
    url: "https://libretexts.org/",
  },
  {
    name: "OpenMath Standard (2 & 3), MathML & Wikidata",
    category: "standard",
    authorOrOrg: "OpenMath Society / W3C / Wikimedia",
    license: "CC0 / W3C Open",
    integrationPolicy: "direct_import",
    role: "Content Dictionaries machine-readable, semantica delle formule e Q-ID universali",
    url: "https://www.openmath.org/",
  },
];

// The 10 Values of Formal Libraries (Avigad, Buzzard, Commelin, Degenne, Morrison, Nash, Topaz — 2026)
export const FORMAL_LIBRARY_VALUES = [
  {
    index: "01",
    title: "Deferire alle librerie curate dall'uomo (Mathlib)",
    description:
      "Seguire i principi progettuali e le convenzioni di Mathlib, facendo refactoring continuo per adottarne le decisioni architetturali.",
  },
  {
    index: "02",
    title: "Preferire completezza e ampiezza prima della profondità",
    description:
      "L'ampiezza e la solidità delle definizioni di base devono precedere i teoremi isolati, poiché sono ciò che abilita la vera profondità futura.",
  },
  {
    index: "03",
    title: "Evitare la duplicazione e massimizzare il riuso",
    description:
      "Generalizzare i teoremi al giusto livello di astrazione affinché ogni risultato sia riutilizzabile senza ridondanze.",
  },
  {
    index: "04",
    title: "Revisionare pubblicamente secondo standard condivisi",
    description:
      "Ogni aggiunta — umana o generata da agenti — è sottoposta ad audit pubblico o revisione avversaria trasparente.",
  },
  {
    index: "05",
    title: "Pubblicare liberamente (Open Source, Interoperabile, Esplorabile)",
    description:
      "Le librerie formali devono essere beni pubblici aperti, ispezionabili e navigabili dall'intera comunità.",
  },
  {
    index: "06",
    title: "Restare costantemente aggiornati con Lean e Mathlib",
    description:
      "Garantire la compatibilità continua ad ogni nuova release del compilatore Lean e di Mathlib, evitando codice orfano.",
  },
  {
    index: "07",
    title: "Restare aperti al cambiamento e al refactoring",
    description:
      "Se emerge una formulazione concettualmente più elegante o più adatta agli scopi della comunità, non è mai troppo tardi per rifattorizzare.",
  },
  {
    index: "08",
    title: "Documentare e organizzare sistematicamente",
    description:
      "I file devono essere coerenti, strutturati in modo leggibile e corredati di documentazione che spieghi il significato matematico.",
  },
  {
    index: "09",
    title: "Collegare esplicitamente alla letteratura esistente",
    description:
      "Ogni matematico deve poter verificare e fidarsi che i concetti descritti nella libreria corrispondano al significato atteso nei testi e negli articoli.",
  },
  {
    index: "10",
    title: "Fissare standard rigorosi e rispettarli subito",
    description:
      "Produrre codice scadente o non revisionato sperando di 'ripulirlo più tardi' è controproducente: una cattiva formalizzazione è peggio di nessuna formalizzazione.",
  },
];

// Case studies from Avigad, Buzzard, Commelin, Degenne, Morrison, Nash, Topaz (2026)
export const ALIGNMENT_CASE_STUDIES = [
  {
    title: "Imballaggio di Sfere in 8D (Viazovska) — Il costo del codice AI non curato",
    category: "unaligned",
    summary:
      "Nel febbraio 2026 Math, Inc. ha tentato di scavalcare il team che stava formalizzando il risultato di Maryna Viazovska in dimensione 8. Il team originale ha scoperto che ripulire il codice generato dall'AI era più oneroso che buttarlo via e riscriverlo correttamente (sempre con l'ausilio mirato dell'AI).",
    lesson:
      "Un artefatto formale che compila ma è disorganizzato non aggiunge valore alla matematica.",
  },
  {
    title: "Ultimo Teorema di Fermat (13 milioni di righe in 11 giorni vs. Blueprint moderno)",
    category: "unaligned",
    summary:
      "L'annuncio di Anthropic su una verifica formale di FLT in 13 milioni di righe di codice scritte da Claude in 11 giorni ha mostrato una potenza tecnica impressionante, ma Kevin Buzzard ha confermato che il progetto umano-curato per la prova moderna prosegue: 13M di righe monolitiche hanno scarso valore duraturo per il riuso.",
    lesson:
      "Il valore di una formalizzazione risiede in ciò che otteniamo oltre la mera correttezza: astrazione, comprensione e riuso.",
  },
  {
    title: "Blow-up in tempo finito per Navier–Stokes & Dump non allineati",
    category: "unaligned",
    summary:
      "Nella soluzione di OpenAI per Navier–Stokes la prova in linguaggio naturale risultava quasi incomprensibile, mentre il certificato Lean garantiva la correttezza. Tuttavia, i successivi dump hanno mostrato divergenze sottili o gravi tra enunciati formali e informali, testi impenetrabili e problemi di attribuzione.",
    lesson:
      "La correttezza senza comprensibilità, provenienza (Palomar) e allineamento semantico tradisce lo spirito della ricerca matematica.",
  },
  {
    title: "Unit Distance Conjecture & Densità degli Zeri della Zeta di Riemann",
    category: "aligned",
    summary:
      "I lavori di OpenAI sulla congettura della distanza unitaria e di Anthropic sulla densità degli zeri della funzione zeta di Riemann sono stati condotti in modo esemplare: hanno contribuito alla comprensione umana e la comunità matematica ha potuto immediatamente costruire sopra quei risultati.",
    lesson:
      "Modello di partnership costruttiva tra laboratori AI e comunità di ricerca.",
  },
];

export const ROADMAP_PHASES = [
  {
    phase: "Fase 0",
    window: "Mesi 0–3",
    title: "Fondazione, Standard Palomar & Consorzio",
    metrics: "Ontologia URN v0.1 · Palomar formalization.yaml · 10 Valori Mathlib",
    deliverables: [
      "Definizione formale dello schema dati YAML/JSON per nodi e archi multi-relazionali.",
      "Adozione nativa dello standard Palomar (formalization.yaml + Comparator) per tracciare provenienza e fedeltà degli enunciati.",
      "Recepimento dei 10 Valori condivisi di Mathlib, Tau Ceti e Formal Frontier (deferenza a Mathlib, zero duplicazione, revisione pubblica).",
      "Costituzione del nucleo federato iniziale di curatori matematici, pedagogisti e sviluppatori.",
    ],
  },
  {
    phase: "Fase 1",
    window: "Mesi 3–12",
    title: "MVP Verticale (Aritmetica & Algebra)",
    metrics: "3 Lingue (IT, EN, ES) · 500 Nodi · 50 Teoremi in Lean 4 · 100 Studenti",
    deliverables: [
      "Creazione di 500 nodi interconnessi con prerequisiti espliciti, spiegazioni multilivello ed esercizi.",
      "Formalizzazione completa di 50 teoremi fondamentali in Lean 4 con collegamento a Mathlib.",
      "Web app leggera e offline-first con esplorazione del grafo, ricerca semantica e percorsi adattivi.",
      "Validazione empirica sul campo con una coorte pilota di 100 studenti.",
    ],
  },
  {
    phase: "Fase 2",
    window: "Mesi 12–24",
    title: "Espansione & Integrazione Tau Ceti / Formal Frontier",
    metrics: "+5 Lingue (FR, DE, PT, AR, ZH) · Pipeline Formal Frontier · 10.000 Studenti",
    deliverables: [
      "Estensione completa a calcolo infinitesimale, algebra lineare e analisi reale.",
      "Integrazione con le pipeline source-to-library di Formal Frontier e le rubriche di revisione avversaria di Tau Ceti.",
      "Rilascio del modulo di tutoraggio verificato ispirato a LeanTutor (diagnosi del prerequisito mancante).",
      "Sperimentazione didattica con 10.000 studenti in scuole e università partner.",
    ],
  },
  {
    phase: "Fase 3",
    window: "Mesi 24–36",
    title: "Scala Interdisciplinare & Orizzonte dei 3 Anni (Lean FRO)",
    metrics: "+10 Lingue · Annals Challenge & Formal Conjectures · 1.000.000 Studenti",
    deliverables: [
      "Allineamento all'obiettivo triennale indicato da Avigad, Buzzard, Commelin et al.: formalizzare la maggior parte della matematica in forma esplorabile e riusabile.",
      "Connessione dei nodi avanzati (Livelli 6–7) con The Annals Challenge e Formal Conjectures.",
      "Hosting accademico/non-profit per matematici, ingegneri e inferenza sotto governance scientifica.",
    ],
  },
  {
    phase: "Fase 4",
    window: "Mesi 36+",
    title: "Maturità & Frontiera della Ricerca",
    metrics: "Livelli 6–7 (PhD/Post-Doc) · Adozione in 10+ Paesi · Sostenibilità Piena",
    deliverables: [
      "Copertura della matematica graduate e di frontiera in sincronia continua con Mathlib, Tau Ceti e Formal Frontier.",
      "Ponte bidirezionale NL ↔ Lean 4 di grado industriale per ricerca e didattica.",
      "Adozione curricolare pubblica in almeno 10 paesi e sostenibilità finanziaria autonoma del consorzio.",
    ],
  },
];

export const OPEN_QUESTIONS = [
  {
    number: "01",
    question: "Come evitare librerie AI-generated che nessuno usa?",
    tension: "Rischio di spendere milioni di dollari in 'code dump' illeggibili (es. 13M righe per FLT o codice non manutenibile).",
    blueprintDirection: "Adottare i 10 Valori di Mathlib/Tau Ceti: deferenza a Mathlib, roadmap scritte da esperti umani e revisione avversaria rigorosa.",
  },
  {
    number: "02",
    question: "Come garantire che enunciato formale e informale coincidano?",
    tension: "Nei dump non curati molte coppie formale/informale divergono in modo sottile o significativo.",
    blueprintDirection: "Ogni nodo integra il registro Palomar (formalization.yaml + Comparator setup) insieme ai checker semantici LoC-Decomp e SAGE.",
  },
  {
    number: "03",
    question: "Chi governa gli strumenti e l'inferenza per l'autoformalizzazione?",
    tension: "Dipendenza da laboratori commerciali contro autonomia e norme sociali della comunità matematica.",
    blueprintDirection: "Hosting non-profit o accademico per matematici, ingegneri e inferenza (es. worker distribuiti Tau Ceti) con comitati consultivi scientifici.",
  },
  {
    number: "04",
    question: "Come si sbloccano le definizioni mancanti alla frontiera?",
    tension: "I modelli sono bravi a dimostrare teoremi noti, ma il vero collo di bottiglia sono le definizioni moderne.",
    blueprintDirection: "Integrazione diretta con The Annals Challenge (Kevin Buzzard) e Formal Conjectures per dare priorità alle definizioni usate ai confini della ricerca.",
  },
  {
    number: "05",
    question: "Come si unisce il rigore di ricerca alla comprensione pedagogica?",
    tension: "Una prova verificata dal compilatore Lean ma incomprensibile in linguaggio naturale (caso Navier–Stokes) non costruisce comprensione.",
    blueprintDirection: "Il ponte bidirezionale di Mathema accoppia sempre la prova formale a spiegazioni deformalizzate multilivello (L0–L7) e multistile.",
  },
];
