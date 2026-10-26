import { LanguageCode } from "./mathemaData";

export type MscNodeLevel =
  | "discipline" // e.g. 11-XX
  | "section" // e.g. 11Jxx / 11J68
  | "proposition" // e.g. 11J68.1 (Definition, Lemma, Theorem, Corollary)
  | "micro_step" // e.g. 11J68.3.1
  | "sub_step"; // e.g. 11J68.3.2.a

export type VisualPlotType =
  | "pell_conic_2d_3d"
  | "primes_distribution_2d_3d"
  | "dedekind_cauchy_2d_3d"
  | "curry_howard_ast_2d_3d"
  | "noether_manifold_2d_3d";

export interface MscTripleItem {
  code: string; // Canonical hierarchical number e.g. "11J68.3.2.a"
  parentCode: string | null;
  levelType: MscNodeLevel;
  kindLabel: Record<LanguageCode, string>; // es. "Teorema", "Passo 2", "Micro-lemma 2.a"
  title: Record<LanguageCode, string>;
  natural: Record<LanguageCode, string>;
  symbolic: string; // Formal symbolic mathematical syntax
  lean4: string; // Corresponding Lean 4 formal syntax
  dependencies: string[]; // Codes of other items this item depends on
  visualPlot?: VisualPlotType;
  children?: MscTripleItem[];
}

export interface MscDisciplineCatalog {
  mscCode: string; // e.g. "00-XX" to "97-XX"
  title: Record<LanguageCode, string>;
  activeInGraph: boolean;
}

// Official top-level Mathematics Subject Classification (MSC2020) overview
export const MSC_TOP_LEVEL_INDEX: MscDisciplineCatalog[] = [
  {
    mscCode: "03-XX",
    title: {
      it: "Logica matematica e fondamenti",
      en: "Mathematical logic and foundations",
      es: "Lógica matemática y fundamentos",
      zh: "数理逻辑与数学基础",
      ar: "المنطق الرياضي والأسس",
    },
    activeInGraph: true,
  },
  {
    mscCode: "11-XX",
    title: {
      it: "Teoria dei numeri",
      en: "Number theory",
      es: "Teoría de números",
      zh: "数论",
      ar: "نظرية الأعداد",
    },
    activeInGraph: true,
  },
  {
    mscCode: "20-XX",
    title: {
      it: "Teoria dei gruppi e generalizzazioni",
      en: "Group theory and generalizations",
      es: "Teoría de grupos y generalizaciones",
      zh: "群论及其推广",
      ar: "نظرية الزمر وتعميماتها",
    },
    activeInGraph: true,
  },
  {
    mscCode: "26-XX",
    title: {
      it: "Funzioni reali e analisi",
      en: "Real functions and analysis",
      es: "Funciones reales y análisis",
      zh: "实变函数与分析",
      ar: "التوابع الحقيقية والتحليل",
    },
    activeInGraph: true,
  },
  {
    mscCode: "70-XX",
    title: {
      it: "Meccanica delle particelle e dei sistemi (Fisica Matematica)",
      en: "Mechanics of particles and systems",
      es: "Mecánica de partículas y sistemas",
      zh: "质点与系统力学（数学物理）",
      ar: "ميكانيكا الجسيمات والأنظمة",
    },
    activeInGraph: true,
  },
];

