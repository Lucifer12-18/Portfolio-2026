/**
 * tailwind.config.ts — Pixelogic OS
 *
 * This project uses Tailwind CSS v4 (CSS-first configuration).
 * The canonical theme lives in styles/globals.css via @theme inline blocks.
 *
 * This file exists for:
 *   1. IDE autocompletion in editors that still read tailwind.config.*
 *   2. Plugins that require a JS config entry point
 *   3. A human-readable record of all custom theme extensions
 *
 * To activate this file in v4, add to globals.css:
 *   @config './tailwind.config.ts';
 *
 * Design token source of truth: lib/tokens.json
 */

import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./contexts/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      // ─── Colors (mapped from CSS variables in globals.css) ──────────────────
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",

        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },

        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },

        // Chapter accent palette (used for gradient overlays and section spotlights)
        chapter: {
          prologue: "rgb(34, 211, 238)",    // Chapter 0
          origin:   "rgb(6, 182, 212)",     // Chapter 1
          shift:    "rgb(124, 58, 237)",    // Chapter 2
          method:   "rgb(167, 139, 250)",   // Chapter 3
          work:     "rgb(56, 189, 248)",    // Chapter 4
          notes:    "rgb(147, 197, 253)",   // Chapter 5
          epilogue: "rgb(224, 249, 255)",   // Chapter 6
        },
      },

      // ─── Border radius ────────────────────────────────────────────────────
      borderRadius: {
        sm:  "calc(var(--radius) - 4px)",
        md:  "calc(var(--radius) - 2px)",
        lg:  "var(--radius)",
        xl:  "calc(var(--radius) + 4px)",
      },

      // ─── Font families ────────────────────────────────────────────────────
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
        display: ["'Press Start 2P'", "monospace"],
      },

      // ─── Max widths ───────────────────────────────────────────────────────
      maxWidth: {
        "case-study": "56rem",   // max-w-4xl — used on all case study pages
      },

      // ─── Animation ────────────────────────────────────────────────────────
      keyframes: {
        "page-flip-in": {
          "0%":   { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "page-flip-out": {
          "0%":   { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-18px)" },
        },
        "status-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0.4" },
        },
      },
      animation: {
        "page-flip-in":  "page-flip-in 0.35s cubic-bezier(0.16,1,0.3,1)",
        "page-flip-out": "page-flip-out 0.2s cubic-bezier(0.55,0.06,0.68,0.19)",
        "status-pulse":  "status-pulse 2s ease-in-out infinite",
      },
    },
  },

  plugins: [],
}

export default config
