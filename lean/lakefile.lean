import Lake
open Lake DSL

package «mathema» where
  leanOptions := #[
    ⟨`pp.unicode.fun, true⟩,
    ⟨`autoImplicit, false⟩
  ]

require mathlib from git
  "https://github.com/leanprover-community/mathlib4.git" @ "v4.15.0"

@[default_target]
lean_lib «Mathema» where
  globs := #[.submodules `Mathema]
