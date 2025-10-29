// lib/theme/validateTheme.ts
import type {
  ThemeTokens,
  ThemeTokensMulti,
  ThemeTokensSingle,
  ThemeColors,
  ThemeFont,
} from "@/types/theme";

function isString(x: any): x is string {
  return typeof x === "string";
}
function isNumber(x: any): x is number {
  return typeof x === "number" && !Number.isNaN(x);
}

export function isThemeColors(x: any): x is ThemeColors {
  return (
    x &&
    isString(x.bg) &&
    isString(x.surface) &&
    isString(x.text) &&
    isString(x.textMuted) &&
    isString(x.primary) &&
    isString(x.primaryContrast) &&
    isString(x.border)
  );
}

export function isThemeFont(x: any): x is ThemeFont {
  return (
    x &&
    isString(x.family) &&
    isNumber(x.weightRegular) &&
    isNumber(x.weightMedium) &&
    isNumber(x.weightBold) &&
    isString(x.sizeBody) &&
    isString(x.sizeH1) &&
    isString(x.sizeH2) &&
    isString(x.sizeH3) &&
    isNumber(x.lineHeight)
  );
}

export function isThemeSingle(x: any): x is ThemeTokensSingle {
  return (
    x &&
    isString(x?.name) &&
    isThemeFont(x?.font) &&
    isString(x?.radius) &&
    isNumber(x?.spacing) &&
    isThemeColors(x?.colors)
  );
}

export function isThemeMulti(x: any): x is ThemeTokensMulti {
  const m = x?.modes;
  return (
    x &&
    isString(x?.name) &&
    isThemeFont(x?.font) &&
    isString(x?.radius) &&
    isNumber(x?.spacing) &&
    m &&
    isThemeColors(m?.light?.colors) &&
    isThemeColors(m?.dark?.colors)
  );
}

export function isThemeTokens(x: any): x is ThemeTokens {
  return isThemeSingle(x) || isThemeMulti(x);
}
