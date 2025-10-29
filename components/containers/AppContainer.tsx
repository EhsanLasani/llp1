"use client";

/**
 * AppContainer (v2)
 * - Loads Carbon CSS + your globals.scss once
 * - Loads theme tokens from URL (/themes.json or CMS)
 * - Resolves theme by name + mode (light/dark/system)
 * - Publishes CSS variables (including Carbon mappings)
 * - Sets --app-header-height so fixed header spacing works
 */

import "@carbon/styles/css/styles.css";
import "@/app/globals.scss";

import React, { ReactNode, useEffect } from "react";
import {
  loadThemesFromUrl,
  resolveThemeByName,
  getSystemMode,
  onSystemModeChange,
} from "@/lib/theme/loader";
import { applyCSSVariables } from "@/lib/theme/adapter";

type ThemeMode = "light" | "dark" | "system";

export default function AppContainer({
  children,
  themeUrl = "/themes.json", // combined JSON with your themes
  themeName = "apple", // "apple" | "fluent" | "material"
  themeMode: modeProp = "light", // "light" | "dark" | "system"
  headerHeight = 56, // px
}: {
  children: ReactNode;
  themeUrl?: string;
  themeName?: string;
  themeMode?: ThemeMode;
  headerHeight?: number;
}) {
  // keep header spacing consistent for fixed header
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--app-header-height",
      `${headerHeight}px`
    );
  }, [headerHeight]);

  // load + apply theme
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    async function apply(mode: "light" | "dark") {
      const resolved = await resolveThemeByName(themeName, mode, {
        fallbackUrl: themeUrl,
      });
      if (!cancelled && resolved) {
        applyCSSVariables(resolved);
        // persist last chosen theme name (optional)
        localStorage.setItem("theme:name", themeName);
        localStorage.setItem("theme:mode", modeProp);
      }
    }

    async function init() {
      // Ensure registry has themes
      await loadThemesFromUrl(themeUrl).catch(() => {});

      const system = getSystemMode();
      const effective =
        modeProp === "system" ? system : (modeProp as "light" | "dark");

      await apply(effective);

      // react to OS changes if in system mode
      if (modeProp === "system") {
        unsubscribe = onSystemModeChange(async (m) => {
          await apply(m);
        });
      }
    }

    init();
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [themeUrl, themeName, modeProp]);

  return <>{children}</>;
}
