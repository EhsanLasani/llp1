// lib/theme/registry.ts
import type {
  ThemeName,
  ThemeTokens,
  ResolvedTheme,
  ThemeTokensSingle,
  ThemeTokensMulti,
  ThemeMode,
} from "@/types/theme";
import { isThemeTokens } from "./validateTheme";

const REGISTRY = new Map<ThemeName, ThemeTokens>();

export function registerTheme(tokens: ThemeTokens): void {
  if (!isThemeTokens(tokens)) {
    throw new Error("Invalid theme tokens");
  }
  REGISTRY.set(tokens.name, tokens);
}

export function registerThemes(themes: ThemeTokens[]): void {
  themes.forEach(registerTheme);
}

export function getTheme(name: ThemeName): ThemeTokens | undefined {
  return REGISTRY.get(name);
}

export function getAllThemes(): ThemeTokens[] {
  return [...REGISTRY.values()];
}

/**
 * Merge a ThemeTokens into a runtime ResolvedTheme.
 * If the theme is multi-mode, select and merge the given mode.
 */
export function resolveTheme(
  tokens: ThemeTokens,
  mode: ThemeMode = "light"
): ResolvedTheme {
  if (isMulti(tokens)) {
    const base = pickBase(tokens);
    const m = tokens.modes[mode];
    return {
      ...base,
      colors: m.colors,
      shadowSm: m.shadowSm ?? base.shadowSm,
      shadowMd: m.shadowMd ?? base.shadowMd,
      shadowLg: m.shadowLg ?? base.shadowLg,
    };
  }
  // single-mode
  return {
    name: tokens.name,
    font: tokens.font,
    radius: tokens.radius,
    spacing: tokens.spacing,
    shadowSm: tokens.shadowSm,
    shadowMd: tokens.shadowMd,
    shadowLg: tokens.shadowLg,
    colors: tokens.colors,
  };
}

function isMulti(x: ThemeTokens): x is ThemeTokensMulti {
  return (x as ThemeTokensMulti).modes !== undefined;
}

function pickBase(x: ThemeTokensSingle | ThemeTokensMulti) {
  // Return the base (shared) non-color fields
  const { name, font, radius, spacing, shadowSm, shadowMd, shadowLg } = x;
  return { name, font, radius, spacing, shadowSm, shadowMd, shadowLg };
}
