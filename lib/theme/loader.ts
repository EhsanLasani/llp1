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
export async function resolveThemeByName(
  name: ThemeName,
  mode: ThemeMode = "light",
  options?: { fallbackUrl?: string }
): Promise<ResolvedTheme | undefined> {
  let t = getTheme(name);
  if (!t && options?.fallbackUrl) {
    const loaded = await loadThemesFromUrl(options.fallbackUrl);
    t = loaded.find((x) => x.name === name);
  }
  return t ? mergeTheme(t, mode) : undefined;
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
