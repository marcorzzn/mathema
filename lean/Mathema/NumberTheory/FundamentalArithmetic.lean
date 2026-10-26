/-
Copyright (c) 2026 Marco Razzano. All rights reserved.
Released under Apache 2.0 license.
MSC2020: 11A51 — Factorization; Fundamental Theorem of Arithmetic
-/
import Mathlib.Data.Nat.Prime.Basic
import Mathlib.Data.Nat.Factors
import Mathlib.Tactic.Ring

namespace Mathema.NumberTheory

/-- [11A51.0] Lemma di Euclide: se un primo p divide a * b, allora p divide a oppure p divide b. -/
theorem mathema_euclid_lemma {p a b : ℕ} (hp : p.Prime) (h : p ∣ a * b) :
    p ∣ a ∨ p ∣ b :=
  hp.dvd_mul.mp h

/-- [11A51.0.2] Se p è coprimo con a e divide a * b, allora p divide b. -/
theorem dvd_of_coprime_of_dvd_mul {p a b : ℕ} (hcop : p.Coprime a) (hdvd : p ∣ a * b) :
    p ∣ b :=
  hcop.dvd_of_dvd_mul_left hdvd

/-- [11A51.1] Esistenza della fattorizzazione in primi per ogni n ≠ 0. -/
theorem mathema_primeFactorsList_prod {n : ℕ} (hn : n ≠ 0) :
    n.primeFactorsList.prod = n :=
  Nat.prod_primeFactorsList hn

/-- [11A51.1] Unicità della fattorizzazione in primi a meno di permutazioni. -/
theorem mathema_primeFactorsList_unique {n : ℕ} {l : List ℕ}
    (hprod : l.prod = n) (hprime : ∀ p ∈ l, p.Prime) :
    l ~ n.primeFactorsList :=
  Nat.primeFactorsList_unique hprod hprime

/-- [11A51.1.3] Cancellazione di un fattore primo comune p > 0. -/
theorem cancel_prime_factor {p a b : ℕ} (hp : p.Prime) (h : p * a = p * b) : a = b :=
  Nat.eq_of_mul_eq_mul_left hp.pos h

/-- [11A51.2] Passo algebrico di discesa diretta di Zermelo. -/
theorem zermelo_descent_step (n p₁ q₁ Q : ℤ) (hq : n = q₁ * Q) :
    n - p₁ * Q = (q₁ - p₁) * Q := by
  rw [hq]; ring

end Mathema.NumberTheory