// Full Hierarchical Tree with Triple Representation (NL + Symbolic + Lean 4) at EVERY level & micro-step
export const MSC_HIERARCHY_TREE: MscTripleItem[] = [
  // ============================================================================
  // 11-XX : TEORIA DEI NUMERI
  // ============================================================================
  {
    code: "11-XX",
    parentCode: null,
    levelType: "discipline",
    kindLabel: {
      it: "Disciplina MSC",
      en: "MSC Discipline",
      es: "Disciplina MSC",
      zh: "MSC 学科大类",
      ar: "تصنيف MSC الرئيسي",
    },
    title: {
      it: "Teoria dei Numeri (Aritmetica Razionale, Diofantea e Primi)",
      en: "Number Theory (Rational, Diophantine, and Prime Arithmetic)",
      es: "Teoría de Números (Aritmética Racional, Diofántica y Primos)",
      zh: "数论（有理算术、丢番图逼近与素数理论）",
      ar: "نظرية الأعداد (الحساب المنطق والديوفانتي والأعداد الأولية)",
    },
    natural: {
      it: "Studio delle proprietà degli interi ℤ, dei numeri razionali ℚ, della divisibilità in fattori primi e delle approssimazioni diofantee alle grandezze algebriche.",
      en: "Study of the properties of integers ℤ, rational numbers ℚ, prime divisibility, and Diophantine approximations to algebraic quantities.",
      es: "Estudio de las propiedades de los enteros ℤ, los racionales ℚ, la divisibilidad prima y las aproximaciones diofánticas.",
      zh: "研究整数环 ℤ、有理数域 ℚ、素数整除性以及代数数的丢番图逼近。",
      ar: "دراسة خصائص الأعداد الصحيحة ℤ والأعداد المنطقة ℚ وقابلية القسمة الأولية والتقريبات الديوفانتية.",
    },
    symbolic: "ℕ ⊂ ℤ ⊂ ℚ = Frac(ℤ) ⊂ ℝ ,   ∀ a, b ∈ ℤ (a ∣ b ⇔ ∃ k ∈ ℤ, b = k·a)",
    lean4: `import Mathlib.Data.Nat.Prime.Basic
import Mathlib.Data.Rat.Defs
import Mathlib.Data.Real.Irrational`,
    dependencies: ["03-XX"],
    visualPlot: "pell_conic_2d_3d",
    children: [
      {
        code: "11J68",
        parentCode: "11-XX",
        levelType: "section",
        kindLabel: {
          it: "Sezione MSC 11J68",
          en: "MSC Section 11J68",
          es: "Sección MSC 11J68",
          zh: "MSC 分支 11J68",
          ar: "قسم MSC 11J68",
        },
        title: {
          it: "Approssimazione di numeri algebrici e irrazionalità quadratiche",
          en: "Approximation to algebraic numbers and quadratic irrationalities",
          es: "Aproximación a números algebraicos e irracionalidades cuadráticas",
          zh: "代数数的逼近与二次无理数",
          ar: "تقريب الأعداد الجبرية والأعداد الصماء التربيعية",
        },
        natural: {
          it: "Analisi dell'incommensurabilità delle radici quadratiche √d rispetto al campo razionale ℚ e struttura delle soluzioni intere dell'equazione di Pell p² - d·q² = ±1.",
          en: "Analysis of the incommensurability of quadratic roots √d over ℚ and the integer lattice structure of Pell's equation p² - d·q² = ±1.",
          es: "Análisis de la inconmensurabilidad de raíces cuadráticas √d sobre ℚ y la ecuación de Pell p² - d·q² = ±1.",
          zh: "分析二次根式 √d 在有理数域 ℚ 上的不可公度性以及佩尔方程 p² - d·q² = ±1 的整格结构。",
          ar: "تحليل عدم قابلية القياس المشترك للجذور التربيعية √d على حقل الأعداد المنطقة ℚ ومعادلة بيل.",
        },
        symbolic: "Alg_2(ℚ) = { α ∈ ℝ ∣ ∃ a,b,c ∈ ℤ, aα² + bα + c = 0 } ,   √2 ∉ ℚ",
        lean4: `namespace Mathema.MSC11J68
open Real Nat Int`,
        dependencies: ["03B05.1"],
        visualPlot: "pell_conic_2d_3d",
        children: [
          {
            code: "11J68.1",
            parentCode: "11J68",
            levelType: "proposition",
            kindLabel: {
              it: "Definizione 11J68.1",
              en: "Definition 11J68.1",
              es: "Definición 11J68.1",
              zh: "定义 11J68.1",
              ar: "تعريف 11J68.1",
            },
            title: {
              it: "Rappresentazione Canonica Ridotta di un Numero Razionale",
              en: "Canonical Reduced Representation of a Rational Number",
              es: "Representación Canónica Irreducible de un Número Racional",
              zh: "有理数的既约标准表示",
              ar: "التمثيل القانوني المختزل للعدد المنطق",
            },
            natural: {
              it: "Ogni numero razionale positivo x ∈ ℚ⁺ si scrive in modo unico come rapporto x = p / q di due interi positivi p, q ∈ ℕ⁺ primi tra loro, cioè privi di divisori primi comuni.",
              en: "Every positive rational number x ∈ ℚ⁺ can be uniquely written as a ratio x = p / q of two coprime positive integers p, q ∈ ℕ⁺.",
              es: "Todo número racional positivo x ∈ ℚ⁺ se escribe de manera única como cociente x = p / q con mcd(p, q) = 1.",
              zh: "每个正有理数 x ∈ ℚ⁺ 均可唯一表示为两个互质正整数 p, q ∈ ℕ⁺ 之比 x = p / q。",
              ar: "كل عدد منطق موجب x ∈ ℚ⁺ يكتب بطريقة وحيدة كنسبة x = p / q لعددين صحيحين موجبين أوليين فيما بينهما.",
            },
            symbolic: "∀ x ∈ ℚ⁺, ∃! (p, q) ∈ ℕ⁺ × ℕ⁺ : (x = p · q⁻¹) ∧ (gcd(p, q) = 1)",
            lean4: `structure ReducedRatPos where
  p : ℕ
  q : ℕ
  hq : q ≠ 0
  hcop : Nat.Coprime p q`,
            dependencies: [],
            visualPlot: "pell_conic_2d_3d",
            children: [
              {
                code: "11J68.1.1",
                parentCode: "11J68.1",
                levelType: "micro_step",
                kindLabel: {
                  it: "Micro-risultato 11J68.1.1",
                  en: "Micro-result 11J68.1.1",
                  es: "Micro-resultado 11J68.1.1",
                  zh: "微结论 11J68.1.1",
                  ar: "نتيجة جزئية 11J68.1.1",
                },
                title: {
                  it: "Divisione per il Massimo Comun Divisore",
                  en: "Division by Greatest Common Divisor",
                  es: "División por el Máximo Común Divisor",
                  zh: "约去最大公约数",
                  ar: "القسمة على القاسم المشترك الأكبر",
                },
                natural: {
                  it: "Dati due interi a, b ≠ 0 con d = gcd(a, b), i quozienti p = a/d e q = b/d sono interi coprimi: gcd(a/d, b/d) = 1.",
                  en: "Given integers a, b ≠ 0 with d = gcd(a, b), the quotients p = a/d and q = b/d satisfy gcd(p, q) = 1.",
                  es: "Dados a, b ≠ 0 con d = mcd(a, b), los cocientes p = a/d y q = b/d cumplen mcd(p, q) = 1.",
                  zh: "给定非零整数 a, b，设 d = gcd(a, b)，则商 p = a/d 与 q = b/d 满足 gcd(p, q) = 1。",
                  ar: "لأي عددين a, b ≠ 0 مع d = gcd(a, b)، فإن الخارجين p = a/d و q = b/d يحققان gcd(p, q) = 1.",
                },
                symbolic: "d = gcd(a, b) > 0 ⊢ gcd(a / d, b / d) = 1",
                lean4: `theorem coprime_div_gcd (a b : ℕ) (hb : b ≠ 0) :
    Nat.Coprime (a / Nat.gcd a b) (b / Nat.gcd a b) :=
  Nat.coprime_div_gcd_div_gcd (Nat.gcd_pos_of_pos_right a (Nat.pos_of_ne_zero hb))`,
                dependencies: [],
              },
            ],
          },
          {
            code: "11J68.2",
            parentCode: "11J68",
            levelType: "proposition",
            kindLabel: {
              it: "Lemma 11J68.2",
              en: "Lemma 11J68.2",
              es: "Lema 11J68.2",
              zh: "引理 11J68.2",
              ar: "توطئة 11J68.2",
            },
            title: {
              it: "Invarianza della Parità per Elevamento al Quadrato",
              en: "Parity Invariance under Squaring",
              es: "Invarianza de la Paridad bajo el Cuadrado",
              zh: "平方运算下的奇偶不变性引理",
              ar: "ثبات الزوجية تحت عملية التربيع",
            },
            natural: {
              it: "Per ogni numero naturale n ∈ ℕ, il quadrato n² è divisibile per 2 se e solo se n stesso è divisibile per 2.",
              en: "For every natural number n ∈ ℕ, the square n² is divisible by 2 if and only if n itself is divisible by 2.",
              es: "Para todo número natural n ∈ ℕ, el cuadrado n² es divisible por 2 si y solo si n es divisible por 2.",
              zh: "对于任意自然数 n ∈ ℕ，平方 n² 能被 2 整除当且仅当 n 本身能被 2 整除。",
              ar: "لكل عدد طبيعي n ∈ ℕ، يقبل المربع n² القسمة على 2 إذا وفقط إذا كان n نفسه يقبل القسمة على 2.",
            },
            symbolic: "∀ n ∈ ℕ, (2 ∣ n² ⟺ 2 ∣ n)",
            lean4: `lemma dvd_two_of_dvd_sq (n : ℕ) (h : 2 ∣ n ^ 2) : 2 ∣ n :=
  Nat.Prime.dvd_of_dvd_pow Nat.prime_two h`,
            dependencies: ["03B05.1"],
            visualPlot: "pell_conic_2d_3d",
            children: [
              {
                code: "11J68.2.1",
                parentCode: "11J68.2",
                levelType: "micro_step",
                kindLabel: {
                  it: "Passo 11J68.2.1",
                  en: "Step 11J68.2.1",
                  es: "Paso 11J68.2.1",
                  zh: "步骤 11J68.2.1",
                  ar: "خطوة 11J68.2.1",
                },
                title: {
                  it: "Sviluppo Binomiale del Quadrato di un Intero Dispari",
                  en: "Binomial Expansion of an Odd Integer Squared",
                  es: "Desarrollo Binomial del Cuadrado de un Impar",
                  zh: "奇数的平方二项展开",
                  ar: "النشر ذو الحدين لمربع عدد فردي",
                },
                natural: {
                  it: "Se n è dispari, esiste m ∈ ℕ tale che n = 2m + 1; elevando al quadrato otteniamo n² = 4m² + 4m + 1 = 2(2m² + 2m) + 1, che è dispari.",
                  en: "If n is odd, n = 2m + 1 for some m ∈ ℕ; squaring gives n² = 4m² + 4m + 1 = 2(2m² + 2m) + 1, which is odd.",
                  es: "Si n = 2m + 1, entonces n² = 2(2m² + 2m) + 1, que es impar.",
                  zh: "若 n = 2m + 1 为奇数，则 n² = 4m² + 4m + 1 = 2(2m² + 2m) + 1 必为奇数。",
                  ar: "إذا كان n فردياً أي n = 2m + 1، فإن n² = 2(2m² + 2m) + 1 وهو عدد فردي حتماً.",
                },
                symbolic: "n = 2m + 1 ⊢ n² = (2m + 1)² = 2(2m² + 2m) + 1 ≡ 1 (mod 2)",
                lean4: `lemma odd_sq_of_odd (m : ℕ) : (2 * m + 1) ^ 2 = 2 * (2 * m ^ 2 + 2 * m) + 1 := by
  ring`,
                dependencies: [],
              },
              {
                code: "11J68.2.2",
                parentCode: "11J68.2",
                levelType: "micro_step",
                kindLabel: {
                  it: "Passo 11J68.2.2",
                  en: "Step 11J68.2.2",
                  es: "Paso 11J68.2.2",
                  zh: "步骤 11J68.2.2",
                  ar: "خطوة 11J68.2.2",
                },
                title: {
                  it: "Contrapposizione Logica (2 ∣ n² ⇒ 2 ∣ n)",
                  en: "Logical Contraposition (2 ∣ n² ⇒ 2 ∣ n)",
                  es: "Contraposición Lógica (2 ∣ n² ⇒ 2 ∣ n)",
                  zh: "逆否命题推导 (2 ∣ n² ⇒ 2 ∣ n)",
                  ar: "الانعكاس المنطقي المعاكس (2 ∣ n² ⇒ 2 ∣ n)",
                },
                natural: {
                  it: "Poiché (¬(2 ∣ n) ⇒ ¬(2 ∣ n²)), per contrapposizione logica se 2 divide n² allora 2 deve dividere n.",
                  en: "Since ¬(2 ∣ n) ⇒ ¬(2 ∣ n²), by logical contraposition 2 ∣ n² implies 2 ∣ n.",
                  es: "Como ¬(2 ∣ n) ⇒ ¬(2 ∣ n²), por contraposición 2 ∣ n² implica 2 ∣ n.",
                  zh: "既然 ¬(2 ∣ n) ⇒ ¬(2 ∣ n²)，由逆否律立得 2 ∣ n² 蕴涵 2 ∣ n。",
                  ar: "بما أن ¬(2 ∣ n) ⇒ ¬(2 ∣ n²)، فإنه بالمعاكس الإيجابي نجد أن 2 ∣ n² يستلزم 2 ∣ n.",
                },
                symbolic: "(¬Even(n) ⇒ ¬Even(n²)) ⊢ (Even(n²) ⇒ Even(n))",
                lean4: `example {P Q : Prop} (h : ¬Q → ¬P) (hp : P) : Q :=
  not_imp_not.mp h hp`,
                dependencies: ["11J68.2.1", "03B05.1"],
              },
            ],
          },
          {
            code: "11J68.3",
            parentCode: "11J68",
            levelType: "proposition",
            kindLabel: {
              it: "Teorema Principale 11J68.3",
              en: "Main Theorem 11J68.3",
              es: "Teorema Principal 11J68.3",
              zh: "主定理 11J68.3",
              ar: "المبرهنة الأساسية 11J68.3",
            },
            title: {
              it: "Irrazionalità della Radice Quadrata di 2",
              en: "Irrationality of the Square Root of 2",
              es: "Irracionalidad de la Raíz Cuadrada de 2",
              zh: "2的平方根的无理性定理",
              ar: "مبرهنة لاقياسية الجذر التربيعي للعدد 2",
            },
            natural: {
              it: "Non esistono interi positivi coprimi p, q tali che p² = 2q²; pertanto il numero reale √2 non appartiene all'immagine del campo razionale ℚ in ℝ.",
              en: "There exist no coprime positive integers p, q such that p² = 2q²; therefore the real number √2 does not lie in the image of ℚ in ℝ.",
              es: "No existen enteros positivos coprimos p, q tales que p² = 2q²; por tanto √2 ∉ ℚ.",
              zh: "不存在互质正整数 p, q 满足 p² = 2q²；因此实数 √2 不属于有理数域 ℚ。",
              ar: "لا يوجد عددان صحيحان موجبان أوليان فيما بينهما p, q يحققان p² = 2q²؛ وبالتالي √2 ∉ ℚ.",
            },
            symbolic: "(∀ p, q ∈ ℕ⁺, gcd(p, q) = 1 ⇒ p² ≠ 2q²)  ∧  (√2 ∈ ℝ \\ ℚ)",
            lean4: `theorem sqrt2_irrational_main (p q : ℕ) (hq : q ≠ 0) (hcop : Nat.Coprime p q) :
    p ^ 2 ≠ 2 * q ^ 2`,
            dependencies: ["11J68.1", "11J68.2", "03B05.1"],
            visualPlot: "pell_conic_2d_3d",
            children: [
              {
                code: "11J68.3.1",
                parentCode: "11J68.3",
                levelType: "micro_step",
                kindLabel: {
                  it: "Passo 11J68.3.1",
                  en: "Step 11J68.3.1",
                  es: "Paso 11J68.3.1",
                  zh: "步骤 11J68.3.1",
                  ar: "خطوة 11J68.3.1",
                },
                title: {
                  it: "Assunzione dell'Ipotesi Diofantea (p² = 2q²)",
                  en: "Assumption of the Diophantine Hypothesis (p² = 2q²)",
                  es: "Asunción de la Hipótesis Diofántica (p² = 2q²)",
                  zh: "引入丢番图等式假设 (p² = 2q²)",
                  ar: "افتراض المعادلة الديوفانتية (p² = 2q²)",
                },
                natural: {
                  it: "Assumiamo che esistano p, q ∈ ℕ con q ≠ 0 e gcd(p, q) = 1 tali che p² = 2q². Dalla definizione di divisibilità segue immediatamente che 2 divide p².",
                  en: "Assume p, q ∈ ℕ with q ≠ 0 and gcd(p, q) = 1 satisfy p² = 2q². By definition of divisibility, 2 divides p².",
                  es: "Suponemos p² = 2q² con mcd(p, q) = 1. Por definición de divisibilidad, 2 divide a p².",
                  zh: "假设互质正整数 p, q 满足 p² = 2q²。由整除定义立即得出 2 ∣ p²。",
                  ar: "نفترض وجود p, q أوليين فيما بينهما يحققان p² = 2q². من تعريف القسمة ينتج فوراً أن 2 يقسم p².",
                },
                symbolic: "h_eq : p² = 2q² ⊢ ∃ c ∈ ℕ, p² = 2c ⊢ 2 ∣ p²",
                lean4: `intro h_eq
have hp2 : 2 ∣ p ^ 2 := ⟨q ^ 2, h_eq⟩`,
                dependencies: ["11J68.1"],
              },
              {
                code: "11J68.3.2",
                parentCode: "11J68.3",
                levelType: "micro_step",
                kindLabel: {
                  it: "Passo 11J68.3.2",
                  en: "Step 11J68.3.2",
                  es: "Paso 11J68.3.2",
                  zh: "步骤 11J68.3.2",
                  ar: "خطوة 11J68.3.2",
                },
                title: {
                  it: "Deduzione della Parità del Numeratore p = 2k",
                  en: "Deduction of Numerator Parity p = 2k",
                  es: "Deducción de la Paridad del Numerador p = 2k",
                  zh: "推导分子 p = 2k 为偶数",
                  ar: "استنتاج زوجية البسط p = 2k",
                },
                natural: {
                  it: "Applicando il Lemma 11J68.2 a 2 ∣ p², otteniamo che 2 divide p. Esiste quindi un testimone intero k ∈ ℕ tale che p = 2k.",
                  en: "Applying Lemma 11J68.2 to 2 ∣ p² yields 2 ∣ p. Thus there exists a witness k ∈ ℕ such that p = 2k.",
                  es: "Aplicando el Lema 11J68.2 a 2 ∣ p², deducimos 2 ∣ p, por lo que existe k ∈ ℕ tal que p = 2k.",
                  zh: "对 2 ∣ p² 应用引理 11J68.2 得 2 ∣ p，故存在自然数 k 使得 p = 2k。",
                  ar: "بتطبيق التوطئة 11J68.2 على 2 ∣ p² نستنتج أن 2 ∣ p، وعليه يوجد k ∈ ℕ بحيث p = 2k.",
                },
                symbolic: "2 ∣ p² ∧ Lemma_11J68_2 ⊢ 2 ∣ p ⊢ ∃ k ∈ ℕ, p = 2k",
                lean4: `have hp : 2 ∣ p := dvd_two_of_dvd_sq p hp2
obtain ⟨k, rfl⟩ := hp`,
                dependencies: ["11J68.3.1", "11J68.2"],
                children: [
                  {
                    code: "11J68.3.2.a",
                    parentCode: "11J68.3.2",
                    levelType: "sub_step",
                    kindLabel: {
                      it: "Sotto-passaggio 11J68.3.2.a",
                      en: "Sub-step 11J68.3.2.a",
                      es: "Sub-paso 11J68.3.2.a",
                      zh: "子步骤 11J68.3.2.a",
                      ar: "خطوة فرعية 11J68.3.2.a",
                    },
                    title: {
                      it: "Sostituzione Algebrica e Cancellazione in ℕ",
                      en: "Algebraic Substitution and Cancellation in ℕ",
                      es: "Sustitución Algebraica y Cancelación en ℕ",
                      zh: "代数代入与自然数消去律",
                      ar: "التعويض الجبري والاختزال في ℕ",
                    },
                    natural: {
                      it: "Sostituendo p = 2k in p² = 2q² si ha (2k)² = 4k² = 2(2k²) = 2q². Poiché 2 ≠ 0, per la legge di cancellazione moltiplicativa si ottiene q² = 2k².",
                      en: "Substituting p = 2k into p² = 2q² gives 4k² = 2q². Canceling the non-zero factor 2 yields q² = 2k².",
                      es: "Sustituyendo p = 2k en p² = 2q² resulta 4k² = 2q², y cancelando el factor 2 obtenemos q² = 2k².",
                      zh: "将 p = 2k 代入 p² = 2q² 得 4k² = 2q²，约去非零因子 2 得 q² = 2k²。",
                      ar: "بالتعويض عن p = 2k في p² = 2q² نحصل على 4k² = 2q²، وبالاختزال على 2 نجد q² = 2k².",
                    },
                    symbolic: "(2k)² = 2q² ⊢ 2 · (2k²) = 2 · q² ⊢ q² = 2k²",
                    lean4: `have hq_eq : q ^ 2 = 2 * k ^ 2 := by linarith`,
                    dependencies: ["11J68.3.2"],
                  },
                ],
              },
              {
                code: "11J68.3.3",
                parentCode: "11J68.3",
                levelType: "micro_step",
                kindLabel: {
                  it: "Passo 11J68.3.3",
                  en: "Step 11J68.3.3",
                  es: "Paso 11J68.3.3",
                  zh: "步骤 11J68.3.3",
                  ar: "خطوة 11J68.3.3",
                },
                title: {
                  it: "Simmetria di Parità sul Denominatore q",
                  en: "Parity Symmetry on Denominator q",
                  es: "Simetría de Paridad sobre el Denominador q",
                  zh: "分母 q 的奇偶对称性推导",
                  ar: "تناظر الزوجية على المقام q",
                },
                natural: {
                  it: "Dall'uguaglianza q² = 2k² segue che 2 divide q²; applicando una seconda volta il Lemma 11J68.2 concludiamo che 2 divide anche q.",
                  en: "From q² = 2k² it follows that 2 ∣ q²; applying Lemma 11J68.2 a second time proves that 2 divides q as well.",
                  es: "De q² = 2k² se sigue que 2 ∣ q²; aplicando nuevamente el Lema 11J68.2 concluimos que 2 divide a q.",
                  zh: "由 q² = 2k² 知 2 ∣ q²；再次应用引理 11J68.2 得出 2 ∣ q。",
                  ar: "من المساواة q² = 2k² ينتج أن 2 يقسم q²؛ وبتطبيق التوطئة 11J68.2 مجدداً نستنتج أن 2 يقسم q أيضاً.",
                },
                symbolic: "q² = 2k² ⊢ 2 ∣ q² ⊢ 2 ∣ q",
                lean4: `have hq2 : 2 ∣ q ^ 2 := ⟨k ^ 2, by linarith⟩
have hq_div : 2 ∣ q := dvd_two_of_dvd_sq q hq2`,
                dependencies: ["11J68.3.2.a", "11J68.2"],
              },
              {
                code: "11J68.3.4",
                parentCode: "11J68.3",
                levelType: "micro_step",
                kindLabel: {
                  it: "Passo Conclusivo 11J68.3.4",
                  en: "Concluding Step 11J68.3.4",
                  es: "Paso Conclusivo 11J68.3.4",
                  zh: "终结步骤 11J68.3.4",
                  ar: "الخطوة الختامية 11J68.3.4",
                },
                title: {
                  it: "Contraddizione sul Massimo Comun Divisore (2 ∣ gcd(p, q) = 1)",
                  en: "Contradiction on the Greatest Common Divisor (2 ∣ gcd(p, q) = 1)",
                  es: "Contradicción en el Máximo Común Divisor (2 ∣ mcd(p, q) = 1)",
                  zh: "最大公约数矛盾导出 (2 ∣ gcd(p, q) = 1 ⇒ ⊥)",
                  ar: "تناقض القاسم المشترك الأكبر (2 ∣ gcd(p, q) = 1 ⇒ ⊥)",
                },
                natural: {
                  it: "Poiché 2 divide p e 2 divide q, per la proprietà universale del massimo comun divisore 2 divide gcd(p, q). Ma per ipotesi gcd(p, q) = 1, da cui 2 ∣ 1, assurdo in ℕ.",
                  en: "Since 2 ∣ p and 2 ∣ q, the universal property of gcd gives 2 ∣ gcd(p, q). Rewriting with gcd(p, q) = 1 yields 2 ∣ 1, which is impossible in ℕ.",
                  es: "Como 2 ∣ p y 2 ∣ q, entonces 2 ∣ mcd(p, q) = 1, lo cual es imposible en ℕ.",
                  zh: "既然 2 ∣ p 且 2 ∣ q，由最大公约数的泛性质得 2 ∣ gcd(p, q) = 1，在自然数中矛盾。",
                  ar: "بما أن 2 يقسم p و 2 يقسم q، فإنه يقسم القاسم المشترك الأكبر gcd(p, q) = 1، أي 2 ∣ 1 وهذا محال.",
                },
                symbolic: "(2 ∣ p) ∧ (2 ∣ q) ⊢ 2 ∣ gcd(p, q) = 1 ⊢ 2 ≤ 1 ⊢ ⊥",
                lean4: `have h_gcd : 2 ∣ Nat.gcd (2 * k) q := Nat.dvd_gcd ⟨k, rfl⟩ hq_div
rw [hcop.gcd_eq_one] at h_gcd
omega`,
                dependencies: ["11J68.3.2", "11J68.3.3", "11J68.1"],
              },
            ],
          },
        ],
      },
      {
        code: "11A41",
        parentCode: "11-XX",
        levelType: "section",
        kindLabel: {
          it: "Sezione MSC 11A41",
          en: "MSC Section 11A41",
          es: "Sección MSC 11A41",
          zh: "MSC 分支 11A41",
          ar: "قسم MSC 11A41",
        },
        title: {
          it: "Numeri Primi e Generazione Costruttiva di Euclide",
          en: "Prime Numbers and Constructive Euclidean Generation",
          es: "Números Primos y Generación Constructiva de Euclides",
          zh: "素数理论与欧几里得构造性生成",
          ar: "الأعداد الأولية والتوليد الإقليدي البنّاء",
        },
        natural: {
          it: "Studio dell'insieme infinito dei numeri primi P = {2, 3, 5, 7, 11, …} e del generatore costruttivo p = minFac(n! + 1) > n.",
          en: "Study of the infinite set of prime numbers P = {2, 3, 5, 7, 11, …} and the constructive generator p = minFac(n! + 1) > n.",
          es: "Estudio del conjunto infinito de los números primos y del generador constructivo p = minFac(n! + 1) > n.",
          zh: "研究无穷素数集 P = {2, 3, 5, 7, 11, …} 以及构造性素数生成子 p = minFac(n! + 1) > n。",
          ar: "دراسة المجموعة غير المنتهية للأعداد الأولية والمولد البنّاء p = minFac(n! + 1) > n.",
        },
        symbolic: "Prime(p) ⇔ (p ≥ 2 ∧ ∀ d ∈ ℕ, d ∣ p ⇒ d = 1 ∨ d = p)",
        lean4: `import Mathlib.Data.Nat.Prime.Infinite
import Mathlib.Data.Nat.Factorial.Basic`,
        dependencies: ["11J68.1"],
        visualPlot: "primes_distribution_2d_3d",
        children: [
          {
            code: "11A41.1",
            parentCode: "11A41",
            levelType: "proposition",
            kindLabel: {
              it: "Teorema 11A41.1",
              en: "Theorem 11A41.1",
              es: "Teorema 11A41.1",
              zh: "定理 11A41.1",
              ar: "مبرهنة 11A41.1",
            },
            title: {
              it: "Teorema di Euclide sull'Illimitatezza dei Numeri Primi",
              en: "Euclid's Theorem on the Unboundedness of Prime Numbers",
              es: "Teorema de Euclides sobre la Infinitud de los Primos",
              zh: "欧几里得素数无界定理",
              ar: "مبرهنة إقليدس في لانهائية الأعداد الأولية",
            },
            natural: {
              it: "Per ogni soglia naturale n ∈ ℕ esiste almeno un numero primo p tale che p ≥ n.",
              en: "For every natural bound n ∈ ℕ there exists at least one prime number p such that p ≥ n.",
              es: "Para todo número natural n ∈ ℕ existe al menos un número primo p tal que p ≥ n.",
              zh: "对于任意给定的自然数下界 n ∈ ℕ，总存在素数 p 满足 p ≥ n。",
              ar: "لكل عدد طبيعي n ∈ ℕ يوجد على الأقل عدد أولي p يحقق p ≥ n.",
            },
            symbolic: "∀ n ∈ ℕ, ∃ p ∈ ℕ : (n ≤ p) ∧ Prime(p)",
            lean4: `theorem euclid_unbounded_primes (n : ℕ) : ∃ p, n ≤ p ∧ Nat.Prime p :=
  Nat.exists_infinite_primes n`,
            dependencies: ["03B05.1"],
            visualPlot: "primes_distribution_2d_3d",
            children: [
              {
                code: "11A41.1.1",
                parentCode: "11A41.1",
                levelType: "micro_step",
                kindLabel: {
                  it: "Passo 11A41.1.1",
                  en: "Step 11A41.1.1",
                  es: "Paso 11A41.1.1",
                  zh: "步骤 11A41.1.1",
                  ar: "خطوة 11A41.1.1",
                },
                title: {
                  it: "Costruzione del Fattore Minimo di n! + 1",
                  en: "Construction of the Minimum Factor of n! + 1",
                  es: "Construcción del Factor Mínimo de n! + 1",
                  zh: "构造 n! + 1 的最小素因子",
                  ar: "بناء القاسم الأولي الأصغر للعدد n! + 1",
                },
                natural: {
                  it: "Poiché n! ≥ 1 per ogni n ∈ ℕ, il numero N = n! + 1 è strettamente maggiore di 1, dunque il suo minimo divisore proprio p = minFac(n! + 1) è un numero primo.",
                  en: "Since n! ≥ 1 for all n ∈ ℕ, N = n! + 1 > 1, so its smallest proper divisor p = minFac(n! + 1) is prime.",
                  es: "Como n! ≥ 1, N = n! + 1 > 1 y su menor divisor propio p = minFac(n! + 1) es primo.",
                  zh: "因为 n! ≥ 1，所以 N = n! + 1 ≠ 1，其最小大于1的因子 p = minFac(n! + 1) 必为素数。",
                  ar: "بما أن n! ≥ 1 فإن N = n! + 1 > 1، وبالتالي أصغر قاسم له أكبر من الواحد p = minFac(n! + 1) هو عدد أولي.",
                },
                symbolic: "n! ≥ 1 ⊢ n! + 1 ≥ 2 ⊢ Prime(minFac(n! + 1))",
                lean4: `let p := Nat.minFac (n.factorial + 1)
have hp : Nat.Prime p := Nat.minFac_prime (Nat.ne_of_gt (Nat.succ_lt_succ n.factorial_pos))`,
                dependencies: [],
              },
              {
                code: "11A41.1.2",
                parentCode: "11A41.1",
                levelType: "micro_step",
                kindLabel: {
                  it: "Passo 11A41.1.2",
                  en: "Step 11A41.1.2",
                  es: "Paso 11A41.1.2",
                  zh: "步骤 11A41.1.2",
                  ar: "خطوة 11A41.1.2",
                },
                title: {
                  it: "Esclusione dei Divisori ≤ n (p ∣ n! ∧ p ∣ n! + 1 ⇒ p ∣ 1)",
                  en: "Exclusion of Divisors ≤ n (p ∣ n! ∧ p ∣ n! + 1 ⇒ p ∣ 1)",
                  es: "Exclusión de Divisores ≤ n (p ∣ n! ∧ p ∣ n! + 1 ⇒ p ∣ 1)",
                  zh: "排除 ≤ n 的因子 (p ∣ n! ∧ p ∣ n! + 1 ⇒ p ∣ 1)",
                  ar: "استبعاد القواسم الأصغر من n (p ∣ n! ∧ p ∣ n! + 1 ⇒ p ∣ 1)",
                },
                natural: {
                  it: "Se fosse p ≤ n, allora p dividerebbe il prodotto n! = 1·2···n. Poiché p divide anche n! + 1, p dividerebbe la differenza (n! + 1) - n! = 1, impossibile per un primo.",
                  en: "If p ≤ n, then p divides n!. Since p also divides n! + 1, p must divide 1, impossible for a prime.",
                  es: "Si p ≤ n, entonces p divide a n! y a n! + 1, luego p divide a 1, contradicción.",
                  zh: "若 p ≤ n，则 p 整除 n!；又 p 整除 n! + 1，故 p 必整除 1，与素数定义矛盾。",
                  ar: "لو كان p ≤ n لقسم p المضروب n!؛ وبما أنه يقسم n! + 1 فإنه يقسم الفرق 1، وهذا مستحيل لعدد أولي.",
                },
                symbolic: "(p ≤ n ⇒ p ∣ n!) ∧ (p ∣ n! + 1) ⊢ p ∣ 1 ⊢ ⊥  ∴  p > n",
                lean4: `have h_dvd_fact : p ∣ n.factorial := Nat.dvd_factorial hp.pos h_le
have h_dvd_one : p ∣ 1 := (Nat.dvd_add_right h_dvd_fact).mp (Nat.minFac_dvd _)
exact Nat.Prime.not_dvd_one hp h_dvd_one`,
                dependencies: ["11A41.1.1", "03B05.1"],
              },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================================
  // 03-XX : LOGICA MATEMATICA E FONDAMENTI
  // ============================================================================
  {
    code: "03-XX",
    parentCode: null,
    levelType: "discipline",
    kindLabel: {
      it: "Disciplina MSC",
      en: "MSC Discipline",
      es: "Disciplina MSC",
      zh: "MSC 学科大类",
      ar: "تصنيف MSC الرئيسي",
    },
    title: {
      it: "Logica Matematica, Teoria dei Tipi e Fondamenti (03-XX)",
      en: "Mathematical Logic, Type Theory, and Foundations (03-XX)",
      es: "Lógica Matemática, Teoría de Tipos y Fundamentos (03-XX)",
      zh: "数理逻辑、类型论与数学基础 (03-XX)",
      ar: "المنطق الرياضي ونظرية الأنماط والأسس (03-XX)",
    },
    natural: {
      it: "Fondamenti deduttivi, calcolo delle costruzioni induttive (Lean 4) e isomorfismo di Curry-Howard tra proposizioni logiche e tipi computazionali.",
      en: "Deductive foundations, Calculus of Inductive Constructions (Lean 4), and the Curry-Howard isomorphism between propositions and types.",
      es: "Fundamentos deductivos, Cálculo de Construcciones Inductivas (Lean 4) e isomorfismo de Curry-Howard.",
      zh: "演绎基础、归纳构造演算（Lean 4）以及命题与类型之间的柯里-霍华德同构。",
      ar: "الأسس الاستنتاجية، حساب البناءات الاستقرائية (Lean 4) وتطابق كوري-هاوارد.",
    },
    symbolic: "Γ ⊢ t : P   (t è una dimostrazione formale della proposizione P : Prop)",
    lean4: `-- Kernel di Lean 4: Prop ≡ Sort 0`,
    dependencies: [],
    visualPlot: "curry_howard_ast_2d_3d",
    children: [
      {
        code: "03B05",
        parentCode: "03-XX",
        levelType: "section",
        kindLabel: {
          it: "Sezione MSC 03B05",
          en: "MSC Section 03B05",
          es: "Sección MSC 03B05",
          zh: "MSC 分支 03B05",
          ar: "قسم MSC 03B05",
        },
        title: {
          it: "Logica Proposizionale, Negazione Costruttiva e Curry-Howard",
          en: "Propositional Logic, Constructive Negation, and Curry-Howard",
          es: "Lógica Proposicional, Negación Constructiva y Curry-Howard",
          zh: "命题逻辑、构造性否定与柯里-霍华德同构",
          ar: "منطق القضايا، النفي البنّاء وتطابق كوري-هاوارد",
        },
        natural: {
          it: "Nella teoria dei tipi dipendenti, la negazione ¬P è definita come il tipo funzione P → False. Dimostrare una negazione non richiede il terzo escluso classico.",
          en: "In dependent type theory, negation ¬P is defined as the function type P → False. Proving a negation is purely constructive.",
          es: "En teoría de tipos dependientes, la negación ¬P se define como el tipo función P → False.",
          zh: "在依值类型论中，否定 ¬P 定义为函数类型 P → False，证明否定命题是完全构造性的。",
          ar: "في نظرية الأنماط المعتمدة، يُعرّف النفي ¬P كنمط الدالة P → False.",
        },
        symbolic: "¬P :≡ (P → ⊥)   ,   (Γ, h : P ⊢ ⊥) ⟹ (Γ ⊢ λh. ⊥ : ¬P)",
        lean4: `def Not (a : Prop) : Prop := a → False
prefix:max "¬" => Not`,
        dependencies: [],
        visualPlot: "curry_howard_ast_2d_3d",
        children: [
          {
            code: "03B05.1",
            parentCode: "03B05",
            levelType: "proposition",
            kindLabel: {
              it: "Teorema Logico 03B05.1",
              en: "Logical Theorem 03B05.1",
              es: "Teorema Lógico 03B05.1",
              zh: "逻辑定理 03B05.1",
              ar: "مبرهنة منطقية 03B05.1",
            },
            title: {
              it: "Introduzione della Negazione e Modus Tollens Costruttivo",
              en: "Negation Introduction and Constructive Modus Tollens",
              es: "Introducción de la Negación y Modus Tollens Constructivo",
              zh: "否定引入律与构造性否定后件律 (Modus Tollens)",
              ar: "إدخال النفي وقاعدة رفع التالي البنّاءة",
            },
            natural: {
              it: "Se l'ipotesi P implica Q e sappiamo che Q è falsa (¬Q), allora P stessa è falsa (¬P): basta comporre le due funzioni P → Q e Q → False.",
              en: "If P implies Q and Q is false (¬Q), then P is false (¬P): proven by composing the functions P → Q and Q → False.",
              es: "Si P implica Q y se tiene ¬Q, entonces se deduce ¬P componiendo P → Q con Q → False.",
              zh: "若 P 蕴涵 Q 且 Q 为假 (¬Q)，则通过复合函数 P → Q 与 Q → False 立得 ¬P。",
              ar: "إذا كان P يستلزم Q وكان Q باطلاً (¬Q)، فإن P باطل (¬P) وذلك بتركيب الدالتين P → Q و Q → False.",
            },
            symbolic: "(P → Q) → (Q → ⊥) → (P → ⊥)",
            lean4: `theorem mt_constructive {P Q : Prop} (hpq : P → Q) (hnq : ¬Q) : ¬P :=
  fun hp : P => hnq (hpq hp)`,
            dependencies: [],
            visualPlot: "curry_howard_ast_2d_3d",
          },
        ],
      },
    ],
  },

  // ============================================================================
  // 26-XX : FUNZIONI REALI E ANALISI
  // ============================================================================
  {
    code: "26-XX",
    parentCode: null,
    levelType: "discipline",
    kindLabel: {
      it: "Disciplina MSC",
      en: "MSC Discipline",
      es: "Disciplina MSC",
      zh: "MSC 学科大类",
      ar: "تصنيف MSC الرئيسي",
    },
    title: {
      it: "Funzioni Reali, Completamento Metrico/Ordine e Analisi (26-XX)",
      en: "Real Functions, Metric/Order Completion, and Analysis (26-XX)",
      es: "Funciones Reales, Completación Métrica/Orden y Análisis (26-XX)",
      zh: "实变函数、度量/序完备化与分析 (26-XX)",
      ar: "التوابع الحقيقية والإتمام المتري والتحليل (26-XX)",
    },
    natural: {
      it: "Costruzione del continuo reale ℝ a partire dalle lacune razionali messe in luce in 11J68.3, mediante sezioni di Dedekind o successioni di Cauchy.",
      en: "Construction of the real continuum ℝ filling the rational gaps exposed in 11J68.3, via Dedekind cuts or Cauchy sequences.",
      es: "Construcción del continuo real ℝ completando los huecos racionales demostrados en 11J68.3.",
      zh: "通过戴德金分割或柯西序列填补 11J68.3 揭示的有理数缝隙，构造实数连续统 ℝ。",
      ar: "بناء متصل الأعداد الحقيقية ℝ لسد الثغرات المنطقة التي كشفتها المبرهنة 11J68.3.",
    },
    symbolic: "ℝ ≅ Cauchy(ℚ)/Null(ℚ) ≅ DedekindCuts(ℚ) ,   sup { q ∈ ℚ⁺ ∣ q² < 2 } = √2 ∈ ℝ",
    lean4: `import Mathlib.Data.Real.Basic
import Mathlib.Data.Real.Sqrt`,
    dependencies: ["11J68.3"],
    visualPlot: "dedekind_cauchy_2d_3d",
    children: [
      {
        code: "26A03",
        parentCode: "26-XX",
        levelType: "section",
        kindLabel: {
          it: "Sezione MSC 26A03",
          en: "MSC Section 26A03",
          es: "Sección MSC 26A03",
          zh: "MSC 分支 26A03",
          ar: "قسم MSC 26A03",
        },
        title: {
          it: "Fondamenti della Retta Reale, Limiti e Completezza",
          en: "Foundations of the Real Line, Limits, and Completeness",
          es: "Fundamentos de la Recta Real, Límites y Completitud",
          zh: "实直线基础、极限与完备性",
          ar: "أسس المستقيم الحقيقي والنهايات والاكتمال",
        },
        natural: {
          it: "Esistenza dell'estremo superiore in ℝ e convergenza quadratica della successione di Erone-Newton verso √2.",
          en: "Existence of the supremum in ℝ and quadratic convergence of the Heron-Newton sequence to √2.",
          es: "Existencia del supremo en ℝ y convergencia cuadrática de la sucesión de Herón hacia √2.",
          zh: "实数域上确界的存在性以及逼近 √2 的海伦-牛顿序列的二次收敛性。",
          ar: "وجود الحد الأعلى الأصغر في ℝ والتقارب التربيعي لمتتالية هيرون-نيوتن نحو √2.",
        },
        symbolic: "a₀ = 1 ,  aₙ₊₁ = ½(aₙ + 2/aₙ)  ⟹  aₙ₊₁² - 2 = ¼(aₙ - 2/aₙ)² ≥ 0",
        lean4: `def heronStep (x : ℚ) : ℚ := (x + 2 / x) / 2`,
        dependencies: ["11J68.3"],
        visualPlot: "dedekind_cauchy_2d_3d",
        children: [
          {
            code: "26A03.1",
            parentCode: "26A03",
            levelType: "proposition",
            kindLabel: {
              it: "Teorema 26A03.1",
              en: "Theorem 26A03.1",
              es: "Teorema 26A03.1",
              zh: "定理 26A03.1",
              ar: "مبرهنة 26A03.1",
            },
            title: {
              it: "Identità dell'Errore Quadratico di Erone-Newton",
              en: "Heron-Newton Quadratic Error Identity",
              es: "Identidad del Error Cuadrático de Herón-Newton",
              zh: "海伦-牛顿迭代二次误差恒等式",
              ar: "متطابقة الخطأ التربيعي لخوارزمية هيرون-نيوتن",
            },
            natural: {
              it: "Per ogni razionale non nullo x ∈ ℚ, il passo di Erone y = (x + 2/x)/2 soddisfa l'identità esatta y² - 2 = ((x² - 2) / (2x))², garantendo che y² ≥ 2 e che lo scarto si eleva al quadrato ad ogni passo.",
              en: "For every non-zero rational x ∈ ℚ, Heron's step y = (x + 2/x)/2 satisfies y² - 2 = ((x² - 2)/(2x))², ensuring quadratic convergence.",
              es: "Para todo x ≠ 0 en ℚ, el paso de Herón y = (x + 2/x)/2 satisface y² - 2 = ((x² - 2)/(2x))².",
              zh: "对任意非零有理数 x ∈ ℚ，海伦迭代步 y = (x + 2/x)/2 满足精确恒等式 y² - 2 = ((x² - 2)/(2x))²。",
              ar: "لكل عدد منطق غير معدوم x ∈ ℚ، تحقق خطوة هيرون y = (x + 2/x)/2 المتطابقة الدقيقة y² - 2 = ((x² - 2)/(2x))².",
            },
            symbolic: "∀ x ∈ ℚ \\ {0},  ((x + 2/x)/2)² - 2 = (x² - 2)² / (4x²)",
            lean4: `theorem heron_error_sq (x : ℚ) (hx : x ≠ 0) :
    ((x + 2 / x) / 2) ^ 2 - 2 = (x ^ 2 - 2) ^ 2 / (4 * x ^ 2) := by
  field_simp
  ring`,
            dependencies: ["11J68.3"],
            visualPlot: "dedekind_cauchy_2d_3d",
          },
        ],
      },
    ],
  },

  // ============================================================================
  // 70-XX : FISICA MATEMATICA E TEOREMA DI NOETHER
  // ============================================================================
  {
    code: "70-XX",
    parentCode: null,
    levelType: "discipline",
    kindLabel: {
      it: "Disciplina MSC",
      en: "MSC Discipline",
      es: "Disciplina MSC",
      zh: "MSC 学科大类",
      ar: "تصنيف MSC الرئيسي",
    },
    title: {
      it: "Meccanica Lagrangiana, Simmetrie e Leggi di Conservazione (70-XX)",
      en: "Lagrangian Mechanics, Symmetries, and Conservation Laws (70-XX)",
      es: "Mecánica Lagrangiana, Simetrías y Leyes de Conservación (70-XX)",
      zh: "拉格朗日力学、对称性与守恒定律 (70-XX)",
      ar: "ميكانيكا لاغرانج والتناظرات وقوانين الانحفاظ (70-XX)",
    },
    natural: {
      it: "Connessione tra l'invarianza variazionale sotto gruppi continui e gli integrali primi del moto nei sistemi dinamici.",
      en: "Connection between variational invariance under continuous groups and first integrals of motion in dynamical systems.",
      es: "Conexión entre la invarianza variacional bajo grupos continuos y las integrales primeras del movimiento.",
      zh: "连续群作用下的变分不变性与动力系统运动第一积分之间的联系。",
      ar: "الارتباط بين الثبات التغايري تحت الزمر المستمرة والتكاملات الأولى للحركة.",
    },
    symbolic: "S[q] = ∫ L(q(t), q̇(t)) dt ,   ∂L/∂q - d/dt (∂L/∂q̇) = 0",
    lean4: `-- Formalizzazione algebrico-differenziale dell'invariante di Noether`,
    dependencies: ["26-XX"],
    visualPlot: "noether_manifold_2d_3d",
    children: [
      {
        code: "70H33",
        parentCode: "70-XX",
        levelType: "section",
        kindLabel: {
          it: "Sezione MSC 70H33",
          en: "MSC Section 70H33",
          es: "Sección MSC 70H33",
          zh: "MSC 分支 70H33",
          ar: "قسم MSC 70H33",
        },
        title: {
          it: "Teorema di Noether e Cariche Conservate nello Spazio delle Fasi",
          en: "Noether's Theorem and Conserved Charges in Phase Space",
          es: "Teorema de Noether y Cargas Conservadas en el Espacio de Fases",
          zh: "诺特定理与相空间中的守恒荷",
          ar: "مبرهنة نويثر والشحنات المحفوظة في فضاء الطور",
        },
        natural: {
          it: "Se la Lagrangiana L non dipende esplicitamente da una coordinata ciclica qᵢ (∂L/∂qᵢ = 0), allora il momento coniugato pᵢ = ∂L/∂q̇ᵢ resta costante lungo ogni traiettoria fisica.",
          en: "If the Lagrangian L is independent of a cyclic coordinate qᵢ (∂L/∂qᵢ = 0), the conjugate momentum pᵢ = ∂L/∂q̇ᵢ is conserved along every physical trajectory.",
          es: "Si el Lagrangiano L no depende de una coordenada cíclica qᵢ (∂L/∂qᵢ = 0), el momento conjugado pᵢ = ∂L/∂q̇ᵢ se conserva.",
          zh: "若拉格朗日量 L 不显含循环坐标 qᵢ (∂L/∂qᵢ = 0)，则共轭动量 pᵢ = ∂L/∂q̇ᵢ 沿任何物理轨道守恒。",
          ar: "إذا كانت دالة لاغرانج L لا تعتمد صراحة على إحداثي دوري qᵢ، فإن كمية الحركة المرافقة تظل محفوظة.",
        },
        symbolic: "(d/dt)(∂L/∂q̇ᵢ) = ∂L/∂qᵢ ∧ (∂L/∂qᵢ = 0) ⊢ (d/dt) pᵢ = 0",
        lean4: `theorem noether_cyclic_momentum_conserved (dL_dq dp_dt : ℝ)
    (heuler : dp_dt = dL_dq) (hcyclic : dL_dq = 0) : dp_dt = 0 := by
  linarith`,
        dependencies: ["26A03.1"],
        visualPlot: "noether_manifold_2d_3d",
      },
    ],
  },
];

// Helper to flatten the tree into an ordered array for fast lookup & graph projection
export function flattenMscTree(items: MscTripleItem[]): MscTripleItem[] {
  const result: MscTripleItem[] = [];
  const walk = (list: MscTripleItem[]) => {
    for (const item of list) {
      result.push(item);
      if (item.children && item.children.length > 0) {
        walk(item.children);
      }
    }
  };
  walk(items);
  return result;
}
