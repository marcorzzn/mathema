/-
Copyright (c) 2026 Marco Razzano. All rights reserved.
Released under Apache 2.0 license.
MSC2020: 11A41 — Primes and Infinitude of Primes
-/
import Mathlib.Data.Nat.Prime.Basic
import Mathlib.Data.Nat.Prime.Infinite
import Mathlib.Data.Nat.Factorial.Basic
import Mathlib.Tactic.Ring

namespace Mathema.NumberTheory

/-- [11A41.0] Esistenza di un divisore primo per ogni n ≠ 1. -/
theorem mathema_exists_prime_dvd {n : ℕ} (hn : n ≠ 1) :
    ∃ p : ℕ, p.Prime ∧ p ∣ n :=
  Nat.exists_prime_and_dvd hn

/-- [11A41.1] Teorema di Euclide: per ogni soglia n esiste un numero primo p ≥ n. -/
theorem mathema_exists_infinite_primes (n : ℕ) : ∃ p ≥ n, Nat.Prime p :=
  Nat.exists_infinite_primes n

/-- [11A41.1.1] Il numero di Euclide n! + 1 è diverso da 1. -/
lemma euclid_number_ne_one (n : ℕ) : n.factorial + 1 ≠ 1 := by
  have hpos : 0 < n.factorial := Nat.factorial_pos n
  omega

/-- [11A41.1.2] Il minimo divisore maggiore di 1 di n! + 1 è primo e divide n! + 1. -/
lemma euclid_minFac_prime_and_dvd (n : ℕ) :
    (n.factorial + 1).minFac.Prime ∧ (n.factorial + 1).minFac ∣ n.factorial + 1 :=
  ⟨Nat.minFac_prime (euclid_number_ne_one n), Nat.minFac_dvd (n.factorial + 1)⟩

/-- [11A41.1.3] Nessun primo p ≤ n può dividere n! + 1. -/
lemma not_le_of_dvd_factorial_succ {n p : ℕ} (hp : p.Prime) (hdvd : p ∣ n.factorial + 1) :
    ¬ (p ≤ n) := by
  intro hle
  have h1 : p ∣ n.factorial := Nat.dvd_factorial hp.pos hle
  have h2 : p ∣ 1 := (Nat.dvd_add_right h1).mp hdvd
  exact hp.not_dvd_one h2

/-- [11A41.2] Numeri di Fermat Fₙ = 2^(2ⁿ) + 1. -/
def fermatNumber (n : ℕ) : ℕ := 2 ^ (2 ^ n) + 1

/-- [11A41.2.1] Identità della differenza di quadrati per il passo induttivo sui numeri di Fermat. -/
theorem fermat_diff_squares (x : ℤ) : (x - 1) * (x + 1) = x ^ 2 - 1 := by
  ring

end Mathema.NumberTheory
