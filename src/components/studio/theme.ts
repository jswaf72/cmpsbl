import type { CSSProperties } from "react";
import type { NodeCategory } from "./types";

/**
 * Studio theming system.
 *
 * The app was originally styled with hardcoded dark hex values inline. This
 * module centralizes every "chrome" color (backgrounds, surfaces, borders,
 * text, accents) into a small set of semantic tokens with dark / light / print
 * palettes. Component inline styles reference these as CSS variables
 * (e.g. `var(--studio-bg)`), and the variables are injected onto the studio
 * root container via `cssVars(mode)`.
 *
 * Data-type colors (types.ts) and node-category colors (nodeTemplates.ts) are
 * intentionally NOT tokenized — they are semantic and stay vivid across themes.
 */

export type ThemeMode = "dark" | "light" | "print";

export interface StudioPalette {
  bg: string; // deepest canvas background
  surface: string; // panels: toolbar, sidebar, inspector
  node: string; // node card background
  border: string; // hairline borders / dividers
  grid: string; // canvas dot grid
  text: string; // primary text
  textMuted: string; // secondary text / labels
  textDim: string; // tertiary text
  textFaint: string; // faint icons / helper text
  faint: string; // near-invisible placeholder text
  accent: string; // primary interactive (selection, focus)
  accentSoft: string; // softer accent (project chips, group headers)
  accent2: string; // secondary accent (logo gradient end)
  success: string; // valid state
  error: string; // invalid / destructive
  hover: string; // neutral hover wash
}

export const THEMES: Record<ThemeMode, StudioPalette> = {
  // Dark values match the original design 1:1 (zero visual regression).
  dark: {
    bg: "#0d0f14",
    surface: "#13161f",
    node: "#1a1f2e",
    border: "#1f2535",
    grid: "#1e2330",
    text: "#e2e8f0",
    textMuted: "#94a3b8",
    textDim: "#64748b",
    textFaint: "#475569",
    faint: "#334155",
    accent: "#3b82f6",
    accentSoft: "#7dd3fc",
    accent2: "#8b5cf6",
    success: "#22c55e",
    error: "#ef4444",
    hover: "rgba(255,255,255,0.06)",
  },
  // Light working theme — comfortable for daytime / product reviews.
  light: {
    bg: "#f4f6fb",
    surface: "#ffffff",
    node: "#ffffff",
    border: "#e2e8f0",
    grid: "#dbe2ee",
    text: "#0f172a",
    textMuted: "#475569",
    textDim: "#64748b",
    textFaint: "#94a3b8",
    faint: "#cbd5e1",
    accent: "#2563eb",
    accentSoft: "#0369a1",
    accent2: "#7c3aed",
    success: "#16a34a",
    error: "#dc2626",
    hover: "rgba(15,23,42,0.05)",
  },
  // Print / high-contrast theme — for exporting or presenting system diagrams
  // to stakeholders on white. Stronger borders, near-black text.
  print: {
    bg: "#ffffff",
    surface: "#ffffff",
    node: "#ffffff",
    border: "#94a3b8",
    grid: "#d1d5db",
    text: "#000000",
    textMuted: "#1f2937",
    textDim: "#374151",
    textFaint: "#6b7280",
    faint: "#9ca3af",
    accent: "#1d4ed8",
    accentSoft: "#1e40af",
    accent2: "#6d28d9",
    success: "#15803d",
    error: "#b91c1c",
    hover: "rgba(0,0,0,0.05)",
  },
};

const TOKEN_MAP: Record<keyof StudioPalette, string> = {
  bg: "--studio-bg",
  surface: "--studio-surface",
  node: "--studio-node",
  border: "--studio-border",
  grid: "--studio-grid",
  text: "--studio-text",
  textMuted: "--studio-text-muted",
  textDim: "--studio-text-dim",
  textFaint: "--studio-text-faint",
  faint: "--studio-faint",
  accent: "--studio-accent",
  accentSoft: "--studio-accent-soft",
  accent2: "--studio-accent2",
  success: "--studio-success",
  error: "--studio-error",
  hover: "--studio-hover",
};

/** CSS custom properties for the given theme, to spread onto the root container's style. */
export function cssVars(mode: ThemeMode): CSSProperties {
  const palette = THEMES[mode];
  const vars: Record<string, string> = {};
  (Object.keys(TOKEN_MAP) as (keyof StudioPalette)[]).forEach((key) => {
    vars[TOKEN_MAP[key]] = palette[key];
  });
  return vars as CSSProperties;
}

export const THEME_LABELS: Record<ThemeMode, string> = {
  dark: "Dark",
  light: "Light",
  print: "Print",
};

export const THEME_ORDER: ThemeMode[] = ["dark", "light", "print"];

/**
 * Lenses are OPTIONAL focus filters. The default lens ("all") hides nothing —
 * the app stays maximally flexible for building any composable structure,
 * music included. Selecting a focus lens narrows the palette to the categories
 * relevant to a given kind of work, without removing anything permanently.
 */
export type Lens = "all" | "system" | "product" | "music";

export interface LensDef {
  label: string;
  description: string;
  /** If provided, ONLY these categories are shown. If omitted, all are shown. */
  only?: NodeCategory[];
}

export const LENSES: Record<Lens, LensDef> = {
  all: {
    label: "All",
    description: "Everything — full flexibility for any composable structure.",
  },
  system: {
    label: "System Design",
    description: "Architecture, infrastructure, data flow, and process building blocks.",
    only: [
      "Transformations",
      "Inputs",
      "Outputs",
      "Utilities",
      "Logic",
      "Data",
      "State",
      "Network and IO",
      "Process",
      "Infrastructure",
      "AI and ML",
      "Aggregations",
      "Monitoring",
    ],
  },
  product: {
    label: "Product Design",
    description: "Atomic-design UI building blocks, from tokens up to pages.",
    only: [
      "UI Templates / Design Tokens",
      "UI Templates / Atoms",
      "UI Templates / Molecules",
      "UI Templates / Organisms",
      "UI Templates / Templates",
      "UI Templates / Pages",
    ],
  },
  music: {
    label: "Music",
    description: "Music as a composable system — notes, chords, rhythm, audio.",
    only: ["Music"],
  },
};

export const LENS_ORDER: Lens[] = ["all", "system", "product", "music"];
