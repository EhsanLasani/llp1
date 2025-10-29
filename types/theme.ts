// types/theme.ts
// Unified theme token model (supports single-mode and multi-mode themes)

export type ThemeName =
  | "apple"
  | "fluent"
  | "material"
  | "carbon"
  | "lasaniLight"
  | "lasaniDark"
  | string;

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  bg: string; // page background
  surface: string; // cards/layers
  text: string; // primary text
  textMuted: string; // secondary text
  primary: string; // brand/action
  primaryContrast: string; // text on primary
  border: string; // dividers
  link?: string; // hyperlinks (defaults to primary)
  overlay?: string; // acrylic/glass overlays
}

export interface ThemeFont {
  family: string;
  weightRegular: number;
  weightMedium: number;
  weightBold: number;
  sizeBody: string; // e.g. "clamp(14px, 1.05vw, 16px)"
  sizeH1: string;
  sizeH2: string;
  sizeH3: string;
  lineHeight: number;
  letterSpacing?: number;
}

export interface ThemeTokensBase {
  name: ThemeName;
  font: ThemeFont;
  radius: string; // e.g. "12px"
  spacing: number; // base unit in px
  shadowSm?: string;
  shadowMd?: string;
  shadowLg?: string;
}

export interface ThemeTokensSingle extends ThemeTokensBase {
  // Single-mode theme (no "modes" field)
  colors: ThemeColors;
}

export interface ThemeTokensMulti extends ThemeTokensBase {
  // Multi-mode theme (Material light/dark in one file)
  modes: {
    light: { colors: ThemeColors } & Partial<
      Pick<ThemeTokensBase, "shadowSm" | "shadowMd" | "shadowLg">
    >;
    dark: { colors: ThemeColors } & Partial<
      Pick<ThemeTokensBase, "shadowSm" | "shadowMd" | "shadowLg">
    >;
  };
}

export type ThemeTokens = ThemeTokensSingle | ThemeTokensMulti;

// A resolved/merged theme used at runtime (always has colors)
export type ResolvedTheme = ThemeTokensBase & { colors: ThemeColors };
