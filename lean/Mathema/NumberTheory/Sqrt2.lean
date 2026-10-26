/-
Copyright (c) 2026 Marco Razzano. All rights reserved.
Released under Apache 2.0 license.
MSC2020: 11J72 — Irrationality of √2
-/
import Mathlib.Data.Real.Irrational
import Mathlib.Data.Nat.Prime.Basic
import Mathlib.Tactic.Ring
import Mathlib.Tactic.Linarith

namespace Mathema.NumberTheory

/-- [11J72.0] Caratterizzazione esplicita dell'irrazionalità in ℝ. -/
theorem mathema_irrational_iff (x : ℝ) :
    Irrational x ↔ ∀ q : ℚ, (q : ℝ) ≠ x := by
  simpa [Irrational, Set.mem_range, not_exists] using Iff.rfl

/-- [11J72.1] Teorema principale: √2 è irrazionale (collegato a Mathlib `irrational_sqrt_two`). -/
theorem mathema_irrational_sqrt_two : Irrational (Real.sqrt 2) :=
  irrational_sqrt_two

/-- [11J72.1.2.a] Micro-risultato: il quadrato di un intero dispari 2m+1 è dispari. -/
theorem odd_sq_algebraic (m : ℤ) :
    (2 * m + 1) ^ 2 = 2 * (2 * m ^ 2 + 2 * m) + 1 := by
  ring

/-- [11J72.1.2] Se p² = 2q², allora 2 divide p. -/
lemma even_of_sq_eq_two_mul_sq {p q : ℤ} (h : p ^ 2 = 2 * q ^ 2) : 2 ∣ p := by
  have h2 : (2 : ℤ) ∣ p ^ 2 := ⟨q ^ 2, h⟩
  exact Prime.dvd_of_dvd_pow Int.prime_two h2

/-- [11J72.1.3] Sostituendo p = 2k in p² = 2q² si ottiene q² = 2k². -/
lemma q_sq_eq_two_mul_sq {p q k : ℤ} (h : p ^ 2 = 2 * q ^ 2) (hk : p = 2 * k) :
    q ^ 2 = 2 * k ^ 2 := by
  linarith [show p ^ 2 = 4 * k ^ 2 by rw [hk]; ring]

/-- [11J72.2] Contraddizione di parità sugli esponenti 2-adici in ℕ. -/
theorem two_adic_parity_contradiction (a b : ℕ) : 2 * a ≠ 2 * b + 1 := by
  omega

/-- [11J72.2.3] Irrazionalità di √2 dedotta da `Nat.Prime.irrational_sqrt`. -/
theorem sqrt2_irrational_via_prime : Irrational (Real.sqrt 2) :=
  Nat.Prime.irrational_sqrt Nat.prime_two

/-- [11J72.3] Identità algebrica della discesa geometrica di Tennenbaum. -/
theorem tennenbaum_descent_identity (p q : ℤ) (h : p ^ 2 = 2 * q ^ 2) :
    (2 * q - p) ^ 2 = 2 * (p - q) ^ 2 := by
  calc (2 * q - p) ^ 2
    _ = 4 * q ^ 2 - 4 * p * q + p ^ 2 := by ring
    _ = 4 * q ^ 2 - 4 * p * q + 2 * q ^ 2 := by rw [h]
    _ = 2 * (2 * q ^ 2 - 2 * p * q + q ^ 2) := by ring
    _ = 2 * (p ^ 2 - 2 * p * q + q ^ 2) := by rw [← h]
    _ = 2 * (p - q) ^ 2 := by ring

end Mathema.NumberTheory
