// lib/theme/loader.ts
import type {
  ThemeTokens,
  ThemeName,
  ThemeMode,
  ResolvedTheme,
} from "@/types/theme";
import {
  registerThemes,
  getTheme,
  resolveTheme as mergeTheme,
} from "./registry";
import { isThemeTokens } from "./validateTheme";

/**
 * Load themes from a URL.
 * Accepts either:
 * - an array of ThemeTokens
 * - an object: { themes: ThemeTokens[] }
 */
export async function loadThemesFromUrl(url: string): Promise<ThemeTokens[]> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Theme fetch failed: ${res.status}`);
  const data = await res.json();
  const themes: unknown = Array.isArray(data) ? data : data?.themes;
  if (!Array.isArray(themes)) return [];
  const valid = themes.filter(isThemeTokens) as ThemeTokens[];
  registerThemes(valid);
  return valid;
}

/**
 * Resolve a theme by name + mode.
 * If not in registry and a fallbackUrl is provided, try loading and resolve again.
 */

import { deriveDarkPalette } from "./derive";
// ...
export async function resolveThemeByName(
  name: string,
  mode: "light" | "dark" | "system",
  opts?: { fallbackUrl?: string }
) {
  // load themes.json → find theme
  // const theme = { light: Palette, dark?: Palette, ... }

  const effective = mode === "system" ? getSystemMode() : mode;
  const base =
    effective === "dark"
      ? theme.dark ?? deriveDarkPalette(theme.light)
      : theme.light;

  return {
    ...theme,
    ...base, // palette fields
    mode: effective,
    name,
  };
}
/**
 * Utility to detect system dark mode.
 */
export function getSystemMode(): ThemeMode {
  if (typeof window === "undefined") return "light";
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Subscribe to system mode changes.
 * Returns an unsubscribe function.
 */
export function onSystemModeChange(cb: (mode: ThemeMode) => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = (e: MediaQueryListEvent) => cb(e.matches ? "dark" : "light");
  mq.addEventListener?.("change", handler);
  return () => mq.removeEventListener?.("change", handler);
}
