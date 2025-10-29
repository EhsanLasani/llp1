// lib/theme/adapter.ts
import type { ResolvedTheme } from "@/types/theme";

/**
 * Publish resolved theme tokens into CSS variables.
 * Also maps key colors to Carbon CSS variables so Carbon components follow.
 */
export function applyCSSVariables(tokens: ResolvedTheme) {
  const r = document.documentElement;

  // mark active theme for debugging/hooks
  r.setAttribute("data-theme", tokens.name);

  // App variables (consumed by globals.scss)
  r.style.setProperty("--app-bg", tokens.colors.bg);
  r.style.setProperty("--app-surface", tokens.colors.surface);
  r.style.setProperty("--app-text", tokens.colors.text);
  r.style.setProperty("--app-text-muted", tokens.colors.textMuted);
  r.style.setProperty("--app-primary", tokens.colors.primary);
  r.style.setProperty("--app-primary-contrast", tokens.colors.primaryContrast);
  r.style.setProperty("--app-border", tokens.colors.border);
  r.style.setProperty(
    "--app-link",
    tokens.colors.link ?? tokens.colors.primary
  );
  if (tokens.colors.overlay)
    r.style.setProperty("--app-overlay", tokens.colors.overlay);

  r.style.setProperty("--app-font-family", tokens.font.family);
  r.style.setProperty("--app-fs-body", tokens.font.sizeBody);
  r.style.setProperty("--app-fs-h1", tokens.font.sizeH1);
  r.style.setProperty("--app-fs-h2", tokens.font.sizeH2);
  r.style.setProperty("--app-fs-h3", tokens.font.sizeH3);
  r.style.setProperty("--app-line", String(tokens.font.lineHeight));
  r.style.setProperty("--app-fw-regular", String(tokens.font.weightRegular));
  r.style.setProperty("--app-fw-medium", String(tokens.font.weightMedium));
  r.style.setProperty("--app-fw-bold", String(tokens.font.weightBold));

  r.style.setProperty("--app-radius", tokens.radius);
  r.style.setProperty("--app-space", `${tokens.spacing}px`);
  if (tokens.shadowSm) r.style.setProperty("--app-shadow-sm", tokens.shadowSm);
  if (tokens.shadowMd) r.style.setProperty("--app-shadow-md", tokens.shadowMd);
  if (tokens.shadowLg) r.style.setProperty("--app-shadow-lg", tokens.shadowLg);

  // Map to Carbon so components adopt theme automatically
  r.style.setProperty("--cds-background", tokens.colors.bg);
  r.style.setProperty("--cds-layer", tokens.colors.surface);
  r.style.setProperty("--cds-text-primary", tokens.colors.text);
  r.style.setProperty("--cds-text-secondary", tokens.colors.textMuted);
  r.style.setProperty(
    "--cds-link-primary",
    tokens.colors.link ?? tokens.colors.primary
  );
}
