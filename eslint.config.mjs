// eslint-config-next ≥16 ships native flat configs — no FlatCompat needed.
import coreWebVitals from "eslint-config-next/core-web-vitals"
import typescript from "eslint-config-next/typescript"

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      ".claude/**",
      "scripts/**",
      // Obsidian vault + docs + scratch — not app code
      ".obsidian/**",
      "_docs/**",
      "Portfolio/**",
      "_tmp_*",
      "dev-output.txt",
      // shadcn/v0 scaffold — not hand-maintained
      "components/ui/**",
      "**/*.figma.tsx",
    ],
  },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // Correctness is tsc's job; keep lint signal high.
      "@typescript-eslint/no-explicit-any": "warn",
      // Apostrophes/quotes in prose copy — cosmetic, renders fine.
      "react/no-unescaped-entities": "warn",
      // React-Compiler-era strictness. These flag long-standing intentional
      // patterns here (matchMedia init-sync in effects, latest-value ref
      // mirrors, Math.random particle seeds in useMemo). Warnings, not errors.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
    },
  },
]

export default eslintConfig
