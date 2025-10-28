// lib/theme-config.ts
export const THEME_OPTIONS = [
  "carbon-g10", "carbon-g90", "material-light", "material-dark", "fluent-light", "fluent-dark", "uber-dark", "apple-light"
];
export const CARBON_THEME_MAP = {
  "carbon-g10": "g10",
  "carbon-g90": "g90",
  "material-light": "g10",
  "material-dark": "g90",
  "fluent-light": "g10",
  "fluent-dark": "g90",
  "uber-dark": "g90",
  "apple-light": "g10"
};
export function mapThemeToCarbon(themeId) {
  return CARBON_THEME_MAP[themeId] ?? "g10";
}
